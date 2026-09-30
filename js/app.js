/* ================================================================
   APP · Navegación, páginas y animaciones
   El contenido se edita en js/data.js · el estilo en css/theme.css
   ================================================================ */

(function(){

  "use strict";

  var SITE   = window.SITE || { CONFIG:{}, COMPOSITIONS:[] };
  var CONFIG = SITE.CONFIG;
  var WORKS  = SITE.COMPOSITIONS;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* ------------------------------------------------------------
     Utilidades
     ------------------------------------------------------------ */

  function $(s, c){ return (c || document).querySelector(s); }
  function $$(s, c){ return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  function esc(s){
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  }

  /* Texto con formato sencillo (para "Sobre mí"): admite <b>negrita</b>,
     <i>cursiva</i> y saltos de línea con <br> o \n. Cualquier otra etiqueta
     se muestra como texto normal. */
  function richText(s){
    return esc(s)
      .replace(/&lt;(\/?)(b|strong|i|em)&gt;/gi, "<$1$2>")
      .replace(/&lt;br\s*\/?&gt;/gi, "<br>")
      .replace(/\r?\n/g, "<br>");
  }

  function slugify(s){
    return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function src(path){ return esc(encodeURI(path)); }
  function pad(n){ return (n < 10 ? "0" : "") + n; }

  function workUrl(w){ return "#/obra/" + encodeURIComponent(w.id); }
  function catUrl(c){ return "#/musica/" + c.slug; }

  var ARROW = '<span class="arr" aria-hidden="true"></span>';

  function storageGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function storageSet(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  function sessionGet(k){ try{ return sessionStorage.getItem(k); }catch(e){ return null; } }
  function sessionSet(k, v){ try{ sessionStorage.setItem(k, v); }catch(e){} }


  /* ------------------------------------------------------------
     Categorías (se generan a partir de "category" en data.js)
     ------------------------------------------------------------ */

  var CATS = [];

  WORKS.forEach(function(w){
    var c = CATS.filter(function(x){ return x.name === w.category; })[0];
    if(!c){
      c = { name:w.category, slug:slugify(w.category), works:[] };
      CATS.push(c);
    }
    c.works.push(w);
  });

  function catByName(name){ return CATS.filter(function(c){ return c.name === name; })[0]; }
  function catBySlug(slug){ return CATS.filter(function(c){ return c.slug === slug; })[0]; }


  /* ------------------------------------------------------------
     Textos globales (nombre, frase, bio, email)
     ------------------------------------------------------------ */

  function bindTexts(root){
    $$("[data-bind]", root).forEach(function(el){
      var k = el.getAttribute("data-bind");
      if(k === "mail"){
        el.setAttribute("href", "mailto:" + CONFIG.mail);
        if(!el.textContent.trim()) el.textContent = CONFIG.mail;
      }else if(CONFIG[k] != null){
        el.textContent = CONFIG[k];
      }
    });
  }


  /* ------------------------------------------------------------
     Menú, pie y elementos fijos
     ------------------------------------------------------------ */

  function buildChrome(){

    $("#navSub").innerHTML =
      '<li><a href="#/musica">Todas las obras</a></li>' +
      CATS.map(function(c){
        return '<li><a href="' + catUrl(c) + '">' + esc(c.name) + '</a></li>';
      }).join("");

    $("#footerCats").innerHTML = CATS.map(function(c){
      return '<li><a class="u-line" href="' + catUrl(c) + '">' + esc(c.name) + '</a></li>';
    }).join("");

    $("#footerSocials").innerHTML =
      '<li><a class="u-line" href="#/contacto">Contacto</a></li>' +
      (CONFIG.socials || []).map(function(s){
        return '<li><a class="u-line" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + '</a></li>';
      }).join("");

    $("#year").textContent = new Date().getFullYear();

    bindTexts(document);
  }


  /* ================================================================
     PÁGINAS
     ================================================================ */

  function maskTitle(text, baseDelay){
    return text.split(" ").map(function(word, i){
      return '<span class="mask" data-reveal-mask style="--d:' + (baseDelay + i * 0.09).toFixed(2) + 's"><span>' + esc(word) + '</span></span>';
    }).join(" ");
  }

  function catCard(c, i){
    var first = c.works[0] || {};
    var n = c.works.length;
    return '' +
      '<a class="cat-card" href="' + catUrl(c) + '" data-reveal style="--d:' + (i * 0.12) + 's">' +
        '<div class="cat-media" data-reveal="image" style="--d:' + (i * 0.12) + 's">' +
          '<div class="zoom"><img src="' + src(first.cover) + '" alt="' + esc(c.name) + '" loading="lazy" decoding="async" style="--px:' + esc(first.coverPosX || "50%") + ';--py:' + esc(first.coverPosY || "50%") + '"></div>' +
        '</div>' +
        '<div class="cat-body">' +
          '<div><h3>' + esc(c.name) + '</h3><span class="cat-count">' + n + (n === 1 ? ' composición' : ' composiciones') + '</span></div>' +
          '<span class="link-arrow">Explorar ' + ARROW + '</span>' +
        '</div>' +
      '</a>';
  }

  function workRow(w, i){
    return '' +
      '<li data-reveal style="--d:' + Math.min(i * 0.05, 0.3).toFixed(2) + 's">' +
        '<a class="work-item" href="' + workUrl(w) + '">' +
          '<span class="wi-num">' + pad(i + 1) + '</span>' +
          '<span class="wi-thumb"><img src="' + src(w.cover) + '" alt="" loading="lazy" decoding="async" style="--px:' + esc(w.coverPosX || "50%") + ';--py:' + esc(w.coverPosY || "50%") + '"></span>' +
          '<span class="wi-main">' +
            '<span class="wi-title">' + esc(w.title) + ' <span class="wi-year">(' + esc(w.year) + ')</span></span>' +
            '<span class="wi-cat">' + esc(w.category) + '</span>' +
            '<span class="wi-desc">' + esc(w.description) + '</span>' +
          '</span>' +
          '<span class="wi-more link-arrow">Más detalles ' + ARROW + '</span>' +
        '</a>' +
      '</li>';
  }


  /* ---------- PRINCIPAL ---------- */

  function viewHome(){

    var words = String(CONFIG.siteName || "").split(" ");
    var titleHtml = "";
    if(words.length > 2){
      var last = words.splice(-2).join(" ");
      titleHtml = maskTitle(words.join(" "), 0.15) + '<span class="mask" data-reveal-mask style="--d:.45s"><span><em>' + esc(last) + '</em></span></span>';
    }else{
      titleHtml = maskTitle(CONFIG.siteName || "", 0.15);
    }

    var marqueeItems = WORKS.map(function(w){
      return '<a href="' + workUrl(w) + '">' + esc(w.title) + '</a>';
    }).join("");

    return {
      title: CONFIG.siteName + " · Portfolio musical",
      nav: "principal",
      html: '' +
        '<section class="hero">' +
          '<div class="hero-blob" aria-hidden="true"></div>' +
          '<div class="hero-staff" aria-hidden="true"><svg viewBox="0 0 1600 180" preserveAspectRatio="none">' +
            '<line x1="0" y1="10" x2="1600" y2="10"/><line x1="0" y1="50" x2="1600" y2="50"/><line x1="0" y1="90" x2="1600" y2="90"/><line x1="0" y1="130" x2="1600" y2="130"/><line x1="0" y1="170" x2="1600" y2="170"/>' +
          '</svg></div>' +
          '<div class="wrap hero-inner">' +
            '<p class="label" data-reveal style="--d:.05s">Portfolio musical</p>' +
            '<h1 class="hero-title">' + titleHtml + '</h1>' +
            '<p class="hero-tag" data-reveal style="--d:.7s">' + esc(CONFIG.tagline) + '</p>' +
            '<div class="hero-cta" data-reveal style="--d:.85s">' +
              '<a class="btn btn-solid" href="#/musica">Ver composiciones</a>' +
              '<a class="btn" href="#/contacto">Contacto</a>' +
            '</div>' +
          '</div>' +
        '</section>' +

        '<section class="intro" id="sobre-mi">' +
          '<div class="wrap intro-grid">' +
            '<p class="label" data-reveal>Sobre mí</p>' +
            '<p class="intro-text" data-reveal style="--d:.1s">' + richText(CONFIG.bio) + '</p>' +
          '</div>' +
        '</section>' +

        '<div class="marquee" aria-label="Composiciones">' +
          '<div class="marquee-track">' + marqueeItems + '<span aria-hidden="true" style="display:contents">' + marqueeItems.replace(/<a /g, '<a tabindex="-1" ') + '</span></div>' +
        '</div>' +

        '<section class="section">' +
          '<div class="wrap">' +
            '<div class="section-head">' +
              '<div><p class="label" data-reveal>Música</p><h2>' + maskTitle("Composiciones", 0.05) + '</h2></div>' +
              '<a class="link-arrow" href="#/musica" data-reveal>Ver todas ' + ARROW + '</a>' +
            '</div>' +
            '<div class="cat-grid">' + CATS.map(catCard).join("") + '</div>' +
          '</div>' +
        '</section>'
    };
  }


  /* ---------- MÚSICA (todas / por categoría) ---------- */

  function viewWorks(slug){

    var cat = slug ? catBySlug(slug) : null;
    if(slug && !cat) return viewWorks(null);

    var list = cat ? cat.works : WORKS;

    var chips =
      '<a class="chip' + (cat ? '' : ' active') + '" href="#/musica">Todas</a>' +
      CATS.map(function(c){
        return '<a class="chip' + (cat === c ? ' active' : '') + '" href="' + catUrl(c) + '">' + esc(c.name) + '</a>';
      }).join("");

    var crumbs =
      '<nav class="crumbs" aria-label="Ruta" data-reveal>' +
        '<a href="#/principal">Principal</a><span class="sep">/</span>' +
        (cat ? '<a href="#/musica">Música</a><span class="sep">/</span><span>' + esc(cat.name) + '</span>' : '<span>Música</span>') +
      '</nav>';

    var hub = cat ? '' :
      '<section class="section" style="padding-top:0">' +
        '<div class="wrap"><div class="cat-grid">' + CATS.map(catCard).join("") + '</div></div>' +
      '</section>';

    return {
      title: (cat ? cat.name : "Música") + " · " + CONFIG.siteName,
      nav: "musica",
      html: '' +
        '<section class="page-head">' +
          '<div class="wrap">' +
            crumbs +
            '<h1 class="page-title">' + maskTitle(cat ? cat.name : "Música", 0.05) + '</h1>' +
            '<p class="page-sub" data-reveal style="--d:.3s">' + list.length + (list.length === 1 ? ' composición' : ' composiciones') + '</p>' +
          '</div>' +
        '</section>' +
        hub +
        '<section class="section" style="padding-top:0">' +
          '<div class="wrap">' +
            (cat ? '' : '<div class="section-head" style="margin-bottom:30px"><div><p class="label" data-reveal>Catálogo</p><h2>' + maskTitle("Todas las obras", 0) + '</h2></div></div>') +
            '<div class="filters" data-reveal>' + chips + '</div>' +
            '<ol class="work-list">' + list.map(workRow).join("") + '</ol>' +
          '</div>' +
        '</section>'
    };
  }


  /* ---------- DETALLE DE OBRA ---------- */

  function viewWork(id){

    var w = WORKS.filter(function(x){ return String(x.id) === id; })[0];
    if(!w) return viewWorks(null);

    var cat  = catByName(w.category);
    var idx  = cat.works.indexOf(w);
    var prev = cat.works[idx - 1];
    var next = cat.works[idx + 1];

    /* Carrusel: portada + partitura (si existe) */
    var slides = [{ kind:"cover", label:"Portada", img:w.cover,
      vars:"--cover-width:" + (w.coverWidth || "100%") + ";--cover-height:" + (w.coverHeight || "100%") +
           ";--cover-pos-x:" + (w.coverPosX || "50%") + ";--cover-pos-y:" + (w.coverPosY || "50%") +
           ";--cover-zoom:" + (w.coverZoom || "1") }];

    if(w.score){
      slides.push({ kind:"score", label:"Partitura", img:w.score,
        vars:"--score-width:" + (w.scoreWidth || "100%") + ";--score-height:" + (w.scoreHeight || "100%") +
             ";--score-pos-x:" + (w.scorePosX || "50%") + ";--score-pos-y:" + (w.scorePosY || "50%") +
             ";--score-zoom:" + (w.scoreZoom || "1") });
    }

    var many = slides.length > 1;

    var carousel =
      '<div class="carousel" id="carousel" data-reveal="image" role="region" aria-roledescription="carrusel" aria-label="Imágenes de ' + esc(w.title) + '">' +
        '<div class="carousel-stage">' +
        slides.map(function(s, i){
          return '<div class="carousel-slide' + (i === 0 ? ' active' : '') + '" data-kind="' + s.kind + '" data-label="' + s.label + '" data-src="' + src(s.img) + '" style="' + esc(s.vars) + '">' +
            '<img src="' + src(s.img) + '" alt="' + s.label + ' de ' + esc(w.title) + '"' + (i === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">' +
          '</div>';
        }).join("") +
        (many ?
          '<button class="carousel-btn prev" type="button" aria-label="Anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 18l-6-6 6-6"/></svg></button>' +
          '<button class="carousel-btn next" type="button" aria-label="Siguiente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18l6-6-6-6"/></svg></button>' : '') +
        '</div>' +
        '<div class="carousel-bar">' +
          '<span class="carousel-caption" aria-live="polite"></span>' +
          (many ? '<div class="carousel-dots">' + slides.map(function(s, i){ return '<button type="button" aria-label="' + s.label + '"' + (i === 0 ? ' class="active"' : '') + '></button>'; }).join("") + '</div>' : '') +
          '<a class="carousel-full" href="' + src(w.cover) + '" target="_blank" rel="noopener">Ver a tamaño completo</a>' +
        '</div>' +
      '</div>';

    /* Vídeo (YouTube ligero) */
    var video = w.videoId ?
      '<button class="yt" type="button" data-yt="' + esc(w.videoId) + '" aria-label="Reproducir vídeo de ' + esc(w.title) + '">' +
        '<img src="https://i.ytimg.com/vi/' + encodeURIComponent(w.videoId) + '/hqdefault.jpg" alt="" loading="lazy" decoding="async" onerror="this.style.visibility=\'hidden\'">' +
        '<span class="yt-play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>' +
      '</button>'
      :
      '<div class="video-empty">Vídeo próximamente — añade el ID de YouTube en COMPOSITIONS.</div>';

    var share = "https://api.whatsapp.com/send?text=" + encodeURIComponent(w.title + " — " + CONFIG.siteName + " " + location.href);

    var hasDetail = !!w.detailedDescription;

    return {
      title: w.title + " · " + CONFIG.siteName,
      nav: "musica",
      after: function(root){ setupCarousel(root); setupVideo(root); },
      html: '' +
        '<article>' +
          '<header class="page-head obra-head">' +
            '<div class="wrap">' +
              '<nav class="crumbs" aria-label="Ruta" data-reveal>' +
                '<a href="#/musica">Música</a><span class="sep">/</span>' +
                '<a href="' + catUrl(cat) + '">' + esc(cat.name) + '</a><span class="sep">/</span>' +
                '<span>' + pad(idx + 1) + '</span>' +
              '</nav>' +
              '<p class="label" data-reveal style="--d:.05s">' + esc(w.category) + ' · ' + esc(w.year) + '</p>' +
              '<h1 class="obra-title">' + maskTitle(w.title, 0.1) + '</h1>' +
              '<p class="obra-lead" data-reveal style="--d:.35s">' + esc(w.description) + '</p>' +
            '</div>' +
          '</header>' +

          '<div class="wrap">' + carousel + '</div>' +

          '<div class="wrap obra-body' + (hasDetail ? '' : ' solo') + '">' +
            (hasDetail ?
              '<div class="obra-text">' +
                '<h2 class="label" data-reveal>Descripción</h2>' +
                '<p class="detail" data-reveal style="--d:.1s">' + esc(w.detailedDescription) + '</p>' +
                actions(share) +
              '</div>' : '') +
            '<div class="obra-video" data-reveal style="--d:.15s">' +
              '<p class="label">Escuchar</p>' +
              video +
              (hasDetail ? '' : actions(share)) +
            '</div>' +
          '</div>' +

          '<nav class="pager" aria-label="Otras obras">' +
            (prev ? '<a href="' + workUrl(prev) + '"><small>← Anterior</small><strong>' + esc(prev.title) + '</strong></a>'
                  : '<a class="empty" href="' + catUrl(cat) + '" tabindex="-1"></a>') +
            (next ? '<a href="' + workUrl(next) + '"><small>Siguiente →</small><strong>' + esc(next.title) + '</strong></a>'
                  : '<a href="' + catUrl(cat) + '"><small>Volver →</small><strong>' + esc(cat.name) + '</strong></a>') +
          '</nav>' +
        '</article>'
    };
  }

  function actions(share){
    return '<div class="obra-actions" data-reveal style="--d:.2s">' +
      '<a class="btn" href="' + esc(share) + '" target="_blank" rel="noopener">Compartir</a>' +
      '<a class="btn btn-solid" href="#/contacto">Contacto</a>' +
    '</div>';
  }


  /* ---------- CONTACTO ---------- */

  function field(name, label, type, extra){
    var id = "f-" + name;
    var input = type === "textarea"
      ? '<textarea id="' + id + '" name="' + name + '" rows="6" placeholder=" " ' + (extra || "") + '></textarea>'
      : '<input id="' + id + '" name="' + name + '" type="' + type + '" placeholder=" " ' + (extra || "") + '>';
    return '<div class="field">' + input + '<label for="' + id + '">' + label + '</label><span class="field-line" aria-hidden="true"></span></div>';
  }

  function viewContact(){
    return {
      title: "Contacto · " + CONFIG.siteName,
      nav: "contacto",
      after: function(root){ setupForm(root); },
      html: '' +
        '<section class="page-head">' +
          '<div class="wrap">' +
            '<nav class="crumbs" aria-label="Ruta" data-reveal><a href="#/principal">Principal</a><span class="sep">/</span><span>Contacto</span></nav>' +
            '<h1 class="page-title">' + maskTitle("Contacto", 0.05) + '</h1>' +
          '</div>' +
        '</section>' +
        '<section class="contact">' +
          '<div class="wrap contact-layout">' +

            '<form class="contact-form" id="contactForm" novalidate data-reveal>' +
              '<p class="label">Escríbeme</p>' +
              '<div class="form-row">' +
                field("nombre", "Nombre", "text", 'required maxlength="200" autocomplete="name"') +
                field("email", "Email", "email", 'required maxlength="200" autocomplete="email"') +
              '</div>' +
              field("asunto", "Asunto (opcional)", "text", 'maxlength="200"') +
              field("mensaje", "Mensaje", "textarea", 'required maxlength="5000"') +
              /* Campo trampa antispam: invisible para personas */
              '<div class="hp" aria-hidden="true"><label>Web <input type="text" name="web" tabindex="-1" autocomplete="off"></label></div>' +
              /* Paso 2: verificación del email con un código */
              '<div class="verify" id="verifyBox" hidden>' +
                '<p class="verify-text">Te hemos enviado un código de 6 dígitos a <strong id="verifyEmail"></strong>. Escríbelo aquí para confirmar que el email es tuyo y enviar el mensaje.</p>' +
                '<div class="field field-code"><input id="f-codigo" name="codigo" type="text" inputmode="numeric" autocomplete="one-time-code" placeholder=" "><label for="f-codigo">Código</label><span class="field-line" aria-hidden="true"></span></div>' +
                '<div class="verify-links">' +
                  '<button class="copy-btn" type="button" id="pasteCode">Pegar código</button>' +
                  '<button class="copy-btn" type="button" id="resendCode">Reenviar código</button>' +
                  '<button class="copy-btn" type="button" id="changeData">Cambiar datos</button>' +
                '</div>' +
              '</div>' +
              '<p class="form-note">Para evitar correos falsos, te enviaremos un código a tu email para confirmar que es tuyo.</p>' +
              '<div class="form-foot">' +
                '<button class="btn btn-solid" type="submit" id="formSubmit">Verificar y enviar</button>' +
                '<p class="form-status" id="formStatus" role="status" aria-live="polite"></p>' +
              '</div>' +
            '</form>' +

            '<aside class="contact-aside">' +
              '<div data-reveal style="--d:.1s">' +
                '<h2 class="label">Email</h2>' +
                '<p class="contact-mail"><a class="u-line" data-bind="mail" href="#"></a></p>' +
                '<button class="copy-btn" type="button" id="copyMail">Copiar email</button>' +
              '</div>' +
              '<div data-reveal style="--d:.2s"><h2 class="label">Redes</h2><ul>' +
                (CONFIG.socials || []).map(function(s){
                  return '<li><a class="u-line" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + '</a></li>';
                }).join("") +
              '</ul></div>' +
              '<div data-reveal style="--d:.3s"><h2 class="label">Música</h2><ul>' +
                CATS.map(function(c){ return '<li><a class="u-line" href="' + catUrl(c) + '">' + esc(c.name) + '</a></li>'; }).join("") +
              '</ul></div>' +
            '</aside>' +

          '</div>' +
        '</section>'
    };
  }


  /* ---------- Envío del formulario (Google Apps Script) ----------
     Paso 1: se piden los datos y el script envía un código al email.
     Paso 2: se escribe el código y, si es correcto, el mensaje te llega.
     ------------------------------------------------------------------ */

  /* Elige la URL del script: la principal (formEndpoint) si responde bien a
     una prueba que NO envía correos; si no, la de reserva (formEndpointReserva).
     Se decide una sola vez por visita, así el código y el mensaje van al mismo sitio. */
  var endpointChoice = null;

  function getEndpoint(){
    if(endpointChoice) return endpointChoice;
    var principal = CONFIG.formEndpoint, reserva = CONFIG.formEndpointReserva;
    if(!principal || !reserva){
      endpointChoice = Promise.resolve(principal || reserva);
      return endpointChoice;
    }
    var prueba = fetch(principal + "?ping=1")
      .then(function(r){ return r.json(); })
      .then(function(j){ return j && j.ok ? principal : null; })
      .catch(function(){ return null; });
    var limite = new Promise(function(res){ setTimeout(function(){ res(null); }, 8000); });
    endpointChoice = Promise.race([prueba, limite]).then(function(url){
      if(!url) fetch(reserva + "?ping=1").catch(function(){});   /* despierta la de reserva */
      return url || reserva;
    });
    return endpointChoice;
  }

  var LABEL_STEP1 = "Verificar y enviar";
  var LABEL_STEP2 = "Confirmar y enviar";

  function setupForm(root){
    var form   = $("#contactForm", root);
    var status = $("#formStatus", root);
    var submit = $("#formSubmit", root);
    var copy   = $("#copyMail", root);

    if(copy){
      copy.addEventListener("click", function(){
        var done = function(){ copy.textContent = "¡Copiado!"; setTimeout(function(){ copy.textContent = "Copiar email"; }, 2000); };
        if(navigator.clipboard) navigator.clipboard.writeText(CONFIG.mail).then(done, function(){});
      });
    }

    if(!form) return;

    /* Al abrir Contacto se "despierta" el script de Google (responde más
       rápido al enviar) y, de paso, se elige qué URL usar */
    getEndpoint();

    var verifyBox = $("#verifyBox", form);
    var codeInput = $("#f-codigo", form);
    var resend    = $("#resendCode", form);
    var change    = $("#changeData", form);
    var paste     = $("#pasteCode", form);
    var dataFields = $$('[name="nombre"], [name="email"], [name="asunto"], [name="mensaje"]', form);

    var step = 1;
    var cooldown = null;

    function setStatus(msg, kind){
      status.textContent = msg;
      status.className = "form-status" + (kind ? " is-" + kind : "");
    }

    function busy(on, label){
      submit.disabled = on;
      submit.textContent = label || (step === 1 ? LABEL_STEP1 : LABEL_STEP2);
    }

    function validate(){
      var invalid = null;
      $$("[required]", form).forEach(function(el){
        var ok = el.value.trim() !== "" && el.checkValidity();
        el.closest(".field").classList.toggle("has-error", !ok);
        if(!ok && !invalid) invalid = el;
      });
      if(invalid){
        setStatus("Revisa los campos marcados.", "error");
        invalid.focus();
      }
      return !invalid;
    }

    function lockFields(lock){
      dataFields.forEach(function(el){ el.readOnly = lock; });
      form.classList.toggle("is-verifying", lock);
    }

    function stopCooldown(){
      clearInterval(cooldown);
      resend.disabled = false;
      resend.textContent = "Reenviar código";
    }

    function startCooldown(){
      var left = 60;
      stopCooldown();
      resend.disabled = true;
      resend.textContent = "Reenviar código (" + left + " s)";
      cooldown = setInterval(function(){
        left--;
        if(left <= 0 || !document.body.contains(resend)){ stopCooldown(); return; }
        resend.textContent = "Reenviar código (" + left + " s)";
      }, 1000);
    }

    function post(accion){
      var data = new URLSearchParams(new FormData(form));   /* petición simple: sin preflight CORS */
      data.set("accion", accion);
      if(accion === "codigo") data.delete("codigo");
      return getEndpoint()
        .then(function(url){ return fetch(url, { method:"POST", body:data }); })
        .then(function(r){ return r.json(); });
    }

    function networkError(){
      setStatus("No se ha podido conectar. Revisa tu conexión o escribe directamente a " + CONFIG.mail + ".", "error");
    }

    function backToStep1(){
      step = 1;
      lockFields(false);
      verifyBox.hidden = true;
      codeInput.value = "";
      codeInput.closest(".field").classList.remove("has-error");
      stopCooldown();
      busy(false);
    }

    function showCodeBox(){
      step = 2;
      lockFields(true);
      $("#verifyEmail", form).textContent = form.elements.email.value.trim();
      verifyBox.hidden = false;
      codeInput.value = "";
      codeInput.focus();
    }

    function requestCode(){
      /* La casilla del código aparece al instante, sin esperar a Google */
      var firstTime = step === 1;
      if(firstTime) showCodeBox();
      busy(true, "Enviando código…");
      resend.disabled = true;
      setStatus("Enviando el código a tu email…", "");
      post("codigo").then(function(res){
        if(res && res.ok){
          startCooldown();
          setStatus("Código enviado. Revisa tu bandeja de entrada (y la carpeta de spam).", "ok");
        }else{
          if(firstTime) backToStep1();
          else resend.disabled = false;
          setStatus((res && res.error) || "No se ha podido enviar el código. Inténtalo de nuevo.", "error");
        }
      })
      .catch(function(){
        if(firstTime) backToStep1();
        else resend.disabled = false;
        networkError();
      })
      .then(function(){ busy(false); });
    }

    function sendMessage(){
      var code = codeInput.value.replace(/\D/g, "");
      codeInput.value = code;
      if(code.length !== 6){
        codeInput.closest(".field").classList.add("has-error");
        setStatus("Escribe el código de 6 dígitos que te hemos enviado.", "error");
        codeInput.focus();
        return;
      }
      busy(true, "Enviando…");
      setStatus("", "");
      post("enviar").then(function(res){
        if(res && res.ok){
          form.reset();
          backToStep1();
          setStatus("¡Gracias! Tu email se ha verificado y el mensaje se ha enviado correctamente.", "ok");
        }else{
          if(res && res.caducado) backToStep1();
          setStatus((res && res.error) || "No se ha podido enviar. Inténtalo de nuevo.", "error");
        }
      })
      .catch(networkError)
      .then(function(){ busy(false); });
    }

    form.addEventListener("submit", function(e){
      e.preventDefault();
      if(!CONFIG.formEndpoint && !CONFIG.formEndpointReserva){
        setStatus("El formulario no está configurado (falta formEndpoint en data.js).", "error");
        return;
      }
      if(step === 1){
        if(validate()) requestCode();
      }else{
        sendMessage();
      }
    });

    resend.addEventListener("click", requestCode);
    /* Casilla del código: solo números, máximo 6 (al pegar "123 456" o
       "Tu código es 123456" se queda solo con los 6 dígitos) */
    codeInput.addEventListener("input", function(){
      var clean = codeInput.value.replace(/\D/g, "").slice(0, 6);
      if(codeInput.value !== clean) codeInput.value = clean;
    });

    /* Botón "Pegar código": lee el portapapeles y coloca el código */
    paste.addEventListener("click", function(){
      function manual(){
        codeInput.focus();
        setStatus("Pega el código en la casilla con Ctrl+V (o mantén pulsado en el móvil y elige «Pegar»).", "");
      }
      if(!navigator.clipboard || !navigator.clipboard.readText) return manual();
      navigator.clipboard.readText().then(function(text){
        var digits = String(text || "").replace(/\D/g, "");
        if(digits.length >= 6){
          codeInput.value = digits.slice(0, 6);
          codeInput.closest(".field").classList.remove("has-error");
          codeInput.focus();
          setStatus("Código pegado. Pulsa «Confirmar y enviar».", "ok");
        }else{
          codeInput.focus();
          setStatus("No hay ningún código de 6 dígitos copiado. Cópialo del correo e inténtalo de nuevo.", "error");
        }
      }, manual);
    });

    change.addEventListener("click", function(){
      backToStep1();
      setStatus("", "");
      form.elements.nombre.focus();
    });

    $$("input, textarea", form).forEach(function(el){
      el.addEventListener("input", function(){
        var f = el.closest(".field");
        if(f) f.classList.remove("has-error");
      });
    });
  }


  /* ================================================================
     COMPONENTES INTERACTIVOS
     ================================================================ */

  var activeCarousel = null;

  function setupCarousel(root){
    var c = $("#carousel", root);
    if(!c) return;

    var slides  = $$(".carousel-slide", c);
    var dots    = $$(".carousel-dots button", c);
    var caption = $(".carousel-caption", c);
    var full    = $(".carousel-full", c);
    var i = 0;

    function go(n){
      i = (n + slides.length) % slides.length;
      slides.forEach(function(s, k){ s.classList.toggle("active", k === i); });
      dots.forEach(function(d, k){ d.classList.toggle("active", k === i); });
      caption.textContent = slides[i].getAttribute("data-label") + " · " + (i + 1) + "/" + slides.length;
      full.setAttribute("href", slides[i].getAttribute("data-src"));
    }

    var prev = $(".prev", c), next = $(".next", c);
    if(prev) prev.addEventListener("click", function(){ go(i - 1); });
    if(next) next.addEventListener("click", function(){ go(i + 1); });
    dots.forEach(function(d, k){ d.addEventListener("click", function(){ go(k); }); });

    /* Deslizar con el dedo */
    var x0 = null;
    c.addEventListener("touchstart", function(e){ x0 = e.touches[0].clientX; }, { passive:true });
    c.addEventListener("touchend", function(e){
      if(x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if(Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      x0 = null;
    });

    go(0);
    activeCarousel = slides.length > 1 ? { next:function(){ go(i + 1); }, prev:function(){ go(i - 1); } } : null;
  }

  function setupVideo(root){
    $$("[data-yt]", root).forEach(function(btn){
      btn.addEventListener("click", function(){
        var id = btn.getAttribute("data-yt");
        var f = document.createElement("iframe");
        f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0";
        f.title = "YouTube video player";
        f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        f.referrerPolicy = "strict-origin-when-cross-origin";
        f.setAttribute("allowfullscreen", "");
        btn.innerHTML = "";
        btn.appendChild(f);
        btn.removeAttribute("data-yt");
        btn.style.cursor = "default";
      }, { once:true });
    });
  }

  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && document.body.classList.contains("nav-open")) toggleNav(false);
    if(!activeCarousel) return;
    var tag = (document.activeElement && document.activeElement.tagName) || "";
    if(tag === "INPUT" || tag === "TEXTAREA") return;
    if(e.key === "ArrowRight") activeCarousel.next();
    if(e.key === "ArrowLeft")  activeCarousel.prev();
  });


  /* ================================================================
     ANIMACIONES AL HACER SCROLL
     ================================================================ */

  var io = ("IntersectionObserver" in window && !reduced) ?
    new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin:"0px 0px -40px 0px", threshold:0 })
    : null;

  function reveal(root){
    var els = $$("[data-reveal], [data-reveal-mask]", root);
    els.forEach(function(el){
      if(io) io.observe(el); else el.classList.add("in");
    });
  }


  /* ================================================================
     ROUTER + TRANSICIONES
     ================================================================ */

  var main    = $("#main");
  var curtain = $("#curtain");
  var firstRender = true;
  var holdReveal = false;   /* true mientras se ve la pantalla de bienvenida */
  var busy = false;

  function resolve(){
    var h = location.hash.replace(/^#\/?/, "");
    try{ h = decodeURIComponent(h); }catch(e){}
    var cut  = h.indexOf("/");
    var head = cut === -1 ? h : h.slice(0, cut);
    var rest = cut === -1 ? "" : h.slice(cut + 1);

    switch(head){
      case "musica":   return viewWorks(rest || null);
      case "obra":     return viewWork(rest);
      case "contacto": return viewContact();
      default:         return viewHome();
    }
  }

  function paint(){
    var v = resolve();
    activeCarousel = null;
    main.innerHTML = v.html;
    document.title = v.title;
    bindTexts(main);
    $$("[data-nav]").forEach(function(a){
      if(a.getAttribute("data-nav") === v.nav) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    if(v.after) v.after(main);
    window.scrollTo(0, 0);
    header.classList.remove("hide");
    if(!holdReveal) reveal(main);
  }

  function route(){
    toggleNav(false);

    if(firstRender || reduced){
      firstRender = false;
      paint();
      return;
    }
    if(busy){ paint(); return; }

    busy = true;
    curtain.classList.remove("out");
    curtain.classList.add("in");

    setTimeout(function(){
      paint();
      curtain.classList.remove("in");
      curtain.classList.add("out");
      setTimeout(function(){ curtain.classList.remove("out"); busy = false; }, 700);
    }, 560);
  }

  window.addEventListener("hashchange", route);


  /* ================================================================
     CABECERA · menú móvil · tema · volver arriba
     ================================================================ */

  var header = $("#siteHeader");
  var toTop  = $("#toTop");
  var lastY  = 0;

  window.addEventListener("scroll", function(){
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle("scrolled", y > 30);
    header.classList.toggle("hide", y > lastY && y > 320 && !document.body.classList.contains("nav-open"));
    toTop.classList.toggle("show", y > 700);
    lastY = y;
  }, { passive:true });

  toTop.addEventListener("click", function(){
    window.scrollTo({ top:0, behavior: reduced ? "auto" : "smooth" });
  });

  function toggleNav(force){
    var open = typeof force === "boolean" ? force : !document.body.classList.contains("nav-open");
    document.body.classList.toggle("nav-open", open);
    document.documentElement.classList.toggle("locked",
      open || document.documentElement.classList.contains("splash-on"));
    $("#navToggle").setAttribute("aria-expanded", open ? "true" : "false");
    $("#navToggle").setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }
  $("#navToggle").addEventListener("click", function(){ toggleNav(); });

  $("#themeToggle").addEventListener("click", function(){
    var root = document.documentElement;
    var current = root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var nextTheme = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    storageSet("site-theme", nextTheme);
  });

  $("#skipLink").addEventListener("click", function(e){
    e.preventDefault();
    main.focus();
  });


  /* ================================================================
     BIENVENIDA ("Acceder")
     ================================================================ */

  function setupSplash(){
    var splash = $("#splash");
    var isRoot = !location.hash || location.hash === "#" || location.hash === "#/";
    if(!isRoot || sessionGet("entered")){
      document.documentElement.classList.remove("locked", "splash-on");
      return;
    }

    var name = $("#splashName");
    /* Cada palabra va en un bloque que no se parte; las dos últimas
       palabras (el apellido, p. ej. "de Celis") van siempre juntas */
    var i = 0;
    var words = String(CONFIG.siteName || "").split(" ");
    var groups = words.length > 2 ? words.slice(0, -2).concat([words.slice(-2).join(" ")]) : words;
    name.innerHTML = groups.map(function(group){
      return '<span class="w">' + Array.from(group).map(function(ch){
        return ch === " " ? "&nbsp;" : '<span class="ch" style="--i:' + (i++) + '">' + esc(ch) + '</span>';
      }).join("") + '</span>';
    }).join(" ");
    name.setAttribute("aria-label", CONFIG.siteName);

    splash.hidden = false;
    holdReveal = true;
    document.documentElement.classList.add("locked", "splash-on");

    $("#splashEnter").addEventListener("click", function(){
      sessionSet("entered", "1");
      history.replaceState(null, "", "#/principal");
      splash.classList.add("leave");
      document.documentElement.classList.remove("locked", "splash-on");
      /* Pinta de nuevo la portada para que sus animaciones empiecen ahora */
      holdReveal = false;
      paint();
      setTimeout(function(){ splash.hidden = true; }, 1200);
    });
  }


  /* ================================================================
     INICIO
     ================================================================ */

  buildChrome();
  reveal($(".site-footer"));
  setupSplash();
  route();

})();
