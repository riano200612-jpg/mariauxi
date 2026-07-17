# María Auxi — Configuración de CMS

Este repositorio usa Decap CMS con backend GitHub para administrar contenido desde `admin/index.html`.

## Estructura relevante

- `admin/index.html` — panel de administración del CMS
- `admin/config.yml` — única configuración del CMS
- `contenido/proyectos/` — colección de contenido para la colección `proyectos`
- `img/uploads/` — carpeta para archivos multimedia cargados desde el CMS

## Estado actual

- El CMS está configurado con backend `github`.
- El repositorio apuntado es `riano200612-jpg/mariauxi`.
- La colección `proyectos` almacena archivos markdown en `contenido/proyectos`.
- Se creó un ejemplo de contenido: `contenido/proyectos/2026-07-17-proyecto-ejemplo.md`.

## Cómo usar el CMS

1. Abre `https://<tu-dominio>/admin/index.html`.
2. Haz login con GitHub.
3. El CMS cargará la configuración desde `admin/config.yml`.
4. Puedes crear, editar o borrar proyectos en la colección `Proyectos`.

## Configuración de `admin/config.yml`

- `backend.name: github`
- `backend.repo: riano200612-jpg/mariauxi`
- `backend.branch: main`
- `backend.base_url: https://mariauxi-oauth.riano200612.workers.dev`
- `backend.auth_endpoint: auth`
- `media_folder: "img/uploads"`
- `public_folder: "/img/uploads"`
- `folder: "contenido/proyectos"`
- `publish_mode: editorial_workflow`

## Requisitos

- Un repositorio público o privado en GitHub con acceso adecuado.
- El archivo `admin/config.yml` debe estar disponible en `/admin/config.yml` desde el sitio.
- La página `admin/index.html` debe cargar el script de Decap CMS.
- Las carpetas `contenido/proyectos` e `img/uploads` deben existir en el repositorio.

## Flujo de despliegue sugerido

1. Sube los cambios al repositorio GitHub.
2. Publica el sitio en GitHub Pages.
3. Asegúrate de que `https://<tu-dominio>/admin/index.html` sea accesible.
4. Despliega el Worker OAuth incluido con `npx wrangler deploy`.
5. En el Worker, configura los secretos `GITHUB_OAUTH_ID` y `GITHUB_OAUTH_SECRET`.
6. En la aplicación OAuth de GitHub, registra como callback `https://mariauxi-oauth.riano200612.workers.dev/callback`.
7. Accede a la página y autentícate con GitHub.

> El CMS usa el Worker OAuth definido en `worker/index.js`; las dos rutas necesarias son `/auth` y `/callback`.

## Validaciones realizadas

- Se creó la carpeta `contenido/proyectos`.
- Se creó la carpeta `img/uploads`.
- Se añadió un archivo de ejemplo para validar la colección.
- `admin/index.html` carga Decap CMS, que detecta automáticamente `admin/config.yml`.

## Notas importantes

- Si usas un dominio personalizado, verifica que el admin y `admin/config.yml` se sirvan correctamente.
- Si el repositorio es privado, revisa permisos y scopes de OAuth de GitHub.

## Sugerencias adicionales

- Si tu proyecto usa una rama distinta a `main`, actualiza `backend.branch`.
- Si necesitas un flujo editorial completo, mantén `publish_mode: editorial_workflow`.
- Si el CMS no carga, revisa la consola del navegador en la página `/admin/index.html` para errores.
