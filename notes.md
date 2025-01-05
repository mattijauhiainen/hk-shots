### Convert from some format to avif

magick ~/Downloads/lantau-sunset.HEIC ./public/images/lantau-sunset.avif

### Cap size to max 2000 pixels of height or width using sips

sips -Z 2000 /path/to/input/image.heic --out /path/to/output/image.heic

### Cap size to max 2000 pixels of height or width using magick

magick convert lantau-sunset.avif -resize 2000x2000\> lantau-sunset.avif

### Make a thumbnail from this, where the larger dimension is at most 480

magick convert lantau-sunset.avif -resize 480x480\> thumbnails/lantau-sunset.avif

### Make a entry to photoData.ts with for the new photo

sips -g pixelWidth -g pixelHeight lantau-sunset.avif | awk -v filename=$(basename lantau-sunset.avif) '/pixelWidth/ {width=$2} /pixelHeight/ {height=$2} END {print "{\n width: " width ",\n height: " height ",\n filename: \"" filename "\",\n alt: \"\"\n}"}'

### Make 480px, 960px and 1920px
