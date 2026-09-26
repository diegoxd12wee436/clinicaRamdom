// =========================================================
// clinicaRamdom — Doctores
// Datos de ejemplo: reemplaza DOCTORS con la respuesta real
// de tu backend cuando esté listo.
// =========================================================

const DOCTORS = [
  {
    nombre: "{nombre doctor}",
    especialidad: "{especialidad}",
    horario: "{horario}",
    pacientes: "{NUM}",
    estado: "activo",
  },
  {
    nombre: "{nombre doctor}",
    especialidad: "{especialidad}",
    horario: "{horario}",
    pacientes: "{NUM}",
    estado: "activo",
  },
  {
    nombre: "{nombre doctor}",
    especialidad: "{especialidad}",
    horario: "{horario}",
    pacientes: "{NUM}",
    estado: "inactivo",
  },
];

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
          <p class="doctor-name">${doctor.nombre}</p>
        </div>
      </div>
    </td>
    <td>${doctor.especialidad}</td>
    <td>${doctor.horario}</td>
    <td>${doctor.pacientes}</td>
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
  document.getElementById("btn-nuevo-doctor").addEventListener("click", () => {
    // TODO: abrir el modal / navegar al formulario de alta de doctor
    console.log("Nuevo doctor: pendiente de conectar con la pantalla correspondiente");
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
  renderDoctors(DOCTORS);
  wireUpActions();
});