// =========================================================
// clinicaRamdom — Agenda (semana + mes funcionales, + diálogo)
// Datos de ejemplo: reemplaza APPOINTMENTS con la respuesta
// real de tu backend cuando esté listo.
// =========================================================

const STATUS = [
  { key: "programada", label: "Programada" },
  { key: "espera", label: "En espera" },
  { key: "consulta", label: "En consulta" },
  { key: "atendida", label: "Atendida" },
  { key: "cancelada", label: "Cancelada" },
  { key: "no-asistio", label: "No asistió" },
];

const DAY_LABELS = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];
const MONTH_ABBR = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."];
const MONTH_FULL = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Franja horaria de la clínica
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

// ---------- Helpers de fecha ----------

function pad(n) {
  return String(n).padStart(2, "0");
}

function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfWeek(date) {
  const d = new Date(date);
  const dow = (d.getDay() + 6) % 7; // lunes = 0
  d.setDate(d.getDate() - dow);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function addMonths(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}

// ---------- Datos de ejemplo (relativos a hoy) ----------

const TODAY = new Date();
const DEMO_WEEK_START = startOfWeek(TODAY);

const APPOINTMENTS = [
  { date: toISODate(addDays(DEMO_WEEK_START, 0)), hour: "08:00", estado: "programada", nombre: "{nombre}", razon: "{razon visita}" },
  { date: toISODate(addDays(DEMO_WEEK_START, 1)), hour: "10:00", estado: "consulta", nombre: "{nombre}", razon: "{razon visita}" },
  { date: toISODate(addDays(DEMO_WEEK_START, 3)), hour: "12:00", estado: "atendida", nombre: "{nombre}", razon: "{razon visita}" },
  { date: toISODate(TODAY), hour: "09:00", estado: "espera", nombre: "{nombre}", razon: "{razon visita}" },
  { date: toISODate(TODAY), hour: "15:00", estado: "no-asistio", nombre: "{nombre}", razon: "{razon visita}" },
  { date: toISODate(addDays(DEMO_WEEK_START, 2)), hour: "14:00", estado: "cancelada", nombre: "{nombre}", razon: "{razon visita}" },
];

// ---------- Estado de la pantalla ----------

const state = {
  view: "semana", // "semana" | "mes"
  refDate: new Date(),
};

// ---------- Render: encabezado / rango de fechas ----------

function renderRangeLabel() {
  const el = document.getElementById("agenda-range");

  if (state.view === "semana") {
    const start = startOfWeek(state.refDate);
    const end = addDays(start, 6);
    el.textContent = `${start.getDate()} ${MONTH_ABBR[start.getMonth()]} — ${end.getDate()} ${MONTH_ABBR[end.getMonth()]} ${end.getFullYear()}`;
  } else {
    el.textContent = `${MONTH_FULL[state.refDate.getMonth()]} ${state.refDate.getFullYear()}`;
  }
}

// ---------- Render: leyenda ----------

function renderLegend() {
  const legend = document.getElementById("legend");
  legend.innerHTML = STATUS.map((s) => `<li><span class="dot dot--${s.key}"></span>${s.label}</li>`).join("");
}

// ---------- Render: vista semana ----------

function renderWeekView(container) {
  const start = startOfWeek(state.refDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  grid.appendChild(makeHeadCell("HORA"));
  days.forEach((day, i) => {
    const isToday = sameDay(day, TODAY);
    grid.appendChild(makeHeadCell(DAY_LABELS[i], day.getDate(), isToday));
  });

  HOURS.forEach((hour) => {
    const hourCell = document.createElement("div");
    hourCell.className = "cal-hour-label";
    hourCell.textContent = hour;
    grid.appendChild(hourCell);

    days.forEach((day) => {
      const cell = document.createElement("div");
      cell.className = "cal-cell";

      const dateISO = toISODate(day);
      const appt = APPOINTMENTS.find((a) => a.date === dateISO && a.hour === hour);
      if (appt) cell.appendChild(makeApptChip(appt));

      grid.appendChild(cell);
    });
  });

  container.appendChild(grid);
}

function makeHeadCell(label, num, isToday) {
  const el = document.createElement("div");
  el.className = "cal-head" + (isToday ? " is-today" : "");

  if (num === undefined) {
    el.innerHTML = `<p class="cal-head-day">${label}</p>`;
  } else {
    el.innerHTML = `
      <p class="cal-head-day">${label}</p>
      <p class="cal-head-num">${num}${isToday ? '<span class="cal-today-dot"></span>' : ""}</p>
    `;
  }
  return el;
}

function makeApptChip(appt) {
  const chip = document.createElement("div");
  chip.className = `cal-appt cal-appt--${appt.estado}`;
  chip.innerHTML = `${appt.nombre}<span class="cal-appt-reason">${appt.razon}</span>`;
  return chip;
}

// ---------- Render: vista mes ----------

function renderMonthView(container) {
  const wrap = document.createElement("div");
  wrap.className = "calendar-month";

  DAY_LABELS.forEach((label) => {
    const head = document.createElement("div");
    head.className = "month-head";
    head.textContent = label;
    wrap.appendChild(head);
  });

  const firstOfMonth = new Date(state.refDate.getFullYear(), state.refDate.getMonth(), 1);
  const gridStart = startOfWeek(firstOfMonth);

  for (let i = 0; i < 42; i++) {
    const day = addDays(gridStart, i);
    const isOutside = day.getMonth() !== state.refDate.getMonth();
    const isToday = sameDay(day, TODAY);
    const dateISO = toISODate(day);
    const dayAppts = APPOINTMENTS.filter((a) => a.date === dateISO);

    const cell = document.createElement("div");
    cell.className = "month-cell" + (isOutside ? " is-outside" : "") + (isToday ? " is-today" : "");

    const dotsHtml = dayAppts
      .slice(0, 4)
      .map((a) => `<span class="month-dot dot--${a.estado}"></span>`)
      .join("");
    const moreHtml = dayAppts.length > 4 ? `<span class="month-more">+${dayAppts.length - 4}</span>` : "";

    cell.innerHTML = `
      <p class="month-date">${day.getDate()}</p>
      <div class="month-dots">${dotsHtml}${moreHtml}</div>
    `;

    cell.addEventListener("click", () => {
      state.view = "semana";
      state.refDate = day;
      setActiveViewButton();
      renderAll();
    });

    wrap.appendChild(cell);
  }

  container.appendChild(wrap);
}

// ---------- Render orquestador ----------

function renderCalendar() {
  const cal = document.getElementById("calendar");
  cal.innerHTML = "";
  if (state.view === "semana") {
    renderWeekView(cal);
  } else {
    renderMonthView(cal);
  }
}

function renderAll() {
  renderRangeLabel();
  renderCalendar();
}

function setActiveViewButton() {
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.view === state.view);
  });
}

