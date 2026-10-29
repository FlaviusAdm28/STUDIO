# Chapter One V5 — handoff

## ▶ COMEÇAR AQUI · 29 de outubro de 2026 — M3 (a entrada) construído, à espera do owner

**Estado:** o módulo da entrada está feito e testado no PC e no Xiaomi; **falta a aprovação do owner** e as abertas
**#31** (tinta da hora), **#32** (contraste ao sol, agora sem véu), **#33** (janela do O), **#34** (lâminas ao
passar/segurar, em experiência) e **#35** (escala no desktop, A vs `?escala=b`). **O M3 não está commitado.**

- Código: `src/components/entrance/` — `entrance.tsx` (HTML = estado final; sem JS lê-se), `sequence.ts` (os dois
  scripts embutidos: a porta no `<body>` e a sequência), `entrance.css`. A barra provisória (*Talk to us* · *Menu* →
  índice no colofão) fica até ao M4. +1 ficheiro de fonte (Cormorant 600, a letra-janela). Lâminas com o P&B derivado
  (`mono` em `scripts/images.mjs`).
- **Xiaomi** (5 + 3 corridas): 90,5 fps, p95 11,2 ms, 0 frames > 25 ms em todas as fases; o vídeo certo (720×1280),
  um pedido. **PC** (janela visível, 5 viewports): sequência certa, 0 erros, 0 sobreposições, sem overflow; reduced
  motion (sem vídeo), sem JS, salto por tecla, ordem do teclado, *Welcome back* (> 30 min; refresh não), hash e refresh
  a meio (sem sequência) — tudo passa.
- **Bugs encontrados e corrigidos:** a hidratação do React refazia a página (o script escrevia em elementos do React);
  no Android `document.fonts.load` falhava e a entrada ficava escura para sempre (agora nunca > 3 s); o título
  sobrepunha-se ao subtítulo a 768×1024; o zoom era cortado no E4 e deixava uma faixa escura; o véu da dedicatória
  via-se como uma oval no telemóvel; o zoom dava 48–58 fps no Xiaomi (resolvido com `will-change`).
- **Revisão do owner (29/10), corrigido:** (1) refresh no topo não repetia a entrada — a ancoragem de scroll do Chrome
  repunha a página 12 px abaixo (`overflow-anchor: none` na entrada) e, depois de uma lâmina, o `#capítulo` no endereço
  saltava a entrada (agora sai do endereço ao voltar ao topo); (2) o véu atrás do título no telemóvel era uma mancha —
  agora uma faixa a toda a largura, sem véu na dedicatória; (4) o zoom do browser não aumentava o texto (tudo em vw) —
  cada tamanho tem agora uma parte em rem (iguais a 100 %), testado a 150 % e 200 %.
