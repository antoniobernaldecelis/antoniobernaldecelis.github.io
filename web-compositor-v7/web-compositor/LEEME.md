# Estructura de la web

```
index.html        → esqueleto de la página (cabecera, pie, bienvenida)
css/theme.css     → TIPOGRAFÍA y COLORES (el único archivo que necesitas para cambiar el aspecto)
css/main.css      → maquetación, componentes y animaciones
js/data.js        → CONTENIDO: nombre, frase, "Sobre mí", email, redes y todas las obras
js/app.js         → navegación entre secciones, carrusel, vídeo y animaciones
imagenes/         → tus imágenes (copia aquí tu carpeta actual, no incluida)
```

## Cambiar la fuente
1. En `index.html`, bloque **TIPOGRAFÍA**: cambia la URL de Google Fonts.
2. En `css/theme.css`, apartado **1) TIPOGRAFÍA**: cambia `--font-display` (títulos) y `--font-body` (texto).

## Añadir una obra
Copia un bloque `{ ... }` dentro de `COMPOSITIONS` en `js/data.js`. Si usas una `category` nueva, aparece sola en el menú "Música".

## Secciones (direcciones)
- `#/principal` · `#/musica` · `#/musica/coyote-requiem` · `#/obra/forastero` · `#/contacto`
