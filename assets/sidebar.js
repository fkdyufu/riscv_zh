(() => {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;

  const main = document.querySelector("main");
  const desktop = window.matchMedia("(min-width: 841px)");
  const storageKey = "xv6-sidebar-collapsed";
  const body = document.body;
  const sidebarId = sidebar.id || "site-sidebar";
  sidebar.id = sidebarId;

  const toggle = document.createElement("button");
  toggle.className = "sidebar-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-controls", sidebarId);

  const overlay = document.createElement("button");
  overlay.className = "sidebar-overlay";
  overlay.type = "button";
  overlay.tabIndex = -1;
  overlay.setAttribute("aria-label", "关闭章节导航");

  const isOpen = () => desktop.matches
    ? !body.classList.contains("sidebar-collapsed")
    : body.classList.contains("sidebar-open");

  const updateToggle = () => {
    const open = isOpen();
    const mobileOpen = !desktop.matches && open;
    sidebar.toggleAttribute("inert", !open);
    sidebar.setAttribute("aria-hidden", String(!open));
    if (main) {
      main.toggleAttribute("inert", mobileOpen);
      if (mobileOpen) main.setAttribute("aria-hidden", "true");
      else main.removeAttribute("aria-hidden");
    }
    toggle.textContent = open ? "×" : "☰";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "关闭章节导航" : "打开章节导航");
    toggle.title = open ? "关闭章节导航" : "打开章节导航";
  };

  try {
    body.classList.toggle("sidebar-collapsed", localStorage.getItem(storageKey) === "true");
  } catch (_) {
    // Storage may be unavailable for local files or in privacy mode.
  }

  body.classList.add("sidebar-enhanced");
  body.append(toggle, overlay);
  updateToggle();

  toggle.addEventListener("click", () => {
    if (desktop.matches) {
      body.classList.toggle("sidebar-collapsed");
      try {
        localStorage.setItem(storageKey, String(body.classList.contains("sidebar-collapsed")));
      } catch (_) {}
    } else {
      body.classList.toggle("sidebar-open");
    }
    updateToggle();
  });

  const closeMobileSidebar = () => {
    if (!desktop.matches && body.classList.contains("sidebar-open")) {
      body.classList.remove("sidebar-open");
      updateToggle();
      toggle.focus();
    }
  };

  overlay.addEventListener("click", closeMobileSidebar);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileSidebar();
  });
  desktop.addEventListener("change", () => {
    body.classList.remove("sidebar-open");
    updateToggle();
  });
})();
