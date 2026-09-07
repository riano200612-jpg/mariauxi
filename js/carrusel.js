(function () {
  'use strict';

  let projectGalleries = {};
  let currentProjectImages = [];
  let currentIndex = 0;

  const projects = {
    'Oporto Tower': {
      key: 'oporto',
      titulo: 'Oporto Tower',
      tag: 'INMOBILIARIA',
      desc: 'Exclusivo diseño arquitectónico con acabados de alta gama y vistas panorámicas excepcionales.'
    },

    'Reserva 90 NEO': {
      key: 'reserva-90',
      titulo: 'Reserva 90 NEO',
      tag: 'INMOBILIARIA',
      desc: 'Modernidad y confort en una ubicación privilegiada con zonas sociales incomparables.'
    },

    'Ítaca Tower': {
      key: 'itaca',
      titulo: 'Ítaca Tower',
      tag: 'INMOBILIARIA',
      desc: 'Vanguardia y elegancia diseñadas para maximizar tu estilo de vida y bienestar diario.'
    },

    'Marduk Tower': {
      key: 'marduk',
      titulo: 'Marduk Tower',
      tag: 'INMOBILIARIA',
      desc: 'Espacios sofisticados pensados para la exclusividad, el confort y la alta valorización.'
    }
  };

  function cargarDatosGalerias() {
    const elemento = document.getElementById('lux-project-galleries-data');

    if (!elemento) {
      console.error('[Carrusel] No existe #lux-project-galleries-data');
      return;
    }

    try {
      projectGalleries = JSON.parse(elemento.textContent || '{}');
      console.log('[Carrusel] Galerías cargadas:', projectGalleries);
    } catch (error) {
      console.error('[Carrusel] Error leyendo galerías:', error);
    }
  }

  function actualizarImagen() {
    const imagen = document.getElementById('modal-imagen');
    const contador = document.getElementById('modal-counter');

    if (!imagen || !currentProjectImages.length) return;

    imagen.src = currentProjectImages[currentIndex];
    imagen.alt = `Imagen ${currentIndex + 1} de ${currentProjectImages.length}`;

    if (contador) {
      contador.textContent =
        `${currentIndex + 1} / ${currentProjectImages.length}`;
    }
  }

  function abrirModal(nombreProyecto) {
    const proyecto = projects[nombreProyecto];

    if (!proyecto) {
      console.warn('[Carrusel] Proyecto no encontrado:', nombreProyecto);
      return;
    }

    const imagenes = projectGalleries[proyecto.key];

    if (!Array.isArray(imagenes) || !imagenes.length) {
      console.warn(
        `[Carrusel] No hay imágenes para ${nombreProyecto}`
      );
      return;
    }

    currentProjectImages = imagenes;
    currentIndex = 0;

    const modal = document.getElementById('modal-proyecto');
    const titulo = document.getElementById('modal-titulo');
    const tag = document.getElementById('lux-modal-tag');
    const desc = document.getElementById('lux-modal-desc');

    if (!modal) {
      console.error('[Carrusel] No existe #modal-proyecto');
      return;
    }

    if (titulo) titulo.textContent = proyecto.titulo;
    if (tag) tag.textContent = proyecto.tag;
    if (desc) desc.textContent = proyecto.desc;

    actualizarImagen();

    modal.classList.add('modal-activo');
    document.body.classList.add('lux-modal-open');
  }

  function cerrarModal() {
    const modal = document.getElementById('modal-proyecto');

    if (modal) {
      modal.classList.remove('modal-activo');
    }

    document.body.classList.remove('lux-modal-open');

    currentProjectImages = [];
    currentIndex = 0;
  }

  function siguienteImagen() {
    if (!currentProjectImages.length) return;

    currentIndex =
      (currentIndex + 1) % currentProjectImages.length;

    actualizarImagen();
  }

  function anteriorImagen() {
    if (!currentProjectImages.length) return;

    currentIndex =
      (currentIndex - 1 + currentProjectImages.length) %
      currentProjectImages.length;

    actualizarImagen();
  }

  window.openLuxModal = abrirModal;
  window.cerrarModal = cerrarModal;
  window.closeLuxModal = cerrarModal;
  window.nextModalImage = siguienteImagen;
  window.prevModalImage = anteriorImagen;

  document.addEventListener('DOMContentLoaded', function () {
    cargarDatosGalerias();

    const modal = document.getElementById('modal-proyecto');
    const closeButton = document.getElementById('lux-modal-close-btn');
    const nextButton = document.querySelector('.lux-gallery-btn.next');
    const prevButton = document.querySelector('.lux-gallery-btn.prev');
    const imagen = document.getElementById('modal-imagen');

    /* Botón X */
    if (closeButton) {
      closeButton.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        cerrarModal();
      });
    }

    /* Fondo del modal */
    if (modal) {
      modal.addEventListener('click', function (event) {
        if (event.target === modal) {
          cerrarModal();
        }
      });
    }

    /* Flechas */
    if (nextButton) {
      nextButton.addEventListener('click', function (event) {
        event.stopPropagation();
        siguienteImagen();
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function (event) {
        event.stopPropagation();
        anteriorImagen();
      });
    }

    /* Teclado */
    document.addEventListener('keydown', function (event) {
      if (!modal || !modal.classList.contains('modal-activo')) {
        return;
      }

      if (event.key === 'Escape') cerrarModal();
      if (event.key === 'ArrowRight') siguienteImagen();
      if (event.key === 'ArrowLeft') anteriorImagen();
    });

    /* Swipe móvil */
    if (imagen) {
      let touchStartX = 0;
      let touchEndX = 0;

      imagen.addEventListener(
        'touchstart',
        function (event) {
          touchStartX = event.changedTouches[0].screenX;
        },
        { passive: true }
      );

      imagen.addEventListener(
        'touchend',
        function (event) {
          touchEndX = event.changedTouches[0].screenX;

          const distancia = touchEndX - touchStartX;

          if (Math.abs(distancia) < 50) return;

          if (distancia < 0) {
            siguienteImagen();
          } else {
            anteriorImagen();
          }
        },
        { passive: true }
      );
    }
  });
})();
