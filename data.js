// ============================================================
// CHARGEMENT DES DONNÉES — le site n'a AUCUNE donnée codée en dur.
// Tout (grades, crafts, nouveautés, fonctionnalités, commandes,
// galerie, FAQ, évènement, IP du serveur) vient exclusivement du
// Worker Cloudflare / base KV, éditée depuis /admin.html.
//
// Tant que ces données n'ont pas été récupérées, l'écran de
// chargement (voir loader.js) reste affiché — le site ne s'ouvre
// jamais avec un contenu par défaut ou obsolète.
// ============================================================

// ============================================================
// URL DU BACKEND — le site est hébergé sur GitHub Pages, le backend
// (API + KV) tourne sur un Cloudflare Worker séparé. Remplace la
// valeur ci-dessous par l'URL de TON Worker une fois déployé
// (Cloudflare te la donne, ex: https://wellcraft-api.tonpseudo.workers.dev).
// ============================================================
window.API_BASE = "https://wellcraft.capkychannel.workers.dev";

window.SITE_DATA_READY = false;
const _siteDataListeners = [];
const _siteDataErrorListeners = [];

window.onSiteDataReady = function (callback) {
  _siteDataListeners.push(callback);
  if (window.SITE_DATA_READY) callback(window.SITE_DATA);
};

// Appelé si le chargement échoue (Worker injoignable, KV pas encore
// initialisée...). Sert à afficher un état d'erreur dans loader.js.
window.onSiteDataError = function (callback) {
  _siteDataErrorListeners.push(callback);
};

function _applySiteData(data) {
  window.SITE_DATA = data;
  window.SERVER_IP = data.serverIp;
  window.GRADES = data.grades;
  window.NEWS = data.news;
  window.CRAFTS = data.crafts;
  window.FEATURES = data.features;
  window.COMMANDS = data.commands;
  window.GALLERY = data.gallery;
  window.FAQS = data.faqs;
  window.NEXT_EVENT = data.nextEvent;
  window.NEXT_EVENT_LABEL = data.nextEventLabel;
  window.MAP_URL = data.mapUrl || "";
  window.SITE_DATA_READY = true;
  _siteDataListeners.forEach(cb => cb(window.SITE_DATA));
}

async function _loadSiteData() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${window.API_BASE}/api/data`, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeout);

    if (res.status === 404) {
      // Le Worker répond mais la base KV est vide : personne n'a encore
      // sauvegardé depuis /admin.html.
      throw new Error('no_data');
    }
    if (!res.ok) throw new Error('api_error');

    const data = await res.json();
    _applySiteData(data);
  } catch (e) {
    clearTimeout(timeout);
    const reason = e && e.message === 'no_data' ? 'no_data' : 'unreachable';
    console.warn(`[WellCraft] Impossible de charger les données (${reason}).`);
    _siteDataErrorListeners.forEach(cb => cb(reason));
  }
}

// Permet à l'écran de chargement de relancer une tentative (bouton "Réessayer").
window.retrySiteData = _loadSiteData;

_loadSiteData();
