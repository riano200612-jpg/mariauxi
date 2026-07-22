#!/bin/bash

# Define la carpeta que quieres auditar (el punto '.' significa la carpeta actual)
DIRECTORIO="./" 

echo "🔍 Iniciando auditoría de solo lectura en: $DIRECTORIO"
echo "======================================================"

# El bucle 'find' busca archivos web, ignorando la carpeta node_modules
find "$DIRECTORIO" -type f \( -name "*.js" -o -name "*.html" -o -name "*.css" -o -name "*.yml" \) -not -path "*/node_modules/*" | while read -r archivo; do
    
    # Imprime el nombre del archivo que se está revisando
    echo -e "\n📂 Auditando: $archivo"
    
    # 1. Buscar "basura" de desarrollo (mensajes de consola, notas, debuggers)
    # -Hn muestra el nombre del archivo y el número de línea. -E permite expresiones regulares.
    grep -Hn --color=always -E "console\.log|TODO|FIXME|debugger|alert\(" "$archivo"
    
    # 2. Buscar posibles conflictos de git o código comentado excesivamente (ej: // o <!--)
    grep -Hn --color=always -E "<<<<<<< HEAD|=======" "$archivo"

    # 3. (Opcional) Si usas linters en tu entorno, puedes ejecutarlos aquí en modo estricto
    # npx eslint "$archivo" --no-fix
    # npx htmlhint "$archivo"
    
done

echo -e "\n======================================================"
echo "✅ Auditoría finalizada. Ningún archivo fue modificado."