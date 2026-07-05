# Invitación Digital Premium — 75 Años

Invitación digital de una sola página (SPA estática), pensada para verse
como una invitación impresa de lujo pero interactiva: cuenta regresiva,
mapa, galería, música de fondo, confirmación de asistencia con envío
automático a Google Sheets, y todo lo necesario para compartirla por
WhatsApp.

100% HTML, CSS y JavaScript puro. Sin frameworks, sin Bootstrap, sin
backend propio. Lista para GitHub Pages.

---

## 1. Estructura del proyecto

```
InvitacionDigital/
├── index.html              → Página principal (las 14 secciones)
├── gracias.html             → Pantalla que se ve tras confirmar asistencia
├── manifest.json             → Configuración PWA (opcional)
├── sw.js                     → Service Worker para modo sin conexión (opcional)
├── README.md
│
├── assets/
│   ├── css/
│   │   ├── variables.css     → Colores, tipografías, espaciados (EDITA AQUÍ los colores)
│   │   ├── style.css         → Estilos de todas las secciones
│   │   ├── responsive.css    → Ajustes para tablet / escritorio
│   │   └── animaciones.css   → Confeti, fade, zoom, parallax
│   ├── js/
│   │   ├── app.js            → Orquestador: carga configuracion.json y arranca todo
│   │   ├── contador.js       → Cuenta regresiva
│   │   ├── formulario.js     → Formulario de confirmación (RSVP)
│   │   ├── scroll.js         → Revelado progresivo + parallax
│   │   ├── musica.js         → Botón flotante de música
│   │   ├── maps.js           → Mapa incrustado y botón "Cómo llegar"
│   │   └── animaciones.js    → Generador de confeti
│   ├── img/                  → Tus fotos (ver LEEME.txt dentro)
│   ├── audio/                → Tu música de fondo (ver LEEME.txt dentro)
│   ├── iconos/                → favicon.svg
│   └── fonts/                 → Opcional, ver LEEME.txt dentro
│
├── google/
│   ├── appscript.js           → Código para Google Apps Script
│   └── instrucciones.txt      → Pasos para conectar con Google Sheets
│
└── data/
    └── configuracion.json     → TODOS los datos del evento (nombre, fecha, lugar...)
```

**Regla de oro:** para personalizar el 90% del contenido (nombre, fecha,
hora, lugar, frases, galería, WhatsApp), solo necesitas editar
`data/configuracion.json`. No necesitas tocar el HTML.

---

## 2. Cómo cambiar cada cosa

### Cambiar el nombre de la festejada
Edita `data/configuracion.json` → `evento.nombreFestejada`.
Se actualiza automáticamente en todas las secciones (bienvenida, nombre,
título de la pestaña, mensaje de WhatsApp, etc.).

### Cambiar la fecha y hora
Edita `data/configuracion.json` → `fechaHora.fechaISO` (formato
`AAAA-MM-DDTHH:mm:00`, en la hora local del evento) y los campos
`fechaTexto` / `horaTexto` (el texto que se muestra, en español).
La cuenta regresiva usa `fechaISO`; los textos de las tarjetas usan
`fechaTexto` y `horaTexto`.

### Cambiar la ubicación
Edita `data/configuracion.json` → `lugar`:
- `nombreLugar` y `direccion`: el texto que se muestra.
- `latitud` / `longitud`: coordenadas del lugar (puedes obtenerlas
  buscando el lugar en Google Maps, clic derecho > "¿Qué hay aquí?").
- `urlGoogleMaps`: se genera automáticamente con esas coordenadas, pero
  puedes pegar cualquier enlace de Google Maps si lo prefieres.

### Cambiar las fotos
1. Coloca tus imágenes en `assets/img/` (ver `assets/img/LEEME.txt`
   para los nombres exactos recomendados).
2. Para la foto principal: en `index.html`, busca el comentario
   `<!-- Reemplaza este bloque por... -->` dentro de la sección
   `id="foto-principal"` y sustituye el `<div class="foto-placeholder">`
   por `<img src="assets/img/foto-principal.jpg" alt="...">`.
3. Para la galería: edita el arreglo `galeria` en
   `data/configuracion.json` (agrega, quita o renombra fotos ahí, se
   genera solo).

### Cambiar la música
1. Coloca tu archivo `.mp3` en `assets/audio/`.
2. Edita `data/configuracion.json` → `musica.archivo` con la ruta
   (por ejemplo `assets/audio/mi-cancion.mp3`).
   La música NUNCA se reproduce sola: el invitado debe tocar el botón
   flotante dorado (esquina inferior derecha).

### Cambiar los colores
Todo el color del sitio sale de un solo lugar:
`assets/css/variables.css`. Cambia los valores hexadecimales de:
```css
--color-dorado, --color-champagne, --color-beige, --color-crema...
```
y se actualiza en todo el sitio automáticamente (botones, bordes,
tarjetas, textos, confeti, etc.).

### Cambiar el fondo (textura mármol/acuarela)
El fondo se genera con CSS puro (gradientes + una textura sutil en
SVG), no es una imagen. Está en `assets/css/style.css`, en la clase
`.textura-marmol`. Puedes ajustar los colores de los `radial-gradient`
ahí mismo, o si prefieres usar una imagen de textura real, reemplaza
esa clase por: `background-image: url('assets/img/tu-textura.jpg');`.

