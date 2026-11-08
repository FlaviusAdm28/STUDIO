# Chapter One V5 — handoff

## ▶ COMEÇAR AQUI · 8 de novembro de 2026 — o telemóvel de volta ao `ad808d9` (por validar no iOS); desktop aprovado

**Estado (não commitado):** branch `v5-cloud-about`, último commit `addc06d`. Por cima dele, na árvore de trabalho, o **telemóvel volta
ao comportamento de `ad808d9`** e o **desktop fica como em `addc06d`** (aprovado pelo owner, 8/11). Ficheiros: `method-stage.ts` (no
telemóvel `data-near` até 0,7 ecrã e a passagem do 7 volta a ser apressada por um gesto; no desktop 0,2 e sem apressar) e `method.css`
(a regra da paragem separada: `@media (min-width: 900px)` a nova, por secção e com `data-free`; `@media (max-width: 899px)` a de
`ad808d9`, com `.m-leaving`). Build feita e servidor a correr (`next start -p 3100`, proxy 3130); typecheck e lint passam.

**Próximos passos, por ordem:**
1. **O owner valida o iOS** (`http://192.168.1.7:3130/`): deve estar como antes do `addc06d` ("as transições com pausa estão bem").
   Se sim: registar em `v5-tests.md`, **commit** e o owner faz **push** (GitHub Desktop; a linha de comandos do Mac não tem a sessão do
   FlaviusAdm28). Commits de 7/11 ainda por enviar: `34b0f73` … `addc06d`.
2. **Investigar no iOS, sem estragar o resto** (ficaram de volta no telemóvel):
   - **Preso em Experiences** ao voltar depressa pelo Method: a paragem (`scroll-snap-type: y mandatory`) fica ligada em Experiences
     (`data-near` até 0,7 ecrã e `.m-leaving` enquanto a luz recua) e a marca de Experiences é a única ali → cada gesto para cima volta a
     ela. Reproduzido no Simulador (400 px para cima, 0 px). A correção do `addc06d` (near 0,2, sem `.m-leaving`, regra por secção)
     resolveu-o no Simulador e no Xiaomi, mas **partiu o Method no iPhone do owner** (vídeo
     `docs/development/ios-lab/out/2026-11-08T00-16-21-ScreenRecording_11-08-2026_00-15-47_1.mp4` — por analisar; a pasta `out/` é ignorada pelo git, o vídeo só existe neste Mac). Suspeitas: a regra por `data-section`
     (o `data-section` do iOS muda com a barra/IntersectionObserver e pode desligar a paragem a meio), ou a passagem sem apressar.
     Testar uma coisa de cada vez no iPhone.
   - **A passagem da luz cortada:** um gesto durante a passagem do 7 apressa-a (0,3 s) e salta para o 8a.
3. Depois: Questions e Contact (M7), validação final (M8).

**Bugs relatados pelo owner e ainda em aberto (8/11, por esta ordem de prioridade):**

| # | Onde | O que o owner viu | O que se sabe |
|---|---|---|---|
| A | iOS, telemóvel | A andar rápido para trás pelo Method, **fica preso em Experiences** (escuro) e não volta mais para trás, mesmo com scroll. | Reproduzido no Simulador: a paragem por fase fica ligada em Experiences e a única marca ali puxa cada gesto de volta. Corrigido no `addc06d` (Simulador e Xiaomi OK), mas no iPhone isso partiu o Method (C) e foi revertido no telemóvel. |
| B | iOS, telemóvel | De Experiences para o Method, rápido e a continuar o scroll: **a passagem da luz (7) é cortada** e vai logo para o 8a. | Um gesto durante a passagem apressa-a (0,3 s, regra de 3/11). No `addc06d` deixou de apressar (o 8a espera a luz); revertido no telemóvel com o resto. |
| C | iOS, telemóvel | Com o `addc06d`, "ficou simplesmente partido o Method de novo". | Vídeo `docs/development/ios-lab/out/2026-11-08T00-16-21-ScreenRecording_11-08-2026_00-15-47_1.mp4` (só neste Mac), por analisar. Suspeitas: a regra da paragem por `data-section` (no iOS pode mudar a meio do gesto e desligar/ligar a paragem), a passagem sem apressar, o `data-free` do About. |
| D | telemóvel | "Temos um passo a mais no mobile, no storyboard não é assim." | O 8 do storyboard é um estado; no site são três passos (8a, 8b, 8c: uma folha de cada vez), e com a paragem por fase são três paragens. Proposta feita e ainda sem resposta: o 8 numa só paragem, as três folhas a levantarem-se seguidas. |
| E | todos | (por confirmar) As lentidões que já existiam: ~100–120 ms ao disparar o 7 no Xiaomi; ~105 ms ao passar o O da entrada no Safari; a 1.ª descodificação do estúdio a 1920 (592 ms). | Medidos em 7/11; não são regressões. |

