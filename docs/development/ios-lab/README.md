# Laboratório iOS — ecrã inteiro por trás da Dynamic Island (para a sessão no MacBook)

Escrito a 7 nov 2026, no fim da sessão no PC. Objetivo: **corrigir as bordas no iPhone** (passo 1 da lista de bugs de 6/11, handoff
"COMEÇAR AQUI · 6 de novembro": bugs 2 em cima, 6, 11, 12) testando no **Simulador de iOS** do Mac, sem depender de gravações do owner a
cada tentativa. O veredicto final continua a ser o iPhone do owner (e o Xiaomi para Android).

Lê primeiro: o topo do `docs/development/v5-handoff.md` ("COMEÇAR AQUI · 7 de novembro") e o `CLAUDE.md`.

---

## 1. O que o owner quer (decidido, não reabrir)

- **iOS:** o site "totalmente em ecrã inteiro": as cenas ocupam o ecrã todo, **incluindo a zona da ilha e a faixa de baixo**, e **nada
  fabricado** — nenhuma cor lida e pintada a imitar a cena, a menos que seja mesmo necessário. Exemplo do owner: na passagem Work → 7, a
  faixa da ilha deve acompanhar a luz **do lado que ela já atravessou**, o outro lado fica como está (só possível se a cena estiver lá).
- **Android:** as barras do Chrome são opacas (a página não desenha atrás delas): **seguem a cena** por `theme-color`, sem adiantar nem
  atrasar (owner, 7/11, escolheu "seguir a cena").
- O mesmo princípio nos dois sistemas.

## 2. O que já está provado no iPhone real (owner, Safari 27.2, ecrã 402 × 874)

Páginas em `labs/` (html/body **magenta** de propósito: se aparece magenta, o Safari pintou a cor da página, não a cena).

| Teste | Resultado |
|---|---|
| lab2 — cena `sticky` 70 px acima do ecrã | a faixa da ilha e a de baixo são **sempre a cor do html** (magenta, escuro, branco conforme o botão); a cena corta-se no pé da ilha |
| lab3 — A em fluxo / B `fixed` top 0 / C `fixed` top −70 / D `sticky` −70 | **só A** (conteúdo que corre com a página) aparece por trás da ilha e por baixo da barra; B, C e D: magenta |
| lab4 — E palco em fluxo segurado por **animação de scroll CSS** / F segurado por JS / D sticky | **E chega à ilha e fica parado** (linha vermelha a 60 fps: 0–1 px, 4 px uma vez quando a barra do Safari mudou); F treme 12–44 px; D magenta |
| lab5 — E com cartões animados por Web Animations (sem parar) e uma barra fixa de vidro como a do site | cartões **sempre visíveis**; a ilha mostra a cena **com e sem** a barra fixa |

Consequência: a "subida" de 70 px dos palcos presos (`--m-lift` no Method, `--a-lift` no About, a do Work) **nunca chegou à ilha** —
no Work parecia certo só porque o html tem a cor do fundo do Work. A técnica que funciona é a do lab4 E:

```css
.secao { view-timeline: --h block; }
.palco { position: relative; top: -70px;                 /* subida por deslocamento relativo, NUNCA margin-top negativo */
         animation: hold linear both; animation-timeline: --h;
         animation-range: contain 0% contain calc(0% + L); } /* L em px/lvh fixos, não %: o range muda com as barras */
@keyframes hold { from { transform: translateY(0) } to { transform: translateY(L) } }   /* L = altura da secção − ecrã */
```

## 3. A tentativa no Method (7/11) e porque falhou

Patch completo em `attempt/method-in-flow-1107.patch` (+ `attempt/leap.ts`). **Revertida**: o código do site está em `1cb418c`.

- **Xiaomi: certo.** Posição igual à do sticky ao píxel (390 × 844, 320 × 640, nos dois sentidos). Saltos feitos pelo site (menu,
  endereços, teclado) atrasavam a animação ~10 fotogramas e via-se o Work por baixo → `leap.ts` marca `data-leap` e o palco volta a
  `sticky` enquanto aterra (resolvido, gravado). Custo: subir depressa 67–70 → 59–62 fps; fling para cima 53 → 43 (Xiaomi, CDP).
