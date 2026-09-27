// clinicaRamdom — Auth (login / registro / recuperar / cambiar contraseña)
// Todo vive en una sola página; las "vistas" se muestran/ocultan con JS.
// Ajusta las rutas /api/auth/... si cambias el AuthController.

(function () {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let lastEmailForReset = ""; // recordamos el correo entre "forgot" y "reset"

  // ---------- navegación entre vistas ----------
  function goTo(viewName) {
    document.querySelectorAll(".view").forEach((v) => {
      v.hidden = v.dataset.view !== viewName;
    });
  }

  document.querySelectorAll("[data-goto]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(link.dataset.goto);
    });
  });

  // ---------- mostrar / ocultar contraseña (reutilizable) ----------
  document.querySelectorAll(".toggle-pass").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.toggle);
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.textContent = isHidden ? "🙈" : "👁";
    });
  });

  // ---------- helpers de validación / UI ----------
  function setFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.querySelector(`[data-error="${inputId}"]`);
    if (input) input.closest(".field")?.classList.toggle("has-error", Boolean(message));
    if (errorEl) errorEl.textContent = message || "";
  }

  function clearErrors(form) {
    form.querySelectorAll(".error-msg").forEach((el) => (el.textContent = ""));
    form.querySelectorAll(".field").forEach((el) => el.classList.remove("has-error"));
  }

  function setLoading(form, isLoading, labelIdle) {
    const btn = form.querySelector(".btn-login");
    const text = btn.querySelector(".btn-text");
    const spinner = btn.querySelector(".spinner");
    btn.disabled = isLoading;
    spinner.hidden = !isLoading;
    text.textContent = isLoading ? "Espera..." : labelIdle;
  }

  function showMessage(form, text, type) {
    const msg = form.querySelector(".form-msg");
    msg.textContent = text || "";
    msg.className = "form-msg" + (type === "success" ? " success" : "");
  }

  async function postJson(url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  }

  // ================= LOGIN =================
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(loginForm);
    showMessage(loginForm, "");

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    let valid = true;
    if (!emailRegex.test(email)) { setFieldError("login-email", "Ingresa un correo válido."); valid = false; }
    if (password.length < 6) { setFieldError("login-password", "Debe tener al menos 6 caracteres."); valid = false; }
    if (!valid) return;

    setLoading(loginForm, true, "Log In");
    try {
      const { ok, data } = await postJson("/api/auth/login", { email, password });
      if (ok && data.success) {
        localStorage.setItem("usuario", JSON.stringify({ nombre: data.nombre, email: data.email }));
        showMessage(loginForm, "Sesión iniciada, redirigiendo...", "success");
        window.location.href = "/src/html/dashboard.html";
        return;
      }
      showMessage(loginForm, data.message || "Correo o contraseña incorrectos.");
    } catch (err) {
      console.warn("Error en /api/auth/login:", err);
      showMessage(loginForm, "No se pudo conectar con el servidor.");
    } finally {
      setLoading(loginForm, false, "Log In");
    }
  });

  // ================= REGISTRO =================
  const registerForm = document.getElementById("register-form");
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(registerForm);
    showMessage(registerForm, "");

    const nombre = document.getElementById("reg-nombre").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const password2 = document.getElementById("reg-password2").value;

    let valid = true;
    if (!nombre) { setFieldError("reg-nombre", "El nombre es obligatorio."); valid = false; }
    if (!emailRegex.test(email)) { setFieldError("reg-email", "Ingresa un correo válido."); valid = false; }
    if (password.length < 6) { setFieldError("reg-password", "Debe tener al menos 6 caracteres."); valid = false; }
    if (password2 !== password) { setFieldError("reg-password2", "Las contraseñas no coinciden."); valid = false; }
    if (!valid) return;

    setLoading(registerForm, true, "Crear cuenta");
    try {
      const { ok, data } = await postJson("/api/auth/register", { nombre, email, password });
      if (ok && data.success) {
        showMessage(registerForm, "Cuenta creada. Ya puedes iniciar sesión.", "success");
        document.getElementById("login-email").value = email;
        setTimeout(() => goTo("login"), 1200);
        return;
      }
      showMessage(registerForm, data.message || "No se pudo crear la cuenta.");
    } catch (err) {
      console.warn("Error en /api/auth/register:", err);
      showMessage(registerForm, "No se pudo conectar con el servidor.");
    } finally {
      setLoading(registerForm, false, "Crear cuenta");
    }
  });

  // ================= RECUPERAR (pedir código) =================
  const forgotForm = document.getElementById("forgot-form");

  async function requestCode(email) {
    const { ok, data } = await postJson("/api/auth/forgot-password", { email });
    if (ok && data.success) {
      lastEmailForReset = email;
      document.getElementById("reset-email-display").textContent = email;
      goTo("reset");
      const resetForm = document.getElementById("reset-form");
      showMessage(
        resetForm,
        data.code ? `Código de prueba (modo desarrollo): ${data.code}` : "Revisa tu correo para ver el código.",
        "success"
      );
      document.querySelector('.otp-box[data-otp="0"]').focus();
    }
    return { ok, data };
  }

  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(forgotForm);
    showMessage(forgotForm, "");

    const email = document.getElementById("forgot-email").value.trim();
    if (!emailRegex.test(email)) {
      setFieldError("forgot-email", "Ingresa un correo válido.");
      return;
    }

    setLoading(forgotForm, true, "Enviar código");
    try {
      const { ok, data } = await requestCode(email);
      if (!ok) showMessage(forgotForm, data.message || "No se pudo enviar el código.");
    } catch (err) {
      console.warn("Error en /api/auth/forgot-password:", err);
      showMessage(forgotForm, "No se pudo conectar con el servidor.");
    } finally {
      setLoading(forgotForm, false, "Enviar código");
    }
  });

  // ================= CAMBIAR CONTRASEÑA (código + nueva) =================
  const resetForm = document.getElementById("reset-form");
  const otpBoxes = Array.from(document.querySelectorAll(".otp-box"));

  otpBoxes.forEach((box, i) => {
    box.addEventListener("input", () => {
      box.value = box.value.replace(/\D/g, "").slice(0, 1);
      if (box.value && otpBoxes[i + 1]) otpBoxes[i + 1].focus();
    });
    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && otpBoxes[i - 1]) otpBoxes[i - 1].focus();
    });
  });

  document.getElementById("resend-link").addEventListener("click", async (e) => {
    e.preventDefault();
    if (!lastEmailForReset) return;
    showMessage(resetForm, "Reenviando código...");
    try {
      const { ok, data } = await requestCode(lastEmailForReset);
      if (!ok) showMessage(resetForm, data.message || "No se pudo reenviar el código.");
    } catch (err) {
      console.warn("Error reenviando código:", err);
      showMessage(resetForm, "No se pudo conectar con el servidor.");
    }
  });

  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(resetForm);
    showMessage(resetForm, "");

    const code = otpBoxes.map((b) => b.value).join("");
    const password = document.getElementById("reset-password").value;
    const password2 = document.getElementById("reset-password2").value;

    let valid = true;
    if (code.length !== 5) { setFieldError("reset-code", "Ingresa el código completo."); valid = false; }
    if (password.length < 6) { setFieldError("reset-password", "Debe tener al menos 6 caracteres."); valid = false; }
    if (password2 !== password) { setFieldError("reset-password2", "Las contraseñas no coinciden."); valid = false; }
    if (!valid) return;

    setLoading(resetForm, true, "Cambiar");
    try {
      const { ok, data } = await postJson("/api/auth/reset-password", {
        email: lastEmailForReset,
        code,
        newPassword: password,
      });
      if (ok && data.success) {
        showMessage(resetForm, "Contraseña actualizada. Ya puedes iniciar sesión.", "success");
        document.getElementById("login-email").value = lastEmailForReset;
        setTimeout(() => goTo("login"), 1200);
        return;
      }
      showMessage(resetForm, data.message || "No se pudo cambiar la contraseña.");
    } catch (err) {
      console.warn("Error en /api/auth/reset-password:", err);
      showMessage(resetForm, "No se pudo conectar con el servidor.");
    } finally {
      setLoading(resetForm, false, "Cambiar");
    }
  });
})();