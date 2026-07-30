onSiteDataReady(function () {
  const grid = document.getElementById('crafts-grid');
  const filterBar = document.getElementById('crafts-filters');
  if (!grid || !filterBar) return;

  let currentFilter = 'all';

  function render() {
    const items = currentFilter === 'all' ? CRAFTS : CRAFTS.filter(c => c.category === currentFilter);

    if (!items.length) {
      grid.innerHTML = `<p class="news-empty">Aucun craft pour cette catégorie.</p>`;
      return;
    }

    grid.innerHTML = items.map(craft => `
      <div class="craft-card bracketed">
        <div class="craft-card-head">
          <span class="craft-icon">${craft.icon}</span>
          <div>
            <h3 class="pixel">${craft.name}</h3>
            <span class="craft-category">${craft.category}</span>
          </div>
        </div>
        <p class="craft-desc">${craft.description}</p>
        <div class="craft-ingredients">
          <span class="craft-label">Ingrédients</span>
          <ul>
            ${craft.ingredients.map(i => `<li>${i}</li>`).join('')}
          </ul>
        </div>
        <div class="craft-result">➜ ${craft.result}</div>
      </div>
    `).join('');
  }

  // Construit dynamiquement les boutons de filtre à partir des catégories présentes
  const categories = [...new Set(CRAFTS.map(c => c.category))];
  filterBar.innerHTML = `<button class="news-filter-btn active" data-filter="all">Tout</button>` +
    categories.map(cat => `<button class="news-filter-btn" data-filter="${cat}">${cat}</button>`).join('');

  filterBar.querySelectorAll('.news-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      filterBar.querySelectorAll('.news-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });

  render();
});
