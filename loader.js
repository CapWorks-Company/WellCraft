// ============================================================
// loader.js — pilote l'écran de connexion (#site-loader, présent
// dans le HTML de chaque page). Écoute les évènements de data.js :
// - onSiteDataReady : les vraies données sont là -> on masque le loader
// - onSiteDataError : Worker injoignable / base vide -> état d'erreur
// ============================================================

(function () {
  const loader = document.getElementById("site-loader");
  if (!loader) return;

  const textEl = loader.querySelector(".loader-text");
  const dotsEl = loader.querySelector(".loader-dots");

  function showConnecting() {
    loader.classList.remove("loader-error");
    if (textEl) textEl.textContent = "Connexion à la base de données…";
    if (dotsEl) dotsEl.style.display = "";
    const retryBtn = loader.querySelector(".loader-retry-btn");
    if (retryBtn) retryBtn.remove();
  }

  function showError(reason) {
    loader.classList.add("loader-error");
    if (dotsEl) dotsEl.style.display = "none";
    if (textEl) {
      textEl.textContent = reason === "no_data"
        ? "Le site n'a pas encore été configuré."
        : "Impossible de se connecter au serveur.";
    }
    if (!loader.querySelector(".loader-retry-btn")) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "loader-retry-btn";
      btn.textContent = "Réessayer";
      btn.addEventListener("click", () => {
        showConnecting();
        window.retrySiteData();
      });
      loader.querySelector(".loader-content").appendChild(btn);
    }
  }

  function hideLoader() {
    loader.classList.add("loader-hidden");
  }

  window.onSiteDataReady(hideLoader);
  window.onSiteDataError(showError);
})();
