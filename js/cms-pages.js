document.addEventListener('DOMContentLoaded', () => {
  loadCMSConfig();
  loadCMSPages();
  loadCMSHero();
});

function updateVideoElement(videoEl, videoPath) {
  if (!videoEl || !videoPath) return;
  const currentSource = videoEl.querySelector('source')?.getAttribute('src');
  if (currentSource === videoPath) return;
  videoEl.innerHTML = '';
  const source = document.createElement('source');
  source.src = videoPath;
  source.type = videoPath.endsWith('.mp4') ? 'video/mp4' : 'video/webm';
  videoEl.appendChild(source);
  videoEl.load();
  if (typeof safePlay === 'function') {
    safePlay(videoEl);
  } else {
    const p = videoEl.play();
    if (p !== undefined) p.catch(() => {});
  }
}

function parseFrontmatter(text) {
  const meta = {};
  const matches = text.match(/^---([\s\S]*?)---/);
  if (!matches) return meta;
  const lines = matches[1].split('\n');
  let currentParent = null;
  lines.forEach(line => {
    if (!line.trim() || line.trim().startsWith('#')) return;
    const parts = line.trim().split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
      if (line.startsWith('  ') && currentParent) {
        meta[currentParent][key] = val;
      } else {
        if (val === '') { currentParent = key; meta[key] = {}; }
        else { currentParent = null; meta[key] = val; }
      }
    }
  });
  return meta;
}

async function fetchCMSFile(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return parseFrontmatter(await res.text());
  } catch (err) { return null; }
}

async function loadCMSConfig() {
  const sitio = await fetchCMSFile('contenido/configuracion/sitio.md');
  if (!sitio) return;
  if (sitio.seo) {
    if (sitio.seo.title) document.title = sitio.seo.title;
    if (sitio.seo.description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', sitio.seo.description);
    }
  }
}

async function loadCMSPages() {
  const contacto = await fetchCMSFile('contenido/pagina/contacto.md');
  if (contacto && contacto.whatsapp) {
    const waNum = contacto.whatsapp.replace(/\D/g, '');
    const msg = encodeURIComponent(contacto.whatsapp_mensaje || 'Hola, me gustaría recibir información.');
    document.querySelectorAll('a[href*="wa.me"]').forEach(a => a.href = `https://wa.me/${waNum}?text=${msg}`);
  }

  const historia = await fetchCMSFile('contenido/pagina/historia.md');
  if (historia) {
    const elExp = document.querySelector('[data-i18n="stat_experience"]');
    if (elExp && historia.exp_anios) elExp.textContent = historia.exp_anios;
    if (historia.video) {
      const historiaVideoEl = document.querySelectorAll('.video-phone video')[1]; // El segundo video vertical es María Auxi
      updateVideoElement(historiaVideoEl, historia.video);
    }
  }

  const inversion = await fetchCMSFile('contenido/pagina/inversion.md');
  if (inversion && inversion.video) {
    const inversionVideoEl = document.querySelector('#inversion-cartagena video');
    updateVideoElement(inversionVideoEl, inversion.video);
  }

  const destacado = await fetchCMSFile('contenido/pagina/destacado.md');
  if (destacado && destacado.video) {
    const destacadoVideoEl = document.querySelectorAll('.video-phone video')[0]; // El primer video vertical es Oporto
    updateVideoElement(destacadoVideoEl, destacado.video);
  }
}

async function loadCMSHero() {
  const heroData = await fetchCMSFile('contenido/pagina/hero.md');
  if (heroData) {
    const elSub = document.querySelector('[data-i18n="hero_subtitle"]');
    if (elSub && heroData.subtitulo) elSub.innerHTML = heroData.subtitulo;
    if (heroData.video) {
      const heroVideoEl = document.querySelector('#hero-video-bg video');
      updateVideoElement(heroVideoEl, heroData.video);
    }
  }
}
