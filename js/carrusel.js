(function () {
  'use strict'

  let projectGalleries = {}
  let currentProjectImages = []
  let currentIndex = 0

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
      desc: 'Un concepto residencial contemporáneo que combina confort, naturaleza y diseño de vanguardia.'
    },
    'Ítaca Tower': {
      key: 'itaca',
      titulo: 'Ítaca Tower',
      tag: 'INMOBILIARIA',
      desc: 'Vistas privilegiadas y espacios pensados para una vida frente al mar.'
    },
    'Marduk Tower': {
      key: 'marduk',
      titulo: 'Marduk Tower',
      tag: 'INMOBILIARIA',
      desc: 'Arquitectura imponente con amenidades de primer nivel en el corazón de Cartagena.'
    }
  }

  // Elementos del modal (se resuelven en DOMContentLoaded)
  let modalOverlay, modalImagen, modalCounter, modalTag, modalTitulo, modalDesc
  let btnPrev, btnNext, btnClose

  function cargarGalerias () {
    const dataEl = document.getElementById('lux-project-galleries-data')
    if (!dataEl) return
    try {
      projectGalleries = JSON.parse(dataEl.textContent)
    } catch (err) {
      console.error('No se pudo parsear lux-project-galleries-data:', err)
      projectGalleries = {}
    }
  }

  function actualizarImagenModal () {
    if (!currentProjectImages.length) return

    if (currentIndex < 0) currentIndex = currentProjectImages.length - 1
    if (currentIndex >= currentProjectImages.length) currentIndex = 0

    modalImagen.src = currentProjectImages[currentIndex]
    modalImagen.alt = modalTitulo.textContent || ''
    modalCounter.textContent = (currentIndex + 1) + ' / ' + currentProjectImages.length
  }

  function mostrarSiguiente () {
    currentIndex++
    actualizarImagenModal()
  }

  function mostrarAnterior () {
    currentIndex--
    actualizarImagenModal()
  }

  let elementoDisparador = null

  function abrirModal (nombreProyecto) {
    const info = projects[nombreProyecto]
    if (!info) {
      console.warn('Proyecto no encontrado:', nombreProyecto)
      return
    }

    elementoDisparador = document.activeElement

    currentProjectImages = projectGalleries[info.key] || []
    currentIndex = 0

    modalTag.textContent = info.tag
    modalTitulo.textContent = info.titulo
    modalDesc.textContent = info.desc

    actualizarImagenModal()

    modalOverlay.classList.add('modal-activo')
    modalOverlay.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'

    btnClose && btnClose.focus()
  }

  function cerrarModal () {
    modalOverlay.classList.remove('modal-activo')

    // Mover el foco fuera del modal ANTES de marcarlo aria-hidden,
    // para no violar la regla de accesibilidad (foco atrapado en elemento oculto).
    if (elementoDisparador && typeof elementoDisparador.focus === 'function') {
      elementoDisparador.focus()
    } else if (document.activeElement && modalOverlay.contains(document.activeElement)) {
      document.activeElement.blur()
    }

    modalOverlay.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
  }

  function manejarTeclado (event) {
    if (!modalOverlay.classList.contains('modal-activo')) return

    if (event.key === 'Escape') {
      cerrarModal()
    } else if (event.key === 'ArrowRight') {
      mostrarSiguiente()
    } else if (event.key === 'ArrowLeft') {
      mostrarAnterior()
    }
  }

  function init () {
    cargarGalerias()

    modalOverlay = document.getElementById('modal-proyecto')
    if (!modalOverlay) return

    modalImagen = document.getElementById('modal-imagen')
    modalCounter = document.getElementById('modal-counter')
    modalTag = document.getElementById('lux-modal-tag')
    modalTitulo = document.getElementById('modal-titulo')
    modalDesc = document.getElementById('lux-modal-desc')
    btnClose = document.getElementById('lux-modal-close-btn')
    btnPrev = modalOverlay.querySelector('.lux-gallery-btn.prev')
    btnNext = modalOverlay.querySelector('.lux-gallery-btn.next')

    btnClose && btnClose.addEventListener('click', cerrarModal)
    btnPrev && btnPrev.addEventListener('click', mostrarAnterior)
    btnNext && btnNext.addEventListener('click', mostrarSiguiente)

    modalOverlay.addEventListener('click', function (event) {
      if (event.target === modalOverlay) {
        cerrarModal()
      }
    })

    document.addEventListener('keydown', manejarTeclado)

    // Soporte básico de swipe en móvil dentro del wrap de imagen
    const imgWrap = modalOverlay.querySelector('.lux-modal-img-wrap')
    if (imgWrap) {
      let touchStartX = 0
      imgWrap.addEventListener('touchstart', function (event) {
        touchStartX = event.changedTouches[0].screenX
      }, { passive: true })

      imgWrap.addEventListener('touchend', function (event) {
        const touchEndX = event.changedTouches[0].screenX
        const delta = touchEndX - touchStartX
        if (Math.abs(delta) < 50) return
        if (delta < 0) {
          mostrarSiguiente()
        } else {
          mostrarAnterior()
        }
      }, { passive: true })
    }
  }

  // Expuesta globalmente porque el HTML usa onclick="openLuxModal('...')"
  window.openLuxModal = abrirModal

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