Resolvidos e aprovados em 7/11: as bordas da ilha no Method e no About; a entrada à espera do vídeo; os bugs 1–3 e 6–12 de 6/11; o
ecrã em destaque sempre o do casamento (#105); no desktop o 11 e o 10 sem passar, a capa do 10 sem risco, a paragem por fase (aprovado).

**Ferramentas desta sessão (Mac):** consola remota (`curl --data-binary 'js' localhost:3130/__diag/run`), `?autorec=<s>`, `lab6`; scripts
no scratchpad da sessão (temporários): `journey.js` (percurso inteiro com fita), `xi/trans.mjs` + `xi/ssim.sh` (comparação transição a
transição entre duas builds), `xi/strokes.json` (gestos de toque no Xiaomi por CDP), `xi/wheel.mjs` (gestos de trackpad no Chrome).
Tudo descrito em `docs/development/ios-lab/README.md` §5b e em `v5-tests.md` (secções de 7/11).

## ▶ COMEÇAR AQUI · 7 de novembro de 2026, noite (MacBook) — bordas do Method no iPhone: palco preso + espelho; entrada espera o vídeo

**Estado:** sem commit. Alterado: `method.css` (bloco iOS: `.m-mirror` no lugar do `-webkit-box-reflect`), `method.tsx` (o `.m-mirror`),
`method-stage.ts` (iOS: a cor das bordas na ida só quando a luz cobre os quatro cantos), `entrance/sequence.ts` (a câmara espera o vídeo
a tocar, ≤ 2,5 s). Tudo medido no Simulador (iOS 27.3) e o porquê em `docs/development/ios-lab/README.md` §5b. Descoberta: o que
impedia a cena de chegar à ilha era o reflexo, não o sticky; o palco segurado em fluxo tremia com dedo rápido (lab6) e saiu.
**Confirmado:** iPhone do owner ("parece resolvido"); Xiaomi sem regressão (A/B); desktop Chrome 1920/1440 e Safari (ios-lab
README §5b). **Falta:** registar em `v5-tests.md` antes do commit. Os bugs
de 6/11 que restam (About ao recuar, 9 frase do 11, 3 palavras do 7, 1 etiqueta, 2 retângulo) continuam abaixo.

## ▶ COMEÇAR AQUI · 7 de novembro de 2026 — bordas (passo 1): o que o iPhone provou, tentativa revertida

**Estado:** código igual a `1cb418c` (nada novo no site). PC agora em **192.168.1.2** (proxy do iPhone `http://192.168.1.2:3130`).

**Medido no iPhone do owner com páginas de teste** (`D:\STUDIO-tools\v5-m5\ios\lab2–4.html`, servidas pelo proxy em `/__diag/lab2..4`,
com botão 📎 para enviar vídeos; html/body magenta de propósito; fotogramas em `D:\STUDIO-tools\v5-m7\edges-1107\`):
- Só o **conteúdo em fluxo** (que corre com a página) é desenhado por trás da ilha e por baixo da barra de baixo. **Sticky e fixed são
  cortados** e o Safari pinta essas faixas com a cor do html/body. A "subida" de 70 px dos palcos (`--m-lift`, `--a-lift`, a do Work)
  **nunca chegou à ilha**; no Work parecia funcionar porque o html tem a cor do fundo.
- Um palco **em fluxo segurado por uma animação de scroll em CSS** (`view-timeline`, `animation-range: contain 0% contain
  calc(0% + Lpx)`) chega à ilha e fica parado (0–1 px). Segurado por JS treme 12–44 px.

**Tentativa no Method (7/11), revertida no mesmo dia** (patch guardado no scratchpad da sessão, `method-in-flow-1107.patch` + `leap.ts`):
o palco do Method em fluxo nos telemóveis. Xiaomi: certo (posição igual ao sticky, 0 px; saltos do site marcados com `data-leap` →
sticky enquanto aterram, sem clarão; custo: subir depressa 67–70 → 59–62 fps, fling para cima 53 → 43). **iPhone: partido** —
(1) a margem negativa da subida colapsava com a da secção (corrigido com `top` relativo); (2) **os cartões e as palavras deixam de ser
desenhados enquanto se faz scroll** (camadas animadas dentro de um palco movido por animação de scroll — só a sala aparece);
(3) **a faixa da ilha continua escura**: a barra e o menu são `position: fixed` junto ao topo, e o Safari usa-os para pintar a faixa
(o lab4 não tinha nada fixo).

**Depois (mesmo dia):** o lab5 no iPhone mostrou que nem os cartões animados nem a barra fixa estragam a técnica. No site, com
interruptores do painel de testes: **a faixa escura sob a ilha era o `-webkit-box-reflect`** do estúdio (sem ele, a ilha mostra o estúdio
e o 9 sobe por trás dela). Os cartões e as palavras **somem quando as animações acabam**; o teste das camadas próprias (`flowlayers`)
ficou pronto mas por correr. No Android as barras do Chrome são opacas: seguem a cena por theme-color (decisão do owner, 7/11).

**A continuação passa para o MacBook (Simulador de iOS): tudo em `docs/development/ios-lab/README.md`** — o que está provado, a
tentativa (patch), as ferramentas (proxy, painel, páginas de teste, agora no repo), como montar o Simulador e os próximos passos.

**Xiaomi:** as páginas de teste mantêm o ecrã ligado (Wake Lock); o site pelo proxy também, com `?wake` no endereço
(`http://localhost:3130/?wake`, com `adb reverse tcp:3130`). Toques por adb são recusados pelo MIUI: usar gestos por CDP
(`Input.synthesizeScrollGesture`). Scripts: `D:\STUDIO-tools\v5-m7\edges-1107\` (`route.mjs`, `jumps.mjs`, `fps.mjs`, `hold.mjs`).

## ▶ COMEÇAR AQUI · 6 de novembro de 2026 — bugs do iPhone registados pelo owner (por corrigir)

**Estado:** branch `v5-cloud-about` em `1cb418c` (puxado a 6/11), sem alterações de código. Servidor `next start -p 3100`, proxy do
iPhone `http://192.168.1.244:3130` (o IP do PC mudou; já não é `.223`). Nada foi corrigido: o owner pediu primeiro a lista.

**Fonte:** gravação do iPhone do owner, 6/11 17:20, 50 s:
`D:\STUDIO-tools\v5-m5\ios\out\2026-11-06T17-22-07-ScreenRecording_11-06-2026_17-20-44_1.mp4`. Frames a 2 por segundo, com
tempo, e os momentos ampliados: `D:\STUDIO-tools\v5-m7\ios-bugs-1106\` (`sheet_01–10.jpg`, `A/B/C.jpg`). O percurso: Work (Experiences)
→ 7 → recuo ao Work → 7 → 8 → 9 → 10 → 11 → 12 → 13 → recuo ao 11 → 13 → recuo ao 11 → 13 → 14.

**Princípio que orienta todas as correções (owner, 6/11):** no Safari do iOS o site é **totalmente ecrã inteiro** — os elementos ocupam o
ecrã todo, **incluindo a zona da ilha** e a faixa de baixo — e **nada é fabricado** (nenhuma cor ou faixa inventada para imitar o que
está desenhado; mostra-se o que está realmente lá, como antes), a menos que seja mesmo necessário. Uma cor "lida" e aplicada à borda é
fabricada; o preferível é que a própria imagem/cena chegue lá.

**Confirmados pelo owner (a corrigir):**

| # | Tempo | O que se vê | Observação do owner |
|---|---|---|---|
| 1 | 0:01.5, 0:04.2, 0:39.2 | A etiqueta da barra muda antes da cena: *02 Method* com o Work ainda no ecrã inteiro; a subir *01 Work* com a luz do Method a cobrir tudo; *02 Method* com o retrato do About à vista. | Correto. |
| 2 | 0:02.0 | Na passagem Work → 7 aparece um **retângulo cinzento mais claro no canto inferior esquerdo**. A faixa do topo (ilha) fica escura enquanto a luz já atravessa. | O retângulo em baixo é bug. Em cima não é "mudar cedo": a faixa do topo deve **acompanhar a luz do lado que ela já atravessou** e o outro lado continuar como está (ecrã inteiro: a luz passa por trás da ilha como no resto do ecrã). |
| 3 | 0:19.5 | No 8 → 9, enquanto o cartão de Weddings cresce para ecrã inteiro, *No templates. No copies.* e *Make it yours* ficam visíveis em fantasma sobre a fotografia. | Sim — os tempos têm de ser melhorados (as palavras do 7 saem antes de o cartão as cobrir). |
| 6 | 0:23.0 | No 10 → 11 a faixa do topo fica escura enquanto a página ainda está bege. | Correto. Os elementos ocupam o ecrã todo, incluindo a ilha; o escuro do 11 deve chegar ao topo porque a cena chega lá, não por uma cor aplicada. |
| 7 | 0:31.0–31.6, 0:38.3–39.2 | A voltar do 13 para o 12/11, o retrato perde o oval suave e fica um **retângulo de arestas duras** com uma faixa escura por cima, abaixo da barra; depois corta para escuro. | Certo. |
| 8 | 0:39.2 | Durante esse recuo, *I'm Flávio.* aparece por cima da fotografia, à esquerda. | Sim. |
| 9 | 0:32.5 → 33.0, 0:40.0 → 41.0 | Ao voltar ao 11, *Made once, for one moment* e os quatro passos aparecem mais acima e descem ~35 px de uma vez (coincide com a barra do Safari a recolher). | Certo. |
| 10 | 0:45.6 | No 13 → 14 o crédito *Portrait — Helder Couto · Hold for colour* desenha-se sobre a fotografia, que também fica retângulo duro; *I'm Flávio.* sem o itálico por baixo. | Certo. |
| 11 | 0:46.0–46.5 | A faixa de baixo do Safari fica **cinzenta clara** com a página escura (parece a cor do céu do retrato). | Certo. |
| 12 | 0:46.5 → 47.0 | O topo do 14 não fica estável: a fotografia ora começa abaixo da barra (topo escuro), ora sobe atrás da ilha; aos 0:47.0 o crédito fica colado à orla da fotografia. | Certo. |

**Não são bugs (owner):** 4 — a passagem 9 → 10 (o *RSVP* e a faixa do título a separarem-se da fotografia): "não vejo problema na
animação". 5 — o cartão do 10 a chegar com a fotografia e o título meio segundo depois: "está bem".

**Leitura técnica (hipóteses, por confirmar antes de mexer):**
- 2 (topo), 6, 11, 12 tocam no commit `1cb418c` (`src/lib/top-colour.ts`, `sequence.ts`, `method-stage.ts`, `about-stage.ts`): a borda é
  uma cor lida e aplicada (um valor por vez em `html`/`body`), por isso não pode acompanhar uma luz que atravessa o topo de um lado só, e
  no Safari 26+ uma só cor serve o topo e o fundo (11). O caminho do princípio acima é o que funcionou a 1/11 (memória
  `ios-safari-edge-colour`): as cenas presas sobem atrás da ilha (`--m-lift`, `--a-lift`, 70 px) e o que se vê no topo é a própria cena;
  a cor de `html`/`body` só como reserva onde a cena não chega.
- 7, 8, 10, 12 são o palco do About a perder a máscara oval / a ordem das camadas ao recuar e no 13 → 14 (`about-stage.ts`, `about.css`
  bloco iOS).
- 9: a frase do 11 medida com uma altura de ecrã que muda com a barra do Safari (`dvh`/`innerHeight`) — ver onde o 11 é centrado ao
  voltar.
- 1: a etiqueta segue `data-starts`/a secção em vez da fase visível.

**Ordem proposta para a próxima sessão** (6/11, não começada por falta de orçamento de tokens; nada foi alterado no código):
1. As bordas (2 topo, 6, 11, 12): decidir primeiro se o `1cb418c` (cores lidas) sai e volta o método de 1/11 — cenas atrás da ilha e até
   ao fundo, `html`/`body` só como reserva. É a decisão que mais bugs fecha de uma vez.
2. O retrato do About ao recuar e no 13 → 14 (7, 8, 10).
3. A frase do 11 ao voltar (9).
4. Os tempos das palavras do 7 no 8 → 9 (3).
5. A etiqueta da barra pela fase visível (1) e o retângulo cinzento no Work → 7 (2, em baixo à esquerda).
Um de cada vez, gravado no iPhone pelo owner antes do seguinte.

**Como verificar cada correção:** gravar no iPhone pelo proxy (o owner) e no Xiaomi + emulação 390×844; o mesmo percurso do vídeo
(descer e subir devagar em cada costura); frame a frame no instante indicado na tabela.

---

## 4 de novembro de 2026 — About construído numa sessão na nuvem, branch `v5-cloud-about` (não integrado no `v5`)

**Estado:** o About (estados 12–14) está no branch `v5-cloud-about`, a partir de `ffeec33`; o `v5` não mudou. O owner puxa o branch e
valida no PC, no Xiaomi e no iPhone antes de integrar. Testes e números: `v5-tests.md`, secção "M7a — About". Código:
`src/components/about/`.

**O que o owner tem de ver / decidir:**
1. **A saída 11 → 12 da README #65** (Talk to us, depois os passos, a frase por último; os ecrãs do desktop apagam-se com a sala) está
   construída como no painel "About em movimento", mas no README continua "proposta, a aprovar". O About anima uma cópia inerte do 11
   (o `.m-stage` clonado); nenhum ficheiro do Method mudou.
2. **No telemóvel o retrato do 12 nasce centrado na frase do 11** (medida em cada ecrã; passo 6). **Ritmo (revisto a 4/11, passo 2):** a passagem corre inteira (~3 s) sobre uma cópia do 11;
   13 a 1,0 ecrã, 14 a 1,7, solto a 2,3; a luz desliza até ao retrato e o círculo abre-se em oval (sem camada escura). Por confirmar.
3. **Diferenças em relação ao storyboard, por técnica:** a máscara do retrato é fixa e abre-se por `transform` (escala e escala inversa),
   em oval, não por `mask-size` animado; o grão do storyboard passou a ser um dithering em mistura normal (o overlay não fazia nada no
   escuro, medido; `v5-tests.md` M7a passo 3) e as cores de fundo descem 2 níveis para o compensar; a cor
   só responde a um rato que se mexe.
4a. **Navegação (4/11, `v5-tests.md` M7a passo 7):** o menu, o índice e os endereços levam o Method e o About onde se veem (`src/lib/address.ts`,
   chamado pela barra — uma linha em `bar-client.tsx`); o scroll do topo ao About e de volta testado sem defeitos fora das bandas mortas.
4. **About → Questions:** nada foi feito (a passagem 14 → 15 da #65 pertence às Questions, README #75; a #25 diz "sem passagem").
5. **Retrato real:** correr `npm run images -- --only=portrait --force`: escreve também a sala acabada do About (`room-{mono,col}-{wide,tall}.png`,
   `scripts/about-room.mjs`, 4/11: P&B cinzenta como no storyboard, sem anéis; `v5-tests.md` M7a passos 5 e 6) com o `media-src/about/portrait-124.jpg` verdadeiro e ver o enquadramento
   (`object-position 50% 30%`), a aura e o contraste. No contentor foi usado um substituto sintético.
6. **Xiaomi:** o 11 → 12 (o *spot* a escalar), o 12 → 13, o segurar para a cor. iPhone: as bordas no About (carvão `#1e1d1a` contra a
   sala `#171816`/`#1b1c1a`).

### Tudo o que esta sessão mudou na lógica (4/11, `ffeec33` → este branch), por ordem

Pormenores, medições e o que não foi verificado: `v5-tests.md`, "M7a — About" (passos 1–9), "O Method em ecrã inteiro no iPhone" e
"As cores do topo … lidas da imagem desenhada".

1. **About construído** (`src/components/about/`: `about.tsx` servidor, `about.css`, `about-client.tsx`, `about-stage.ts`, `portrait.ts`;
   `page.tsx` usa `<About />`; `globals.css` tira o About das regras de secção provisória). O palco preso sobre os últimos 1,6 ecrãs do
   Method; fases `pre` / 12 / 13 / 14 por scroll (13 a 1,0 ecrã, 14 a 1,7, solto a 2,3; banda morta 0,025; preso 0,3 ecrã antes).
2. **A passagem 11 → 12** corre inteira (~3 s) sobre uma **cópia inerte do 11** (o `.m-stage` clonado no `.a-from`, com o que ainda se mexe
   copiado onde está); a luz desliza até ao retrato; o círculo abre-se em oval por `transform` (escala e escala inversa amostradas), sem
   camada escura; só perto do fim do segurar se apressa. Um salto (menu, endereço, `data-jump`) põe tudo no lugar de uma vez.
3. **A sala do 13 como imagens acabadas** (`scripts/about-room.mjs`, chamado por `npm run images`: P&B cinzenta e a cor, 16 bits, sem
   anéis), grão por dithering; a cor no hover só com o rato a mexer-se, por toque a segurar, Enter/Espaço (`portrait.ts`).
4. **Navegação** (`src/lib/address.ts`, chamado pela barra): o menu, o índice, os endereços e voltar/avançar levam o Method e o About ao
   sítio onde realmente começam (`data-starts`), num salto marcado com `data-jump` (600 ms).
5. **iPhone, ecrã inteiro à maneira do Work** (`method.css` bloco iOS + `method-stage.ts`; `about.css` bloco iOS): os palcos do Method e do
   About começam 70 px acima do ecrã (`--m-lift`, `--a-lift`); o que se vê desce 70 px; o estúdio reflete o seu topo para cima; o 9 e o
   retrato do 13 sobem atrás da ilha. O script desconta a subida onde mede. (A tentativa com `clip-path` foi desfeita: fazia tremer.)
6. **As cores do topo lidas da imagem desenhada** (este commit): `src/lib/top-colour.ts`; o Method deixa os valores fixos medidos no Chrome
   (só reserva) e lê o estúdio, a luz da hora e o escuro do 11 à opacidade de cada momento, seguindo as mudanças 1,9 s; o About tem a sua
   borda (escuro no 12, céu do retrato ou sala no 13/14, seguida quando o palco sai); o `sequence.ts` junta as duas. A frase do 11 medida
   sem a subida do Method (o salto do 11 → 12 no iPhone).

**Por ver no iPhone (owner):** a cor à volta da ilha a aterrar no 7, a ir e vir entre o 10 e o 11, no 13 e a sair do About; o 11 → 12 sem
salto. **No Xiaomi:** as idas e voltas 10 ↔ 11 (a borda relida a cada 100 ms durante 1,9 s; no Android sem transição).

---

## ▶ COMEÇAR AQUI · 3 de novembro de 2026, fim do dia — M6 (Method) commitado e enviado: `55f6e53`

**Estado:** branch `v5`, M6 commitado e enviado a pedido do owner (`55f6e53`, 3/11, noite). Próximo módulo: About / Questions / Contact (README #75). Decisões: README #102
(a saída C2), #103 (afinações: ponte sem *During*, 9 a ecrã inteiro com as barras, ritmo do telemóvel, cursor, 10 → 11 pelo centro, bordas
da página no Method em sincronia com a luz, bloqueio no 7, Work parado durante a luz, *Make it yours* recomposto), #104 (o toque: opção A só
no menu e no submenu do Work). Testes: `v5-tests.md`, M6, passos 4 a 4j.

