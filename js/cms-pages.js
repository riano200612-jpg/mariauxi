/**
 * CMS Pages & Config Universal Loader (con soporte universal para videos)
 */

document.addEventListener('DOMContentLoaded', () => {
  loadCMSConfig();
  loadCMSPages();
  loadCMSHero();
});

// Helper universal para actualizar cualquier reproductor <video>
function updateVideoElement(videoEl, videoPath, posterPath) {
  if (!videoEl || !videoPath) return;

  if (posterPath) {
    videoEl.poster = posterPath;
  }

  // Si el video actual ya es el mismo, no recargar
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
  
  const yamlBlock = matches[1];
  const lines = yamlBlock.split('\n');
  let currentParent = null;

  lines.forEach(line => {
    if (!line.trim() || line.trim().startsWith('#')) return;
    
    if (line.startsWith('  ') && currentParent) {
      const parts = line.trim().split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
        meta[currentParent][key] = val;
      }
    } else {
      const parts = line.trim().split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
        if (val === '') {
          currentParent = key;
          meta[key] = {};
        } else {
          currentParent = null;
          meta[key] = val;
        }
      }
    }
  });
  return meta;
}

async function fetchCMSFile(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const text = await res.text();
    return parseFrontmatter(text);
  } catch (err) {
    console.error(`Error de red cargando CMS file [${path}]:`, err);
    return null;
  }
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

  if (sitio.redes) {
    if (sitio.redes.instagram) document.querySelectorAll('a[href*="instagram.com"]').forEach(a => a.href = sitio.redes.instagram);
    if (sitio.redes.facebook) document.querySelectorAll('a[href*="facebook.com"]').forEach(a => a.href = sitio.redes.facebook);
    if (sitio.redes.youtube) document.querySelectorAll('a[href*="youtube.com"]').forEach(a => a.href = sitio.redes.youtube);
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

    const elProj = document.querySelector('[data-i18n="stat_projects"]');
    if (elProj && historia.stat_proyectos) elProj.textContent = historia.stat_proyectos;

    const elUnits = document.querySelector('[data-i18n="stat_units"]');
    if (elUnits && historia.stat_unidades) elUnits.textContent = historia.stat_unidades;

    const p1 = document.querySelector('[data-i18n="manifesto_p1"]');
    if (p1 && historia.manifesto_p1) p1.textContent = historia.manifesto_p1;

    const p2 = document.querySelector('[data-i18n="manifesto_p2"]');
    if (p2 && historia.manifesto_p2) p2.textContent = historia.manifesto_p2;

    const p3 = document.querySelector('[data-i18n="manifesto_p3"]');
    if (p3 && historia.manifesto_p3) p3.textContent = historia.manifesto_p3;

    // Si la sección Historia incluye un video
    if (historia.video) {
      const historiaVideoEl = document.querySelector('.video-background video') || document.querySelectorAll('.video-phone video')[1];
      updateVideoElement(historiaVideoEl, historia.video, historia.poster);
    }
  }
}

async function loadCMSHero() {
  const heroData = await fetchCMSFile('contenido/pagina/hero.md');
  if (heroData) {
    if (heroData.subtitulo) {
      const elSub = document.querySelector('[data-i18n="hero_subtitle"]');
      if (elSub) elSub.innerHTML = heroData.subtitulo;
    }
    if (heroData.boton_texto) {
      const elBtn = document.querySelector('[data-i18n="hero_cta"]');
      if (elBtn) elBtn.textContent = heroData.boton_texto;
    }
    if (heroData.boton_link) {
      const elBtnLink = document.querySelector('[data-i18n="hero_cta"]');
      if (elBtnLink) elBtnLink.setAttribute('href', heroData.boton_link);
    }
    
    // Cargar video del Hero
    if (heroData.video) {
      const heroVideoEl = document.querySelector('#hero-video-bg video');
      updateVideoElement(heroVideoEl, heroData.video, heroData.poster);
    }
  }
}
