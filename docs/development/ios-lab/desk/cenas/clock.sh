#!/bin/bash
# clock.sh <mov> <from_ms> <to_ms> <out>: every frame in the range, the bottom-right corner (the recorder's clock) + a strip of the text
mov=$1; ss=$(echo "scale=3; $2/1000" | bc | sed "s#^\.#0.#"); dur=$(echo "scale=3; ($3-$2)/1000" | bc | sed "s#^\.#0.#")
/usr/local/bin/ffmpeg -loglevel error -y -ss $ss -t $dur -i "$mov" -vf "crop=iw*0.5:ih*0.5:iw*0.5:ih*0.5,scale=430:-1,drawtext=text='%{pts\:flt}':x=4:y=4:fontsize=14:fontcolor=yellow:box=1:boxcolor=black,tile=4x3:padding=2" -frames:v 1 "$4"
