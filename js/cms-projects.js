(function () {
  'use strict';

  const GITHUB_API =
    'https://api.github.com/repos/riano200612-jpg/mariauxi/contents/contenido/proyectos?ref=main';

  const RAW_BASE =
    'https://raw.githubusercontent.com/riano200612-jpg/mariauxi/main/';

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
      return {
        swatch: 's-oporto',
        tagColor: 'var(--rose-lt)',
        cardClass: 'oporto'
      };
    }

    if (slug.includes('reserva')) {
      return {
        swatch: 's-reserva',
        tagColor: '#5A9A62',
        cardClass: 'reserva'
      };
    }

    if (slug.includes('itaca')) {
      return {
        swatch: 's-itaca',
        tagColor: 'var(--text)',
        cardClass: ''
      };
    }

    if (slug.includes('marduk')) {
      return {
        swatch: 's-marduk',
        tagColor: 'var(--text)',
        cardClass: ''
      };
    }

    return {
      swatch: 's-oporto',
      tagColor: 'var(--text)',
      cardClass: ''
    };
  }

  function renderProjectCard(project, index) {
    const theme = projectTheme(project);
    const extraClass = index === 1 ? ' d1' : index === 2 ? ' d2' : '';

    const title = String(project.title || 'Proyecto');
    const words = title.split(' ');

    const mainTitle = escapeHTML(words.shift() || title);
    const restTitle = words.length
      ? ' <em>' + escapeHTML(words.join(' ')) + '</em>'
      : '';

    const sector = escapeHTML(
      project.sector || project.ciudad || 'Cartagena'
    );

    const description = escapeHTML(
      project.body || 'Proyecto residencial exclusivo en Cartagena.'
    );

    const pdf = project.pdf
      ? escapeHTML(project.pdf)
      : '';

    const brochure = pdf
      ? (function () {
        const projectData = JSON.stringify({
          title: project.title,
          cover: project.cover,
          body: project.body,
          sector: project.sector,
          ciudad: project.ciudad,
          estado: project.estado,
          direccion: project.direccion,
          precio: project.precio,
          area: project.area,
          habitaciones: project.habitaciones,
          banos: project.banos,
          parqueaderos: project.parqueaderos,
          pdf: project.pdf,
          mapa: project.mapa
        }).replace(/'/g, "\\'");
        return `
          <button
            type="button"
            class="c-arr"
            style="background:transparent;cursor:pointer;"
            aria-label="Ver brochure ${escapeHTML(title)}"
            data-track="download_pdf"
            data-project="${escapeHTML(slugify(title))}"
            data-modal-project='${projectData}'
            onclick="CMSProjectModal.open(JSON.parse(this.dataset.modalProject))"
          >
            <svg width="14" height="14" viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
        `;
      })()
      : '';

    const cover = project.cover ? escapeHTML(project.cover) : '';

    const price = project.precio
      ? escapeHTML(project.precio)
      : 'Brochure';

    const location = escapeHTML(
      project.sector || project.ciudad || 'Cartagena'
    );

    const isDark = theme.cardClass === 'oporto';

    return `
      <div class="card reveal ${escapeHTML(theme.cardClass)}${extraClass}${cover ? ' has-photo' : ''}">
        <div
          class="swatch ${escapeHTML(theme.swatch)}"
          ${cover ? `style="background-image:url('${cover}');background-size:cover;background-position:center;"` : ''}
        >
          ${cover ? '' : '<div class="orb"></div>'}
        </div>



        <div
          class="card-in"
          style="${isDark ? 'color:rgba(255,255,255,0.85);' : ''}"
        >
          <span
            class="c-tag"
            style="color:${escapeHTML(theme.tagColor)};"
          >
            ${sector}
          </span>

          <h3
            class="c-name"
            style="${isDark ? 'color:#fff;' : ''}"
          >
            ${mainTitle}${restTitle}
          </h3>

          <p
            class="c-desc"
            style="${isDark ? 'color:rgba(255,255,255,0.75);' : ''}"
          >
            ${description}
          </p>

          <div class="c-foot">
            <span
              class="c-price"
              style="color:${escapeHTML(theme.tagColor)};"
            >
              ${price}
            </span>

            <span
              class="c-loc"
              style="${isDark ? 'color:#fff;' : 'color:var(--text-lt);'}"
            >
              ${location}
            </span>

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
        headers: {
          Accept: 'application/vnd.github+json'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(
          'GitHub respondió con HTTP ' + response.status
        );
      }

      const files = await response.json();

      const markdownFiles = files.filter(function (file) {
        return (
          file.type === 'file' &&
          file.name.toLowerCase().endsWith('.md')
        );
      });

      console.log(
        '[CMS] Archivos Markdown encontrados:',
        markdownFiles.length
      );

      const projects = await Promise.all(
        markdownFiles.map(async function (file) {
          const rawResponse = await fetch(
            RAW_BASE + file.path,
            {
              cache: 'no-store'
            }
          );

          if (!rawResponse.ok) {
            throw new Error(
              'No se pudo leer ' + file.name
            );
          }

          const text = await rawResponse.text();
          const parsed = parseFrontMatter(text);

          if (!parsed) {
            console.warn(
              '[CMS] Front Matter inválido:',
              file.name
            );

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
      console.warn(
        '[CMS] No se pudieron cargar los proyectos:',
        error
      );

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

    /*
     * Seguridad:
     * si GitHub/CMS falla, dejamos intactas
     * las tarjetas actuales.
     */
    if (!projects.length) {
      console.warn(
        '[CMS] No hay proyectos CMS. Se mantienen las tarjetas existentes.'
      );
      return;
    }

    console.log(
      '[CMS] Renderizando',
      projects.length,
      'proyectos.'
    );

    grid.innerHTML = projects
      .map(renderProjectCard)
      .join('');

    /*
     * Volvemos a activar los efectos visuales
     * de las tarjetas creadas dinámicamente.
     */
    grid.querySelectorAll('.reveal').forEach(function (element) {
      element.classList.add('vis');
    });

    grid.querySelectorAll('.orb').forEach(function (orb) {
      if (window.IntersectionObserver) {
        const observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              entry.target.classList.toggle(
                'paused',
                !entry.isIntersecting
              );
            });
          },
          { threshold: 0.1 }
        );

        observer.observe(orb);
      }
    });

    /*
     * Analytics para botones creados por el CMS.
     */
    grid.querySelectorAll('[data-track]').forEach(function (el) {
      el.addEventListener('click', function () {
        if (typeof window.trackEvent === 'function') {
          window.trackEvent(
            this.getAttribute('data-track'),
            {
              project:
                this.getAttribute('data-project') || '',
              element_text:
                this.textContent.trim().substring(0, 50)
            }
          );
        }
      });
    });
  }

  window.cmsProjects = {
    load: loadCmsProjects,
    render: renderCmsProjects,
    parseFrontMatter: parseFrontMatter
  };

  console.log('[CMS] Adaptador cargado correctamente.');

  /*
   * Esperamos a que el HTML esté disponible.
   */
  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      renderCmsProjects
    );
  } else {
    renderCmsProjects();
  }

})();
