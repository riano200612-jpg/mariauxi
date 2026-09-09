const fs = require('fs');
const file = './js/cms-projects.js';
let code = fs.readFileSync(file, 'utf8');

const botonLujo = `\${cover ? '' : '<div class="orb"></div>'}
        <!-- Botón translúcido de lujo -->
        <button type="button" 
          aria-label="Descubrir \${mainTitle}" 
          data-modal-project='\${JSON.stringify({
            title: project.title,
            cover: project.cover,
            gallery: project.gallery,
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
          }).replace(/'/g, "&#39;").replace(/"/g, "&quot;")}' 
          onclick="CMSProjectModal.open(JSON.parse(this.dataset.modalProject))" 
          style="position:absolute; inset:0; width:100%; height:100%; background:rgba(0,0,0,0); color:#fff; border:none; opacity:0; transition:all 0.6s cubic-bezier(0.16, 1, 0.3, 1); cursor:pointer; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(0px); -webkit-backdrop-filter:blur(0px); z-index:2; text-decoration:none;" 
          onmouseover="this.style.opacity='1'; this.style.background='rgba(15,23,30,0.3)'; this.style.backdropFilter='blur(8px)'; this.style.webkitBackdropFilter='blur(8px)';" 
          onmouseout="this.style.opacity='0'; this.style.background='rgba(0,0,0,0)'; this.style.backdropFilter='blur(0px)'; this.style.webkitBackdropFilter='blur(0px)';">
          <span style="font-size:0.75rem; font-weight:400; letter-spacing:0.25em; text-transform:uppercase; border-bottom:1px solid rgba(255,255,255,0.4); padding-bottom:6px; transition:border-color 0.4s ease;" onmouseover="this.style.borderColor='rgba(255,255,255,1)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.4)'">
            Descubrir
          </span>
        </button>`;

code = code.replace(/\$\{cover \? '' : '<div class="orb"><\/div>'}/, botonLujo);
fs.writeFileSync(file, code);
console.log("¡Éxito! Botón de cristal inyectado en las tarjetas.");
