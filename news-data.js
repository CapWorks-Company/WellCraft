// ============================================================
// GRADES — modifie librement cette liste : ajoute, retire ou édite
// un grade et ses avantages, l'affichage se met à jour automatiquement.
// tier accepté : "bronze", "argent", "or" (couleur de l'en-tête de la carte)
//
// price   : texte affiché sur le bouton d'achat (laisse vide/omets pour un grade gratuit)
// buyUrl  : lien vers TA page de paiement pour ce grade précis (1 mois). Remplace les
//           URLs ci-dessous par tes vrais liens de paiement (Tebex, Stripe Payment Link,
//           PayPal.me...). Tant que ce n'est pas fait, le bouton reste affiché mais pointe
//           vers un lien factice "#" à remplacer.
// ============================================================
const GRADES = [
  {
    name: "Aucun",
    tier: "none",
    perks: [
      "Délai de téléportation : 5 secondes",
      "2 homes disponibles",
      "Cooldown de téléportation : 1 minute",
      "Mise maximum au coinflip : 1 000 Coins"
    ]
  },
  {
    name: "WellPass",
    tier: "bronze",
    price: "1,10 €",
    buyUrl: "#", // TODO: remplace par ton lien de paiement WellPass (1 mois)
    perks: [
      "Délai de téléportation réduit à 3 secondes",
      "3 homes disponibles",
      "Cooldown de téléportation réduit à 45 secondes",
      "Claim bonus : +5",
      "Mise maximum au coinflip augmentée à 5 000 Coins"
    ]
  },
  {
    name: "WellPro",
    tier: "argent",
    price: "5,50 €",
    buyUrl: "#", // TODO: remplace par ton lien de paiement WellPro (1 mois)
    perks: [
      "Téléportation instantanée",
      "5 homes disponibles",
      "Cooldown de téléportation réduit à 25 secondes",
      "Claim bonus : +10",
      "Mise maximum au coinflip augmentée à 25 000 Coins"
    ]
  },
  {
    name: "WellPremium",
    tier: "or",
    price: "9,90 €",
    buyUrl: "#", // TODO: remplace par ton lien de paiement WellPremium (1 mois)
    perks: [
      "Téléportation instantanée",
      "Homes illimités",
      "Cooldown de téléportation réduit à 10 secondes",
      "Claim bonus : +20",
      "Mise maximum au coinflip illimitée"
    ]
  }
];

// ============================================================
// NOUVEAUTÉS — modifie librement cette liste pour ajouter, retirer
// ou éditer une entrée du changelog. Elle s'affiche du plus récent
// au plus ancien, dans l'ordre où tu les écris ici.
// type accepté : "nouveaute", "amelioration", "correction"
// ============================================================
const NEWS = [
  {
    date: "24 juillet 2026",
    type: "correction",
    title: "Correctif des claims",
    text: "Correction du bug des claims : vous pouvez à présent continuer à miner et poser des blocs dans vos territoires."
  },
  {
    date: "20 juillet 2026",
    type: "nouveaute",
    title: "Ajout du mini-jeu WellStrike",
    text: "Un tout nouveau mode d'esquive a rejoint WellGames : des obstacles surgissent et foncent droit sur toi, à toi de tenir le plus longtemps possible !"
  },
  {
    date: "12 juillet 2026",
    type: "amelioration",
    title: "Optimisation du claim system",
    text: "Le temps de chargement des territoires a été réduit et l'affichage des limites de claim est désormais plus précis en jeu."
  },
  {
    date: "5 juillet 2026",
    type: "correction",
    title: "Correctif du coinflip",
    text: "Résolution d'un bug qui bloquait parfois la mise maximum autorisée pour les grades WellPro et WellPremium."
  }
];