- **iPhone: partido.** Três causas, duas já encontradas:
  1. **A subida perdia-se:** o `margin-top: -70px` do bloco iOS colapsava com a margem negativa da secção (−3,1 ecrãs) → palco 70 px
     abaixo (fita do iPhone: topo do palco 0, não −70). Corrigido com `top: -70px` relativo + `margin-top: 0` (já no patch).
  2. **A faixa escura por baixo da ilha era o `-webkit-box-reflect`** do estúdio (bloco iOS de `method.css`: `.m-wipe-in .m-studio`)
     — num palco em fluxo o Safari não o desenha e os 70 px de cima ficavam transparentes. **Provado** (interruptor "sem reflexo"): sem
     ele a ilha mostra o estúdio claro e o 9 sobe por trás da ilha. Falta uma forma de preencher os 70 px sem reflexo e sem mudar o
     corte da sala (no teste a sala subiu 70 px: `top: 0`).
  3. **Os cartões e as palavras desaparecem quando as animações acabam** (aparecem enquanto animam). Hipótese: o Safari pinta as partes
     do palco sem camada própria como se o palco estivesse na posição estática (fora do ecrã). **Teste pronto, ainda não corrido:**
     interruptor "Method em fluxo, sem reflexo, camadas" (`will-change: transform, opacity` nas partes do palco).

## 4. Ferramentas desta pasta

- `proxy.mjs` — serve a build do site com o painel de diagnóstico (`hud.js`) injetado; a build não muda.
  `node docs/development/ios-lab/proxy.mjs 3130 3100` (escuta em 3130, site em 3100). Rotas: `/__diag/lab2` … `lab5` (as páginas de
  `labs/`), `/__diag/hud.js`, `POST /__diag/log` (fita), `POST /__diag/file` (vídeo/foto do telemóvel) → `out/` (ignorado pelo git).
  `?wake` no endereço do site mantém o ecrã ligado (Wake Lock; só em contexto seguro, ex. `localhost`).
- `finger/wheel.swift` (9 Nov) — **eventos reais do macOS** na janela que estiver à frente: `wheel x y n ms` (n cliques de uma roda de rato,
  linhas, sem fases; n < 0 sobe), `wheel x y dy n pad` (um gesto de trackpad com fases e inércia, como o `simtouch`), `wheel x y click`.
  Compilar: `DEVELOPER_DIR=~/Downloads/Xcode-beta.app/Contents/Developer xcrun swiftc -O wheel.swift -o wheel` (fora do repositório).
- `finger/journey.mjs` (9 Nov) — a página inteira num Chrome de teste (`--remote-debugging-port=9223`, perfil no scratchpad): um gesto de
  cada vez até ao fim e de volta ao topo; fase, etiqueta da barra, overflow, fps, erros. `node journey.mjs 390 844 touch`. O Chrome de teste
  tem de estar **à frente** (`System Events … frontmost of process whose unix id is <pid>`): atrás, os gestos de toque não fazem nada.
- **Ferramentas de 11 Nov** (todas leem o estado pela consola do laboratório ou por CDP; resultados em `v5-tests.md`, 11/11):
  - `finger/where.js` — onde está a página numa palavra (`W<capítulo>@y`, 7…11, 12–14, Q, C, fim): `curl --data-binary @where.js
    localhost:<porta>/__diag/run`. `finger/cstate.js` — o estado das Questions/Contact em repouso, com `✗(…)` se algo não bate (secção,
    `c-dusk`, sala, pergunta, linha, perguntas, colofão, barra, overflow). ⚠ O fim conta-se a < 60 px: a < 3 px, com a barra do Safari
    aberta no fim, dava "C" sem a página se mexer (o falso "volta ao Contact" de 11 Nov).
  - `finger/xiaomi-contact.mjs` (bateria do Contact por toque: normal, forte, lento, vaivém, dois gestos, toques, saltos, fps),
    `finger/xiaomi-contact-force.mjs` (forte/médio/normal, 3× de cada ponto), `finger/xiaomi-walk.mjs` (o site inteiro, normal e forte),
    `finger/xiaomi-12.mjs` (a passagem 11 → 12 cronometrada e a retenção). Xiaomi: `adb forward tcp:9222 localabstract:chrome_devtools_remote`,
    `adb reverse tcp:3133 tcp:3133`, o separador em `localhost:3133`.
  - `finger/desk-walk.sh <porta> <x> <y> "<comando de foco>"` (o site inteiro, trackpad normal e rápido) e `finger/desk-contact.sh` (a
    bateria do Contact) — eventos reais: `WHEEL=<caminho do wheel compilado>`. Chrome de teste no 3131 (`x 750 y 583` com a janela em
    0,40 1500 × 1000), Safari no 3136 (`x 864 y 571` com a janela em 202,75). ⚠ No zsh separar os argumentos (`${=d}`), e nunca chamar
    `seq` a uma função de shell que use o comando `seq` (11 Nov: recursão, os processos do Mac esgotaram-se).
  - `finger/frames-band.mjs`, `finger/frames-rgb.mjs` — luminância / RGB por faixa de linhas, fotograma a fotograma, de uma gravação
    (iPhone 1206 × 2622): para medir faixas, arestas e cores nos vídeos do owner.
