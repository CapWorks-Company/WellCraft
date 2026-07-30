// ============================================================
// DONNÉES DU SITE — TOUT le contenu modifiable est ici en un seul
// endroit (secours) : grades, crafts, nouveautés, fonctionnalités,
// commandes, galerie, FAQ, prochain évènement, IP du serveur.
//
// ⚠️ Pour éditer le contenu au quotidien, NE MODIFIE PAS ce fichier :
// ouvre /admin.html sur le site déployé. Les valeurs ci-dessous ne
// servent que de secours si l'API (Cloudflare KV) est indisponible,
// et de version de départ avant ta première sauvegarde depuis l'admin.
// ============================================================

// ============================================================
// URL DU BACKEND — le site est hébergé sur GitHub Pages, le backend
// (API + KV) tourne sur un Cloudflare Worker séparé. Remplace la
// valeur ci-dessous par l'URL de TON Worker une fois déployé
// (Cloudflare te la donne, ex: https://wellcraft-api.tonpseudo.workers.dev).
// ============================================================
window.API_BASE = "https://wellcraft-api.TON-COMPTE.workers.dev";

const DEFAULT_SITE_DATA = {
  serverIp: "wellcraft.mine.fun",

  grades: [
    {
      name: "Aucun",
      tier: "none",
      perks: [
        "Délai de téléportation : 5 secondes",
        "2 homes disponibles",
        "Cooldown de téléportation : 1 minute",
        "Mise maximum au coinflip : 10 000 Coins",
        "/heal indisponible",
        "/pub toutes les 7 jours",
        "/repair coûte 1 000 000 Coins"
      ]
    },
    {
      name: "WellPass",
      tier: "bronze",
      price: "",
      buyUrl: "#",
      perks: [
        "Délai de téléportation réduit à 4 secondes",
        "3 homes disponibles",
        "Cooldown de téléportation réduit à 45 secondes",
        "Claim bonus : +5",
        "Mise maximum au coinflip augmentée à 1 000 000 Coins",
        "/heal toutes les 24h",
        "/pub toutes les 24h",
        "/repair coûte 500 000 Coins"
      ]
    },
    {
      name: "WellPro",
      tier: "argent",
      price: "",
      buyUrl: "#",
      perks: [
        "Téléportation quasi instantanée (3 secondes)",
        "5 homes disponibles",
        "Cooldown de téléportation réduit à 25 secondes",
        "Claim bonus : +10",
        "Mise maximum au coinflip augmentée à 10 000 000 Coins",
        "/heal toutes les 5h",
        "Enderchest portable : /enderchest depuis n'importe où",
        "Peut rejoindre une 2ème équipe",
        "/pub toutes les 10h",
        "/repair coûte 100 000 Coins"
      ]
    },
    {
      name: "WellPremium",
      tier: "or",
      price: "",
      buyUrl: "#",
      perks: [
        "Téléportation instantanée",
        "Homes illimités",
        "Cooldown de téléportation minimal (10 secondes)",
        "Claim bonus : +20",
        "Mise maximum au coinflip illimitée",
        "/heal toutes les 1h",
        "Enderchest portable : /enderchest depuis n'importe où",
        "Peut rejoindre une 2ème équipe",
        "/pub toutes les 3h",
        "/repair coûte 10 000 Coins"
      ]
    }
  ],

  news: [
    { date: "26 juillet 2026", type: "correction", title: "/rtp", text: "Se base maintenant sur le centre du monde." },
    { date: "26 juillet 2026", type: "nouveaute", title: "/team claim", text: "Liste de tes claims : Gérer, supprimer ou s'y téléporter quand tu le souhaites." },
    { date: "26 juillet 2026", type: "amelioration", title: "/warp", text: "Les joueurs ne peuvent plus créer de warp, mais seulement s'y téléporter." },
    { date: "26 juillet 2026", type: "nouveaute", title: "LE RETIREUR", text: "Retire la malédiction du lien éternel d'un de tes objets." },
    { date: "26 juillet 2026", type: "nouveaute", title: "Boîte à musique", text: "Joue tes morceaux préférés en boucle, avec un mode enchainé pour les fêtes !" },
    { date: "26 juillet 2026", type: "correction", title: "/ah sell 0", text: "Ne fais plus disparaitre l'item à vendre." },
    { date: "26 juillet 2026", type: "nouveaute", title: "/trash", text: "Poubelle" },
    { date: "27 juillet 2026", type: "amelioration", title: "/loan", text: "Acceptation du prêt, limitation à 1 seul prêt à la fois et prévention si non-payé." },
    { date: "27 juillet 2026", type: "correction", title: "Boîte à musique", text: "En désactiver une coupait le son de toutes les autres, son inaudible de dos, bloc impossible à casser, pas de particules." },
    { date: "28 juillet 2026", type: "correction", title: "Spawners", text: "Les spawners sont maintenant fonctionnelles et les mobs ont maintenant des particules quand ils apparaissent." },
    { date: "28 juillet 2026", type: "nouveaute", title: "Lootbox", text: "Nouvelles récompenses : Bouclier du dasher (Épique)." },
    { date: "28 juillet 2026", type: "amelioration", title: "/world", text: "Les mondes affichent à présent leur date de réintialisation." },
    { date: "28 juillet 2026", type: "amelioration", title: "/mailbox", text: "Les items affichent maintenant leur date de suppression." }
  ],

  crafts: [
    {
      name: "Étiquette de bébé éternel",
      category: "Outils",
      icon: "🏷️",
      result: "1x Étiquette de bébé éternel",
      ingredients: ["1x Étiquette", "1x Larme de ghast"],
      description: "Rend un animal bébé à jamais."
    },
    {
      name: "Sac à dos",
      category: "Équipement",
      icon: "🎒",
      result: "1x Sac à dos",
      ingredients: ["1x Sac", "1x Shulker"],
      description: "Stock tes objets dans un sac à dos, un second inventaire."
    },
    {
      name: "Sac à dos géant",
      category: "Équipement",
      icon: "🎒",
      result: "1x Sac à dos géant",
      ingredients: ["1x Sac à dos", "1x Coffre de l'ender"],
      description: "Stock tes objets dans un sac à dos géant, un second double inventaire."
    },
    {
      name: "Le retireur",
      category: "Outils",
      icon: "✂️",
      result: "1x Retireur",
      ingredients: ["1x Cisaille", "1x Boule de slime", "1x Meule"],
      description: "Retire l'enchantement 'Malédiction du lien éternel' d'un objet (sur ton armure)."
    },
    {
      name: "Boîte à musique",
      category: "Cosmétique",
      icon: "🎶",
      result: "1x Boîte à musique",
      ingredients: ["1x Jukebox au centre", "7x Disques différents", "1x Levier en haut au centre"],
      description: "Une boîte à musique qui joue à l'infini le disque que vous souhaitez (avec un mode enchainé pour les fêtes !)."
    }
  ],

  features: [
    { icon: "🏰", title: "Claims & territoires", text: "Protège ta zone de construction avec /claim. La taille de ton territoire dépend de ton grade et peut être agrandie avec une Balise de Territoire." },
    { icon: "💰", title: "Économie & marché", text: "Gagne des Coins en jouant, échange-les avec les autres joueurs sur le marché ou tente ta chance au coinflip." },
    { icon: "🎖️", title: "Grades progressifs", text: "WellPass, WellPro, WellPremium : chaque grade débloque plus de homes, moins de cooldowns et des avantages exclusifs." },
    { icon: "🎮", title: "Mini-jeux WellGames", text: "Spleef, esquive, combat à la masse et plus encore : rejoins une partie en quelques secondes depuis le hub." },
    { icon: "🤝", title: "Équipes", text: "Crée ou rejoins une équipe pour jouer, claim et progresser ensemble sur le WellWorld comme en WellWar." },
    { icon: "⚗️", title: "Crafts spéciaux", text: "Des recettes exclusives à WellCraft. Étiquette du bébé éternel, sac à dos et bien d'autres à découvrir." }
  ],

  commands: [
    { cmd: "/lobby (/hub, /spawn)", desc: "Retourne au monde principal / point de spawn.", grade: "Tous" },
    { cmd: "/world [reset <type>]", desc: "Accès aux mondes temporaires, ou reset des ressources.", grade: "Tous" },
    { cmd: "/warp [nom]", desc: "Se téléporter à un warp (créés par les admins uniquement).", grade: "Tous" },
    { cmd: "/rtp", desc: "Téléportation aléatoire sécurisée autour du centre du monde.", grade: "Tous" },
    { cmd: "/tpa <joueur>", desc: "Demande à te téléporter chez un joueur.", grade: "Tous" },
    { cmd: "/tpask <joueur>", desc: "Demande à un joueur de venir chez toi.", grade: "Tous" },
    { cmd: "/tpaccept", desc: "Accepte une demande de téléportation reçue.", grade: "Tous" },
    { cmd: "/tpdeny", desc: "Refuse une demande de téléportation reçue.", grade: "Tous" },
    { cmd: "/tpcancel", desc: "Annule ta propre demande de téléportation en attente.", grade: "Tous" },
    { cmd: "/homes (/home)", desc: "Affiche et gère tes homes.", grade: "Tous" },
    { cmd: "/sethome <nom>", desc: "Définit un nouveau home à ta position actuelle.", grade: "Tous" },
    { cmd: "/delhome <nom>", desc: "Supprime un de tes homes.", grade: "Tous" },
    { cmd: "/team <sous-commande>", desc: "Créer, gérer, inviter, quitter... toute la gestion d'équipe.", grade: "Tous" },
    { cmd: "/team claim", desc: "Liste tes claims : gérer, supprimer ou t'y téléporter.", grade: "Tous" },
    { cmd: "/team visite <équipe>", desc: "Visite temporairement une équipe ouverte.", grade: "Tous" },
    { cmd: "/team retour", desc: "Revient dans ton équipe d'origine après une visite.", grade: "Tous" },
    { cmd: "/claim", desc: "Protège le territoire autour de toi.", grade: "Tous" },
    { cmd: "/donate <montant>", desc: "Donne de l'argent à la banque de ton équipe.", grade: "Tous" },
    { cmd: "/preleve <montant>", desc: "Prélève de l'argent de la banque de ton équipe.", grade: "Tous" },
    { cmd: "/shopping", desc: "Crée un shop d'équipe sur un coffre.", grade: "Tous" },
    { cmd: "/giveaway (/gaw)", desc: "Participer aux giveaways en cours.", grade: "Tous" },
    { cmd: "/money <give|remove|set|show>", desc: "Gère l'argent des joueurs.", grade: "Staff" },
    { cmd: "/pay <joueur> <montant>", desc: "Envoie de l'argent à un autre joueur.", grade: "Tous" },
    { cmd: "/sell [hand|all]", desc: "Vend tes items au prix du serveur.", grade: "Tous" },
    { cmd: "/ah [sell <prix>]", desc: "Hôtel des ventes entre joueurs.", grade: "Tous" },
    { cmd: "/ask [recept]", desc: "Ordres d'achat et boîte de réception du marché.", grade: "Tous" },
    { cmd: "/trade <joueur>", desc: "Échange sécurisé avec un autre joueur.", grade: "Tous" },
    { cmd: "/baltop (/richlist)", desc: "Classement des plus grosses fortunes.", grade: "Tous" },
    { cmd: "/transactions", desc: "Ton historique de transactions.", grade: "Tous" },
    { cmd: "/loan <offer|repay|list>", desc: "Prête ou emprunte de l'argent entre joueurs.", grade: "Tous" },
    { cmd: "/cf [mise] (/coinflip)", desc: "Lance un pari coinflip (mise max selon ton grade).", grade: "Tous" },
    { cmd: "/shop", desc: "Ouvre la boutique du serveur.", grade: "Tous" },
    { cmd: "/kit [nom]", desc: "Réclame un kit disponible.", grade: "Tous" },
    { cmd: "/trash", desc: "Ouvre une poubelle pour supprimer des items définitivement.", grade: "Tous" },
    { cmd: "/repair", desc: "Répare entièrement l'item en main (coût selon ton grade).", grade: "WellPass+" },
    { cmd: "/heal", desc: "Soigne instantanément vie et faim (cooldown selon ton grade).", grade: "WellPass+" },
    { cmd: "/enderchest", desc: "Ouvre ton enderchest depuis n'importe où.", grade: "WellPro+" },
    { cmd: "/mailbox (/mb, /colis)", desc: "Récupère les items reçus, ou envoie-en à un joueur.", grade: "Tous" },
    { cmd: "/wellwards (/rewards)", desc: "Récompenses de temps de jeu.", grade: "Tous" },
    { cmd: "/pass [sous-commande]", desc: "Gestion de ton pass / grade VIP.", grade: "Tous" },
    { cmd: "/settings (/options)", desc: "Tes préférences personnelles.", grade: "Tous" },
    { cmd: "/tuto", desc: "Rouvre le livre de bienvenue.", grade: "Tous" },
    { cmd: "/votes [top]", desc: "Stats de votes, paliers, Vote Party et liens des sites.", grade: "Tous" },
    { cmd: "/parrain <joueur>", desc: "Te déclare parrain d'un nouveau joueur.", grade: "Tous" },
    { cmd: "/pub <message>", desc: "Diffuse un message violet à tout le serveur (cooldown selon ton grade).", grade: "Tous" },
    { cmd: "/msg <joueur> <message> (/tell, /w)", desc: "Message privé à un joueur.", grade: "Tous" },
    { cmd: "/r <message>", desc: "Répond au dernier message privé reçu.", grade: "Tous" },
    { cmd: "/discord [link|unlink]", desc: "Lien d'invitation et liaison de compte Discord.", grade: "Tous" },
    { cmd: "/report <joueur> <raison>", desc: "Signale un joueur au staff.", grade: "Tous" },
    { cmd: "/list", desc: "Liste les joueurs en ligne.", grade: "Tous" },
    { cmd: "/wgames (/minijeux)", desc: "Commande principale des mini-jeux WellGames.", grade: "Tous" },
    { cmd: "/troll", desc: "Menu d'actions de troll — tout le monde à Pâques, staff le reste de l'année.", grade: "Tous / Staff" },
    { cmd: "/wellworld", desc: "Téléporte vers le monde WellWorld.", grade: "Tous" },
    { cmd: "/wellwar", desc: "Téléporte vers le monde WellWar.", grade: "Tous" },
    { cmd: "/wellgames", desc: "Téléporte vers le hub des mini-jeux.", grade: "Tous" },
    { cmd: "/wellevent", desc: "Téléporte vers WellEvent (évènement spécial).", grade: "Tous" },
    { cmd: "/wellcraft", desc: "Commande admin principale du plugin.", grade: "Staff" },
    { cmd: "/wellands", desc: "Panneau admin : claims, équipes, mondes, bourse.", grade: "Staff" },
    { cmd: "/wellstorm <grade|homes|reload>", desc: "Commandes admin avancées.", grade: "Staff" },
    { cmd: "/wellperms (/wperms)", desc: "Gestion des groupes de permissions.", grade: "Staff" },
    { cmd: "/wellgramme (/holo)", desc: "Gestion des hologrammes.", grade: "Staff" },
    { cmd: "/arena <set|tp>", desc: "Gestion des templates d'arène de mini-jeux.", grade: "Staff" },
    { cmd: "/spawner <sous-commande>", desc: "Gestion des spawners custom.", grade: "Staff" },
    { cmd: "/elevator give <joueur>", desc: "Donne des blocs d'ascenseur.", grade: "Staff" },
    { cmd: "/wkill [monde]", desc: "Nettoie les entités indésirables d'un monde.", grade: "Staff" },
    { cmd: "/reaction [reload]", desc: "Gestion des WellReactions.", grade: "Staff" },
    { cmd: "/classement [refresh]", desc: "Gestion des classements armor-stand.", grade: "Staff" },
    { cmd: "/vanish", desc: "Mode invisible admin (caché de tout, /list inclus).", grade: "Staff" },
    { cmd: "/invsee <joueur>", desc: "Voir/modifier l'inventaire d'un joueur.", grade: "Staff" }
  ],

  gallery: [
    "https://i.ibb.co/bMqSbwB9/2026-07-24-20-09-26.png"
  ],

  faqs: [
    { q: "Comment rejoindre le serveur ?", a: "Ouvre Minecraft en 1.21.4 Java Edition, ajoute un serveur avec l'adresse indiquée en haut de la page, puis connecte-toi !" },
    { q: "Comment claim un territoire ?", a: "Utilise la commande /claim en jeu pour protéger la zone autour de toi. Le nombre de claims disponibles dépend de ton grade." },
    { q: "Le serveur est-il disponible sur Bedrock ?", a: "Non, WellCraft est actuellement disponible uniquement en Java Edition 1.21.4." },
    { q: "Comment obtenir un grade ?", a: "Choisis un grade dans la section « Les grades » ci-dessus et clique sur Acheter : il est activé automatiquement sur ton compte pour 1 mois après le paiement." },
    { q: "Un problème ou un bug à signaler ?", a: "Rejoins notre Discord et ouvre un ticket dans la section support, l'équipe te répondra rapidement." }
  ],

  nextEvent: null,
  nextEventLabel: "Tournoi WellGames"
};

// ============================================================
// Chargement — on tente l'API (Cloudflare KV) en premier, avec un
// timeout de sécurité, et on retombe sur DEFAULT_SITE_DATA si elle
// est indisponible ou pas encore initialisée (première visite avant
// la 1ère sauvegarde depuis /admin.html).
// ============================================================

window.SITE_DATA_READY = false;
const _siteDataListeners = [];

window.onSiteDataReady = function (callback) {
  _siteDataListeners.push(callback);
  if (window.SITE_DATA_READY) callback(window.SITE_DATA);
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
  window.SITE_DATA_READY = true;
  _siteDataListeners.forEach(cb => cb(window.SITE_DATA));
}

async function _loadSiteData() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(`${window.API_BASE}/api/data`, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('api_not_ready');
    const data = await res.json();
    _applySiteData(data);
  } catch (e) {
    clearTimeout(timeout);
    console.warn('[WellCraft] API indisponible ou pas encore initialisée, utilisation des valeurs par défaut.');
    _applySiteData(DEFAULT_SITE_DATA);
  }
}

_loadSiteData();
