// =========================================================
// clinicaRamdom — Recordatorios
// Datos de ejemplo: reemplaza RECORDATORIOS con la respuesta
// real de tu backend (citas de mañana) cuando esté lista.
// =========================================================

const CLINICA_NOMBRE = "Clínica clinicaRamdom";

const RECORDATORIOS = [
  {
    nombre: "Isabella Gómez Peña",
    tipo: "Seguimiento",
    horaInicio: "09:00",
    horaFin: "09:30",
    telefono: "+58 412-3345566",
    email: "isabella.gp@correo.com",
    doctor: "Dr. Ramírez",
    lugar: "Torre Médica San Rafael, Piso 4 · Caracas",
  },
  {
    nombre: "Carlos Alberto Rojas",
    tipo: "Consulta general",
    horaInicio: "10:00",
    horaFin: "10:30",
    telefono: "+58 424-9876543",
    email: "carlos.rojas@correo.com",
    doctor: "Dra. Fernández",
    lugar: "Torre Médica San Rafael, Piso 4 · Caracas",
  },
  {
    nombre: "Ricardo Mendoza Salas",
    tipo: "Control",
    horaInicio: "11:15",
    horaFin: "11:45",
    telefono: "+58 416-7788990",
    email: "r.mendoza@correo.com",
    doctor: "Dr. Ramírez",
    lugar: "Torre Médica San Rafael, Piso 4 · Caracas",
  },
];

const ICON_CLOCK = '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.4"/><path d="M10 6v4l3 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
const ICON_PHONE = '<svg viewBox="0 0 20 20" fill="none"><path d="M5 3.5c-.9 0-1.6.8-1.4 1.7.6 2.9 2 5.6 4.2 7.8s4.9 3.6 7.8 4.2c.9.2 1.7-.5 1.7-1.4v-1.6c0-.6-.4-1.1-1-1.2l-2.4-.5c-.5-.1-1 .1-1.3.5l-.6.8a10 10 0 0 1-4-4l.8-.6c.4-.3.6-.8.5-1.3l-.5-2.4c-.1-.6-.6-1-1.2-1H5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>';
const ICON_MAIL = '<svg viewBox="0 0 20 20" fill="none"><rect x="2.5" y="4.5" width="15" height="11" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M3.5 5.5 10 11l6.5-5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_CHEVRON = '<svg class="rec-toggle-arrow" viewBox="0 0 12 8" fill="none"><path d="M1 1.5 6 6l5-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// ===== 🐞 Debug: log visible en pantalla, no solo en consola =====
function debugLog(mensaje, tipo = "info") {
  const body = document.getElementById("rec-debug-body");
  const vacio = body.querySelector(".rec-debug-empty");
  if (vacio) vacio.remove();

  const hora = new Date().toLocaleTimeString("es", { hour12: false });
  const linea = document.createElement("div");
  linea.className = `rec-debug-line${tipo === "warn" ? " rec-debug-line--warn" : ""}`;
  linea.textContent = `[${hora}] ${mensaje}`;
  body.appendChild(linea);
  body.scrollTop = body.scrollHeight;

  console.log(`[Recordatorios] ${mensaje}`); // también queda en la consola del navegador
}

