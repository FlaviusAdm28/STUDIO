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
