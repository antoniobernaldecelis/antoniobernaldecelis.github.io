/* ================================================================
   FORMULARIO DE CONTACTO CON VERIFICACIÓN DE EMAIL
   Pega este código en script.google.com (sustituyendo el anterior)
   ================================================================ */

const DESTINO         = "antoniobernaldecelis@gmail.com";  // ← correo donde recibes los mensajes
const NOMBRE_WEB      = "Antonio Bernal de Celis";         // nombre que verá la persona en el correo del código
const SUBTITULO_WEB   = "Compositor de música para videojuegos";
const MINUTOS_VALIDEZ = 10;                                // lo que dura cada código
const MAX_INTENTOS    = 5;                                 // fallos permitidos antes de anular el código
const MAX_CODIGOS_DIA = 40;                                // tope diario de códigos (protege tu cuota de Gmail)


function doPost(e) {
  const p = e.parameter || {};

  // Antispam: si el campo oculto viene relleno, es un bot → fingimos éxito
  if (p.web) return responder({ ok: true });

  const nombre  = (p.nombre  || "").trim().slice(0, 200);
  const email   = (p.email   || "").trim().slice(0, 200);
  const asunto  = (p.asunto  || "").trim().slice(0, 200);
  const mensaje = (p.mensaje || "").trim().slice(0, 5000);
  const codigo  = (p.codigo  || "").replace(/\D/g, "");

  if (!nombre || !mensaje || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return responder({ ok: false, error: "Faltan datos o el email no es válido." });
  }

  const cache = CacheService.getScriptCache();
  const clave = "v:" + email.toLowerCase();


  /* ---------- PASO 1: enviar el código al email de la persona ---------- */

  if (p.accion === "codigo") {

    const previo = cache.get(clave);
    if (previo && Date.now() < JSON.parse(previo).t - (MINUTOS_VALIDEZ - 1) * 60000) {
      return responder({ ok: false, error: "Espera un minuto antes de pedir otro código." });
    }

    const props  = PropertiesService.getScriptProperties();
    const hoy    = "dia:" + Utilities.formatDate(new Date(), "Europe/Madrid", "yyyyMMdd");
    const usados = Number(props.getProperty(hoy) || 0);

    if (usados >= MAX_CODIGOS_DIA || MailApp.getRemainingDailyQuota() < 2) {
      return responder({ ok: false, error: "El formulario no está disponible ahora mismo. Inténtalo mañana." });
    }

    const nuevo = String(Math.floor(100000 + Math.random() * 900000));

    // 1º se envía el correo (lo que la persona está esperando)…
    MailApp.sendEmail({
      to: email,
      name: NOMBRE_WEB,
      subject: nuevo + " es tu código de verificación",
      body:
        "Hola " + nombre + ",\n\n" +
        "Tu código para enviar el mensaje desde la web de " + NOMBRE_WEB + " es:\n\n" +
        "    " + nuevo + "\n\n" +
        "Caduca en " + MINUTOS_VALIDEZ + " minutos.\n" +
        "Si no has sido tú, ignora este correo.",
      htmlBody: correoCodigo(nombre, nuevo)
    });

    // …y después se guarda lo necesario para comprobarlo
    cache.put(clave, JSON.stringify({ c: nuevo, i: 0, t: Date.now() + MINUTOS_VALIDEZ * 60000 }), MINUTOS_VALIDEZ * 60);
    props.setProperty(hoy, String(usados + 1));

    return responder({ ok: true });
  }


  /* ---------- PASO 2: comprobar el código y enviarte el mensaje ---------- */

  if (p.accion === "enviar") {

    const guardado = cache.get(clave);
    const g = guardado ? JSON.parse(guardado) : null;

    if (!g || Date.now() > g.t) {
      cache.remove(clave);
      return responder({ ok: false, caducado: true, error: "El código ha caducado. Pulsa «Verificar y enviar» para recibir uno nuevo." });
    }

    if (codigo !== g.c) {
      g.i++;
      if (g.i >= MAX_INTENTOS) {
        cache.remove(clave);
        return responder({ ok: false, caducado: true, error: "Demasiados intentos. Pide un código nuevo." });
      }
      const restante = Math.max(1, Math.round((g.t - Date.now()) / 1000));
      cache.put(clave, JSON.stringify(g), restante);
      const quedan = MAX_INTENTOS - g.i;
      return responder({ ok: false, error: "Código incorrecto. Te queda" + (quedan === 1 ? " 1 intento." : "n " + quedan + " intentos.") });
    }

    cache.remove(clave);

    MailApp.sendEmail({
      to: DESTINO,
      replyTo: email,
      subject: "Mensaje de: " + nombre + (asunto ? " - " + asunto : ""),
      body:
        "Nombre: " + nombre + "\n" +
        "Email: " + email + " (verificado ✔)\n" +
        "Asunto: " + (asunto || "—") + "\n\n" +
        mensaje,
      htmlBody: correoMensaje(nombre, email, asunto, mensaje)
    });

    return responder({ ok: true });
  }

  return responder({ ok: false, error: "Acción no válida." });
}