// ---------- Toolbar: navegación, vista, búsqueda ----------

function wireUpToolbar() {
  document.getElementById("btn-hoy").addEventListener("click", () => {
    state.refDate = new Date();
    renderAll();
  });

  document.getElementById("btn-prev").addEventListener("click", () => {
    state.refDate = state.view === "semana" ? addDays(state.refDate, -7) : addMonths(state.refDate, -1);
    renderAll();
  });

  document.getElementById("btn-next").addEventListener("click", () => {
    state.refDate = state.view === "semana" ? addDays(state.refDate, 7) : addMonths(state.refDate, 1);
    renderAll();
  });

  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.view = btn.dataset.view;
      setActiveViewButton();
      renderAll();
    });
  });

  document.getElementById("search-input").addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    document.querySelectorAll(".cal-appt").forEach((chip) => {
      const match = chip.textContent.toLowerCase().includes(query);
      chip.style.outline = query && match ? "2px solid #1e40af" : "none";
    });
  });
}

// ---------- Diálogo: Nueva cita ----------

function populateSelect(select, options, labelFn) {
  select.innerHTML = options.map((opt) => `<option value="${opt.value ?? opt}">${labelFn ? labelFn(opt) : opt}</option>`).join("");
}

function openModal() {
  const backdrop = document.getElementById("modal-backdrop");
  const form = document.getElementById("form-nueva-cita");
  form.reset();

  // Precarga con la fecha visible actualmente
  document.getElementById("input-fecha").value = toISODate(state.refDate);

  backdrop.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("input-paciente").focus();
}

function closeModal() {
  const backdrop = document.getElementById("modal-backdrop");
  backdrop.hidden = true;
  document.body.style.overflow = "";
  document.getElementById("btn-nueva-cita").focus();
}

function wireUpModal() {
  populateSelect(document.getElementById("input-hora"), HOURS);
  populateSelect(
    document.getElementById("input-estado"),
    STATUS.map((s) => ({ value: s.key, text: s.label })),
    (opt) => opt.text
  );

  document.getElementById("btn-nueva-cita").addEventListener("click", openModal);
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-cancel").addEventListener("click", closeModal);

  document.getElementById("modal-backdrop").addEventListener("click", (e) => {
    if (e.target.id === "modal-backdrop") closeModal();
  });

  document.addEventListener("keydown", (e) => {
    const backdrop = document.getElementById("modal-backdrop");
    if (e.key === "Escape" && !backdrop.hidden) closeModal();
  });

  document.getElementById("form-nueva-cita").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const fecha = form.fecha.value;
    if (!form.paciente.value.trim() || !fecha || !form.hora.value) return;

    APPOINTMENTS.push({
      date: fecha,
      hour: form.hora.value,
      estado: form.estado.value,
      nombre: form.paciente.value.trim(),
      razon: form.motivo.value.trim() || "{razon visita}",
    });

    // Lleva la vista a la fecha de la cita recién creada
    state.refDate = new Date(`${fecha}T00:00:00`);
    state.view = "semana";
    setActiveViewButton();
    renderAll();
    closeModal();

    // TODO: reemplazar el push en memoria por el POST real a tu API
  });
}

// ---------- Init ----------

document.addEventListener("DOMContentLoaded", () => {
  renderLegend();
  setActiveViewButton();
  renderAll();
  wireUpToolbar();
  wireUpModal();
});