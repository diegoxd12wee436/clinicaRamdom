// =========================================================
// clinicaRamdom — Dashboard
// Datos de ejemplo: reemplaza APPOINTMENTS (y los data-field)
// con la respuesta real de tu backend cuando esté listo.
// =========================================================

const DOCTOR = {
  name: "{name}",
  today: "{date formato MM/dd/yy}",
};

const SUMMARY = {
  citasHoy: "{NUM}",
  atendidas: "{NUM}",
  pendientes: "{NUM}",
  noAsistio: "{NUM}",
};

const STATUS = {
  atendido: { label: "Atendido", className: "badge--green" },
  vencida: { label: "Vencida", className: "badge--red" },
  programada: { label: "Programada", className: "badge--blue" },
};

const APPOINTMENTS = [
  {
    horaInicio: "hora",
    horaFin: "hora",
    nombre: "{nombre}",
    razon: "{razon visita}",
    estado: "atendido",
  },
  {
    horaInicio: "hora",
    horaFin: "hora",
    nombre: "{nombre}",
    razon: "{razon visita}",
    estado: "vencida",
  },
  {
    horaInicio: "hora",
    horaFin: "hora",
    nombre: "{nombre}",
    razon: "{razon visita}",
    estado: "programada",
  },
];

function fillSummary() {
  document.querySelector('[data-field="doctor-name"]').textContent = DOCTOR.name;
  document.querySelector('[data-field="today-date"]').textContent = DOCTOR.today;
  document.querySelector('[data-field="citas-hoy"]').textContent = SUMMARY.citasHoy;
  document.querySelector('[data-field="atendidas"]').textContent = SUMMARY.atendidas;
  document.querySelector('[data-field="pendientes"]').textContent = SUMMARY.pendientes;
  document.querySelector('[data-field="no-asistio"]').textContent = SUMMARY.noAsistio;
}

function buildRow(appt) {
  const status = STATUS[appt.estado] ?? STATUS.programada;

  const li = document.createElement("li");
  li.className = "agenda-row";

  li.innerHTML = `
    <div class="agenda-time">${appt.horaInicio} –<br>${appt.horaFin}</div>
    <div class="agenda-details">
      <p class="agenda-name">${appt.nombre}</p>
      <p class="agenda-reason">${appt.razon}</p>
    </div>
    ${appt.estado === "programada" ? '<a href="#" class="agenda-action">Atender →</a>' : ""}
    <span class="badge ${status.className}">${status.label}</span>
  `;

  return li;
}

function renderAgenda() {
  const list = document.getElementById("agenda-list");
  list.innerHTML = "";
  APPOINTMENTS.forEach((appt) => list.appendChild(buildRow(appt)));
}

function wireUpActions() {
  document.getElementById("btn-nueva-cita").addEventListener("click", () => {
    // TODO: abrir el modal / navegar a la pantalla de "Nueva cita"
    console.log("Nueva cita: pendiente de conectar con la pantalla correspondiente");
  });

  document.getElementById("search-input").addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    document.querySelectorAll("#agenda-list .agenda-row").forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? "" : "none";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fillSummary();
  renderAgenda();
  wireUpActions();
});