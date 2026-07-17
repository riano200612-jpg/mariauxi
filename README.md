# María Auxi — Configuración de CMS

Este repositorio usa Decap CMS (antes Netlify CMS) con backend GitHub para administrar contenido desde `admin/index.html`.

## Estructura relevante

- `admin/index.html` — panel de administración del CMS
- `admin/config.yml` — configuración del CMS
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
- `backend.auth_scope: public_repo`
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
2. Publica el sitio en Cloudflare Pages o Netlify.
3. Asegúrate de que `https://<tu-dominio>/admin/index.html` sea accesible.
4. En Cloudflare Pages, añade las variables de entorno `GITHUB_CLIENT_ID` y `GITHUB_CLIENT_SECRET` para el endpoint de autenticación `/api/auth`.
5. Accede a la página y autentícate con GitHub.

> Para Cloudflare Pages, el proyecto ya incluye un endpoint de autenticación en `functions/api/auth.js` para el backend GitHub del CMS.

## Validaciones realizadas

- Se creó la carpeta `contenido/proyectos`.
- Se creó la carpeta `img/uploads`.
- Se añadió un archivo de ejemplo para validar la colección.
- Se ajustó `admin/index.html` para inicializar el CMS desde `admin/config.yml`.

## Notas importantes

- La configuración actual usa backend `github`, no `git-gateway`.
- Si usas un dominio personalizado, verifica que el admin y `admin/config.yml` se sirvan correctamente.
- Si el repositorio es privado, revisa permisos y scopes de OAuth de GitHub.

## Sugerencias adicionales

- Si tu proyecto usa una rama distinta a `main`, actualiza `backend.branch`.
- Si necesitas un flujo editorial completo, mantén `publish_mode: editorial_workflow`.
- Si el CMS no carga, revisa la consola del navegador en la página `/admin/index.html` para errores.