- **Ferramentas de 12 Nov — o passeio "como um visitante"**: `finger/watch.js` (vigia na página: erros, fotogramas, a foto da passagem fora
  do ecrã, a barra, Questions/Contact, restos de gestos; ler com `watch-dump.js`), `finger/human-xiaomi.mjs <semente> <pasta>` (Xiaomi por CDP)
  e `finger/human.mjs sim|chrome|safari <semente> <pasta>` (`TOUCH=<pasta do simtouch>` ou `WHEEL=<wheel compilado>`): do topo ao fim e de
  volta com gestos mistos, menu, toques, links do menu; captura em cada paragem. ⚠ Em zsh o `RANDOM` não avança dentro de `$( )`; o Safari
  volta ao mesmo sítio ao recarregar (abrir um endereço novo).
- **Ferramentas de 13 Nov**: `finger/xiaomi-bugs.mjs [prefixo] [1,2,3,4,5,c]` (os 5 bugs dos vídeos do owner e o Contact, no Xiaomi
  por CDP, medidos fotograma a fotograma) e `finger/xiaomi-drag.mjs` (arrastos com toques reais por `Input.dispatchTouchEvent`: o
  `synthesizeScrollGesture` não dá `touchstart` à página, e o "dedo no vidro" do Contact não o via; o `adb shell input swipe` precisa no
  MIUI de "Depuração USB (definições de segurança)").
- ⚠ **Não julgar a paragem por fase no desktop com `Input.dispatchMouseEvent` (`mouseWheel`) do CDP**: o Chrome trata esses eventos como
  scrolls soltos e encaixa na marca mais próxima, não na seguinte — dá "preso em Experiences" e "preso no 14" que **não existem** com uma
  roda ou um trackpad reais (medido 9/11 com `wheel.swift`: uma fase por clique / gesto). Para o desktop, eventos reais.
- **A cor do topo do Safari desktop não se avalia pelo proxy**: o `hud.js` tem elementos fixos e o Safari 27.2 tinge a barra com a cor de
  um elemento fixo de largura inteira no cimo. Ver no `:3100` direto.
- `hud.js` — painel à direita no site servido pelo proxy:
  - **● rec**: grava por fotograma scroll, alturas do ecrã/visualViewport, a posição do palco do Work e — coluna 19 — a do Method:
    `[topo da secção, topo do palco, fundo do palco, y do transform, fase, data-leap, m-leaving, position, --m-lift]`. Ao parar envia a
    fita para `out/*-tape.json`.
  - **testes**: interruptores de CSS injetado (um de cada vez, guardado em `sessionStorage`, a página recarrega):
    `flow` (Method em fluxo, a técnica do lab4 aplicada ao palco), `flownoref` (+ sem o reflexo), `flowlayers` (+ camadas próprias),
    `noref` (sticky sem reflexo), e os antigos (`bg` magenta, `rulers`, …). É a maneira mais rápida de testar no site verdadeiro sem
    rebuild.
  - 📎: envia vídeo/foto do telemóvel para o PC/Mac.

## 5. Montar o Simulador no Mac

1. **Xcode** (App Store) → abrir uma vez → *Settings → Components*: instalar o runtime **iOS 27** (o Safari do owner é o 27.2).
   `xcode-select --install` se faltar a linha de comandos.
2. Criar e arrancar um iPhone com ilha do tamanho do do owner (402 × 874 pt — iPhone 16 Pro / 17 Pro):
   ```sh
   xcrun simctl list devicetypes | grep -i pro
   xcrun simctl list runtimes
   xcrun simctl create v5-iphone "iPhone 17 Pro" <runtime-id-ios-27>
   xcrun simctl boot v5-iphone && open -a Simulator
   ```
