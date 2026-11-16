# V5 — catálogo de bugs do scroll e das passagens (fase 0 de `v5-scroll-strategy.md`)

Cada bug: número, onde, browser(s), gatilho reprodutível, prova, causa provável (R1–R5 da estratégia), estado. Os números não se
reutilizam. "Por reproduzir" = reportado, ainda sem gatilho medido pela matriz.

Causas: **R1** vários donos da posição · **R2** segurar com `overflow: hidden` · **R3** encaixe ligado/desligado por estado ·
**R4** retenções de tempo fixo · **R5** passagens com cópias e trocas de elementos.

## Ferramentas (laboratório do desktop, `docs/development/ios-lab/desk/`)

- `vtape.js` — a fita visual (por fotograma: caixa, opacidade efetiva e imagem de cada elemento visível que conta; `scrollY`; as marcas da
  raiz). `sweep.mjs <chrome|safari> <label> <recSec> <passos>` — página nova, passa a entrada, passos reais (gestos de trackpad do macOS,
  teclas reais, cliques), a fita a correr e o ecrã gravado (ffmpeg, 60 fps). `vscan.py <label>` — as anomalias (JUMP, SWAP, FLASH, PHOTO,
  POP, PAGE, SLOW, STEP). `phase0.sh` — a matriz M1–M8 nos dois browsers.
- Matriz: M1/M2/M3 a página inteira ida e volta a 120/300/800 px; M4 os arrastos lentos do owner; M5 rajadas (20 a 1,4 s); M6 inversões a
  meio de cada passagem; M7 entradas (menu → cada secção + passadas, *Chapter One* + passada imediata, PageDown/PageUp/Espaço/End/Home);
  M8 as cadeias fortes do owner. Fitas e vídeos em `~/.local/share/v5-lab/rec/p0-<browser>-<M>.*`.

## Reportados pelo owner (antes da fase 0)

