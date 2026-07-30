// ============================================================
// COMPTE.JS — liaison de compte WellCraft + boutique payée en argent en jeu.
//
// IMPORTANT — CONFIGURATION REQUISE :
// Ceci parle à l'API embarquée dans le PLUGIN Minecraft (voir SiteApiServer.java côté serveur),
// PAS au Worker Cloudflare de window.API_BASE (qui ne gère que le contenu du site : grades,
// news, etc.). Il s'agit d'une API totalement différente, à héberger toi-même.
//
// Cette API tourne en HTTP simple sur le serveur de jeu (site.api-port dans config.yml, 28016
// par défaut) — un site en HTTPS (donc presque à coup sûr le tien) ne peut PAS l'appeler
// directement (le navigateur bloque ces appels "contenu mixte" par sécurité). Il faut un
// reverse-proxy avec un certificat valide sur un sous-domaine, par exemple avec Caddy
// (génère le certificat automatiquement) :
//
//     api.tondomaine.fr {
//         reverse_proxy 127.0.0.1:28016
//     }
//
// Remplace ensuite la valeur ci-dessous par l'URL de CE sous-domaine.
// ============================================================
window.ACCOUNT_API_BASE = "https://api.tondomaine.fr";

(function () {
  const STORAGE_KEY = "wellcraft_account";

  function getSession() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
    catch (e) { return null; }
  }
  function setSession(session) { localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); }
  function clearSession() { localStorage.removeItem(STORAGE_KEY); }

  async function api(path, options = {}) {
    const res = await fetch(`${window.ACCOUNT_API_BASE}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "unknown_error");
    return data;
  }

  const loginSection = document.getElementById("account-login");
  const dashboardSection = document.getElementById("account-dashboard");
  const linkForm = document.getElementById("link-form");
  const linkCodeInput = document.getElementById("link-code-input");
  const linkError = document.getElementById("link-error");
  const shopGrid = document.getElementById("shop-grid");
  const shopError = document.getElementById("shop-error");

  function showLogin() {
    loginSection.hidden = false;
    dashboardSection.hidden = true;
  }

  function showDashboard(account) {
    loginSection.hidden = true;
    dashboardSection.hidden = false;
    document.getElementById("account-skin").src = `https://mc-heads.net/avatar/${account.uuid}/100`;
    document.getElementById("account-name").textContent = account.name;
    document.getElementById("account-balance").textContent = account.balanceFormatted;
  }

  function friendlyError(code) {
    return {
      invalid_or_expired_code: "Code invalide ou expiré — retape /site en jeu pour en avoir un nouveau.",
      invalid_token: "Session expirée, reconnecte-toi.",
      insufficient_funds: "Tu n'as pas assez d'argent en jeu pour cet achat.",
      item_not_found: "Cet article n'existe plus.",
      server_error: "Le serveur n'a pas pu traiter la demande — réessaie plus tard."
    }[code] || "Une erreur est survenue — le site n'arrive peut-être pas à joindre le serveur Minecraft.";
  }

  // ── Liaison du compte ──────────────────────────────────

  linkForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    linkError.hidden = true;
    const code = linkCodeInput.value.trim();
    if (!code) return;

    try {
      const data = await api("/link", { method: "POST", body: JSON.stringify({ code }) });
      setSession({ token: data.token, uuid: data.uuid, name: data.name });
      await refreshAccount();
    } catch (err) {
      linkError.textContent = friendlyError(err.message);
      linkError.hidden = false;
    }
  });

  document.getElementById("account-logout")?.addEventListener("click", async () => {
    const session = getSession();
    clearSession();
    showLogin();
    if (session?.token) {
      try { await api("/unlink", { method: "POST", body: JSON.stringify({ token: session.token }) }); }
      catch (e) { /* déconnexion locale déjà faite, tant pis si l'appel échoue */ }
    }
  });

  // ── Compte + boutique ──────────────────────────────────

  async function refreshAccount() {
    const session = getSession();
    if (!session?.token) { showLogin(); return; }

    try {
      const account = await api(`/account?token=${encodeURIComponent(session.token)}`);
      showDashboard(account);
      await loadShop(session.token);
    } catch (err) {
      // Token invalide/expiré → on force une reconnexion propre
      clearSession();
      showLogin();
    }
  }

  async function loadShop(token) {
    shopError.hidden = true;
    shopGrid.innerHTML = `<p class="shop-loading">Chargement…</p>`;
    try {
      const data = await api(`/shop?token=${encodeURIComponent(token)}`);
      renderShop(data);
    } catch (err) {
      shopGrid.innerHTML = "";
      shopError.textContent = friendlyError(err.message);
      shopError.hidden = false;
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function renderShop(data) {
    const items = (data.categories || []).flatMap(cat =>
      cat.items.map(item => ({ ...item, categoryName: cat.name }))
    );
    if (!items.length) {
      shopGrid.innerHTML = `<p class="shop-empty">Aucun article disponible pour le moment.</p>`;
      return;
    }
    shopGrid.innerHTML = items.map(item => `
      <div class="shop-item" data-category="${item.categoryIndex}" data-slot="${item.gridSlot}">
        <!-- Icône best-effort (CDN tiers non garanti) — si l'image ne charge pas, on la masque
             simplement et le nom de l'article suffit ; ce n'est jamais bloquant. -->
        <img class="shop-item-icon" src="https://mc.nerothe.com/img/1.21/${item.material.toLowerCase()}.png"
             alt="" onerror="this.style.display='none'">
        <div class="shop-item-name">${escapeHtml(item.name)}</div>
        <div class="shop-item-category">${escapeHtml(item.categoryName)}</div>
        <button type="button" class="shop-item-buy" data-category="${item.categoryIndex}" data-slot="${item.gridSlot}">
          Acheter — ${item.price}
        </button>
      </div>
    `).join("");

    shopGrid.querySelectorAll(".shop-item-buy").forEach(btn => {
      btn.addEventListener("click", () => buyItem(btn.dataset.category, btn.dataset.slot, btn));
    });
  }

  async function buyItem(categoryIndex, gridSlot, btn) {
    const session = getSession();
    if (!session?.token) { showLogin(); return; }

    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = "…";

    try {
      const result = await api("/purchase", {
        method: "POST",
        body: JSON.stringify({
          token: session.token,
          categoryIndex: parseInt(categoryIndex, 10),
          gridSlot: parseInt(gridSlot, 10)
        })
      });
      document.getElementById("account-balance").textContent =
        new Intl.NumberFormat("fr-FR").format(result.newBalance);
      btn.textContent = "✔ Acheté !";
      setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 1500);
      // Rafraîchit le solde formaté correctement (avec le symbole/nom de la monnaie)
      refreshAccount();
    } catch (err) {
      alert(friendlyError(err.message));
      btn.textContent = originalText;
      btn.disabled = false;
    }
  }

  // ── Démarrage ────────────────────────────────────────

  onSiteDataReady(() => {
    refreshAccount();
  });
})();