3. **O site:** clonar o repo, branch `v5-cloud-about`, `npm ci`, `npm run build`, `npx next start -p 3100`, e o proxy
   `node docs/development/ios-lab/proxy.mjs 3130 3100`. O Simulador partilha o `localhost` do Mac:
   `xcrun simctl openurl v5-iphone "http://localhost:3130/"`. (Alternativa: o PC na rede, `http://192.168.1.2:3130`, se estiver ligado.)
   **Atenção:** em `localhost` o Safari trata o endereço como seguro e outro dispositivo pode comportar-se diferente; confirmar no fim no
   iPhone real.
4. **Gravar e ver:**
   ```sh
   xcrun simctl io v5-iphone recordVideo --codec=h264 --force /tmp/run.mp4   # Ctrl+C para parar
   xcrun simctl io v5-iphone screenshot /tmp/shot.png
   brew install ffmpeg   # fotogramas: ffmpeg -i run.mp4 -vf "fps=2,scale=200:-1" f%03d.png ; tile=12x2 para folhas
   ```
5. **Gestos de dedo** (o scroll por código não mostra o que o dedo mostra — inércia, barras do Safari a recolher):
   ```sh
   brew tap facebook/fb && brew install idb-companion && pip3 install fb-idb
   idb ui swipe --udid <udid> 200 700 200 300 --duration 0.8     # dedo para cima = página desce
   ```
6. **Ler a página por dentro:** Safari do Mac → *Settings → Advanced → Show features for web developers* → menu **Develop → Simulator →
   a página**: consola, elementos, estilos calculados (ex. confirmar `getComputedStyle(stage).transform`, camadas em *Layers*).
   Para automatizar, `ios-webkit-debug-proxy` (`brew install ios-webkit-debug-proxy`) dá um WebSocket de inspeção ao Simulador.

**O que o Simulador vale:** o mesmo WebKit e a mesma interface do Safari (ilha, barra flutuante, faixas) → reproduz este tipo de bug
(faixas, camadas não pintadas, posições). **Não vale** para fluidez (desenha com a GPU do Mac). Confirmar primeiro que reproduz o que o
owner viu: (a) lab2 → faixas magenta com a cena presa; (b) site com o interruptor `flow` → faixa escura sob a ilha + cartões a sumir.
Se não reproduzir, dizer ao owner e voltar às gravações do iPhone.

## 5a. Estado no MacBook (7 nov 2026, 1.ª sessão) — retomar daqui

**O que se viu:** o Mac tinha Xcode 16.1 (simuladores até iOS 18.1). No **iPhone 16 Pro iOS 18.1** (402 × 874), lab2 em `localhost`
(scroll por código): a faixa da ilha é **sempre magenta**, mesmo com conteúdo **em fluxo** por baixo → o Safari 18 (sem barra
flutuante) **não reproduz** o que o iPhone 27.2 mostra. Não se testou o site nele. Precisa de iOS 26+ no Simulador.
O owner foi atualizar o Mac para o **macOS 27.2** para instalar o **Xcode 27** da App Store (runtime iOS 27 = o Safari do iPhone dele).
(Xcode 26.x corre no macOS 15.6; Xcode 27 exige macOS 26.6+ e Apple silicon — o Mac é M1 Pro, 16 GB.)

**O que já está feito no Mac** (sobrevive ao reinício):
- Repo em `~/WebstormProjects/STUDIO`, branch `v5-cloud-about` (`830d3de`), `npm ci` feito, `.next` construído.
- `public/media/v5/` (ignorado pelo git) **copiado do servidor do PC** (`http://192.168.1.2:3100`): 157 ficheiros, 22 MB — a lista
  tirada dos caminhos `/media/v5/…` da build. Não há `media-src/` no Mac, por isso `npm run images` não corre aqui.
- `brew tap facebook/fb` e `pip3 install --user fb-idb` (cliente). O `idb-companion` **não instalou**: exige Xcode 26+ completo.

**O que se perde no reinício e é preciso refazer:**
- **Node:** `/usr/local/bin/node` é 20.5.1 (o Next 16 pede ≥ 20.9) e o Node 21 do Homebrew está partido (falta `libicui18n.73`).
  Usou-se o Node 22.12.0 oficial (`nodejs.org/dist/v22.12.0/node-v22.12.0-darwin-arm64.tar.gz`, SHA-256 verificado) numa pasta
  temporária, que desaparece. Refazer igual ou instalar um Node ≥ 20.9 de forma permanente (decisão do owner).
