# cut.py rec.jsonl name t0 t1 [nomom] — the owner's wheel events in [t0,t1] ms as a stroke profile (finger, then the decaying tail as momentum)
import json,sys,os
rec,name,t0,t1=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4]); nomom=len(sys.argv)>5
S=os.environ['S']
w=[(r[0],r[2][1]) for r in map(json.loads,open(rec)) if r[1]=='wheel' and t0<=r[0]<=t1 and r[2][1]!=0]
s=w; tail=len(s)-1
while tail>0 and abs(s[tail-1][1])>=abs(s[tail][1]): tail-=1
if nomom or tail>len(s)-6: tail=len(s)
out=[]
for i,(t,dy) in enumerate(s):
    dt=0 if i==0 else t-s[i-1][0]
    ph='b' if i==0 else ('e' if i==min(tail,len(s))-1 else 'c') if i<tail else ('mb' if i==tail else 'me' if i==len(s)-1 else 'mc')
    out.append(f'{dt} {dy} {ph}')
open(f'{S}/strokes/{name}','w').write('\n'.join(out)+'\n')
print(name,len(s),'events, sum',sum(d for _,d in s),'momentum from',tail)
