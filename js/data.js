/* ================================================================
   DATOS DE LA WEB  ·  Edita aquí el contenido
   ----------------------------------------------------------------
   - CONFIG: nombre, frase, texto "Sobre mí", email y redes.
     En "bio" puedes usar <b>negrita</b>, <i>cursiva</i> y <br> para
     saltar de línea, siempre DENTRO de las comillas.
   - COMPOSITIONS: cada obra. Las categorías (menú "Música") se
     generan solas a partir del campo "category".
   - Colores y tipografía NO están aquí: ver css/theme.css
   ================================================================ */

(function(){

  "use strict";

  var CONFIG = {

    siteName: "Antonio Bernal de Celis",

    tagline:
      "Compositor de música para videojuegos.",

    bio:
      "Soy artista musical, con especial interés en diseño de sonido, composición musical y creación de SFX para videojuegos.<br><br>Componente como <b>trompetista</b> durante 5 años en la Agrupación Musical Lágrimas de Dolores (San Fernando, Cádiz).<br><br>Actualmente participo en la OrquestaVS como <b>guitarrista</b>.",

    mail:
      "antoniobernaldecelis@gmail.com",

    /* URL del Google Apps Script que envía el formulario de contacto a tu correo.
       (Opcional) formEndpointReserva: una segunda URL que se usa si la principal no responde. */
    formEndpoint:
      "https://script.google.com/macros/s/AKfycbxhXv-ylzUIGSoFVnr1ejUxYdePAZH-dkkTzbNE8UC_PfhFn3BfIfhzDb-PtmUcw5angQ/exec",

    socials: [
      { label: "YouTube", url: "https://www.youtube.com/@AntonioBernaldeCelis" }
    ]
  };


  /* ================================================================
     COMPOSICIONES  (EDITA AQUÍ)
     cover / score: rutas de imagen. Los campos *PosX / *PosY / *Zoom
     ajustan el encuadre de cada imagen en el carrusel de la obra.
     ================================================================ */

  var COMPOSITIONS = [

    {
      id: "la-leyenda-de-coyote",
      title: "La Leyenda de Coyote",
      year: 2025,
      category: "Coyote Requiem",
      description: "Tema introductorio del videojuego Coyote Requiem.",
      detailedDescription: "",
      videoId: "kEAklq5330A",

      cover: "imagenes/coyoteRequiem.png",
      coverWidth: "100%",
      coverHeight: "100%",
      coverPosX: "80%",
      coverPosY: "50%",
      coverZoom: "1",

      score: "imagenes/LaLeyendaDeCoyote.png",
      scoreWidth: "100%",
      scoreHeight: "100%",
      scorePosX: "0%",
      scorePosY: "50%",
      scoreZoom: "1"
    },

    {
      id: "forastero",
      title: "Forastero",
      year: 2025,
      category: "Coyote Requiem",
      description: "Tema del menú principal del videojuego Coyote Requiem.",
      detailedDescription: "Está en la tonalidad de Re menor, en un compás de 4/4. Tiene una percusión de tambores, maracas, castañuelas y bombo. El ritmo lo marcan el tambor y los bajos acústicos, principalmente.\n\nLa melodía la llevan una guitarra eléctrica y un banjo, con ciertos detalles de flautas de pan y armónicas o coros masculinos.",
      videoId: "fms6DhtAu0Y",

      cover: "imagenes/coyoteRequiem.png",
      coverWidth: "100%",
      coverHeight: "100%",
      coverPosX: "80%",
      coverPosY: "50%",
      coverZoom: "1",

      score: "imagenes/Forastero.png",
      scoreWidth: "100%",
      scoreHeight: "100%",
      scorePosX: "0%",
      scorePosY: "50%",
      scoreZoom: "1"
    },

    {
      id: "¡entrenamiento!",
      title: "¡Entrenamiento",
      year: 2025,
      category: "Coyote Requiem",
      description: "Tema del tutorial del videojuego Coyote Requiem.",
      detailedDescription: "Se trata de un tema desenfadado y divertido, donde el protagonista se enfrenta a un cactus a modo de tutorial.\nEstá en tono de Mi menor, variando a La menor (su 5ª) cada 8 compases, y un compás de 4/4. Tiene cierto aire circense.\n\nSe emplea como base un piano y dos bajos (acústico y eléctrico). La melodía la llevan en un principio una guitarra eléctrica y un banjo, para luego ser protagonistas una flauta de pan y una trompeta en la siguiente sección. Se mantiene un ritmo alegre y bailable durante toda la canción.",
      videoId: "-sNp4IKkhjE",

      cover: "imagenes/coyoteRequiem.png",
      coverWidth: "100%",
      coverHeight: "100%",
      coverPosX: "80%",
      coverPosY: "50%",
      coverZoom: "1",

      score: "imagenes/Entrenamiento.png",
      scoreWidth: "100%",
      scoreHeight: "100%",
      scorePosX: "0%",
      scorePosY: "50%",
      scoreZoom: "1"
    },

    {
      id: "pricklytown-exploracion",
      title: "Pricklytown (Exploración)",
      year: 2025,
      category: "Coyote Requiem",
      description: "Tema de exploración del nivel 1 del videojuego, cuando el protagonista llega al pueblo de Pricklytown.",
      detailedDescription: "Se trata de un tema aventurero, que transmite calma al principio, pero va adquiriendo fuerza e intensidad. Su instrumentación es puramente de vientos-madera. La melodía es tocada por flauta y oboe. Mientras que los clarinetes marcan el ritmo y el clarinete bajo y fagot llevan la armonía.\nLa única percusión son los timbales.",
      videoId: "pp6rfzZeQFo",

      cover: "imagenes/coyoteRequiem.png",
      coverWidth: "100%",
      coverHeight: "100%",
      coverPosX: "80%",
      coverPosY: "50%",
      coverZoom: "1",

      score: "imagenes/PricklytownExploracion.png",
      scoreWidth: "100%",
      scoreHeight: "100%",
      scorePosX: "0%",
      scorePosY: "50%",
      scoreZoom: "1"
    },

    {
      id: "pricklytown-batalla",
      title: "Pricklytown (¡Batalla!)",
      year: 2025,
      category: "Coyote Requiem",
      description: "Tema de batalla del nivel 1 del videojuego, cuando el protagonista se enfrenta a los enemigos del pueblo de Pricklytown.",
      detailedDescription: "Para dar un toque más marcial, se añaden los demás instrumentos de percusión (tambor, bombo, platillos) y los vientos-metales (trompas, trompeta, bombardino y tuba). Estos instrumentos añadidos le dan más cuerpo y consistencia a la canción, haciéndola más épica y adecuada al combate.\n\nEn un pequeño fragmento sección A de la canción, las trompas realizan el tema de los villanos, con un sonido oscuro.\nMientras que al final de la sección B, la trompeta toca el motivo del héroe, con un timbre mucho más claro y limpio.\n\nAl final de la canción suenan campanas en referencia a la iglesia del pueblo.",
      videoId: "DGc7DMXzfSs",

      cover: "imagenes/coyoteRequiem.png",
      coverWidth: "100%",
      coverHeight: "100%",
      coverPosX: "80%",
      coverPosY: "50%",
      coverZoom: "1",

      score: "imagenes/PricklytownBatalla.png",
      scoreWidth: "100%",
      scoreHeight: "100%",
      scorePosX: "10%",
      scorePosY: "50%",
      scoreZoom: "1"
    },

    {
      id: "la-piedra-del-cielo",
      title: "La Piedra del Cielo",
      year: 2025,
      category: "Coyote Requiem",
      description: "Tema para una cinemática del videojuego Coyote Requiem.",
      detailedDescription: "",
      videoId: "xMZcXdMi4Y8",

      cover: "imagenes/coyoteRequiem.png",
      coverWidth: "100%",
      coverHeight: "100%",
      coverPosX: "80%",
      coverPosY: "50%",
      coverZoom: "1",

      score: "imagenes/LaPiedraDelCielo.png",
      scoreWidth: "100%",
      scoreHeight: "100%",
      scorePosX: "0%",
      scorePosY: "50%",
      scoreZoom: "1"
    },

    {
      id: "transito-al-oasis-exploracion",
      title: "Tránsito al Oasis (Exploración)",
      year: 2025,
      category: "Coyote Requiem",
      description: "Tema de exploración del nivel 2 del videojuego, cuando el protagonista llega al desfiladero que conecta el pueblo de Pricklytown con el Oasis.",
      detailedDescription: "La armonía de la canción la lleva la sección de cuerdas frotadas: los violines y violas realizan notas cortas y picadas, mientras que los violonchelos y contrabajos realizan una cadencia andaluza (LAm-SOL-FA-MI) con notas más alargadas para llenar el espacio.\n\nLa armónica realiza la voz solista, y una guitarra eléctrica haciendo la cadencia andaluza con acordes y algunos arreglos.\n\nPor último, se realiza un crescendo y la canción “rompe”, añadiendo una melodía solista de violín mientras se repite toda la estructura anterior.\n\nLa percusión es simple: unos timbales redoblan y rompen en platillos cuando hay una subida.",
      videoId: "kLyhYplOomU",

      cover: "imagenes/coyoteRequiem.png",
      coverWidth: "100%",
      coverHeight: "100%",
      coverPosX: "80%",
      coverPosY: "50%",
      coverZoom: "1",

      score: "imagenes/TransitoExploracion.png",
      scoreWidth: "100%",
      scoreHeight: "100%",
      scorePosX: "0%",
      scorePosY: "50%",
      scoreZoom: "1"
    },

    {
      id: "transito-al-oasis-batalla",
      title: "Tránsito al Oasis (¡Batalla!)",
      year: 2025,
      category: "Coyote Requiem",
      description: "Tema de batalla del nivel 2 del videojuego, cuando el protagonista llega al desfiladero que conecta el pueblo de Pricklytown con el Oasis.",
      detailedDescription: "Tanto la versión de exploración como la de batalla tienen la misma base melódica, pero la versión de batalla añade un mayor cuerpo armónico, compuesto por instrumentos de viento-metal que evocan una escena más marcial.\nTambién se intensifica la sección de percusión.\n\nLa voz solista inicial de la armónica es reemplazada por una trompeta, con un cuerpo armónico de bombardino y tuba.\nLas trompas realizan el leitmotiv de los villanos.\nEn el crescendo, se incorporan las voces de un coro (soprano, alto, tenor y barítono).\n\nCuando rompe la canción (aquí sí rompe, realmente), se incorpora la armónica de la canción base, acompañada por la trompeta. Suena también una campana tubular en La.\n\nLas trompas realizan primero el leitmotiv del héroe y después el del villano (simulando el enfrentamiento entre estas dos partes). El tema del villano está más acentuado que el del héroe, dando a entender que el enemigo aún sigue suelto y el héroe no ha vencido aún.\n\nEn esta canción de combate sí hay percusión. Unos tambores militares marcan el ritmo de la marcha, junto con el bombo.",
      videoId: "9cnla9FGvMg",

      cover: "imagenes/coyoteRequiem.png",
      coverWidth: "100%",
      coverHeight: "100%",
      coverPosX: "80%",
      coverPosY: "50%",
      coverZoom: "1",

      score: "imagenes/TransitoBatalla.png",
      scoreWidth: "100%",
      scoreHeight: "100%",
      scorePosX: "0%",
      scorePosY: "50%",
      scoreZoom: "1"
    },

    {
      id: "requiem-para-lince-exploracion",
      title: "Requiem para Lince (Exploración)",
      year: 2025,
      category: "Coyote Requiem",
      description: "Tema de exploración del nivel 3 del videojuego, cuando el protagonista se adentra en las profundidades del Oasis.",
      detailedDescription: "Este tema suena durante el tercer nivel, el cual consiste en un oasis poblado de vegetación. La iluminación se torna más oscura. En este nivel se encuentra una iglesia abandonada, donde hay una “secta” que realiza rituales y cultos.\n\nCon esta ambientación se construye la música para este entorno, la cual tiene más carga de referencias sacras que el resto de las composiciones del juego.\nLos instrumentos de viento-madera tienen más importancia los metales, enfatizando así la música religiosa como la de capilla la cual se compone de un trio de vientos-madera (oboe, clarinete y fagot), pero dando un toque más orquestal para el videojuego.\n\nLa canción comienza con una cadencia (I-VI-IV-V) precediendo al primer tema: una aria. Las flautas y oboes toman la voz cantante, mientras que los clarinetes y los fagots realizan el acompañamiento, con algunos adornos de un arpa. Esta primera sección de la canción tiene un toque más misterioso.\n\nEn la siguiente sección se hace referencia al culto que realiza ritos en las ruinas de la iglesia. Para ello, la canción se convierte en música de capilla a cinco voces: flauta, oboe, clarinete(s), clarinete bajo y fagot. Se introduce levemente la melodía de la siguiente sección, para dar paso a ella con un crescendo.\n\nLa última parte de la canción se vuelve más épica, recalcando la lucha y misión del protagonista. Se hace referencia a la música de Semana Santa. Suena una melodía mucho más pegadiza.",
      videoId: "773JkJYouI8",

      cover: "imagenes/coyoteRequiem.png",
      coverWidth: "100%",
      coverHeight: "100%",
      coverPosX: "80%",
      coverPosY: "50%",
      coverZoom: "1",

      score: "imagenes/RequiemExploracion.png",
      scoreWidth: "100%",
      scoreHeight: "100%",
      scorePosX: "0%",
      scorePosY: "50%",
      scoreZoom: "1"
    },

    {
      id: "requiem-para-lince-batalla",
      title: "Requiem para Lince (¡Batalla!)",
      year: 2025,
      category: "Coyote Requiem",
      description: "Tema de batalla del nivel 3 del videojuego, cuando el protagonista se adentra en las profundidades del Oasis.",
      detailedDescription: "Este tema suena durante el tercer nivel, el cual consiste en un oasis poblado de vegetación. La iluminación se torna más oscura. En este nivel se encuentra una iglesia abandonada, donde hay una “secta” que realiza rituales y cultos.\n\nCon esta ambientación se construye la música para este entorno, la cual tiene más carga de referencias sacras que el resto de las composiciones del juego. Tanto la versión de exploración como la de batalla tienen la misma base melódica, pero la versión de batalla añade un mayor cuerpo armónico, compuesto por instrumentos de viento-metal que evocan una escena más marcial. También se intensifica la sección de percusión.\n\nSiguen presentes los leitmotifs de los villanos (escala descendente que representa al mal), interpretado por las trompas y del héroe (ligera subida ascendente), interpretado por la trompeta solista. Estos motivos se contraponen como si del propio combate se tratara.\n\nEsta es la versión de batalla, para la cual se hace una transición suave.Como en el resto de las canciones de combate, es aquí donde entran los vientos-metales (trompas, trompeta, bombardino y tuba) y la percusión.\n\nAl inicio de la canción, la tuba repite la voz del fagot, el bombardino hace un contrapunto y las trompas realizan un ritmo armónico repitiendo la cadencia ya mencionada. En el resto de la canción, los metales se limitan a rellenar el cuerpo armónico de la canción, realizando las trompas el motivo de los villanos y la trompeta el del héroe en el último fuerte de la canción.",
      videoId: "9cnla9FGvMg",

      cover: "imagenes/coyoteRequiem.png",
      coverWidth: "100%",
      coverHeight: "100%",
      coverPosX: "80%",
      coverPosY: "50%",
      coverZoom: "1",

      score: "imagenes/RequiemBatalla.png",
      scoreWidth: "100%",
      scoreHeight: "100%",
      scorePosX: "0%",
      scorePosY: "50%",
      scoreZoom: "1"
    },

    {
      id: "ceniza-y-esperanza",
      title: "Ceniza y Esperanza",
      year: 2025,
      category: "Coyote Requiem",
      description: "Tema de una cinemática del videojuego Coyote Requiem.",
      detailedDescription: "Esta canción forma parte del tema del jefe final y sirve como preludio, inspirado en la compositora Yoko Shimomura. En la cinemática donde suena por primera vez, el protagonista reposa las cenizas de su difunto marido con la intención de devolverle a la vida.\nEs por eso por lo que el tema empieza con una introducción emotiva, usando una orquesta con secciones de cuerdas y vientos madera.\n\nLa voz solista la llevan la armónica y los violines primeros, y una guitarra haciendo un trémolo. Simbolizan la esperanza y desesperación de volver a reencontrarse con él.\nLa guitarra (que representa la esperanza) se acaba apagando, mientras la armónica (desesperación) y el resto de la orquesta aumentan y bajan su intensidad, a medida que nuestro personaje va notando que algo no marcha bien.\n\nPor último, esta sección acaba con dos toques de campana tubular en DO (representa al protagonista y al marido), dando un toque más místico al ambiente e introduciendo la siguiente sección.",
      videoId: "WQOY0cQ4q6M",

      cover: "imagenes/coyoteRequiem.png",
      coverWidth: "100%",
      coverHeight: "100%",
      coverPosX: "80%",
      coverPosY: "50%",
      coverZoom: "1"
    },

    {
      id: "la-promesa",
      title: "La Promesa",
      year: 2025,
      category: "Coyote Requiem",
      description: "Tema del jefe final del videojuego Coyote Requiem.",
      detailedDescription: "Este es el tema que suena al enfrentarte al jefe final. Es el más complejo de todos y hace uso de todos los instrumentos empleados en los diferentes temas que suenan a lo largo del juego. Su compás es 4/4.\n\n\nSección A\nAquí el tema rompe por completo y el personaje entabla combate contra su adversario: se acelera el tempo, y el violín 1º y el fagot tocan el motivo dramático de esta sección, acompañados por el clarinete bajo que realiza una segunda voz.\nEntran voces de coro haciendo ritmos sincopados, pero desplazando el acento de la métrica y dando una sensación de inestabilidad, al igual que los timbales.\n\nLos violines segundos, violas y violonchelos realizan una cadencia en semicorcheas para dar agitación al tema.\n\nLos vientos metales tienen la base armónica de esta sección. Aquí la trompeta introduce sutilmente el leitmotif de los villanos, dando a entender que a quien te enfrentas ya no es tu marido.\nEl tema se modula en sus dos últimos compases, con un redoble de timbales, para dar paso a la siguiente sección.\n\nSección B\nEn esta sección la canción se torna más western, con una base de percusión que simula a un caballo galopando con el protagonismo de los tambores.\nAquí se suprime la sección de cuerda y vientos-madera; y los vientos-metales toman más importancia.\nSe mantiene el coro realizando acordes sincopados, pero inestables; y entra un bajo acústico.\n\nEl primer tema de esta sección lo realiza la guitarra eléctrica, para luego ser reemplazada por la trompeta. Esta realiza una función muy importante, ya que hace sonar el leitmotiv del héroe y del marido al unísono, dando a entender esa unión tan especial que tenían, pero a la vez el enfrentamiento que están teniendo.\n\nDespués de esta sección, el tema se ralentiza y hace una transición hacia el preludio que sirve como bucle.",
      videoId: "emyEcjr965o",

      cover: "imagenes/coyoteRequiem.png",
      coverWidth: "100%",
      coverHeight: "100%",
      coverPosX: "80%",
      coverPosY: "50%",
      coverZoom: "1",

      score: "imagenes/LaPromesa.png",
      scoreWidth: "100%",
      scoreHeight: "100%",
      scorePosX: "0%",
      scorePosY: "10%",
      scoreZoom: "1"
    },

    {
      id: "creditos",
      title: "Créditos",
      year: 2025,
      category: "Coyote Requiem",
      description: "Tema de los créditos del videojuego Coyote Requiem.",
      detailedDescription: "El tema de créditos del videojuego tiene un sonido western, con un bajo acústico realizando una escala descendente y un banjo arpegiando esta cadencia.\n\nLuego entra la percusión, que consiste en unas maracas y unas castañuelas haciendo ritmos de tresillos.\n\nAparece una flauta de pan y una armónica que se responden mutuamente con la misma melodía.",
      videoId: "R-VSi24otsE",

      cover: "imagenes/coyoteRequiem.png",
      coverWidth: "100%",
      coverHeight: "100%",
      coverPosX: "80%",
      coverPosY: "50%",
      coverZoom: "1",

      score: "imagenes/Creditos.png",
      scoreWidth: "100%",
      scoreHeight: "100%",
      scorePosX: "0%",
      scorePosY: "0%",
      scoreZoom: "1"
    },

    {
      id: "el-silencio-del-estandarte-negro",
      title: "El Silencio del Estandarte Negro",
      year: 2025,
      category: "Dopplesöldner",
      description: "Tema del menú del videojuego Dopplesöldner.",
      detailedDescription: "Este tema está inspirado en la música sacra, en concreto en un trío de capilla formado por oboe, clarinete y fagot. Sirve como tema introductorio del juego.",
      videoId: "n5eE6anqiQo",

      cover: "imagenes/Dopplesoldner.png",
      score: "imagenes/El Silencio del Estandarte Negro - partitura.png",
      scoreWidth: "100%",
      scoreHeight: "100%",
      scorePosX: "0%",
      scorePosY: "10%",
      scoreZoom: "1"
    },

    {
      id: "la-procesion-de-hierro",
      title: "La Procesión de Hierro",
      year: 2025,
      category: "Dopplesöldner",
      description: "Tema 1 de batalla del videojuego Dopplesöldner.",
      detailedDescription: "",
      videoId: "S5Pva5Qk1no",

      cover: "imagenes/Dopplesoldner.png"
    },
    
    {
      id: "camapanas-de-estrasburgo",
      title: "Campanas de Estrasburgo",
      year: 2025,
      category: "Dopplesöldner",
      description: "Tema 2 de batalla del videojuego Dopplesöldner.",
      detailedDescription: "",
      videoId: "MWar_555ikQ",

      cover: "imagenes/Dopplesoldner.png"
    }
  ];


  window.SITE = { CONFIG: CONFIG, COMPOSITIONS: COMPOSITIONS };

})();