- Servidores: `npx next start -p 3100`, `node docs/development/ios-lab/proxy.mjs 3130 3100` (correr da raiz do repo).
- Página de teste com scroll por código (sem `idb`): cópia do lab2 com `?y=` → `scrollTo(0, y)` no `load`, servida em `:3140`.

**Ao voltar, por ordem:**
1. Abrir o Xcode 27 uma vez (aceitar licença, componentes); `xcodebuild -downloadPlatform iOS` se o runtime iOS 27 não vier.
2. `brew install facebook/fb/idb-companion` (agora deve compilar). Atenção: este Homebrew está em "Tier 3" (sem pacotes prontos;
   compila de raiz — o `aria2`/`cmake` demoravam muito, cancelado). Alternativa: gestos via Safari Web Inspector / scroll por código.
3. Criar os simuladores: `iPhone 17 Pro` (402 × 874, o do owner), um pequeno (`iPhone 16e`/SE) e um `Pro Max`, todos iOS 27.
4. Refazer Node + servidores (acima) e seguir a secção 6 a partir do passo 1 (lab2 → faixas magenta com a cena presa; site com `flow`).

## 5b. Estado no MacBook (7 nov 2026, 2.ª sessão — macOS 27.2, Xcode 27.3 beta)

**Montagem que funciona:**
- Xcode 27.3 beta em `~/Downloads/Xcode-beta.app` (o `xcode-select` continua no 16.1; **não** foi mudado — exige `sudo`, decisão do
  owner). Usa-se por `export DEVELOPER_DIR=~/Downloads/Xcode-beta.app/Contents/Developer` antes de cada `xcrun`.
- Runtime **iOS 27.3 (24C5037i)** descarregado com `xcodebuild -downloadPlatform iOS` (8,5 GB). Simuladores: `v5-iphone` (iPhone 17
  Pro, 402 × 874), `v5-small` (17e), `v5-max` (17 Pro Max). Safari **27.3** (o do owner é 27.2).
- O Xcode 27 não traz Simulator.app: o simulador corre **sem janela** (`simctl boot`, `openurl`, `io screenshot`, `io recordVideo`).
- Ao abrir o Xcode beta a imagem do runtime foi montada uma segunda vez e os simuladores ficaram "unavailable". Resolveu-se com
  `killall -9 com.apple.CoreSimulator.CoreSimulatorService` e `simctl boot <udid>`.
- Node 22.12.0 oficial (SHA-256 verificado) no scratchpad da sessão (temporário); servidores como em §5a.
- **Consola remota** (nova, só nas ferramentas do laboratório): o `hud.js` pergunta ao proxy por JavaScript (`GET /__diag/cmd`) e
  devolve o resultado. Do Mac: `curl -s --data-binary 'return scrollY' localhost:3130/__diag/run`. `__flag('flowlayers')` liga um
  interruptor e recarrega. Substitui os toques no painel (o simulador sem janela não tem dedo).

**Resultados (scroll por código, barras do Safari visíveis):**
- Reproduz o iPhone: (a) lab2 sticky → faixas da ilha e de baixo **magenta**; lab4 E em fluxo → a cena chega à ilha e ao fundo;
  (b) site com `flow` → faixa escura sob a ilha, cartões, foto do 9 e sala escura do 11 **desaparecem**; `flownoref` igual sem a faixa.
- **`flowlayers` resolve:** cartões, palavras, 9 e 11 visíveis; com html/body **magenta** nenhum magenta na ilha nem em baixo em 7, 8a,
  8c, 9, 10, 11 → é a própria cena que lá está.
- **Conjunto mínimo de camadas:** `.m-screens, .m-end { will-change: transform }` (2 camadas) chega — testado em 7, 8a, 8b (a meio),
  8c, 9, 10, 11. (`.m-card` + `.m-end` também; o `flowlayers` inteiro punha camada em todos os filhos do palco.)
- **Passagem Work → 7** (gravação, scroll suave): o palco fica a −70 px em todos os fotogramas (0 px de desvio); **a orla de luz
  atravessa por trás da ilha** — a faixa fica clara do lado que a luz já passou e escura do outro (o pedido do owner no bug 2, topo).
- **A sala (passo 3):** a foto alta (900 × 1950) entra em `cover` pela altura: o topo da foto **é** o topo da sala; não há foto escondida
  acima do corte. Sem reflexo, os 70 px só se enchem (i) aumentando a sala 8 % (o que o `flownoref` faz: `top: 0`; corta ~19 px de cada
  lado em vez de ~3) ou (ii) um elemento-espelho que copie o reflexo de hoje (o mesmo visual, sem `-webkit-box-reflect`), ou (iii) uma
  derivada alta nova com mais teto a partir do master (no PC). **Decisão do owner.**

