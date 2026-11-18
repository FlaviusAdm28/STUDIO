# jump.py <recording> <log> (17 Nov) — needs a log of 'ms-from-recording-start direction where' lines (one per stroke)
# the first frames of each chapter change in a Simulator recording: the names' row frame to frame (mean change per pixel); a jump at the
# start = a first step far larger than the steps after it (an even curve starts with small steps)
import subprocess, sys
mov, log = sys.argv[1], sys.argv[2]
W, H = 160, 16
pts = [float(x) for x in subprocess.run(['/usr/local/bin/ffprobe','-v','error','-select_streams','v','-show_entries','frame=pts_time','-of','csv=p=0',mov],capture_output=True,text=True).stdout.replace(',',' ').split()]
raw = subprocess.run(['/usr/local/bin/ffmpeg','-loglevel','error','-i',mov,'-fps_mode','passthrough','-vf',f'crop=iw:ih*0.07:0:ih*0.505,scale={W}:{H}','-f','rawvideo','-pix_fmt','gray','-'],capture_output=True).stdout
n = min(len(raw)//(W*H), len(pts))
fr = lambda i: raw[i*W*H:(i+1)*W*H]
d = [0] + [sum(abs(a-b) for a,b in zip(fr(i),fr(i-1)))/(W*H) for i in range(1,n)]
for line in open(log):
    t, what, frm = int(line.split()[0]), line.split()[1], line.split()[2]
    if not frm.startswith('W'): continue
    idx = [i for i in range(n) if t - 100 <= pts[i]*1000 <= t + 1200]
    steps = [(round(pts[i]*1000) - t, d[i]) for i in idx]
    first = next((k for k, (_, v) in enumerate(steps) if v > 0.4), None)
    if first is None: print(f'{what} from {frm}: no motion'); continue
    seq = [round(v, 1) for _, v in steps[first:first + 10]]
    print(f'{what} from {frm:9} starts at +{steps[first][0]} ms, first steps: {seq}')
