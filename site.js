// ============================================================
// GRADES — rendu des cartes avec prix + bouton d'achat (1 mois).
// Les données sont dans news-data.js (GRADES).
// ============================================================
function renderGrades() {
  const grid = document.getElementById('grades-grid');
  if (!grid) return;
  grid.innerHTML = GRADES.map(grade => `
    <div class="grade-card" data-tier="${grade.tier}">
      <div class="grade-card-head">
        <h3 class="pixel">${grade.name}</h3>
        ${grade.price ? `<span class="grade-price">${grade.price}</span>` : ''}
      </div>
      <div class="grade-card-body">
        <ul class="grade-perks">
          ${grade.perks.map(perk => `<li>${perk}</li>`).join('')}
        </ul>
        ${grade.price && grade.buyUrl
          ? `<a class="grade-buy-btn" href="${grade.buyUrl}" target="_blank" rel="noopener">
               Acheter <span class="duration">(1 mois)</span>
             </a>`
          : `<span class="grade-card-free-tag">Grade par défaut</span>`}
      </div>
    </div>
  `).join('');
}
renderGrades();

// ============================================================
// NOUVEAUTÉS — aperçu des 3 dernières entrées sur l'accueil, avec un
// lien vers la page dédiée nouveautes.html pour voir tout l'historique.
// ============================================================
function renderNewsPreview() {
  const list = document.getElementById('news-preview');
  if (!list) return;
  const labels = { nouveaute: "Nouveauté", amelioration: "Amélioration", correction: "Correction" };
  list.innerHTML = NEWS.slice(0, 3).map(item => `
    <div class="news-item">
      <div class="news-item-head">
        <span class="news-item-title">${item.title}</span>
        <span class="news-badge ${item.type}">${labels[item.type] || item.type}</span>
      </div>
      <span class="news-date">${item.date}</span>
      <p>${item.text}</p>
    </div>
  `).join('');
}
renderNewsPreview();

// ============================================================
// DESCRIPTIONS DES MODES — modifie librement le texte de chaque mode ici.
// La clé (ex: "spleef") doit correspondre à l'attribut data-mode du bouton.
// ============================================================
const MODE_DESCRIPTIONS = {
  spleef: {
    icon: "⛏️",
    title: "WellSpleef",
    text: "Le mini-jeu emblématique de Minecraft ! Arme-toi de ta pelle et détruis les blocs sous les pieds de tes adversaires pour les faire tomber dans le vide."
  },
  hunt: {
    icon: "🎃",
    title: "WellHunt",
    text: "Un chasseur est désigné au hasard. Réussiras-tu à te camoufler avant qu'il ne te trouve ? Transforme-toi en n'importe quel bloc et cache-toi avant son réveil !"
  },
  max: {
    icon: "🔨",
    title: "WellMax",
    text: "Une arène de glace, une masse… que demander de plus ? Propulse tes adversaires dans le vide et sois le dernier survivant !"
  },
  paint: {
    icon: "🎨",
    title: "WellPaint",
    text: "Saisis ton arbalète et repeins toute l'arène à ta couleur ! Domine le terrain et termine avec le plus grand territoire."
  },
  rise: {
    icon: "🌋",
    title: "WellRise",
    text: "Vous êtes au fond d'un volcan en pleine éruption ! Grimpez le plus vite possible avant que la lave ne vous rattrape."
  },
  color: {
    icon: "🌀",
    title: "WellColor",
    text: "Une couleur est annoncée... Fonce dessus avant tout le monde ! Les autres couleurs disparaîtront dans le vide. Réflexes et rapidité seront vos meilleurs alliés."
  },
  bridge: {
    icon: "⌛",
    title: "WellBridge",
    text: "Inspiré du célèbre jeu « 1, 2, 3, Soleil » de Squid Game. Avance lorsque le feu est vert, immobilise-toi lorsqu'il passe au rouge. Le premier à franchir la ligne d'arrivée remporte la victoire !"
  },
  strike: {
    icon: "🌈",
    title: "WellStrike",
    text: "Des obstacles surgissent et foncent droit sur toi ! Saute, esquive et déplace-toi rapidement pour éviter chaque attaque. Combien de temps arriveras-tu à tenir ?"
  }
};

