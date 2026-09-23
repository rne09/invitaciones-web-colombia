/* ==========================================================================
   DATOS DE LA INVITACION
   Cambia aqui nombres, fecha, lugares, fotos, musica y textos.
   ========================================================================== */

/* Los datos se editan en datos.json (tambien desde el editor /admin). */
const DATOS = (function(){var x=new XMLHttpRequest();x.open("GET","datos.json?t="+Date.now(),false);x.send();return JSON.parse(x.responseText);})();

/* Complementos visuales. app.js conserva la logica principal de la invitacion. */
(function cargarComplementosBoda() {
  const cssCarrusel = document.createElement("link");
  cssCarrusel.rel = "stylesheet";
  cssCarrusel.href = "css/carrusel-coverflow.css?v=8";
  document.head.appendChild(cssCarrusel);

  const cssLimpieza = document.createElement("link");
  cssLimpieza.rel = "stylesheet";
  cssLimpieza.href = "css/limpieza-visual.css?v=8";
  document.head.appendChild(cssLimpieza);

  const cssAjustes = document.createElement("link");
  cssAjustes.rel = "stylesheet";
  cssAjustes.href = "css/ajustes-nombres-foto.css?v=6";
  document.head.appendChild(cssAjustes);

  /* Revision final: iguala Caroll/Mateo y usa el sello PNG aprobado. */
  const cssRevision = document.createElement("link");
  cssRevision.rel = "stylesheet";
  cssRevision.href = "css/revision-cliente.css?v=17";
  document.head.appendChild(cssRevision);

  const scriptCarrusel = document.createElement("script");
  scriptCarrusel.src = "js/carrusel-coverflow.js?v=8";
  scriptCarrusel.async = false;
  document.head.appendChild(scriptCarrusel);

  const scriptAjustes = document.createElement("script");
  scriptAjustes.src = "js/ajustes-diseno.js?v=8";
  scriptAjustes.async = false;
  document.head.appendChild(scriptAjustes);
})();
