# CMS — Fase 1: seguridad de publicación (solo propuesta)

Estado: **pendiente de revisión y aprobación**, sin despliegue.

## Controles incorporados en esta rama

- Decap CMS: `publish_mode: editorial_workflow` para preparar borradores y revisiones, en lugar de publicar contenido inmediatamente.
- `npm test`: pruebas Node para verificar configuración fundamental.
- `npm run build`: compilación Eleventy sin despliegue.
- GitHub Actions `cms-qa`: valida el CMS y el build en cada pull request a `main`; **no hace push, merge ni deploy**.

## Acciones manuales obligatorias antes de aprobar el cambio

1. **GitHub > Settings > Rules > Rulesets**: crear regla activa aplicable a `main` que exija pull request, al menos una aprobación independiente, conversación resuelta y status check `cms-qa` (seleccionar el nombre registrado por GitHub tras la primera ejecución).
2. Deshabilitar force push y borrado de `main`, impedir bypass a los actores que publican y restringir push directo. Confirmar si el plan de GitHub permite ejecutar las reglas para este repositorio público.
3. Verificar controles equivalentes en GitHub Pages y cualquier despliegue externo. El job nativo `pages build and deployment` **no es un gate de seguridad**.
4. Revisar en una sesión de prueba que el editor no pueda publicar sin revisión y que solo un revisor autorizado pueda aprobar un PR. Un usuario con permisos de escritura sobre `main` no debe poder publicar directamente.
5. Crear Preview/Staging independiente, con dominio de prueba, `noindex`, y sin credenciales o datos productivos innecesarios.
6. Aprobar una prueba integral de creación, edición, revisión, publicación controlada y rollback en un entorno aislado. **No hacer merge hasta terminarla.**

## Advertencias y limitaciones

- Los permisos de GitHub determinan la autorización real; `editorial_workflow` por sí solo **no impone RBAC**.
- No se cambian aquí los activos multimedia, la CSP ni la arquitectura de entrega: se revisarán en fases posteriores.
- Un check verde confirma solamente la ejecución de sus pruebas, no una auditoría integral ni un despliegue seguro.
