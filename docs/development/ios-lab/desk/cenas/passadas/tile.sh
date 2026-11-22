#!/bin/bash
# tile.sh dir from_s to_s fps cols : frames of runs/<dir>/screen.mov with their time, tiled → runs/<dir>/tile-<from>.png
D=runs/$1; F=$2; T=$3; FPS=${4:-5}; C=${5:-6}
N=$(python3 -c "import math;print(math.ceil(($T-$F)*$FPS/$C))")
ffmpeg -loglevel error -y -ss $F -to $T -i $D/screen.mov -vf "fps=$FPS,scale=420:-1,drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:text='%{pts\:flt\:$F}':x=8:y=8:fontsize=22:fontcolor=red:box=1:boxcolor=white,tile=${C}x$N" -frames:v 1 $D/tile-$F.png && echo $D/tile-$F.png