(function setupModeButtons() {
  const buttons = document.querySelectorAll('.mode-pill');
  const panel = document.getElementById('mode-description-panel');
  const titleEl = document.getElementById('mode-description-title');
  const textEl = document.getElementById('mode-description-text');
  let activeMode = null;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;

      if (activeMode === mode) {
        panel.classList.remove('open');
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        activeMode = null;
        return;
      }

      buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-expanded', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');

      const data = MODE_DESCRIPTIONS[mode];
      if (data) {
        titleEl.textContent = `${data.icon} ${data.title}`;
        textEl.textContent = data.text;
      }
      panel.classList.add('open');
      activeMode = mode;
    });
  });
})();

// Génère les braises flottantes derrière la bannière (purement décoratif)
(function spawnEmbers() {
  const container = document.getElementById('embers');
  if (!container) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const ember = document.createElement('div');
    ember.className = 'ember';
    const left = Math.random() * 100;
    const duration = 4 + Math.random() * 4;
    const delay = Math.random() * 6;
    const drift = (Math.random() * 60 - 30).toFixed(0) + 'px';
    ember.style.left = left + '%';
    ember.style.animationDuration = duration + 's';
    ember.style.animationDelay = delay + 's';
    ember.style.setProperty('--drift', drift);
    container.appendChild(ember);
  }
})();

const copyBtn = document.getElementById('copy-btn');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(SERVER_IP);
    } catch (e) {
      const tmp = document.createElement('textarea');
      tmp.value = SERVER_IP;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      document.body.removeChild(tmp);
    }
    const original = copyBtn.textContent;
    copyBtn.textContent = 'Copié !';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = original;
      copyBtn.classList.remove('copied');
    }, 1800);
  });
}

// ============================================================
// BOUTIQUE VERROUILLÉE — dessine la chaîne diagonale, et secoue le
// cadenas + la chaîne au survol ou au clic.
// ============================================================
(function setupShopLock() {
  const frame = document.getElementById('shop-frame');
  const chainSvg = document.getElementById('shop-chain');
  const linksGroup = document.getElementById('chain-links');
  if (!frame || !chainSvg || !linksGroup) return;

  function buildChain() {
    const W = 1000, H = 600;
    const angle = Math.atan2(H, W) * 180 / Math.PI;
    const length = Math.sqrt(W * W + H * H);
    const step = 30;
    let html = '';
    let dist = 0;
    let i = 0;
    while (dist < length) {
      const t = dist / length;
      const x = W * t;
      const y = H * t;
      const rot = angle + (i % 2 === 0 ? 0 : 90);
      html += `<g transform="translate(${x},${y}) rotate(${rot})">
        <rect x="-11" y="-22" width="22" height="44" rx="11" fill="none" stroke="url(#steelGrad)" stroke-width="9"/>
        <rect x="-11" y="-22" width="22" height="44" rx="11" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="2"/>
      </g>`;
      dist += step;
      i++;
    }
    linksGroup.innerHTML = html;
  }
  buildChain();

  function shake() {
    frame.classList.remove('shaking');
    void frame.offsetWidth;
    frame.classList.add('shaking');
  }
  frame.addEventListener('mouseenter', shake);
  frame.addEventListener('click', shake);
})();

// ============================================================
// GALERIE DE CONSTRUCTIONS — colle ici tes liens d'images se terminant
// par .png (hébergées où tu veux : Discord CDN, Imgur, ton propre
// serveur...). Ajoute ou retire simplement des lignes dans ce tableau.
// ============================================================
const GALLERY = [
  "https://i.ibb.co/bMqSbwB9/2026-07-24-20-09-26.png"
];

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  if (!GALLERY.length) {
    grid.innerHTML = `<p class="gallery-empty">Aucune construction ajoutée pour le moment.</p>`;
    return;
  }
  grid.innerHTML = GALLERY.map(url => `
    <button class="gallery-item" data-src="${url}" type="button" aria-label="Agrandir l'image">
      <img src="${url}" alt="Construction WellCraft" loading="lazy" onerror="this.closest('.gallery-item').classList.add('img-error')">
    </button>
  `).join('');
  grid.querySelectorAll('.gallery-item').forEach(btn => {
    btn.addEventListener('click', () => openLightbox(btn.dataset.src));
  });
}
renderGallery();

