#!/bin/bash
# tile.sh <mov> <from_ms> <to_ms> <step_ms> <cols> <out.png> [width]
mov=$1; from=$2; to=$3; step=$4; cols=$5; out=$6; w=${7:-288}
n=$(( (to-from)/step + 1 )); rows=$(( (n+cols-1)/cols ))
ss=$(echo "scale=3; $from/1000" | bc | sed "s#^\.#0.#"); dur=$(echo "scale=3; ($to-$from)/1000 + 0.02" | bc | sed "s#^\.#0.#")
fps=$(echo "scale=3; 1000/$step" | bc | sed "s#^\.#0.#")
/usr/local/bin/ffmpeg -loglevel error -y -ss $ss -t $dur -i "$mov" -vf "fps=$fps,scale=$w:-1,drawtext=text='%{pts\:flt}':x=4:y=4:fontsize=12:fontcolor=yellow:box=1:boxcolor=black,tile=${cols}x${rows}:padding=2" -frames:v 1 "$out"
echo $out
