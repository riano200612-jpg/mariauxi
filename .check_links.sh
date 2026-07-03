#!/usr/bin/env bash
set -eu
cd "$(dirname "$0")"

grep -Roh --exclude-dir=.git -E 'href="[^"]+"' . | sed -E 's/.*href="([^"]+)".*/\1/' | sort -u > /tmp/links.txt || true

echo "Collected links:"; wc -l /tmp/links.txt || true

echo "Checking links..."
> /tmp/linkcheck_output.txt
while IFS= read -r link; do
  if [[ "$link" == http* ]]; then
    code=$(curl -I -L -s -o /dev/null -w "%{http_code}" "$link" || echo "000")
    if [[ "$code" -ge 200 && "$code" -lt 400 ]]; then
      echo "OK $code $link"
    else
      echo "BAD $code $link"
    fi
  elif [[ "$link" == mailto:* ]] || [[ "$link" == javascript:* ]] || [[ "$link" == \#* ]]; then
    echo "SKIP $link"
  elif [[ "$link" == /* ]]; then
    path=".$link"
    path=${path%%#*}
    if [ -e "$path" ]; then echo "OK FILE $link"; else echo "MISSING $link"; fi
  else
    path="$link"
    path=${path%%#*}
    if [ -e "$path" ]; then echo "OK FILE $link"; else echo "MISSING $link"; fi
  fi
done < /tmp/links.txt > /tmp/linkcheck_output.txt 2>/dev/null || true

sed -n '1,200p' /tmp/linkcheck_output.txt || true