### Cambiar el código de vestimenta, la frase elegante o el mensaje final
Todo esto vive en `data/configuracion.json`, en `vestimenta.*`,
`evento.fraseElegante` y `evento.mensajeFinal`.

---

## 3. Probar el proyecto en tu computadora (antes de subirlo)

Como `app.js` carga `data/configuracion.json` con `fetch()`, si abres
`index.html` con doble clic (protocolo `file://`) el navegador puede
bloquear esa lectura por seguridad. Para probarlo igual que se verá en
GitHub Pages, levanta un servidor local muy simple:

**Opción A — con Python (ya viene instalado en Mac/Linux):**
```bash
cd InvitacionDigital
python3 -m http.server 8000
```
Luego abre `http://localhost:8000` en tu navegador.

**Opción B — con Node.js:**
```bash
cd InvitacionDigital
npx serve .
```

**Opción C — extensión "Live Server" de VS Code:**
clic derecho sobre `index.html` > "Open with Live Server".

---

## 4. Subir a GitHub Pages

1. **Crear el repositorio**
   - Entra a https://github.com y crea un repositorio nuevo, por
     ejemplo `InvitacionDigital` (puede ser público o privado; para
     Pages gratuito en cuentas personales debe ser público, salvo que
     tengas GitHub Pro/Team).

2. **Subir el proyecto**
   Desde la carpeta del proyecto en tu computadora:
   ```bash
   cd InvitacionDigital
   git init
   git add .
   git commit -m "Primera versión de la invitación"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/InvitacionDigital.git
   git push -u origin main
   ```
   (También puedes arrastrar los archivos directamente desde la web
   de GitHub si no quieres usar comandos: botón "Add file" > "Upload
   files").

3. **Activar GitHub Pages**
   - En tu repositorio, ve a **Settings > Pages**.
   - En "Source", elige **Deploy from a branch**.
   - En "Branch", elige **main** y la carpeta **/ (root)**.
   - Haz clic en **Save**.

4. **Obtener la URL**
   - Espera 1-2 minutos y recarga la página de Settings > Pages.
   - Verás un mensaje: "Your site is live at https://TU-USUARIO.github.io/InvitacionDigital/"
   - Esa es la URL que compartirás con tus invitados.
   - Actualízala también en `data/configuracion.json` →
     `compartir.urlSitio`, y en las etiquetas `og:url` / `canonical` de
     `index.html`, para que el QR y las vistas previas de WhatsApp
     apunten al lugar correcto.

5. **Actualizar el sitio cuando cambies algo**
   Cada vez que edites archivos:
   ```bash
   git add .
   git commit -m "Actualizo fotos y fecha"
   git push
   ```
   GitHub Pages se actualiza solo, en 1-2 minutos.

---

## 5. Conectar el formulario con Google Sheets

Instrucciones completas y detalladas en `google/instrucciones.txt`.
Resumen rápido:
1. Crea una Google Sheet.
2. Extensiones > Apps Script, pega el contenido de `google/appscript.js`.
3. Implementar > Nueva implementación > Aplicación web > Acceso "Cualquier usuario".
4. Copia la URL que te da Google.
5. Pégala en `data/configuracion.json` → `confirmacion.urlGoogleAppsScript`.

Cada confirmación se guardará con: fecha, hora, responsable, cantidad
de personas, nombres de cada persona, comentarios, IP reportada por el
navegador del invitado y su user-agent.

---

## 6. Funciones incluidas

- Pantalla de carga, fade in, zoom, parallax y scroll reveal en todas las secciones.
- Cuenta regresiva en vivo (días/horas/minutos/segundos).
- Botón de música flotante (sin autoplay).
- Mapa de Google Maps incrustado + botón "Abrir en Maps".
- Formulario de confirmación con campos dinámicos (1 a 4 personas) y validación.
- Confeti dorado sutil y continuo, más una ráfaga al confirmar asistencia.
- Galería con visor de foto ampliada (lightbox).
- Código QR generado automáticamente con el enlace del sitio.
- Botón "Compartir por WhatsApp" con mensaje predefinido.
- Botón "Agregar al calendario" (Google Calendar + descarga .ics universal).
- Modo oscuro opcional (botón flotante, se recuerda entre visitas).
- Meta etiquetas SEO + Open Graph (vista previa con foto al compartir por WhatsApp).
- PWA opcional (manifest.json + sw.js): se puede "instalar" y cachea archivos para carga rápida.
- 100% responsive: celular, tablet y escritorio.

## 7. Notas importantes antes de compartir la invitación

- Reemplaza **todos** los textos de ejemplo ("María Elena Rodríguez",
  la dirección, etc.) en `data/configuracion.json`.
- Sube tus fotos reales a `assets/img/` (revisa los `LEEME.txt`).
- Prueba el formulario al menos una vez tú mismo antes de enviar el
  enlace a tus invitados, para confirmar que llega a tu Google Sheet.
- El archivo `manifest.json` y `sw.js` son opcionales: si no los
  quieres, simplemente bórralos y quita la línea
  `<link rel="manifest" ...>` de `index.html` y la llamada a
  `registrarServiceWorkerPWA()` en `assets/js/app.js`.
