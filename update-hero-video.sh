#!/usr/bin/env bash
# Actualiza el video del hero en _data/hero.json y contenido/pagina/hero.md
# a la vez, para que ambas fuentes de verdad queden sincronizadas.
#
# Uso:
#   ./update-hero-video.sh nombre-del-video.mp4
#
# El archivo debe existir ya en img/uploads/.

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

python3 - "$UPLOAD_PATH" <<'PY'
import json
import re
import sys

upload_path = sys.argv[1]

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
    # Si no existiera la línea (caso raro), la agregamos antes del cierre de frontmatter.
    content = content.replace("---\n", f"---\n{new_video_line}\n", 1)

with open(md_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"✓ _data/hero.json -> {upload_path}")
print(f"✓ contenido/pagina/hero.md -> /{upload_path}")
PY

echo ""
echo "Listo. Revisa con:"
echo "  cat _data/hero.json"
echo "  cat contenido/pagina/hero.md"
echo ""
echo "Luego reconstruye y prueba:"
echo "  rm -rf _site && npx eleventy --serve"
