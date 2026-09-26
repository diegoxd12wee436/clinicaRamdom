// =========================================================
// clinicaRamdom — Pacientes
// Trae los pacientes desde tu API real (api/Pacientes).
// =========================================================

const API_URL = "/api/Pacientes";

let PACIENTES = []; // cache local para poder filtrar sin volver a pedir a la API

const ICON_PHONE = '<svg class="contacto-icon" viewBox="0 0 20 20" fill="none"><path d="M5 3.5c-.9 0-1.6.8-1.4 1.7.6 2.9 2 5.6 4.2 7.8s4.9 3.6 7.8 4.2c.9.2 1.7-.5 1.7-1.4v-1.6c0-.6-.4-1.1-1-1.2l-2.4-.5c-.5-.1-1 .1-1.3.5l-.6.8a10 10 0 0 1-4-4l.8-.6c.4-.3.6-.8.5-1.3l-.5-2.4c-.1-.6-.6-1-1.2-1H5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>';
const ICON_MAIL = '<svg class="contacto-icon" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="4.5" width="15" height="11" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M3.5 5.5 10 11l6.5-5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_TRASH = '<svg viewBox="0 0 20 20" fill="none"><path d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m1.5 0-.6 9a1.5 1.5 0 0 1-1.5 1.4H8.6A1.5 1.5 0 0 1 7.1 15L6.5 6h7Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function initials(name) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}

function calcularEdad(fechaNacimiento) {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const noHaCumplidoAun =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (noHaCumplidoAun) edad--;
  return edad;
}

function formatearNacimiento(fecha) {
  const d = new Date(fecha);
  return "Nac. " + d.toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
}

function buildRow(paciente) {
  const tr = document.createElement("tr");
  const alergias = (paciente.alergiasConocidas || "").trim();

  const celdaAlergias = alergias
    ? `<span class="badge-alergia">⚠ ${alergias}</span>`
    : `<span class="sin-alergias">Sin alergias</span>`;

  const cantidadConsultas = paciente.consultas?.length ?? 0;

  tr.innerHTML = `
    <td>
      <div class="paciente-cell">
        <span class="paciente-avatar">${initials(paciente.name)}</span>
        <div>
          <p class="paciente-name">${paciente.name}</p>
          <p class="paciente-nacimiento">${formatearNacimiento(paciente.fechaNacimiento)}</p>
        </div>
      </div>
    </td>
    <td>${paciente.cedula}</td>
    <td>${calcularEdad(paciente.fechaNacimiento)}</td>
    <td>
      <div class="contacto-cell">
        <span>${ICON_PHONE} ${paciente.numero ?? ""}</span>
        <span>${ICON_MAIL} ${paciente.email ?? ""}</span>
      </div>
    </td>
    <td>${celdaAlergias}</td>
    <td><span class="badge-consultas">${cantidadConsultas}</span></td>
    <td>
      <div class="pacientes-acciones">
        <button type="button" class="row-action" data-accion="editar" data-id="${paciente.id}">Editar</button>
        <a href="#" class="row-action">Ver ficha →</a>
        <button type="button" class="btn-borrar-fila" data-accion="borrar" data-id="${paciente.id}" aria-label="Borrar paciente">${ICON_TRASH}</button>
      </div>
    </td>
  `;

  return tr;
}

function renderPacientes(list) {
  const body = document.getElementById("pacientes-body");
  body.innerHTML = "";
  list.forEach((p) => body.appendChild(buildRow(p)));
  document.querySelector('[data-field="pacientes-count"]').textContent = list.length;
}

// ===== Carga inicial desde la API =====
async function cargarPacientes() {
  const respuesta = await fetch(API_URL);
  PACIENTES = await respuesta.json();
  renderPacientes(PACIENTES);
}

// ===== Modal: abrir / cerrar =====
const modal = document.getElementById("modal-paciente");
const form = document.getElementById("form-paciente");

function abrirModal(id) {
  form.reset();
  document.getElementById("f-id").value = "";

  if (id) {
    const p = PACIENTES.find((x) => x.id === id);
    document.getElementById("modal-titulo").textContent = "Editar paciente";
    document.getElementById("f-id").value = p.id;
    document.getElementById("f-name").value = p.name;
    document.getElementById("f-cedula").value = p.cedula;
    document.getElementById("f-fecha").value = p.fechaNacimiento?.split("T")[0] ?? "";
    document.getElementById("f-numero").value = p.numero ?? "";
    document.getElementById("f-email").value = p.email ?? "";
    document.getElementById("f-alergias").value = p.alergiasConocidas ?? "";
  } else {
    document.getElementById("modal-titulo").textContent = "Nuevo paciente";
  }

  modal.hidden = false;
}

function cerrarModal() {
  modal.hidden = true;
}

// ===== Guardar (POST si es nuevo, PUT si trae id) =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("f-id").value;
  const datos = {
    name: document.getElementById("f-name").value,
    cedula: document.getElementById("f-cedula").value,
    alergiasConocidas: document.getElementById("f-alergias").value,
    numero: document.getElementById("f-numero").value,
    email: document.getElementById("f-email").value,
    fechaNacimiento: document.getElementById("f-fecha").value,
  };

  if (id) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(id), ...datos }),
    });
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
  }

  cerrarModal();
  cargarPacientes();
});

// ===== Borrar =====
async function borrarPaciente(id) {
  if (!confirm("¿Seguro que quieres borrar este paciente?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  cargarPacientes();
}

// ===== Acciones de la tabla (delegación de eventos) =====
document.getElementById("pacientes-body").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-accion]");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  if (btn.dataset.accion === "editar") abrirModal(id);
  if (btn.dataset.accion === "borrar") borrarPaciente(id);
});

function wireUpActions() {
  document.getElementById("btn-nuevo-paciente").addEventListener("click", () => abrirModal());
  document.getElementById("modal-close").addEventListener("click", cerrarModal);
  document.getElementById("modal-cancelar").addEventListener("click", cerrarModal);

  document.getElementById("search-input").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    const filtrados = PACIENTES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.cedula.toLowerCase().includes(q) ||
        (p.numero ?? "").toLowerCase().includes(q)
    );
    renderPacientes(filtrados);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarPacientes();
  wireUpActions();
});