for file in *Tiamo.png; do
    magick "$file" \
        -resize 280x280\> \
        -background none \
        -gravity center \
        -extent 300x300 \
        "padded/$file"
done