onSiteDataReady(function () {
  const MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const labels = { nouveaute: "Nouveauté", amelioration: "Amélioration", correction: "Correction", modification: "Modification" };

  // Transforme "24 juillet 2026" en objet Date exploitable par le calendrier
  function parseFrenchDate(str) {
    const m = str.match(/(\d{1,2})\s+([a-zûéèàôç]+)\s+(\d{4})/i);
    if (!m) return null;
    const day = parseInt(m[1], 10);
    const monthIndex = MONTHS_FR.indexOf(m[2].toLowerCase());
    const year = parseInt(m[3], 10);
    if (monthIndex === -1) return null;
    return new Date(year, monthIndex, day);
  }
  NEWS.forEach(n => { n._date = parseFrenchDate(n.date); });

  const list = document.getElementById('news-page-list');
  const filterBar = document.getElementById('news-filters');
  const viewToggle = document.getElementById('news-view-toggle');
  const calendarWrap = document.getElementById('calendar-wrap');
  const calGrid = document.getElementById('calendar-grid');
  const calMonthLabel = document.getElementById('cal-month-label');
  const calDayList = document.getElementById('calendar-daylist');
  const calPrev = document.getElementById('cal-prev');
  const calNext = document.getElementById('cal-next');
  if (!list) return;

  let currentFilter = 'all';
  let currentView = 'calendar';
  let selectedDay = null;

  // La page s'ouvre sur le mois de la nouveauté la plus récente
  const latestDated = NEWS.find(n => n._date);
  const base = latestDated ? latestDated._date : new Date();
  let calYear = base.getFullYear();
  let calMonth = base.getMonth();

  function newsCardHTML(item) {
    return `
      <div class="news-item">
        <div class="news-item-head">
          <span class="news-item-title">${item.title}</span>
          <span class="news-badge ${item.type}">${labels[item.type] || item.type}</span>
        </div>
        <span class="news-date">${item.date}</span>
        <p>${item.text}</p>
      </div>`;
  }

  function renderList() {
    const items = currentFilter === 'all' ? NEWS : NEWS.filter(n => n.type === currentFilter);
    list.innerHTML = items.length
      ? items.map(newsCardHTML).join('')
      : `<p class="news-empty">Aucune entrée pour ce filtre.</p>`;
  }

  function renderCalendar() {
    if (!calGrid || !calMonthLabel) return;
    const label = `${MONTHS_FR[calMonth]} ${calYear}`;
    calMonthLabel.textContent = label.charAt(0).toUpperCase() + label.slice(1);

    const firstOfMonth = new Date(calYear, calMonth, 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7; // semaine commence le lundi
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

    let cells = '';
    for (let i = 0; i < startOffset; i++) cells += `<div class="calendar-day empty"></div>`;

    for (let day = 1; day <= daysInMonth; day++) {
      const entries = NEWS.filter(n => n._date && n._date.getFullYear() === calYear && n._date.getMonth() === calMonth && n._date.getDate() === day);
      const hasNews = entries.length > 0;
      const key = `${calYear}-${calMonth}-${day}`;
      const dots = entries.slice(0, 3).map(e => `<span class="calendar-dot ${e.type}"></span>`).join('');
      cells += `<button type="button" class="calendar-day${hasNews ? ' has-news' : ''}${selectedDay === key ? ' selected' : ''}" data-key="${key}"${hasNews ? '' : ' disabled'}>
        <span class="calendar-day-num">${day}</span>
        <span class="calendar-day-dots">${dots}</span>
      </button>`;
    }
    calGrid.innerHTML = cells;

    calGrid.querySelectorAll('.calendar-day.has-news').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedDay = selectedDay === btn.dataset.key ? null : btn.dataset.key;
        renderCalendar();
      });
    });

    renderDayList();
  }

  function renderDayList() {
    if (!calDayList) return;
    if (!selectedDay) {
      calDayList.innerHTML = `<p class="calendar-hint">Clique sur un jour en surbrillance pour voir le détail.</p>`;
      return;
    }
    const [y, m, d] = selectedDay.split('-').map(Number);
    const items = NEWS.filter(n => n._date && n._date.getFullYear() === y && n._date.getMonth() === m && n._date.getDate() === d);
    calDayList.innerHTML = items.map(newsCardHTML).join('');
  }

  calPrev?.addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    selectedDay = null;
    renderCalendar();
  });
  calNext?.addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    selectedDay = null;
    renderCalendar();
  });

  filterBar?.querySelectorAll('.news-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      filterBar.querySelectorAll('.news-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderList();
    });
  });

  function applyView() {
    const isCalendar = currentView === 'calendar';
    if (calendarWrap) calendarWrap.style.display = isCalendar ? '' : 'none';
    if (list) list.style.display = isCalendar ? 'none' : '';
    if (filterBar) filterBar.style.display = isCalendar ? 'none' : '';
  }

  viewToggle?.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentView = btn.dataset.view;
      viewToggle.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyView();
    });
  });

  renderList();
  renderCalendar();
  applyView();
});
