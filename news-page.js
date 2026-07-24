(function () {
  const list = document.getElementById('news-page-list');
  const filterBar = document.getElementById('news-filters');
  if (!list || !filterBar) return;

  const labels = { nouveaute: "Nouveauté", amelioration: "Amélioration", correction: "Correction" };
  let currentFilter = 'all';

  function render() {
    const items = currentFilter === 'all' ? NEWS : NEWS.filter(n => n.type === currentFilter);

    if (!items.length) {
      list.innerHTML = `<p class="news-empty">Aucune entrée pour ce filtre.</p>`;
      return;
    }

    list.innerHTML = items.map(item => `
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

  filterBar.querySelectorAll('.news-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      filterBar.querySelectorAll('.news-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });

  render();
})();
