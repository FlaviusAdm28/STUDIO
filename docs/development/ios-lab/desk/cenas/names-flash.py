# The chapter names' row drawn in its end layout before its flight begins (Safari, 17 Nov): for each change of chapter in a screen.mjs
# recording, each frame of the title row is compared with the row settled (1.6 s on); a frame that already matches the end, early, and
# frames after it that move away again = the end layout flashed before the names flew.
#   python3 names-flash.py <dir> [<dir> …]
import json, subprocess, sys
W, H = 160, 24
for d in sys.argv[1:]:
    plan = json.load(open(f'{d}/plan.json'))
    crop = 'crop=iw*0.45:ih*0.1:iw*0.47:ih*0.21' if plan['browser'] == 'chrome' else 'crop=iw*0.45:ih*0.1:iw*0.47:ih*0.21'
    pts = [float(x) for x in subprocess.run(['/usr/local/bin/ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'frame=pts_time', '-of', 'csv=p=0', f'{d}/screen.mov'], capture_output=True, text=True).stdout.replace(',', ' ').split()]
    raw = subprocess.run(['/usr/local/bin/ffmpeg', '-loglevel', 'error', '-i', f'{d}/screen.mov', '-fps_mode', 'passthrough', '-vf', f'{crop},scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True).stdout
    n = min(len(raw) // (W * H), len(pts))
    fr = lambda i: raw[i * W * H:(i + 1) * W * H]
    diff = lambda a, b: sum(abs(x - y) for x, y in zip(fr(a), fr(b))) / (W * H)
    at = lambda ms: min(range(n), key=lambda i: abs(pts[i] * 1000 - ms))
    found = 0
    changes = 0
    for t, k in plan['strokes'][1:]:
        end = at(t + 1600)
        idx = [i for i in range(n) if t - 250 <= pts[i] * 1000 <= t + 400]
        dv = [(round(pts[i] * 1000), diff(i, end)) for i in idx]
        if dv[0][1] < 3:
            continue  # no change of the row at this stroke (the top, the Method)
        changes += 1
        hit = None
        for j, (ms, v) in enumerate(dv):
            if v < 2.5 and any(w > 4 for _, w in dv[j + 1:j + 5]):
                hit = ms
                break
        if hit:
            found += 1
        print(f"  {plan['browser']} {k} at {t}: {'FLASH at ' + str(hit) if hit else 'clean'}")
    print(f"{d.split('/')[-1]}: {found} of {changes} changes flashed")
