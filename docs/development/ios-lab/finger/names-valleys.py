# names-valleys.py <recording> <log> (17 Nov) — the same log as names-jump.py
# the names' row in a Simulator recording: per frame, how much text is drawn (pixels brighter than the row's ground); for each chapter
# change, the curve from the stroke to +2 s and its valleys (one = the old row out, then the new one in; two = it came, went and came back)
import subprocess, sys
mov, log = sys.argv[1], sys.argv[2]
W, H = 200, 16
pts = [float(x) for x in subprocess.run(['/usr/local/bin/ffprobe','-v','error','-select_streams','v','-show_entries','frame=pts_time','-of','csv=p=0',mov],capture_output=True,text=True).stdout.replace(',',' ').split()]
raw = subprocess.run(['/usr/local/bin/ffmpeg','-loglevel','error','-i',mov,'-fps_mode','passthrough','-vf',f'crop=iw:ih*0.045:0:ih*0.515,scale={W}:{H}','-f','rawvideo','-pix_fmt','gray','-'],capture_output=True).stdout
n = min(len(raw)//(W*H), len(pts))
ink = [sum(1 for v in raw[i*W*H:(i+1)*W*H] if v > 90) for i in range(n)]
for line in open(log):
    t, d, frm = line.split()
    t = int(t)
    if frm.startswith('top') or not frm.startswith('W'): continue
    idx = [i for i in range(n) if t <= pts[i]*1000 <= t + 2000]
    if not idx: continue
    v = [ink[i] for i in idx]
    hi = max(v)
    # a valley: the text falls under 15 % of the most and rises again over 60 %
    valleys, low, k = 0, False, None
    for x in v:
        if x < 0.15 * hi and not low: low = True; valleys += 1
        elif x > 0.6 * hi and low: low = False
    spark = ''.join(' .:-=+*#'[min(7, int(8 * x / (hi + 1)))] for x in v)
    print(f'{d} from {frm:10} valleys {valleys}  {spark}')
