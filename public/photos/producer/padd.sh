#!/bin/bash

file="$1"

if [ -z "$file" ]; then
  echo "Usage: ./padd.sh filename.png"
  exit 1
fi

mkdir -p padded

magick "$file" \
    -resize 270x270\> \
    -background none \
    -gravity center \
    -extent 300x300 \
    "padded/$file"