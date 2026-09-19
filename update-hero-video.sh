#!/usr/bin/env bash
# Actualiza el video del hero en _data/hero.json, contenido/pagina/hero.md
# y regenera+conecta el poster (fotograma fijo) en index.njk, todo en un solo paso.
#
# Uso:
#   ./update-hero-video.sh nombre-del-video.mp4
#
# El archivo debe existir ya en img/uploads/. Requiere ffmpeg.

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Uso: $0 nombre-del-video.mp4" >&2
  exit 1
fi

FILENAME="$1"
UPLOAD_PATH="img/uploads/${FILENAME}"

if [ ! -f "${UPLOAD_PATH}" ]; then
  echo "❌ No existe ${UPLOAD_PATH} — verifica el nombre exacto (mayúsculas/minúsculas incluidas)." >&2
  exit 1
fi

if [ ! -f "_data/hero.json" ]; then
  echo "❌ No se encontró _data/hero.json en el directorio actual. ¿Estás en la raíz del proyecto?" >&2
  exit 1
fi

if [ ! -f "contenido/pagina/hero.md" ]; then
  echo "❌ No se encontró contenido/pagina/hero.md en el directorio actual." >&2
  exit 1
fi

if [ ! -f "index.njk" ]; then
  echo "❌ No se encontró index.njk en el directorio actual." >&2
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "❌ ffmpeg no está instalado — no se puede generar el poster." >&2
  exit 1
fi

# Nombre del poster basado en el nombre del video (sin extensión) + "-poster.jpg"
BASENAME="${FILENAME%.*}"
POSTER_FILENAME="${BASENAME}-poster.jpg"
POSTER_PATH="img/uploads/${POSTER_FILENAME}"

echo "→ Generando poster desde ${UPLOAD_PATH}..."
ffmpeg -y -i "${UPLOAD_PATH}" -ss 00:00:00.5 -update 1 -vframes 1 -q:v 2 "${POSTER_PATH}" -loglevel error

if [ ! -s "${POSTER_PATH}" ]; then
  echo "❌ El poster no se generó correctamente (archivo vacío o inexistente)." >&2
  exit 1
fi

echo "✓ Poster generado: ${POSTER_PATH}"

python3 - "$UPLOAD_PATH" "$POSTER_PATH" <<'PY'
import json
import re
import sys

upload_path = sys.argv[1]
poster_path = sys.argv[2]

# --- _data/hero.json ---
json_path = "_data/hero.json"
with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

data["video"] = upload_path

with open(json_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write("\n")

# --- contenido/pagina/hero.md ---
md_path = "contenido/pagina/hero.md"
with open(md_path, "r", encoding="utf-8") as f:
    content = f.read()

new_video_line = f"video: /{upload_path}"

if re.search(r"^video:.*$", content, flags=re.MULTILINE):
    content = re.sub(r"^video:.*$", new_video_line, content, flags=re.MULTILINE)
else:
    content = content.replace("---\n", f"---\n{new_video_line}\n", 1)

with open(md_path, "w", encoding="utf-8") as f:
    f.write(content)

# --- index.njk: actualizar el atributo poster="..." del video del hero ---
njk_path = "index.njk"
with open(njk_path, "r", encoding="utf-8") as f:
    njk_content = f.read()

pattern = re.compile(r'(id="hero-video-bg"[\s\S]*?<video[^>]*?)poster="[^"]*"')
new_njk_content, count = pattern.subn(
    lambda m: m.group(1) + f'poster="{poster_path}"',
    njk_content,
    count=1,
)

if count == 0:
    print("⚠ No se encontró el atributo poster= en el <video> del hero en index.njk — revísalo manualmente.")
else:
    with open(njk_path, "w", encoding="utf-8") as f:
        f.write(new_njk_content)

print(f"✓ _data/hero.json -> {upload_path}")
print(f"✓ contenido/pagina/hero.md -> /{upload_path}")
print(f"✓ index.njk poster -> {poster_path}")
PY

echo ""
echo "Listo."
