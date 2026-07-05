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

    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      enviarFormulario(formulario, estado);
    });
  }

  function prepararSelectCantidad(select, maximo) {
    if (!select) return;
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

    const boton = formulario.querySelector('button[type="submit"]');
    boton.disabled = true;
    boton.textContent = "Enviando...";

    const ahora = new Date();

    const datos = {
      fecha: ahora.toLocaleDateString("es-MX"),
      hora: ahora.toLocaleTimeString("es-MX"),
      responsable,
      cantidad,
      persona1,
      persona2,
      persona3,
      persona4,
      comentarios,
      ip: "No disponible",
      userAgent: navigator.userAgent
    };

    enviarPorFormularioOculto(datos);

    mostrarEstado(estado, "Confirmación enviada correctamente.", "exito");

    if (window.InvitacionAnimaciones) {
      window.InvitacionAnimaciones.lanzarConfetiExplosion();
    }

    setTimeout(() => {
      formulario.reset();
      actualizarCamposPersonas(1);
      boton.disabled = false;
      boton.textContent = "Confirmar asistencia";
      window.location.href = "gracias.html";
    }, 2500);
  }

  function enviarPorFormularioOculto(datos) {
    const iframeName = "iframe-google-sheets";

    let iframe = document.getElementById(iframeName);
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.name = iframeName;
      iframe.id = iframeName;
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = URL_SCRIPT;
    form.target = iframeName;
    form.style.display = "none";

    Object.keys(datos).forEach((clave) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = clave;
      input.value = datos[clave];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
      form.remove();
    }, 3000);
  }

  function mostrarEstado(elemento, mensaje, tipo) {
    if (!elemento) return;
    elemento.textContent = mensaje;
    elemento.className = `formulario__estado visible formulario__estado--${tipo}`;
  }

  return { iniciar };
})();