(function(){
  const config = window.SITE_CONFIG || {};

  function actualizarWhatsApp() {
    if (!config.whatsapp) return;
    document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
      try {
        const url = new URL(link.href);
        const text = url.searchParams.get("text");
        link.href = "https://wa.me/" + config.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");
      } catch (error) {
        /* Si algun href no es URL valida, lo dejamos como esta. */
      }
    });
  }

  function prepararPedido() {
    const form = document.querySelector("#orderForm");
    const preview = document.querySelector("#orderMessage");
    const copy = document.querySelector("#copyOrder");
    if (!form || !preview) return;

    const fields = {
      eventType: form.querySelector("#eventType"),
      packageType: form.querySelector("#packageType"),
      eventDate: form.querySelector("#eventDate"),
      eventCity: form.querySelector("#eventCity"),
      clientName: form.querySelector("#clientName"),
      eventStyle: form.querySelector("#eventStyle"),
      eventNotes: form.querySelector("#eventNotes")
    };

    function value(name) {
      return fields[name] ? fields[name].value.trim() : "";
    }

    function buildMessage() {
      return [
        "Hola, quiero una invitacion web para mi evento.",
        "",
        "Nombre: " + (value("clientName") || "Por definir"),
        "Tipo de evento: " + value("eventType"),
        "Paquete: " + value("packageType"),
        "Fecha: " + (value("eventDate") || "Por definir"),
        "Ciudad: " + (value("eventCity") || "Por definir"),
        "Estilo: " + value("eventStyle"),
        "",
        "Detalles:",
        value("eventNotes") || "Quiero recibir asesoria para elegir plantilla y estilo."
      ].join("\n");
    }

    function render() {
      preview.textContent = buildMessage();
    }

    form.addEventListener("input", render);
    form.addEventListener("change", render);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const phone = config.whatsapp || "573000000000";
      window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(buildMessage()), "_blank", "noopener");
    });

    if (copy) {
      copy.addEventListener("click", async () => {
        const text = buildMessage();
        try {
          await navigator.clipboard.writeText(text);
          copy.textContent = "Mensaje copiado";
          setTimeout(() => { copy.textContent = "Copiar mensaje"; }, 1800);
        } catch (error) {
          preview.focus();
        }
      });
    }

    render();
  }

  function prepararCatalogo() {
    const catalog = window.TEMPLATE_CATALOG || [];
    const results = document.querySelector("#catalogResults");
    const empty = document.querySelector("#catalogEmpty");
    const filters = {
      event: document.querySelector("#filterEvent"),
      style: document.querySelector("#filterStyle"),
      package: document.querySelector("#filterPackage")
    };
    if (!results || !catalog.length) return;

    function uniq(key) {
      return [...new Set(catalog.map((item) => item[key]).filter(Boolean))].sort();
    }

    function fillOptions(select, values) {
      if (!select) return;
      values.forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
    }

    function card(item) {
      return [
        '<article class="template-card">',
        '  <div class="template-card__preview ' + item.preview + '"></div>',
        '  <div>',
        '    <p>' + item.event + ' · ' + item.package + '</p>',
        '    <h3>' + item.name + '</h3>',
        '    <span>' + item.price + ' · ' + item.style + '</span>',
        '    <div class="template-actions">',
        '      <a href="' + item.href + '">Ver info</a>',
        (item.demoHref ? '      <a href="' + item.demoHref + '">Ver demo</a>' : ''),
        '      <a href="../pedido/">Pedir esta</a>',
        '    </div>',
        '  </div>',
        '</article>'
      ].join("");
    }

    function render() {
      const selected = {
        event: filters.event ? filters.event.value : "",
        style: filters.style ? filters.style.value : "",
        package: filters.package ? filters.package.value : ""
      };
      const items = catalog.filter((item) =>
        (!selected.event || item.event === selected.event) &&
        (!selected.style || item.style === selected.style) &&
        (!selected.package || item.package === selected.package)
      );
      results.innerHTML = items.map(card).join("");
      if (empty) empty.hidden = items.length > 0;
    }

    fillOptions(filters.event, uniq("event"));
    fillOptions(filters.style, uniq("style"));
    fillOptions(filters.package, uniq("package"));
    Object.values(filters).forEach((select) => {
      if (select) select.addEventListener("change", render);
    });
    render();
  }

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("abierta");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        nav.classList.remove("abierta");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  actualizarWhatsApp();
  prepararPedido();
  prepararCatalogo();
})();