function formatearFechaManana() {
  const manana = new Date();
  manana.setDate(manana.getDate() + 1);
  const texto = manana.toLocaleDateString("es", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function generarMensajeWhatsapp(r) {
  return `Hola ${r.nombre}, le recordamos su cita mañana ${formatearFechaManana()} a las ${r.horaInicio} con el ${r.doctor}. Confirme respondiendo SI. Gracias.`;
}

function generarMensajeEmail(r) {
  return `Estimado(a) ${r.nombre},

Le recordamos su cita programada para mañana ${formatearFechaManana()} a las ${r.horaInicio} en ${r.lugar} con el ${r.doctor}.

Por favor confirme su asistencia.

Atentamente,
${CLINICA_NOMBRE}`;
}

function buildCard(r, index) {
  const card = document.createElement("article");
  card.className = "rec-card";
  card.dataset.index = index;

  const msgWhatsapp = generarMensajeWhatsapp(r);
  const msgEmail = generarMensajeEmail(r);

  card.innerHTML = `
    <div class="rec-card-top">
      <span class="rec-avatar">${r.nombre.split(" ").filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join("")}</span>
      <div class="rec-info">
        <p class="rec-nombre">${r.nombre}</p>
        <p class="rec-tipo">${r.tipo}</p>
        <div class="rec-meta">
          <span>${ICON_CLOCK} ${r.horaInicio} – ${r.horaFin}</span>
          <span>${ICON_PHONE} ${r.telefono}</span>
          <span>${ICON_MAIL} ${r.email}</span>
        </div>
      </div>
    </div>

    <button type="button" class="rec-toggle" data-toggle="${index}">
      ${ICON_CHEVRON} Ver mensajes preparados
    </button>

    <div class="rec-mensajes">
      <div>
        <p class="rec-mensaje-label rec-mensaje-label--whatsapp">WhatsApp</p>
        <textarea class="rec-mensaje-box" id="msg-wa-${index}" data-original="${encodeURIComponent(msgWhatsapp)}">${msgWhatsapp}</textarea>
        <div class="rec-mensaje-footer">
          <div class="rec-mensaje-botones">
            <button type="button" class="btn-restablecer" data-reset="wa-${index}">Restablecer</button>
            <button type="button" class="btn-enviar btn-enviar--whatsapp" data-enviar="wa-${index}" data-canal="whatsapp" data-nombre="${r.nombre}" data-telefono="${r.telefono}">Enviar</button>
          </div>
          <span class="rec-estado" id="estado-wa-${index}">Sin enviar</span>
        </div>
      </div>
      <div>
        <p class="rec-mensaje-label rec-mensaje-label--email">Email</p>
        <textarea class="rec-mensaje-box" id="msg-email-${index}" data-original="${encodeURIComponent(msgEmail)}">${msgEmail}</textarea>
        <div class="rec-mensaje-footer">
          <div class="rec-mensaje-botones">
            <button type="button" class="btn-restablecer" data-reset="email-${index}">Restablecer</button>
            <button type="button" class="btn-enviar btn-enviar--email" data-enviar="email-${index}" data-canal="email" data-nombre="${r.nombre}" data-email="${r.email}">Enviar</button>
          </div>
          <span class="rec-estado" id="estado-email-${index}">Sin enviar</span>
        </div>
      </div>
    </div>
  `;

  return card;
}

function renderRecordatorios(lista) {
  const contenedor = document.getElementById("rec-list");
  contenedor.innerHTML = "";
  lista.forEach((r, i) => contenedor.appendChild(buildCard(r, i)));
  debugLog(`Cargados ${lista.length} recordatorios de mañana (${formatearFechaManana()}).`);
}

// ===== Abrir/cerrar el acordeón de mensajes =====
function wireUpToggle() {
  document.getElementById("rec-list").addEventListener("click", (e) => {
    const toggleBtn = e.target.closest("[data-toggle]");
    if (toggleBtn) {
      const card = toggleBtn.closest(".rec-card");
      card.classList.toggle("is-open");
      debugLog(`Tarjeta #${toggleBtn.dataset.toggle} ${card.classList.contains("is-open") ? "abierta" : "cerrada"}.`);
    }
  });
}

// ===== Restablecer un mensaje a su versión generada original =====
function wireUpReset() {
  document.getElementById("rec-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-reset]");
    if (!btn) return;

    const clave = btn.dataset.reset; // ej: "wa-0" o "email-0"
    const textarea = document.getElementById(`msg-${clave}`);
    textarea.value = decodeURIComponent(textarea.dataset.original);
    debugLog(`Mensaje "${clave}" restablecido a su versión original.`);
  });
}

// ===== Enviar: pide confirmación con el texto YA editado, y muestra en debug qué se manda =====
function wireUpEnviar() {
  document.getElementById("rec-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-enviar]");
    if (!btn) return;

    const clave = btn.dataset.enviar;
    const canal = btn.dataset.canal;
    const textarea = document.getElementById(`msg-${clave}`);
    const textoFinal = textarea.value.trim();

    if (!textoFinal) {
      debugLog(`Intento de enviar "${clave}" con el mensaje vacío. Cancelado.`, "warn");
      alert("El mensaje está vacío, escribe algo antes de enviar.");
      return;
    }

    const confirmado = confirm(
      `¿Enviar este mensaje por ${canal === "whatsapp" ? "WhatsApp" : "Email"} a ${btn.dataset.nombre}?\n\n---\n${textoFinal}\n---`
    );

    if (!confirmado) {
      debugLog(`Envío de "${clave}" cancelado por el usuario en la confirmación.`, "warn");
      return;
    }

    if (canal === "whatsapp") {
      const numero = btn.dataset.telefono.replace(/[^0-9]/g, "");
      const link = `https://wa.me/${numero}?text=${encodeURIComponent(textoFinal)}`;
      debugLog(`Enviando WhatsApp a +${numero} → ${link}`);
      window.open(link, "_blank", "noopener");
    } else {
      const link = `mailto:${btn.dataset.email}?subject=${encodeURIComponent("Recordatorio de cita")}&body=${encodeURIComponent(textoFinal)}`;
      debugLog(`Abriendo cliente de correo para ${btn.dataset.email} → ${link}`);
      window.location.href = link;
    }

    const estado = document.getElementById(`estado-${clave}`);
    estado.textContent = `Enviado a las ${new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}`;
    estado.classList.add("is-enviado");
  });
}

function wireUpDebugClear() {
  document.getElementById("rec-debug-clear").addEventListener("click", () => {
    document.getElementById("rec-debug-body").innerHTML = '<span class="rec-debug-empty">Sin actividad todavía.</span>';
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("rec-fecha").textContent = formatearFechaManana();
  document.getElementById("rec-debug-body").innerHTML = '<span class="rec-debug-empty">Sin actividad todavía.</span>';

  renderRecordatorios(RECORDATORIOS);
  wireUpToggle();
  wireUpReset();
  wireUpEnviar();
  wireUpDebugClear();
});