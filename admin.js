(function () {
  "use strict";

  const TOKEN_KEY = "wc_admin_token";

  // ============================================================
  // SCHÉMAS — décrivent les champs de chaque collection pour générer
  // les formulaires automatiquement (voir renderCollectionTab).
  // ============================================================
  const SCHEMAS = {
    grades: {
      title: "Grades",
      hint: "Le grade « Aucun » (tier: none) doit toujours rester en premier.",
      labelField: "name",
      itemLabel: g => g.name || "(sans nom)",
      blank: () => ({ name: "Nouveau grade", tier: "bronze", price: "", buyUrl: "#", perks: [] }),
      fields: [
        { key: "name", label: "Nom", type: "text" },
        { key: "tier", label: "Tier (couleur de la carte)", type: "select", options: ["none", "bronze", "argent", "or"] },
        { key: "price", label: "Prix affiché sur le bouton (vide = grade gratuit, pas de bouton d'achat)", type: "text" },
        { key: "buyUrl", label: "Lien de paiement (Tebex, Stripe, PayPal.me...)", type: "text" },
        { key: "perks", label: "Avantages (un par ligne)", type: "list" }
      ]
    },
    crafts: {
      title: "Crafts spéciaux",
      labelField: "name",
      itemLabel: c => c.name || "(sans nom)",
      blank: () => ({ name: "Nouveau craft", category: "Outils", icon: "✨", result: "", ingredients: [], description: "" }),
      fields: [
        { key: "name", label: "Nom", type: "text" },
        { key: "category", label: "Catégorie (sert de filtre)", type: "text" },
        { key: "icon", label: "Icône (emoji)", type: "text" },
        { key: "result", label: "Résultat obtenu", type: "text" },
        { key: "ingredients", label: "Ingrédients (un par ligne)", type: "list" },
        { key: "description", label: "Description", type: "textarea" }
      ]
    },
    news: {
      title: "Nouveautés",
      hint: "Affichées dans l'ordre où elles apparaissent ici. Les nouvelles entrées sont ajoutées en bas de la liste : c'est donc la DERNIÈRE entrée qui est considérée comme la plus récente (et affichée en aperçu sur la page d'accueil).",
      labelField: "title",
      itemLabel: n => n.title || "(sans titre)",
      blank: () => ({ date: "", type: "nouveaute", title: "Nouvelle entrée", text: "" }),
      fields: [
        { key: "date", label: "Date (ex: 26 juillet 2026)", type: "text" },
        { key: "type", label: "Type", type: "select", options: ["nouveaute", "amelioration", "correction", "modification"] },
        { key: "title", label: "Titre", type: "text" },
        { key: "text", label: "Texte", type: "textarea" }
      ]
    },
    features: {
      title: "Fonctionnalités",
      labelField: "title",
      itemLabel: f => f.title || "(sans titre)",
      blank: () => ({ icon: "✨", title: "Nouvelle fonctionnalité", text: "" }),
      fields: [
        { key: "icon", label: "Icône (emoji)", type: "text" },
        { key: "title", label: "Titre", type: "text" },
        { key: "text", label: "Texte", type: "textarea" }
      ]
    },
    commands: {
      title: "Commandes",
      labelField: "cmd",
      itemLabel: c => c.cmd || "(sans commande)",
      blank: () => ({ cmd: "/nouvelle", desc: "", grade: "Tous" }),
      fields: [
        { key: "cmd", label: "Commande (ex: /home [nom])", type: "text" },
        { key: "desc", label: "Description", type: "text" },
        { key: "grade", label: "Grade requis (ex: Tous, WellPass+, Staff)", type: "text" }
      ]
    },
    faqs: {
      title: "FAQ",
      labelField: "q",
      itemLabel: f => f.q || "(sans question)",
      blank: () => ({ q: "Nouvelle question ?", a: "" }),
      fields: [
        { key: "q", label: "Question", type: "text" },
        { key: "a", label: "Réponse", type: "textarea" }
      ]
    }
  };

  const TABS = [
    { key: "grades", label: "🎖️ Grades" },
    { key: "crafts", label: "⚗️ Crafts" },
    { key: "news", label: "📜 Nouveautés" },
    { key: "features", label: "🛠️ Fonctionnalités" },
    { key: "commands", label: "⌨️ Commandes" },
    { key: "gallery", label: "🖼️ Galerie" },
    { key: "faqs", label: "❓ FAQ" },
    { key: "config", label: "⚙️ Serveur & évènement" }
  ];

  let token = null;
  let working = null; // copie de travail des données, modifiée en mémoire
  let dirty = false;
  let currentTab = "grades";
  let saving = false;

  // ---------- Utilitaires ----------
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function showToast(message, type = "success") {
    const toast = document.getElementById("admin-toast");
    toast.textContent = message;
    toast.className = `admin-toast ${type} show`;
    setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function markDirty() {
    dirty = true;
    updateSaveBar();
  }

  // ============================================================
  // ÉTAPE 1 — CONNEXION (vérifiée côté serveur, jamais côté client)
  // ============================================================
  async function verifyToken(candidateToken) {
    try {
      const res = await fetch(`${window.API_BASE}/api/admin/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  function showLogin(errorMsg) {
    document.getElementById("admin-login").classList.remove("hidden");
    document.getElementById("admin-app").classList.add("hidden");
    document.getElementById("admin-app").innerHTML = "";
    document.getElementById("admin-login-error").textContent = errorMsg || "";
    sessionStorage.removeItem(TOKEN_KEY);
    token = null;
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("admin-token-input");
    const btn = document.getElementById("admin-login-btn");
    const candidate = input.value;
    btn.disabled = true;
    btn.textContent = "Vérification…";
    const ok = await verifyToken(candidate);
    btn.disabled = false;
    btn.textContent = "Se connecter";
    if (!ok) {
      document.getElementById("admin-login-error").textContent = "Token incorrect.";
      input.value = "";
      input.focus();
      return;
    }
    sessionStorage.setItem(TOKEN_KEY, candidate);
    token = candidate;
    await enterAdmin();
  }

  // ============================================================
  // ÉTAPE 2 — une fois vérifié : on charge les données et on
  // construit le panneau d'administration (jamais avant).
  // ============================================================
  // Structure vide utilisée UNIQUEMENT si la base KV n'a encore jamais été
  // sauvegardée (aucune donnée par défaut, juste la forme attendue pour que
  // l'admin puisse commencer à remplir le contenu depuis zéro).
  const EMPTY_SITE_DATA = {
    serverIp: "", grades: [], news: [], crafts: [], features: [],
    commands: [], gallery: [], faqs: [], nextEvent: null, nextEventLabel: ""
  };

  async function enterAdmin() {
    document.getElementById("admin-login").classList.add("hidden");
    const app = document.getElementById("admin-app");
    app.classList.remove("hidden");
    app.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--parchment-dark);">Chargement des données…</div>`;

    let data;
    try {
      const res = await fetch(`${window.API_BASE}/api/data`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      if (res.ok) {
        data = await res.json();
      } else if (res.status === 404) {
        // Base KV vide : 1ère utilisation, on part d'une structure vierge.
        data = EMPTY_SITE_DATA;
      } else {
        throw new Error("api_error");
      }
    } catch (e) {
      app.innerHTML = `
        <div style="padding:3rem 1.5rem;text-align:center;">
          <p style="color:var(--parchment-dark);margin-bottom:1rem;">Impossible de contacter le serveur (Worker Cloudflare injoignable).</p>
          <button class="btn btn-primary" id="admin-retry-btn">Réessayer</button>
        </div>`;
      document.getElementById("admin-retry-btn")?.addEventListener("click", enterAdmin);
      return;
    }

    working = JSON.parse(JSON.stringify(data));
    dirty = false;
    buildApp();
  }

  function logout() {
    if (dirty && !confirm("Des modifications ne sont pas sauvegardées. Se déconnecter quand même ?")) return;
    showLogin("");
  }

  // ============================================================
  // CONSTRUCTION DE L'INTERFACE
  // ============================================================
  function buildApp() {
    const app = document.getElementById("admin-app");
    app.innerHTML = "";

    const header = el("div", { class: "admin-header" }, [
      el("div", { class: "admin-header-left" }, [
        el("img", { src: "logo2.png", alt: "WC" }),
        el("h1", { class: "pixel" }, "Administration WellCraft")
      ]),
      el("button", { class: "btn btn-secondary btn-small", onclick: logout }, "Se déconnecter")
    ]);

    const main = el("div", { class: "admin-main", id: "admin-main" });

    const tabsBar = el("div", { class: "admin-tabs", id: "admin-tabs" });
    TABS.forEach(t => {
      tabsBar.appendChild(el("button", {
        class: `admin-tab-btn${t.key === currentTab ? " active" : ""}`,
        onclick: () => { currentTab = t.key; renderCurrentTab(); }
      }, t.label));
    });

    const panel = el("div", { id: "admin-panel" });
    main.appendChild(tabsBar);
    main.appendChild(panel);

    const savebar = el("div", { class: "savebar", id: "admin-savebar" }, [
      el("span", { class: "savebar-text", id: "savebar-text" }, "Modifications non sauvegardées"),
      el("button", { class: "btn btn-primary", id: "admin-save-btn", onclick: saveData }, "💾 Sauvegarder")
    ]);

    app.appendChild(header);
    app.appendChild(main);
    app.appendChild(savebar);

    renderCurrentTab();
  }

  function updateSaveBar() {
    const bar = document.getElementById("admin-savebar");
    if (!bar) return;
    bar.classList.toggle("visible", dirty);
  }

  function renderCurrentTab() {
    document.querySelectorAll(".admin-tab-btn").forEach((btn, i) => {
      btn.classList.toggle("active", TABS[i].key === currentTab);
    });
    const panel = document.getElementById("admin-panel");
    panel.innerHTML = "";

    if (currentTab === "gallery") return renderGalleryTab(panel);
    if (currentTab === "config") return renderConfigTab(panel);
    return renderCollectionTab(panel, currentTab);
  }

  // ---------- Onglets collections génériques (grades, crafts, news, features, commands, faqs) ----------
  function renderCollectionTab(panel, key) {
    const schema = SCHEMAS[key];
    const list = working[key];

    panel.appendChild(el("h2", { class: "admin-panel-title" }, schema.title));
    if (schema.hint) panel.appendChild(el("p", { class: "admin-panel-hint" }, schema.hint));

    list.forEach((item, index) => {
      panel.appendChild(renderItemCard(schema, item, index, list));
    });

    panel.appendChild(renderAddForm(schema, list));
  }

  function renderItemCard(schema, item, index, list) {
    const card = el("div", { class: "item-card" });
    const body = el("div", { class: "item-card-body" });
    const labelSpan = el("span", { class: "item-card-label" }, schema.itemLabel(item));

    schema.fields.forEach(field => {
      const onFieldChange = field.key === schema.labelField
        ? () => { markDirty(); labelSpan.textContent = schema.itemLabel(item); }
        : () => markDirty();
      body.appendChild(renderField(field, item, onFieldChange));
    });

    const head = el("div", { class: "item-card-head" }, [
      labelSpan,
      el("div", { class: "item-card-actions" }, [
        el("button", {
          class: "btn btn-secondary btn-small", title: "Monter",
          onclick: (e) => { e.stopPropagation(); if (index > 0) { [list[index - 1], list[index]] = [list[index], list[index - 1]]; markDirty(); renderCurrentTab(); } }
        }, "▲"),
        el("button", {
          class: "btn btn-secondary btn-small", title: "Descendre",
          onclick: (e) => { e.stopPropagation(); if (index < list.length - 1) { [list[index + 1], list[index]] = [list[index], list[index + 1]]; markDirty(); renderCurrentTab(); } }
        }, "▼"),
        el("button", {
          class: "btn btn-secondary btn-small",
          onclick: (e) => { e.stopPropagation(); card.classList.toggle("open"); }
        }, "✏️"),
        el("button", {
          class: "btn btn-danger btn-small",
          onclick: (e) => {
            e.stopPropagation();
            if (confirm(`Supprimer « ${schema.itemLabel(item)} » ?`)) {
              list.splice(index, 1);
              markDirty();
              renderCurrentTab();
            }
          }
        }, "🗑️")
      ])
    ]);
    head.addEventListener("click", () => card.classList.toggle("open"));

    card.appendChild(head);
    card.appendChild(body);
    return card;
  }

  function renderField(field, item, onChange) {
    const wrap = el("div", { class: "field" });
    wrap.appendChild(el("label", {}, field.label));

    if (field.type === "select") {
      const select = el("select", {
        onchange: (e) => { item[field.key] = e.target.value; onChange(); renderCurrentTab(); }
      });
      field.options.forEach(opt => {
        select.appendChild(el("option", { value: opt, ...(item[field.key] === opt ? { selected: "selected" } : {}) }, opt));
      });
      wrap.appendChild(select);
    } else if (field.type === "textarea") {
      const ta = el("textarea", {
        oninput: (e) => { item[field.key] = e.target.value; onChange(); }
      });
      ta.value = item[field.key] || "";
      wrap.appendChild(ta);
    } else if (field.type === "list") {
      const ta = el("textarea", {
        oninput: (e) => { item[field.key] = e.target.value.split("\n").map(s => s.trim()).filter(Boolean); onChange(); }
      });
      ta.value = (item[field.key] || []).join("\n");
      wrap.appendChild(ta);
      wrap.appendChild(el("div", { class: "field-hint" }, "Une valeur par ligne."));
    } else {
      const input = el("input", {
        type: "text",
        oninput: (e) => { item[field.key] = e.target.value; onChange(); }
      });
      input.value = item[field.key] || "";
      wrap.appendChild(input);
    }
    return wrap;
  }

  function renderAddForm(schema, list) {
    const form = el("div", { class: "add-form" });
    form.appendChild(el("p", { class: "add-form-title" }, `+ Ajouter : ${schema.title.toLowerCase()}`));
    form.appendChild(el("button", {
      class: "btn btn-primary btn-small",
      onclick: () => {
        list.push(schema.blank());
        markDirty();
        renderCurrentTab();
        // ouvre directement la carte nouvellement créée
        requestAnimationFrame(() => {
          const cards = document.querySelectorAll(".item-card");
          const last = cards[cards.length - 1];
          if (last) last.classList.add("open");
        });
      }
    }, "Ajouter un élément"));
    return form;
  }

  // ---------- Onglet Galerie (liste d'URLs simples) ----------
  function renderGalleryTab(panel) {
    panel.appendChild(el("h2", { class: "admin-panel-title" }, "Galerie de constructions"));
    panel.appendChild(el("p", { class: "admin-panel-hint" }, "Colle des liens d'images (.png, .jpg...) hébergées où tu veux (Discord CDN, Imgur, ton propre serveur...)."));

    const list = working.gallery;
    const container = el("div", {});
    list.forEach((url, index) => {
      container.appendChild(el("div", { class: "gallery-row" }, [
        el("input", {
          type: "text", value: url,
          oninput: (e) => { list[index] = e.target.value; markDirty(); }
        }),
        el("button", {
          class: "btn btn-danger btn-small",
          onclick: () => { list.splice(index, 1); markDirty(); renderCurrentTab(); }
        }, "🗑️")
      ]));
    });
    panel.appendChild(container);

    panel.appendChild(el("button", {
      class: "btn btn-primary btn-small", style: "margin-top:0.5rem;",
      onclick: () => { list.push(""); markDirty(); renderCurrentTab(); }
    }, "+ Ajouter une image"));
  }

  // ---------- Onglet Config (IP serveur + prochain évènement) ----------
  function renderConfigTab(panel) {
    panel.appendChild(el("h2", { class: "admin-panel-title" }, "Serveur & évènement"));

    const card = el("div", { class: "item-card open" });
    const body = el("div", { class: "item-card-body" });

    body.appendChild(renderSimpleField("IP du serveur", "text", working.serverIp, v => { working.serverIp = v; markDirty(); }));
    body.appendChild(renderSimpleField(
      "Prochain évènement (laisse vide si aucun)", "datetime-local",
      working.nextEvent ? toDatetimeLocal(working.nextEvent) : "",
      v => { working.nextEvent = v ? v : null; markDirty(); }
    ));
    body.appendChild(renderSimpleField("Nom de l'évènement", "text", working.nextEventLabel, v => { working.nextEventLabel = v; markDirty(); }));

    card.appendChild(body);
    panel.appendChild(card);
  }

  function toDatetimeLocal(isoString) {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function renderSimpleField(label, type, value, onChange) {
    const wrap = el("div", { class: "field" });
    wrap.appendChild(el("label", {}, label));
    const input = el("input", { type, oninput: (e) => onChange(e.target.value) });
    input.value = value || "";
    wrap.appendChild(input);
    return wrap;
  }

  // ============================================================
  // SAUVEGARDE
  // ============================================================
  async function saveData() {
    if (saving) return;
    saving = true;
    const btn = document.getElementById("admin-save-btn");
    btn.disabled = true;
    btn.textContent = "Sauvegarde…";

    try {
      const res = await fetch(`${window.API_BASE}/api/data`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(working)
      });
      if (res.status === 401) {
        showToast("Session expirée, reconnecte-toi.", "error");
        showLogin("Session expirée, reconnecte-toi.");
        return;
      }
      if (!res.ok) throw new Error("save_failed");
      dirty = false;
      updateSaveBar();
      showToast("✅ Modifications sauvegardées.");
    } catch (e) {
      showToast("❌ Échec de la sauvegarde. Réessaie.", "error");
    } finally {
      saving = false;
      btn.disabled = false;
      btn.textContent = "💾 Sauvegarder";
    }
  }

  // ============================================================
  // DÉMARRAGE — si un token est déjà en session, on le revérifie
  // silencieusement côté serveur avant d'ouvrir quoi que ce soit.
  // ============================================================
  document.getElementById("admin-login-form").addEventListener("submit", handleLoginSubmit);

  (async function init() {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (!stored) return;
    const ok = await verifyToken(stored);
    if (ok) {
      token = stored;
      await enterAdmin();
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  })();
})();
