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

const CEDULA_REGEX = /^\d{3}-\d{6}-\d{4}[A-Za-z]$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidCedula(value) {
  if (!CEDULA_REGEX.test(value)) return false;
  const dd = Number(value.slice(4, 6));
  const mm = Number(value.slice(6, 8));
  const yy = Number(value.slice(8, 10));
  if (mm < 1 || mm > 12 || dd < 1) return false;
  // el año viene con 2 dígitos: se acepta si la fecha existe en 19yy o 20yy
  const existe = (year) => {
    const d = new Date(year, mm - 1, dd);
    return d.getMonth() === mm - 1 && d.getDate() === dd;
  };
  return existe(1900 + yy) || existe(2000 + yy);
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

        if (!body.name || !body.especialidad || !body.numero || !body.cedula) {
      errorBox.textContent = "Completa nombre, especialidad, teléfono y cédula.";
      return;
    }
    if (body.email && !EMAIL_REGEX.test(body.email)) {
      errorBox.textContent = "El correo no es válido. Debe llevar @ y un dominio, por ejemplo nombre@correo.com.";
      return;
    }
    if (!isValidCedula(body.cedula)) {
      errorBox.textContent = "La cédula no es válida. Formato: 000-DDMMAA-0000A.";
      return;
    }

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