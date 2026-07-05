window.InvitacionFormulario = (function () {
  function iniciar() {
    const userAgent = document.getElementById("form-useragent");
    if (userAgent) {
      userAgent.value = navigator.userAgent;
    }

    const select = document.getElementById("form-cantidad");
    if (!select) return;

    select.addEventListener("change", function () {
      const cantidad = parseInt(this.value, 10);

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
    });
  }

  return { iniciar };
})();