function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (!lb || !img) return;
  img.src = src;
  lb.classList.add('open');
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (!lb || !img) return;
  lb.classList.remove('open');
  img.src = '';
}
document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
document.getElementById('lightbox')?.addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ============================================================
// PROCHAIN ÉVÈNEMENT — mets une date/heure ISO ("2026-08-15T20:00:00")
// dans NEXT_EVENT pour activer le compte à rebours, ou laisse "null"
// si aucun évènement n'est prévu pour le moment.
// ============================================================
const NEXT_EVENT = null; // ex: "2026-08-15T20:00:00"
const NEXT_EVENT_LABEL = "Tournoi WellGames";

function renderEvent() {
  const box = document.getElementById('event-box');
  if (!box) return;

  if (!NEXT_EVENT) {
    box.innerHTML = `
      <div class="event-empty">
        <span class="event-empty-icon">🕯️</span>
        <p>Aucun évènement prévu pour le moment. Reviens vite, la torche se rallumera dès qu'une date sera annoncée !</p>
      </div>`;
    return;
  }

  box.innerHTML = `
    <h3 class="pixel event-title">${NEXT_EVENT_LABEL}</h3>
    <div class="countdown" id="countdown">
      <div class="countdown-unit"><strong id="cd-days">00</strong><span>Jours</span></div>
      <div class="countdown-unit"><strong id="cd-hours">00</strong><span>Heures</span></div>
      <div class="countdown-unit"><strong id="cd-min">00</strong><span>Min</span></div>
      <div class="countdown-unit"><strong id="cd-sec">00</strong><span>Sec</span></div>
    </div>`;
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const box = document.getElementById('event-box');
  if (!box || !NEXT_EVENT) return;
  const target = new Date(NEXT_EVENT).getTime();
  const diff = target - Date.now();

  if (diff <= 0) {
    box.innerHTML = `
      <div class="event-empty">
        <span class="event-empty-icon">🎉</span>
        <p>L'évènement a commencé, rejoins vite le serveur !</p>
      </div>`;
    return;
  }

  const pad = n => String(n).padStart(2, '0');
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const elDays = document.getElementById('cd-days');
  if (elDays) {
    elDays.textContent = pad(days);
    document.getElementById('cd-hours').textContent = pad(hours);
    document.getElementById('cd-min').textContent = pad(minutes);
    document.getElementById('cd-sec').textContent = pad(seconds);
  }
}
renderEvent();

// ============================================================
// FAQ — modifie librement les questions/réponses ici, l'accordéon
// s'affiche et se déplie automatiquement.
// ============================================================
const FAQS = [
  { q: "Comment rejoindre le serveur ?", a: "Ouvre Minecraft en 1.21.4 Java Edition, ajoute un serveur avec l'adresse indiquée en haut de la page, puis connecte-toi !" },
  { q: "Comment claim un territoire ?", a: "Utilise la commande /claim en jeu pour protéger la zone autour de toi. Le nombre de claims disponibles dépend de ton grade." },
  { q: "Le serveur est-il disponible sur Bedrock ?", a: "Non, WellCraft est actuellement disponible uniquement en Java Edition 1.21.4." },
  { q: "Comment obtenir un grade ?", a: "Choisis un grade dans la section « Les grades » ci-dessus et clique sur Acheter : il est activé automatiquement sur ton compte pour 1 mois après le paiement." },
  { q: "Un problème ou un bug à signaler ?", a: "Rejoins notre Discord et ouvre un ticket dans la section support, l'équipe te répondra rapidement." }
];

function renderFaq() {
  const list = document.getElementById('faq-list');
  if (!list) return;
  list.innerHTML = FAQS.map((item, i) => `
    <div class="faq-item">
      <button class="faq-question" data-index="${i}" aria-expanded="false" type="button">
        <span>${item.q}</span>
        <span class="faq-chevron">▾</span>
      </button>
      <div class="faq-answer" id="faq-answer-${i}">
        <p>${item.a}</p>
      </div>
    </div>
  `).join('');
  list.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = document.getElementById(`faq-answer-${btn.dataset.index}`);
      if (!answer) return;
      const open = answer.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
}
renderFaq();

// Révélation des cartes au scroll
const cards = document.querySelectorAll('.card, .grade-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
cards.forEach(card => observer.observe(card));