- **Segunda revisão do owner (29/10), feito:** a entrada comparada com o storyboard e corrigida (README **#76**: E1 e
  E2 com o seu tempo, sem o crescimento de 1,08, vídeo nas letras sem tinta, dedicatória a 38 % no telemóvel); **o véu
  atrás das palavras saiu** (contraste em #32 — desce para ~2 : 1 de dia); **as bordas do O** ficam nítidas com uma
  camada só para o O (#33; Xiaomi zoom 88 fps, 1 frame lento no arranque); **lâminas** em experiência (#34; no
  telemóvel o menu do Android aparece ao segurar); **escala** A/B (#35); o nome das lâminas para leitores de ecrã era
  "IIArtists" — agora "II Artists". PC: bateria toda a passar.
- **Terceira revisão do owner (29/10), feito (README #77):** **regra — o storyboard manda; nada de documentos mais antigos
  por cima dele.** Tinta nunca mais clara que a do storyboard (0,35 → 0,55) e a escurecer durante o zoom (não depois,
  onde se via um filtro); escala B com o título um pouco maior (93 px a 1440×900), a A saiu; lâminas com movimento
  aprovadas e fotografias enquadradas por lâmina (`entrance.blades[].frame`). Xiaomi ronda 8: zoom 86,3 fps, 1 frame
  lento no arranque (já existia; não é da tinta). Contraste: título ~2,6 de dia (era ~2,0).
- **Ferramentas:** `D:\STUDIO-tools\v5-m3\` — `pc.mjs <out>` (PC, janela visível), `phone.mjs [runs] [query] [css]`
  (Xiaomi; `sum.mjs` resume), `contrast.mjs`, `nav.mjs`, `peek.mjs`. Xiaomi: `adb reverse tcp:3100`, `forward
  tcp:9555`; capturas com `adb exec-out screencap` (no Git Bash: `MSYS_NO_PATHCONV=1`).
- **Não verificado:** iPhone/Safari (o owner); Mi Browser e Firefox do Xiaomi; rede lenta real (4G); o telemóvel quente.

- **Quarta revisão (29/10), feito (README #78):** letra 400 como no storyboard (era 300) e letras-janela 700; contorno
  suave nas palavras; segurar uma lâmina sem o menu do Android; #32, #33, #34, #36 fechadas. Página de teste temporária
  `?teste` (hora, subtítulo, contorno) — sai quando #31 e #37 estiverem decididas.

- **Fotografias das lâminas numa rede lenta (29/10, Xiaomi, 4G lenta simulada 1,6 Mbit/s + 150 ms, sem cache, 3
  corridas):** com `loading="lazy"` chegam a 1,2–2,1 s; forçadas a carregar logo, 1,2–2,2 s — igual, porque estão no
  primeiro ecrã e o Chrome já as pede de início. O poster chega a ~0,85 s e o vídeo acaba de descarregar a ~8,1 s nas
  duas. Fica `lazy`. (`D:\STUDIO-tools\v5-m3\net.mjs`)
- **Fecho (29/10, README #79):** cores por hora aprovadas, contorno fica, subtítulo em Cormorant itálico; painel `?teste` retirado. **Sem decisões abertas no M3.**

**Testes:** registados em `docs/development/v5-tests.md` (secção M3).

**Próximo:** commit do M3 quando o owner pedir → **M4, a barra e o menu**.

---

## Sessão de 29 de outubro de 2026 — M2 feito e commitado

**Fechado no fim de 29/10 (README #75):** alt text verificado contra cada imagem; Telegram `t.me/flavius28` aceite; aura
P&B `#b8936a` aceite como ponto de partida (**não fechada**, ajusta-se se for preciso) e `on-record.png` aceite. **O site constrói-se por módulos** (entrada → barra e menu → Work → Method →
About/Questions/Contact), cada um testado por inteiro, aprovado e commitado antes do seguinte — regras no topo do
`roadmap.md`. O estado 2 (entrada → Work) passou para o módulo do Work.

**Estado numa frase:** o **M2 está feito** e a V5 foi **refeita do zero, só com o que é da V5** (README **#74**, pedido do
owner): saiu todo o código do M1 (a "secretária"), os protótipos, os media e os documentos V1–V4 — ficam no ramo `v4`.
O trabalho de 26–28/10 foi commitado e enviado (`a854a64`); o M2 também (commit a seguir, 29/10). typecheck, lint e build
passam; a página responde no `next start` (imagens e vídeo 200).

**O que existe agora:**

| O quê | Onde |
|---|---|
| Texto e fotografias, por secção | `content/v5.ts` (do *Texto aprovado* do `storyboard.md`; alt text e *Skip to content* = rascunho) |
| Tempos e escalas (#59) | `content/tuning.ts` → variáveis CSS no `<html>` (`--moment-seconds: 4s`, …) |
| Página | `src/app/page.tsx` — **esqueleto**: todas as palavras e fotografias, sem JavaScript, sem desenho ainda |
| Base CSS | `src/app/globals.css` — só a paleta, o tipo e um documento legível |
| Imagens | `src/components/picture.tsx` + `src/lib/media.ts` (larguras e tamanho de cada derivado) |
| Derivados | `npm run images` → `public/media/v5/{entrance,work,method,about}/` (fontes e origens: `assets.md` §5) |

**Por fazer nos seus marcos:** os fundos do estúdio, a luz com furo e a sombra de ecrã (M6); a imagem de partilha e o
`ColourReveal` (M7); a aura quente das fotografias P&B tem um tom inicial (`#b8936a`) a afinar no Work (M5). O ano do
colofão é o da build (estático) — passa a ser do visitante quando o Contact tiver o seu script (M7).

**Não verificado no M2:** viewports, teclado e Xiaomi — o esqueleto ainda não tem desenho; começam no M3.

**Próximo passo:** **M3 — a entrada**, medida no Xiaomi primeiro (`roadmap.md`, `acceptance.md`; risco: o véu ~120×,
plano B véu rasterizado).

---

## Sessão de 28 de outubro de 2026 (onde contradiz a secção acima, vale a de cima)

**Estado numa frase:** o desenho da V5 está **completo e aprovado até à README #73** — já não há decisões de desenho em
aberto que bloqueiem; **o próximo passo é o M2**. A sessão de 28/10 foi de desenho e de testes no Xiaomi e no PC; do site
só mudaram `content/v5.ts` (o `ig.me` marcado como verificado) e `eslint.config.mjs` (ignora `media-src/`). **Nada de 26,
27 e 28/10 está commitado** — o último commit continua a ser `edd7c81`; commit só quando o owner pedir (recomendado fazê-lo
no início da próxima sessão, se ele quiser). typecheck, lint e build passavam no fim do dia.

**Ler, por esta ordem:** `CLAUDE.md` → `docs/design/v5/README.md` (**#64–#73** e a lista de abertas) → esta secção →
`storyboard.md` (secção *O menu*). O owner tem poucos tokens: ir direto ao que ele pedir, sem rever o que está fechado.

### O que se decidiu a 28/10 (detalhe, valores e medições na README)

- **#69 — o vidro:** vidro ao vivo estilo iOS com **lente**, desfoque **8 no telemóvel × 1,6 no desktop**, **tinta sempre
  linho**, **vidro sempre escuro** (nunca passa a claro), escuro adaptável ao que está por trás. **Menu de ecrã inteiro**;
  a **gota** nasce na ponta direita da ilha do menu e cresce por **`transform: scale`** (nunca `clip-path` animado num
  elemento com `backdrop-filter`: flicks gravados no Xiaomi). Sem lente no menu (custava ~45 fps).
- **#70 — E4 sem a ilha do nome:** o título *CHAPTER ONE* já é o nome; a ilha *Chapter One | 01 Work* entra com o Work.
- **#71 — a barra é a A2:** duas ilhas **sempre lá**, **discretas** (só desfoque e escuro, fio de luz de 0,5 px, sem brilho
  nem sombra), **mais pequenas** (44 px telemóvel / 48 px desktop) com as bordas nas margens da página, **mais ar** até ao
  conteúdo (44 / 64 px); o escuro mede-se **só por baixo das palavras**, máximo **.50**, e sobre papel claro as palavras
  ganham sombra escura. **Fechada pelo owner:** "não vale a pena afinar mais — se for preciso altera-se no site real".
- **#72 — revisão de ponta a ponta:** *Talk to us* → **`https://ig.me/m/chapterone.studio.pt`** (testado pelo owner no
  Xiaomi; falta o iPhone) — fecha a #7; **refresh a meio da página fica no lugar** — fecha a #30; **o vidro por cima do
  vídeo da entrada não custa nada no Xiaomi** (90,4–90,5 fps, p95 11,2 ms); contraste da palavra que enche 8,4–9,9:1;
  o vidro do menu deve ser **preparado antes do primeiro toque** (a primeira abertura tem um frame de 88–94 ms).
- **#73 — o Work:** a **passagem de capítulo é a atual, como está no storyboard** — fecha a #28; **o ritmo dos momentos é um
  só tempo, 4 s** (a palavra enche em 4 s e passa ao seguinte; foto 1,2 + peça 2,8 s); **os momentos por acender ficam a
  .38** (3,1:1 — escolha consciente do owner).
- **Regra do owner (memória):** avaliar **sempre visualmente no PC (janela de Chrome visível) e no Xiaomi**; headless só
  para números. Exceção dada a 28/10: o storyboard não precisa de ser visto no Xiaomi.

### Onde está tudo

| O quê | Onde |
|---|---|
| Storyboard principal | https://claude.ai/artifact/9vkDx379vuwuiaXre62cxz — **versão 41**; fonte `docs/design/v5/storyboards/storyboard-principal.html` = `media-src/storyboards-2026-10-25/work-method-storyboard.html` (SHA-1 `35b4a885…`, iguais). Tem o aspeto da A2 nas barras, **com os tamanhos antigos** |
| **Referência da barra (A2)** | `D:\STUDIO-tools\glass-test-1027\composicao.html` (abre na A2; cópia congelada `composicao-aprovada-2810.html`; `?video=1` com o vídeo real) |
| Referência do vidro e do menu | `D:\STUDIO-tools\glass-test-1027\index.html` (cópia `index-aprovado-2810.html`) |
| O Work a funcionar (passagens A–D, ritmos, contraste) | `D:\STUDIO-tools\glass-test-1027\work-passagem.html` |
| Teste do *Talk to us* | `D:\STUDIO-tools\glass-test-1027\igme.html` |
| Ferramentas de teste (Xiaomi e PC) | `D:\STUDIO-tools\glass-test-1027\tools\` — **ler o `README.md` dessa pasta** (como servir, ligar o Xiaomi, medir, gravar) |

### O que fica para o site real (registado; não reabrir no protótipo)

- A barra (#71): valores finos do escuro, contraste das palavras calculado, o brilho do vídeo por trás das ilhas, a
  deteção do conteúdo por baixo de cada ilha, a lente refeita quando a ilha muda de tamanho.
- O menu: números com algarismos alinhados (`lining-nums tabular-nums`; confirmar no Cormorant), o conteúdo do storyboard
  (secção atual em itálico com ponto, *Hello, Ana.*, *Talk to us* → `ig.me`, contactos, a hora, *Close*), `<dialog>`,
  foco, Esc, reduced motion; **preparar o vidro antes do primeiro toque**.
- **Riscos a medir nos seus marcos:** E3 (o véu escala ~120×; plano B: véu rasterizado) no M3; o Method (mais camadas) no
  M5; **o escuro adaptável das ilhas — risco real** (alternativa: um valor fixo por secção, como nos quadros).
- Ainda abertos mas pequenos: #13 (alturas presas e escalas — o ritmo já está), #24/#54 (TikTok e email quando existirem;
  pôr um exemplo), #8 (organizar os ficheiros — é o M2). Testar o `ig.me` no iPhone (o owner).

### Próximo passo

1. **M2** (autorizado): assets em `media-src/` (SHA-1; nada na V4) → derivados (`assets.md` §7) → texto aprovado no
   `content/v5.ts` (linhas das peças, *On record*, *Talk to us* → `ig.me`) + **`content/tuning.ts`** (#59; o ritmo de 4 s,
   a passagem 1,2 s / 0,65 s / 1 s) → **mostrar ao owner a lista exata do código da "secretária" antes de apagar** →
   typecheck, lint, build.
2. Depois **M3 — a entrada**, medida no Xiaomi primeiro (`acceptance.md`).

### Processos

No fim da sessão de 28/10 ficaram parados o servidor da porta 3200 e as ligações ADB (`adb reverse`/`forward` removidos).
Se for preciso: ver o `README.md` das ferramentas.

---

## Sessão de 27 de outubro de 2026 (onde contradiz a secção acima, vale a de cima)

**Estado:** sessão de desenho e de um teste no Xiaomi; **nenhum código do site mudou**. O desenho aprovado vai agora até
à **README #68**. **Nada de 26/10 nem de 27/10 está commitado**; o último commit continua a ser `edd7c81`. Commit só
quando o owner pedir.

**Ler, por esta ordem:** `CLAUDE.md` (revisto a 27/10: sem proibições técnicas, ver #68) → `docs/design/v5/README.md`
(#64–#68 e as abertas **#28–#30**) → `storyboard.md` (secção *O menu*, reescrita) → esta secção.

**Storyboards:**
- **Principal:** https://claude.ai/artifact/9vkDx379vuwuiaXre62cxz — **versão 34**. Fonte `storyboard-principal.html`
  = `media-src/storyboards-2026-10-25/work-method-storyboard.html` (SHA-1 `c7cc0d0e…`, iguais).
- **A barra e o menu (decisão #67 e aberta #29):** https://claude.ai/artifact/5A9tEMEjWvBCWCNLCgH4CQ — versão 6,
  fonte `storyboards/barra-marca.html` (tem no topo um quadro "Estado a 27 de outubro").

**O que se decidiu a 27/10 (detalhe na README):**
- **E4 = estado 1** (#64): no fim da entrada ficam a dedicatória (no topo) e as três lâminas com fotografias.
- **As passagens partem do quadro final aprovado** (#65): 11 → 12 (o Method sai por ordem: *Talk to us*, passos, ecrãs,
  frase; a luz fica e o retrato abre-se nela) e 14 → 15 (o papel das Questions sobe como um cartão sobre o About).
  Aprovadas pelo owner ("parece tudo bem").
- **A entrada e o regresso** (#66): a entrada corre uma vez por carregamento (um refresh no topo mostra-a); o E4 é o
  topo da página; *Welcome back* só se a última visita foi há mais de 30 min, sempre *second chapter*, sem prazo.
- **A barra** (#67): *Chapter One | 03 About* (variante A) em desktop e telemóvel; **clicar no nome mostra a entrada
  outra vez**; botão no telemóvel = três traços 100/70/85 % sem palavra que viram X; desktop mantém a palavra *Menu*;
  abertura = **a gota**; números do menu maiores (~0,42 da palavra), sombra no texto. **Já no storyboard principal.**
- **A performance pesa-se, nada é proibido** (#68): saíram as proibições (WebGL, `backdrop-filter`, filtros, ≤ 6
  camadas…). Diz-se o risco, constrói-se, e o veredito é a medição no Xiaomi. Revistos `CLAUDE.md`,
  `interactions.md` §0, `acceptance.md`.
- Outras mudanças no storyboard principal: painel do topo = **o site inteiro em movimento** (E1 → 21, ~70 s, com as
  passagens); controlos recolhidos num botão *Controlos* no telemóvel; seis correções visuais pequenas (E3, barra do
  Contact, rótulos, *For Ana.* só com nome, nota do 21, controlos por cima da barra).

**Próximo passo (por ordem):**
1. **Aberta #29 — o vidro da barra e do menu.** O owner prefere vidro ao vivo estilo iOS, desfoque 8, com lente, mas
   disse ao sair: **"a barra não se está a adaptar bem a todas as situações"**. Começar por perguntar em que situações
   (ou rever caso a caso no Xiaomi: fotografias claras do Work, retrato do About, papel do Method/Questions, vídeo da
   entrada, passagens entre secções). Afinar no teste do Xiaomi e no `barra-marca.html`; só depois levar o vidro para o
   storyboard principal (que ainda mostra o vidro preparado antigo no menu).
2. Aberta #28 — a passagem de capítulo no Work (continua por aprovar).
3. Aberta #30 — refresh a meio da página (recomendado: fica no lugar).
4. Depois, **M2** (autorizado): assets → derivados → `content/v5.ts` + `content/tuning.ts` → **mostrar a lista exata do
   código da "secretária" antes de apagar** → typecheck, lint, build.

**O teste do vidro no Xiaomi** (`D:\STUDIO-tools\glass-test-1027`, fora do repositório):
- `index.html` — página com as secções reais, a barra e o menu; `?glass=ioslens|ios|none&blur=6|8|10&soft=0|1`;
  painel de botões e contador de fps no ecrã.
- Servir: `python -m http.server 3200 --bind 127.0.0.1` nessa pasta; `adb reverse tcp:3200 tcp:3200`;
  `adb forward tcp:9555 localabstract:chrome_devtools_remote`; abrir `http://localhost:3200/?glass=ioslens&blur=8` no
  Chrome do Xiaomi (`am start -a android.intent.action.VIEW -d … -p com.android.chrome`).
- `run.mjs` (medição: scroll da página inteira + abrir/fechar o menu, `node --experimental-websocket run.mjs 3 none,ioslens:8`),
  `cap.mjs` + `adb exec-out screencap -p` (capturas do ecrã real — **não usar `Page.captureScreenshot` para o vidro**:
  não mostrava o desfoque do menu), `shots/` com as capturas, `results-*.json`.
- **Medições (Chrome 155, 90 Hz):** sem vidro 89–90 fps; iOS refinado 8 → 87 fps; iOS + lente 8 → 86–87 fps; p95
  11,2 ms em todos; o menu tem 1–2 frames lentos por abertura (≤ 44–55 ms). Não medido: scroll com fling, telemóvel
  quente, Mi Browser/Firefox, iPhone, o site completo com vídeo.
- **Lição técnica:** um `clip-path` (a gota) torna o elemento uma *Backdrop Root* — o `backdrop-filter` tem de estar no
  mesmo elemento, não num filho. As primeiras medições do menu (antes da correção) não valem.

**Processos que podem ter ficado a correr:** o servidor Python do teste na porta 3200 (parar: identificar o PID na porta
3200 e confirmar que a linha de comando é `http.server 3200`); o servidor ADB.

---

## Sessão de 26 de outubro de 2026 (onde contradiz a secção acima, vale a de cima)

**Estado:** o desenho da página V5 está aprovado (README **#19–#63**). A sessão de 26/10 foi só de desenho, toda no
**Work**; não há código novo. **Nada de 26/10 está commitado** (`git status`: 8 ficheiros modificados em `docs/` e 3
storyboards novos em `docs/design/v5/storyboards/`); o último commit continua a ser `edd7c81`. Commit só quando o
owner pedir.

**Ler, por esta ordem:**
1. `CLAUDE.md` (V5) — regras.
2. `docs/design/v5/README.md` — decisões #1–#63 e a lista de abertas (no fim).
3. **`docs/design/v5/storyboard.md`** — a especificação estado a estado e **todo o texto aprovado** (inclui as 25
   linhas das peças do Work).
4. `interactions.md` §0, `assets.md` §7, `roadmap.md` (M2–M8), `acceptance.md`.

**Storyboards** (privados, do owner; fontes em `docs/design/v5/storyboards/`, imagens em
`media-src/storyboards-2026-10-25/img/` e numa cópia local git-ignorada em `docs/design/v5/storyboards/img/`):
- **Principal (a referência):** https://claude.ai/artifact/9vkDx379vuwuiaXre62cxz — versão 28, com todo o Work de 26/10.
  Fonte `storyboard-principal.html` = `media-src/storyboards-2026-10-25/work-method-storyboard.html` (iguais por SHA-1).
- Decisão #60 (linhas das peças): https://claude.ai/artifact/1SyUrVinmfSgGASdZzG16E (`linhas-das-pecas.html`).
- Decisão #61 (Work sem sublinhados, palavra que enche): https://claude.ai/artifact/FApw8RKTQhXoJFhhSAHs2q (`work.html`).
- Decisão #62 (capítulos: o título é a navegação): https://claude.ai/artifact/7hELbfAYN2P6zxsdRdNMuS (`work-capitulos.html`).
  Os três ficam como histórico das decisões; o owner pode pedir para os apagar.

**O que se decidiu a 26/10 (detalhe no README):**
- **#3 fechada:** as 25 linhas das peças, aprovadas uma a uma (tabela em `storyboard.md`).
- **#59:** texto e fotografias em `content/v5.ts`, tempos e escalas em `content/tuning.ts` — só o que vale a pena
  mexer, sem sistema de configuração (monta-se no M2).
- **#60:** desktop mostra a linha de todas as peças; telemóvel uma de cada vez, aberta debaixo do nome escolhido; a peça
  mostrada na fotografia é sempre a primeira da lista.
- **#61:** sem sublinhado nos capítulos; filetes entre as peças ficam; **a palavra do momento enche-se com o tom das
  fotografias do capítulo** (passados apagados; sem linha por baixo); depois do último momento volta ao primeiro — o
  capítulo só muda com o scroll.
- **#62:** sem separadores debaixo da barra — **o título é a navegação**: capítulo atual grande, sempre à esquerda,
  numeral do tamanho da palavra; no telemóvel, à direita do título, o seguinte maior (o único tocável, 44 px de toque,
  ciclo I → II → III → I) e o outro mais pequeno por cima. O Work começa sempre em Weddings salvo lâmina escolhida.
- **#63:** Artists passa a *Always · For a moment · **On record*** (o texto antigo não cabia numa linha no telemóvel); um
  nome de momento nunca parte em duas linhas.

**Próximo passo:**
1. **Aberta #28 — a passagem de capítulo no Work.** O owner "ainda não adora" ("bruscas ao carregar os elementos"). Há
   uma versão mais suave no storyboard principal (o Work a funcionar e o painel *Em movimento* 4→5→6); perguntar se
   agora está bem ou o que afinar (velocidade, ordem, título).
2. Depois, **M2** (autorizado): assets em `media-src/` (SHA-1, nada na V4) → derivados (`assets.md` §7) → texto aprovado
   no `content/v5.ts` (com as linhas das peças e *On record*) + `content/tuning.ts` (#59) → **mostrar ao owner a lista
   exata do código da "secretária" a apagar, antes de apagar** → typecheck, lint, build. Depois M3 (entrada, medida no
   Xiaomi primeiro).

**Em aberto:** #28 passagem de capítulo · #7 teste do `ig.me` · #54 TikTok e email quando existirem · #13 ritmos e
escalas finas no protótipo · contraste dos três tons da palavra que enche (medir) · a passagem e o FLIP medidos no
Xiaomi.

**Como verificar os storyboards localmente** (usado a 26/10): Chrome em
`C:/Program Files/Google/Chrome/Application/chrome.exe` com `playwright-core` de
`D:\STUDIO-tools\browser-automation\node_modules` (`chromium.launch({ executablePath, headless: true })`), abrir
`file:///D:/STUDIO-v5/docs/design/v5/storyboards/<ficheiro>.html`; para o tamanho real do telemóvel, forçar o quadro
a 390 px (`#run-phone{width:390px}`). Os quadros usam `cqw`, por isso medem-se assim.

**Onde está o quê:** V5 em `D:\STUDIO-v5` (branch `v5`); V4 em `D:\STUDIO` (branch `v4`, **não tocar**: tem
staging do owner). **A branch `v5` não se abre com `git checkout v5` em `D:\STUDIO`** — está aberta na pasta
`D:\STUDIO-v5` (é uma *worktree*); abre-se essa pasta no editor. ADB/Xiaomi `c3e8fb35`; ffmpeg e ferramentas como
na secção de 24/10 abaixo.

---

## Sessão de 24 de outubro de 2026 (onde contradiz a secção acima, vale a de cima)

Quando o owner disser **"vamos começar a trabalhar"**:

1. Ler, por esta ordem: `CLAUDE.md` (V5) → `docs/design/v5/README.md` (decisões e abertas) →
   `direction.md` → `pages.md` → `interactions.md` → `assets.md` → `roadmap.md` → `acceptance.md`.
2. Confirmar o estado (abaixo) com `git status` nas duas worktrees — **a V4 não se toca**.
3. Começar pelo **`roadmap.md` M2** (preparação: uma pergunta curta ao owner + organizar assets +
   derivados + limpeza do código da "secretária") e seguir para **M3 — Entrada "Através das letras"**,
   **medida no Xiaomi antes de afinar o visual**.

### Onde está tudo

| O quê | Onde |
|---|---|
| Worktree V5 | `D:\STUDIO-v5`, branch `v5` (local, sem upstream), HEAD `fe1bd33` — **nada commitado** |
| V4 (não tocar) | `D:\STUDIO`, branch `v4`, `fe1bd33`; 4 ficheiros modificados, fotografias e 7 PNG IA **em staging pelo owner**, `docs/design/v4/` e 302/192 fora do Git |
| Produção | `master` = `fe1bd33` = site original (studio-pi-ivory.vercel.app) — inalterada |
| Decisões | `docs/design/v5/README.md` |
| Vídeo (encodes de teste) | `D:\STUDIO-v5\media-src\video\test-encodes\` (fora do Git) |
| Fotografias Weddings | `D:\Pessoal\myairbridge-o0RmwZNCc5y\Solteiros\` (só leitura): 002, 154, 343 |
| Imagens IA | `D:\STUDIO\public\media\new\*.png` (7; mapa em `assets.md` §3) |
| Folhas de contacto / refs | `docs/design/v5/research/` |
| ffmpeg | `C:\Users\35191\AppData\Local\Cypress\Cache\15.8.1\Cypress\resources\app\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe` |
| ADB / Xiaomi | `D:\STUDIO-tools\android-sdk\platform-tools\adb.exe`, serial `c3e8fb35` |

### Estado do código V5 (fim da sessão)

- Compila: `tsc`, `eslint --max-warnings 0` e `next build` a 0 (última corrida 24/10).
- O que está em `src/` é a **M1 revisão ("secretária")** — **não** é a direção aprovada. Reaproveitar só
  `Picture`, `ColourReveal`, `Develop`, o padrão de `DeskDepth` (para as lâminas), `Drawing` (base dos
  esboços), `content/v5.ts`, `src/fonts/index.ts` (fontes A aprovadas), `scripts/images.mjs`.
- Rotas `/weddings`, `/artists`, `/experiences` são marcadores → **remover** (página única).
- `public/media/v5/` tem derivados do M1 (302, 157, main, 024, 335, 347, art, method, lamp) — limpar os
  que não forem usados.

### Processos que podem estar a correr (desta sessão)

- `next start -p 3100` da V5 (último PID visto: 29156). Parar: identificar o PID na porta 3100 e
  confirmar que a linha de comando contém `D:\STUDIO-v5` antes de terminar.
- Chrome de validação com perfil próprio `D:\STUDIO-tools\browser-automation\chrome-profile` e CDP na
  porta **9222** (fecha-se sozinho por vezes; relançar com
  `chrome.exe --remote-debugging-port=9222 --user-data-dir="D:\STUDIO-tools\browser-automation\chrome-profile" --no-first-run about:blank`).
  O controlador `control.mjs` está fixo em `:3000`; para a V5 usar scripts próprios com
  `playwright-core` de `D:\STUDIO-tools\browser-automation\node_modules` (ligar por `connectOverCDP`,
  **não** chamar `browser.close()` — fecha o Chrome; terminar com `process.exit(0)`).
- Servidor ADB (`adb devices` arrancou-o).

### Decisões abertas a tratar no M2 (uma pergunta curta) — **respondidas a 25/10 (README #19–#21)**

1. Direitos do vídeo `hero_demo*`.
2. Subtítulo sob CHAPTER ONE (frase do estúdio vs. tagline original).
3. Numeração das secções no menu (Entrada fora da numeração?).
Depois, ao longo dos marcos: linhas das peças, momentos de Artists/Experiences, texto do About, escolha
do Method, teste do `ig.me`, cor do capítulo Weddings.

### O que o owner já aprovou nesta sessão (resumo — detalhe no README)

Direção "First Page" (nova, não evolução do original) · paleta carvão/musgo/linho/pedra · tipografia A ·
entrada "Através das letras" com o vídeo do original recodificado · página única · Work uniforme por
camadas · Weddings com Solteiros 002/154/343 (P&B) · Artists/Experiences com as imagens IA entregues ·
Method com três opções isoladas para escolher · About · navegação no estilo V4 · alvo Xiaomi sem lag.

---

## Registo anterior (resumo)

- **M0 (24/10)**: worktree e branch criadas; `npm ci`; `sharp` declarado; código V1–V4 removido na V5;
  documentação de autoridade inicial; 14 fotografias copiadas para `media-src/helder-couto/`.
- **M1 (24/10)**: homepage em papel + comparação tipográfica (A escolhida) — rejeitada como estática.
- **M1 revisão (24/10)**: "a secretária sob a lâmpada" — rejeitada; ver `docs/design/v5/history.md`.
- **Sessão final (24/10)**: direção "First Page" definida e aprovada; vídeo avaliado/recodificado;
  Solteiros analisada; imagens IA entregues; documentação completa (este ficheiro e `docs/design/v5/`).
