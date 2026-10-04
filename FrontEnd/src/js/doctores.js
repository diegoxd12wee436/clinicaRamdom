// =========================================================
// clinicaRamdom — Doctores
// Los datos vienen del backend: GET /api/Doctores
// =========================================================

let DOCTORS = [];

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

// Adapta lo que devuelve el backend a lo que usa la tabla
function fromApi(d) {
  return {
    id: d.id,
    nombre: d.name ?? "",
    especialidad: d.especialidad ?? "",
    horario: "—",     // pendiente: el backend aún no guarda horario
    pacientes: "—",   // pendiente: se calculará con las consultas
    estado: "activo", // pendiente: el backend aún no guarda estado
  };
}

async function loadDoctors() {
  try {
    const res = await fetch("/api/Doctores");
    if (!res.ok) throw new Error("Error " + res.status);
    const data = await res.json();
    DOCTORS = data.map(fromApi);
  } catch (err) {
    console.error("No se pudieron cargar los doctores:", err);
    DOCTORS = [];
  }
  renderDoctors(DOCTORS);
}

function initials(name) {
  const clean = name.replace(/[{}]/g, "").trim();
  const parts = clean.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}

function buildRow(doctor) {
  const tr = document.createElement("tr");
  const estadoLabel = doctor.estado === "activo" ? "Activo" : "Inactivo";

  tr.innerHTML = `
    <td>
      <div class="doctor-cell">
        <span class="doctor-avatar">${initials(doctor.nombre)}</span>
        <div>
          <p class="doctor-name">${escapeHtml(doctor.nombre)}</p>
        </div>
      </div>
    </td>
    <td>${escapeHtml(doctor.especialidad)}</td>
    <td>${escapeHtml(doctor.horario)}</td>
    <td>${escapeHtml(doctor.pacientes)}</td>
    <td><span class="status-dot status-dot--${doctor.estado}">${estadoLabel}</span></td>
    <td><a href="#" class="row-action">Ver perfil →</a></td>
  `;

  return tr;
}

function renderDoctors(list) {
  const body = document.getElementById("doctores-body");
  body.innerHTML = "";
  list.forEach((doctor) => body.appendChild(buildRow(doctor)));
  document.querySelector('[data-field="doctores-count"]').textContent = DOCTORS.length;
}

function wireUpActions() {
  const dialog = document.getElementById("dialog-doctor");
  const form = document.getElementById("form-doctor");
  const errorBox = document.getElementById("doc-error");

  document.getElementById("btn-nuevo-doctor").addEventListener("click", () => {
    form.reset();
    errorBox.textContent = "";
    dialog.showModal();
  });

  document.getElementById("doc-cancelar").addEventListener("click", () => {
    dialog.close();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.textContent = "";

    const body = {
      name: document.getElementById("doc-name").value.trim(),
      especialidad: document.getElementById("doc-especialidad").value.trim(),
      numero: document.getElementById("doc-numero").value.trim(),
      isEstudent: false,
      email: document.getElementById("doc-email").value.trim() || null,
      cedula: document.getElementById("doc-cedula").value.trim(),
    };

    try {
      const res = await fetch("/api/Doctores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Error " + res.status);
      dialog.close();
      await loadDoctors();
    } catch (err) {
      console.error(err);
      errorBox.textContent = "No se pudo guardar el doctor. Intenta de nuevo.";
    }
  });

  document.getElementById("search-input").addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    const filtered = DOCTORS.filter(
      (d) =>
        d.nombre.toLowerCase().includes(query) ||
        d.especialidad.toLowerCase().includes(query)
    );
    renderDoctors(filtered);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  wireUpActions();
  loadDoctors();
});