/* La web llama aquí al abrir Contacto para "despertar" el script
   y que responda más rápido cuando la persona pulse enviar */
function doGet() {
  return responder({ ok: true });
}


/* ================================================================
   CORREO DEL CÓDIGO (diseño a juego con la web)
   Colores de la paleta: taupe #463F3A · rosa #E0AFA0 · pergamino #F4F3EE
   ================================================================ */

function correoCodigo(nombre, codigo) {
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const serif = "Georgia,'Times New Roman',serif";
  const sans  = "'Helvetica Neue',Helvetica,Arial,sans-serif";

  // El código va en UN solo bloque de texto (se copia entero con doble clic);
  // el espaciado entre números es solo visual, no añade espacios al copiar
  const bloqueCodigo =
    '<div style="display:inline-block;padding:14px 18px 14px 30px;background:#FFFFFF;' +
    'border:1px solid #E0AFA0;border-bottom:3px solid #E0AFA0;border-radius:8px;' +
    'font-family:' + sans + ';font-size:36px;line-height:1.2;font-weight:bold;letter-spacing:12px;color:#463F3A;' +
    'white-space:nowrap">' + codigo + '</div>';

  return '' +
  '<div style="margin:0;padding:24px 8px;background:#EAE7DF">' +
  '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%" style="max-width:520px;margin:0 auto;border-collapse:collapse">' +

    // Cabecera
    '<tr><td style="background:#463F3A;padding:30px 20px 26px;text-align:center;border-radius:10px 10px 0 0">' +
      '<div style="font-family:' + serif + ';font-size:26px;color:#F4F3EE;letter-spacing:1px">' + esc(NOMBRE_WEB) + '</div>' +
      '<div style="font-family:' + serif + ';font-style:italic;font-size:15px;color:#E0AFA0;margin-top:6px">' + esc(SUBTITULO_WEB) + '</div>' +
      // pentagrama decorativo
      '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="160" style="margin:18px auto 0">' +
        [0,1,2,3,4].map(() => '<tr><td style="height:4px;border-top:1px solid #8A817C;font-size:0;line-height:0">&nbsp;</td></tr>').join("") +
      '</table>' +
    '</td></tr>' +

    // Cuerpo
    '<tr><td style="background:#F4F3EE;padding:32px 20px 12px;text-align:center">' +
      '<div style="font-family:' + sans + ';font-size:11px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:#A0604E">Verificación de email</div>' +
      '<p style="font-family:' + serif + ';font-size:22px;color:#463F3A;margin:14px 0 8px">Hola, ' + esc(nombre) + '</p>' +
      '<p style="font-family:' + sans + ';font-size:15px;line-height:1.6;color:#6B635E;margin:0 0 26px">Este es tu código para enviar el mensaje desde la web.<br>Escríbelo en el formulario para confirmar que el email es tuyo.</p>' +
      bloqueCodigo +
      '<p style="font-family:' + sans + ';font-size:12px;color:#8A817C;margin:10px 0 0">Haz doble clic sobre el código (o mantén pulsado en el móvil) para copiarlo</p>' +
      '<p style="font-family:' + sans + ';font-size:13px;color:#6B635E;margin:22px 0 0">Caduca en <strong style="color:#463F3A">' + MINUTOS_VALIDEZ + ' minutos</strong></p>' +
    '</td></tr>' +

    // Pie
    '<tr><td style="background:#F4F3EE;padding:22px 20px 28px;text-align:center;border-radius:0 0 10px 10px">' +
      '<div style="height:1px;background:#BCB8B1;margin:0 0 18px;font-size:0;line-height:0">&nbsp;</div>' +
      '<p style="font-family:' + sans + ';font-size:12px;line-height:1.6;color:#8A817C;margin:0">Si no has sido tú, puedes ignorar este correo.<br>Nadie podrá enviar mensajes en tu nombre sin este código.</p>' +
    '</td></tr>' +

  '</table>' +
  '</div>';
}


/* ================================================================
   CORREO QUE RECIBES TÚ (mensaje del formulario de contacto)
   ================================================================ */

