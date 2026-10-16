(function(){
  "use strict";
  const caja=document.querySelector(".particulas--portada");
  for(let i=0;i<28;i++){
    const estrella=document.createElement("i");
    estrella.className="p p--estrellas";
    estrella.style.left=(8+Math.random()*84)+"%";
    estrella.style.top=(7+Math.random()*84)+"%";
    estrella.style.setProperty("--d",(-Math.random()*4).toFixed(2)+"s");
    estrella.style.setProperty("--t",(0.7+Math.random()*0.8).toFixed(2));
    caja.appendChild(estrella);
  }
  const audio=document.querySelector("#audio"), botonMusica=document.querySelector("#musica");
  function reproducir(){audio.play().then(()=>{botonMusica.classList.add("activa");botonMusica.setAttribute("aria-pressed","true");}).catch(()=>{});}
  botonMusica.addEventListener("click",()=>audio.paused?reproducir():(audio.pause(),botonMusica.classList.remove("activa"),botonMusica.setAttribute("aria-pressed","false")));
  document.addEventListener("pointerdown",(evento)=>{if(evento.target!==botonMusica&&audio.paused)reproducir();},{once:true});
  reproducir();
  window.addEventListener("load",reproducir,{once:true});
  document.querySelector("#btnConfirmar").addEventListener("click",()=>{
    const nombre=document.querySelector("#nombreInvitado").value.trim(),error=document.querySelector("#errorNombre");
    if(!nombre){error.hidden=false;document.querySelector("#nombreInvitado").focus();return;}
    error.hidden=true; const texto=`¡Hola, Yesenia! 💛\nSoy ${nombre} y confirmo con mucha alegría mi asistencia a los 15 años de Aura Sofía 👑\n\n📅 Sábado 24 de octubre · 7:00 p. m.\n📍 Fénix Palace\n\n¡Nos vemos en esa noche mágica! ✨`;
    window.open(`https://wa.me/573017572649?text=${encodeURIComponent(texto)}`,"_blank","noopener");
  });
})();
