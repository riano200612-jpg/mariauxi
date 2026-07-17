#!/usr/bin/env bash
set -eu
cd "$(dirname "$0")"

find . -path './.git' -prune -o -name '*.html' -type f -exec sed -nE 's/.*[[:space:]](href|src)="([^"]+)".*/\2/p' {} + | sort -u > /tmp/links.txt

echo "Collected links:"; wc -l /tmp/links.txt || true

echo "Checking links..."
> /tmp/linkcheck_output.txt
while IFS= read -r link; do
  if [[ "$link" == //* ]]; then
    echo "SKIP PROTOCOL-RELATIVE $link"
  elif [[ "$link" =~ ^https://[^/]+$ ]]; then
    echo "SKIP CONNECTION-HINT $link"
  elif [[ "$link" == http* ]]; then
    link=${link//&amp;/\&}
    code=$(curl -I -L -s -o /dev/null -w "%{http_code}" "$link" || true)
    code=${code:-000}
    if [[ "$code" -ge 400 && "$code" -lt 600 ]]; then
      code=$(curl -L -s -o /dev/null -w "%{http_code}" "$link" || true)
      code=${code:-000}
    fi
    if [[ "$code" -ge 200 && "$code" -lt 400 ]]; then
      echo "OK $code $link"
    elif [[ "$code" == "000" || "$code" -ge 600 ]]; then
      echo "UNVERIFIED $link"
    else
      echo "BAD $code $link"
    fi
  elif [[ "$link" == mailto:* ]] || [[ "$link" == tel:* ]] || [[ "$link" == javascript:* ]] || [[ "$link" == \#* ]]; then
    echo "SKIP $link"
  elif [[ "$link" == /* ]]; then
    path=".${link%%\?*}"
    path=${path%%#*}
    if [ -e "$path" ]; then echo "OK FILE $link"; else echo "MISSING $link"; fi
  else
    path="${link%%\?*}"
    path=${path%%#*}
    path=${path//%20/ }
    if [ -e "$path" ]; then echo "OK FILE $link"; else echo "MISSING $link"; fi
  fi
done < /tmp/links.txt > /tmp/linkcheck_output.txt 2>/dev/null || true

sed -n '1,200p' /tmp/linkcheck_output.txt || true
