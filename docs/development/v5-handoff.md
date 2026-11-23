# Chapter One V5 — handoff

## ▶ COMEÇAR AQUI · 23 de novembro de 2026, noite — as lâminas de Artists e Experiences com as fotografias do Work (aprovado; no `v5` e no `master`)

**Estado.** Aprovado pelo owner depois dos testes no Mac (23/11: "parece-me bem podemos fazer commit e push e atualizar para master também"): o `master` avança até ao `v5` (o push é do owner, no GitHub Desktop). Antes, em commit e com push no `v5` (owner, 23/11: "preciso comitar e dar push porque quero abrir no mac para fazer testes"): as lâminas da entrada
de **Artists** e **Experiences** passam das imagens de IA de 1024 px (moles no telemóvel) para o P&B derivado das fotografias que o Work
já usa: a galeria com as duas silhuetas (*For a moment*, Unsplash Cu5pKZkpJj8) e as velas com o piano (*During*, rCX_nOPnSNA).
**Weddings fica a 002** (é o arco do Work, #81). Owner, 23/11: "vamos mudar a imagem do artists que sugeriste e a experiences ser a
E1". README #129; medidas em `v5-tests.md`, "As lâminas da entrada com as fotografias do Work".

- **Mudou:** `scripts/images.mjs` (`mono: true` nas duas entradas), `content/v5.ts` (`entrance.blades`: imagens e enquadramentos),
  16 derivados novos em `public/media/v5/work/` (`artists-moment-photo-mono-*`, `experiences-during-photo-mono-*`), docs (README #129,
  `assets.md` §3, `storyboard.md` E4, `v5-tests.md`).
- **Visto:** os 18 tamanhos, sem JS, movimento reduzido, teclado e contraste dos nomes (Chrome no segundo monitor, `next start`;
  ferramentas em `D:\STUDIO-tools\v5-blades\`). typecheck, lint e build passam.
- **Visto no Mac (23/11, noite; owner: "quero que vejas nesta máquina alguns testes básicos… porque conseguimos testar também safari
  e ios"):** typecheck, lint e build passam; a bateria do condutor no Chrome sem falhas; o **Safari do desktop** (no ecrã, trackpad), o
  **simulador iOS 27.3** (dedo) e o **Xiaomi** (Chrome): as lâminas novas carregadas e nítidas, um toque em cada lâmina leva ao seu
  capítulo, a página inteira por passadas até ao fim e de volta, sem erros. Números em `v5-tests.md`, na mesma secção.
- **Falta:** (1) o owner ver no iPhone dele (o simulador não é o veredicto); (2) decidir se saem os derivados de IA que ficaram sem uso
  (`artists-always*`, `experiences-during*`). Os 16 derivados novos entraram com `git add -f` (`public/media/v5/` está no
  `.gitignore`); qualquer derivado novo tem de entrar assim.

## (antes) COMEÇAR AQUI · 23 de novembro de 2026, fim do dia — sessão fechada; tudo em commit e com push (`v5` = `master` = `91b927b`)

*(Reposto a 23/11, noite: este resumo foi escrito no fim da sessão no Mac e nunca entrou em commit; perdeu-se quando o `v5` recebeu `a4445bc` do outro PC. Recuperado do registo da sessão, sem mudanças.)*

**Estado numa frase.** O site publicado (`master`) tem o condutor como scroll do desktop, a barra do Safari do desktop igual à página, e
os telemóveis com o scroll do browser e três correções de cor (Android: o 9 e a barra do Chrome; iOS: a faixa da ilha na volta do 7).
Nada por fazer que o owner tenha pedido. Fora de propósito, como sempre: a alteração do `.gitignore` do owner e `cenas/.back-frame.png`.

### O que se fez nesta sessão (por ordem; os testes de cada ponto em `v5-tests.md`)
1. **Passo 4 do condutor** (Questions e Contact) aprovado pelo owner no desktop.
2. **As cores da barra do Safari no desktop, por números (ΔE2000; o owner é daltónico)** — o Safari 27 mostra a cor do body +8 por canal com
   a página fora do topo: body e faixa pintados 8 abaixo; as cenas dizem o topo como se vê (o estúdio na largura toda, a luz redonda do 11,
   o grão e a luz do About, o Contact na largura toda). **Defeito antigo de produção corrigido:** o minificador escreve `--m-key` em
   `#rrggbbaa` e o `parseColour` não o lia (a luz da hora faltava na cor do Method, em todos os aparelhos). Barra contra página 0,0–1,5 em
   todas as paragens (era 1,0–3,6). Commit `2f6ab1d`.
3. **Passo 5: o scroll antigo do desktop saiu** (`motor.ts`, o governador da roda de `finger.ts`, `?cenas`); o condutor corre em qualquer
   desktop, só a pega do laboratório fica em `localhost` (README #127, `CLAUDE.md` corrigido nessa linha). Commit `5db1bdc`; o `master`
   passou a ser o `v5`.
4. **O telemóvel fica com o scroll do browser** (README #128): o condutor no telemóvel foi pesado (adaptador de toque novo, perdas do scroll
   nativo, ~2–3 semanas) e o owner decidiu não o fazer por agora; se voltar, primeiro um protótipo só de Work → Method em `localhost`.
5. **Android (Xiaomi):** o 9 em ecrã inteiro sem os cantos arredondados (o cartão cresce ×1,049); a barra do Chrome a acompanhar o escuro do
   11 (era em escada) e a chegar ao 9 0,22 s depois da imagem (era ~0,9 s) — medido lado a lado com o commit anterior servido na 3101; o
   custo: ~2 fotogramas a mais por passagem no Xiaomi. Commit `8609088`.
6. **iOS:** na volta do 7 para o Work a faixa da ilha era uma barra de cor lisa; agora a aresta da luz atravessa-a como na ida (o palco
   fica `sticky` — o Safari não desenha um palco `fixed` atrás da ilha com a página a mexer — e a cor da página é a do Work desde o início
   da volta). Commit `91b927b`.

### Fechados pelo owner nesta sessão (sem nova medida)
O bug A (a fotografia *Before* das Experiences), o C (os ~50 ms do Safari por mudança de fase do Method; continuam medidos 51–85 ms no
laboratório, a mesma faixa de 22/11), a cor do filme na barra do Safari depois do caminho de volta, o M8.

### Não verificado (ficou dito ao owner)
O modo escuro do macOS e "Reduzir transparência" (o +8 do Safari foi medido em modo claro, neste MacBook); outros ecrãs; no iOS, uma
passada fortíssima que leve a página para lá da cena do Method (aí o palco passa a `fixed` e a faixa volta a ser uma cor, agora a do Work).

### Para retomar o laboratório
- `zsh docs/development/ios-lab/desk/rebuild.sh` (o `next start` na 3100). O proxy da consola (3130) a correr serve as gravações do iPhone
  (`http://192.168.1.5:3130/__diag/enviar`); **reiniciá-lo antes de usar o simulador** (um proxy de dias guarda comandos velhos que deixam
  as páginas novas em branco).
- Ferramentas novas em `desk/cenas/tint/` (README, secções de 23/11): `walkbar4.sh` + `barstops.py` (barra contra página, ΔE), `calib.*`
  (o que o Safari faz à cor), `edgeprobe.*`/`edgecurve.mjs` (as cores das cenas em headless), `bodyshow.*` (o body nunca à vista),
  `xiaomi-theme.mjs`/`xiaomi-11.mjs` (o Xiaomi por adb: a barra do Chrome por `screencap`/`screenrecord`), `phoneprobe.mjs`. Para comparar
  com o commit anterior: um worktree ao lado (`git worktree add --detach <dir> HEAD`, `cp -cR node_modules`, `next build`, `next start -p
  3101`, `adb reverse tcp:3101`) e as duas versões alternadas; apagá-lo no fim (`git worktree remove`).
- As gravações e capturas (vários GB) ficam fora do repositório, em `~/.local/share/v5-lab/` (`tint-runs-23nov/`, `rec/`).

### Próximo
O que o owner quiser. Sem pendentes da parte dele além de, se lhe apetecer, ver o site publicado no desktop (Chrome e Safari) e nos
telemóveis depois do deploy.

## (antes) COMEÇAR AQUI · 23 de novembro de 2026 — o condutor é o scroll do desktop (passo 5) e as cores da barra do Safari; tudo no `v5` e no `master`

**Estado numa frase.** Por cima do passo 4 (aprovado pelo owner no desktop a 23/11, sem commit), a barra do Safari no desktop iguala a
página: ΔE2000 barra contra o topo 0,0–1,5 em todas as paragens com a página fora do topo (era 1,0–3,6), Experiences 2,3 (era 3,3), de dia
e de noite, nos dois sentidos, com e sem condutor; entrada → Work sem o degrau de +6; 11 ↔ 12 a acompanhar a página. Tudo em `v5-tests.md`,
"As cores da barra do Safari no desktop, medidas por números"; o laboratório em `desk/cenas/tint/` (README, secção de 23/11).

**O que se descobriu.** (1) O Safari 27 mostra na barra a cor pintada **+8 níveis por canal**, com a página fora do topo; ~85 % vem do
fundo do body, o resto da faixa acima do ecrã. Body e faixa pintados 8 abaixo → barra = página (o body nunca se vê: auditado em 4
tamanhos, com e sem condutor). (2) **Defeito em produção, anterior:** o minificador escreve `--m-key` como `#ffc48c42` e o `parseColour`
não o lia — a cor do topo do Method nunca levou a luz da hora, também no iPhone e no Android (corrigido em `lib/top-colour.ts`).
(3) As cenas diziam mal o seu topo no desktop: o estúdio (só o meio), o 11 (sem a sua luz redonda), o About (sem o grão e sem a luz que
leva), o Contact (o quarto liso, ~10 abaixo).

### Em commit (owner, 23/11: "podemos fazer commit e push") — um só commit no `v5`, o passo 4 e as cores; o push pelo GitHub Desktop do owner
- O passo 4 (a secção abaixo): `contact-client.tsx`, `conductor.ts`, `questions.css`, o laboratório e os docs.
- As cores da barra: `src/lib/top-colour.ts` (`parseColour` com #rgb/#rgba/#rrggbbaa; `SAFARI_BAR_LIFT`, `underSafariBar`),
  `src/components/entrance/sequence.ts` (`barInk`: body e faixa 8 abaixo fora do topo, nada nas Questions sem a faixa; o About que sai
  diz o topo no Method), `method/method-stage.ts` (`wide`, a luz em 8 pontos, `darkTop`), `about/about-stage.ts` (`GRAIN`, `glowOver`,
  `leaving`), `contact/contact-client.tsx` (`roomTop` na largura toda no Safari do desktop, `deskRoom`, a compensação na passagem).
- Laboratório: `tint/` `calib.html`/`.sh`/`.py`, `which.sh`, `walkbar4.sh` (`CEN=0`), `barstops.py` (médias verdadeiras), `barcols.py`,
  `barstops_lab.py`, `edgeprobe.mjs`/`.py`, `edgecurve.mjs`, `bodyshow.mjs`/`.py`, `tinyproxy.mjs` (`hour=`, `nocomp`); `h.mjs` (`W`/`H`).

**Owner, 23/11:** "parece-me bem em desktop" — as cores da barra aprovadas no desktop. **Xiaomi verificado** (ΔE ≤ 1,1 no Method e no
About às 10 h e às 22 h; o 7 à noite 2,2 → 1,1 com o `parseColour`). **iPhone:** no simulador (iOS 27.3) a cor pintada não se vê à volta
da ilha nem sob a barra — o Safari mostra a própria página — logo nada muda à vista; falta o owner no seu iPhone (`http://192.168.1.5:3100/`,
gravações por `http://192.168.1.5:3130/__diag/enviar`; o proxy 3130 reiniciado a 23/11: o de 17/11 tinha comandos velhos na fila que
deixavam em branco cada página nova).

### O que o owner deve experimentar (Safari, `http://localhost:3100/?cenas` e `?cenas=0`, de dia e de noite se possível)
A linha entre a barra do Safari e a página em cada paragem — sobretudo as escuras (o Work, o Method de noite, o 11, o About, o Contact) e a
passagem da entrada para o Work. Os números estão no `v5-tests.md` (o owner é daltónico: os números contam mais do que o olho).

**Owner, 23/11 (depois do push de `2f6ab1d`):** "prefiro limpar o scroll antigo desktop e só depois ligar o condutor [no] master". E: o bug A,
o C, a cor do filme na barra do Safari depois do caminho de volta e o M8 "já não são problemas, parecem resolvidos" — fechados pelo owner
(não medidos de novo). O 9 e o Method de dia no telemóvel (3–4 níveis acima do topo no Xiaomi): ver o ponto 4 abaixo.

### Por fazer, por esta ordem
1. ~~**O owner experimenta.**~~ Aprovado (desktop, Xiaomi); em commit e com push. Falta o owner no seu iPhone, se quiser.
2. **Passo 5 — feito e aprovado (owner, 23/11: "parece-me bem vi no chrome e safari podemos avançar commit eu dou push e depois merge
   para o master"); em commit no `v5`, e o `master` avançado até ele (fast-forward, local; o push dos dois pelo owner).** `v5-tests.md`
   "Passo 5 do condutor", README #127. Plano que foi seguido: limpar o scroll antigo do desktop, no `v5`, e com isso o condutor passa a ser o scroll do desktop (sem o portão de
   `localhost` nem `?cenas=0`); o `master` fica como está até tudo validado. Plano (23/11): fora `motor.ts` e o governador da roda de
   `finger.ts` (`governWheel`, `onWheelStroke`, `data-wheel-held`), o `?cenas`; dentro das cenas, os ramos só do desktop sem condutor. Ficam
   o que o telemóvel usa (`watchFinger`/`fingerDown`, `hold.ts` — a passagem do Work no Android —, os encaixes do iOS) e o caminho sem
   condutor para o reduced motion no desktop (e o caso "sem a faixa" do `barInk`, que é também o dele).
3. ~~**Ligar no `master`:**~~ feito com o passo 5 (o `master` = o `v5`; o site publicado passa a ter o condutor quando o owner fizer push). Era: o `v5` para o `master` depois da validação completa (Chrome e Safari no ecrã, resoluções, teclado, reduced
   motion, sem JS, o Xiaomi e o iPhone sem mudanças).
4. ~~**Passo 6, o telemóvel.**~~ Não se faz por agora (owner, 23/11: "acho que o telemóvel está bem… deixamos assim", README #128). O 9 e o
   Method de dia no Xiaomi (a barra do Chrome 3–4 níveis acima do topo, ΔE ≤ 1,1): explicado ao owner; fechar a menos que ele veja a linha.
5. **O telemóvel, dois bugs do owner (23/11, Xiaomi) — feitos e aprovados ("vi no xiaomi perfeito"), em commit no `v5` e no `master`** (`v5-tests.md` "O telemóvel: o 9 sem cantos e a
   barra do Chrome no 10 → 11"): o 9 em ecrã inteiro sem os cantos arredondados; a barra do Chrome a acompanhar o escuro do 11 sem escada,
   e no 8c → 9 a chegar 0,22 s depois da imagem (era ~0,9 s).
   O condutor no telemóvel: pesados os custos, o owner decidiu deixar o telemóvel como está ("então para já vamos deixar assim no
   telemóvel", README #128).
6. **iOS, a faixa da ilha no caminho de volta 7 → Work (owner, iPhone, 23/11) — feito e aprovado ("perfeito ficou resolvido"), em commit no `v5` e no `master`** (`v5-tests.md` "iOS: a
   faixa da ilha no caminho de volta"): o palco fica `sticky` (o Safari desenha-o atrás da ilha) e a cor da página é a do Work desde o início
   da volta — a aresta da luz atravessa a faixa como na ida.
   Não medido: o modo escuro do macOS e "Reduzir transparência" (o +8 é do modo claro).

## (antes) COMEÇAR AQUI · 23 de novembro de 2026 — passo 4 do condutor aprovado pelo owner no desktop (Questions e Contact; sem commit)

**Estado numa frase.** Commit `55a11b7` no `v5` (B, três bugs, a barra do Safari, o espelho; push do owner). Por cima, sem commit, o
**passo 4**: o Contact regista-se no condutor; Questions ↔ Contact muda de uma vez, sem se ver, e a passagem toca pelo relógio desde a
passada; 14 → Questions e Contact → fim deslizam; a caixa das perguntas segura no centro (`questions.css`). Medido headless e no ecrã
(Chrome e Safari, trackpad real) — `v5-tests.md` "Passo 4 do condutor". Ferramenta nova: `desk/cenas/cases-contact.mjs`.

**Owner, 23/11:** "teste desktop safari e chrome parece-me bem" — o passo 4 aprovado no desktop (Chrome e Safari). Sem commit até o
owner o pedir. A seguir: o acerto das cores da barra do Safari (ponto 2 abaixo).

### Por gravar (sem commit; o owner pede o commit)
- `src/components/contact/contact-client.tsx` — `registerScene` (o `to`, o `busyUntil` com `IN_SEEN`/`BACK_SEEN`, a caixa segura com
  `translate`), `driven = cenasOn()`, `go(to, now)`, as retenções e o `place()` da passagem só sem condutor, `watchIn()` ao montar.
- `src/lib/conductor.ts` — `HELD` em grupos + `heldBetween`; `legacyBusy` só a entrada; o cabeçalho.
- `src/components/questions/questions.css` — `:root[data-js] .questions .q-box` no bloco ≥ 900 px (a caixa segura no centro).
- Laboratório: `desk/cenas/cases-contact.mjs` (novo), `held.mjs` e `contact-old.mjs` (novos), `h.mjs` (`dk`, `run` no estado e no
  `expected`; o `rest` espera pelo `cRun`), `passadas/saf.mjs` (a cadeia do owner `C`/`c`), o README do laboratório.
- Docs: `v5-tests.md` "Passo 4 do condutor", este handoff.
- Fora de propósito, como sempre: a alteração do `.gitignore` do owner e `cenas/.back-frame.png`.

### O que o owner deve experimentar (`http://localhost:3100/?cenas`, Chrome e Safari, trackpad)
1. Do About (14) às Questions: o papel sobe (deslize, como antes).
2. Uma passada nas Questions: a página fica, as perguntas desaparecem no lugar, a luz desce, o filme, a pergunta, a linha e *Talk to us*
   — começa logo na passada. Passadas durante isto não levam ao colofão até o *Talk to us* estar visto (~2,6 s).
3. Uma passada para cima a meio: a passagem volta de onde está; as perguntas voltam.
4. No Contact, uma passada: o colofão entra (deslize); para cima volta ao Contact.
5. Do Contact para cima: as perguntas voltam (~0,9 s); só depois uma passada leva ao About.
6. O menu para 05 Contact e de volta: lá de uma vez, sem animação. `?cenas=0` volta ao site atual.
Se algo não estiver bem: o que fez, em que browser, em que paragem (uma gravação do ecrã ajuda).

### O laboratório (para retomar)
- `next start` na 3100 com o código do passo 4 (`zsh docs/development/ios-lab/desk/rebuild.sh` reconstrói). Chrome headless na 9333, Chrome do
  laboratório na 9223 (`~/.local/share/v5-lab/chrome.pid`). O proxy do Safari (3146) e o proxy simples (3147) desligados: ligam-se por corrida
  (`node docs/development/ios-lab/proxy.mjs 3146 3100`; `desk/cenas/tint/tinyproxy.mjs`). Se o Mac reiniciou, voltar a ligar o 3100 e os Chromes.
- Bateria depois de qualquer mudança: `walk1`, `cases`, `cases-method`, `cases-about`, `cases-contact` (também `W=375 H=667` e `W=1024 H=768`),
  `smoke`; no ecrã `passadas/rec.mjs` e `saf.mjs` com `PX=0.15 PY=0.85` (o diálogo do FortiClient no meio do ecrã).

### Por fazer, por esta ordem
1. ~~**O owner experimenta** (acima).~~ Aprovado no desktop (23/11). Commit quando pedir.
2. **O acerto das cores da barra do Safari** (owner, 22/11: as escuras, e a passagem entrada → Work) — medido por números (ΔE por cena;
   o owner é daltónico), não a olho.
3. **Ligar o condutor para os visitantes no desktop** (`cenasOn()` só em `localhost` hoje): decisão do owner; antes, a validação completa
   no ecrã (Chrome e Safari, as resoluções mais usadas, teclado, reduced motion, sem JS).
4. **Passo 5 — limpar o scroll antigo do desktop** (`finger.ts` governWheel, `hold.ts`, `motor.ts`, as retenções `cHold`/`cOn` do Contact,
   as regras de encaixe do desktop); o telemóvel e o reduced motion ficam com o scroll do browser.
5. **Avisar o owner antes do passo 6, o telemóvel.** Em aberto de antes: bug A, C, M8, a entrada do Safari depois do caminho de volta.

## (antes) COMEÇAR AQUI · 22 de novembro de 2026, fim da noite — a barra do Safari no desktop acompanha a página

**Estado numa frase.** Por cima do B e dos três bugs (tudo sem commit desde `77b435b`), a barra do Safari no desktop muda de cor suave e
no tempo de cada cena, nos dois sentidos: `sequence.ts` (a cor movida frame a frame), `method-stage.ts` (o feixe do 7: a parte do topo
iluminada), `about-stage.ts` (seguida a cada frame; o palco recortado sob o papel das Questions), `contact-client.tsx` (o anoitecer pintado
frame a frame), `bar-client.tsx`. Medido no ecrã, `v5-tests.md` "A barra do Safari no desktop acompanha a página".

**Owner (depois):** "a cor da barra não está claramente igual nas cenas… na cena 13 consigo ver cards da cena anterior na barra… blur em
background… investiga… não implementes". **Investigado** (`desk/cenas/tint/` README, "What Safari 27's bar really shows"): a barra do
Safari 27 é vidro sobre o conteúdo da página que já passou para cima do ecrã, no fluxo (não os sticky/fixed), blurado e esbatido, com
a forma que tem (esquerda fica à esquerda). As cenas do site são sticky: a barra mostra o que ficou no fluxo acima da paragem — no 13 o fim
do Method com os cartões do 11. Possível: um elemento do próprio documento posto logo acima do ecrã, com o topo da cena (cor, e até o
rebordo do feixe), e a barra mostra-o — o "ecrã inteiro" do iPhone, esbatido pelo vidro. No topo da página (scroll 0) não há onde o pôr.
Por decidir pelo owner (proposta na conversa de 22/11). **Feito a seguir** (owner: "bora fazer isso com o condutor"): o espelho
(`#c1-feed`, `lib/conductor.ts` + `sequence.ts` + `method-stage.ts` + `contact-client.tsx`), medido — `v5-tests.md` "O espelho acima do
ecrã". **O topo da página** (scroll 0): owner, 22/11: "eu não metia nada na entrada, acho que o Safari está a escolher bem a cor… a transição
para o Work é que se nota… a cor do topo poderia dar um match melhor com cada instância do site, especialmente nas mais escuras" (o owner é
daltónico: medir, não confiar no olho). Por fazer depois do passo 4: o acerto das cores (sobretudo as escuras) e a passagem entrada → Work.

### Por fazer, por esta ordem
1. **O owner experimenta** no Safari (`http://localhost:3100/?cenas`, a página carregada de novo): o B, os três bugs e a barra. Commit quando pedir.
2. **A entrada no Safari:** no caminho de volta Weddings → topo o Safari salta para a cor do filme e fica com ela (do Safari; ver
   `v5-tests.md`). Investigar o que o faz ler o filme (a entrada mostrada de novo) e se há maneira de o evitar.
3. **C:** porque o Safari leva 33–57 ms a desenhar cada mudança de fase do Method. **O site sem condutor:** `finger.ts` com a regra antiga.
4. Depois, o que estava (abaixo).

## (antes) COMEÇAR AQUI · 22 de novembro de 2026, noite — B e três bugs do owner corrigidos (por aprovar, sem commit)

**Estado numa frase.** Por cima do B (o detetor de passadas, `src/lib/strokes.ts`), três bugs do owner corrigidos e vistos no ecrã:
(1) o cartão do Weddings saltava no fim da passagem quando o ponteiro estava sobre ele (`work-client.tsx`: `holdLook`, `pathNow`); (2) a
barra do Safari a piscar no 10 → 11 (`method-stage.ts`: a cor seguida a cada frame no desktop); (3) o "I'm Flávio." visível no 13 → 11
rápido no Safari (`about-stage.ts`: `fadeTo`). Tudo em `v5-tests.md`, "Três bugs do owner (22/11, noite)". Nada em commit desde `77b435b`.

**Owner (depois):** 1 e 3 corrigidos. Para o 2 quer a barra do Safari no desktop a adaptar-se à cor como no telemóvel em ecrã inteiro,
suave e a acompanhar as animações (o feixe do 7) — "não implementes, investiga se é possível". **Investigado** (`desk/cenas/tint/`,
README): o Safari 27 do desktop pinta a barra com **uma só cor** — o fundo do html/body, ou o de um elemento fixo/sticky com a largura toda
no topo (≥ ~20 px) —, ignora o `theme-color`, não vê imagens, gradientes nem as animações das camadas (transform, opacity, clip-path), mas
**segue suave** uma cor de fundo que muda (transição CSS ou a cada frame). O site já muda a barra secção a secção (pelo html), de uma vez
fora do Method. Possível: todas as mudanças suaves e ao tempo da cena, o 7 como um esbater da barra ao passo do feixe pelo topo (não o
rebordo a atravessá-la); a cor é a tinta do Safari (Method 200 → 207, Questions 224 → 193), não a exata — a exata pede um elemento fixo
visível no topo (escondido por baixo do body o Safari ignora-o). Por decidir pelo owner.

### Por fazer, por esta ordem
1. **O owner experimenta** (`http://localhost:3100/?cenas`, Chrome e Safari): o B e os três bugs. Commit quando pedir.
2. **C (à parte):** porque o Safari leva 33–57 ms a desenhar cada mudança de fase do Method (e frames longas na cauda).
3. **O site sem condutor:** `finger.ts` com a regra antiga de passadas — decidir com o owner.
4. Depois, o que estava (abaixo).

## (antes) COMEÇAR AQUI · 22 de novembro de 2026, fim da tarde — B feito: o detetor de passadas imune aos eventos juntos (por aprovar, sem commit)

**Estado numa frase.** O A está no `v5` com push do owner (`77b435b`: o passo 3 do About e as esperas das fases do Method). O B está feito
por cima, sem commit: `src/lib/strokes.ts` (novo), o detetor de passada nova do condutor, lido na hora dos próprios eventos e com um veto
para os eventos que o browser junta. `v5-tests.md`, "B — o detetor de passadas imune aos eventos juntos".

### Feito (sem commit)
- `src/lib/strokes.ts` + `conductor.ts` (só chama o detetor). Banco de ensaio: 39 corridas reais (691 passadas) 30/39 → 39/39; perfis
  43 → 45/45; 76 casos feitos à medida 50 → 70; o código do site igual à variante do banco em 109 435 eventos. No ecrã: Safari 97 → 97
  (a regra de antes daria 103), Chrome 62 → 62.
- `docs/development/ios-lab/desk/cenas/passadas/bench/` (o banco: `node bench.mjs prod`; `python3 syn.py` primeiro). As gravações das
  corridas em `~/.local/share/v5-lab/rec/passadas/` (fora do repositório).
- `cases-method.mjs`: o caso E passa a ser "uma passada 0,12 s depois não mexe nada".

### Por fazer, por esta ordem
1. **O owner experimenta no trackpad** (`http://localhost:3100/?cenas`, Chrome e Safari; o 3100 tem este build). Commit quando pedir.
2. **C (à parte):** porque o Safari leva 33–57 ms a desenhar cada mudança de fase do Method (e frames longas na cauda, ~2 s depois).
3. **O site sem condutor** (o dos visitantes): `finger.ts` tem a regra antiga do motor no governador; decidir com o owner se leva o mesmo
   detetor (precisa da sua própria ronda de testes) ou se espera pelo condutor ligado para os visitantes.
4. Depois, o que estava: o percurso inteiro do passo 3 no ecrã, passo 4 (Questions e Contact), passo 5, ligar o condutor para os
   visitantes, avisar antes do passo 6 (o telemóvel); o bug A e a validação final M8.

## (antes) COMEÇAR AQUI · 22 de novembro de 2026 — passadas no Method com o condutor: A feito (por aprovar, sem commit), B por fazer

**Estado numa frase.** O owner experimentou `?cenas` no trackpad (Chrome e Safari): as transições bem, mas no Method, com passadas fortes
para trás e para a frente a meio das animações, às vezes 9 → 11 e as folhas a abrir todas juntas. Duas causas medidas (`v5-tests.md`,
"Passadas no Method com o condutor"): **(1)** nada segurava a página entre o 8a e o 10; **(2)** passadas fantasma — no Safari as frames
longas juntam eventos da roda e o detetor do condutor lê a soma como uma mão nova. O owner escolheu fazer A e depois B.

### Feito hoje (sem commit, por cima do passo 3 também sem commit)
- **A:** `method-stage.ts` + `conductor.ts` — cada mudança de fase do Method toca até estar vista (95 % do caminho das suas próprias
  animações: 8a–9 ~0,64 s, 10 ~1,49 s com as três linhas da capa) antes de uma passada seguir no mesmo sentido; voltar atrás imediato; sem
  descanso de 1,2 s ao voltar atrás a meio de uma fase (`Scene.turnBack`, só a luz o mantém). Headless 9/9 (`cases-method.mjs`, novo) e a
  bateria antiga verde; no ecrã Chrome e Safari com trackpad: nada saltado, nada antes de estar visto; rajadas gravadas por ordem.
- Ferramentas: `docs/development/ios-lab/desk/cenas/passadas/` (o registo na página, Chrome e Safari, passadas de 8 ms, o detetor offline).
- `cases-about.mjs`: uma variável sem uso tirada (o lint de `.` avisava).

### Por fazer, por esta ordem
1. **O owner experimenta o A no trackpad** (`http://localhost:3100/?cenas`, Chrome e Safari; o 3100 já tem este build).
2. **B — o detetor de passadas imune aos eventos juntos** (`conductor.ts` `onWheel`): as passadas fantasma que restam vêm da cauda do momento
   (Safari, frames de 57–65 ms 2–2,5 s depois de uma mudança: 8c → 8b e 11 → 12 sem passada). A janela de velocidade de 48 ms pela hora
   dos eventos (`e.timeStamp`) é uma direção: acertou nas 171 passadas mas falhou nos perfis tremidos e em `owner-chrome-3` (7 de 12).
   Validar contra: todos os perfis (`prof.mjs`), `owner-chrome-3` = 12, as corridas de hoje (`cmp.mjs`), novas corridas no ecrã, e o owner.
3. **C (à parte):** porque o Safari leva 33–57 ms a desenhar cada mudança de fase, e as frames longas na cauda (~2 s depois).
4. Depois, o que estava: fechar o passo 3 no ecrã (o percurso inteiro), passo 4 (Questions e Contact), passo 5, ligar o condutor para os
   visitantes, avisar antes do passo 6 (o telemóvel); o bug A e a validação final M8.

### O laboratório
- Um pop-up do FortiClient ("Permission is required for full protection") apareceu a meio do ecrã e engoliu as passadas sintéticas; não
  lhe mexi (é do owner). As corridas usam `PX=0.15 PY=0.85` para passar ao lado.

## (antes) COMEÇAR AQUI · 21 de novembro de 2026, fim da sessão — acabar o condutor: o passo 3 (About) feito, por aprovar, sem commit

**Estado numa frase.** No `master` e no `v5` (os dois em `b369426`, **com push do owner**, conferido no GitHub) está o site com o ajuste ao
ecrã (README #126) e todas as fotografias. Depois disso o owner decidiu **acabar o condutor** (`?cenas`) para tirar os fotogramas fora do
lugar nas paragens (o governador da roda, `v5-tests.md` "Os fotogramas fora do lugar nas paragens": com o condutor 0/12, sem ele 6/12).
**O passo 3 (Method → About) está feito e medido, mas não está em commit nem foi visto pelo owner.**

### Por gravar (não há commit: o owner pede)
- `src/components/about/about-stage.ts` — o About regista-se no condutor (`registerScene`): 12/13/14 a sua fase, Questions e abaixo → 14,
  acima → `pre`; `busyUntil`: a passagem do 12 (`passageEnds`, 2 s), a história do 14 (`storyEnds`, 1,6 s, +1 s vindo do 12), o regresso ao
  11 (`leaveEnds`, 2 s); no regresso o palco preso no topo (`holdAt`). Com o condutor não lê o scroll (só `edgeOnScroll`, a cor do topo);
  o teclado (foco no About) vai ao 14 por `goTo`. Sem `?cenas` tudo como estava.
- `src/lib/conductor.ts` — `HELD` com '12', '13', '14' (mudança de paragem sem se ver); o About saiu do `legacyBusy`.
- `docs/development/ios-lab/desk/cenas/h.mjs` (o `expected` verifica a fase do About) e `cases-about.mjs` (novo, 8 casos do About).
- `docs/development/v5-tests.md` ("Passo 3 do condutor") e este handoff.
- Fora de propósito, como antes: a alteração do `.gitignore` do owner (abaixo, "O estado do Git") e `cenas/.back-frame.png`.

### Medido no passo 3 (detalhe em `v5-tests.md`)
Headless contra `next start`: `walk1` 0 falhas (todas as paragens, os dois sentidos, o About certo); `fast` (rajadas 0,3 s, ritmo 1,3 s, as
cadeias do owner) coerente, 0 fotogramas longos; `cases` 28/28; `cases-about` 8/8; `smoke` sem erros. No ecrã (trackpad real, `fit/tears.sh`
com `CENAS=1`): fronteira 11 ↔ 12, **0/22 rasgos no Chrome e 0/22 no Safari**; a ida ao 12 e o regresso com o ritmo de sempre (o escuro de
~0,3 s antes de o 11 voltar é do desenho: igual sem condutor).

### Por fazer, por esta ordem
1. **Fechar o passo 3 no ecrã:** o percurso inteiro (topo → fim → topo) ao ritmo do owner (~1,3 s entre passadas) e com passadas rápidas, no
   Chrome e no Safari reais (`cenas/screen.mjs`, `glitch.mjs`, `fit/tears.sh CENAS=1`); voltar atrás a meio da passagem do 12 e da história do 14.
2. **O owner experimenta no trackpad:** `http://localhost:3100/?cenas` (Chrome e Safari; `?cenas=0` volta ao site atual). Commit só quando pedir.
3. **Passo 4 — Questions e Contact** ligados ao condutor (hoje ainda leem o scroll: `contact-client.tsx` `cRun`/`cHold`, o `legacyBusy` do
   condutor; as paragens `questions`, `q1…`, `contact`, `end` deslizam). Ler `contact-client.tsx` (487 linhas) e `questions-client.tsx`.
4. **Passo 5 — limpar o scroll antigo** quando o condutor for o do desktop: `finger.ts` governWheel, `hold.ts`, `unsnapped.ts`, `motor.ts`, as
   regras de encaixe (`method.css`, `work.css`, `about`), o `data-passage`/`data-story` que só servem o encaixe.
5. **Ligar o condutor para os visitantes no desktop** (hoje `cenasOn()` só em `localhost`, `conductor.ts`): decisão do owner, depois de 1–4;
   reduced motion e telemóvel continuam com o scroll do browser.
6. **Avisar o owner antes do passo 6, o telemóvel** (memória `announce-phone-step`).
7. Ainda em aberto de antes: o **bug A** (a fotografia do *Before* de Experiences salta no desktop) e a **validação final M8**.

### O laboratório neste Mac (para retomar)
- `next start` na 3100 com o código do passo 3 (build de hoje). Reconstruir: `zsh docs/development/ios-lab/desk/rebuild.sh`.
- Chrome headless na 9333 (sem separadores; 100 que lá estavam desde 16/11 foram fechados). Chrome do laboratório na 9223 (janela 1728 × 1029).
  O Safari fica minimizado na Dock: `fit/tears.sh` tira-o e volta a pô-lo (com outro script, tirá-lo antes, senão grava-se o Chrome por trás).
- Ferramentas novas de hoje: `fit/` (sondas de resoluções `mprobe`/`wprobe`/`pprobe`; `seam.mjs` registo por fotograma no Chrome real;
  `tears.sh` + `perstroke.py` rasgos por passada) e `cenas/cases-about.mjs`. Passadas sintéticas no headless não servem o governador do site
  atual (só o condutor); para o site atual, sempre o trackpad real.

## (antes) COMEÇAR AQUI · 21 de novembro de 2026 — o site nas resoluções mais usadas: o Method e o Work ajustados ao ecrã (aprovado, README #126; em commit no `master` e no `v5`)

**Estado numa frase.** O owner encontrou o bug do Method ("no 8 e 9… em ecrãs 1080p e menores os cards ficam acima do text input 'make it
yours'", Chrome e Safari desktop) e pediu "todos os cenários… responsive… assegurar as resoluções mais usadas sempre". Medido: **todos os
desktops abaixo do 1440p dele** partiam o 8 (1920 × 1080 a 1280 × 590), e o Work (Weddings · Before) passava o pé do ecrã de 1280 a 1536 de
largura. **Corrigido, medido e visto no ecrã** (Chrome real a 1728 × 942 e 1366 × 633, Safari real a 1728 × 977); **o ecrã do owner igual ao
píxel**; telemóveis iguais linha a linha. Tudo em `v5-tests.md`, "O site nas resoluções mais usadas". **Aprovado pelo owner** ("verifiquei
desktop parece bem") e **em commit**: o `v5` avançou até ao `master` (as fotografias do owner) e a correção foi por cima; o `master` = o `v5`.

### O que mudou (README #126)
- `src/components/method/method-stage.ts` — `fitDesk`/`fitted`/`placed`: o baralho do desktop (7–9) escalado como um todo entre o campo e o
  pé do ecrã; o 10 entre a barra e o pé. Volta a medir com qualquer mudança de altura no desktop e quando as fontes chegam.
- `src/components/work/work.css` — `.w-ln { max-width: 29.07em }` (era `calc(40 * var(--u))`; igual no ecrã do owner).
- `docs/design/v5/acceptance.md` e `CLAUDE.md` — a lista de resoluções de validação com as mais usadas; memória `most-used-resolutions`.
- `docs/development/ios-lab/desk/fit/` — as três sondas (Method, Work, página inteira) e o README.

### Por fazer, por esta ordem
1. ✅ **O owner viu e aprovou** (21/11); em commit no `master` e no `v5`.
2. **Os fotogramas fora do lugar nas paragens — causa medida, por decidir** (`v5-tests.md`, "Os fotogramas fora do lugar nas paragens"):
   o governador da roda (`lib/finger.ts`) leva a página à paragem de uma vez no mesmo fotograma em que a segura, e o browser desenha 1–2
   fotogramas com um palco preso deslocado o tamanho do salto (Chrome e Safari; o regresso a Experiences ~1/2 a 1/3, a fronteira 11 ↔ 12
   6/12). Saltar 1–2 fotogramas depois tira-o no Method, mas a inércia passa a levar a página para lá da paragem e as cenas entram na fase
   seguinte e voltam: revertido. **Com o condutor (`?cenas`) a mesma série dá 0/12 e 0/12.** O owner decide: mais experiências com a
   maneira de segurar a página, ou acabar o condutor (passos 3–5 no desktop: Method → About, Questions e Contact, limpar o scroll antigo)
   e ligá-lo para os visitantes no desktop.
3. Depois, o que já estava: **o bug A** (desktop, a fotografia do *Before* de Experiences salta) e a **validação final M8** (abaixo).

### Passo 3 do condutor feito (21/11, fim da tarde) — por aprovar, sem commit
O About ligado ao condutor (`about-stage.ts`, `conductor.ts`): bateria headless verde, `cases-about.mjs` 8/8, e no ecrã 0 rasgos em 22
passadas no Chrome e no Safari na fronteira 11 ↔ 12. `v5-tests.md`, "Passo 3 do condutor". **A seguir:** o percurso inteiro no ecrã ao ritmo
do owner (Chrome e Safari) e o owner no trackpad (`http://localhost:3100/?cenas`); depois o passo 4 (Questions e Contact), o passo 5 (limpar
o scroll antigo), ligar o condutor para os visitantes no desktop; **avisar o owner antes do passo 6, o telemóvel**.

### O estado do Git e das fotografias
- O owner pôs as fotografias no `master` a 18/11 ("add photos", "add photos 2": os 157 derivados de `public/media/v5/` e 52 imagens de
  `docs/design/v5/storyboards/img/`). A 21/11 o `v5` avançou até ao `master` (avanço direto, sem conflitos) e a correção do ajuste ao ecrã
  foi por cima: **o `master` e o `v5` são o mesmo commit**, com todas as fotografias.
- **A alteração do `.gitignore` do owner continua por gravar** (de propósito): comenta as linhas das fotografias, mas também a de
  `/media-src/` — os originais, que o `CLAUDE.md` manda nunca entrar no Git (o repositório é público). Os ficheiros já seguidos não são
  afetados pelo `.gitignore`; um derivado novo precisa de `git add -f` até o owner decidir. Proposta: voltar a ignorar `/media-src/` e deixar
  só as fotografias derivadas de fora da lista.
- `docs/development/ios-lab/desk/cenas/.back-frame.png` (de 16/11, do laboratório) fica fora do commit, como estava.

## (antes) COMEÇAR AQUI · 18 de novembro de 2026 — o V5 passou para o `master` (migração completa, o site antigo substituído); falta o push do owner e a validação final

**Estado numa frase.** O owner decidiu lançar **com o scroll atual** (o que os visitantes têm; sem `?cenas` "o site parece super bem… passadas
rápidas estão sempre a travar nos sítios certos") e pôr o V5 no `master` ("o master está com o site antigo, por isso deve ser uma migração
completa"). Feito localmente: **o bug B corrigido e confirmado no iPhone do owner**; **as ferramentas de laboratório tiradas do site** — o
medidor de FPS e o gravador `?rec` apagados, `?cenas` e `?motor` só em `localhost`; o `master` avançado até ao `v5` (o `master` era `fe1bd33`,
exatamente o ponto de onde o V5 partiu: um avanço direto, sem conflitos, com o histórico todo). **O owner faz o push** do `master` e do `v5`
(GitHub Desktop). Nada de publicação automática no repositório (sem `vercel.json`, `netlify.toml` nem workflows) — mas se o alojamento estiver
ligado ao GitHub, o push do `master` pode publicar: o owner confirma do lado dele.

### Por fazer, por esta ordem (o caminho para produção)
1. **O bug A** (desktop, a fotografia do *Before* salta e fica maior ao entrar em Experiences, às vezes; ponteiro fora; Artists → Experiences
   por scroll normal) — medir primeiro; detalhe e suspeitos na secção "PRIORIDADE MÁXIMA" abaixo.
2. **Validação final (M8, `acceptance.md`):** todos os viewports, teclado (com o foco que salta para o `body` depois de Enter num nome de
   capítulo), movimento reduzido, sem JS (contra `next start`), contraste, Xiaomi e o iPhone do owner; os casos-limite do scroll atual registados
   a 15/11 (End/Home, uma passada logo a seguir a um salto do menu, uma passada forte no Xiaomi a saltar uma paragem no Method/About/Contact)
   e os três achados de 17/11 (a ilha da barra no Chrome, o foco, a passada a meio de um salto).
3. **A decisão do owner de publicar** (o alojamento, o domínio). O condutor (`?cenas`) continua no código, só em `localhost`, para depois do
   lançamento se fizer falta; o motor do telemóvel não se começa.

### Feito a 18/11 (depois de `ce1fe7b`)
- **Bug B (iPhone): o momento de Experiences preso na primeira entrada** — a ponte para o Method segurava-o pela posição (a inércia passava a
  paragem); agora segura-o só enquanto a luz do Method está por cima (a fase do Method). Medido (os temporizadores da página), visto a 402 × 874
  e no desktop, **confirmado pelo owner no iPhone**. `v5-tests.md`, "Bug B do owner".
- **O site sem instrumentos:** `src/components/fps-meter.tsx`, `src/lib/rec.ts`, `src/lib/rec-on.ts` apagados (o import no `bar-client.tsx` e
  o `<FpsMeter />` no `page.tsx` também); `?cenas` (`conductor.ts`) e `?motor` (`motor.ts`) só em `localhost`. As ferramentas do laboratório que
  usavam `?rec` (`collector.mjs`, `rec-read.mjs`, o `?rec` que `screen.mjs` acrescenta) ficam sem efeito; o gravador volta de `ce1fe7b` num ramo
  se for preciso, nunca para o `master` (CLAUDE.md). Visto: typecheck e lint limpos, build, smoke e cases sem erros, as seis secções no HTML
  sem JS, `?fps&rec` não mostra nada.

## (antes) COMEÇAR AQUI · 18 de novembro de 2026 (fim da sessão de 17–18/11) — PRIMEIRO os dois bugs do owner (A desktop, B iPhone), medidos antes de corrigir; depois o passo 3 (Method → About). Passos 1 e 2 do condutor fechados; os nomes do Work aprovados (#124 desktop, #125 telemóvel); tudo em commit

**Estado numa frase.** O condutor (`?cenas`, só desktop, README #119) está fechado do topo ao Method (passo 1, 16/11; passo 2, hoje) e
aprovado pelo owner no trackpad. Hoje também se fecharam os nomes dos capítulos do Work — no desktop uma fila em ordem que roda (#124), no
telemóvel uma roda calma (#125) — e dois defeitos do iPhone vistos nas gravações do owner. **Tudo em commit** (`0bb2541`, `e818f12`, `ce1fe7b`;
o owner fez o push). **Dois bugs novos do owner (18/11), prioridade máxima — abaixo.** Os números de cada teste: `v5-tests.md`, de "Passo 2 — Experiences ↔ Method no ecrã" ao fim.

### Por decidir pelo owner (18/11, fim da sessão): lançar com o scroll atual?
O owner quer pôr o site em produção o mais depressa possível ("ando há dias para trás e para a frente com correções mínimas") e, ao ver
`http://localhost:3100/` **sem** `?cenas`: "o site parece super bem, nem percebo a diferença". **Proposta feita (por confirmar):** não começar
o motor do telemóvel (o passo 6 é o trabalho mais longo e incerto; o telemóvel funciona com o scroll atual, afinado 7–13/11); **lançar com o
scroll atual** (o que os visitantes têm, desktop e telemóvel) depois de: (1) os bugs A e B; (2) a validação final M8 (viewports, teclado — com
o foco que salta para o `body` —, movimento reduzido, sem JS, Xiaomi, iPhone do owner), tirar o gravador `?rec` e o medidor de FPS, e
**restringir `?cenas` ao laboratório** (hoje qualquer pessoa o liga pelo endereço, e do About para baixo não está acabado); (3) a decisão do
owner de publicar. O condutor fica para depois do lançamento, se fizer falta. **Antes de decidir, o owner ia experimentar sem `?cenas`** os
casos que levaram ao condutor (14–16/11): passadas rápidas seguidas pelo Work e pelo Method até ao About; uma passada forte a partir do topo
(deve parar no Weddings com a passagem inteira); voltar atrás a meio de uma passagem (7 → Experiences com a luz a entrar); no Safari, uma
passada de inércia longa a entrar e a sair do Method. **Perguntar-lhe o resultado no início da próxima sessão.**

### ⚠ PRIORIDADE MÁXIMA na próxima sessão — dois bugs do owner (18/11), antes do passo 3. Não corrigidos (owner: "devem ser prioridade máxima, não corrijas nada agora")

**Bug A — desktop: ao entrar em Experiences, a fotografia do *Before* dá um salto e fica maior** ("às vezes"). **O que o owner sabe (18/11):**
acontece **com o ponteiro fora da fotografia**, **simplesmente a passar de Artists para Experiences com scroll normal** (uma passada do
trackpad, para baixo); **não acontece sempre** e ele não conseguiu perceber o que o dispara. Não reproduzido nem medido ainda. Por saber: qual
browser (Chrome, Safari, ambos?), com ou sem `?cenas` (o "scroll normal" pode ser o site sem o condutor — o que os visitantes têm). **Medir
primeiro** (memória `measure-before-fixing`): muitas passagens Artists → Experiences no ecrã, nos dois browsers, com e sem `?cenas`, passadas
suaves e fortes, depois de estadias curtas e longas em Artists (o momento em que se está ao passar pode contar: a fotografia, a peça, a troca
de momento a cada 6 s), gravadas e lidas fotograma a fotograma (a pilha de Experiences: tamanho e posição — um detetor como `arch-tone.py` /
`names-flash.py` para a caixa da fotografia); e o registo `?rec` da página (as animações da pilha, `getAnimations()`, o `transform` lido). Pedir
ao owner uma gravação quando voltar a acontecer (`/__diag/enviar`). **Suspeitos, por provar:** (a) o empurrão da luz do Method sobre a
fotografia de Experiences (`method-stage.ts` `pushPhoto`, escala 1 → 1,14, "a fotografia do guia avança um pouco") — se o Method achar que a
passagem começou (o 7) ou deixar o empurrão aplicado de uma vez anterior; (b) a subida da pilha na mudança de capítulo (`fly` / `stackFlights`
em `work-client.tsx`) a partir de um `transform` lido a meio de outra animação (a troca de momento, `change`, ou o empurrão); (c) a troca de
momento (`change`/`swapTimer`, a cada 6 s) a coincidir com a chegada. **Afastado pelo owner:** o "olhar" do ponteiro sobre a fotografia
(`.w-look`), porque o ponteiro estava fora.

**Bug B — ✅ CORRIGIDO 18/11 (por confirmar no iPhone do owner; `v5-tests.md`, "Bug B do owner"): a ponte segura o momento só enquanto a luz do Method está por cima (fase do Method), não pela posição. Texto original:** iPhone (iOS Safari): ao entrar em Experiences pela primeira vez, o segundo estado da animação nunca dispara — o *Before* fica na
fotografia, a peça não aparece e o tempo do momento não passa ao seguinte; **tocando num momento à mão, a partir daí tudo funciona.** Não
reproduzido ainda (Simulador, Xiaomi, iPhone do owner). **Suspeito forte, por provar:** a ponte para o Method (`work-client.tsx` `bridge` /
`checkBridge`, README #98, #102): segura o momento (`held = true`, `stop()`) quando o topo do Method passa o topo do ecrã estando em
Experiences; no iPhone (o Method sobre os últimos ecrãs do Work, a subida de 70 px, as barras do Safari) isso pode ser verdade já em repouso
em Experiences, e o momento fica preso; um toque num momento (`choose`) põe `held = false` e, como `bridged` fica `true`, a ponte não volta a
segurar — o que bate com "depois de mudar manualmente funciona". Medir: no Simulador (iPhone 17 Pro, `finger/sim.sh`) e no iPhone do owner,
`methodEl.getBoundingClientRect().top`, `bridged`/`held` e o tempo do momento ao chegar a Experiences pela primeira vez (por passada e por
toque no nome); e no Xiaomi. Os testes de hoje não olharam para o tempo dos momentos em Experiences.

### O que o owner quer (17/11) — ler antes de começar
- **Por ordem:** passo 3 (Method → About) → passo 4 (Questions, Contact) → passo 5 (limpar o scroll antigo) → **avisar o owner antes do passo
  6, o telemóvel** ("quando for para começar a trabalhar no telemóvel diz"; memória `announce-phone-step`).
- **Qualidade antes de rapidez:** "prefiro qualidade e segurança robusta de animações sempre à entrega com tempo mais rápido" — nunca propor
  um tempo-limite para uma correção (memória `quality-over-speed`).
- **Todo o movimento visto no ecrã** (Chrome e Safari reais, trackpad real, gravação) antes de o mostrar; no telemóvel, o Simulador com dedo
  real e o Xiaomi; o veredicto é o iPhone do owner (memórias `test-motion-on-screen`, `measure-before-fixing`).
- **Elegância, não movimento a mais:** sobre os nomes no telemóvel — "não podemos ter a sensação de deslocar o texto para cima e baixo",
  "parece muita animação que não transmite elegância", "não quero ficar muito tempo com um ecrã vazio".
- **Commit só quando o owner pede** (pediu os dois de hoje).

### Decidido hoje (README #123–#125)
- **#123 — passo 2:** a subir do 7, o regresso da luz do Method (0,8 s) toca inteiro antes de o Work ir para Artists (uma passada nos últimos
  0,45 s fica guardada, antes é ignorada); para baixo a luz volta a abrir de onde está. `method-stage.ts` (`backEnds`, `busyUntil`).
- **#124 — os nomes no desktop:** a fila de cada capítulo começa nele e segue I → II → III → I (`work.tsx`; Artists era "II I III"); cada
  mudança roda a fila um lugar, nada se cruza (o nome que dá a volta esbate-se ao sair e entra do outro lado). Substitui #122 (2). Comparadas
  quatro variantes ("aprovo o TITULOS D").
- **#125 — os nomes no telemóvel:** uma roda calma — os dois nomes do topo e da base viajam numa curva uniforme (1 s), o que vai para cima num
  arco baixo e quase sem profundidade, o pequeno da direita apaga-se e acende no outro lugar; cada nome parte das suas letras (o "seguinte"
  tem margem de toque). Comparadas no iPhone: esbater no lugar (com e sem passo), a roda de 0,8 s com os três a viajar, só o que chega a
  deslizar ("acho que gosto da calma assim").

### Corrigido hoje (todos medidos antes, vistos depois)
- **A luz do Method cortada num fotograma** a subir do 7 com uma segunda passada rápida (#123).
- **Safari, o texto do Weddings a 0 um fotograma** no arranque do regresso ao topo: animações renovadas postas no fim exato e tocadas ao
  contrário davam o valor do início — agora 1 ms antes do fim (`syncOne`).
- **iPhone, os nomes repetiam o movimento quando a roda acabava** (gravação do owner): a transição antiga de 1,2 s dos nomes (de antes de #90)
  voltava a ligar-se e o Safari animava outra vez — fica desligada (`flyFrom`).
- **iPhone, o salto no arranque dos nomes:** as animações partiam das caixas e o "seguinte" tem 13 px de margem de toque à esquerda e 8 px
  por baixo — agora partem das letras (`textOf`).
- **iPhone, tocar no nome seguinte fazia o capítulo ir e voltar** (gravação do owner, 2 de 5 toques): o temporizador de 1,5 s do salto
  anterior largava o novo quando os toques vinham a ~1,4 s — cada salto tem agora o seu fim (`land`/`jumpEnd`). Confirmado pelo owner.
- **Investigado, não era defeito:** o "arco cinzento" do Safari no regresso (a peça do momento a entrar, dissolvida como aprovado; igual no
  Chrome). Duas leituras erradas pelo caminho estão em `v5-tests.md` para não as repetir.

### Por fazer, por esta ordem
0. **⚠ Primeiro o bug A do owner (o B foi corrigido a 18/11 — confirmar no iPhone)** (acima), medidos antes de corrigir, vistos no ecrã e no iPhone.
1. **Passo 3 — Method → About:** ligar o About ao condutor (hoje ainda lê o scroll; o condutor espera-o como `legacyBusy` em `conductor.ts`);
   casos normais e estúpidos; no ecrã, Chrome e Safari.
2. Passo 4 (Questions, Contact) e passo 5 (limpar: `finger.ts` governWheel, `hold.ts`, `unsnapped.ts`, `motor.ts`, as regras de encaixe).
3. **Avisar o owner: o passo 6, o telemóvel** (o condutor no toque, README #119). Os nomes do Work no telemóvel já estão feitos (#125).
4. ✅ **O piscar raro do Safari no desktop corrigido** (owner: "vamos aplicar a correção, ter a certeza que mais nada é afetado"): os nomes do
   desktop voam por `flyFrom`, como no telemóvel; antes Safari 5/20 passadas, depois 0/20 (cliques 0/29 antes e depois; Chrome 0); a rotação
   igual. Verificado no ecrã também a correção dos toques no desktop (`clicks.mjs`). **Achados à parte, iguais antes e depois, por decidir com o
   owner:** a ilha esquerda da barra não desenhada 1–2 fotogramas no Chrome (~2 por 20 passadas; Safari nunca; `island-gone.py`); o foco do
   teclado vai para o `body` depois de Enter num nome; uma passada a meio de um salto do site corre sem paragens (2,6 s, `unsnapped`) e pode ir
   ao topo. `v5-tests.md`, "Os saltos do site no ecrã". Visto pelo owner no desktop e no iPhone ("parece estar a funcionar
   bem") e em commit (18/11).
5. Opcional, por medir: os ~4 fotogramas de atraso do Safari na **primeira** chegada a cada capítulo (o primeiro desenho, 64–87 ms; o código das
   cenas 2–6 ms) — descodificar de antemão as fotografias do capítulo seguinte. Não pedido: parar a peça no instante do regresso ("não vale a pena").
6. **Antes do lançamento:** tirar o gravador (`src/lib/rec.ts`, `rec-on.ts`, o import em `bar-client.tsx`) e o medidor de FPS (`page.tsx`).

### Depois de o Mac ter sido desligado (18/11, fim da sessão) — ligar o laboratório de novo
Nada fica a correr. Por esta ordem (Node 22: `~/.local/share/node22/bin/node`, abreviado `N`):
1. **O site:** `zsh docs/development/ios-lab/desk/rebuild.sh` (build + `next start -p 3100`).
2. **O gravador `?rec`:** `N docs/development/ios-lab/desk/cenas/collector.mjs &` (3199).
3. **A consola do telemóvel e a página de envio do owner:** `N docs/development/ios-lab/proxy.mjs 3130 3100 &` (o iPhone do owner:
   `http://192.168.1.5:3100/`; gravações: `http://192.168.1.5:3130/__diag/enviar` → `ios-lab/out/`; o IP do Mac pode mudar —
   `ipconfig getifaddr en0`). `desk/cenas/clicks.mjs` arranca sozinho os seus proxies (3142 Safari, 3143 Chrome).
4. **O Chrome do laboratório com janela (CDP 9223):** `open -na "Google Chrome" --args --user-data-dir=$HOME/.local/share/v5-lab/chrome-profile
   --remote-debugging-port=9223 --window-position=0,0 --window-size=1728,1117 --no-first-run "http://localhost:3100/"`, e o pid em
   `~/.local/share/v5-lab/chrome.pid` (`pgrep -f "remote-debugging-port=9223" | head -1 > ~/.local/share/v5-lab/chrome.pid`). O Safari com
   uma janela aberta. Chrome headless (9333) para a bateria lógica: comando em `desk/cenas/README.md`.
5. **Acessibilidade** (gestos e cliques reais): `swift docs/development/ios-lab/desk/axcheck.swift` deve dizer `trusted`.
6. **O Simulador:** `DEVELOPER_DIR=~/Downloads/Xcode-beta.app/Contents/Developer xcrun simctl boot v5-iphone`, abrir
   `~/Downloads/Xcode-beta.app/Contents/Applications/DeviceHub.app` (janela em 873,68, 842 × 965), `~/.local/share/v5-lab/bin/simtouch
   ~/.local/share/v5-lab/touch &`, e em bash `source docs/development/ios-lab/finger/sim.sh; sim-fresh`.
7. **O Xiaomi** (ligado por USB, desbloqueado): `adb reverse tcp:3100 tcp:3100`, `adb forward tcp:9222 localabstract:chrome_devtools_remote`,
   o Chrome do Xiaomi em `http://localhost:3100/` (adb: `~/Library/Android/sdk/platform-tools/adb`).

### O laboratório (o que ficou ligado e como retomar)
- **Desktop:** `zsh docs/development/ios-lab/desk/rebuild.sh` (build + `next start -p 3100`, ~1–2 min com o servidor em baixo); coletor `?rec`
  `~/.local/share/node22/bin/node docs/development/ios-lab/desk/cenas/collector.mjs &` (3199); Chrome com janela CDP 9223, Safari; headless 9333.
  `desk/cenas/screen.mjs chrome|safari "<plano>" <nome>` — **`CENAS=0`** para o site sem o condutor (o que os visitantes têm hoje), `SITE=3101`
  outra build, `Q=…` acrescenta ao endereço. **`clicks.mjs`** — cliques reais nos nomes, lâminas, menu, Questions, voltar (`UP=3101`: outra
  build). Comparar com uma build anterior: `git archive <commit> | tar -x -C <scratch>/old`, `cp -c -R node_modules` (um atalho, o Turbopack
  recusa), `next build`, `next start -p 3101`. `island-gone.py`: a ilha da barra não desenhada. Novos hoje: `glitch.mjs`, `names-flash.py` (a fila dos nomes a aparecer no fim antes de rodar), `arch-tone.py`
  (o tom do arco à volta de cada regresso), `tile.sh` / `clock.sh` (fotogramas em grelha; o relógio da página no canto), `probe-back.mjs`.
- **iPhone do owner:** o site em `http://192.168.1.5:3100/` (mesma rede Wi-Fi; a firewall do Mac está ligada). **Gravações do owner:**
  `http://192.168.1.5:3130/__diag/enviar` (`ios-lab/enviar.html`, rota no `proxy.mjs`) — vídeos e uma nota vão para `ios-lab/out/` (fora do
  git). O proxy tem de estar a correr: `~/.local/share/node22/bin/node docs/development/ios-lab/proxy.mjs 3130 3100 &`. Para esperar por um
  envio, vigiar `ios-lab/out/` em segundo plano.
- **iOS, Simulador** (`v5-iphone`, iOS 27.3, Device Hub): `source docs/development/ios-lab/finger/sim.sh` **em bash** (o zsh não divide
  `set -- $p`) — `sim-fresh` (página nova; põe em branco os separadores antigos, que também respondem à consola), `hud-off` (os botões do
  painel ficam por cima dos nomes do Work), `fwd`/`back` (passadas de dedo real), `tap-next`, `where`. `finger/tap-pair.sh <ms>`: pares de
  toques no nome seguinte ao ritmo do owner. `finger/names-jump.py` / `names-valleys.py`: a fila dos nomes numa gravação (`xcrun simctl io
  v5-iphone recordVideo`). Acessibilidade e o `simtouch`: memória `macbook-ios-simulator-setup`.
- **Xiaomi** (adb `c3e8fb35`): `adb reverse tcp:3100 tcp:3100`, `adb forward tcp:9222 localabstract:chrome_devtools_remote`, um separador do
  Chrome em `http://localhost:3100/`. `finger/xiaomi-hoje.mjs` (o Work até ao 7 e de volta por toques: onde está, fps, erros; `Q=…`),
  `finger/xiaomi-taps.mjs <ms> <n>` (toques no nome seguinte, uma mudança por toque); gravação: `adb shell screenrecord`.
- **Lição de hoje:** testar os toques ao ritmo de quem usa (~1,0–1,6 s entre toques): a ~1,9 s o defeito do salto nunca aparecia.

### Não verificado
O passo 2 no telemóvel não se aplica (o condutor é só desktop); uma passagem só de teclado e de movimento reduzido nesta ronda; o piscar
raro do Safari no desktop por corrigir (item 4).

## 16 de novembro de 2026, fim da sessão (noite) — passo 1 (Entrada ↔ Work) fechado no ecrã; a seguir o passo 2 (Experiences ↔ Method)

**Estado numa frase.** O condutor (`?cenas`, só desktop; README #119) leva a página e as cenas tocam pelo relógio. Do topo à entrada do Method o
owner testou no Chrome e no Safari: **"finalmente tudo parece bom!"**. O passo 1 (topo, Weddings, Artists, Experiences — normal e estúpido, os dois
sentidos) está fechado no ecrã, nos dois browsers. **Nada em commit** (commit só quando o owner pedir).

**O processo combinado com o owner (16/11):** paragem a paragem — (1) Entrada ↔ Work ✅; (2) Work ↔ Method ← **próximo**; (3) Method → About,
ligar o About ao condutor; (4) Questions e Contact; (5) limpar o código do scroll antigo; (6) o telemóvel, só depois do desktop firme. Em cada
passo testar casos normais e "estúpidos". **Regra nova (owner: "deves sempre fazer isso agora"): todo o movimento é testado no ecrã, no Chrome e
no Safari a sério, com trackpad real e a janela gravada, antes de o mostrar** (memória `test-motion-on-screen`); o Chrome sem janela é só um
primeiro filtro — hoje deixou passar defeitos que o ecrã mostrou.

### Como retomar o laboratório
1. Servidor de produção: `zsh docs/development/ios-lab/desk/rebuild.sh` (mata o 3100, faz o build, arranca `next start -p 3100`).
2. Coletor do gravador `?rec`: `~/.local/share/node22/bin/node docs/development/ios-lab/desk/cenas/collector.mjs &` (porta 3199 →
   `~/.local/share/v5-lab/rec/live/`). Node 22: `~/.local/share/node22/bin/node`.
3. Chrome do laboratório com janela no CDP 9223 (pid em `~/.local/share/v5-lab/chrome.pid`), o Safari; Chrome headless no CDP 9333 para a
   bateria lógica (comando em `desk/cenas/README.md`).
4. No ecrã (`docs/development/ios-lab/desk/cenas/`): `node screen.mjs chrome|safari "<plano>" <nome>` (passadas reais: d/u suave, D/U forte,
   n/N só dedo, h ponteiro na lâmina, `wNNNN` espera; `Q=…` acrescenta ao endereço) → **`glitch.mjs <dir>`** (qualquer animação: fotogramas a
   mais e saltos, numa grelha da página — novo hoje) · `screen-read.mjs <dir>` (a caixa do arco) · `strip.mjs` (tiras) · `rec-read.mjs` (o registo da
   própria página). Bateria lógica: `walk1.mjs gentle300|swipe800`, `cases.mjs` (28 casos), `smoke.mjs`, `back.mjs 6000`.
5. ⚠ **zsh:** `echo ===` falha; `$F:text` e `$Y[a]` são modificadores do zsh e estragam filtros do ffmpeg — escrever esses comandos num script bash.

### Decidido hoje pelo owner (README #120–#122)
- **#120 (1)** voltar atrás a meio de uma passagem leva à paragem de onde se vinha e **segura lá 1,2 s** ("concordo"); **(2)** o regresso do
  Weddings **dissolve e depois é a ida ao contrário**, igual ("quero que a animação do card a entrar e a sair seja a mesma em reverso"); **(3)** cada
  mudança de capítulo do Work **toca inteira (~1,2 s)** para quem continua ("faz sentido").
- **#121** a curva da passagem lâmina → arco é a **suave** (smootherstep; "acho que noto menos lag na suave"), comparada com a cúbica e a senoidal.
- **#122** a mudança de capítulo **mantém a curva do site** ("prefiro a atual"); **os títulos não se cruzam** ("concordo"); **a lista do momento
  esbate-se** em vez de trocar num fotograma ("ok").

### Corrigido hoje (medido e verificado no ecrã, Chrome e Safari; números em `v5-tests.md`, de "Passo 1" a "A escolha")
- O regresso Weddings → topo sem fotografia ~0,6 s; a luz do Method recolhida com um fio no Safari (`method-stage.ts`, opacidade 0,001).
- O tremor da lâmina ao virar caixa (a caixa partia de onde a lâmina estava ao carregar; agora medida em cada passagem — `pathNow`/`aim`).
- O salto ao chegar ao 2 (tempos do regresso reaproveitados na ida). A dissolução que era um corte; a peça à volta da caixa.
- Chrome: a caixa sumia numa inversão a meio. Safari: a passagem corria ao fim num fotograma e a opacidade da caixa era removida. Cura comum:
  **cada passagem cria animações novas** (`renew` em `syncOne`, `work-client.tsx`).
- Um **piscar de 1–2 fotogramas ao assentar** no arco (cartões inteiros aos 0,975, antes de a caixa sair).
- Chrome: **a fotografia descia 1 px ao assentar** — o Chrome mexia a página 1 px no fim do momentum, com a roda cancelada; o condutor agora repõe
  logo (`conductor.ts` `onScroll`, ≤ 2 px de onde pôs a página).
- **A dissolução acendia o arco de uma vez** (45–63 % no 1.º fotograma): a peça sai com o tempo e a curva da caixa (`.w-quick`, 0,26 s).
- **Os títulos "II Artistsweddings"**: o nome que sai apaga-se no lugar em 0,12 s e o que chega espera esse tempo (`passage`, `CROSS_MS`).
- **A lista do momento** troca com esbatimento: sai em 0,15 s, entra em 0,3 s, nunca as duas (`swapText`).

### O que ficou bem (verificado)
E4 ↔ 2 em todos os casos (ida, volta logo, volta com dissolução depois de uma estadia, duas inversões a meio), a chegada no mesmo píxel; os
capítulos normais e estúpidos (voltar a meio volta logo; 5 toques rápidos → um capítulo de cada vez até ao 7); cadência limpa (Chrome 120 Hz sem
fotogramas > 13 ms, Safari 60 Hz); bateria lógica verde (walk1 0 falhas e 0 fotogramas longos, cases 28/28, smoke sem erros); typecheck e lint limpos.

### Por fazer, por esta ordem
1. **Passo 2 — Experiences ↔ Method, no ecrã e nos dois browsers.** Começar pela suspeita: **a subir do 7, o condutor só esperou 0,54 s em
   Experiences antes de ir para Artists** — a luz do Method a voltar pode estar a ser cortada (ver o `busyUntil` do Method em `method-stage.ts` para
   7 → Experiences). O Safari tem fotogramas longos do processo principal (58–86 ms) ao chegar a Experiences e no 7 (no ecrã não se viram saltos).
2. Passo 3 (Method → About, ligar o About ao condutor), passo 4 (Questions, Contact), passo 5 (limpar o scroll antigo), depois o telemóvel
   (o mesmo condutor no toque está por decidir: README #119).
3. **Antes do lançamento:** tirar o gravador (`src/lib/rec.ts`, `src/lib/rec-on.ts`, o import em `bar-client.tsx`) e o medidor de FPS (`page.tsx`).

### Não verificado
O telemóvel (o condutor é só desktop); o "restart" que o owner viu uma vez (nunca reproduzido — o gravador `?rec` está pronto para o apanhar);
se um trackpad real também acaba o momentum com 1 px (os perfis sintéticos sim; a correção cobre os dois); dois fotogramas longos do Safari na
primeira passagem depois de carregar (não se veem no ecrã: a caixa corre no compositor).

### Ficheiros mexidos (nada em commit)
`src/lib/conductor.ts` (novo: o condutor; `turnHold`; `onScroll` repõe), `src/components/work/work-client.tsx` (`renew`/`syncOne`, `pathNow`/`aim`,
`dissolve`, `passCurve`, cartões, títulos, `swapText`), `src/components/work/work.css` (`--chapter-ease`, `.w-quick`),
`src/components/method/method-stage.ts`, `src/components/entrance/sequence.ts`, `src/components/bar/bar-client.tsx`, `src/lib/rec.ts` e
`rec-on.ts` (novos, gravador — sair antes do lançamento), `docs/development/ios-lab/desk/cenas/` (ferramentas). Mais os de dias anteriores que
`git status` mostra (`hold.ts`, `motor.ts`, `finger.ts`, …).

## 16 de novembro de 2026 (tarde e noite) — o diário do dia: rondas 1–6 do owner e o passo 1 (detalhe; o resumo está acima)

**O owner avaliou `?cenas` no Chrome e no Safari:** "parece-me bem, especialmente no scroll rápido, acho que resolvemos o problema", mas quer
afinar e ainda via bugs: o lag da lâmina → arco do Weddings, sobretudo para trás; no Safari, ao passar para o Method, às vezes um risco fino
preso no Work. Propôs (e eu concordei) **ir paragem a paragem**: garantir a passagem para o Work, depois o Method, depois o resto, com casos
normais e "estúpidos", eu a testar antes de mostrar. Perguntou se o telemóvel vai já (recomendei: depois de o desktop estar firme no Work e no
Method; ver a resposta na conversa).

**Feito (nada em commit):** os dois bugs, medidos e corrigidos — `v5-tests.md`, "Passo 1". (a) O regresso Weddings → topo ficava ~0,6 s sem
a fotografia depois de ~4,5 s no Weddings (Chrome: animações terminadas tocadas para trás com a entrada ainda escondida) — `work-client.tsx`
`syncOne` + `go`; também no site sem condutor. (b) A luz do Method recolhida ficava a opacidade 1 numa faixa de largura zero (de dia no meio
do ecrã): o fio do Safari — `method-stage.ts` `blade`. Sondas novas: `desk/cenas/back.mjs`, `light.mjs`.

**Depois (rondas 2 e 3 do owner, mesma tarde):** o risco fino ficou corrigido (owner). O tremor da lâmina era a caixa a partir da lâmina medida ao carregar (o rato mexe-a): agora medida em cada passagem (`pathNow`/`aim`). O regresso "aos saltos" — gravação do owner: a caixa congelada 0,37 s e depois um salto — corrigido com as animações em pausa no fim e o regresso a arrancar dois fotogramas depois de mostrar a entrada (**o laboratório não o reproduz: confirmar no Chrome do owner**). Decididos (README #120): a dissolução no regresso; voltar atrás a meio de uma passagem segura onde se estava. Aberto: dentro do Work uma mão rápida atravessa capítulos em ~0,13 s (segurar cada capítulo?). Gravador para o Chrome do owner: `desk/cenas/owner-trace.mjs`.

**Ao fim da tarde (ronda 4):** "E4 ↔ 2 parte a página, faz restart; ao chegar ao 2 a imagem salta". O salto: as fotografias do palco ficavam com o tempo do regresso na ida seguinte — corrigido (`aim`, `CARDS_IN`/`CARDS_BACK`). O restart: não reproduzido; **feito o gravador** `?rec` (`src/lib/rec.ts`, coletor `desk/cenas/collector.mjs` na porta 3199, leitura `rec-read.mjs`; sobrevive a uma página rebentada). **Tirar `rec.ts`/`rec-on.ts` do site antes do lançamento**, com o medidor de FPS. O coletor tem de estar a correr.

**À noite (ronda 5): testes no ecrã, a pedido do owner, e assim daqui em diante** (memória `test-motion-on-screen`). Banco: `desk/cenas/screen.mjs` (Chrome 9223 com janela ou Safari, trackpad real, gravação) + `screen-read.mjs` + `strip.mjs`. Encontrados e corrigidos só lá: a dissolução era um corte; a peça à volta da caixa; no Chrome a caixa sumia numa inversão a meio; no Safari a passagem corria ao fim num fotograma e a opacidade da caixa era removida. Agora: cada passagem cria animações novas (`renew`), a dissolução vem antes do caminho inverso. **E4 ↔ 2 limpo nos dois browsers** em todos os casos testados (`v5-tests.md`, "Quinta ronda").

**À noite (ronda 6):** o owner testou do início até à entrada do Method: "finalmente tudo parece bom!"; pediu para avaliar se a entrada no Work
pelo Weddings pode ficar mais suave. Medido no ecrã (`v5-tests.md`, "Sexta ronda"): cadência limpa nos dois browsers; **corrigidos** um piscar
de 1–2 fotogramas na chegada (cartões inteiros antes de a caixa sair, `flyText`) e, no Chrome, a fotografia a descer 1 px ao assentar (o
Chrome mexia a página 1 px no fim do momentum; o condutor agora repõe, `conductor.ts` `onScroll`). **O owner escolheu a curva suave** (README #121); o
seletor saiu.

**Depois (passo 1, resto):** Weddings ↔ Artists ↔ Experiences no ecrã, normal e estúpido, Chrome e Safari — o caminho certo; corrigido o arco a
acender de uma vez no início da dissolução (`.w-quick`); por decidir pelo owner: a curva da mudança de capítulo, os títulos que se sobrepõem, a
lista do momento que troca de uma vez (`v5-tests.md`, "Passo 1, resto"). Ferramenta nova `desk/cenas/glitch.mjs`.

**E (owner: "1. comparação só da suave 2. concordo 3. ok"):** os títulos já não se sobrepõem, o texto do momento esbate-se; a curva da
mudança de capítulo fica a atual (README #122; o seletor saiu). `v5-tests.md`, "As três do owner".

**Próximo:** no ecrã e nos dois browsers, o resto do passo 1 (Weddings ↔ Artists ↔ Experiences) e o passo 2 (Experiences ↔ Method). Depois fechar o passo 1 (Entrada ↔ Work: topo,
Weddings, Artists, Experiences — normal e estúpido, os dois sentidos; Safari e trackpad reais com o ecrã do owner); passo 2 Work ↔ Method;
passo 3 Method → About (ligar o About ao condutor); passo 4 Questions e Contact; a limpeza; o toque.

## ▶ COMEÇAR AQUI · 16 de novembro de 2026 (manhã) — o condutor (`?cenas`) com o Work e o Method; falta o owner, o Safari e o telemóvel

**Decidido hoje (README #119):** um só condutor; as cenas deixam de ler o scroll; barreiras **topo, Weddings, 7, 11, 14, Questions, Contact**
(owner: "confirmo as barreiras"; o 13 não). O owner pediu para ver depois a solução do scroll rápido e avaliar; o telemóvel com o mesmo condutor
fica para provar no Work, lado a lado com o nativo.

**Feito, por aprovar, nada em commit:** `src/lib/conductor.ts` (novo) + o Work e o Method ligados (`work-client.tsx`, `method-stage.ts`: sem
ouvintes de scroll com `?cenas`), `data-stop` nas marcas (`about-stage.ts` também), `bar-client.tsx` (arranca o condutor), `motor.ts` (não corre
com `?cenas`). Bateria em `docs/development/ios-lab/desk/cenas/` — tudo verde; números e o que foi corrigido em `v5-tests.md` ("O condutor").
Vídeo para o owner: `~/.local/share/v5-lab/rec/cenas-rapido-2026-11-16.mp4`. Experimentar: `http://localhost:3100/?cenas` (Chrome e Safari;
`?cenas=0` volta ao normal).

**Próximo, por esta ordem:**
1. O owner experimenta no trackpad (Chrome e Safari) e vê o vídeo: a sensação, o scroll rápido (as fases do Method passam em ~1,5 s numa rajada),
   o que fazer a uma passada feita durante uma passagem (hoje: guardada só nos últimos 0,45 s).
2. Safari real e trackpad real no laboratório (`desk/safari.mjs`, `stroke`; a janela tem de estar à frente: pedir ao owner o ecrã).
3. O toque: o mesmo condutor no Work, lado a lado com o nativo (`?cenas&toque`), iPhone (Simulador e o do owner) e Xiaomi.
4. O About, as Questions e o Contact ligados ao condutor; depois a limpeza (`finger.ts` governWheel, `hold.ts`, `unsnapped.ts`, as regras de
   encaixe, `motor.ts`).

## ▶ COMEÇAR AQUI · 16 de novembro de 2026, fim da noite — as animações ficam como o site as tem; falta só o scroll

**O que o owner decidiu (README #118):** o site em `localhost:3100` com o scroll de antes (`?motor=0`) "está bem": **as animações ficam
todas como o site as tem** (as ideias delas; algumas partem-se em certos momentos do scroll). As Questions entram com tudo (15 e 16 juntos),
o Contact também (19 e 20 numa passagem), o menu como no site. **O único problema do site é o scroll.**

**A referência:** o storyboard redesenhado com o site de hoje, https://claude.ai/artifact/MrVKhKY5daJD12KHTALDhs (fonte:
`docs/design/v5/storyboards/storyboard-hoje.html`; as fotografias em `storyboards/img/` e `img/site/`, fora do Git como as outras — o
publicado tem-nas todas; as peças do Work foram trazidas do site por `docs/development/ios-lab/desk/port_work.py`). Feito a partir do aprovado de 25/10 (+ os ajustes de 4/11): as nove
peças do Work com o HTML e o CSS do site (`work.css`, as demonstrações), as fotografias do site, o vidro líquido com a lente, a passagem da
lâmina como o site a toca (o 2 é o voo a meio), a capa do 10, a passagem E do Contact, a barra sem números, e **nove quadros novos com
todos os estados do Work**. Comparado estado a estado com capturas do site (28 estados, desktop 1440 × 900 e telemóvel 390 × 844).
Também há o site gravado gesto a gesto: https://claude.ai/artifact/VnSZoJG9JbDaEYaDEwyN67 (430c924; mostra os bugs de scroll).

**O pedido do owner para a próxima sessão (16/11, palavras dele resumidas):** encontrar **uma ideia de scroll eficiente para desktop e
telemóvel, Safari e Chrome**, que funcione bem com as animações e os estados que já temos. **Smooth e à prova de bala: não parte nem no
telemóvel nem no desktop.** O scroll **dispara as animações de entrada; nunca é o scroll a comandar a animação**. Definir **zonas de
paragem estratégicas** ao longo do site, e pensar **como funcionam o scroll super rápido e os vários inputs** (trackpad, rato, teclado,
dedo, menu, links, barra de scroll) para nada partir. Começar por aqui: propor a solução e as paragens sobre o storyboard novo, com
prós e contras, antes de tocar no código (`v5-scroll-options.md` tem a análise de 15/11: motor no desktop, toque nativo no telemóvel,
regra b com barreiras).

**A proposta de 16/11 (aceite pelo owner como plano da próxima sessão: "ok"): o site muda de cena, não faz scroll entre paragens.**
- Uma lista de **cenas = as paragens do storyboard novo**. Cada gesto (passada, roda, tecla, dedo, menu) é só um pedido de *cena seguinte* /
  *anterior* a **um condutor**; as cenas **deixam de ler o scroll**: o condutor diz "estás na cena N, vieste de cima/baixo" e a cena toca a
  sua animação de entrada por tempo e avisa quando acabou.
- Regras do condutor: (1) **uma cena de cada vez** — um gesto durante uma animação não a corta; guarda-se só o último pedido e corre quando
  ela acaba; (2) **barreiras** no scroll rápido: salta as cenas pequenas, pára sempre nas grandes (Weddings, Method 7, About 12, Questions,
  Contact — a confirmar com o owner sobre os quadros); (3) **saltos** (menu, links) vão direitos à cena final, já montada, sem animação
  (README #115).
- **Desktop:** o condutor é dono do gesto (cancela a roda e as teclas desde o 1.º evento; o browser nunca move a página sozinho: sem
  inércia a fugir, sem o crash do Safari). Base: o protótipo `src/lib/motor.ts` (`?motor`), medido 34/34 no Chrome e no Safari, 0 crashes.
- **Telemóvel:** o scroll nativo com paragens fica (o owner gosta dele no Safari); o condutor só lê onde a página aterra e dispara a cena.
  Tomar também o dedo foi posto de lado: perde a sensação nativa e mexe com a barra do browser.
- Teste automático em cada passo: para cada gesto e cada browser, **cada cena tocou inteira** (não só "parou no sítio").

**Estimativa dada ao owner (pode falhar; o código das cenas está muito ligado ao scroll), 5–7 sessões:**
1. **Protótipo no desktop, 1 sessão (3–4 h): o condutor + a Entrada e o Work inteiros** (passagem, capítulos, momentos), atrás de
   `?cenas`, o site normal intacto; o owner experimenta no Chrome e no Safari. Começar pelo Work: é a passagem mais complexa e onde estão os
   bugs vistos (o do Experiences: `work-client.tsx` `checkBridge`).
2. O resto do desktop — Method, About, Questions, Contact ligados ao condutor; o papel das Questions (hoje `animation-timeline`, com o
   scroll) passa a tocar por tempo: 2–3 sessões.
3. O telemóvel — o mesmo condutor a ler as aterragens do scroll nativo; medido no iPhone (Simulador e o do owner) e no Xiaomi: 1–2 sessões.
4. Limpeza — tirar o governador (`finger.ts` governWheel), `hold.ts`, os remendos de `unsnapped.ts`/retenções e as regras de encaixe do
   desktop; bateria final nos quatro sítios: 1 sessão.
Antes do passo 1: mostrar ao owner as paragens e barreiras propostas sobre os quadros do storyboard novo e o que acontece em cada caso
(scroll rápido, menu, teclas, dedo); ele escolhe antes de se tocar no código.

**Estado em que ficou (16/11, noite):** nada em commit desde 430c924; o servidor do site (3100, código atual, `?motor=0` = o scroll de
antes) e os Chromes do laboratório fechados com o Mac; as gravações e capturas de referência desta sessão estavam na pasta temporária e
perdem-se (os publicados ficam: o storyboard novo, o site gravado). Ferramentas novas desta sessão: `docs/development/ios-lab/desk/port_work.py`
(traz as peças do Work do site para o storyboard). O Chrome sem janela usado para gravar/medir: `Google Chrome --headless=new
--remote-debugging-port=9333` (uma roda sintética é suavizada pelo Chrome e lutou com a passagem do Work: gravar com PageDown no desktop e
`Input.synthesizeScrollGesture` no telemóvel).

**Por fazer, nesta ordem:**
1. Rever no storyboard novo, com o owner: as Questions e o Contact como um só estado cada (o storyboard ainda mostra 15/16 e 19/20
   separados), e o menu igual ao do site (capturado, não comparado).
2. **O motor de scroll** (`v5-scroll-options.md`, rule b com barreiras; protótipo `src/lib/motor.ts`, `?motor`): o owner marca as paragens
   e as barreiras sobre os quadros do storyboard novo; as cenas deixam de ler o scroll e só são disparadas pelo motor; teste automático de
   que cada animação toca inteira. O bug do Experiences (a "ponte" para o Method congela o momento na paragem: `work-client.tsx`
   `checkBridge`, presente desde 12/11) entra aqui.
3. Nada está em commit desde 430c924: `finger.ts`, `hold.ts`, `motor.ts`, `work-client.tsx`, `unsnapped.ts`, `globals.css`,
   `bar-client.tsx` (scroll, 15/11) e o `storyboard-principal.html` local (a versão publicada de 4/11 + as seis correções de 16/11;
   o ficheiro do Git era mais antigo do que o publicado). Commit só quando o owner pedir.

## ▶ COMEÇAR AQUI · 15 de novembro de 2026 — a ronda do owner no Chrome: dois bugs corrigidos; falta o Xiaomi e o owner

**Onde ficou:** o owner gravou uma ronda no Chrome (`ios-lab/out/2026-11-15T11-57-21-rec.jsonl`, "pareceu-me bem de forma geral") com uma
nota: *a página arrastou para cima a entrar no Work e o 1.º cartão do Weddings saltou*. Reposta no tempo dele (`desk/chain.mjs`), deu dois
bugs, **corrigidos, por aprovar, nada commitado**:
1. `finger.ts` — o regulador usava o sinal de cada evento: um evento de 1–3 px ao contrário (os trackpads reais fazem-nos onde começa um
   gesto no sentido contrário) punha a página na paragem de imediato, às vezes duas: Weddings → Artists → Experiences em 30 ms. Agora o
   gesto guarda o seu sentido.
2. `work-client.tsx` + `unsnapped.ts` (`siteJumps()`) — depois de um clique em *Chapter One*/menu o encaixe fica 1,6 s desligado e a
   retenção da passagem não repunha a página: 13 px fora do Weddings toda a passagem, e o salto quando largava.
Depois: Chrome e Safari reais, página inteira 34/34, 34/34 e 36/36, os gatilhos com tempo marcado e as cadeias do owner; pormenor em
`v5-tests.md`, secção "A ronda do owner no Chrome (15/11)". typecheck, lint (0), build OK.

**Depois (12:51–12:55), o owner:** nova ronda no Chrome (`out/2026-11-15T12-51-52-rec.jsonl`): *"vários bugs na animação do Weddings…
lag, inconsistências"* (vaivém topo ↔ Weddings: posições e estados certos, 0 fotogramas > 50 ms — o problema é visual, dentro da
passagem) e *"animação muito rápida do Contact para as Questions"*. **O Safari rebentou** ("a página foi recarregada porque ocorreu um
problema"): `~/Library/Logs/DiagnosticReports/com.apple.WebKit.WebContent-2026-11-15-125533.ips` — SIGSEGV em
`WebCore::ScrollAnimationMomentum::updateScrollExtents()` ← `didAddScrollbar` ← layout forçado por `scrollY`/`getClientRects`; **o mesmo
crash a 14/11 01:54** (ronda Safari do owner). Um defeito do WebKit que o site dispara ao tirar `overflow: hidden` da raiz (a barra de scroll
volta) com uma inércia de trackpad a correr: `holdFor` do Work, `data-wheel-held` (globals.css), o menu. O owner pediu **uma estratégia
para o site todo antes de mexer em código**: **`docs/development/v5-scroll-strategy.md`** (fases 0–3; aprovada: começar pela fase 0).
**Estado ao fim de 15/11:** fases 0 e 1 fechadas (catálogo #1–#23; causas e sondas em `v5-scroll-strategy.md`); decisões do owner:
condutor **sim**, Android fica como está até medir o travão, #6 **sim** (o papel das Questions mais lento). **Fase 3 passo 1 feito, por
aprovar:** `src/lib/hold.ts` (a página segurada num só sítio, largada só com a roda parada — o gatilho do crash do Safari), usado por
`finger.ts` e `work-client.tsx`; `globals.css` sem `overflow` no `data-wheel-held`. Números em `v5-tests.md`. Próximo: o owner usa o Safari
(o crash não se reproduz no laboratório); depois o passo 2 (o condutor). Nada commitado.
Fase 0, desktop: matriz corrida e revista a 15/11 (14:10) → `docs/development/v5-scroll-catalogue.md` (#15–#22 novos; as posições
quase limpas, os problemas que se veem são das passagens — R5 — e das teclas End/Home). Ferramentas novas: `desk/frames.py` (folha de
fotogramas de um momento da fita), `desk/vdiff.py` (picos de mudança de imagem no vídeo, calibrados à fita).
Nenhuma correção de scroll fora dela.

**Próximo:** 1) Xiaomi (não estava ligado): `finger/xiaomi-pass.mjs` e `xiaomi-pass-drag.mjs`; 2) o owner repete no trackpad dele
(`http://localhost:3140/`, Chrome e Safari) incluindo *Chapter One* → passada logo a seguir; 3) se aprovar: README #118 e commit quando
pedir; 4) a lista abaixo (C–G, A2, produção). Ferramentas novas: `desk/chain.mjs`, `desk/from.mjs` (colocar a página e um gesto, n vezes),
`desk/cut.py` (gestos do owner de uma gravação para perfis), perfis `desk/strokes/o15-*` e `*-jit`.

## ▶ COMEÇAR AQUI · 14 de novembro de 2026, fim da sessão (~15:30) — desktop e Xiaomi medidos e corrigidos; falta o owner no trackpad, o README #118 e a lista C–G

### ⚠⚠ RETOMAR AQUI — ler isto primeiro
**Onde ficou (hoje):** o Mac foi atualizado e o laboratório voltou inteiro (Acessibilidade `trusted`, Node 22 em `~/.local/share/node22`,
Xcode-beta). Tudo registado em `v5-tests.md`, secção "A página inteira com trackpad real, Chrome e Safari; a retenção do Work no topo e
com o dedo no vidro (14/11, tarde)". Três coisas feitas, **nenhuma commitada, nenhuma aprovada pelo owner ainda**:
1. **O regulador de gestos** (`finger.ts`, manhã) validado na página inteira: Chrome 157 e Safari 27.2 reais, 300 e 800 px, 45 de 45 nos
   dois sentidos em cada volta; as 4 cadeias do owner aterram onde ontem; o ouvinte não passivo não custa (≤ 3 fotogramas > 50 ms em
   ~30 000). O Safari cancela todos os eventos nas bordas e **não sai do lugar no topo nem no fim** (o elástico de 223 px desapareceu).
2. **Bug 1 do Work, corrigido** (`work-client.tsx`, `watch`): 1 em 29 passadas Weddings → topo no Chrome, a página voltava sozinha a
   Weddings (o Chrome aplicou 0 → 121 um fotograma depois da retenção do Work, lido como passada para a frente). Agora, enquanto o desktop
   segura a página (`holding`), um scroll que não seja salto do site é devolvido ao fim da passagem. Depois: 20/20, 45/45, 45/45.
3. **Bug 2 do Work, Android, corrigido** (`work-client.tsx`, `holdFor`): com o dedo parado no vidro quando a retenção larga, o Chrome
   re-encaixava em Weddings ao levantar (10 de 10 provocado; pré-existente). Agora a retenção só larga depois de o dedo sair
   (`fingerDown()`). Xiaomi depois: 0 de 20, 0 de 16, 0 de 40, passadas sintéticas 12 de 12; desktop 16 de 16.
typecheck, lint (0 avisos) e build passam.

**Por commitar (desde `430c924`):** `src/lib/finger.ts`, `src/app/globals.css`, `src/components/work/work-client.tsx`,
`docs/development/ios-lab/desk/` (laboratório do desktop, novo), `ios-lab/finger/xiaomi-pass.mjs`, `ios-lab/finger/xiaomi-pass-drag.mjs`,
`ios-lab/README.md`, `v5-tests.md`, este ficheiro. **Commit só quando o owner pedir.**

### A lista completa do que falta (pela ordem combinada com o owner; os pontos A–G são da ronda do desktop de 14/11)
1. **O owner no trackpad dele**, Chrome e Safari, `http://localhost:3140/` (proxy gravador; levantar o laboratório primeiro, abaixo):
   repetir as 3 evidências de 14/11 02:25–02:30 (Method → About forçado; o fim a subir no Safari) e a ronda inteira. Se aprovar, **README
   #118**: o regulador (uma passada, uma paragem; sem paragem à frente não se mexe) + as duas retenções do Work. Se o regulador não ficar
   fiável para o owner, desligá-lo é uma linha (`cleanups.push(governWheel())` em `bar-client.tsx`); A e B (#117) ficam.
2. **C** — o encaixe desligado ~1,6 s depois de um salto do menu. **D** — a passagem do Work: o arco que salta ao chegar ao Weddings
   (~40 px e ~10 %), o ajuste de 55 px da 1.ª passagem, a fotografia que muda no início da volta, a roda para trás ignorada durante a
   passagem, o Work a passar inteiro para trás (Chrome 4 — **pedir vídeo ao owner**). O elástico do Safari no topo a disparar o Weddings já
   está travado pelo regulador (medido hoje).
3. **E** — a 1728×942 os cartões do Method ficam por baixo de *Your name* (crescem com a largura).
4. **F** — o elástico do Safari no fim: travado pelo regulador (medido hoje: 14 096…14 096 a 300 e a 800 px); os cartões do Method na barra
   do Safari (Safari 2 — **pedir vídeo ao owner**).
5. **G** — abrir/fechar o menu sobre o Contact no Chrome: fotogramas de 108–250 ms.
6. **A2**, por decidir com o owner: a retenção da história do About 14 (1,6 s) — manter, encurtar ou soltar num gesto novo.
7. **Antes de produção** (do plano): o iPhone do owner para tudo de 13–14/11 (menu e cor do topo, o toque no fim, README #116, e as duas
   retenções do Work — no iOS nenhuma das duas corre, `holdFor` sai no iOS, mas confirmar que nada mudou); tirar o medidor de FPS de
   `page.tsx`; a imagem de partilha (M7); a validação final (M8: viewports, teclado, reduced motion, sem JS contra `next start`, contraste,
   overflow, `v5-tests.md`); commit quando o owner pedir; pré-visualização no Vercel.
8. Opcional: provar em vídeo a causa do 0 → 121 do Chrome (gravar uma volta com `sec` **menor** que a duração da volta: o `walk.mjs` mata
   a gravação 8 s depois do último gesto e um `.mov` mais longo que a volta não fica em disco).

### Laboratório (perde-se no reinício; está de pé agora: 3100, proxies 3140/3141/3142/3133, Chrome de teste, Xiaomi ligado)
- `S=~/.local/share/v5-lab` (**durável**: `bin/` com `stroke`, `wheel`, `axcheck` compilados; `strokes/`; `rec/`; `chrome.pid`;
  `chrome-profile/`). Os `.mov` em `$S/rec/` pesam ~8 GB e podem ser apagados; as fitas estão em `ios-lab/out/2026-11-14-desk-governor/`.
- Arranque: `S=~/.local/share/v5-lab zsh docs/development/ios-lab/desk/rebuild.sh` (build + 3100); proxies
  `~/.local/share/node22/bin/node docs/development/ios-lab/proxy.mjs 3140 3100 rec` (owner), `3141 3100 rec` (Chrome de teste),
  `3142 3100 hud` (Safari), `3133 3100 rec` (Xiaomi); Chrome de teste `open -na "Google Chrome" --args --user-data-dir=$S/chrome-profile
  --remote-debugging-port=9223 --window-position=0,0 --window-size=1728,1117 --no-first-run "http://localhost:3141/"` e o pid do processo
  principal em `$S/chrome.pid`; Acessibilidade: `$S/bin/axcheck` → `trusted` (senão Definições → Privacidade → Acessibilidade, a app
  `ClaudeCode.app`). A janela de teste tem de estar à frente. Em zsh, listas de gestos repetidos passam-se com `${=VAR}`.
- Xiaomi: `adb reverse tcp:3133 tcp:3133`, `adb forward tcp:9222 localabstract:chrome_devtools_remote`, página por
  `adb shell am start -a android.intent.action.VIEW -d "http://localhost:3133/" com.android.chrome`. ⚠ Abas antigas de `3133` descartadas
  pelo Chrome prendem o CDP (`Runtime.evaluate` nunca responde): fechar com `curl localhost:9222/json/close/<id>` antes.
- Voltas: `node desk/walk.mjs <label> <seg> <gesto:espera>…` (Chrome), `node desk/safari.mjs …` (Safari),
  `node finger/xiaomi-pass.mjs` e `node finger/xiaomi-pass-drag.mjs <n> [px] [ms] [dedo parado ms]` (Xiaomi), sempre com o Node 22 e `S` definido.

## ▶ COMEÇAR AQUI · 14 de novembro de 2026, 12:20 (o Mac vai ser atualizado) — o regulador corrigido e medido com trackpad real; falta a página inteira, o Safari e o owner

### ⚠⚠ RETOMAR AQUI — ler isto primeiro
**Onde ficou:** o owner pediu para testar e medir **visualmente** (nada de Chrome sem janela). Feito: Chrome 157 com janela, eventos de
trackpad reais do macOS, gravação do ecrã, fita por fotograma. **O regulador tinha um bug real, visto no vídeo:** um gesto levava à
paragem certa e 1,2 s depois, sem gesto, a página passava à seguinte (Weddings → Artists → Experiences sozinha). Causa e correção em
`v5-tests.md`, secção "O regulador de gestos no desktop, medido com trackpad real e vídeo (14/11, manhã)". **Depois da correção: 18 em 18
gestos certos, 0 movimentos depois de largar, as 4 cadeias do owner sem correr até ao fim.** typecheck, lint (0), build OK.
**Por commitar:** `src/lib/finger.ts`, `src/app/globals.css`, `docs/development/ios-lab/desk/` (ferramentas novas), `v5-tests.md`, este
ficheiro. Commit só quando o owner pedir. README #118 (o regulador) só depois de o owner aprovar.

**O que ficou por fazer, pela ordem:**
1. **Acessibilidade do macOS**: o Claude Code reiniciou numa versão nova (`~/.local/share/claude/ClaudeCode.app`) e o macOS deixou de lhe
   dar Acessibilidade — sem ela `osascript` não lê a janela e `stroke`/`wheel` não enviam gestos. Confirmar depois do reinício com
   `desk/axcheck.swift` (compilar com `xcrun swiftc`; imprime `trusted` ou faz o macOS pedir a permissão com o nome certo da app) e com
   `osascript -e 'tell application "System Events" to get name of first process'`. Se falhar: Definições → Privacidade e Segurança →
   Acessibilidade, ativar a entrada do Claude Code/claude (a do WebStorm já não chega).
2. **A página inteira no Chrome** (`walk9`): `node desk/walk.mjs walk9 180 swipe120:3500 swipe300:3800 ×22 swipe300-up:3800 ×22` — ver
   11 → 12 (a retenção da passagem), a história do 14, Questions → Contact → fim e a volta; ler a linha `frames:` de cada gesto (fotogramas
   > 50 ms = custo do ouvinte não passivo). Depois o mesmo com `swipe800`.
3. **Safari real**: `node desk/safari.mjs saf1 100 swipe120:3500 swipe300:3000 …` (proxy `node ios-lab/proxy.mjs 3142 3100 hud`; a página
   em `localhost:3142` responde à consola remota — só uma página nessa porta). Ver se o Safari deixa cancelar o 1.º evento e se a
   retenção/encaixe se comportam como no Chrome; o elástico no topo e no fim.
4. **O owner no trackpad dele**, Chrome e Safari, `http://localhost:3140/` (proxy gravador): repetir as 3 evidências de 14/11 02:25–02:30
   e a ronda. Depois README #118 se aprovar, e o ponto 2 da lista de 14/11 (C e D), 3 (E), 4 (F), 5 (G), 6 (A2), 7 (produção).

**Laboratório depois do reinício (tudo se perde no reinício: servidores, Chrome de teste, scratchpads):**
- Node 22 agora em **`~/.local/share/node22/bin/node`** (cópia durável; o `npm` dessa cópia está partido: correr os binários direto —
  `node node_modules/next/dist/bin/next build|start -p 3100`, `node node_modules/typescript/bin/tsc --noEmit`,
  `node node_modules/eslint/bin/eslint.js . --max-warnings 0`). `desk/rebuild.sh` faz build + restart da 3100 com ele.
- Proxies: `node docs/development/ios-lab/proxy.mjs 3140 3100 rec` (owner), `… 3141 3100 rec` (Chrome de teste), `… 3142 3100 hud` (Safari).
- Chrome de teste: `open -na "Google Chrome" --args --user-data-dir=<pasta> --remote-debugging-port=9223 --window-position=0,0
  --window-size=1728,1117 --no-first-run "http://localhost:3141/"`; escrever o pid em `$S/chrome.pid` (`desk/desk.mjs` lê-o; `S` = pasta
  de trabalho com `bin/`, `strokes/`, `rec/`). Compilar `desk/stroke.swift`, `finger/wheel.swift`, `desk/axcheck.swift` para `$S/bin/`
  (`DEVELOPER_DIR=~/Downloads/Xcode-beta.app/Contents/Developer xcrun swiftc -O x.swift -o $S/bin/x`). Perfis de gestos: `desk/strokes/`
  (ou `python3 desk/gen.py` com `S` definido). **A janela de teste tem de estar à frente**: os gestos caem na janela da frente.
- Evidências desta manhã: `ios-lab/out/2026-11-14-desk-governor/` (fitas `walk3.txt` antes, `walk7.txt` depois, `walk89.txt` cadeias;
  `w3s2.png` folha de fotogramas do bug; dois clipes mp4: o salto sozinho e o mesmo gesto corrigido).

## ▶ COMEÇAR AQUI · 14 de novembro de 2026 (fim da sessão, ~03:00) — correção 1 do desktop: feita em parte, o regulador de gestos EM CURSO

### ⚠⚠ RETOMAR AQUI (14/11, ~03:00) — ler isto primeiro
**Onde ficou:** a correção 1 da ronda de testes do desktop (A + B, abaixo em "ÚLTIMO"). O owner gravou 3 evidências depois dela (Safari,
`ios-lab/out/2026-11-14T02-25-54`, `…02-27-37`, `…02-30-06-rec.jsonl`):
- **02-25 e 02-27** ("se forçar scroll rápido longo do Method para o About vou até ao fim e depois ele volta para o About"): gestos de
  trackpad extremos (até 1600 px por evento, Σ 28 878). Causa: durante as retenções (a passagem do 12, a história do 14, `c-on`) o site
  tira as paragens à frente; com o encaixe obrigatório e nada à frente a inércia corre livre até ao fim e o encaixe traz a página de
  volta. O mesmo mecanismo explica o Chrome a passar paragens (9 → 11).
- **02-30** ("ainda consigo reproduzir tudo subir mais no fim"): `scrollY` 13237 para um fim de 13014 = o elástico do Safari no fim (o
  ponto F da lista; não tinha sido tocado).
**O que foi feito em resposta (por validar — NÃO dar como feito):** um **regulador de gestos** no desktop, `src/lib/finger.ts`
`governWheel()` (ligado em `bar-client.tsx`; CSS `:root[data-wheel-held] { overflow: hidden }` em `globals.css`): onde o encaixe é
obrigatório, um gesto de roda/trackpad vai até à próxima paragem ativa (`.w-pass-snap, .m-snap, .a-snap` com `scroll-snap-align` ≠ none)
e não passa; sem paragem à frente não move a página (resolve também o elástico no fim e no topo). Como o Chrome só deixa cancelar o 1.º
evento de cada gesto de trackpad, o resto do gesto é segurado com `data-wheel-held` (solto 150 ms depois do último evento ou num gesto
novo), e a página é posta na paragem (`scrollTo` instantâneo) quando faltam menos de dois eventos para lá chegar ou se já a passou.
Custo: ouvinte de `wheel` não passivo no desktop (o browser espera por ele a cada evento) — medir com o gravador.
**Testes (Chrome 157 sem janela, 1728×942, gestos `Input.synthesizeScrollGesture`; `…/bbf6a277-…/scratchpad/gov.mjs`, `gov3.mjs`):**
- Certo: Method 9 → 10 (8290, sem passar), 11 → 12 (9373, sem passar), 12 → 13, 14 → Questions, Weddings → Artists, Artists → Weddings
  (às vezes), Experiences → Artists, fim: não se mexe (nem para baixo), fim ↑ → Contact, topo ↑: não se mexe e já não dispara o Weddings.
- **Ainda falha:** Experiences ↓ forte → 8a (salta o 7); 8a ↑ forte → Experiences (salta o 7); Artists ↑ forte → Weddings e depois a capa
  (2 de 4: a volta à capa do Work dispara pelo scroll acima do Weddings). Hipóteses a verificar primeiro: no Experiences/7 o encaixe pode não
  estar `mandatory` no início do gesto (o regulador desliga-se: `stop = null` e não segura) ou a marca do 7 estar sem `scroll-snap-align`
  (`.method[data-passage]`, `data-near`); para o Weddings, ver em `work-client.tsx` o que dispara a volta (scroll acima de `geo.top`) e
  se o regulador deve segurar antes (ou o Work ignorar o scroll com `data-wheel-held`).
- **Próximo passo amanhã:** 1) gravar cada caso que falha frame a frame (`gov.mjs` com o estado do encaixe e das marcas no início do gesto),
  corrigir; 2) repetir `gov.mjs`, `gov3.mjs` e `padtest.mjs in|back|m11` (as retenções A); 3) medir fotogramas com o regulador
  (gravador); 4) pedir ao owner para repetir as 3 evidências e a ronda (`http://localhost:3140/`, Chrome e Safari); 5) só depois
  registar no README (#117 diz já A + B; acrescentar o regulador como #118 se o owner aprovar) e passar ao ponto 2 da lista.
- Se o regulador não ficar fiável: desligá-lo é uma linha (`cleanups.push(governWheel())` em `bar-client.tsx`); A e B ficam.
**Servidores para retomar:** produção `cd STUDIO && <node22> node_modules/next/dist/bin/next build && <node22> node_modules/next/dist/bin/next start -p 3100`
(o Node do sistema é 20.5 e o Next 16 pede ≥ 20.9; `<node22>` = `/private/tmp/claude-502/-Users-flaviooliveira-WebstormProjects-STUDIO/10f08265-711f-412f-ba1c-1613338b5a75/scratchpad/node/node-v22.23.4-darwin-arm64/bin/node`
— se a pasta temporária tiver sido limpa, instalar/usar um Node ≥ 20.9; o `npm` dessa cópia está partido, correr o `next` direto);
gravador `node docs/development/ios-lab/proxy.mjs 3140 3100 rec` (owner: `http://localhost:3140/`); telemóveis `proxy.mjs 3130 3100`.
Chrome sem janela para testes: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9333 --user-data-dir=<scratchpad>/chd`.
Os scripts de teste desta sessão foram copiados para **`docs/development/ios-lab/desk/`** (verificado por SHA-1): `gov.mjs` (gestos
fortes, paragens), `gov3.mjs` (o Work), `padtest.mjs in|back|m11` (as retenções do Contact e o 11 → 12), `shot.mjs` (capturas por fase do
Method), `cast.mjs`/`cast1.mjs` (fotogramas da passagem do Work), `rectest.mjs` (o gravador). Usam o Chrome sem janela na porta 9333 e o
site em 3100; correr com o Node 22 a partir dessa pasta.
**Nada commitado desde `8ac2c92`** (13/11): tudo de 13–14/11 está no disco (lista em `git status`). Commit só quando o owner pedir.

**A lista completa do que falta (pela ordem combinada com o owner):**
1. Correção 1 — A (retenções do Contact, FEITO e testado), B (encaixe entre o Method e o About, FEITO), **regulador de gestos (EM CURSO,
   acima)**; e confirmar com o owner no trackpad real (Chrome e Safari).
2. C (encaixe desligado ~1,6 s depois de um salto do menu) e D (a passagem do Work: o arco que salta ao chegar ao Weddings, ~40 px e ~10 %,
   e o ajuste de 55 px da 1.ª passagem; a fotografia que muda no início da volta; a roda para trás ignorada durante a passagem; o elástico do
   Safari no topo a disparar o Weddings — o regulador já o trava; o Work a passar inteiro para trás, Chrome 4 — pedir vídeo).
3. E: a 1728×942 os cartões do Method ficam por baixo de *Your name* (crescem com a largura).
4. F: o elástico do Safari no fim (o regulador trava-o; confirmar) e os cartões do Method na barra do Safari (pedir vídeo).
5. G: abrir/fechar o menu sobre o Contact no Chrome: fotogramas de 108–250 ms.
6. Por decidir com o owner: A2, a retenção da história do About 14 (1,6 s) — manter, encurtar ou soltar num gesto novo.
7. Antes de produção (do plano): o iPhone do owner para tudo de 13–14/11 (menu e cor do topo, o toque no fim, README #116), tirar o medidor
   de FPS de `page.tsx`, a imagem de partilha (M7), a validação final (M8), commit quando o owner pedir, pré-visualização no Vercel.

### Estado
- Commitado em `8ac2c92` (13/11): o de 12/11 (abaixo) e **as paragens do Work** (README #110, `work-client.tsx`, `work.css`, storyboard
  estado 5, `v5-tests.md` "Paragens no Work… 13/11"). typecheck, lint (0), build passam. Commit só quando o owner pedir.
- Laboratório como a 12/11 (servidores e proxies a correr; Simulador `v5-iphone`; Chrome de teste pid 32221 CDP 9223 na 3131; Safari na
  3136). Ajudas desta sessão: `…/bbf6a277-…/scratchpad/b1.sh` (`fresh`, `top0`, `wrec`/`wdump` gravador por fotograma, `wst`). A janela do
  Device Hub fica atrás do WebStorm: trazê-la com `activate` + `AXRaise` (`front` em `b1.sh`) antes dos gestos.

### ⚠ ÚLTIMO (14/11, madrugada): ronda de testes do owner no desktop — 18 bugs analisados; correção 1 (A + B) FEITA, por confirmar pelo owner
- **Ordem combinada com o owner:** 1 = A + B (feito: README #117, `v5-tests.md` "Ronda de testes… 14/11"); 2 = C e a passagem do Work (D);
  3 = layout 1728×942 (E); 4 = elástico do Safari (F); 5 = menu sobre o Contact (G). A2 (retenção do 14, 1,6 s) fica por decidir com o
  owner. Por pedir ao owner: vídeo do Safari 2 e do Chrome 4. Nada commitado.
- Servidores: `next start -p 3100` (Node 22: `…/10f08265-…/scratchpad/node/node-v22.23.4-darwin-arm64/bin/node node_modules/next/dist/bin/next`),
  gravador `node docs/development/ios-lab/proxy.mjs 3140 3100 rec` → o owner abre `http://localhost:3140/`.
### Os 18 bugs (análise)
- Gravações: `ios-lab/out/2026-11-14T01-41-32-rec.jsonl` (Chrome 157, 1728×942 dpr 2, 11 marcas) e `…01-49-14-rec.jsonl` (Safari 27.2,
  1500×934, 7 marcas). Ler com `rec-read.mjs` (linha do tempo) e `rec-strokes.mjs` (um gesto por linha: de onde → onde assentou).
  Sem gravação do ecrã; o que é só visual foi reproduzido com capturas no Chrome sem janela (1728×942).
- **A. Retenções do Contact que só acabam em repouso** (`data-c-on`, `data-c-hold`, contact-client): com gestos seguidos nunca acabam e
  cada gesto volta à mesma paragem — Chrome 7, 8, 10 (c-on ~7 s, 281→288 s; um gesto para cima puxado para as Questions, 237 s), Safari 6.
  **A2.** A retenção da história do 14 (1,6 s, `STORY_MS`): um gesto ~1 s depois de chegar ao 14 volta ao 14 — Chrome 9, Safari 3.
- **B. O encaixe desliga-se no desktop na passagem Method → About** (method.css: a regra do desktop exige `data-section` work/method; a
  secção já é `about` e o About ainda não está no 12): a inércia passa livre — Chrome 6 e 11, Safari 1 (de 11 até 11322, as Questions a
  subir) e 5 (de 10 até ao 13 a meio da passagem do 12). E gestos fortes de trackpad passam paragens com o encaixe ligado (Chrome: 9→11).
- **C. (não marcado)** Depois de um salto do menu o encaixe fica desligado ~1,6 s (`unsnapped`): um gesto nesse tempo atravessou o Method
  inteiro até ao About (Safari 292,8 s) ou saltou o 8a (212,3 s).
- **D. A passagem do Work:** Chrome 1 — no último fotograma do voo o arco está ~40 px abaixo e ~10 % menor que o arco real, que aparece no
  seguinte (captura 1728×942); e na 1.ª passagem a página ficou presa em 1374 e foi para a paragem 1319 no fim (+55 px). Chrome 3 — no
  início da volta a fotografia do arco muda de enquadramento e de luz em 1–2 fotogramas (a do palco, mais escura e afastada, pela cópia
  que voa). Chrome 2 — um gesto da roda para trás durante a passagem para a frente é ignorado até ela acabar (só o dedo a inverte).
  Safari (7.º, depois de recarregar) — no topo o elástico do Safari dá `scrollY` negativo e a volta a 0 é lida como scroll para a frente:
  a passagem para o Weddings arranca com gestos para cima. Chrome 4 — para trás do Method 7 o Work passa inteiro (as paragens do Work só
  ligam em repouso); e `data-near` fica ligado no 8c (`m=8cn`). Pedir vídeo para o que o owner viu exatamente.
- **E. Chrome 5** — a 1728×942 a linha *Make it yours | Your name* fica por cima dos cartões (8a–8c): os cartões crescem com a largura;
  a 1500×934 e 1440×900 não (capturas).
- **F. Safari 4** — no fim `scrollY` 13498 > 13476: o elástico do Safari no fim (provável causa de "sobe tudo ainda mais"). **Safari 2** —
  cartões do Method a mexer na barra de cima do Safari: só visual, Safari não automatizável daqui: pedir vídeo.
- **G. (não marcado)** Chrome: abrir o menu sobre o Contact deu fotogramas de 250, 175, 151, 108 ms; fechar 184 e 158 ms.

### (antes) 13/11, noite: o menu e a cor do topo — feito, medido no Xiaomi, Simulador e Chrome desktop; por testar no iPhone do owner, por commitar
- README #116, `v5-tests.md` "O menu e a cor do topo". Menu aberto = a cor do vidro na página (iOS) e na barra do Chrome (Android), no tempo
  da gota; About 12 seguido na passagem; `lib/top-colour.ts` lia a parte errada das fotos com `srcset` (About 13/14); Contact no Android
  lê o poster pelo véu; entrada no Android com o esbatimento do topo do iPhone. **Próximo:** o owner testa no iPhone (menu aberto/fechado
  sobre Questions, About 13, Method 9; entrada; Contact) e no Xiaomi (entrada de dia). Depois: a lista de bugs do menu do owner.
- Ferramentas: `…/bbf6a277-…/scratchpad/xtop.mjs` (Xiaomi, barra ↔ página), `simtop.sh` (Simulador), `desk.mjs` (Chrome headless 9333).
  Node 22 para o build: `rebuild`/`restart` de `b1.sh` (o Node do sistema é 20.5).

### (antes) 13/11, tarde: o menu — saltos sem "construir" e as faixas da ilha/fundo (feito no Simulador e Chrome, README #115; por commitar)
- **Feito e medido (ver `v5-tests.md`, "O menu…"):** a cor final certa e uma só mudança em 20/20 saltos. **Xiaomi verificado (18/18).** **Falta:** Safari
  desktop, o iPhone do owner; e o resto da lista de bugs do menu do owner. O toque perdido num link a aparecer (iOS) continua à espera de decisão.
- Pedido do owner: navegar pelo menu deve só ir à zona, sem passagens a tocar nem faixas de cor antigas. Volta de 13 saltos no
  Simulador (gravação + `wh`): **aterram todos certos** (Work W0, Method 7, About 12, Questions, Contact). Visto: o Method tocava a luz,
  o About ia do 14 ao 12 (retrato aceso, depois escuro), o Contact escurecia e a pergunta vinha aos 1,3–2 s; as faixas esbatiam da
  cor antiga 0,3–1,1 s.
- **Feito, por medir e commitar:** salto (`data-jump`) = estado final já: `method-stage.ts` (`leap()`, `show(at, true)`), `about-stage.ts`
  (`jumped` inclui `data-jump`, também no 12), `contact-client.tsx` (`go` instantâneo com `data-jump`), `questions-client.tsx`
  (`q-now`), `sequence.ts` (sem esbatimento com `data-jump`), `work-client.tsx` (`land` marca `data-jump`). typecheck/lint/build OK.
- **Encontrado na 2.ª volta (gravador da cor do fundo):** a cor final das faixas nem sempre é a certa — Method 7 escuro (23,24,22) vindo
  das Questions/About e claro vindo do Work; About 12 cinzento (176,175,171) uma vez; 3–4 cores intermédias em 0,13–0,48 s. Suspeita:
  `data-edge` (top-colour) lido antes de a cena instantânea estar desenhada, ou o `data-edge` da fase anterior. Gravação em
  `…/bbf6a277-…/scratchpad/tour2.mp4`, folha `jumps2.png`. **Próximo passo: ver isto, corrigir, repetir a volta; depois Xiaomi e owner.**

### Ponto da situação (13/11, fim)
- **Os 5 bugs e o Contact mais suave: feitos e aprovados pelo owner no iPhone dele** (README #110–#114, `v5-tests.md` 13/11). O 1 tem um
  resto aceite pelo owner como caso-limite (rajadas de gestos muito rápidos no iPhone real).
- **Xiaomi verificado (13/11, `finger/xiaomi-bugs.mjs`, `v5-tests.md`):** os 5 bugs e o Contact certos. Fica o #1 de sempre fora do iOS:
  gestos fortes passam paragens (W → E; do 7 ao topo). Endereço do Mac na rede agora **192.168.1.7**.
- **Commitado: `8ac2c92` (13/11, branch `v5`)** — tudo até aqui; o push é do owner (GitHub Desktop: este terminal não tem credenciais). Antes de produção (do plano): tirar o medidor de FPS de `page.tsx`, a imagem de partilha (M7), a
  validação final (M8: 5 larguras, teclado, movimento reduzido, sem JS com `next start`, contraste), commit quando o owner pedir,
  pré-visualização no Vercel, depois o `master`. Em pausa por decisão do owner: o menu (lista de erros a pedir), a barra de cima.

### Os 5 bugs dos vídeos do owner (iPhone, 12/11 23:50–23:54, `ios-lab/out/`) — o owner quer corrigi-los para produção
1. **Vaivém entrada ↔ Weddings mostra Experiences/Artists — corrigido** (owner escolheu "paragens no Work"): um 2.º gesto durante a
   passagem atravessava o Work (o iOS não entrega esse toque à página). Agora uma paragem por capítulo e, no iPhone, a página parada no
   Weddings enquanto a passagem toca. Simulador, Chrome e Safari desktop medidos (`v5-tests.md`). **Vídeo do owner 00:45:** um gesto
   forte do topo ainda passava para o Artists (iPhone real; não reproduz no Simulador) → `passHold`: só o Weddings à frente durante a
   passagem. **Vídeo 01:00 (owner: "de forma geral parece bom", inconsistente só com muitos gestos rápidos e longos seguidos):**
   7 → topo e Experiences → Weddings em ~1,5 s, sem paragem visível pelo meio (sem fita: não se sabe se um gesto ou vários). Deixado
   como caso-limite, junto do #1 (gestos rápidos). Ideia guardada, não feita: no iPhone, durante um gesto, só as paragens vizinhas
   ativas — mexe em todas as marcas do site e no rank do WebKit; só com a fita a provar que vale a pena. **Falta:** Xiaomi.
2. **Corrigido (13/11; owner OK no iPhone, falta o Xiaomi):** o ecrã inteiro com a forma do cartão, ampliado por igual;
   o menu animado. **Method, telemóvel: a animação para o *Your first chapter* "dá um salto, não está smooth"** (owner). No vídeo (23:51): o ecrã do
   Weddings em ecrã inteiro encolhe para cartão e volta; o título *The twelfth of November* fica por cima da foto (0,6 / 2,2 s) e aos
   1,2–1,4 s o ecrã cresce com o linho de baixo vazio. Por medir (gravar por fotograma a passagem 9 → 10 → 11 no Simulador).
3. **Questions → Contact → Questions, gestos rápidos** (23:52, 0,6–2,1 s): a barra já diz *CONTACT* sobre o papel vazio; depois o escuro
   com o colofão e **sem a pergunta** (a página foi ao fim e voltou à paragem do Contact); na volta ~0,5 s de escuro vazio com *QUESTIONS*.
4. **Questions: abrir/fechar uma resposta e ler** (23:53): um gesto pequeno sobe a página ~30 px (título cortado debaixo da barra) e às
   vezes começa a passagem para o Contact (perguntas desbotam, barra *CONTACT*) e volta.
   **Corrigido (README #111, escolha do owner):** com o dedo no vidro a passagem só começa a meio caminho. **O bug de facto (vídeo 01:16):**
   com uma resposta aberta a caixa subia 65 px a cada gesto (margem sob a lista) e ~60 px ao sair para o Contact (a resposta alongava o
   caminho além da retenção). 1.ª tentativa (`--q-over` em `<html>`) deu lag (owner, 10:07) — refeito com a ideia do owner: **a resposta
   fecha quando a passagem para o Contact começa** ("B", escolhida pelo owner) e a caixa mede-se fechada (`--q-rest`), a página nunca muda
   de altura e o título nunca sobe para debaixo da barra. **Confirmado pelo owner no iPhone dele (13/11): OK.** Falta o Xiaomi. Simulador e Chrome emulado medidos;
   **falta** o iPhone do owner (lag?) e o Xiaomi. Endereço do Mac na rede agora **192.168.1.7** (iPhone: `http://192.168.1.7:3130/`). Visto pelo caminho (para o 3): na volta do Contact a barra passa a *QUESTIONS* ainda no escuro.
5. **Corrigido (README #113; Simulador e Chrome desktop medidos, falta o iPhone do owner e o Xiaomi).** **Contact: um 3.º gesto que puxa tudo para cima** (owner: "no contacto existe um 2.º scroll que abre o *Built around you*, mas ainda
   existe um 3.º scroll que puxa tudo para cima e não é suposto"). No vídeo (23:53–23:54) a pergunta, a hora e *Talk to us* saltam ~40 px
   entre o Contact e o fim. Deve haver só duas paragens: Contact e o colofão.
   **Corrigido (README #112, escolhas do owner):** ida — 2.º gesto durante a luz fica no Contact (`data-c-on`, `a-snap[data-past]`);
   volta — o escuro vazio 3× mais curto. A barra continua com o scroll (não escolhido). Simulador, Chrome e Safari desktop medidos;
   **falta** o iPhone do owner e o Xiaomi.
Ordem combinada: 1 (feito, falta Xiaomi) → 4 (feito, owner OK no iPhone, falta Xiaomi) → 3 (feito, owner OK no iPhone) → 5 (feito, owner OK no iPhone) → 2 (feito, owner OK no iPhone). Pelo meio (owner, 13/11): o texto do Contact e o colofão mais suaves (README #114, owner OK no iPhone).

## ▶ 12 de novembro de 2026 (fim da noite) — a passagem da entrada por tempo; bug do owner por investigar

### Estado (nada commitado desde `00a1462`)
- **Por commitar, tudo junto:** o menu (página parada, ecrã inteiro, cor da barra no Android), a barra sem números, a foto do
  Weddings "bugada" (o voo medido no sítio da entrada), **a passagem da entrada por tempo** (README #109, `work-client.tsx`,
  `work.css`, storyboard estado 2) e as ferramentas do passeio (`ios-lab/finger/watch.js`, `watch-dump.js`, `human.mjs`,
  `human-xiaomi.mjs`). typecheck, lint (0), build passam. Commit só quando o owner pedir.
- Servidores: `next start -p 3100` (Node 22 em `…/10f08265-…/scratchpad/node/node-v22.23.4-darwin-arm64/bin`), proxies 3130 (iPhone do
  owner), 3131 (Chrome de teste, CDP 9223, pid 26098), 3133 (Xiaomi), 3135 (Simulador), 3136 (Safari). `wheel` em
  `…/10f08265-…/scratchpad/sw/wheel`, `simtouch` em `…/10f08265-…/scratchpad/touch`, `lab.sh` em `…/10f08265-…/scratchpad/lab.sh`;
  as receitas de teste da passagem (`deskmat`, `kb`, `pst`, `prest`) em `…/9aae31b1-…/scratchpad/prec.sh` — scratchpads apagam-se.
  ⚠ Nunca correr `prettier` sem as opções do projeto (`--no-semi --single-quote --print-width 120 --trailing-comma all`; não há
  config no repositório): reformatou `work-client.tsx` inteiro a 12/11 (revertido).

### ⚠ PRIMEIRO: bug encontrado pelo owner (iPhone, fim da noite, por investigar)
- **"Se começares a andar para trás e para a frente (scroll) no Weddings, ele buga a animação."** Sem vídeo; o owner teve de sair.
  Suspeitas a medir primeiro (medir antes de corrigir, nas 4 plataformas):
  1. Gestos alternados rápidos (↓ ↑ ↓ ↑) com a passagem ainda a tocar: `go()` inverte o relógio a meio (`playbackRate` −1,33 ↔ 1) —
     as animações de `textFlight` criadas em `leaveStage()` a meio da volta podem ficar fora de passo com as `flights`.
  2. No iPhone o 2.º gesto durante o encaixe do 1.º (~1,2 s) não chega à página (medido: vai para Experiences com a passagem cortada
     por `put(end)`); o mesmo para cima.
  3. `notTheFinger()` (direção do dedo, 1,5 s) a ignorar um gesto verdadeiro para o lado contrário logo a seguir a outro.
  4. Entre o Weddings e Artists (o Work sem paragens): um gesto para cima a partir de ~2000–2400 cruza o Weddings e dispara a volta.
  Reproduzir no Simulador com `fwd`/`back` alternados a 0,3–1 s (gravar vídeo: `simctl io booted recordVideo`) e com `prec.sh`
  (`pst`, gravador de `__pl`); depois Chrome/Safari com `wheel` e o Xiaomi.
- A seguir: **as paragens do Work, uma por capítulo** (owner perguntou "sugeres então fazer stops?" — recomendado: sim); resolve também o
  2.º gesto no iPhone (passa a parar em Artists).
- **O menu está em pausa** (owner: "ainda vejo muitos erros no menu, vamos pausar"): pedir-lhe a lista/vídeo quando se voltar a ele;
  conhecido: no iPhone um toque num link perde-se enquanto o link aparece (proposta no ponto 1 de "Por corrigir" abaixo).
- **Xiaomi:** ecrã bloqueado (o adb acorda mas não desbloqueia); a passagem nova não foi testada lá. Pedir ao owner para desbloquear e
  ligar "Manter ativo" nas opções de programador.

## ▶ 12 de novembro de 2026 (dia e noite) — o nome do 12 sem saltos; retenção nas Questions na volta do Contact; a barra num salto

### Estado
- Branch `v5` em **`00a1462` (commitado e enviado, 12/11)**: o Contact, as correções de 10–12/11, as ferramentas e os testes.
  `master` = `fe1bd33` = o site publicado, inalterado. Antes de juntar ao `master`: tirar o medidor de FPS de `page.tsx`, a imagem de
  partilha (M7), a validação final (M8) e um link de pré-visualização no Vercel (proposto ao owner a 12/11).
- Servidores e laboratório como abaixo (11/11). Nesta sessão: Node 22 em `…/10f08265-…/scratchpad/node/`, `lab.sh` do Simulador em
  `…/10f08265-…/scratchpad/lab.sh` (porta 3135), `wheel` em `…/7c234a64-…/scratchpad/wheel` — os scratchpads apagam-se.

### Respostas do owner (iPhone, manhã) e o que foi feito
1. **12 mais rápido: tempo aprovado.** O *I'm Flávio.* saltava na volta 13 → 12 → 11 com o 2.º gesto antes de acabar a descida (medido
   no vídeo dele: 27–47 px num fotograma). Corrigido (`about-stage.ts`): o retrato e o nome continuam a descida e o nome só desvanece.
2. **Volta em 1,2 s: "parece ok".** Recomendação: ficar assim — com a retenção (3) as Questions veem-se sempre.
3. **Retenção nas Questions** (`contact-client.tsx` `data-c-hold`, `method.css`): enquanto a luz volta e até a página parar, um gesto para
   trás fica nas Questions. Medido no Simulador, Chrome e Safari desktop (pormenor e as três tentativas em `v5-tests.md`).
4. **O fim com gestos rápidos: "agora parece bem".**
5. **Encontrado e corrigido:** a barra dizia *04 Questions* sobre o About depois de um salto do menu a partir do Contact (`bar-client.tsx`).

### Para o owner testar no iPhone (`http://192.168.1.8:3130/`, recarregar)
0. **No PC (Safari)**: descer o Work até ao Method, e o menu → *02 Method* e um gesto: entra sempre?
1. 13 → 12 → 11 com dois gestos rápidos: o *I'm Flávio.* acompanha o retrato e desaparece sem saltar?
2. No Contact, vários gestos seguidos para trás enquanto a luz volta: fica nas Questions? E o gesto seguinte vai ao About?
3. Menu → *03 About* a partir do Contact: a barra diz *03 About*?

6. **Desktop "7 → 7 → 8b" corrigido** (tarde): a marca do 8a estava 16 px antes do início da fase; agora em 1,3 ecrã. Chrome e Safari:
   uma fase por gesto 7 → 11 → 7 com gestos de 300/200/120 (`v5-tests.md`).

7. **Safari desktop preso em Experiences — corrigido** (opção a, escolhida pelo owner; `method-stage.ts`, só desktop): encaixe já ligado
   em repouso em Experiences; a marca de Experiences a 0,05 ecrã da cena (a mesma imagem: capturas iguais ao píxel); o palco só fica
   fixo na volta quando ia mesmo mover-se. Causa: o WebKit põe a página na marca de partida se houver *layout* entre o fim do dedo e a
   inércia. Safari 45/48 entram de Experiences; Chrome e telemóvel sem mudança (`v5-tests.md`).

8. **Safari desktop 12 → 10 depois do menu — corrigido** (`address.ts`): os saltos do menu aterravam entre marcas no desktop; agora na
   primeira marca da secção, como no telemóvel (*02 Method* aterra no 7). O que resta de 12 → 10 são gestos rápidos (450 px), o #1.

9. **O menu (noite, por commitar):** página parada com o menu aberto; no iPhone em ecrã inteiro (debaixo da ilha e da barra do Safari);
   Android com a barra na cor do vidro; foco sem anel ao toque; redimensionar recalcula a gota. 100/100 navegações pelo menu nas 4
   plataformas. **Falta no Xiaomi** (adormeceu bloqueado): toques reais nos links, toques rápidos, abrir durante passagens. **Feito
   depois:** a barra sem números (*Chapter One | About*; o menu guarda-os). Pormenor em `v5-tests.md` ("O menu").
10. **A foto do Weddings "bugada" (vídeo do owner, iPhone, 12/11 noite) — corrigido** (`work-client.tsx` `flight()`, por commitar): o voo
   da lâmina para o arco media a lâmina onde a página estava; refeito longe do topo (recarregar abaixo, mudar de tamanho, a imagem da
   lâmina a chegar tarde) o voo partia de uma lâmina milhares de px acima do ecrã — a caixa quadrada no canto de cima, a subir e a descer.
   Agora mede-a no sítio da entrada retida. **Depois: passeio "como um visitante"** nas 4 plataformas (gestos mistos, menu, toques; ferramentas
   novas `finger/watch.js`, `human.mjs`, `human-xiaomi.mjs`): sem erros, sem restos, menu sempre certo — exceto o ponto 1 abaixo (iOS).

11. **A passagem da entrada por tempo (owner, noite: "one stroke dispara a animação…") — feito, por commitar** (README #109,
   `work-client.tsx`, `work.css`): 1,6 s a ir, 1,2 s a voltar (a julgar no iPhone), nunca a meio; desktop 32/32, Simulador 16/16.
   **Falta:** Xiaomi (bloqueado); o 2.º gesto no iPhone durante o encaixe passa para Experiences — resolve-se com as paragens do Work,
   **o próximo passo** (o owner perguntou "sugeres então fazer stops?": sim, uma por capítulo). Pormenor em `v5-tests.md`.

### Por corrigir / decidir (por ordem proposta) — o menu **em pausa** (owner, noite: "ainda vejo muitos erros no menu, vamos pausar")
1. **iOS: um toque num link do menu perde-se enquanto esse link ainda está a aparecer** (medido no Simulador: *Questions* a 0,5 e 0,7 s
   depois de abrir falha 3/3; a 0,9 s ou mais, ou antes de começar a aparecer, funciona). O iOS (WebKit) trata um toque em conteúdo a
   tornar-se visível como "hover" e não manda o clique. Proposta (pequena, só iOS, só links do menu): se um toque acaba num link sem
   clique em ~300 ms, navegar na mesma. Alternativa: mudar a entrada das palavras (design). **Decisão do owner.**
2. Gestos rápidos que passam paragens (#1; Xiaomi, Chrome e Safari desktop; não no iOS) — **o passeio de 12/11 mostrou casos maiores**:
   no Xiaomi um gesto forte do 7 para cima vai **até ao topo** (o Work inteiro) e do meio da passagem da entrada **até ao 7**; no desktop o
   1.º gesto forte do topo cai no Artists. O Work não tem paragens (é scroll nativo por desenho). Proposta como antes (`scrollend`, só fora
   do iOS) — a medir; e decidir se o Work deve ter paragem por capítulo.
3. **A passagem da entrada não tem paragem** (todas as plataformas): um gesto lento ou a roda do rato deixa a página a meio — a foto meio
   voada, sem texto e sem barra (capturas em `v5-tests.md`). Nativo por desenho; **decisão do owner** se quer uma paragem.
4. A subida das Questions (14 → 15); a barra de cima; M7/M8; tirar o medidor de FPS.

### Não verificado
O iPhone do owner e o Safari dele com estas correções; Firefox. (Xiaomi verificado à noite: `v5-tests.md`.)

## ▶ 11 de novembro de 2026 (noite) — Contact acertado no iPhone; 12 e volta das Questions mais rápidos; paragens avaliadas

### Estado
- Branch `v5` em `602858d` (enviado). **Tudo por commitar** — o de 10/11 (o Contact, a passagem E, a regressão do papel das Questions no
  Chrome/Android) e o de hoje (abaixo). Commit só quando o owner pedir, tudo junto; ele faz o push no GitHub Desktop. Antes do commit:
  `v5-tests.md` já tem as secções de 11/11.
- Servidores (morrem com o Mac): `npm run build`, `npx next start -p 3100` (Node 22: o do Mac, 20.5, é velho para o Next 16.3 — o do
  scratchpad apaga-se; descarregar o oficial e verificar o SHA-256), proxies `node docs/development/ios-lab/proxy.mjs <porta> 3100`:
  3130 iPhone do owner (`http://192.168.1.8:3130/`), 3131 Chrome de teste (`--remote-debugging-port=9223`), 3133 Xiaomi, 3135 Simulador,
  3136 Safari desktop.
- Laboratório: `ios-lab/README.md` §4 — ferramentas novas de 11/11 (`where.js`, `cstate.js`, baterias do Xiaomi, `desk-walk.sh`,
  `desk-contact.sh`, medição de fotogramas). Simulador: `v5-iphone` no Device Hub, `simtouch` + `lab.sh` (pôr o Device Hub à frente antes
  de cada gesto: ao abrir um endereço o foco sai e os gestos perdem-se).

### Feito hoje (pormenor e números em `v5-tests.md`, secções de 11/11)
1. **Bordas do iOS na passagem E** (`contact-client.tsx` `edges()`, `sequence.ts`): a ilha e a faixa da barra do Safari pintadas a cada
   fotograma com a cor do topo do ecrã, em vez de uma transição de tempo fixo (iam 0,35 s à frente na ida e ~1 s na volta). Owner: a ida
   ficou bem.
2. **A volta Contact → Questions sem o vídeo a descer nem barra em cima** (`contact.css` `--c-reach`: a secção começa 50svh mais acima; um
   sticky nunca sai da sua secção — a sala descia 42 px no fim do gesto). Owner: "scroll tá corrigido".
3. **A "barra de cor" que subia com o *Built around you*** (`contact.css` `.c-shade`, só iPhone): no fim da página o Safari pinta por baixo
   da sua barra a cor lisa da página (o documento acabou), mais clara e fria que o filme — o fundo da sala é agora essa cor, fixo (ligado
   ao scroll via-se a ajustar).
4. **O "filtro a ajustar" em gestos rápidos no fim** (`contact.css`: `clip-path` no cartaz, filme e véu no 100svh, iPhone): era o filme
   cru a aparecer 1–3 fotogramas por baixo da barra quando esta abre/fecha. Medido no iPhone do owner (gravador por fotograma + vídeo) e
   no Simulador (3 → 0 em 8 gestos; 0 em 16 aberturas da barra). Owner: "pareceu ok".
5. **Passagem completa do Contact** no Xiaomi, Chrome e Safari desktop (eventos reais), reduced-motion e sem JS: certo; só os gestos muito
   rápidos passam paragens.
6. **O 12 mais rápido** (`about-stage.ts`, pedido do owner): a mesma ordem, ~⅓ mais curto, o nome a entrar com o retrato — no telemóvel
   *I'm Flávio.* aos 1,5 s (era 2,5 s), avança para o 13 aos 2,0 s (era 3,0 s). **Por aprovar no iPhone.**
7. **A volta Contact → Questions em 1,2 s** (era 2 s; `BACK_MS`): as perguntas aparecem quando a página pára (havia ~0,75 s de papel vazio,
   onde um 2.º gesto levava ao 14 — a explicação provável do "passo do contact para o about e fecha logo o questions"). **Por aprovar.**
8. **Avaliação das paragens no site inteiro** (tabela em `v5-tests.md`). O "volta ao Contact no fim" que reportei era falso (o detetor;
   corrigido em `where.js`/`cstate.js`).

### Para o owner testar no iPhone (`http://192.168.1.8:3130/`, recarregar) e no PC
1. 11 → 12 → 13: o 12 mais rápido continua elegante? Mais rápido, mais calmo, ou assim?
2. Contact → Questions: as perguntas já lá estão quando a página pára? A volta em 1,2 s está bonita?
3. Se ainda "passar do Contact para o About": dizer se foi um gesto ou dois — ou abrir a página e pedir o gravador (consola remota no 3130:
   regista cada fotograma enquanto se faz o gesto e se grava o ecrã).
4. O fim da página com gestos rápidos (o "filtro"), com o filme a tocar.

### Por corrigir (por ordem proposta)
1. **Gestos rápidos que passam paragens** (#103-16, adiado antes; o owner pediu hoje a avaliação): Xiaomi (forte 700 px a 6000 px/s salta
   ~uma em duas, nos dois sentidos), Chrome desktop (trackpad rápido salta muitas), Safari desktop (algumas). O iPhone (Simulador) está
   certo mesmo rápido. `scroll-snap-stop: always` não segura as marcas nesses browsers. Ideia a medir antes de propor: guardar "uma paragem
   por gesto" por script só fora do iOS (no fim do gesto, `scrollend`, se passou mais de uma marca, voltar à primeira) — ver como fica à
   vista; risco: um recuo visível depois do gesto.
2. **Desktop, gesto normal, 7 → 7 → 8b** (Chrome e Safari): depois da retenção do 7, o gesto seguinte salta o 8a. Por investigar.
3. **Safari desktop: 12 → 10 num gesto para cima**, 1× no percurso normal e 2/5 logo a seguir a entrar no About pelo menu. Por investigar.
4. **A subida das Questions (14 → 15)** — rápida no telemóvel, gesto longo no desktop (pedido de 9/11, ainda em aberto).
5. **A barra de cima** — correções por definir com o owner.
6. Do plano: imagem de partilha (M7), validação final (M8), tirar o medidor de FPS de `page.tsx` antes de publicar.

### Não verificado
Firefox (não instalado); o iPhone do owner com o 12 novo e a volta em 1,2 s; o Xiaomi com o 12 visto pelo owner (só medido).

## ▶ 10 de novembro de 2026 (fim do dia) — M7b: o Contact com a passagem E (README #107; por aprovar; não commitado)

### Estado
- Branch `v5` em `602858d` (enviado). **Tudo o que está abaixo está por commitar:** o Contact (`src/components/contact/`), a passagem E,
  as correções do dia e a regressão de `602858d` (o papel das Questions sem fundo no Chrome/Android, corrigida aqui). Commit só quando o
  owner pedir, com tudo junto; ele faz o push no GitHub Desktop.
- Servidores (morrem quando o Mac desliga): `npm run build` e `npx next start -p 3100`, e os proxies
  `node docs/development/ios-lab/proxy.mjs <porta> 3100` — 3130 (iPhone do owner `http://192.168.1.8:3130/`), 3131 (Chrome de teste),
  3133 (Xiaomi), 3135 (Simulador), 3136 (Safari desktop). Uma porta por browser: a consola remota responde de qualquer página nessa porta.
  O Node do Mac (20.5) é velho para o Next 16.3: usar o Node 22 oficial (o do scratchpad apaga-se; descarregar outra vez e verificar).
- Laboratório: Device Hub com o `v5-iphone`, `simtouch` (dedo real), `wheel.swift` (trackpad/roda reais), Xiaomi por adb — `ios-lab/README.md`.

### O que ficou feito hoje (pormenor em `v5-tests.md`, as secções de 10/11)
1. **A passagem Questions → Contact é a E** (storyboard https://claude.ai/artifact/KcQYyLJYgDuJLgasK7atbm,
   `storyboards/saida-mascara/`): as perguntas saem, o papel escurece onde está, o filme acende-se por cima, a pergunta, a linha e
   *Talk to us*. 3 s a ir, 2 s a voltar; começa a 15 % do caminho entre as paragens; desfaz-se se o gesto não passa meio caminho.
2. **O filme em ecrã inteiro no iPhone** (debaixo da ilha e da barra do Safari): o Contact é uma camada própria por cima das Questions.
   Medido no Simulador com sondas de cor: com o filme por trás do papel, o Safari nunca o levava às faixas — foi a causa de todas as
   "barras de cor" e de todos os remendos falhados (cor lida do filme, rampas), que saíram.
3. **O "risco" no desktop** era o filete do colofão a subir sobre o filme: agora o colofão entra a desvanecer e o filete só no fim.
4. **No fim da página:** sem salto elástico (iOS e rato/trackpad); a pergunta já não salta quando a barra do Safari entra/sai; a paragem
   do fim alinhada pelo pé da página.
5. **Bugs encontrados a testar e corrigidos:** perguntas vazias ao aterrar em `#questions` (todos os observadores de um elemento liam a
   primeira de duas leituras — corrigido no site todo); toques no escuro do Contact abriam perguntas invisíveis; o Safari desktop aterrava
   no topo com `#questions`/`#contact` (agora 4/4).

### Para o owner testar na próxima sessão (iPhone e PC)
No iPhone (`http://192.168.1.8:3130/`, recarregar) e no PC (`localhost:3100`, Chrome e Safari):
1. **Do 14 (About) às Questions e ao Contact, gesto normal:** o papel escurece, o filme acende-se, a pergunta, depois a hora e o botão.
   É assim que queres? O tempo (3 s) está bem?
2. **Ecrã inteiro no iPhone:** no Contact parado, o filme vai até à ilha e até ao fundo, sem faixas de cor? E no fim (colofão)?
3. **Gesto lento** das Questions para o Contact (arrastar devagar e largar a meio): a luz começa logo a baixar e volta se a página volta?
4. **Gesto rápido** e **dois gestos seguidos** até ao fim; e **de volta** (fim → Contact → Questions → About): uma paragem por gesto?
5. **No fim, forçar o scroll** para baixo e para cima: algum salto, cor a mudar ou linha a atravessar o ecrã?
6. **Ida e volta rápida** nas Questions ↔ Contact (mudar de ideias a meio): fica alguma coisa misturada ou parada a meio?
7. **Tocar** numa pergunta nas Questions (abre?) e no escuro do Contact (não deve abrir nada); *Talk to us* e os links do colofão.
8. **A barra de cima** sobre o papel e sobre o escuro (o owner já disse que a barra vai precisar de correções; anotar o quê).
9. **Abrir um endereço** (`…/#questions`, `…/#contact`) no Safari do PC e do iPhone: aterra no sítio certo?
Se algo falhar: gravar o ecrã (vai para `docs/development/ios-lab/out/` pelo botão *enviar foto/vídeo*) e dizer o ponto.

### Conhecido e deixado (decidir com o owner)
- **Fling rápido para cima a partir do fim, no Chrome desktop,** passa o Contact e vai às Questions (no Safari não). É o tema dos gestos
  rápidos no site todo (#103-16), já adiado pelo owner; não vem da E (igual com a paragem antiga).
- **A subida das Questions (14 → 15)** rápida no telemóvel e com mudança de cor brusca — o próximo trabalho, agora mais à vista com o
  Contact calmo.
- **A barra de cima** — correções por definir com o owner.
- Não verificado depois da E: movimento reduzido, sem JavaScript, 768 com toque, Firefox.
- Por fazer do plano: imagem de partilha (M7), validação final (M8), tirar o medidor de FPS antes de publicar.

### Antes (histórico deste dia)

**Estado:** branch `v5` em `602858d` (enviado) + o Contact e a passagem A (README #106), sem commit. Build feita; `next start -p 3100`,
proxies 3130 (iPhone `http://192.168.1.8:3130/`), 3131 (Safari desktop), 3133 (Xiaomi), 3134/3135 (Simulador). Device Hub aberto com o
`v5-iphone`; `simtouch` a correr (scratchpad `touch/`). Testes: `v5-tests.md`, "M7b — Contact" e "M7b — refeito… 10/11".

**⚠ Regressão já no commit `602858d`, corrigida aqui (por commitar):** desde a manhã de 9/11 o papel das Questions no Chrome/Android
não tinha fundo (gradientes recusados pelo Chrome). Commitar esta correção com o Contact.

**Como ficou (10/11):** a cena do Contact presa desde o início, invisível; a passagem **tocada** (`contact-client.tsx`, fotograma a
fotograma: o iOS corta transições CSS e Web Animations começadas na inércia): o papel desvanece 1,4 s, a pergunta aos 0,9 s, a linha e
*Talk to us* aos 1,6 s; o colofão só no fim (meio ecrã a mais antes dele). Verificado no Simulador com dedo, Safari e Chrome desktop com
eventos reais, Chrome toque 390/320.

**Xiaomi (10/11):** paragens certas, passagem ~81 fps; o filme só toca no Contact (um fotograma de 58–67 ms quando arranca). **Corrigido a seguir (owner):** a barra sobre as Questions ilegível e os toques nas perguntas apanhados pela camada do Contact.
**Corrigido depois do vídeo das 13:22 (owner):** as perguntas ficam paradas no lugar enquanto a luz baixa (subiam com a página), e a ilha
e a faixa da barra do Safari escurecem com o papel (ficavam claras sobre a sala escura). Simulador e Chrome; **falta o Xiaomi** (não
estava ligado) e o iPhone do owner. **A barra de cima precisa de correções** (owner): fica para depois de fechar o Contact.
**Corrigido depois dos vídeos das 16:35/16:39 (owner):** o filme do Contact nasce da cor lisa que o Safari pinta na ilha e debaixo da
barra (sem barras de cor); sem salto elástico no fim (iOS e rato/trackpad), que punha o colofão sobre o endereço e desenhava uma faixa
preta no Safari desktop; a subida da cena acompanha a barra do Safari (`100dvh`).
**Refeito depois do vídeo das 17:03 (owner: "estamos a falhar constantemente"), medindo primeiro:** as faixas do iOS são sempre a cor da
página (sonda verde/vermelho/azul no Simulador) → essa cor é a do filme no topo, lida do fotograma; a subida da cena com `100svh` (não
salta); a paragem do fim alinhada pelo pé da página; o filete do colofão só no fim da sua entrada (era o "risco"); e as perguntas vazias
ao aterrar em `#questions` (observadores que liam a primeira de duas leituras), corrigido em todo o site. Simulador, Xiaomi, Chrome e
Safari desktop. **Por investigar:** o Safari desktop aterra no topo com `#questions` mudado por AppleScript.
**Para o owner:** ver no iPhone e no PC.
**Depois:** a afinação da subida das Questions (14 → 15: gesto longo no desktop, rápida no telemóvel) — talvez tocada como esta.

## 9 de novembro de 2026 — revisão do M7a ponto a ponto (cinco correções aprovadas; não commitado)

**Estado:** branch `v5` em `1d32373` + o M7a (Questions) e as correções de hoje, sem commit. Build feita; `next start -p 3100` + proxy
3130 (iPhone `http://192.168.1.8:3130/`). Node: o do Mac (20.5) é antigo para o Next 16.3 — usar o Node 22 oficial (scratchpad da sessão,
SHA-256 verificado; voltar a descarregar se o scratchpad tiver sido limpo). Tudo em `v5-tests.md`, "Revisão do M7a com o owner… 9/11".

**Aprovado pelo owner hoje (iPhone e PC):**
1. Topo do iOS nas Questions: o cartão sobe 70 px mais e passa debaixo da ilha (`questions.css --q-lift`, paragem e `#questions` 70 px
   abaixo). Os ícones da barra de estado a passar a branco durante a subida: é o iOS, fica assim.
2. 12 com a fotografia inteira ao voltar depressa do 13: corrigido (`setOpen(false)`).
3. A pílula dentro da ilha: a lente da barra só fora do WebKit.
4. Retenção no 14 enquanto o texto entra (`data-story`), telemóvel e desktop.
5. Barra no Safari desktop: certa no 3100. **Avaliar a cor do topo do Safari desktop sem o proxy** (o `hud.js` muda-a).

**Decidido sem trabalho:** contraste da barra sobre papel (meio-termo mais tarde); trackpad curto Questions → 14 (ok); o 8 com três
paragens no telemóvel (fica); a paragem nas Questions antes do Contact entra com o Contact.

**Passagem completa (9/11 noite, `v5-tests.md`):** Xiaomi, Chrome e Safari desktop com eventos reais, 390/320/768 com toque,
reduced-motion, sem JS, 5 larguras — sem regressões. **Para o owner decidir:** no Safari desktop um gesto normal de Experiences para o
7 fica em Experiences 2 vezes em 5 (o seguinte entra) — afinar as marcas do desktop (aprovadas a 8/11)? Falta: a subida do papel no
Xiaomi (adormeceu). ⚠ Os `mouseWheel` do CDP dão falsos "presos" no desktop: usar `finger/wheel.swift` (README do laboratório).

**Pedido do owner (9/11, fim), para depois do Contact:** a subida das Questions (14 → 15). No desktop é precisa um gesto longo (a
subida mede um ecrã, ~990 px; um gesto curto começa a subir o cartão e a paragem leva-o de volta ao 14); no telemóvel o gesto está bom
mas a subida é muito rápida (é o encaixe do iOS que a leva). Duas opções, apresentadas ao owner: (a) **afinar a proporção** — uma
animação de scroll no compositor: no telemóvel a subida espalhada pelo gesto inteiro (~1,5–1,7× mais lenta, ainda segue o dedo), no
desktop comprimida em ~0,7 ecrã (o meio caminho do Safari a ~300 px); (b) **passagem tocada** como o 7 e o 12 (~1,4 s fixos, uma cópia
do topo das Questions sobe no palco do About e dá lugar à secção verdadeira). Recomendado começar por (a). Decidido fazer **depois do
Contact** (as marcas do fim da página mudam com ele).

**Próximos passos:** (1) a subida do papel no Xiaomi (e o que ficou de ontem: bloqueou-se); reduced-motion, sem JS e as cinco larguras;
(2) registar e **commit** quando o owner pedir (push pelo GitHub Desktop); (3) o Contact (M7b, estados 19–21), com a paragem nas
Questions antes dele, a barra e as bordas do Safari no fim da página; (4) a imagem de partilha. Em aberto antes de dar o site por
concluído: arrastos de quase um ecrã que passam uma fase; no desktop um gesto de trackpad que às vezes passa uma fase.

## 8 de novembro de 2026, noite — M7a: Questions construídas (por aprovar; não commitado)

**Estado:** branch `v5` (o `v5-cloud-about` foi integrado por fast-forward e enviado: `1d32373`). Por cima, sem commit: as Questions
(`src/components/questions/`), a passagem 14 → 15 e o scroll do fim (`about-stage.ts`, `about.css`, `method.css`), `page.tsx`,
`globals.css`, `sequence.ts`, `src/lib/address.ts` (chegar com `#questions`/`#contact`), a retenção do 12 (`about-stage.ts`, `method.css`). Build feita; `next start -p 3100` + proxy 3130 (iPhone `http://192.168.1.8:3130/`).
Testes: `v5-tests.md`, "M7a — Questions".

**Para o owner ver/decidir:**
1. As Questions no PC (http://localhost:3100/), no iPhone e no Xiaomi: a subida do papel sobre o About, a entrada, uma resposta de cada vez.
2. **O scroll pelas Questions e pelo Contact** é por paragens a cada 3/4 de ecrã (até ao fim da página) — foi a forma fiável de um gesto
   forte para trás não atravessar o About no iPhone. **Rever ao fazer o Contact (pedido do owner, 8/11).**
3. A espera depois do 14 ficou mais curta (o papel começa 0,35 ecrã depois do 14 no telemóvel, 0,25 no desktop).
4. A barra sobre o papel claro: ~3,9 : 1 (vidro no máximo aprovado, 0,50).
5. Safari desktop: das Questions para o 14 um gesto curto de trackpad às vezes não chega.

**Xiaomi validado (8/11 noite):** gestos, perguntas, menu; subida do papel 86–89 fps, 0 fotogramas acima de 50 ms. Encontrados nele e
corrigidos: o papel tapava o Contact e o rodapé no telemóvel (`overflow: clip`); chegar com `#questions` abria no Method (`address.ts`).
**Pedidos do owner (8/11 noite), feitos:** (1) retenção no About enquanto a luz encontra o retrato (12), como a do 7, telemóvel e desktop
(no Safari desktop só se desligam as marcas depois do 12); (2) a entrada das Questions começa com o papel a subir (não chega vazio);
(3) no telemóvel o papel enche o ecrã todo. Xiaomi por repetir com estes (bloqueou-se).

**⚠ ABERTO PARA AMANHÃ (owner, iPhone, 8/11 fim da noite): "continuo a ver a cor que não enche no iOS".** A correção (3)
(`min-height: var(--screen)` nas Questions, telemóvel) passou no Simulador e no Chrome, mas não no iPhone dele. Não investigado (sessão
fechada a pedido). Começar por:
1. Pedir ao owner um vídeo ou captura: **onde** falta a cor (em cima, na ilha/barra de estado? em baixo, debaixo da barra do Safari? dos
   lados?) e **quando** (durante a subida do papel, ao chegar, ou parado nas Questions). Confirmar que recarregou (cache do Safari).
2. Suspeitas: (a) as **bordas do Safari** (`sequence.ts` `paintEdges`, `QUESTIONS_EDGE #dcd5c8`) mudam só quando a secção passa a
   `questions`; durante a subida o topo/fundo do Safari ainda é a cor do About (escuro) com o papel claro na página — ou, ao contrário,
   claro sobre o fundo do papel mais escuro (`#beb5a6` + vinheta) em baixo; (b) o papel (`.q-paper`, `sticky`, `height: var(--screen)` =
   `100lvh + 130px` no iOS) recortado pelo `overflow: clip` da secção — se a secção começa abaixo do topo do ecrã físico (o `--a-lift`/
   `--m-lift` de 70 px dos palcos no iOS não existe nas Questions) pode faltar papel por baixo da ilha; (c) a sombra do topo do cartão.
3. Simulador: Device Hub (`osascript … set frontmost of process "DeviceHub"`), `lab.sh`, capturas da janela em `-R1225,175,370,770`.
   **Fechar os separadores 3130 do Xiaomi antes** (`xblank.mjs`): também respondem à consola e baralham os resultados.
**Por fazer:** o Contact (estados 19–21, M7b) — com ele a barra e as bordas do Safari no fim da página (hoje *04 Questions* e cor do
papel por cima do Contact); a imagem de partilha (M7).
**Mantidos em aberto pelo owner (8/11), a fechar antes de dar o site por concluído:** arrastos de quase um ecrã que passam uma fase;
no desktop um gesto de trackpad que às vezes passa uma fase.

## 8 de novembro de 2026, tarde — scroll do telemóvel corrigido nas pontas (validado pelo owner, commit `1d32373`, integrado no `v5`)

**Estado (não commitado):** branch `v5-cloud-about` em `9b437e1` + alterações: `method-stage.ts`, `method.css`, `about-stage.ts`,
`src/lib/address.ts`, `src/lib/finger.ts` (novo), ferramentas em `docs/development/ios-lab/finger/`. Build feita; `next start -p 3100` + proxy
3130 (iPhone: `http://192.168.1.8:3130/`). Ao lado: o `v5` (`ffeec33`) em 3200/3230 e `9b437e1` em 3101/3131/3133 (worktrees no scratchpad).
Tudo em `v5-tests.md`, secção "O scroll do telemóvel nas duas pontas da cena… 8/11 tarde".

**Corrigido (vídeo do owner de 8/11 11:47 + vídeo do `addc06d`), reproduzido e medido no Simulador com dedo:** preso em Experiences (A);
a passagem da luz cortada (B); as palavras do 7 sobre o escuro antes da luz; a cena a saltar 70 px ao começar a volta; o "partido" do
`addc06d` (um gesto rápido atravessava a cena — a paragem ligada a meio da inércia não conta no iOS); a luz a saltar numa inversão; o
About pelo menu a aterrar fora da marca. D e E: decididos pelo owner (D é a composição aprovada; E nada notado).

**Próximos passos:**
1. **O owner valida no iPhone e no browser** (o veredicto): vaivém rápido Experiences ↔ 7/8a, gestos fortes, voltar do fundo da página,
   menu. A retenção durante a passagem da luz já foi vista no iOS e **aprovada** ("é assim que quero", 8/11). Se o resto estiver bem:
   commit e o owner faz push (GitHub Desktop).
2. Xiaomi validado com a build final (bateria + fps A/B com `9b437e1`: sem regressão; `v5-tests.md`).
3. Em aberto (ver o relatório desta sessão): arrastos de quase um ecrã passam uma fase (Xiaomi, toque emulado); no Safari/Chrome desktop,
   às vezes uma fase passa num gesto de trackpad (já era assim ontem); trackpad/roda físicos não testados.
4. **Ao fazer o M7 (Questions e Contact) — rever com o owner (pedido dele, 8/11):** a paragem do telemóvel continua hoje pelo Questions e
   pelo Contact, com uma marca no fim da página (`about-stage.ts` placeMarks, `method.css` regra do telemóvel). Foi a forma fiável de um
   gesto para trás não atravessar o About; com as secções a sério (mais longas, com conteúdo próprio) decidir onde a paragem acaba.

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

## 4 de novembro de 2026 — About construído numa sessão na nuvem, branch `v5-cloud-about` (integrado no `v5` a 8/11, `1d32373`)

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