function correoMensaje(nombre, email, asunto, mensaje) {
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const serif = "Georgia,'Times New Roman',serif";
  const sans  = "'Helvetica Neue',Helvetica,Arial,sans-serif";
  const fecha = Utilities.formatDate(new Date(), "Europe/Madrid", "d/MM/yyyy 'a las' HH:mm");
  const inicial = esc(nombre.charAt(0).toUpperCase());
  const responderUrl = "mailto:" + encodeURIComponent(email) +
    "?subject=" + encodeURIComponent("Re: " + (asunto || "Tu mensaje en la web de " + NOMBRE_WEB));

  const fila = (etiqueta, valor) =>
    '<tr>' +
      '<td style="padding:7px 0;width:74px;vertical-align:top;font-family:' + sans + ';font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#A0604E">' + etiqueta + '</td>' +
      '<td style="padding:7px 0;vertical-align:top;font-family:' + sans + ';font-size:15px;color:#463F3A">' + valor + '</td>' +
    '</tr>';

  return '' +
  '<div style="margin:0;padding:24px 8px;background:#EAE7DF">' +
  '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%" style="max-width:600px;margin:0 auto;border-collapse:collapse">' +

    // Cabecera
    '<tr><td style="background:#463F3A;padding:26px 24px;border-radius:10px 10px 0 0">' +
      '<div style="font-family:' + sans + ';font-size:11px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:#E0AFA0">Nuevo mensaje desde tu web</div>' +
      '<div style="font-family:' + serif + ';font-size:22px;color:#F4F3EE;margin-top:6px">' + esc(NOMBRE_WEB) + '</div>' +
      '<div style="font-family:' + sans + ';font-size:12px;color:#BCB8B1;margin-top:6px">Recibido el ' + esc(fecha) + '</div>' +
    '</td></tr>' +

    // Remitente
    '<tr><td style="background:#F4F3EE;padding:28px 24px 8px">' +
      '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>' +
        '<td style="width:56px;vertical-align:middle">' +
          '<div style="width:48px;height:48px;line-height:48px;border-radius:50%;background:#E0AFA0;text-align:center;font-family:' + serif + ';font-size:22px;color:#463F3A">' + inicial + '</div>' +
        '</td>' +
        '<td style="vertical-align:middle">' +
          '<div style="font-family:' + serif + ';font-size:22px;color:#463F3A">' + esc(nombre) + '</div>' +
          '<div style="margin-top:4px;font-family:' + sans + ';font-size:14px">' +
            '<a href="mailto:' + esc(email) + '" style="color:#A0604E;text-decoration:none">' + esc(email) + '</a>' +
            '&nbsp;&nbsp;<span style="display:inline-block;padding:2px 9px;border-radius:999px;background:#E3EDE4;color:#3F6B48;font-size:11px;font-weight:bold;letter-spacing:.5px">✔ VERIFICADO</span>' +
          '</div>' +
        '</td>' +
      '</tr></table>' +
    '</td></tr>' +

    // Datos
    '<tr><td style="background:#F4F3EE;padding:14px 24px 0">' +
      '<div style="height:1px;background:#BCB8B1;font-size:0;line-height:0">&nbsp;</div>' +
      '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:10px">' +
        fila("Asunto", asunto ? esc(asunto) : '<span style="color:#8A817C;font-style:italic">Sin asunto</span>') +
      '</table>' +
    '</td></tr>' +

    // Mensaje
    '<tr><td style="background:#F4F3EE;padding:14px 24px 6px">' +
      '<div style="font-family:' + sans + ';font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#A0604E;margin-bottom:10px">Mensaje</div>' +
      '<div style="background:#FFFFFF;border-left:3px solid #E0AFA0;border-radius:0 8px 8px 0;padding:18px 20px;font-family:' + sans + ';font-size:15px;line-height:1.7;color:#463F3A">' +
        esc(mensaje).replace(/\r?\n/g, "<br>") +
      '</div>' +
    '</td></tr>' +

    // Botón responder
    '<tr><td style="background:#F4F3EE;padding:24px 24px 30px;text-align:center;border-radius:0 0 10px 10px">' +
      '<a href="' + responderUrl + '" style="display:inline-block;padding:14px 30px;background:#463F3A;color:#F4F3EE;border-radius:4px;font-family:' + sans + ';font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;text-decoration:none">Responder a ' + esc(nombre.split(" ")[0]) + '</a>' +
      '<p style="font-family:' + sans + ';font-size:12px;color:#8A817C;margin:14px 0 0">También puedes pulsar «Responder» en tu correo: irá directamente a ' + esc(email) + '</p>' +
    '</td></tr>' +

  '</table>' +
  '</div>';
}


function responder(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
