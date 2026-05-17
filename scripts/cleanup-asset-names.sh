#!/usr/bin/env bash
#
# cleanup-asset-names.sh
# ----------------------
# Limpia nombres con DOBLE EXTENSIÓN en public/assets/.
#
# Caso típico: cuando se sube un archivo desde el explorador, a veces
# queda con `.mp4.mp4`, `.png.mp4`, etc. Este script recorre toda la
# carpeta de assets y normaliza esos nombres.
#
# Uso:
#   bash scripts/cleanup-asset-names.sh
#   (o desde npm: npm run cleanup-assets)
#

set -e

# Ir al root del proyecto
cd "$(dirname "$0")/.."

ASSETS_DIR="public/assets"

if [ ! -d "$ASSETS_DIR" ]; then
  echo "Error: no existe $ASSETS_DIR"
  exit 1
fi

echo "Limpiando nombres de archivos en $ASSETS_DIR ..."
echo ""

# Función helper — recibe el sufijo problemático y la extensión final.
# Por ejemplo: rename_extension ".mp4.mp4" ".mp4"
rename_extension() {
  local from="$1"
  local to="$2"
  local count=0

  while IFS= read -r -d '' file; do
    # Construir nuevo nombre quitando el sufijo "from" y agregando "to"
    local new_file="${file%$from}$to"
    if [ "$file" != "$new_file" ]; then
      mv -v "$file" "$new_file"
      count=$((count + 1))
    fi
  done < <(find "$ASSETS_DIR" -type f -name "*$from" -print0)

  if [ "$count" -gt 0 ]; then
    echo "  → $count archivo(s) renombrado(s) (de $from a $to)"
  fi
}

# Casos comunes que limpiar:
rename_extension ".mp4.mp4" ".mp4"
rename_extension ".png.mp4" ".mp4"
rename_extension ".jpg.mp4" ".mp4"
rename_extension ".png.png" ".png"
rename_extension ".jpg.jpg" ".jpg"
rename_extension ".jpeg.jpeg" ".jpeg"
rename_extension ".svg.svg" ".svg"
rename_extension ".webm.webm" ".webm"
rename_extension ".gif.gif" ".gif"

# Caso específico: typos como "mp4.mp4" pegado (sin punto antes del primer mp4)
# Ej: "inventorymp4.mp4" → "inventory.mp4"
while IFS= read -r -d '' file; do
  base="${file%mp4.mp4}"
  # Solo renombrar si el base NO termina ya en un punto (sino sería un .mp4.mp4 normal)
  if [[ "$base" != *. ]]; then
    new_file="${base}.mp4"
    mv -v "$file" "$new_file"
  fi
done < <(find "$ASSETS_DIR" -type f -name "*mp4.mp4" ! -name "*.mp4.mp4" -print0)

echo ""
echo "Limpieza completada."
