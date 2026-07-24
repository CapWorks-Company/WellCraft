// ============================================================
const SERVER_IP = "wellcraft.mine.fun";
// ============================================================

// ============================================================
// STATUT EN DIRECT — on interroge d'abord api.mcstatus.io (ping quasi
// temps réel, très faible mise en cache), et on se replie sur
// api.mcsrvstat.us si la première ne répond pas. Ça évite le cas où
// une seule API garde en cache un ancien statut "hors ligne".
// ============================================================
async function fetchServerStatus() {
  try {
    const res = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER_IP}`);
    if (!res.ok) throw new Error('mcstatus.io indisponible');
    const data = await res.json();
    return {
      online: !!data.online,
      playersOnline: data.players?.online ?? null,
      playersMax: data.players?.max ?? null
    };
  } catch (e) {
    try {
      const res2 = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`);
      const data2 = await res2.json();
      return {
        online: !!data2.online,
        playersOnline: data2.players?.online ?? null,
        playersMax: data2.players?.max ?? null
      };
    } catch (e2) {
      return null;
    }
  }
}

function applyStatus(status) {
  const heroTorch = document.getElementById('torch');
  const navTorch = document.getElementById('nav-torch');
  const count = document.getElementById('status-count');
  const label = document.getElementById('status-label');
  const navText = document.getElementById('nav-status-text');

  const torches = [heroTorch, navTorch].filter(Boolean);

  if (!status) {
    torches.forEach(t => t.classList.add('offline'));
    if (count) count.textContent = '—';
    if (label) label.textContent = 'Statut indisponible';
    if (navText) navText.textContent = 'Statut indisponible';
    return;
  }

  if (status.online) {
    torches.forEach(t => t.classList.remove('offline'));
    const online = status.playersOnline ?? '?';
    const max = status.playersMax ?? '?';
    if (count) count.textContent = `${online} / ${max}`;
    if (label) label.textContent = 'joueurs en ligne';
    if (navText) navText.textContent = 'Serveur en ligne !';
  } else {
    torches.forEach(t => t.classList.add('offline'));
    if (count) count.textContent = 'Hors ligne';
    if (label) label.textContent = 'Le serveur est hors-ligne.';
    if (navText) navText.textContent = 'Serveur hors-ligne.';
  }
}

async function refreshStatus() {
  const status = await fetchServerStatus();
  applyStatus(status);
}
refreshStatus();
setInterval(refreshStatus, 20000);

const serverIpEl = document.getElementById('server-ip');
if (serverIpEl) serverIpEl.textContent = SERVER_IP;
