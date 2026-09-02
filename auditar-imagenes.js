const fs = require('fs');
const path = require('path');

const proyectos = ['oporto', 'reserva-90', 'itaca', 'marduk'];
const baseDir = path.join('img', 'proyectos');
const galeriasJsonPath = path.join('_data', 'galerias.json');

let galeriasData = {};

console.log("🔍 Iniciando auditoría estricta de imágenes...");

proyectos.forEach(proyecto => {
  const carpetaProyecto = path.join(baseDir, proyecto);
  galeriasData[proyecto] = [];

  if (!fs.existsSync(carpetaProyecto)) {
    console.log(`⚠️  La carpeta img/proyectos/${proyecto} no existe todavía.`);
    return;
  }

  // Leer todos los archivos de la carpeta
  const archivos = fs.readdirSync(carpetaProyecto);
  let validas = 0;
  let corruptas = 0;

  archivos.forEach(archivo => {
    // Ignorar archivos de portada u ocultos
    if (archivo.endsWith('-cover.webp') || archivo.startsWith('.')) {
      return;
    }

    const rutaCompleta = path.join(carpetaProyecto, archivo);
    
    if (fs.statSync(rutaCompleta).isFile()) {
      const stats = fs.statSync(rutaCompleta);
      
      // Criterio de validación: El archivo debe pesar al menos 15 KB para no considerarse dañado o en blanco
      if (stats.size > 15000) {
        // Registrar ruta web absoluta limpia
        galeriasData[proyecto].push(`/img/proyectos/${proyecto}/${archivo}`);
        validas++;
      } else {
        corruptas++;
        console.log(`❌ [DESCARTADA - CORRUPTA/VACÍA]: /img/proyectos/${proyecto}/${archivo} (${stats.size} bytes)`);
      }
    }
  });

  // Ordenar las imágenes alfabéticamente para mantener orden visual
  galeriasData[proyecto].sort();
  console.log(`✅ Proyecto [${proyecto}]: ${validas} imágenes válidas indexadas (${corruptas} descartadas).`);
});

// Guardar el resultado limpio en galerias.json
fs.writeFileSync(galeriasJsonPath, JSON.stringify(galeriasData, null, 2), 'utf8');
console.log("\n✨ Archivo _data/galerias.json actualizado y sincronizado exitosamente.");
