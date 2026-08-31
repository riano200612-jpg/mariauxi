(function (window, document) {
  'use strict';

  let modal = null;

  function escapeHTML(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function createModal() {
    if (document.getElementById('cms-project-modal')) {
      modal = document.getElementById('cms-project-modal');
      return modal;
    }

    const wrapper = document.createElement('div');

    wrapper.id = 'cms-project-modal';
    wrapper.className = 'cms-project-modal';
    wrapper.setAttribute('aria-hidden', 'true');

    wrapper.innerHTML = `
      <div class="cms-project-modal__backdrop"></div>

      <div
        class="cms-project-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cms-project-modal-title"
      >

        <button
          type="button"
          class="cms-project-modal__close"
          aria-label="Cerrar"
        >
          &times;
        </button>

        <div class="cms-project-modal__media">
          <img
            class="cms-project-modal__image"
            src=""
            alt=""
          >
        </div>

        <div class="cms-project-modal__content">

          <span class="cms-project-modal__sector"></span>

          <h2
            id="cms-project-modal-title"
            class="cms-project-modal__title"
          ></h2>

          <div class="cms-project-modal__status"></div>

          <p class="cms-project-modal__description"></p>

          <div class="cms-project-modal__details"></div>

          <div class="cms-project-modal__actions"></div>

        </div>

      </div>
    `;

    document.body.appendChild(wrapper);

    modal = wrapper;

    modal
      .querySelector('.cms-project-modal__close')
      .addEventListener('click', close);

    modal
      .querySelector('.cms-project-modal__backdrop')
      .addEventListener('click', close);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        close();
      }
    });

    return modal;
  }

  function formatDetail(label, value) {
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      value === 0
    ) {
      return '';
    }

    return `
      <div class="cms-project-modal__detail">
        <span>${escapeHTML(label)}</span>
        <strong>${escapeHTML(value)}</strong>
      </div>
    `;
  }

  function open(project) {
    createModal();

    const title = String(project.title || 'Proyecto');
    const image = String(project.cover || '');
    const description = String(
      project.body ||
      'Proyecto residencial exclusivo en Cartagena.'
    );

    modal.querySelector('.cms-project-modal__image').src = image;
    modal.querySelector('.cms-project-modal__image').alt = title;

    modal.querySelector('.cms-project-modal__sector').textContent =
      project.sector || project.ciudad || 'Cartagena';

    modal.querySelector('.cms-project-modal__title').textContent =
      title;

    modal.querySelector('.cms-project-modal__description').textContent =
      description;

    modal.querySelector('.cms-project-modal__status').innerHTML =
      project.estado
        ? `<span>${escapeHTML(project.estado)}</span>`
        : '';

    modal.querySelector('.cms-project-modal__details').innerHTML = `
      ${formatDetail('Ciudad', project.ciudad)}
      ${formatDetail('Sector', project.sector)}
      ${formatDetail('Dirección', project.direccion)}
      ${formatDetail('Precio desde', project.precio)}
      ${formatDetail('Área', project.area)}
      ${formatDetail('Habitaciones', project.habitaciones)}
      ${formatDetail('Baños', project.banos)}
      ${formatDetail('Parqueaderos', project.parqueaderos)}
    `;

    const actions = [];

    if (project.pdf) {
      actions.push(`
        <a
          href="${escapeHTML(project.pdf)}"
          target="_blank"
          rel="noopener noreferrer"
          class="cms-project-modal__button cms-project-modal__button--primary"
        >
          Ver brochure
        </a>
      `);
    }

    if (project.mapa) {
      actions.push(`
        <a
          href="${escapeHTML(project.mapa)}"
          target="_blank"
          rel="noopener noreferrer"
          class="cms-project-modal__button"
        >
          Ver ubicación
        </a>
      `);
    }

    modal.querySelector('.cms-project-modal__actions').innerHTML =
      actions.join('');

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    document.body.classList.add('cms-modal-open');

    const closeButton =
      modal.querySelector('.cms-project-modal__close');

    if (closeButton) {
      closeButton.focus();
    }
  }

  function close() {
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');

    document.body.classList.remove('cms-modal-open');
  }

  window.CMSProjectModal = {
    create: createModal,
    open,
    close
  };

})(window, document);
