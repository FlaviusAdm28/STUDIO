import json, sys, math, os
S=os.environ['S']; out=f'{S}/strokes'
def write(name, rows):
    open(f'{out}/{name}','w').write('\n'.join(f'{dt} {dy} {ph}' for dt,dy,ph in rows)+'\n')
# one real finger swipe: ramp like the owner's (1 16 5 18 75 ...) up to peak, ~24 events, then momentum decaying from ~peak*0.6
def swipe(peak, sign=1, mom=True, events=24):
    rows=[]
    for i in range(events):
        x=(i+0.5)/events; d=peak*math.sin(math.pi*x)**0.8
        rows.append((8, round(sign*max(1,d)), 'b' if i==0 else 'e' if i==events-1 else 'c'))
    if mom:
        v=rows[-1][1]*0.9; ms=[]
        while abs(v)>=1:
            ms.append(round(v)); v*=0.93
        for i,d in enumerate(ms): rows.append((16, d, 'mb' if i==0 else 'me' if i==len(ms)-1 else 'mc'))
    return rows
for pk in (60,120,300,800):
    write(f'swipe{pk}', swipe(pk)); write(f'swipe{pk}-up', swipe(pk,-1))
# the owner's chain: the strongest stroke of a recording, replayed (finger phases; the final decaying tail as momentum)
def chain(rec, name, k=0):
    rows=[json.loads(l) for l in open(rec) if l.startswith('[')]
    w=[(r[0],r[2][1]) for r in rows if r[1]=='wheel']
    strokes=[];cur=[]
    for t,dy in w:
        if cur and t-cur[-1][0]>300: strokes.append(cur);cur=[]
        cur.append((t,dy))
    if cur: strokes.append(cur)
    s=sorted(strokes,key=lambda s:-abs(sum(d for _,d in s)))[k]
    # tail: from the last index where |dy| rises
    tail=len(s)-1
    while tail>0 and abs(s[tail-1][1])>=abs(s[tail][1]): tail-=1
    res=[]
    for i,(t,dy) in enumerate(s):
        dt=0 if i==0 else t-s[i-1][0]
        if dy==0: continue
        res.append((dt,dy,'b' if i==0 else 'e' if i==tail-1 else 'c' if i<tail else ('mb' if i==tail else 'me' if i==len(s)-1 else 'mc')))
    write(name,res); print(name,'sum',sum(d for _,d in s),'events',len(s),'tail from',tail)
base='/Users/flaviooliveira/WebstormProjects/STUDIO/docs/development/ios-lab/out/'
chain(base+'2026-11-14T02-25-54-rec.jsonl','owner-chain-safari')
chain(base+'2026-11-14T01-41-32-rec.jsonl','owner-chain-chrome')
chain(base+'2026-11-14T01-41-32-rec.jsonl','owner-chrome-2',1)
chain(base+'2026-11-14T01-41-32-rec.jsonl','owner-chrome-3',2)
# a stroke begun gently (1, 3, 8, 20…), as a hand begins one while the last one's momentum is cut: the conductor's battery (cenas/fast.mjs, 16 Nov)
def gentle(sign=1):
    ramp=[1,3,8,20,45,90,150,220,280,300,290,250,190,120,70,40]
    rows=[(8,sign*d,'b' if i==0 else 'e' if i==len(ramp)-1 else 'c') for i,d in enumerate(ramp)]
    v=36.0; ms=[]
    while v>=1: ms.append(round(v)); v*=0.93
    rows+= [(16,sign*d,'mb' if i==0 else 'me' if i==len(ms)-1 else 'mc') for i,d in enumerate(ms)]
    return rows
write('gentle300', gentle()); write('gentle300-up', gentle(-1))
