window.InvitacionFormulario = (function () {
  const URL_SCRIPT = "https://script.google.com/macros/s/AKfycby0ow0RTwxofdEfXaJL43Y5yu3jaQJe2GcQMjfl1XzHPmiDzyHsJ8Hoh5-Pf8UMIQ/exec";
  const MAX_PERSONAS_ABSOLUTO = 4;

  function iniciar(config) {
    const formulario = document.getElementById("formulario-rsvp");
    if (!formulario) return;

    const selectCantidad = document.getElementById("form-cantidad");
    const estado = document.getElementById("formulario-estado");

    const maximo = Math.min(config.confirmacion?.maximoPersonas || 4, MAX_PERSONAS_ABSOLUTO);

    prepararSelectCantidad(selectCantidad, maximo);
    actualizarCamposPersonas(1);

    selectCantidad.addEventListener("change", function () {
      actualizarCamposPersonas(parseInt(this.value, 10));
    });

    formulario.addEventListener("submit", function (e) {
      e.preventDefault();
      enviarFormulario(formulario, estado);
    });
  }

  function prepararSelectCantidad(select, maximo) {
    select.innerHTML = "";
    for (let i = 1; i <= maximo; i++) {
      const opcion = document.createElement("option");
      opcion.value = String(i);
      opcion.textContent = i === 1 ? "1 persona" : `${i} personas`;
      select.appendChild(opcion);
    }
  }

  function actualizarCamposPersonas(cantidad) {
    document.querySelectorAll(".campo-persona").forEach((campo) => {
      const numero = parseInt(campo.dataset.persona, 10);
      const visible = numero <= cantidad;
      campo.classList.toggle("visible", visible);

      const input = campo.querySelector("input");
      if (input) {
        input.required = visible;
        if (!visible) input.value = "";
      }
    });
  }

  function enviarFormulario(formulario, estado) {
    const responsable = document.getElementById("form-responsable").value.trim();
    const cantidad = document.getElementById("form-cantidad").value;
    const persona1 = document.getElementById("form-persona1").value.trim();
    const persona2 = document.getElementById("form-persona2").value.trim();
    const persona3 = document.getElementById("form-persona3").value.trim();
    const persona4 = document.getElementById("form-persona4").value.trim();
    const comentarios = document.getElementById("form-comentarios").value.trim();

    if (!responsable || !persona1) {
      mostrarEstado(estado, "Completa los campos obligatorios.", "error");
      return;
    }

    const ahora = new Date();

    const params = new URLSearchParams({
      fecha: ahora.toLocaleDateString("es-MX"),
      hora: ahora.toLocaleTimeString("es-MX"),
      responsable: responsable,
      cantidad: cantidad,
      persona1: persona1,
      persona2: persona2,
      persona3: persona3,
      persona4: persona4,
      comentarios: comentarios,
      ip: "No disponible",
      userAgent: navigator.userAgent
    });

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = URL_SCRIPT + "?" + params.toString();
    document.body.appendChild(iframe);

    mostrarEstado(estado, "Confirmación enviada correctamente.", "exito");

    if (window.InvitacionAnimaciones) {
      window.InvitacionAnimaciones.lanzarConfetiExplosion();
    }

    formulario.reset();
    actualizarCamposPersonas(1);

    setTimeout(() => {
      window.location.href = "gracias.html";
    }, 1800);
  }

  function mostrarEstado(elemento, mensaje, tipo) {
    if (!elemento) return;
    elemento.textContent = mensaje;
    elemento.className = `formulario__estado visible formulario__estado--${tipo}`;
  }

  return { iniciar };
})();