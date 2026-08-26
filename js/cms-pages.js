/**
 * CMS Pages & Config Universal Loader
 */

document.addEventListener('DOMContentLoaded', () => {
  loadCMSConfig();
  loadCMSPages();
});

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
    if (!res.ok) {
      console.warn(`No se pudo cargar CMS file [${path}]: HTTP ${res.status}`);
      return null;
    }
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
    if (sitio.seo.keywords) {
      const metaKeys = document.querySelector('meta[name="keywords"]');
      if (metaKeys) metaKeys.setAttribute('content', sitio.seo.keywords);
    }
  }

  if (sitio.redes) {
    if (sitio.redes.instagram) {
      document.querySelectorAll('a[href*="instagram.com"]').forEach(a => a.href = sitio.redes.instagram);
    }
    if (sitio.redes.facebook) {
      document.querySelectorAll('a[href*="facebook.com"]').forEach(a => a.href = sitio.redes.facebook);
    }
    if (sitio.redes.youtube) {
      document.querySelectorAll('a[href*="youtube.com"]').forEach(a => a.href = sitio.redes.youtube);
    }
  }
}

async function loadCMSPages() {
  const contacto = await fetchCMSFile('contenido/pagina/contacto.md');
  if (contacto && contacto.whatsapp) {
    const waNum = contacto.whatsapp.replace(/\D/g, '');
    const msg = encodeURIComponent(contacto.whatsapp_mensaje || 'Hola, me gustaría recibir información.');
    const waUrl = `https://wa.me/${waNum}?text=${msg}`;
    
    document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
      a.href = waUrl;
    });
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
  }
}
