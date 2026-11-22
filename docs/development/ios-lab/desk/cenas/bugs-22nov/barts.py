import subprocess, sys
mov=sys.argv[1]
def series(crop, fps=60):
    out = subprocess.run(['ffmpeg','-loglevel','error','-i',mov,'-vf',f'fps={fps},crop={crop},scale=1:1:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
    return [tuple(out[i:i+3]) for i in range(0,len(out),3)]
bar=series('400:60:550:20'); page=series('400:40:1400:150')
prev=None
for i,(b,p) in enumerate(zip(bar,page)):
    if b!=prev: print(f"{i/60:6.3f}s bar {b}  page {p}  {'*' if prev and sum(b)>sum(prev)+6 else ''}")
    prev=b