| # | Onde | Browser | O que | Causa provável | Estado |
|---|---|---|---|---|---|
| 1 | Toda a página | Safari | A página recarrega ("ocorreu um problema"): crash do WebKit em `ScrollAnimationMomentum::updateScrollExtents` (14/11 01:54, 15/11 12:55) | R2 | Causa encontrada; por corrigir. A matriz (33 min de Safari, as cadeias do owner incluídas) não o reproduziu: 0 relatórios novos. **Mais um a 15/11 14:49**, a mesma pilha (`ScrollView::setScrollbarModes` → `didAddScrollbar` → `ScrollAnimationMomentum::updateScrollExtents`), fora dos testes do laboratório (o Safari não estava a ser conduzido) |
| 2 | Work, passagem topo ↔ Weddings | Chrome, Safari | "Vários bugs na animação do Weddings… lag, inconsistências" (15/11 12:51); D de 14/11: o arco ~40 px abaixo e ~10 % menor no último fotograma do voo; a fotografia do arco muda de enquadramento/luz no início da volta | R5 | **Reproduzido** na volta (ver #18 e #19), em todas as passadas Weddings → topo |
| 3 | Work, passagem | Chrome | A roda para trás ignorada durante a passagem para a frente (D, Chrome 2) | R1/R4 | Não reproduzido: M6, 64 de 64 inversões certas nos dois browsers (com as correções de 15/11) |
| 4 | Work, para trás do Method 7 | Chrome | O Work passa inteiro para trás; `data-near` fica no 8c (D, Chrome 4) | R3 | Não reproduzido: Method 7 ↑ → Experiences em M1–M3, M6, M7 (≥ 12 vezes por browser) |
| 5 | Work, 1.ª passagem | Chrome | Página presa em 1374 e ajuste de +55 px no fim (D) | R1 | Não reproduzido: a 1.ª passagem acaba em 1319 em todas as matrizes |
| 6 | Contact → Questions | Chrome, Safari | "Animação muito rápida do Contact para as Questions" (15/11 12:51) | R4/R5 | **Medido:** a cena do Contact recua no escuro (`BACK_MS` 1,2 s) e no fim as Questions (linho) entram em **67 ms** (4 fotogramas, luminância 10–90 %; 3 de 3 por browser); para a frente a mesma mudança leva 480–500 ms. Um corte, não uma passagem |
| 7 | Depois de um salto do menu | Chrome, Safari | O encaixe desligado ~1,6 s: um gesto atravessa o Method ou salta o 8a (C) | R3 (`unsnapped()` desliga o encaixe 1,6 s; o regulador lê "sem encaixe obrigatório" e larga o gesto: `stop = null`) | **Reproduzido** (15/11 15:20, `p0-<b>-M7b`: menu → secção, passada de 300 px 0,3 / 0,7 / 1,2 s depois). A 0,3 e 0,7 s, 15 de 16 erradas por browser, várias paragens de uma vez — Chrome: Weddings → 8b, 7 → 12, 12 → 14, Q → fim; ↑ 7 → topo, 12 → Experiences, Q → 8b, C → 9. Safari igual ou pior (7 → 13/14, 12 → fim). A 1,2 s: Chrome 7 de 8 certas (Weddings → 8b continua); Safari 1 de 8 certa e a página **para entre paragens** (6650, 11869, 13927, 11068, 12045 — o encaixe volta a meio do gesto). Com a passada 3,5 s depois: certo (M7) |
| 8 | Method, 1728×942 | Chrome | *Make it yours / Your name* por cima dos cartões 8a–8c (E) | — (layout) | Por verificar |
| 9 | Method | Safari | Os cartões a mexer debaixo da barra do Safari (F, Safari 2) | ? | Pedir vídeo ao owner |
| 10 | Menu sobre o Contact | Chrome | Abrir/fechar: fotogramas de 108–250 ms (G) | ? | Chrome: não reproduzido (0 fotogramas > 50 ms em todo o M7). Safari: 69–82 ms em cada salto do menu (4–5 fotogramas por salto) — ver #22 |
| 11 | About 14 | Chrome, Safari | A retenção da história (1,6 s) volta ao 14 um gesto feito ~1 s depois (A2) | R4 | Decisão do owner |
| 12 | Work, 15/11 | Chrome | 13 px fora do Weddings toda a passagem depois de *Chapter One* | R1 | Corrigido no disco (15/11), por aprovar. M7: *Chapter One* + passada → 1319 |
| 13 | Toda a página, 15/11 | Chrome, Safari | Um evento de 1–3 px ao contrário punha a página na paragem, às vezes duas | R1 | Corrigido no disco (15/11), por aprovar. Matriz: ver o resumo das posições abaixo |
| 14 | Android | Chrome Android | Gestos fortes passam paragens (Weddings → Experiences; do 7 ao topo) | R3 (o `scroll-snap-stop: always` não segura um arremesso no Chrome do Android; no desktop há o regulador, no telemóvel nada) | **Reproduzido** no Xiaomi (15/11, `finger/xiaomi-walk.mjs`, gestos sintetizados de 700 px a 6000 px/s): no Work as paragens aguentam (a passagem segura a página), mas no Method/About/Contact um gesto forte salta uma paragem — ↓ 7 → 8b → 9 → 11 → 12 → 14; ↑ fim → Q, 14 → 12 → 10 → 8c → 8a → Experiences. Gestos normais (320 px): todas as paragens, ida e volta. Por corrigir (fase 2) |

## Encontrados pela matriz (fase 0)

Matriz corrida a 15/11, 13:12–14:10, build da 3100 com as correções #12 e #13 por aprovar; Chrome 1728×942, Safari 27.2 1728×977;
16 corridas, 49 min de fita e vídeo. Ficheiros: `~/.local/share/v5-lab/rec/p0-<browser>-<M>.{log,steps.json,vt.json,mp4,scan,vdiff}`.

**Posições (onde cada gesto acaba)** — quase limpo:

| Matriz | Chrome | Safari |
|---|---|---|
| M1–M3 (120/300/800 px, 34 passadas cada, ida e volta) | 102 de 102 na paragem seguinte | 101 de 102 (#15) |
| M5 rajadas (20 + 20 a 0,4 s) | uma paragem por gesto; o gesto durante a passagem do Contact não faz nada | idem |
| M6 inversões a meio (64) | 64 de 64 | 64 de 64 |
| M7 menu → cada secção + passadas, *Chapter One* + passada | 15 de 15 | 15 de 15 (o menu acaba 1 px ao lado: 5618, 9720, 12360, 13337 — sem efeito) |
| M7 PageDown ×17, PageUp ×17, Espaço ×5 | todos certos | um perdido no Weddings de cada vez (#17) |
| M7 End / Home | End para no About 14 (#16) | End e Home andam uma paragem (#16) |
| M8 cadeias do owner (várias passadas do dedo cada) | várias paragens por cadeia, nunca a correr livre | idem |

O 4946 (Chrome) / 5130 (Safari), que a etiqueta da fita chama "Method pre", é a paragem do Experiences (a do Method, `data-at='out'`).

**O que se vê (vídeo)** — a fita (`vscan.py`) dá muitos falsos positivos (elementos cortados fora de vista, cópias que entram por baixo
do original, os títulos do Work fora do palco); conferidos no vídeo, os do M2 do Chrome eram todos movimento normal. A prova é o vídeo:
`vdiff.py` mede a mudança de imagem de fotograma para fotograma (o *scene score* do ffmpeg) e põe cada pico na fita (passo, secção,
`scrollY`; o vídeo começa ~0,53 s depois do que o `sweep.mjs` regista, calibrado por corrida). Os picos com a página parada repetem-se
sempre nos mesmos sítios, e é desses que saem #18–#20. Os picos com a página a andar são a própria velocidade do trackpad: ~950 px em
3–4 fotogramas entre secções (About ↔ Questions, por exemplo) — o regulador põe a página na paragem tão depressa quanto o dedo.

| # | Onde | Browser | O que | Prova | Causa provável | Estado |
|---|---|---|---|---|---|---|
| 15 | Work, Artists ↑ | Safari | Uma passada de 300 px para cima do Artists foi ao topo, saltando o Weddings | M2 t=180 s: o regulador põe 1368 (segurado), 81 ms depois a passagem do Work vai a 0 (`holdFor(0)`, `overflow` escondido); a fita não registou nenhum `scrollY` acima do Weddings entre os dois. 1 de ~8 passadas Artists ↑ no Safari | R1 (o regulador e a passagem do Work no mesmo gesto) | Por corrigir; gatilho por isolar (repetir só esta passada) |
| 16 | Teclas End / Home | Chrome, Safari | Chrome: End do 8a para no About 14. Safari: End do 7 → 8a, Home do 8a → 7 (uma paragem) | M7 | R1/R3 (as teclas vs. o encaixe e as retenções) | Por corrigir; a navegação convencional diz End = fim, Home = topo |
| 17 | Work, Weddings | Safari | A primeira PageDown/Espaço depois de chegar ao Weddings perde-se (1367 → 1368) | M7: 2 de 2 (PageDown e Espaço) | R3: a marca está em 1,4 × 977 = 1367,8 px e a página chega 0,8 px antes | Por corrigir |
| 18 | Work, Weddings → topo | Chrome | Na volta, o palco apaga-se com o arco dentro (~0,5 s de escuro), e o arco reaparece do nada a meio do voo, já sobre a entrada | M1, M2, M3: o mesmo pico em cada passada Weddings ↑ (frames `arch-chrome-M2*.png`) | R5 (a cópia do arco só aparece depois de o palco se apagar) | Por corrigir; é o #2 no Chrome |
| 19 | Work, Weddings → topo | Safari | No início da volta, o arco troca num fotograma da fotografia do palco (escura, com a contagem por cima) para uma cópia clara e limpa, que depois voa até à lâmina | M3 t=196 s (`arch-safari-M3.png`) | R5 (cópia com outro tratamento de luz) | Por corrigir; é o #2 no Safari |
| 20 | Contact → Questions | Chrome, Safari | Ver #6: 67 ms de clarão no fim de 1,2 s de recuo | M1–M3 | R4/R5 | Medido |
| 21 | Work, Weddings | Chrome, Safari | O arrasto lento do owner (101 px, 0,3 s) no Weddings: para baixo fica no Weddings (17 de 17, abaixo da banda morta de 12 %, README #110), para cima vai ao topo (1 de 1) | M4 | — | **Owner (15/11): não viu problema.** Fica como está: para tornar o arrasto simétrico seria preciso mexer no limiar da passagem do Work (12 px, a zona do #15) — esperar pela fase 2. Falta o arrasto lento nas outras paragens |
| 22 | Saltos do menu, passagens do Method/About | Safari | Fotogramas de 52–89 ms: 4–5 em cada salto do menu (69–82 ms), passagens do Method e do About (55–63 ms). Chrome: 1 em toda a matriz | `.scan` SLOW | ? (a fita lê `getComputedStyle` por fotograma: parte do custo pode ser dela) | Medir sem a fita antes de concluir |

**Xiaomi (15/11, depois da matriz):** a passagem do Work, ida e volta, 24 de 24 (normal, forte, arrasto, arrasto lento; 0 movimentos depois de parar; 2 fotogramas > 50 ms: 55 e 64 ms); com o dedo parado 1,5 s no fim do arrasto 12 de 12 (a correção do `holdFor`/`fingerDown()` de 14/11 verificada no Android); a página inteira: normal certa, forte → #14.

**iPhone, Simulador (15/11 15:41–15:47, `desk/simsweep.mjs`, v5-iphone iOS 27.3, 402×714; toques reais pelo `simtouch`):**
- Página inteira com gestos normais (290 pt, 150 ms): **34 de 34** na paragem seguinte, ida e volta (`p0-sim-S1`).
- **#7 no toque** (`p0-sim-S2`, menu → secção e um gesto 0,3 / 0,7 / 1,2 s depois): a 0,3 s **3 de 8 errados**, cada um salta **uma**
  paragem (About 12 → 14, Questions → fim, About 12 ↑ → 10); a 0,7 e 1,2 s 16 de 16 certos. Mais brando do que no desktop (lá até 4 paragens
  e até 1,2 s), mas o mesmo gatilho.
- **#19 no iPhone:** a volta Weddings → topo troca o arco num fotograma (a fotografia do palco com a contagem → uma cópia clara e limpa), depois
  voa para a lâmina — igual ao Safari do Mac (`p0-sim-S1-149.20.png`).
- **#6 no iPhone:** Contact → Questions, a cena recua no escuro e o linho das Questions entra em ~120 ms (`p0-sim-S1-85.30.png`).
- Não corridos: as inversões a meio (S3) e os gestos rápidos (S4). Às 15:47:49 o iOS simulado inteiro caiu (Safari, WebKit e serviços sem
  relação com o site, todos `KERN_MEMORY_ERROR` no mesmo segundo: o disco do runtime desapareceu por baixo deles) e o runtime voltou a ficar
  ilegível ("Malformed bundle"). Não é o site. Há dois runtimes iOS 27.3 instalados (o antigo "Unusable – Cryptex Mount Preferred" e o novo
  "Ready", de 15/11): suspeito do conflito; reiniciar o Mac ou apagar o antigo é decisão do owner.

Não verificado nesta fase: o iPhone (15/11 15:35: o Simulador não arranca — o runtime iOS 27.3 está montado pelo `cryptexd` mas ilegível, "Malformed bundle … iOS 27.3.simruntime", `Permission denied` mesmo fora do isolamento; os sims dão "runtime profile not found" e o `CoreSimulatorService` corta a ligação. O costume é reiniciar o Mac; senão, apagar e voltar a instalar o runtime), um gesto < 1,6 s depois de um salto do menu (#7), o arrasto lento fora do
Weddings (#21), os vídeos de M4–M8 fotograma a fotograma (só os picos com a página parada, por amostra).

### Encontrados depois (15/11)

| # | Onde | Browser | O que | Prova | Causa | Estado |
|---|---|---|---|---|---|---|
| 23 | Work, topo → Weddings, arrasto lento | Chrome Android | Um arrasto lento (250 px em 1,2 s) passa o Weddings e acaba no Artists: a página assenta no Weddings, a retenção larga à hora certa e ~0,8 s depois, sem gesto, o Chrome leva-a sozinho ao Artists (o encaixe do Chrome a escolher outro alvo quando a página fica livre) | Xiaomi 15/11 17:45, `finger/xiaomi-pass.mjs`: 2 de ~14 arrastos lentos (o 1.º depois de carregar a página, das duas vezes). Também com o código antigo (no Android a retenção nova faz o mesmo que a antiga) | R3 | Por corrigir com o condutor no toque (com o #14) |

## Causas (fase 1, 15/11)

Cada bug ligado à sua causa, com o mecanismo no código e as sondas A–C (#15 o regulador, raro; #18 cópias que o Chrome não pinta, confirmado; #22 real, não é a fita): `v5-scroll-strategy.md` § "Fase 1".
