#!/usr/bin/env python3
"""frames.py <label> <tape s> [n=12] [step=1] [out] — the strategy's phase 0: the recorded window around a moment of the tape (vtape.js
times), as one sheet of n consecutive video frames (every step-th, 60 fps) from 2 frames before it, each stamped with its tape time.
The video starts at recWall, the tape at vtWall (sweep.mjs's steps file), so a tape time t is at t + (vtWall - recWall) in the video."""
import json, os, subprocess, sys

S = os.environ['S']
label, t = sys.argv[1], float(sys.argv[2])
n = int(sys.argv[3]) if len(sys.argv) > 3 else 12
step = int(sys.argv[4]) if len(sys.argv) > 4 else 1
out = sys.argv[5] if len(sys.argv) > 5 else f'{S}/rec/{label}-{t:.2f}.png'
st = json.load(open(f'{S}/rec/{label}.steps.json'))
off = (st['vtWall'] - st['recWall']) / 1000
# corrected by vdiff.py's fit of the tape's page jumps to the video (ffmpeg starts capturing ~0.5 s after it is spawned)
if os.path.exists(f'{S}/rec/{label}.calib'): off += float(open(f'{S}/rec/{label}.calib').read())
at = t + off - 2 * step / 60
cols = 4
rows = (n + cols - 1) // cols
# each frame stamped with its tape time (pts of the trimmed clip + the start)
draw = f"drawtext=text='%{{eif\\:(t+{t - 2 * step / 60:.4f})*1000\\:d}} ms':x=10:y=10:fontsize=28:fontcolor=yellow:box=1:boxcolor=black@0.6"
vf = f"select='not(mod(n\\,{step}))',scale=576:-2,{draw},tile={cols}x{rows}"
subprocess.run(['/usr/local/bin/ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', f'{max(at, 0):.3f}', '-i', f'{S}/rec/{label}.mp4',
                '-frames:v', '1', '-vf', vf.replace('select=', f'trim=duration={n * step / 60 + 0.02:.3f},select='), out], check=True)
print(out)
