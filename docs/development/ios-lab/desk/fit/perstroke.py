# the tears of a screen.mjs recording, by stroke: which stroke (index, way) each "tear" (> 10 cells at once) follows, and how soon
import json, sys, re, collections
d = sys.argv[1]; skip = int(sys.argv[2]) if len(sys.argv) > 2 else 0
st = json.load(open(d + '/plan.json'))['strokes']
c = collections.Counter(int(m.group(1)) for m in (re.match(r'\s*(\d+) ', l) for l in open(d + '/glitch.txt')) if m)
hits = collections.Counter()
for t, n in sorted(c.items()):
    if n > 10:
        i = max([i for i, s in enumerate(st) if s[0] <= t + 150] or [-1])
        if i >= skip: hits[i] += 1; print(f'  tear {t} ms ({n} cells) after stroke {i} {st[i][1]} +{t - st[i][0]} ms')
print(f'  strokes {skip}..{len(st) - 1}: {len(hits)} with a tear')
