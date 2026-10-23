# Bloqueo temporal de María Auxi Staging

## Objetivo
Restringir temporalmente el sitio `mariauxi-staging.pages.dev` y sus subdominios de despliegue, antes de permitir pruebas de CMS. No es una autenticación de usuarios. Es una **denegación de acceso temporal**.

## Implementación
- Cloudflare Pages Functions: `functions/_middleware.js`.
- Todos los métodos y rutas del host `mariauxi-staging.pages.dev` y los subdominios correspondientes devuelven HTTP 403.
- Otros hosts, como `mariauxi.com` y `adphor-platform.pages.dev`, no se interceptan.
- La política Cloudflare Access no ha podido verificarse ni modificarse mediante una sesión autorizada; pendiente.

## Verificaciones obligatorias
1. Ejecutar `npm test` y build exitoso.
2. Verificar anónimamente HTTP 403 para el host de staging, `/admin/`, `/admin/config.yml`, multimedia y al menos una URL de preview **del despliegue nuevo**.
3. Validar en Cloudflare Pages el deployment activo y que Pages Functions estén habilitadas (no basta un build verde).
4. Configurar `Settings > Runtime > Fail open / closed` a **Fail closed** para evitar servir archivos estáticos si se agota el cupo de invocaciones Functions.
5. Configurar Cloudflare Zero Trust Access con **Allow por correos autorizados**, no `Everyone`, tanto para el dominio principal como las vistas previas; luego verificar con navegador anónimo y usuarios autorizados.
6. Comprobar los despliegues antiguos, sus URLs inmutables y cualquier dominio alternativo: este middleware no modifica retroactivamente las versiones ya publicadas.
7. La aplicación Decap CMS en esta rama todavía no ofrece aislamiento completo de `main`; no permitir edición desde Staging.

**Advertencia:** Si Pages Functions no está activada, o si la plataforma está configurada para fail-open y se agota el cupo, esta medida puede no bloquear todo el tráfico. Cloudflare Access verificado sigue siendo la protección definitiva.

**Prohibido fusionar a `main` por el momento.** El PR de la Fase 1 permanece en Draft.
