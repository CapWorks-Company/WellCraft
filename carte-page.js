onSiteDataReady(function () {
  const toggle = document.getElementById('map-toggle');
  const frame = document.getElementById('map-frame');
  const wrap = document.getElementById('map-frame-wrap');
  const empty = document.getElementById('map-frame-empty');
  if (!toggle || !frame) return;

  const baseUrl = (window.MAP_URL || "").trim().replace(/\/+$/, "");

  // Pas d'URL configurée dans l'admin : on affiche le message d'attente
  // et on cache la carte + les boutons plutôt que de charger un iframe cassé.
  if (!baseUrl) {
    wrap.classList.add('map-frame-empty-state');
    toggle.style.display = 'none';
    return;
  }

  empty.style.display = 'none';

  // ⚠️ Ces identifiants doivent correspondre EXACTEMENT aux noms des maps
  // configurées côté BlueMap (un dossier maps/<id>.conf par monde). Adapte-les
  // si tu choisis d'autres identifiants lors de la configuration du plugin.
  function loadMap(mapId) {
    frame.src = `${baseUrl}/#${mapId}`;
  }

  toggle.querySelectorAll('.map-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      toggle.querySelectorAll('.map-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadMap(btn.dataset.map);
    });
  });

  const initial = toggle.querySelector('.map-toggle-btn.active') || toggle.querySelector('.map-toggle-btn');
  if (initial) loadMap(initial.dataset.map);
});
