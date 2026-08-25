(function () {
  'use strict';

  const GITHUB_API_URL = 'https://api.github.com/repos/riano200612-jpg/mariauxi/contents/contenido/pagina?ref=main';

  function parseFrontmatter(text) {
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return {};

    const yaml = match[1];
    const result = {};
    const lines = yaml.split(/\r?\n/);
    let currentKey = null;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      if (trimmed.startsWith('-')) {
        if (!currentKey) return;
        if (!Array.isArray(result[currentKey])) result[currentKey] = [];

        const itemContent = trimmed.replace(/^-\s*/, '');
        const colonIndex = itemContent.indexOf(':');
        if (colonIndex !== -1) {
          const k = itemContent.slice(0, colonIndex).trim();
          const v = itemContent.slice(colonIndex + 1).trim().replace(/^['"]|['"]$/g, '');
          const lastObj = result[currentKey][result[currentKey].length - 1];
          if (lastObj && typeof lastObj === 'object' && !(k in lastObj)) {
            lastObj[k] = v;
          } else {
            result[currentKey].push({ [k]: v });
          }
        }
        return;
      }

      if (line.startsWith('  ') && currentKey && Array.isArray(result[currentKey])) {
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex !== -1) {
          const k = trimmed.slice(0, colonIndex).trim();
          const v = trimmed.slice(colonIndex + 1).trim().replace(/^['"]|['"]$/g, '');
          const lastObj = result[currentKey][result[currentKey].length - 1];
          if (lastObj) lastObj[k] = v;
        }
        return;
      }

      const colonIndex = trimmed.indexOf(':');
      if (colonIndex !== -1) {
        const key = trimmed.slice(0, colonIndex).trim();
        const val = trimmed.slice(colonIndex + 1).trim().replace(/^['"]|['"]$/g, '');
        currentKey = key;
        result[key] = val;
      }
    });

    return result;
  }

  async function fetchFile(filename) {
    try {
      const res = await fetch(GITHUB_API_URL);
      const files = await res.json();
      const file = files.find(f => f.name === filename);
      if (!file) return null;

      const rawRes = await fetch(file.download_url);
      const text = await rawRes.text();
      return parseFrontmatter(text);
    } catch (err) {
      console.error(`Error cargando ${filename}:`, err);
      return null;
    }
  }

  async function loadHero() {
    const data = await fetchFile('hero.md');
    if (!data) return;

    const subtitle = document.querySelector('[data-i18n="hero_subtitle"]');
    if (subtitle && data.subtitulo) subtitle.textContent = data.subtitulo;

    const cta = document.querySelector('[data-i18n="hero_cta"]');
    if (cta) {
      if (data.boton_texto) cta.textContent = data.boton_texto;
      if (data.boton_link) cta.setAttribute('href', data.boton_link);
    }

    const video = document.querySelector('#hero-video-bg video');
    if (video && data.poster) video.setAttribute('poster', data.poster);

    const sourceWebm = document.querySelector('#hero-video-bg source[type="video/webm"]');
    if (sourceWebm && data.video_webm) sourceWebm.setAttribute('src', data.video_webm);

    const sourceMp4 = document.querySelector('#hero-video-bg source[type="video/mp4"]');
    if (sourceMp4 && data.video_mp4) sourceMp4.setAttribute('src', data.video_mp4);
  }

  async function loadContacto() {
    const data = await fetchFile('contacto.md');
    if (!data) return;

    const tag = document.querySelector('[data-i18n="contact_tag"]');
    if (tag && data.etiqueta) tag.textContent = data.etiqueta;

    const title = document.querySelector('[data-i18n="contact_title"]');
    if (title && data.titulo) title.innerHTML = data.titulo;

    const urgTitle = document.querySelector('[data-i18n="contact_urgency_title"]');
    if (urgTitle && data.urgencia_titulo) urgTitle.textContent = data.urgencia_titulo;

    const urgDesc = document.querySelector('[data-i18n="contact_urgency_desc"]');
    if (urgDesc && data.urgencia_texto) urgDesc.textContent = data.urgencia_texto;
  }

  async function loadUbicaciones() {
    const data = await fetchFile('ubicaciones.md');
    if (!data) return;

    const tag = document.querySelector('[data-i18n="ubic_tag"]');
    if (tag && data.titulo) tag.textContent = data.titulo;

    const title = document.querySelector('[data-i18n="ubic_title"]');
    if (title && data.subtitulo) title.textContent = data.subtitulo;

    if (data.mapa_embed) {
      const iframe = document.querySelector('#ubicaciones iframe');
      if (iframe) iframe.src = data.mapa_embed;
    }

    if (Array.isArray(data.zonas) && data.zonas.length > 0) {
      const zonesList = document.querySelector('#ubicaciones .zones');
      if (zonesList) {
        zonesList.innerHTML = data.zonas.map(z => `
          <li class="zone">
            <div class="zone-dot"></div>
            <span class="zone-nm">${z.nombre || ''}</span>
            <span class="zone-ct">${z.categoria || ''}</span>
          </li>
        `).join('');
      }
    }
  }

  async function loadTestimonios() {
    const data = await fetchFile('testimonios.md');
    if (!data) return;

    if (Array.isArray(data.lista) && data.lista.length > 0) {
      const item = data.lista[0];
      const textElem = document.querySelector('[data-i18n="testimonial_text"]');
      if (textElem && item.texto) {
        textElem.textContent = `"${item.texto.replace(/^"|"$/g, '')}"`;
      }

      const citeElem = document.querySelector('[data-i18n="testimonial_cite"]');
      if (citeElem && item.nombre) {
        citeElem.textContent = `— ${item.nombre}`;
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadHero();
    loadContacto();
    loadUbicaciones();
    loadTestimonios();
  });
})();
