onSiteDataReady(function () {
  const featGrid = document.getElementById('features-grid');
  if (featGrid) {
    featGrid.innerHTML = FEATURES.map(f => `
      <article class="card bracketed">
        <div class="card-icon">${f.icon}</div>
        <h3 class="pixel">${f.title}</h3>
        <p>${f.text}</p>
      </article>
    `).join('');
  }

  const cmdList = document.getElementById('commands-list');
  const searchInput = document.getElementById('commands-search');
  if (!cmdList) return;

  function renderCommands(filter) {
    const q = (filter || '').trim().toLowerCase();
    const items = !q ? COMMANDS : COMMANDS.filter(c =>
      c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );

    if (!items.length) {
      cmdList.innerHTML = `<p class="news-empty">Aucune commande ne correspond à ta recherche.</p>`;
      return;
    }

    cmdList.innerHTML = items.map(c => `
      <div class="cmd-row">
        <code class="cmd-name">${c.cmd}</code>
        <span class="cmd-desc">${c.desc}</span>
        <span class="cmd-grade">${c.grade}</span>
      </div>
    `).join('');
  }

  renderCommands('');

  if (searchInput) {
    searchInput.addEventListener('input', () => renderCommands(searchInput.value));
  }
});