**Aplicado no código (7/11, 2.ª sessão, sem commit):** o patch `attempt/method-in-flow-1107.patch` + `src/lib/leap.ts`, e:
- **Espelho em vez do `-webkit-box-reflect`** (escolha do owner, opção ii): `.m-mirror` dentro do `.m-studio` (method.tsx), a foto da
  sala virada nos 70 px de cima; a sala mantém a caixa e o corte; a luz da hora (`.m-key`) desce com `translate` e ilumina os 70 px ela
  própria. Topo do 7 no Simulador: sem costura (antes: faixa escura).
- **2 camadas** só no iOS: `.m-screens, .m-end { will-change: transform }`.
- **A cor das bordas na passagem 6 → 7** (queixa do owner: a ilha e o fundo já com a cor do estúdio antes de a luz acabar o percurso):
  com magenta viu-se que o lado ainda **não** iluminado é o Work (sticky, cortado) → a cor do html; o lado iluminado já é o estúdio.
  A cor mudava quando a luz passava o **meio** do topo (855 ms) e desvanecia 0,3 s. Agora, com o palco em fluxo (`inFlow`,
  method-stage.ts): muda só quando a luz cobre **os quatro cantos** das duas faixas (1527 ms), e no recuo antes de destapar o primeiro;
  sem desvanecer (`data-flow` → sequence.ts), porque essa cor só se vê sobre o Work. Gravado ida e volta, normal e magenta: o lado por
  iluminar fica o Work até a luz chegar; no recuo o canto destapado é logo o escuro do Work (antes ~0,3 s cinzento).
- Fases 7, 8a, 8b, 8c, 9, 10, 11 com html magenta: nenhum magenta na ilha nem em baixo; tudo visível.

**Owner no iPhone (7/11, depois):** a cor das bordas "parece perfeita". Dois problemas novos: (1) na entrada, ao passar o O, o vídeo
"dá um salto, ajusta para baixo do O"; (2) no Method, a fazer scroll para trás e para a frente, às vezes "um tremer que é um ajuste de
toda a cena".
- (1) No Simulador, A/B com a build de antes (`830d3de`, worktree no scratchpad, portas 3101/3131), fita `?autorec=14` (nova no
  `hud.js`: grava desde o load e envia; coluna 20 = o filme): a caixa do filme **não salta** em nenhuma das duas (centro fixo, escala
  contínua); as duas têm as mesmas pausas do fio principal — ~110 ms ao passar o O (3,2 s) e 180–280 ms quando o vídeo arranca. Não
  reproduzido; falta a gravação do iPhone.
- (2) Scroll por código, ida e volta por 7–11 e pela fronteira Work/7: o palco a −70 px em **todos** os 559 fotogramas presos e nas
  trocas preso ↔ a sair (fixed). Não reproduzido sem dedo: suspeitos — a barra do Safari a mudar (no lab4: 4 px uma vez) ou a inércia.
  O resize da cena ignora mudanças de altura < 120 px (a barra), por isso não é a cena a ser refeita.

**Gravação do owner (iPhone, 7/11 17:07, `out/…ScreenRecording_11-07-2026_17-07-06_1.mp4`, 60 fps):**
- Entrada: já sem salto; mas às vezes a câmara passa o O com o **poster parado** (a mulher quieta) em vez do vídeo a correr. A sequência
  só esperava a letra (≤ 1,5 s), não o vídeo. **Corrigido** (`sequence.ts`): espera o `playing` do vídeo até 2,5 s (abaixo da guarda
  de 3 s), sem esperar se o vídeo falha ou o `play()` é recusado (iOS em Poupança de energia). Por confirmar no iPhone.
- Method: perfil de luminância da zona do título fotograma a fotograma (43,5–63,5 s): **dezenas de saltos de 2 fotogramas** — o palco
  inteiro desce/sobe 6–16 px CSS e volta (ex. 57,57 s −50/+48 px físicos), a barra fixa parada. A animação de scroll que segura o
  palco fica 1–2 fotogramas atrás do dedo e recupera. No lab4 (sem trabalho, scroll lento) 0–1 px.
- **lab6** (`/__diag/lab6`): dois palcos seguros como o Method, A sem trabalho, B com 30 ms de trabalho no fio principal em cada scroll;
  linha verde fixa onde deve estar a vermelha do palco. Para separar "a técnica com dedo rápido" de "o trabalho do site".

