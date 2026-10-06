(function(){
  const portada = document.querySelector("#portada");
  const invitacion = document.querySelector("#invitacion");
  const boton = document.querySelector("#abrirInvitacion");
  if (!portada || !invitacion || !boton) return;

  function abrir() {
    if (portada.classList.contains("abriendo")) return;
    portada.classList.add("abriendo");
    boton.classList.add("abierto");
    window.setTimeout(() => {
      document.body.classList.remove("bloqueada");
      invitacion.classList.add("visible");
      portada.classList.add("oculta");
      invitacion.scrollIntoView({ block: "start" });
    }, 1150);
  }

  boton.addEventListener("click", abrir);
  boton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      abrir();
    }
  });
})();
