# Auditoría Completa del Proyecto María Auxi

## Resumen
- Se corrigieron etiquetas HTML inválidas `<base target="_blank">` en `index.html` y `admin/index.html`.
- Se creó una acción de GitHub Pages en `.github/workflows/github-pages-deploy.yml` para desplegar directamente el contenido estático desde la rama `main`.
- Se validó que `CNAME` contenga el dominio `mariauxi.com` y que `.nojekyll` exista para evitar procesamiento Jekyll en GitHub Pages.
- Se verificó que `admin/config.yml` y `worker/index.js` estén presentes y no presenten problemas de referencia directa en la auditoría actual.

## Cambios aplicados

### HTML
- Eliminadas las etiquetas `<base target="_blank">` redundantes e inválidas en:
  - `index.html`
  - `admin/index.html`
- Esto evita comportamientos inesperados en la navegación y problemas con el SEO.

### Flujo de despliegue GitHub Pages
- Añadido archivo `.github/workflows/github-pages-deploy.yml` con los siguientes pasos:
  - Checkout del repositorio.
  - Preparación del artefacto de Pages excluyendo `.git`, `.github`, `pages-artifact`, `node_modules`, `npm-debug.log`.
  - Opcional: instalación y ejecución de `npm run build` si existe un script `build` en `package.json`.
  - Subida del artefacto usando `actions/upload-pages-artifact@v1`.
  - Despliegue con `actions/deploy-pages@v1`.
- Permisos agregados:
  - `contents: read`
  - `pages: write`
  - `id-token: write`

### Configuración de dominio
- Verificado `CNAME` contiene `mariauxi.com` sin espacios adicionales.
- Se confirmó la existencia de `.nojekyll` y que tenga seguimiento en git.

## Recomendaciones para producción
1. Asegurar que GitHub Pages esté habilitado en el repositorio y apunte a la rama `main`.
2. Revisar `admin/config.yml` para confirmar la URL del backend y la rama `main` en el flujo editorial.
3. Mantener los archivos de imágenes y videos fuera del control de versiones si no son necesarios en el repo, y usar almacenamiento CDN o releases para activos grandes.
4. Revisar si Cloudflare Worker continúa necesitando `CMS_ORIGIN=https://mariauxi.com` y actualice `wrangler.toml` si cambia el dominio.

## Estado final
- Commit `4f4580b` aplicado con los cambios de auditoría.
- El proyecto está listo para que GitHub Pages inicie un despliegue desde `main`.
- No se detectaron más etiquetas `<base>` inválidas en el repo.
