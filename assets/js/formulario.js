/* ==========================================================================
   FORMULARIO.JS — Confirmación de asistencia (RSVP)
   --------------------------------------------------------------------------
   - Muestra/oculta los campos de "Persona 2, 3, 4" según la cantidad
     de personas elegida (máximo 4, definido en configuracion.json).
   - Valida los campos antes de enviar.
   - Envía los datos al Google Apps Script (que los guarda en Sheets).
   - Muestra una animación de éxito + confeti y redirige a gracias.html.

   NOTA SOBRE EL ENVÍO A GOOGLE APPS SCRIPT:
   Los Web Apps de Apps Script no siempre devuelven encabezados CORS,
   por lo que este archivo envía la petición en modo "no-cors". Esto
   significa que NO podemos leer la respuesta del servidor desde el
   navegador (es una limitación de seguridad de los navegadores, no
   un error nuestro). Por eso, si el envío no lanza una excepción de
   red, lo tratamos como éxito. El registro real siempre lo puedes
   verificar abriendo tu Google Sheet.
   ========================================================================== */

window.InvitacionFormulario = (function () {
  const MAX_PERSONAS_ABSOLUTO = 4;

  function iniciar(config) {
    const formulario = document.getElementById('formulario-rsvp');
    if (!formulario) return;

    const maximoPersonas = Math.min(config.confirmacion.maximoPersonas || 4, MAX_PERSONAS_ABSOLUTO);
    const selectCantidad = document.getElementById('form-cantidad');
    const estadoFormulario = document.getElementById('formulario-estado');

    prepararSelectCantidad(selectCantidad, maximoPersonas);
    actualizarCamposPersonas(1);

    selectCantidad.addEventListener('change', (evento) => {
      actualizarCamposPersonas(parseInt(evento.target.value, 10));
    });

    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      manejarEnvio(formulario, config, estadoFormulario);
    });
  }

  /** Genera las opciones del select de 1 hasta el máximo configurado */
  function prepararSelectCantidad(select, maximo) {
    if (!select) return;
    select.innerHTML = '';
    for (let i = 1; i <= maximo; i++) {
      const opcion = document.createElement('option');
      opcion.value = String(i);
      opcion.textContent = i === 1 ? '1 persona' : `${i} personas`;
      select.appendChild(opcion);
    }
  }

  /** Muestra los campos de persona 1..N y oculta el resto */
  function actualizarCamposPersonas(cantidad) {
    document.querySelectorAll('.campo-persona').forEach((campo) => {
      const numero = parseInt(campo.dataset.persona, 10);
      const visible = numero <= cantidad;
      campo.classList.toggle('visible', visible);
      const input = campo.querySelector('input');
      if (input) input.required = visible;
      if (!visible && input) input.value = '';
    });
  }

  /** Valida los campos visibles del formulario. Devuelve true si todo está correcto. */
  function validarFormulario(formulario) {
    let valido = true;

    formulario.querySelectorAll('.campo').forEach((campo) => {
      const input = campo.querySelector('input[required], select[required]');
      if (!input) return;
      const esValido = input.value.trim().length > 0;
      campo.classList.toggle('con-error', !esValido);
      if (!esValido) valido = false;
    });

    return valido;
  }

  async function manejarEnvio(formulario, config, elementoEstado) {
    if (!validarFormulario(formulario)) {
      mostrarEstado(elementoEstado, 'Por favor completa los campos marcados en rojo.', 'error');
      return;
    }

    const botonEnviar = formulario.querySelector('button[type="submit"]');
    botonEnviar.disabled = true;
    botonEnviar.textContent = 'Enviando...';

    const datosFormulario = new FormData(formulario);
    const ahora = new Date();
    datosFormulario.append('fecha', ahora.toLocaleDateString('es-MX'));
    datosFormulario.append('hora', ahora.toLocaleTimeString('es-MX'));
    datosFormulario.append('userAgent', navigator.userAgent);

    try {
      const ip = await obtenerDireccionIP();
      datosFormulario.append('ip', ip);
    } catch (_error) {
      datosFormulario.append('ip', 'No disponible');
    }

    const urlDestino = config.confirmacion.urlGoogleAppsScript;

    try {
      // 'no-cors' es intencional: ver la nota al inicio de este archivo.
      await fetch(urlDestino, { method: 'POST', mode: 'no-cors', body: datosFormulario });

      mostrarEstado(elementoEstado, `¡Gracias, ${datosFormulario.get('responsable')}! Tu asistencia fue registrada.`, 'exito');
      if (window.InvitacionAnimaciones) window.InvitacionAnimaciones.lanzarConfetiExplosion();

      setTimeout(() => {
        window.location.href = 'gracias.html';
      }, 1800);
    } catch (error) {
      console.error('[Invitación] Error al enviar la confirmación:', error);
      mostrarEstado(elementoEstado, 'No se pudo enviar. Verifica tu conexión e intenta de nuevo.', 'error');
      botonEnviar.disabled = false;
      botonEnviar.textContent = 'Confirmar asistencia';
    }
  }

  function mostrarEstado(elemento, mensaje, tipo) {
    if (!elemento) return;
    elemento.textContent = mensaje;
    elemento.className = `formulario__estado visible formulario__estado--${tipo}`;
  }

  /** Obtiene la IP pública del visitante usando una API gratuita (opcional, con tiempo límite corto) */
  function obtenerDireccionIP() {
    const controlador = new AbortController();
    const tiempoLimite = setTimeout(() => controlador.abort(), 2500);

    return fetch('https://api.ipify.org?format=json', { signal: controlador.signal })
      .then((respuesta) => respuesta.json())
      .then((datos) => datos.ip)
      .finally(() => clearTimeout(tiempoLimite));
  }

  return { iniciar };
})();