**lab6 no iPhone do owner (7/11 17:18, `out/…lab6-ScreenRecording_11-07-2026_17-18-18_1.mp4`):** distância linha vermelha (palco) –
verde (fixa) por fotograma (coluna de 2 px; ignorar a pílula vermelha da gravação no topo). Mediana 0,2 px nos dois. Saltos de 1–2
fotogramas **também em A, a página sem trabalho**: ~10 em 15 s de scroll rápido, 5–20 px (ex. 15,70 s: 13 px num só fotograma, visto
no vídeo); B (30 ms por scroll) parecido. Os eventos de 80–336 px são o owner a sair do intervalo segurado (normais). **Conclusão: é a
técnica no Safari do iOS 27 com dedo rápido, não o trabalho do site** — aliviar o Method não resolve. Ir para o owner: voltar ao
sticky (estável, borda com cor) ou sticky + uma faixa em fluxo só por trás da ilha (o tremor fica confinado à faixa).

**Solução final (7/11, fim da sessão no Mac) — o palco preso, sem fluxo, sem faixa:**
- Protótipo B (faixa: cópia do fundo do palco segurada em fluxo por baixo do palco preso, só nas faixas) feito e alinhado ao píxel
  (195 posições, 0 diferenças), guardado em `attempt/method-band-1107.patch`. **Teste de controlo sem a faixa:** o palco **preso**
  já é desenhado pelo Safari por trás da ilha e por baixo da barra em todas as fases (7, 8a–c, 9, 10, 11; html magenta, nenhum magenta)
  e a orla de luz do 7 atravessa as faixas. **O que impedia era o `-webkit-box-reflect`**, não o sticky: as camadas próprias do palco
  (a luz, os cartões) são desenhadas nas faixas; o lab2 dava magenta porque nada lá tinha camada própria. A faixa e o palco em fluxo
  saíram do código, e com eles o `leap` (about-stage, work-client, address e `src/lib/leap.ts` repostos/retirados).
- Fica no código: o espelho (`.m-mirror`) no lugar do reflexo; a cor das bordas na **ida** quando a luz cobre os quatro cantos (iOS,
  `reaches`); no **regresso** o palco fica `fixed` enquanto a luz fecha e o Safari não desenha `fixed` atrás da ilha (faixa de cima toda
  magenta) → aí a cor muda quando a luz deixa a ilha, com o desvanecer, como antes de 7/11; a entrada espera o vídeo (`playing`, ≤ 2,5 s).
- Testes (Simulador, iOS 27.3): fases com magenta no 17 Pro (402 × 714 visível), 17 Pro Max (440 × 796) e 17e (390 × 699), dia e noite;
  passagem 6 → 7 ida e volta, normal e magenta, fotograma a fotograma; entrada 3× com `?autorec`: a câmara arranca no fotograma em que o
  vídeo começa a tocar, e ao chegar ao O (2 s depois) o vídeo está a opacidade 1. typecheck, lint, build: passam.
- **iPhone do owner (7/11, noite):** "parece resolvido" — sem tremer, a passagem 6 → 7 certa.
- **Xiaomi (ligado ao Mac, 7/11 18:50, Chrome 156, 392 × 779, `adb reverse` + CDP):** entrada 3× com `?autorec`: a câmara arranca no
  fotograma em que o vídeo toca, vídeo a opacidade 1 quando o zoom começa, 89–90 fps durante a câmara (fotogramas longos só no
  carregamento, com o título parado, e depois da entrada acabar). Method, gesto de toque por CDP (`Input.synthesizeScrollGesture`),
  A/B com a build de antes (`830d3de`), 3 idas e voltas cada: 6 → 7 83,5 / 86,8 / 86,8 fps antes, 83,4 / 86,4 / 87,2 agora; 7 → 6
  86,7–87,7 antes, 86,4–87,9 agora — **sem regressão**. Um fotograma de ~100–120 ms ao disparar o 7 (e ao voltar) já existia antes:
  candidato a melhorar. Fases 7, 8c, 11 vistas no ecrã: certas.
