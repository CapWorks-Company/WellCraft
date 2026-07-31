// ============================================================
// COMPTE.JS — liaison de compte WellCraft + boutique payée en argent en jeu.
//
// Ceci parle à ton Worker Cloudflare (qui relaie vers le plugin Minecraft) —
// PAS à window.API_BASE (qui gère le contenu du site : grades, news, etc.),
// c'est une route différente sur le même Worker.
// ============================================================
window.ACCOUNT_API_BASE = "https://wellcraft.capkychannel.workers.dev";

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
      server_error: "Le serveur n'a pas pu traiter la demande — réessaie plus tard.",
      server_unreachable: "Impossible de joindre le serveur Minecraft pour le moment."
    }[code] || "Une erreur est survenue — le site n'arrive peut-être pas à joindre le serveur Minecraft.";
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ── Liaison du compte ──────────────────────────────────

  linkForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    linkError.hidden = true;
    const code = linkCodeInput.value.trim();
    if (!code) return;

    const btn = linkForm.querySelector(".account-link-btn");
    btn.disabled = true;
    btn.classList.add("is-loading");

    try {
      const data = await api("/link", { method: "POST", body: JSON.stringify({ code }) });
      setSession({ token: data.token, uuid: data.uuid, name: data.name });
      await refreshAccount();
    } catch (err) {
      linkError.textContent = friendlyError(err.message);
      linkError.hidden = false;
    } finally {
      btn.disabled = false;
      btn.classList.remove("is-loading");
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
    shopGrid.innerHTML = `<p class="shop-loading">Chargement de la boutique…</p>`;
    try {
      const data = await api(`/shop?token=${encodeURIComponent(token)}`);
      renderShop(data);
    } catch (err) {
      shopGrid.innerHTML = "";
      shopError.textContent = friendlyError(err.message);
      shopError.hidden = false;
    }
  }

  function renderShop(data) {
    const items = (data.categories || []).flatMap(cat =>
      cat.items.map(item => ({ ...item, categoryName: cat.name }))
    );
    if (!items.length) {
      shopGrid.innerHTML = `<p class="shop-empty">Aucun article disponible pour le moment.</p>`;
      return;
    }
    shopGrid.innerHTML = items.map((item, i) => `
      <div class="shop-item fade-in-up" style="animation-delay:${Math.min(i * 0.05, 0.5)}s" data-category="${item.categoryIndex}" data-slot="${item.gridSlot}">
        <div class="shop-item-icon" aria-hidden="true">📦</div>
        <div class="shop-item-name">${escapeHtml(item.name)}</div>
        <div class="shop-item-category">${escapeHtml(item.categoryName)}</div>
        <button type="button" class="shop-item-buy" data-category="${item.categoryIndex}" data-slot="${item.gridSlot}">
          <span>Acheter</span><span class="shop-item-price">${item.price}</span>
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
    const original = btn.innerHTML;
    btn.innerHTML = `<span>…</span>`;

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
      btn.innerHTML = `<span>✔ Acheté !</span>`;
      btn.classList.add("bought");
      setTimeout(() => { btn.innerHTML = original; btn.classList.remove("bought"); btn.disabled = false; }, 1600);
      refreshAccount();
    } catch (err) {
      alert(friendlyError(err.message));
      btn.innerHTML = original;
      btn.disabled = false;
    }
  }

  // ── Démarrage ────────────────────────────────────────

  onSiteDataReady(() => {
    refreshAccount();
  });
})();