**Depois (fim do dia):** owner viu no iPhone ("parece ok"); a folha do 8 aprovada ("gosto"). Feito a seguir (README #103, 12–14; testes 4k):
refresh no 8 no iOS (cartões na forma da área visível), idas e voltas rápidas no Xiaomi 58 → 67–68 fps (transição de cor das bordas só no
iOS, medidas escritas só quando mudam, Work preso por CSS: último passo 4 ecrãs, Method sobre os últimos 3,1). O 8a do desktop a 0,6 foi
experimentado e desfeito (fica 1,15).

Depois: os cartões 9 : 16 foram experimentados e desfeitos; ficaram os originais, que só descem se fossem tapar o campo (README #103, 12; testes 4m). O fling rápido fica para uma solução no
site todo, mais tarde (#103, 16); o 8 com um só gatilho deixou de ser tema (#103, 17).

**Por confirmar pelo owner:**
1. **iPhone:** o refresh no 8 com os cartões originais e o empancar nas idas e voltas rápidas.
2. **Para mais tarde:** uma solução para flings rápidos no site todo.
3. (encerrado) (proposta B em https://claude.ai/artifact/RvZLvVX4QYbfSna9Cxuruf, secção 2) — em aberto desde 2/11.

**Antes de publicar:** tirar `FpsMeter` de `page.tsx`; prender o scroll com o menu aberto; o proxy da rede e o HUD são só de teste.
(As máscaras da luz já saem do `npm run images`, 3/11.)

**Antes de dar o site como terminado — flings rápidos (owner, 3/11):** pensar uma solução para o site todo, não só para o Method. O que se sabe:
- **Medido (Xiaomi):** fling rápido para cima entre o 9 e o fim do Method 33–38 fps (a versão da fenda dava 53 na mesma sessão); idas e voltas
  rápidas na costura Work ↔ Method 67–68 fps, com frames de 50–110 ms nos recuos e ~200 ms na primeira passagem. Scripts: `phone2.mjs`
  (gestos lento / normal / fling, nos dois sentidos), `phone-rapid.mjs` (idas e voltas), `phone-sweep.mjs` + `sheets.cjs` (o site todo,
  gravado), `continuous.mjs` e `fuzz.mjs` (lógica).
- **Causas encontradas e já tratadas:** a cor das bordas animada (repintava a página no Android), medidas reescritas a cada passagem, o Work
  preso por script (layout), a fotografia com `composite: add` (fio principal), a passagem apressada a cada evento de scroll (bloqueio).
- **Causas prováveis por tratar:** (1) cada mudança de fase lança voos para todos os cartões, e um fling atravessa várias fases em poucos
  frames — cada uma começa voos que a seguinte cancela; (2) os cartões do telemóvel são grandes (55 % da largura, forma do palco) e o 9 é o
  ecrã inteiro: muitos píxeis a enviar ao compositor; (3) a capa (9 → 10) e os ecrãs vivos fazem trabalho no fio principal na mudança.
- **Ideias a experimentar (uma de cada vez, medidas no Xiaomi):** escolher a fase uma vez por frame (`requestAnimationFrame`) e não a cada
  evento; com scroll rápido, saltar diretamente para a fase de destino sem tocar as intermédias (ou tocá-las em ~150 ms); adiar a capa e os
  ecrãs vivos até o scroll assentar; `content-visibility`/`visibility: hidden` nos cartões fora de cena; no Work, a troca de capítulos com
  fling (os títulos sobrepõem-se um instante). Critério: fling rápido para cima ≥ 50 fps no Xiaomi sem mudar o que se vê devagar.

**Ferramentas de hoje** (`D:\STUDIO-tools\v5-m6\`): `passage.mjs`, `modes.mjs`, `phone-passage.mjs`, `phone-sweep.mjs` + `sheets.cjs`,
`phone-bridge.mjs`, `phone-caret.mjs`, `phone-press.mjs` / `chrome-press.mjs`, `phone-head.mjs`, `fuzz.mjs` (aleatório, Chrome ou Xiaomi),
`continuous.mjs` (scroll sem pausas). iPhone pela rede: `node D:\STUDIO-tools\v5-m5\ios\proxy.mjs 3130 3100`, `http://192.168.1.223:3130`.

---

## 3 de novembro de 2026, de manhã — a saída de Experiences (C2) construída; falta o Xiaomi

**Estado:** branch `v5`, último commit `6af5f71`. **Todo o M6 continua por commitar** (o de 2/11 e o de hoje). Commit só quando o owner pedir.

**Decidido hoje (README #102; storyboards: variante 5 em https://claude.ai/artifact/TvJ9UgwUZBHHWj4WeMPLBZ, cartões em
https://claude.ai/artifact/Uwks3PpKx3F6nxFyKFTG3z, texto em https://claude.ai/artifact/795GFGRBnVJiVkooJQQqCS):** a luz da hora atravessa o ecrã
vinda do lado da hora e encontra os ecrãs já no lugar (C); as palavras chegam com a luz e o fim é *Make it yours* (C2). Owner: continuar a
descer acaba a passagem; ao subir a luz recua pelo mesmo lado; o cursor pisca e fica fixo; no telemóvel a frase mais abaixo.

**Feito hoje:** C2 no site (`method-stage.ts`, `method.tsx`, `method.css`), com os cartões do telemóvel a 58 % e com a forma do ecrã
(README #101). Storyboard principal (painel "3 de novembro", quadros 6 → 8, animação) e `storyboard.md` atualizados; artifact
publicado. Testes: `v5-tests.md`, M6, "Passo 4" — 5 tamanhos, 4 horas, recuo, fim apressado, movimento reduzido, sem JS, teclado.

**Por confirmar pelo owner:** a folha do 8 repousa mais abaixo (24 %) e no telemóvel afasta-se para o lado — sem isso, com os cartões maiores,
tapava a frase e o campo (storyboard.md, "O que o site faz hoje de diferente").

**A seguir:**
1. **Owner, com o dedo no Xiaomi:** a passagem (83–87 fps) e o recuo (77–82) estão bem; **o fling rápido para cima piorou (53 → 33–38 fps), entre o 9 e o fim**, em parte pelos cartões a 58 % (v5-tests, Passo 4). Decidir; fling para
   cima (era 61–66 fps).
2. iPhone: a passagem e o recuo.
3. Depois: o 8 com um só gatilho? (proposta B em https://claude.ai/artifact/RvZLvVX4QYbfSna9Cxuruf, secção 2).

**Ferramentas novas:** `D:STUDIO-tools5-m6passage.mjs` (a passagem a tempo real; `node --experimental-websocket passage.mjs <out>
<w>x<h>:<hora> …`) e `modes.mjs` (movimento reduzido, sem JS, teclado). O ambiente repõe-se como na secção de 2/11, em baixo.

---

## ▶ COMEÇAR AQUI · 2 de novembro de 2026, fim do dia — M6 (Method) em revisão; saída de Experiences por escolher

**Estado:** branch `v5`, último commit `6af5f71` (M5 e o rebordo dos cartões). **Todo o M6 está por commitar** (working tree: `src/components/method/`, `work-client.tsx`, `work.css`, `bar-client.tsx`, `page.tsx`, `globals.css`, `scripts/images.mjs`, `scripts/spill-mask.mjs`, `public/media/v5/method/spill-*.png`, docs). Commit só quando o owner pedir.

**Primeira coisa amanhã: o owner escolhe a saída de Experiences para o 7.**
- Storyboard de avaliação: `docs/design/v5/storyboards/saida-experiences/index.html` (abrir no browser; imagens em `img/`) e https://claude.ai/artifact/TvJ9UgwUZBHHWj4WeMPLBZ.
- Quatro saídas, todas num só movimento (um gatilho, sem paragem): 1 a lâmina tocada · 2 a janela abre-se (**recomendada**) · 3 entrar na fotografia · 4 um varrimento de luz.
- Com a escolha, entram no site também os **cartões do telemóvel a 58 %** (aprovado, README #101) e o **passo 9 com a forma do ecrã** (no Xiaomi hoje tem 360 px num ecrã de 392).
- A seguir: o 8 com um só gatilho? (proposta B em https://claude.ai/artifact/RvZLvVX4QYbfSna9Cxuruf, secção 2); o fling para cima no Xiaomi (61–66 fps, ver abaixo).

**O que está no site agora (M6), em resumo** (decisões README #95–#101; o que difere do storyboard: `storyboard.md`, secção "O que o site faz hoje de diferente"; testes e números: `v5-tests.md`, M6, passos 2 a 3h):
- Method: cena presa de 7 a 11 com as posições do storyboard v46; estúdio pelas quatro luzes (noite em PNG ditherizado); luz como camada que anda; 163 a cores no ecrã do casamento; 9 a ecrã inteiro no telemóvel; 10 = o ecrã do casamento torna-se a capa (um objeto); 11 a luz baixa.
- Passagem: **a fenda em dois passos** (#99, o owner não gostou do passo intermédio — vai ser substituída). Fica dela: o desenho do guia medido da fotografia do Work, o vidro do desenho (30 %, liso, #100), a luz da fenda "B suave" (máscara ditherizada por hora, `scripts/spill-mask.mjs`), a fenda posta a partir do desenho no desktop.
- O Method começa 2,1 telas antes do fim do Work (transparente; o palco já preso antes da cena, sem descer ao voltar), o Work passa a *During* meia tela antes; Method 6,2 telas, cena 4,7.
- Work: refresh mostra o capítulo certo; o cartão do Accept só sobe; depois de escolher um momento a palavra e os 6 s esperam as cartas assentarem (1,12 s / 1,55 s).

**Medições do fim do dia (Xiaomi):** passagens 82–90 fps com picos de primeira vez (55–133 ms, não são da luz nem do vidro: bisseção feita). Dedo: lento 80, normal 75–82, rápido a descer 84; **rápido a subir 61–66 fps (era 75)** por o Method estar mais curto. Não verificado: iPhone desde a fenda.

**Ferramentas desta sessão:** `D:\STUDIO-tools\v5-m6\` (32 scripts: `raf.mjs`/`phone.mjs`/`phone2.mjs` Xiaomi; `phases.mjs`, `edges.mjs`, `static.mjs` rondas no Chrome; `rec7.mjs` gravação da passagem; `replay.mjs` reproduz uma fita do owner; `edgeshots*.mjs`, `nightshot.mjs` luz; `storyboards/` as três páginas de decisão). Corriam de `scratchpad/m6`; os caminhos de saída são relativos.

**Atenção aos derivados:** `public/media/v5/` está no `.gitignore` (como todos os derivados). As máscaras da luz da fenda (`spill-<hora>-<l|r>.png`) não vêm do `npm run images`: geram-se com `node scripts/spill-mask.mjs`. Por integrar no `images.mjs` antes do lançamento.

**Como repor o ambiente:** `npm run build`, `npx next start -p 3100`, `node D:\STUDIO-tools\v5-m5\ios\proxy.mjs 3130 3100` (iPhone e as fitas do owner, gravadas em `D:\STUDIO-tools\v5-m5\ios\out\`). Xiaomi: `adb -s c3e8fb35 reverse tcp:3100 tcp:3100` e `forward tcp:9555 localabstract:chrome_devtools_remote`; o Chrome tem de estar aberto (`adb shell am start -a android.intent.action.VIEW -d http://localhost:3100/ com.android.chrome`) e o ecrã acordado (não se acorda pelo adb). Chrome de testes: `D:\STUDIO-tools\v5-m5\screen2.ps1`, porta 9444. Fuso emulado (`Emulation.setTimezoneOverride`) dá as horas de luz verdadeiras; pôr `data-light` à mão deixa a barra com o vidro da hora em que a página abriu.

---

## 1 de novembro de 2026, fim do dia — iPhone aprovado, ronda final feita, M5 por commitar (já commitado a 2/11: `47ca753`, `6af5f71`)

**Estado:** branch `v5`, último commit `c748c0b` (M4). **Todo o M5 e o trabalho de 31/10 e 1/11 estão por commitar.** Commit só quando o owner pedir. Não perder o working tree.

**O que falta, por ordem:**
1. **iPhone:** o owner dá uma volta rápida depois das três últimas correções (a cor passou a ser escrita diretamente em `html` e `body`, capítulos em descanso, regresso a Weddings). Antes delas tinha dito "ficou bem agora perfeito".
2. **Crédito — confirmado pelo owner a 2/11:** *Photographs — Helder Couto* sai do Work (README #87; já aplicado no código); a fotografia dele continua no site. O crédito do retrato em About fica.
3. **Xiaomi — aceite pelo owner a 2/11** ("não é nenhuma queda brusca, não vejo lag evidente"): mudança de capítulo com um frame de 66–88 ms, uns 130–220 px depois da troca; saída do Work para o Method 88–99 ms (`phone-long.mjs`, medido a 2/11).
3b. **iPhone, aberto a 2/11:** Weddings → Artists (e o inverso) passa depressa demais; Artists → Experiences está bem. A fita de 2/11 10:50 mostra a causa: depois da passagem, Weddings só tem ~480 px de scroll (a troca dá-se quando o passo seguinte cruza o meio do ecrã), Artists tem 884 px (um `--screen`). No Android a proporção é a mesma (~490 / 828), mas o owner não o sente lá. **Corrigido (README #88):** o passo de Weddings tem agora 1,5 `--screen` e o Work 4,9. Também foi corrigida a barra a subir, onde a ilha do nome desaparecia em Weddings. Depois, Experiences: ficava parado só ~365 px e ganhou também meio ecrã (último passo 1,5, Work 5,4). Medido no Xiaomi; falta o owner ver no iPhone.
3c. **Palavra do momento (README #89, 2/11):** na troca de capítulo chegava com meio B cheio. Agora chega vazia e começa a encher 450 ms depois. Medido no Xiaomi; falta o iPhone.
3d. **Título e troca de capítulo (README #90, 2/11):** o salto que o owner via em Experiences era o título, cortado no iPhone; agora voa com Web Animations. A troca tem uma margem de 12 % contra o vaivém. Medido no Chrome de testes a 390 px; faltam o Xiaomi (estava bloqueado) e o iPhone. O owner achou "bem melhor".
3e. **Pilha de fotografias (README #91, 2/11):** no iPhone, a fotografia de Experiences a subir saltava (transição cortada). Agora usa Web Animations, como o título. Medido no Chrome de testes. **Owner, iPhone, 2/11: "ficou corrigido, parece-me tudo bem agora"** — #88–#91 aprovadas no iPhone. Falta só o Xiaomi (bloqueado durante #90/#91) e o commit, a pedido. Owner, Xiaomi 2/11: transições boas. Perguntou se a barra do Chrome Android (em cima, empurra a página ao subir e descer) podia ficar por cima como no Safari. Resposta: é o comportamento do Chrome numa aba normal e não há forma de o mudar a partir da página. O palco já usa `100lvh` no Android e não muda de tamanho; a página só se desloca com a barra. Recomendado deixar assim; aguarda a palavra do owner.
4. **Commit do M5**, a pedido. Depois, M6 (Method), que nasce já com as regras do iPhone (storyboard, regra 8).

**Por provar:** `nine.mjs`; 3 das 9 peças em `sweep`; tablet real; leitor de ecrã; rede lenta. Frame de ~278 ms a 0,94 ecrã no Chrome de testes, sem tarefa no traço e sem equivalente no Xiaomi: causa não encontrada.

**Aprovado pelo owner a 1/11:** cartões, nome na barra, 768, lâminas sem tremor nem risco, palavras DRAFT de `work.demos`, ecrã do iPhone, scroll bloqueado na entrada, cor por capítulo. Decisões: README #83–#87; site tal como está: `storyboard.md`, regras 3, 7 e 8; números: `v5-tests.md`, última secção. O storyboard visual tem no topo o painel de 1/11, que prevalece sobre os frames.

**iPhone, o que não repetir** (memória `ios-safari-edge-colour`):
- Medir a faixa da ilha em y 6 ou 54 px e x 100–300: a linha do relógio dá valores falsos e custou várias rondas.
- Não voltar a `viewport-fit=cover`, faixas fixas nas bordas, `theme-color` como solução, nem desfoque ao vivo nas pontas do filme.
- Em baixo não há cor: as cenas presas têm `--screen` = 100 lvh + 130 px e passam por baixo da barra. Referência do owner: notateslaapp.com.
- Com scroll, a ilha mostra a página logo acima do ecrã: daí os 70 px do palco.

**Como repor o ambiente de teste** (a sessão terminou, os servidores pararam):
```
cd D:\STUDIO-v5
npm run build
npx next start -p 3100                       # site, em segundo plano
node D:\STUDIO-tools\v5-m5\ios\proxy.mjs 3130 3100   # iPhone: ferramenta e envio de vídeos
```
- **iPhone:** no Safari, `http://<ip do PC>:3130` (a 1/11 era `192.168.1.202`; confirmar com `ipconfig`), Wi-Fi NOS-24B4-5. `testes` e `● rec` no HUD. **`● rec` não traz imagem:** para ver, gravar pelo Centro de Controlo e enviar por `📎`. Ficheiros em `D:\STUDIO-tools\v5-m5\ios\out\` (761 MB de gravações, apagáveis); ler fitas com `tape.cjs`; ffmpeg do Cypress.
- **Xiaomi:** `adb -s c3e8fb35 reverse tcp:3100 tcp:3100`, `adb -s c3e8fb35 forward tcp:9555 localabstract:chrome_devtools_remote`; adb em `D:\STUDIO-tools\android-sdk\platform-tools\`; scripts com `node --experimental-websocket`.
- **Chrome de testes:** `D:\STUDIO-tools\v5-m5\screen2.ps1`, porta 9444, 2.º monitor. `sweep.mjs` e `nine.mjs` abrem janela no ecrã principal; usar `ios\sweep2.mjs`.

**Ferramentas novas em `D:\STUDIO-tools\v5-m5\ios\`:** `full.mjs [ios]` (edge cases, com as regras do iOS opcionais), `screen.mjs`, `ramp.mjs`, `strips.mjs`, `probe.mjs`, `phone-long.mjs`, `hold.mjs`, `word.mjs`, `lab.html` (`/__diag/lab`, riscas). Simulador das margens: `ios\sim\`, https://claude.ai/artifact/A7pZMaQ54BJD8wHJiQp5WQ. O botão `Cor única no Work` existe só no HUD.

---

## 31 de outubro de 2026 — Entrada e Work quase fechados

**Em que ponto estamos:** M3 (`803492a`) e M4 (`c748c0b`) commitados. **M5 (Work) e as alterações de 31/10 estão por commitar**
(`git status`). Commit só quando o owner pedir. Sessão de 31/10 terminada a pedido do owner, sem tempo para continuar.

**Decisões do owner a 31/10:**
- **Passagem:** a lâmina é aprovada (README #81, storyboard estado 2). O código da janela em arco saiu.
- **Scroll dentro do Work:** o owner não vê lag; os números (63 fps a 90 Hz, 45–48 a 60 Hz) **não bloqueiam**.
- **Rodapé *Every project is proposed…*:** visível também no telemóvel (0,72 rem; crédito por baixo). Aplicado; apertado a 320×640, ver a olho.
- **`02 Method ↓`:** o owner disse que foi erro dele; não existe no Work. Confirmar o sentido se reaparecer.
- **Storyboard:** atualizar só a lâmina. O ritmo de 6 s e a regra de tocar continuam diferentes do storyboard, a pedido.
- **FPS:** o medidor `?fps` fica por agora, mas só em localhost; nunca na versão publicada (regra em `CLAUDE.md`).

**A responder primeiro na próxima sessão:**
1. **Cartões (README #82, em validação):** o owner hesita entre a versão atual e o *apaga* de https://claude.ai/artifact/EENJtCtWgXHrjnM434Zmc4#fade.
   Recomendação dada: manter a diagonal e apagar mais depressa, para a mistura de fotografias durar menos. Sem alteração feita.
2. **Nome na barra:** recomendação dada: sobe ao topo sem repetir a entrada. Falta a resposta do owner; hoje é assim.
3. **320×640 e 768×1024:** recomendação dada: a 768 aumentar o arco; a 320 deixar. Falta a resposta.
4. **Tremor do rato nas lâminas:** falta o owner confirmar. Passos isolados de 0,8–1,3 px sem origem identificada.

**Depois disso:** o owner testa no iPhone real; commit do M5; M6 (Method).

**Antes de publicar:** tirar `FpsMeter` de `page.tsx`; prender o scroll com o menu aberto; tratar `pc.mjs`, que ainda lança browser próprio.

**Como retomar:**
- `npm run build`, `npx next start -p 3100` (servidor desligado ao fechar a sessão).
- Depois de desligar o PC, voltar a abrir servidor, Chrome de testes e ligação do Xiaomi.
- Chrome de testes, sem roubar o foco: `D:\STUDIO-tools\v5-m5\screen2.ps1` (porta 9444); os testes ligam-se a ele. Navegar por `about:blank` antes de recarregar.
- Xiaomi: `adb -s c3e8fb35 reverse tcp:3100 tcp:3100` e `forward tcp:9555 localabstract:chrome_devtools_remote`; tem de estar desbloqueado.
- Testes em `D:\STUDIO-tools\v5-m5\`: `audit.mjs`, `audit2.mjs`, `landing.mjs`, `takeover.mjs`, `barra-frame.mjs`, `barra-pull.mjs`, `rato-over.mjs`, `phone-pile.mjs`, `phone-pass.mjs`, `phone-work.mjs`.
- Auditoria completa: `docs/development/v5-auditoria-entrada-work.md`. Testes: `v5-tests.md`.

---

## Sessão de 30 de outubro de 2026 — M5 (o Work) em revisão com o owner, não commitado

**Em que ponto estamos:**
- **Commitados e enviados:** M3, a entrada (`803492a`); M4, a barra e o menu (`c748c0b`).
- **Por commitar:** o M5, o Work. Está construído e a ser revisto com o owner, peça a peça. Nada do M5 foi commitado
  (`git status` mostra o trabalho).
- **Regras a manter:** o V5 segue o **storyboard** (README #76–#77; memória `v5-storyboard-prevails`). Cada módulo
  regista os seus testes em `docs/development/v5-tests.md` antes do commit (regra no `CLAUDE.md`).

### 31 de outubro — auditoria de Entrada, transição e Work em `v5-auditoria-entrada-work.md`: lista do que aguarda o owner.

### 31 de outubro — estado atual (detalhe: `v5-tests.md`, décima quinta revisão; prevalece sobre o que está abaixo)
- **Quadrado:** o owner confirmou que desapareceu.
- **Medido:** build, typecheck, lint, `pc.mjs`, `moments.mjs`, `nine.mjs`, `sweep.mjs` a 1920: bem. Peso no Xiaomi: 3,70 MB à chegada.
- **Em aberto, Xiaomi:** passagem 36–41 fps (eram ~60), mas o controlo caiu o mesmo (~40 %), por isso não é a passagem.
  Causa não encontrada. Falta o owner sentir a passagem com o dedo e repetir a medição noutro momento.
- **Falta:** aprovação palavra a palavra de `work.demos`; o vidro e *Always* a 390 no telemóvel; olhar o `sweep.mjs` a 390.
- **Decisão do owner:** commit do M5 e início do M6 só quando esta fase toda estiver concluída.
- **Tremor da entrada e passagem (`v5-tests.md`, décima sexta revisão):** duas causas corrigidas com o zoom verdadeiro (87–88 fps, 0 frames perdidos); passagem a
  50–57 fps a 90 Hz. **Filme:** corte verde → sépia a ~2 s, em pleno zoom: decisão do owner. **Tremor ao assentar corrigido** (rotação 0,03° em `.e-film`). **Passagem:** o owner rejeitou as versões B, C e D; fica a atual, otimizar sem mudar o visual.
- **Testes no PC:** Chrome visível no 2.º ecrã, sem roubar o foco: `D:STUDIO-tools5-m5screen2.ps1` (porta 9444); ligar a ele em vez de lançar um browser. Nunca headless.
- **Entrada e passagem refeitas no compositor (décima nona revisão):** uma linha de tempo em `entrance.css`; `flight()` em `work-client.tsx`. Aspeto da passagem por aprovar pelo owner.
- **Entrada pelo O:** o owner viu melhor e smooth (31/10). **iPhone real:** o owner testa depois de fechar entrada e Work.
- **Pilha de cartões:** A construída no site e medida (vigésima revisão de v5-tests.md).
- **Passagem para o Work:** a lâmina é a passagem normal (README #81); `?lamina` e a janela em arco foram retirados.
- **Regresso do cartão:** fechado: diagonal com o apagar (`change()`). Falta o owner rever no site.
- **Por tratar:** scroll pelo Work 45–48 fps a 60 Hz.
- **Medidor:** fica por agora; só funciona em localhost com `?fps`; a versão publicada nunca o mostra. Sair de `page.tsx` antes do lançamento.

### Sessão de 30 de outubro — o que mudou (detalhe e números: `v5-tests.md`, décima a décima quarta revisões)
- **Quadrado em Experiences *During*:** causa real encontrada, o véu pintava fora do corte oblíquo quando a animação do
  cartão acabava. Corrigido com `clip-path` no véu; sem salto no PC nem no Xiaomi. **O owner ainda não confirmou.**
- **Troca de momentos:** as camadas já não deslizam (`data-swap`, `.w-leaving`).
- **Weddings *Before*:** contagem para o próximo 25 de agosto às 16:00, o ano muda sozinho. Palavras mais acima; véu leve
  escolhido e aprovado pelo owner, com a data a ~3,1 de contraste.
- **Qualidade:** fotografias reais em `fine` (AVIF 78, até 1600 px).
- **Imagens (aprovadas pelo owner):** Unsplash em *For a moment*, Experiences *Before*, *During* e *After*; *Always* = imagem
  nova do owner no ChatGPT; *On record* = IA. Tratamento `calm`; as lâminas da entrada não mudam. Licenças em `assets.md` §3.
- **Vidro das peças:** igual ao da barra, com lente partilhada (`src/lib/lens.ts`). O convite tem a fotografia dentro da peça.
- **Teclado:** escolher outro momento com o palco em pausa já funciona.
- **Xiaomi com tudo aplicado:** momentos 90 fps; scroll 66 fps; passagem 54–65 fps. Peso em rede móvel por medir.
- **A seguir:** ver o vidro e *Always* a 390 px e no telemóvel real; correr `sweep.mjs` e `pc.mjs`.
- **Ferramentas novas em `D:\STUDIO-tools\v5-m5\`:** `dur6.mjs`, `diff.mjs`, `amp.mjs`, `wedge.mjs`, `sweep.mjs` (defeitos do
  compositor: gravar, nunca screenshots), `six.mjs`, `glass30.mjs`, `before31.mjs`, `room.mjs`, `cd30.mjs`, `m30.mjs`,
  `phone-dur.mjs`, `look.mjs`, `round2.mjs`, `board.mjs`. Página das imagens: https://claude.ai/artifact/XmzcJUwHjESMFNW5yZfXwT

### O M5 — o que está feito (tudo testado no PC; detalhe e números em `v5-tests.md`, secção M5)
- **Código:** `src/components/work/`, com `work.tsx` (HTML completo sem JS), `work-client.tsx` (o palco) e
  `work.css`. As palavras das peças estão em `content/v5.ts` → `work.demos`, marcadas **DRAFT**. Os tempos estão em
  `content/tuning.ts`.
- **A passagem estado 2:**
  - a entrada fica presa (`.e-hold` em `page.tsx`) e o vídeo encolhe até ao arco de Weddings;
  - depois dissolve-se na primeira fotografia e o vídeo pára;
  - funciona a subir e a descer;
  - no Xiaomi mede ~60 fps com o gesto simulado, mas o owner vê-a sem lag e aceitou-a.
- **O palco:**
  - preso por três passos de scroll, e o título é a navegação (#62);
  - no telemóvel: o outro capítulo pequeno em cima, o seguinte em baixo, maior e o único tocável;
  - passagem de capítulo FLIP, numa só passagem direta;
  - aura, molduras (arco, retângulo, oblíquo) e unidade `--u` = `min(1vw, 1,6svh)` (telemóvel `0,462svh`).
- **Os momentos (regra do owner, 29/10):**
  - 6 s cada: 1,2 s só a fotografia, depois 4,8 s a peça;
  - tocar noutro momento muda logo para ele e a rotação segue dali;
  - tocar no atual pausa-o, e outra vez retoma; pausar mostra sempre a peça;
  - os momentos passados ficam apagados;
  - o rato sobre a fotografia pausa e a fotografia desliza (sobre o texto não);
  - no fim de um momento a peça sai primeiro e só depois as fotografias trocam; a fotografia que chega aparece no
    lugar por opacidade (era o "quadrado preto").
- **As nove peças:**

  | Momento | Peça | Estado |
  |---|---|---|
  | Weddings *Before* | contagem para o próximo 25 de agosto às 16:00 (o ano muda sozinho; 30/10), data, *Reply by RSVP* em vidro, sombra nas palavras | aprovado (30/10) |
  | Weddings *On the day* | galeria ao vivo: 6 fotografias que chegam e a contagem 1 → 6 | aprovado |
  | Weddings *After* | *One year on* | aprovado |
  | Artists *Always* | portfolio: 3 obras numa fila, filtros | aprovado |
  | Artists *For a moment* | exposição: entrada na sala em 1,8 s, etiqueta em vidro | aprovado |
  | Artists *On record* | arquivo | aprovado |
  | Experiences *Before* | convite em vidro, *Accept* → *See you there ✓* | aprovado |
  | Experiences *During* | guia | aprovado; o "quadrado preto" corrigido, **a confirmar pelo owner** |
  | Experiences *After* | agradecimento com tira de fotografias | aprovado |

  As propostas das oito peças estão em https://claude.ai/artifact/VpGPN2hkMejVzWXhvjZJuN.
- **Assets novos:** seis fotografias do Helder Couto (046, 067, 126, 156, 179, 337).
  - Copiadas da V4 (`public/media/new`) para `media-src/weddings/`, com o SHA-1 verificado e sem tocar na V4.
  - Derivados `weddings-guests-1…6`, registados em `scripts/images.mjs` e `src/lib/media.ts`.

### O M5 — o que falta, por ordem
1. **Weddings *Before*:** feito e aprovado (filtro leve, 30/10).
2. **O owner confirma** que o quadrado desapareceu. A causa real, a 30/10: o véu do *During* pintava fora do corte
   oblíquo quando a animação do cartão acabava (`v5-tests.md`, décima primeira revisão). Testado no Chrome do PC; falta o
   telemóvel real. Estes defeitos só se veem a gravar o compositor (`dur6.mjs`, `diff.mjs`), nunca com screenshots.
   **Imagens de Artists e Experiences (30/10):** quatro fotografias do Unsplash aplicadas (`assets.md` §3); *On record*
   fica a de IA; *Always* usa a imagem nova que o owner gerou no ChatGPT. Nunca como trabalho real de um cliente.
   Fotografias reais de Weddings refeitas em `fine`, e o vidro das peças igual ao da barra (`v5-tests.md`, décimas
   segunda a quarta revisões). Falta medir tudo no Xiaomi.
3. **As palavras DRAFT de `work.demos`:** aprovação do owner, peça a peça (horas, sítios, títulos de obras, *Our day,
   in*, *Reply by RSVP*, *An evening of music*, *Doors at 20:00 · The courtyard*…).
4. **Medir no Xiaomi a versão final:**
   - `phone-work.mjs`: os momentos a rodar e o scroll;
   - `phone-pass.mjs`: a passagem.
5. **Antes do commit:**
   - bateria do PC (`D:\STUDIO-tools\v5-m3\pc.mjs`);
   - `moments.mjs` e `nine.mjs`;
   - registar em `v5-tests.md` e no README: uma linha #81 com as decisões do Work (momentos 6 s, regra de tocar e
     pausar, nove peças, cartão, galeria);
   - commit e push do M5, só quando o owner pedir.
6. **Depois do M5:** o M6, o Method.

### Notas que não se perdem
- **Menu:** com o menu aberto a página ainda faz scroll por trás. O owner quer assim para os testes; **prender antes de
  publicar**.
- **Contraste, #32:** aceite. O título fica ~3,0 de dia no desktop.
- **iPhone:** nada testado. O vidro lá fica sem lente.

### Como retomar
- **Servidor:** `npm run build` e depois `npx next start -p 3100`. Está desligado no fim da sessão.
- **Xiaomi:** `adb -s c3e8fb35 reverse tcp:3100 tcp:3100` e `forward tcp:9555 localabstract:chrome_devtools_remote`.
  O adb está em `D:\STUDIO-tools\android-sdk\platform-tools`; no Git Bash usar `MSYS_NO_PATHCONV=1`.
- **Ferramentas de teste:**
  - `D:\STUDIO-tools\v5-m3\` (entrada, bateria do PC);
  - `D:\STUDIO-tools\v5-m4\` (barra e menu);
  - `D:\STUDIO-tools\v5-m5\` (`work.mjs`, `rot.mjs`, `moments.mjs`, `nine.mjs`, `during5.mjs`, `glass.mjs`,
    `phone-work.mjs`, `phone-pass.mjs`, `pass.mjs`, `hover.mjs`, `quick.mjs`).
  - Os scripts do telemóvel correm com `node --experimental-websocket`.
- **Prettier:** sempre com as opções do repositório (`--no-semi --single-quote --print-width 120 --trailing-comma
  all`), e **nunca sobre `content/v5.ts` inteiro**: reformata linhas que não são nossas.
- **Nunca `rm` com padrões de nomes:** a 29/10 foi apagado `dur2/*.png` (só capturas minhas), contra a regra.

---

## Sessão de 29 de outubro (manhã e tarde) — M3 e M4

### M3 (a entrada) — resumo da altura em que foi construído (depois commitado como 803492a)

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

**M3 commitado (803492a, 29/10).** **A seguir: M4, a barra e o menu.**

**M4 — os valores, por ordem de autoridade** (storyboard principal v42 + README #56, #67, #69, #70, #71; para tamanhos e
alinhamento a página aprovada `D:\STUDIO-tools\glass-test-1027\composicao-aprovada-2810.html`, e para o vidro
`index-aprovado-2810.html`):
- **Ilhas (A2, #71):** telemóvel 44 px de altura a 10 px do topo, bordas nas margens do conteúdo (24 px; 16 px < 380 px);
  desktop ≥ 900 px 48 px a 14 px do topo, margem 6vw; nome Cormorant 18 / 22 px; secção 13 / 12 px, .16em, maiúsculas,
  número em Cormorant 1,6em; filete 1 px a .35. Direita: telemóvel só o botão de três traços (100/70/85 %, 26×12, 1,5 px)
  num círculo; desktop a hora (.7) + *Talk to us* + ≡ *Menu*. **Discretas:** só desfoque + película `--tint` + fio de
  0,5 px `rgba(255,255,255,.16)`, **sem brilho nem sombra** (a página de teste nunca aplicava a classe A2 — a linha que a
  punha ficou dentro de um comentário; o owner viu as ilhas com brilho; seguir o README/storyboard e dizer-lhe).
- **Vidro:** `blur(8px) saturate(1.6) brightness(1.04) contrast(1.04)`, × 1,6 no desktop; lente `feDisplacementMap`
  escala 30 com um mapa em forma de cápsula/círculo (últimos 14 px do bordo), refeito quando a ilha muda de tamanho.
- **Escuro adaptável:** por baixo das palavras de cada ilha, 6 × 2 pontos, percentil 75; a = .06 + (lum − .2) × .75,
  entre .06 e .50; lum > .55 → sombra escura nas palavras (`on-paper`); brilho de cada imagem numa grelha 24 × 24 lido
  uma vez; fundos de secção com o seu valor (papel .80–.86, carvão .10); recalcular no scroll no máximo de 80 em 80 ms;
  `@property --tint` `<color>`, 0,45 s; com o menu aberto o escuro fica. Por cima do vídeo da entrada: usar o poster.
- **#70:** no E4 só a ilha da direita; a ilha do nome entra com o Work (só opacidade). Secção atual por
  IntersectionObserver.
- **Menu (#69):** ecrã inteiro; gota = círculo de raio `hypot(w, h)` que cresce por `transform: scale` desde a ponta
  redonda direita da ilha do menu, já com o raio dessa ponta, 0,9 s `cubic-bezier(.65, 0, .25, 1)`; visível dois frames
  antes de crescer, `visibility: hidden` depois de fechar; vidro desfoque × 1,4, `saturate(1.6) brightness(1.02)`,
  película .30 (≥ 50 % claro por trás da lista → .62/.66, 20–50 % → .50), brilho a 160°, aro 1 px .18; sem lente.
  Lista: cinco secções numeradas em Cormorant (números .42 em itálico, algarismos alinhados), a atual em itálico com
  ponto; palavras a partir de 0,32–0,35 s, +0,07 s por linha; ao fechar saem em 0,25 s. Lado: *Hello, {name}.* (só com
  nome), *Talk to us* → Instagram, contactos, *Your time · HH:MM*. `<dialog>`, foco preso e devolvido, Esc, reduced
  motion só desvanece. Palavras em `content/v5.ts` (`nav`, `contact`, `sections`).
- **Medir no Xiaomi:** scroll da página com as ilhas (alvo 90 fps), abrir/fechar o menu sobre o vídeo (alvo 87–90 fps; a
  primeira abertura teve 1 frame lento no protótipo).

**M4 construído (29/10), à espera do owner:** `src/components/bar/` (`bar.tsx` servidor, `bar-client.tsx` ilha de
cliente, `bar.css`). Testes em `v5-tests.md` (secção M4). Diferença encontrada: na página de teste aprovada a classe A2 nunca
era aplicada (a linha ficou dentro de um comentário) — o owner viu ilhas com brilho e sombra; o site segue o README #71
(discretas). **Revisão do owner (29/10):** (a) o vidro "não está bem liquid glass" → repostos o brilho, o aro e a sombra
que ele viu no teste; (b) o desfoque do menu no desktop estava em 11 px em vez de 17,9 → corrigido; (c) *Menu* → *Close*
mudava a largura da ilha → as duas palavras na mesma célula; (d) no desktop "um tremer quando a camada já assentou" →
as palavras saltavam no fim (corrigido, `will-change` enquanto o menu está aberto); o vidro "respirava" no fim do crescimento (o desfoque acompanhava a escala) → a gota tem agora **o raio exato até ao canto mais longe** (antes a diagonal do ecrã): cobre o ecrã no instante em que pára de crescer, e não sobra tempo de "respirar". Tentado antes e posto de lado: no desktop, vidro parado revelado por `clip-path` — o fundo ficava quieto mas a abertura ia "aos saltos" (redesenha o desfoque a cada frame). Medido no PC (ecrã 144 Hz, 5 aberturas): 144 fps, p95 7,1 ms; a 1.ª abertura tem 2 frames lentos (≤ 55 ms), como no Xiaomi; **Decisão do owner (29/10): fica assim** — vê-se ainda um tremer quase impercetível no fundo desfocado enquanto a bola cresce, mas depois de assentar não volta; prefere isto aos saltos da versão `clip-path`. (e) **NOTA: com o menu aberto a página
ainda faz scroll por trás** — o owner quer assim por agora, para os testes; **prender o scroll antes de publicar**;
(f) as cores da hora passam a seguir o sol real (README #80, feito e verificado).
**M4 commitado (c748c0b, 29/10).**

**M5 — o Work: de onde vêm os valores** (por ordem de autoridade, [[storyboard manda]]):
- **Storyboard principal** `media-src/storyboards-2026-10-25/work-method-storyboard.html`: CSS do Work nas linhas ~111–250
  (`.g1–.g3` fundos, `.aura`, `.dm` + as nove demonstrações, `.hnav` título-navegação, `.idx`, `.stack` camadas
  frente/b1/b2, molduras `.c1` arco · `.c2` retângulo · `.c3` oblíquo, `.tx` texto, `.mom` + `.wf` palavra que enche,
  `.li` peças com filete e círculo, versões `.frame.phone`); o JS das passagens (FLIP do título) mais abaixo no ficheiro.
  `docs/design/v5/storyboard.md` estados 2–6 e a tabela das peças e linhas.
- **README:** #40 (aura v3.2), #43 (um momento = uma peça a funcionar, nove), #44 (aterragem: scroll → I Weddings, lâmina →
  esse capítulo), #60 (linhas: desktop todas, telemóvel uma de cada vez, a mostrada primeiro), #61 (sem sublinhados,
  palavra que enche no tom do capítulo), #62 (título = navegação; telemóvel: os outros dois à direita, o seguinte o único
  tocável), #63 (*On record*, momentos sem partir), #73 (passagem de capítulo atual: cresce e desliza 1,2 s, texto sai
  0,65 s e entra 1 s; **um só tempo de 4 s** — foto 1,2 + peça 2,8; momentos por acender a .38).
- **Protótipo aprovado da passagem e do ritmo:** `D:\STUDIO-tools\glass-test-1027\work-passagem.html` (opção A, ritmo
  único 4 s, .38).
- **Técnica:** `interactions.md` §2 — palco `sticky` por três passos de scroll; aura pré-gerada (`*-aura.jpg` já em
  `public/media/v5/work/`), nada de `filter` ao vivo; tocar num momento fixa-o; pausa com rato/foco; reduced motion sem
  rotação; sem JS os três capítulos em sequência. Tempos já em `content/tuning.ts` (`moment*`, `chapter*`).
- **Fica para depois do palco:** a passagem estado 2 (o vídeo da entrada torna-se o palco), medida no Xiaomi.
- **Medir no Xiaomi:** scroll pelos três capítulos e a rotação dos momentos com as demonstrações (alvo 90 fps).

**M5, primeira versão (29/10, noite), à espera do owner:** `src/components/work/` (`work.tsx`, `work-client.tsx`,
`work.css`); as palavras das nove demonstrações em `content/v5.ts` (`work.demos`, as do storyboard); `data-js` posto em
`<html>` pelo script da entrada antes da primeira pintura (o palco só existe com JavaScript; sem ele, os capítulos em
sequência). Testes em `v5-tests.md` (M5). **Interpretação a confirmar com o owner:** "pausa com rato sobre o palco" —
o palco ocupa o ecrã, por isso a pausa é só sobre a fotografia ou as palavras. **Falta:** a passagem estado 2 (vídeo →
palco); o owner ver a passagem de capítulo. **Próximo:** owner revê → passagem estado 2 → commit.



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
