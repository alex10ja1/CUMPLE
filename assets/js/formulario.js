window.InvitacionFormulario = (function () {
  const MAX_PERSONAS_ABSOLUTO = 4;

  function iniciar(config) {
    const formulario = document.getElementById('formulario-rsvp');
    if (!formulario) return;

    const selectCantidad = document.getElementById('form-cantidad');
    const estadoFormulario = document.getElementById('formulario-estado');
    const maximoPersonas = Math.min(config.confirmacion.maximoPersonas || 4, MAX_PERSONAS_ABSOLUTO);

    prepararSelectCantidad(selectCantidad, maximoPersonas);
    actualizarCamposPersonas(1);

    selectCantidad.addEventListener('change', (e) => {
      actualizarCamposPersonas(parseInt(e.target.value, 10));
    });

    formulario.addEventListener('submit', (e) => {
      e.preventDefault();
      manejarEnvio(formulario, config, estadoFormulario);
    });
  }

  function prepararSelectCantidad(select, maximo) {
    select.innerHTML = '';

    for (let i = 1; i <= maximo; i++) {
      const opcion = document.createElement('option');
      opcion.value = String(i);
      opcion.textContent = i === 1 ? '1 persona' : `${i} personas`;
      select.appendChild(opcion);
    }
  }

  function actualizarCamposPersonas(cantidad) {
    document.querySelectorAll('.campo-persona').forEach((campo) => {
      const numero = parseInt(campo.dataset.persona, 10);
      const visible = numero <= cantidad;
      campo.classList.toggle('visible', visible);

      const input = campo.querySelector('input');
      if (input) {
        input.required = visible;
        if (!visible) input.value = '';
      }
    });
  }

  function validarFormulario(formulario) {
    let valido = true;

    formulario.querySelectorAll('.campo').forEach((campo) => {
      const input = campo.querySelector('input[required], select[required]');
      if (!input) return;

      const ok = input.value.trim().length > 0;
      campo.classList.toggle('con-error', !ok);
      if (!ok) valido = false;
    });

    return valido;
  }

  async function manejarEnvio(formulario, config, elementoEstado) {
    if (!validarFormulario(formulario)) {
      mostrarEstado(elementoEstado, 'Completa los campos marcados.', 'error');
      return;
    }

    const urlDestino = "https://script.google.com/macros/s/AKfycby0ow0RTwxofdEfXaJL43Y5yu3jaQJe2GcQMjfl1XzHPmiDzyHsJ8Hoh5-Pf8UMIQ/exec";

    if (!urlDestino || !urlDestino.includes('script.google.com')) {
      mostrarEstado(elementoEstado, 'Falta configurar la URL de Google Apps Script.', 'error');
      return;
    }

    const boton = formulario.querySelector('button[type="submit"]');
    boton.disabled = true;
    boton.textContent = 'Enviando...';

    const ahora = new Date();

    const datos = new URLSearchParams();
    datos.append('fecha', ahora.toLocaleDateString('es-MX'));
    datos.append('hora', ahora.toLocaleTimeString('es-MX'));
    datos.append('responsable', document.getElementById('form-responsable').value.trim());
    datos.append('cantidad', document.getElementById('form-cantidad').value);
    datos.append('persona1', document.getElementById('form-persona1').value.trim());
    datos.append('persona2', document.getElementById('form-persona2').value.trim());
    datos.append('persona3', document.getElementById('form-persona3').value.trim());
    datos.append('persona4', document.getElementById('form-persona4').value.trim());
    datos.append('comentarios', document.getElementById('form-comentarios').value.trim());
    datos.append('ip', 'No disponible');
    datos.append('userAgent', navigator.userAgent);

    try {
      await fetch(urlDestino, {
        method: 'POST',
        mode: 'no-cors',
        body: datos
      });

      mostrarEstado(elementoEstado, 'Confirmación enviada. Revisa Google Sheets.', 'exito');

      if (window.InvitacionAnimaciones) {
        window.InvitacionAnimaciones.lanzarConfetiExplosion();
      }

      formulario.reset();
      actualizarCamposPersonas(1);
      boton.disabled = false;
      boton.textContent = 'Confirmar asistencia';

    } catch (error) {
      console.error(error);
      mostrarEstado(elementoEstado, 'No se pudo enviar. Intenta otra vez.', 'error');
      boton.disabled = false;
      boton.textContent = 'Confirmar asistencia';
    }
  }

  function mostrarEstado(elemento, mensaje, tipo) {
    if (!elemento) return;
    elemento.textContent = mensaje;
    elemento.className = `formulario__estado visible formulario__estado--${tipo}`;
  }

  return { iniciar };
})();