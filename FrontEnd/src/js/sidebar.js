// =========================================================
// clinicaRamdom — Sidebar compartido
// Una sola fuente de verdad para el navbar: agrega o cambia
// una página aquí y se actualiza en TODAS las pantallas.
//
// Uso en cada HTML:
//   <aside class="sidebar" id="sidebar-root"></aside>
//   <script src="sidebar.js"></script>
//   ... (nada más, se auto-inicializa con DOMContentLoaded)
// =========================================================

class Sidebar {
  // href: "#" = pantalla aún no construida (no navega todavía)
  static ITEMS = [
    {
      label: "Dashboard",
      href: "dashboard.html",
      icon: '<rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>',
    },
    {
      label: "Agenda",
      href: "agenda.html",
      icon: '<rect x="2.5" y="3.5" width="15" height="14" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M2.5 7.5h15" stroke="currentColor" stroke-width="1.5"/><path d="M6 2v3M14 2v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    },
    {
      label: "Pacientes",
      href: "#",
      icon: '<circle cx="10" cy="6.5" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    },
    {
      label: "Doctores",
      href: "doctores.html",
      sub: true,
    },
    {
      label: "Recordatorio",
      href: "#",
      icon: '<path d="M5 8a5 5 0 0 1 10 0c0 3 1 4.5 1.5 5.5H3.5C4 12.5 5 11 5 8Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 16a2 2 0 0 0 4 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    },
    {
      label: "Ajustes",
      href: "#",
      icon: '<circle cx="10" cy="10" r="2.4" stroke="currentColor" stroke-width="1.5"/><path d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4M15.3 15.3l-1.4-1.4M6.1 6.1 4.7 4.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    },
  ];

  // El nombre de archivo de la página actual, ej. "agenda.html"
  static currentPage() {
    const file = window.location.pathname.split("/").pop();
    return file === "" ? "dashboard.html" : file;
  }

  static buildLink(item, currentPage) {
    const isActive = item.href === currentPage;
    const activeClass = isActive ? " is-active" : "";
    const activeAttr = isActive ? ' aria-current="page"' : "";
    const subClass = item.sub ? " nav-link--sub" : "";

    const iconHtml = item.icon
      ? `<svg class="nav-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">${item.icon}</svg>`
      : "";

    return `
      <li>
        <a href="${item.href}" class="nav-link${subClass}${activeClass}"${activeAttr}>
          ${iconHtml}
          <span>${item.label}</span>
        </a>
      </li>`;
  }

  static render(containerId = "sidebar-root") {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Sidebar: no se encontró #${containerId} en esta página`);
      return;
    }

    const currentPage = Sidebar.currentPage();
    const linksHtml = Sidebar.ITEMS.map((item) => Sidebar.buildLink(item, currentPage)).join("");

    container.innerHTML = `
      <div class="brand">
        <div class="brand-logo" aria-hidden="true"></div>
        <span class="brand-name">LOGO</span>
      </div>
      <nav class="nav" aria-label="Navegación principal">
        <ul class="nav-list">${linksHtml}</ul>
      </nav>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => Sidebar.render());