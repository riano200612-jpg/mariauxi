(function () {
  'use strict';

  /* ── Inyección automática del contenedor del modal ── */
  function injectModalContainer() {
    // 1. Inyectar estilos CSS si no existen
    if (!document.getElementById('cms-modal-styles')) {
      const styles = document.createElement('style');
      styles.id = 'cms-modal-styles';
      styles.textContent = `
        .cms-modal-overlay{position:fixed;inset:0;background:rgba(8,35,60,.85);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:99999;opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease;display:flex;align-items:center;justify-content:center;padding:1.5rem}
        .cms-modal-overlay.active{opacity:1;visibility:visible}
        .cms-modal-box{background:var(--cream,#faf8f5);border:1px solid var(--border,#e5e5e5);border-radius:12px;max-width:500px;width:100%;padding:2rem;position:relative;transform:translateY(20px) scale(.95);transition:transform .3s cubic-bezier(.34,1.56,.64,1);box-shadow:0 20px 40px rgba(0,0,0,.2);max-height:90vh;overflow-y:auto}
        .cms-modal-overlay.active .cms-modal-box{transform:translateY(0) scale(1)}
        .cms-modal-close{position:absolute;top:1rem;right:1rem;background:transparent;border:1px solid var(--border,#e5e5e5);border-radius:50%;width:32px;height:32px;font-size:1.2rem;line-height:1;cursor:pointer;color:var(--text-lt,#666);transition:all .2s ease;display:flex;align-items:center;justify-content:center}
        .cms-modal-close:hover{background:var(--rose,#d7be82);color:#fff;border-color:var(--rose,#d7be82)}
        .cms-modal-title{font-family:var(--f-serif,Georgia,serif);color:#d7be82;font-size:1.5rem;font-weight:300;margin-bottom:.5rem}
        .cms-modal-subtitle{color:var(--text-lt,#666);font-size:.9rem;margin-bottom:1.5rem}
        .cms-modal-body{line-height:1.7;color:var(--text,#333);font-size:.95rem}
        .cms-modal-body p{margin-bottom:1rem}
        .cms-modal-footer{margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--border,#e5e5e5);display:flex;gap:1rem;justify-content:flex-end;flex-wrap:wrap}
        .cms-modal-btn{padding:.6rem 1.2rem;font-size:.8rem;letter-spacing:.15em;text-transform:uppercase;text-decoration:none;border-radius:6px;cursor:pointer;transition:all .3s ease;font-family:var(--f-sans,sans-serif);border:1px solid}
        .cms-modal-btn-primary{background:var(--rose,#d7be82);color:#fff;border-color:var(--rose,#d7be82)}
        .cms-modal-btn-primary:hover{background:var(--rose-lt,#e8c99a);transform:translateY(-2px);box-shadow:0 8px 20px rgba(16,63,110,.15)}
        .cms-modal-btn-secondary{background:transparent;color:var(--text,#333);border-color:var(--border,#e5e5e5)}
        .cms-modal-btn-secondary:hover{border-color:var(--rose,#d7be82);color:var(--rose,#d7be82)}
      `;
      document.head.appendChild(styles);
    }

    // 2. Inyectar el contenedor del modal si no existe
    if (!document.getElementById('cms-modal')) {
      const modal = document.createElement('div');
      modal.id = 'cms-modal';
      modal.className = 'cms-modal-overlay';
      modal.onclick = function(e) {
        if (e.target === modal) window.cmsProjects.closeModal();
      };
      modal.innerHTML = `
        <div class="cms-modal-box">
          <button class="cms-modal-close" onclick="window.cmsProjects.closeModal()" aria-label="Cerrar modal">&times;</button>
          <div id="cms-cms-modal-content">
            <p>Cargando información...</p>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      console.log('[CMS] Contenedor del modal inyectado automáticamente.');
    }
  }

  // Ejecutar la inyección inmediatamente
  injectModalContainer();

  const GITHUB_API =
    'https://api.github.com/repos/riano200612-jpg/mariauxi/contents/contenido/proyectos?ref=main';

  const RAW_BASE =
    'https://raw.githubusercontent.com/riano200612-jpg/mariauxi/main/';

  /* ── Fallback: datos de los proyectos estáticos ── */
  const FALLBACK_PROJECTS = [
    {
      slug: 'oporto',
      title: 'Oporto Apartamentos',
      ciudad: 'Cartagena',
      sector: 'La Providencia',
      precio: 'Brochure',
      body: 'Diseñado para familias que buscan crecimiento patrimonial con conectividad inmediata al Portal de Transcaribe.',
      pdf: 'docum/oporto-book-digital.pdf',
      cover: '',
      estado: 'Nuevo · 2026'
    },
    {
      slug: 'reserva-90',
      title: 'Reserva 90 NEO',
      ciudad: 'Cartagena',
      sector: 'Zona Norte',
      precio: 'Brochure',
      body: 'Refugio natural ideal para inversionistas que valoran la tranquilidad, espacios verdes y valorización sostenida en Cartagena.',
      pdf: 'docum/reserva-90-NEO-book-digital.pdf',
      cover: '',
      estado: ''
    },
    {
      slug: 'itaca',
      title: 'Ítaca Tower',
      ciudad: 'Cartagena',
      sector: 'Manga',
      precio: 'Brochure',
      body: 'Interiores contemporáneos y piscina panorámica. Para quienes buscan estilo, funcionalidad y ubicación premium en Cartagena.',
      pdf: 'docum/itaca-tower-book-digital-2024.pdf',
      cover: '',
      estado: ''
    },
    {
      slug: 'marduk',
      title: 'Marduk Tower',
      ciudad: 'Cartagena',
      sector: 'Serena del Mar',
      precio: 'Brochure',
      body: 'Apartamentos modernos con diseño versátil y helipuerto privado. Para inversionistas y residentes que buscan diferenciarse.',
      pdf: 'docum/marduk-book-digital-2026.pdf',
      cover: '',
      estado: ''
    }
  ];

  function parseValue(value) {
    value = value.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      return value.slice(1, -1);
    }
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      return Number(value);
    }
    if (value === '[]') return [];
    return value;
  }

  function parseFrontMatter(text) {
    const match = text.match(/^---\s*([\s\S]*?)\s*---/);
    if (!match) return null;
    const frontMatter = match[1];
    const data = {};
    frontMatter.split('\n').forEach(function (line) {
      const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (!match) return;
      data[match[1]] = parseValue(match[2]);
    });
    return {
      data: data,
      body: text
        .replace(/^---\s*[\s\S]*?\s*---\s*/, '')
        .trim()
    };
  }

  function escapeHTML(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function slugify(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function projectClass(project) {
    const slug = slugify(project.title);
    if (slug.includes('oporto')) return 'oporto';
    if (slug.includes('reserva')) return 'reserva';
    if (slug.includes('itaca')) return 'itaca';
    if (slug.includes('marduk')) return 'marduk';
    return '';
  }

  function projectTheme(project) {
    const slug = slugify(project.title);
    if (slug.includes('oporto')) {
      return { swatch: 's-oporto', tagColor: 'var(--rose-lt)', cardClass: 'oporto' };
    }
    if (slug.includes('reserva')) {
      return { swatch: 's-reserva', tagColor: '#5A9A62', cardClass: 'reserva' };
    }
    if (slug.includes('itaca')) {
      return { swatch: 's-itaca', tagColor: 'var(--text)', cardClass: '' };
    }
    if (slug.includes('marduk')) {
      return { swatch: 's-marduk', tagColor: 'var(--text)', cardClass: '' };
    }
    return { swatch: 's-oporto', tagColor: 'var(--text)', cardClass: '' };
  }

  function injectModalStyles() {
    if (document.getElementById('cms-modal-styles')) return;
    const style = document.createElement('style');
    style.id = 'cms-modal-styles';
    style.textContent = `
      .cms-modal-overlay{position:fixed;inset:0;background:rgba(8,35,60,.65);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:10000;opacity:0;visibility:hidden;transition:all .35s ease;display:flex;align-items:center;justify-content:center;padding:1.5rem}
      .cms-modal-overlay.active{opacity:1;visibility:visible}
      .cms-modal-box{background:var(--cream);border:1px solid var(--border);border-radius:var(--radius-md);max-width:540px;width:100%;max-height:90vh;overflow-y:auto;padding:clamp(2rem,4vw,2.8rem);position:relative;transform:translateY(20px) scale(.97);transition:all .4s cubic-bezier(.23,1,.32,1);box-shadow:0 20px 50px rgba(16,63,110,.12)}
      .cms-modal-overlay.active .cms-modal-box{transform:translateY(0) scale(1)}
      .cms-modal-close{position:absolute;top:1rem;right:1rem;width:32px;height:32px;background:0 0;border:1px solid var(--border);border-radius:var(--radius-full);color:var(--text-lt);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;line-height:1;transition:all .3s ease}
      .cms-modal-close:hover{background:var(--rose);color:var(--white);border-color:var(--rose)}
      .cms-modal-cover{width:100%;height:200px;object-fit:cover;border-radius:var(--radius-sm);margin-bottom:1.4rem;display:block}
      .cms-modal-title{font-family:var(--f-serif);font-size:clamp(1.3rem,2vw,1.7rem);font-weight:300;color:var(--text);margin-bottom:.3rem;letter-spacing:-.01em;line-height:1.2}
      .cms-modal-title em{font-style:italic;color:var(--rose-lt)}
      .cms-modal-meta{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1.2rem;align-items:center}
      .cms-modal-tag{font-size:var(--size-xs);letter-spacing:.25em;text-transform:uppercase;color:var(--rose)}
      .cms-modal-desc{font-size:var(--size-sm);line-height:1.8;color:var(--text-lt);margin-bottom:1.4rem}
      .cms-modal-detail{display:flex;flex-direction:column;gap:0;margin-bottom:1.5rem}
      .cms-modal-row{display:flex;justify-content:space-between;padding:.55rem 0;border-bottom:1px solid var(--border);font-size:var(--size-sm);gap:1rem}
      .cms-modal-row span:first-child{color:var(--text-lt);text-transform:uppercase;letter-spacing:.15em;font-size:var(--size-xs);flex-shrink:0}
      .cms-modal-row span:last-child{color:var(--text);font-weight:500;text-align:right}
      .cms-modal-actions{display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.5rem}
      .cms-modal-actions .btn-p,.cms-modal-actions .btn-outline{flex:1;min-width:140px;justify-content:center}
      @media(max-width:480px){.cms-modal-actions{flex-direction:column}.cms-modal-actions .btn-p,.cms-modal-actions .btn-outline{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function openProjectModal(slug) {
    const project = window.cmsProjects.projects.find(function (p) {
      return p.slug === slug || slugify(p.title) === slug;
    });
    if (!project) {
      console.warn('[CMS] Proyecto no encontrado:', slug);
      return;
    }
    injectModalStyles();
    let existing = document.getElementById('cms-modal');
    if (existing) existing.remove();

    const title = String(project.title || 'Proyecto');
    const words = title.split(' ');
    const mainTitle = escapeHTML(words.shift() || title);
    const restTitle = words.length ? ' <em>' + escapeHTML(words.join(' ')) + '</em>' : '';
    const theme = projectTheme(project);
    const isDark = theme.cardClass === 'oporto';

    const modal = document.createElement('div');
    modal.id = 'cms-modal';
    modal.className = 'cms-modal-overlay';
    modal.innerHTML =
      '<div class="cms-modal-box" role="dialog" aria-modal="true" aria-label="Información de ' + escapeHTML(title) + '">' +
        '<button class="cms-modal-close" aria-label="Cerrar" onclick="window.cmsProjects.closeModal()">&#10005;</button>' +
        (project.cover ? '<img src="' + escapeHTML(project.cover) + '" alt="' + escapeHTML(title) + '" class="cms-modal-cover" style="object-position:center 30%;">' : '') +
        '<div class="cms-modal-meta">' +
          '<span class="cms-modal-tag">' + escapeHTML(project.sector || project.ciudad || 'Cartagena') + '</span>' +
          (project.estado ? '<span class="cms-modal-tag" style="color:' + (isDark ? 'var(--rose-lt)' : 'var(--rose-dk)') + '">' + escapeHTML(project.estado) + '</span>' : '') +
        '</div>' +
        '<h3 class="cms-modal-title">' + mainTitle + restTitle + '</h3>' +
        '<p class="cms-modal-desc">' + escapeHTML(project.body || 'Proyecto residencial exclusivo en Cartagena.') + '</p>' +
        '<div class="cms-modal-detail">' +
          (project.ciudad ? '<div class="cms-modal-row"><span>Ciudad</span><span>' + escapeHTML(project.ciudad) + '</span></div>' : '') +
          (project.sector ? '<div class="cms-modal-row"><span>Sector / Zona</span><span>' + escapeHTML(project.sector) + '</span></div>' : '') +
          (project.precio ? '<div class="cms-modal-row"><span>Precio desde</span><span>' + escapeHTML(project.precio) + '</span></div>' : '') +
          (project.unidades ? '<div class="cms-modal-row"><span>Unidades</span><span>' + escapeHTML(String(project.unidades)) + '</span></div>' : '') +
          (project.entrega ? '<div class="cms-modal-row"><span>Entrega estimada</span><span>' + escapeHTML(project.entrega) + '</span></div>' : '') +
          (project.constructor && typeof project.constructor === 'string' ? '<div class="cms-modal-row"><span>Constructor</span><span>' + escapeHTML(project.constructor) + '</span></div>' : '') +
          (project.area ? '<div class="cms-modal-row"><span>Área construida</span><span>' + escapeHTML(project.area) + '</span></div>' : '') +
          (project.tipologia ? '<div class="cms-modal-row"><span>Tipologías</span><span>' + escapeHTML(project.tipologia) + '</span></div>' : '') +
        '</div>' +
        '<div class="cms-modal-actions">' +
          (project.pdf ?
            '<a href="' + escapeHTML(project.pdf) + '" target="_blank" rel="noopener noreferrer" download class="btn-p" data-track="download_pdf" data-project="' + escapeHTML(slugify(title)) + '">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px">' +
                '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>' +
              '</svg>Descargar Brochure' +
            '</a>' : '') +
          '<a href="https://wa.me/?text=Hola, vi el proyecto ' + encodeURIComponent(title) + ' en la web y quiero más información." target="_blank" rel="noopener noreferrer" class="btn-outline-dark">Consultar por WhatsApp</a>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    requestAnimationFrame(function () { modal.classList.add('active'); });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) window.cmsProjects.closeModal();
    });
    function onKey(e) {
      if (e.key === 'Escape') {
        window.cmsProjects.closeModal();
        document.removeEventListener('keydown', onKey);
      }
    }
    document.addEventListener('keydown', onKey);

    if (typeof window.trackEvent === 'function') {
      window.trackEvent('open_project_modal', { project: slugify(title) });
    }
  }

  function closeModal() {
    const modal = document.getElementById('cms-modal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(function () { modal.remove(); }, 400);
  }

  function renderProjectCard(project, index) {
    const theme = projectTheme(project);
    const extraClass = index === 1 ? ' d1' : index === 2 ? ' d2' : '';
    const title = String(project.title || 'Proyecto');
    const words = title.split(' ');
    const mainTitle = escapeHTML(words.shift() || title);
    const restTitle = words.length ? ' <em>' + escapeHTML(words.join(' ')) + '</em>' : '';
    const sector = escapeHTML(project.sector || project.ciudad || 'Cartagena');
    const description = escapeHTML(project.body || 'Proyecto residencial exclusivo en Cartagena.');
    const slug = escapeHTML(project.slug || slugify(title));

    /* BOTÓN SIEMPRE VISIBLE - no depende de PDF */
    const brochure = '<button type="button" class="c-arr" style="text-decoration:none;background:transparent;cursor:pointer;" aria-label="Ver información de ' + escapeHTML(title) + '" data-track="open_project_modal" data-project="' + escapeHTML(slugify(title)) + '" onclick="window.cmsProjects.openModal(\'' + slug + '\')">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>' +
        '</svg>' +
      '</button>';

    const cover = project.cover ? escapeHTML(project.cover) : '';
    const price = project.precio ? escapeHTML(project.precio) : 'Brochure';
    const location = escapeHTML(project.sector || project.ciudad || 'Cartagena');
    const isDark = theme.cardClass === 'oporto';

    return `
      <div class="card reveal ${escapeHTML(theme.cardClass)}${extraClass}${cover ? ' has-photo' : ''}">
        <div
          class="swatch ${escapeHTML(theme.swatch)}"
          ${cover ? `style="background-image:url('${cover}');background-size:cover;background-position:center 30%;"` : ''}
        >
          ${cover ? '' : '<div class="orb"></div>'}
        </div>
        <div
          class="card-in"
          style="${isDark ? 'color:rgba(255,255,255,0.85);' : ''}"
        >
          <span class="c-tag" style="color:${escapeHTML(theme.tagColor)};">${sector}</span>
          <h3 class="c-name" style="${isDark ? 'color:#fff;' : ''}">${mainTitle}${restTitle}</h3>
          <p class="c-desc" style="${isDark ? 'color:rgba(255,255,255,0.75);' : ''}">${description}</p>
          <div class="c-foot">
            <span class="c-price" style="color:${escapeHTML(theme.tagColor)};">${price}</span>
            <span class="c-loc" style="${isDark ? 'color:#fff;' : 'color:var(--text-lt);'}">${location}</span>
            ${brochure}
          </div>
        </div>
      </div>
    `;
  }

  async function loadCmsProjects() {
    try {
      console.log('[CMS] Buscando proyectos en GitHub...');
      const response = await fetch(GITHUB_API, {
        headers: { Accept: 'application/vnd.github+json' },
        cache: 'no-store'
      });
      if (!response.ok) {
        throw new Error('GitHub respondió con HTTP ' + response.status);
      }
      const files = await response.json();
      const markdownFiles = files.filter(function (file) {
        return file.type === 'file' && file.name.toLowerCase().endsWith('.md');
      });
      console.log('[CMS] Archivos Markdown encontrados:', markdownFiles.length);
      const projects = await Promise.all(
        markdownFiles.map(async function (file) {
          const rawResponse = await fetch(RAW_BASE + file.path, { cache: 'no-store' });
          if (!rawResponse.ok) {
            throw new Error('No se pudo leer ' + file.name);
          }
          const text = await rawResponse.text();
          const parsed = parseFrontMatter(text);
          if (!parsed) {
            console.warn('[CMS] Front Matter inválido:', file.name);
            return null;
          }
          return {
            ...parsed.data,
            body: parsed.body,
            slug: file.name.replace(/\.md$/i, ''),
            source: file.path
          };
        })
      );
      return projects.filter(Boolean);
    } catch (error) {
      console.warn('[CMS] No se pudieron cargar los proyectos:', error);
      return [];
    }
  }

  async function renderCmsProjects() {
    const section = document.getElementById('proyectos');
    if (!section) {
      console.warn('[CMS] No existe #proyectos.');
      return;
    }
    const grid = section.querySelector('.grid');
    if (!grid) {
      console.warn('[CMS] No existe .grid dentro de #proyectos.');
      return;
    }
    const projects = await loadCmsProjects();

    /* Si GitHub falla o no hay archivos, usamos fallback */
    if (!projects.length) {
      console.log('[CMS] Usando proyectos fallback.');
      window.cmsProjects.projects = FALLBACK_PROJECTS;
      return; /* Dejamos las tarjetas estáticas intactas */
    }

    console.log('[CMS] Renderizando', projects.length, 'proyectos.');
    window.cmsProjects.projects = projects;
    grid.innerHTML = projects.map(renderProjectCard).join('');

    grid.querySelectorAll('.reveal').forEach(function (element) {
      element.classList.add('vis');
    });
    grid.querySelectorAll('.orb').forEach(function (orb) {
      if (window.IntersectionObserver) {
        const observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              entry.target.classList.toggle('paused', !entry.isIntersecting);
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(orb);
      }
    });
    grid.querySelectorAll('[data-track]').forEach(function (el) {
      el.addEventListener('click', function () {
        if (typeof window.trackEvent === 'function') {
          window.trackEvent(
            this.getAttribute('data-track'),
            {
              project: this.getAttribute('data-project') || '',
              element_text: this.textContent.trim().substring(0, 50)
            }
          );
        }
      });
    });
  }

  window.cmsProjects = {
    load: loadCmsProjects,
    render: renderCmsProjects,
    parseFrontMatter: parseFrontMatter,
    openModal: openProjectModal,
    closeModal: closeModal,
    projects: FALLBACK_PROJECTS
  };

  console.log('[CMS] Adaptador cargado correctamente.');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCmsProjects);
  } else {
    renderCmsProjects();
  }

})();