- **Desktop (Mac, 7/11 19:00):** Chrome 157 por CDP (perfil temporário, `Emulation.setDeviceMetricsOverride`, gestos de roda) a
  1920 × 1080 e 1440 × 900: entrada — câmara no fotograma em que o vídeo toca, vídeo visível no zoom, 120 fps, sem fotogramas longos;
  Method 6 → 7 e volta 116–120 fps (a 1920, a 1.ª entrada no 7 teve um fotograma de 592 ms — 1.ª descodificação das imagens grandes do
  estúdio; o código do desktop não mudou: espelho `display: none`, `reaches` falso); fases vistas certas; sem overflow; espelho
  desligado. Safari 27.2 (janela 1324 × 888, sem 1920: o ecrã é 1728 × 1117), `?autorec` + consola: entrada à espera do vídeo,
  59 fps (o Safari limita a 60), um fotograma de 105 ms ao passar o O — o mesmo de antes (A/B no Simulador); Method 59,4–59,8 fps,
  pior 44–56 ms, sem overflow. Sem captura do Safari (o terminal não tem permissão de gravar o ecrã).
- **A melhorar (já existia antes de 7/11):** ~100–120 ms ao disparar o 7 no Xiaomi; ~105–110 ms ao passar o O (Safari, Simulador).

**Por verificar:** gestos de dedo (barra do Safari a recolher, inércia) — o `idb-companion` pede `xcode-select` no Xcode ≥ 26 (sudo);
custo das 2 camadas e do palco em fluxo no **Xiaomi** (está ligado ao PC, não ao Mac); o iPhone real do owner.

## 6. Próximos passos (por ordem)

1. Montar o Simulador e confirmar que reproduz (a) e (b) acima.
2. Correr o interruptor **`flowlayers`**: os cartões e as palavras ficam visíveis quando param? Se sim, encontrar o conjunto mínimo de
   camadas (memória de vídeo; medir também no Xiaomi). Se não, investigar no *Layers* do Web Inspector o que não é pintado.
3. Substituir o `-webkit-box-reflect` por uma forma de a sala cobrir os 70 px de cima sem mudar o corte (ex. a sala desenhada numa caixa
   70 px mais alta com o `background-position` acertado para o ecrã ficar igual) — sem cor inventada.
4. Aplicar o patch (`git apply docs/development/ios-lab/attempt/method-in-flow-1107.patch`, depois `leap.ts` em `src/lib/`) com as
   correções 2 e 3, testar no Simulador, depois **Xiaomi** (posição, saltos, fps a subir depressa) e **iPhone do owner**.
5. Só depois: o mesmo no **About** (`about.css` bloco iOS, `--a-lift`) e no **Work** (a sua subida), e por fim tirar as cores lidas do
   iPhone (`1cb418c`: `src/lib/top-colour.ts`, `data-edge` em `method-stage.ts`/`about-stage.ts`, `sequence.ts`) — no Android ficam,
   acertadas ao que está desenhado.
6. Registar os testes em `docs/development/v5-tests.md` antes de qualquer commit (regra do CLAUDE.md). Nada de commit/push sem o owner
   pedir.

Regras de sempre: uma coisa de cada vez; testar cada passo antes de mostrar; gravar frame a frame o instante que o owner aponta;
não reabrir decisões fechadas (README); dizer o custo de performance de cada escolha.

## 5. Gravador de sessões no desktop (14 Nov) — a ronda de testes do owner no Chrome e no Safari

- `node docs/development/ios-lab/proxy.mjs 3140 3100 rec` — a build de produção (3100) com `rec.js` em vez do HUD. O owner abre
  `http://localhost:3140/`, carrega em **● gravar** (canto inferior esquerdo) e usa o site à sua maneira; **⚑ bug** (ou ⌥B) marca o
  momento e abre uma caixa para uma nota curta (Enter). Continua a gravar depois de recarregar; **■ parar** fecha a gravação.
- Vai para `out/<início>-rec.jsonl` a cada 5 s: roda/trackpad, teclas, cliques (em quê), toques, foco, resize, `scrollY` a cada
  fotograma em que muda, o estado do site sempre que muda (secção, `pass`, capítulo do Work, fases do Method e do About, Questions,
  Contact, menu, `data-jump`, encaixe, `overflow`, a palavra da barra, a cor da página e `theme-color`, `data-edge`), todos os atributos
  do `<html>`, fotogramas > 50 ms, erros, rejeições, `console.error/warn`.
- Ler: `node docs/development/ios-lab/rec-read.mjs out/<id>-rec.jsonl [--all]` — linha do tempo com segundos e hora do relógio (para
  alinhar com uma gravação do ecrã do Mac, Cmd+Shift+5), gestos agrupados, marcas e notas, e um resumo no fim.
