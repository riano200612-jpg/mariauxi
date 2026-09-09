const fs = require('fs');
const file = './js/cms/cms-project-modal.js';
let code = fs.readFileSync(file, 'utf8');

const blockToInsert = `const mediaContainer = modal.querySelector('.cms-project-modal__media')
    const images = (project.gallery && project.gallery.length > 0) ? project.gallery : (image ? [image] : [])
    
    mediaContainer.innerHTML = '<style>.lux-scroll::-webkit-scrollbar { display: none; }</style>' +
      '<div class="lux-scroll" style="display:flex; overflow-x:auto; scroll-snap-type: x mandatory; width:100%; height:100%; scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none;">' + 
      images.map(img => \`<img src="\${img}" alt="\${title}" loading="lazy" style="flex:0 0 100%; width:100%; height:100%; object-fit:cover; scroll-snap-align: start;">\`).join('') + 
      '</div>'`;

code = code.replace(/modal\.querySelector\('\.cms-project-modal__image'\)\.src = image/, blockToInsert);
code = code.replace(/modal\.querySelector\('\.cms-project-modal__image'\)\.alt = title/, '// (Etiqueta estática reemplazada por el carrusel de lujo)');

fs.writeFileSync(file, code);
console.log("¡Éxito! Carrusel de lujo inyectado.");
