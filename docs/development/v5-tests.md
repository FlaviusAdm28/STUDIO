# Chapter One V5 — registo de testes

Cada módulo fica aqui com **o que foi testado, como, os números e o que ficou por verificar** (owner, 29/10:
"quero que comeces a documentar os testes feitos"). Um módulo só é commitado com a sua secção escrita.
Os critérios são os do `docs/design/v5/acceptance.md`; aqui fica o que foi medido de facto.

## Como se testa

**Antes de qualquer teste:** `npm run typecheck`, `npm run lint` (sem avisos), `npm run build`, depois
`npx next start -p 3100`. Nunca `next dev` para medir nem para testar sem JavaScript.

**Ferramentas** (fora do repositório, em `D:\STUDIO-tools\v5-m3\`; Node 20, os scripts do telemóvel precisam de
`node --experimental-websocket`):

| Script | Onde | O que faz |
|---|---|---|
| `pc.mjs <pasta>` | PC, Chrome visível | 7 tamanhos de ecrã (1920×1080, 1440×900, 768×1024, 390×844, 320×640 e 1440×900 com zoom do browser a 150 % e 200 %): capturas ao longo da sequência, frames, overflow, geometria, erros da consola; depois reduced motion, sem JavaScript (1440, 390, 320), saltar com uma tecla, ordem do teclado, *Welcome back*, endereço com `#`, refresh a meio da página |
| `frames.mjs <pasta> <w> <h>` | PC, Chrome visível | capturas da entrada em 8 momentos (0,45 s a 5,5 s) |
| `final.mjs <pasta>` | PC, Chrome visível | o estado final a 1440, 1920, 390 e 768, com o tamanho do título e das lâminas |
| `contrast.mjs` | PC, sem janela (só números) | contraste das palavras sobre o poster, às quatro horas, a 1440, 390 e 768 — pior caso: os 5 % de píxeis mais claros atrás de cada palavra |
| `phone.mjs [corridas] [query] [css]` | Xiaomi | a entrada carregada de novo N vezes: fps, p95 e frames lentos por fase (letras, zoom, final, depois); `sum.mjs <ficheiro>` resume |
| `hold.mjs`, `holdev.mjs` | Xiaomi | segurar uma lâmina 2,5 s: transformação da fotografia, eventos, URL depois de largar |
| `net.mjs <perfil> <corridas>` | Xiaomi | rede limitada (4G lenta: 1,6 Mbit/s, 150 ms; sem cache): quando chegam o poster, o vídeo e as fotografias das lâminas |
| `shot.mjs <ficheiro>` | Xiaomi | captura do estado final |

**Xiaomi Mi 11 Lite** (serial `c3e8fb35`, Chrome, ecrã 90 Hz): `adb reverse tcp:3100 tcp:3100` e
`adb forward tcp:9555 localabstract:chrome_devtools_remote`; no Git Bash `MSYS_NO_PATHCONV=1`. Os 90,5 fps são o
máximo do ecrã. **Ver com os olhos:** cada mudança visual é vista numa janela de Chrome no PC e em capturas do Xiaomi;
o modo sem janela só serve para números.

---

## M3 — a entrada (29/10)

Quatro rondas de revisão do owner no mesmo dia (README #76–#79). Números da **última versão** salvo indicação.

### Build
typecheck, lint (0 avisos) e build: **passam**. Formatação Prettier nas opções do repositório
(`--no-semi --single-quote --print-width 120 --trailing-comma all`): passa.

### PC (`pc.mjs`, ronda 11)
**16 verificações, 0 problemas, 0 erros na consola:**
- **Ecrãs:** os 7 tamanhos, sem scroll horizontal.
- **Sem JavaScript:** a 1440, 390 e 320 o estado final lê-se completo (poster, título, subtítulo, lâminas como links).
- **Reduced motion:** estado final de imediato, sem vídeo.
- **Saltar com uma tecla:** a entrada vai para o fim.
- **Teclado:** ordem *Skip to content › Talk to us › Menu › I Weddings › II Artists › III Experiences* (os leitores de ecrã leem "II Artists", já não "IIArtists").
- **Welcome back:** depois de mais de 30 min fora.
- **`#capítulo` no endereço:** vai direto ao capítulo, sem entrada.
- **Refresh:** a meio da página fica no lugar; no topo a entrada repete.

**Tamanhos medidos (`final.mjs`):**

| Ecrã | Título | Lâmina |
|---|---|---|
| 1440×900 | 93 px | 257×182 |
| 1920×970 | 100 px | 343×243 |
| 390×844 | 51 px | 315×93 |
| 768×1024 | 59 px | 633×113 |

**Sequência (`frames.mjs`, 1440 e 390):** E1 só a dedicatória; E2 o vídeo dentro das letras; o O nítido durante todo
o zoom; a tinta escurece durante o zoom, sem salto visível no fim.

### Xiaomi — fluidez (`phone.mjs`, 3 corridas cada)

| Ronda | Letras | Zoom | Final | Depois |
|---|---|---|---|---|
| 6 (camada do O) | 90,5 fps | 88 fps, 1 frame > 25 ms por corrida | 90,5 | 90,5 |
| 8 (tinta no zoom) | 90,4 | 86,3, 1 frame > 25 ms por corrida | 89,9 | 90,5 |
| 8 sem a tinta (controlo) | 90,5 | 85,5, 2 frames > 25 ms, 0 > 50 ms | 90,5 | 90,5 |
| 10 (letra 700, contorno) | 90,5 | 86,3, 1 frame > 50 ms por corrida | 90,5 | 90,5 |
| 11 (final) | 90,5 | 85,5, 1 frame > 50 ms por corrida | 90,5 | 90,5 |

p95 11,2 ms em todas as fases. **O frame lento é no arranque do zoom**, quando o movimento ainda é quase nulo. Existe
desde a ronda 6 e não vem da tinta: com a tinta desligada (controlo) o zoom fica igual. Também não melhora com a tinta
na sua própria camada (`will-change`) nem com a tinta atrasada 0,35 s (testado na ronda 8). Aceite.

### Xiaomi — segurar uma lâmina (`holdev.mjs`, `hold.mjs`)
- Pousar o dedo 2,5 s: a fotografia vai a escala 1,404 (= 1,3 × 1,08) e fica lá enquanto o dedo está pousado.
- O menu do Android não aparece (`contextmenu` às ~1,17 s, bloqueado).
- Ao largar não abre o capítulo (o URL fica igual) e a fotografia volta a 1,3.
- **Encontrado e corrigido:** o toque simulado pelo CDP chega com `pointerType` vazio; o código aceita agora tudo o que não seja rato.

### Xiaomi — rede lenta (`net.mjs`, 4G lenta, sem cache, 3 corridas)

| Fotografias das lâminas | Chegam | Poster | Vídeo descarregado |
|---|---|---|---|
| `lazy` (como está) | 1,2–2,1 s | ~0,85 s | ~8,1 s |
| forçadas a carregar logo | 1,2–2,2 s | ~0,84 s | ~8,1 s |

Sem diferença, por isso fica `lazy`. As lâminas aparecem aos ~3,4 s, depois de as fotografias chegarem.

### Contraste (`contrast.mjs`, final, pior caso, tinta do storyboard + contorno)

| Ecrã | Título dia / noite | Subtítulo dia / noite | Dedicatória dia | Lâminas |
|---|---|---|---|---|
| 1440×900 | 3,00 / 3,87 | 3,11 / 3,84 | 3,57 | 6,50 |
| 390×844 | 2,81 / 3,71 | 2,39 / 3,03 | 3,72 | 4,13 |
| 768×1024 | 2,38 / 3,21 | 2,43 / 3,11 | 3,00 | 4,05 |

Abaixo do alvo de dia (3 : 1 letra grande, 4,5 : 1 o subtítulo), por causa do sol atrás do título. **Aceite pelo owner**
(#32) depois de ver; sem véu, por decisão do owner. Antes: título ~2,0 (tinta do dia a 0,16, sem contorno).

### Não verificado
- **iPhone / Safari:** não se testa a partir daqui; fica com o owner.
- **Mi Browser e Firefox no Xiaomi.**
- **Rede real 4G:** só simulada.
- **O telemóvel quente.**
- **O momento exato em que o vídeo começa a tocar na rede lenta:** o registo da sequência falhou nessas corridas; só se mediu o fim da descarga.

---

## M4 — a barra e o menu (29/10, em revisão do owner)

Construído com os valores do storyboard e da página aprovada (`v5-handoff.md`, plano do M4). Ferramentas novas em
`D:\STUDIO-tools\v5-m4\`: `bar.mjs` (capturas e estado da barra e do menu, 390/1440/320), `a11y.mjs` (teclado e
movimento reduzido), `phone-bar.mjs [corridas] [css]` (Xiaomi: scroll da página inteira com um gesto real + menu a abrir e
fechar 3 vezes).

### Build
typecheck, lint (0 avisos), build: **passam**.

### PC
- **Bateria do M3 (`pc.mjs`) com a barra nova:** 16 verificações, 0 problemas, 0 erros. A ordem do teclado no topo
  continua *Skip to content › Talk to us › Menu › I Weddings › II Artists › III Experiences*: a ilha do nome está escondida
  e fora do Tab no topo (#70).
- **`bar.mjs`:** sem erros na consola.
  - O nome aparece com o Work (*Chapter One | 01 Work*).
  - Ilhas a 390: 44 px a 10 px do topo, nas margens de 24 px; a 320, margens de 16 px; a 1440, 48 px a 14 px.
  - Lente ativa (Chromium).
  - O menu abre, marca a secção atual, fecha com Esc e devolve o foco ao botão.
- **`a11y.mjs`, com movimento normal e com movimento reduzido:**
  - Enter abre o menu e o foco vai para *01 Work*.
  - O Tab dá a volta dentro do menu: as cinco secções, os contactos, *Talk to us*, *Close menu* e outra vez *01 Work*. **Encontrado e corrigido:** antes o Tab saía do menu depois de *Telegram*.
  - O resto da página fica `inert` com o menu aberto.
  - Esc fecha e devolve o foco.
  - Escolher *04 Questions* fecha o menu e vai para `#questions`.
  - Com movimento reduzido, a gota só desvanece.
- **Encontrado e corrigido:** o "01" da barra lia-se "OI", porque os algarismos do Cormorant são de estilo antigo; agora usa `lining-nums`.

### Xiaomi (`phone-bar.mjs`)

| Teste | Scroll da página inteira | Menu (3 aberturas por corrida) |
|---|---|---|
| Com a barra (3 corridas) | 82,7–84,2 fps, 12–14 frames > 25 ms | 1.ª abertura 78,5–87,6 fps (1–4 frames > 50 ms); as outras 88,9–89,5 fps, 1 frame > 25 ms |
| **Sem a barra** (controlo, 2 corridas) | 82,9–83,6 fps, 13 frames > 25 ms | — |
| Barra sem lente (2 corridas) | 83,6–84,1 fps, 13–14 frames > 25 ms | — |

**A barra e a lente não custam nada mensurável:** os frames lentos do scroll são iguais sem a barra. Vêm da página
provisória do M2, com fotografias grandes a carregar e a descodificar durante um scroll rápido; ficam para medir com as
secções reais (M5–M7). A primeira abertura do menu tem um soluço, como no protótipo (#69).

**Ecrã real** (`adb screencap`; o `Page.captureScreenshot` não mostra o `backdrop-filter`): as ilhas e o menu de vidro
estão como no storyboard.

### Não verificado
- **iPhone / Safari:** lá o vidro fica sem lente; a declaração simples vem primeiro.
- **O escuro das ilhas sobre secções claras (papel):** as secções reais ainda não existem (M5–M7); hoje mede-se sobre o vídeo da entrada (pelo poster, com a tinta) e sobre o carvão.
- ***Hello, {name}.*:** só existe quando o Method (M6) guardar um nome.
- **O fling com o dedo; Mi Browser e Firefox.**

### Revisão do owner (29/10, tarde)
- **Abertura do menu no desktop (`settle.mjs`, gravado frame a frame com o vídeo parado):**
  - Gota maior que o ecrã: o vidro mudava até 18 níveis de cinzento por frame já depois de cobrir o ecrã, e as palavras davam um salto a 1,08 s.
  - Com `will-change` e o raio exato até ao canto mais longe: 0 mudanças depois de assentar, e as palavras já não saltam.
  - Revelação por `clip-path`, testada e posta de lado: o fundo ficava quieto, mas a abertura ia aos saltos (o desfoque é redesenhado a cada frame).
- **Fluidez da abertura no desktop (`openfps.mjs`, ecrã 144 Hz, 5 aberturas):** 144 fps, p95 7,1 ms. A 1.ª abertura tem 2 frames lentos (≤ 55 ms).
- **A luz do sol (`light.mjs`, relógio do navegador fixado, fuso de Lisboa):**

  | Hora | Luz |
  |---|---|
  | 29/10 06:40 | manhã |
  | 10:30 | dia |
  | 16:00 | dia |
  | 16:20 | fim de tarde |
  | 18:15 | fim de tarde |
  | 18:30 | noite |
  | 21/6 21:00 (hora local) | fim de tarde |
  | 21/6 22:30 (hora local) | noite |

  As contas batem com as horas conhecidas de Lisboa: 21/6 06:12–21:05, 21/12 07:51–17:18.
- **Bateria do PC (`pc.mjs`):** sem problemas.

---

## M5 — o Work (29/10, primeira versão, em revisão do owner)

Ferramentas em `D:\STUDIO-tools\v5-m5\`: `work.mjs` (capturas de cada capítulo, fotografia e peça, 1440 e 390),
`rot.mjs` (rotação, momento fixado, navegação pelo título, sem JavaScript, 320×640), `phone-work.mjs [corridas] [css]
[só-scroll]` (Xiaomi: scroll pelos três capítulos com um gesto real + 8 s parado em cada um).

### Build
typecheck, lint (0 avisos), build: **passam**.

### PC
- **Os três capítulos:** palco preso; fotografias em camadas com a aura; moldura por capítulo (arco, retângulo, oblíquo);
  a palavra do momento enche no tom do capítulo; a peça mostrada em primeiro, com o círculo e *on the photograph*.
- **No telemóvel:** uma linha de cada vez; o título com os outros capítulos à direita.
- **Sem scroll horizontal, sem erros na consola.**
- **Rotação (`rot.mjs`, uma leitura por segundo):** `0p 0d 0d 1p 1p 1d 1d 2p 2p 2d 2d 0p…`, ou seja 4 s por momento, ~1,2 s
  só a fotografia e depois a peça.
  - Tocar num momento fixa-o (`aria-pressed`).
  - O título leva ao capítulo (`#experiences`, `data-ch` 2).
- **Encontrado e corrigido:**
  - Com o rato em qualquer sítio do palco a rotação parava. O palco ocupa o ecrã inteiro, por isso agora só pára sobre a fotografia ou as palavras.
  - O crédito *Photographs — Helder Couto* aparecia em Artists e Experiences, que são imagens de IA. Agora fica só em Weddings.
- **Sem JavaScript (390):** os 3 capítulos com as 25 linhas visíveis, sem scroll horizontal.
- **320×640:** o texto acaba a 617 px de 640; cabe.

### Xiaomi (`phone-work.mjs`)

| Teste | Resultado |
|---|---|
| **Parado em cada capítulo, momentos a rodar com as peças** (3 corridas × 3 capítulos) | **90,2–90,5 fps, p95 11,2 ms, 0 frames > 25 ms** |
| Scroll pelos três capítulos (3 corridas) | 71,4–72,6 fps, p95 33 ms, 10 frames > 25 ms |
| Controlo: o mesmo scroll **com o palco escondido** | 71,1–71,6 fps, 9–10 frames > 25 ms (igual) |
| Sem aura / sem transições / sem fotografias / sem barra / sem vídeo (uma coisa de cada vez) | 73–79 fps, 5–8 frames > 25 ms |
| Tudo isso desligado de uma vez | 74–77 fps |

**O Work não é o que custa no scroll:** com o palco escondido, os números são os mesmos. O que sobra é o próprio gesto
de scroll simulado e o resto da página provisória. Volta a medir-se com as secções reais e um scroll feito à mão.

### Não verificado / por fazer
- **A passagem estado 2** (o vídeo da entrada torna-se o palco): ainda não construída.
- **A passagem de capítulo (FLIP do título):** construída; falta o owner vê-la.
- **iPhone; o fling com o dedo; *Hello, {name}* nas demonstrações:** este último só depois do Method.

### Revisão do owner (29/10, noite) — "vejo muitos bugs"
1. **A passagem estado 2 não existia** (era só scroll). **Construída:** a entrada fica presa; um ecrã de scroll encolhe o
   vídeo até ao arco de Weddings (escala que cobre o arco, recorte em arco, as palavras da entrada saem e o texto do Work
   entra ao lado); 0,4 de ecrã dissolve-o na primeira fotografia, que está por baixo no mesmo sítio; o vídeo pára no fim e
   volta a tocar ao subir. Visto frame a frame no PC (1440 e 390, `pass.mjs`).
   - **Encontrado e corrigido:** o vídeo não preenchia o arco, porque a medida incluía a barra de scroll do desktop.
   - **Xiaomi (`phone-pass.mjs`, gesto real de 1,6 ecrãs, a descer e a subir):**

     | Versão | fps | Frames > 25 ms |
     |---|---|---|
     | Primeira | 57–64, p95 33 ms | 6–7 |
     | Com a geometria guardada (sem layout forçado por frame) | 58–65 | 3–8 |
     | **Controlo:** o mesmo gesto numa zona simples da página | 75–84 | 0–2 |

     Tirar o recorte, o vídeo, a barra ou o palco, um de cada vez, não muda o resultado.
   - **Por resolver:** passar a passagem para animações ligadas ao scroll em CSS (corre no compositor) e medir outra vez.
2. **"O rato sobre as imagens não faz nada":** o rato sobre a fotografia pára o momento (a palavra e a peça param).
   **Corrigido:** ao sair, o momento recomeçava do início; agora continua de onde parou (`hover.mjs`). Nenhum efeito
   visível além da pausa — perguntado ao owner.
3. **A palavra no telemóvel enchia e ficava cheia:** um toque deixava o foco no palco, e isso pausava-o para sempre.
   **Corrigido:** só o foco do teclado pausa. Visto com toque emulado: enche em 4 s e passa ao momento seguinte.
4. **A ordem dos capítulos no telemóvel:** agora segue o storyboard e a #62 — o outro capítulo pequeno em cima e não
   tocável, o seguinte em baixo, maior e o único tocável.
5. **Texto e fotografias fora do tamanho do ecrã:**
   - Todas as medidas do Work passam por uma unidade, `min(1vw, 1,6svh)` no desktop e `min(1vw, 0,462svh)` no telemóvel,
     que mantém as proporções dos quadros do storyboard em ecrãs mais baixos (Xiaomi) ou mais largos (tablet, 1920).
   - Os outros capítulos no título em itálico e *on the photograph* em minúsculas, como no storyboard.
   - Comparado lado a lado com o storyboard a 1440 e a 390 (`sbshot2.mjs`).

### Segunda revisão do owner (29/10, noite)
1. **Telemóvel, do III de volta ao I:** o scroll suave atravessava o II e cada passo começava a sua própria passagem.
   **Corrigido:** uma só passagem, direta (`phonenav.mjs`: os capítulos vistos depois de tocar em *I* no III: `0` — só
   um).
2. **O rato sobre o texto parava a palavra:** já não para; só a fotografia.
3. ***Before* → *Our day*:** as peças dos outros momentos ficavam "a funcionar" escondidas, por isso o site aparecia já
   subido por cima de uma fotografia ainda a vir para a frente. **Corrigido:** cada peça só anda no seu momento, e um
   momento escolhido mostra primeiro a fotografia e depois a peça (`ourday.mjs`, 6 capturas: a fotografia vem para a
   frente, depois a página sobe com as secções).
4. **O rato sobre a fotografia (EXPERIÊNCIA, para o owner decidir):** o tempo espera, a peça recua para se ver a
   fotografia inteira, e a fotografia desliza devagar como as lâminas da entrada; no telemóvel, ao segurar.
- **Também corrigido:** chegar com o endereço de um capítulo (`/#weddings`) já não aterrava, porque a entrada limpava o
  endereço antes de o Work o ler. Agora é guardado à chegada (aterra a `y` 1261 com `data-ch` 0).

### Terceira revisão do owner (29/10, noite)
- **"A imagem está partida no *Our day*" (desktop):** uma regra da página provisória do M2
  (`main section:not(.entrance) picture { max-width: 420px; margin-block: 16px }`) apanhava as fotografias do Work. A 1920
  ficavam com 420 px num arco de 538 e desencontradas. **Corrigido:** a regra já não se aplica ao `.work`
  (`pimg.mjs`: 538 × 718 = o arco; captura a 1920 inteira).
- **O rato sobre a fotografia:** a fotografia desliza e o tempo espera; a peça já não recua (owner).
- **A passagem para o palco:** o owner viu-a no Xiaomi e não sente lag; aceita-a como está, apesar dos ~60 fps medidos
  com o gesto simulado.

### Quarta revisão do owner (29/10, noite)
- **Mudar de momento depressa punha todas as peças a mexer:** as peças que saíam voltavam atrás animadas. **Corrigido:**
  só a peça mostrada anima, e as outras voltam ao início de imediato (`quick.mjs`, seis cliques com 250 ms de intervalo:
  as peças fora de vista têm 0 animações a correr; só a escolhida anima).
- **Galeria de *On the day*:** 6 fotografias (2 filas) também no desktop.
- **O cartão *Our day*:** quatro caminhos postos lado a lado para o owner decidir: https://claude.ai/artifact/HsZbtjMsaDstNzhDAHBP9V
  (fonte `scratchpad/ourday/index.html`; a guardar em `media-src/storyboards/` quando decidido).

### Quinta revisão do owner (29/10, noite)
- **Os momentos, revistos como componente** (`moments.mjs`, cenários seguidos no PC).
  - **Regra nova (owner):** tocar noutro momento muda logo para ele, que passa a ser o que conta, e a rotação segue a
    partir dele; tocar no momento atual pausa-o (a palavra pára onde ia) e outra vez retoma. Esta é a forma de parar
    (WCAG 2.2.2). Os momentos já passados ficam apagados (#61).
  - **Encontrado e corrigido:** a palavra do momento anterior ficava com a animação de encher ligada.
  - **Os cenários:**
    - aterrar e rodar: 4 s por momento;
    - tocar noutro momento muda logo;
    - tocar no atual pausa; outra vez, retoma;
    - cliques rápidos: fica a contar só o último, com 0 animações nas peças fora de vista;
    - o rato sobre a fotografia pausa e retoma;
    - mudar de capítulo recomeça no primeiro momento;
    - nunca há mais de uma palavra a encher.
- **O cartão *Our day*, opção B (vidro):**
  - **Construção:** um painel do vidro do site, com a data, o dia hora a hora e *Reply by RSVP*; as horas e as frases são
    exemplos (DRAFT em `content/v5.ts`).
  - **Encontrado e corrigido:** o painel tapava o casal, que anda no fundo da fotografia. Agora a fotografia aproxima-se
    e sobe (−27 %, escala 1,05 em 3 s) e o casal fica à vista por cima do vidro.
  - **No telemóvel:** o painel fica só com a data, o dia e o RSVP (`glass.mjs`, 1440 e 390).

### Sexta revisão do owner (29/10, noite) — as peças novas e o cartão
- **O cartão do *Wedding website*:** o desenho da B (centrado, a resposta preenchida) no escuro do estúdio, com a fotografia
  a fundir-se no cartão (gradiente) e um filete no tom de Weddings onde se encontram. O interruptor temporário
  `?cartao=b` saiu do código.
- **As oito peças da página de opções aplicadas** (palavras em `content/v5.ts` como DRAFT, para o owner aprovar).
  Cada peça entra pela ordem de leitura (`dm-e1…e6`) depois da fotografia e volta ao início de imediato ao sair. A galeria
  conta 1 → 6 ao ritmo das fotografias que chegam; o convite troca *Accept* por *See you there ✓* aos 1,9 s.
- **`nine.mjs`** (cada peça segurada, 1440 e 390): as nove visíveis e completas, sem erros.
  - **Encontrado e corrigido:** na reescrita, a regra que mostra a peça ficou mais fraca do que a que a esconde, por isso
    nenhuma aparecia.
  - **Encontrado e corrigido:** pausar um momento durante a fotografia deixava-o sem peça; agora pausar mostra sempre a
    peça.
  - **Encontrado e corrigido:** ao retomar, o momento continuava marcado como pausado durante ~3 s.
  - **Encontrado e corrigido:** o endereço de um capítulo mudado sem recarregar (recuar/avançar) não aterrava; agora
    ouve `hashchange` e `popstate`.
  - **No telemóvel:** a galeria mais estreita, o portfolio com 3 obras numa fila, o arquivo com 3 linhas.
- **`moments.mjs`:** todos os cenários certos. **`pc.mjs`:** sem problemas nem erros.

### Sétima revisão do owner (29/10, noite)
- **Os momentos mais lentos:** 6 s (fotografia 1,2 + peça 4,8; era 4). Em `content/tuning.ts`.
- **Portfolio:** três obras diferentes numa fila; já não há cortes nem repetidas.
- **Exposição:** a entrada na sala passa de 3,4 s a 1,8 s; a etiqueta de parede e o convite de Experiences passam a vidro
  (o do site).
- **O fim de uma peça:** desvanece em 0,4 s e só depois volta ao início, sem se ver. Era provavelmente o "quadrado preto"
  do fim do *On-site guide*, que não se reproduziu no desktop (`during.mjs`, 8 frames).
- **`nine.mjs`** de novo (1440 e 390): sem erros.
- **Weddings *Before*:** três ideias novas para o owner escolher, https://claude.ai/artifact/HsZbtjMsaDstNzhDAHBP9V
  (versão 4).

### Oitava revisão do owner (29/10, noite)
- **O "quadrado preto" no fim do *On-site guide*:** reproduzido e gravado frame a frame (`during2.mjs`). A peça escura
  ainda desvanecia quando a fotografia seguinte entrava de lado, e o véu ficava à vista como um retângulo. **Corrigido:**
  no fim de um momento a peça sai primeiro (0,45 s) e só depois as fotografias trocam (`during3.mjs`: a peça desvanece,
  a fotografia limpa fica e a seguinte entra, sem retângulo).
- **Weddings *Before* = a contagem** (owner):
  - quanto falta para um dia 42 dias depois da visita, às 16:00, a contar enquanto se olha;
  - a data desse dia e *Reply by RSVP* em vidro;
  - um véu no céu e uma sombra suave em todas as palavras para se lerem.
  `nine.mjs`: 1440 e 390 sem erros.

### Nona revisão do owner (29/10, noite)
- **O "quadrado preto" (segunda causa):** a fotografia que vinha para a frente deslizava a partir da posição de trás e
  deixava um canto da que saía a descoberto; com o concerto de Experiences, um bloco preto. **Corrigido:** a que chega
  toma logo o lugar da frente e aparece por opacidade (0,7 s); a que sai desvanece em 0,3 s enquanto recua; as de trás
  arrumam-se com movimento (`during5.mjs`, frames da troca: sem bloco escuro).
- **A galeria de *On the day*:** seis fotografias novas do fotógrafo, nenhuma das três do capítulo. Copiadas da V4
  (`D:\STUDIO\public\media\new`, HelderCoutoPhoto_046, 067, 126, 156, 179, 337) para `media-src/weddings/`, com o SHA-1
  verificado (iguais), sem tocar na V4. Derivados `weddings-guests-1…6` a 320 e 640 px (`npm run images`).
- **Weddings *Before*:** continua em aberto (owner).

### Décima revisão do owner (30/10)
- **O "quadrado" atrás da fotografia em Experiences (terceira causa):** gravadas as três trocas a correr sozinhas, a
  1920×1080 (`exp6.mjs`, ~90 frames/s; folhas com `sheet.mjs` e `zoom.mjs`). Na troca, a fotografia que chega começava
  translúcida, a que saía recuava por trás dela e as de trás mudavam de lugar: a metade escura do concerto via-se como um
  bloco. **Corrigido sem deslizar nada:** as camadas de trás desvanecem com a peça (`data-swap="out"`), a nova fotografia
  aparece sobre a antiga ainda inteira (`cross`, `.w-leaving`, 0,7 s), e as camadas voltam já no lugar, por opacidade
  (`settle`). Gravado de novo: 1920 (`exp7`) e 390×844 (`exp8`), sem bloco. Weddings e Artists usam o mesmo código; não
  foram gravados.
- **O teclado não mudava de momento:** o foco pausa o palco e `run` não fazia nada. Encontrado ao ler o código, corrigido
  e testado (`cd30.mjs`, Enter em *After*: m 2, peça visível).
- **Weddings *Before*:** a contagem vai para o próximo 25 de agosto às 16:00; lê-se de novo a cada contagem. `cd30.mjs`,
  relógio fixo: 30/10/2026 → 299 dias; 25/08/2027 15:59:30 → 00 00 01; 16:00:00 → 366 dias, sexta 25 agosto (2028);
  31/12/2027 e 29/02/2028 certos. Três dígitos cabem (`before30.mjs`): 1920, 768, 390 e 320, sem overflow; a 320 sobram
  23 px de cada lado.
- **Decisão (o owner deixou comigo):** sem contagem acelerada até ao dia. Em 4,8 s seriam ~300 dias a girar, ilegíveis e
  contra a calma do site, e o momento seguinte, *On the day*, já é a chegada.
- **`m30.mjs`:** outro momento nunca pausa por engano; pausar, rato e mudar de capítulo durante `out` não deixam estado
  preso. **`moments.mjs`:** S2 acusou pausa por corrida do próprio script (o clique calhou com a rotação já em 1), sem
  relação com o código. **`nine.mjs`:** sem erros. typecheck, lint e build passam.
- **Caso antigo, não alterado:** o rato a entrar na fotografia nos 0,45 s em que a peça sai deixa a fotografia sem peça
  até o rato sair.
- **Não verificado:** Xiaomi (ecrã bloqueado, `phone-work.mjs` não ligou); iPhone.

### Décima primeira revisão do owner (30/10): o quadrado era outra coisa
- **O que o owner via:** em *During*, no fim da animação do cartão, e não na troca de fotografias. As três correções
  anteriores trataram da troca e continuavam certas, mas não eram isto; o quadrado ficou dado como corrigido sem se ter
  visto a peça inteira.
- **Causa (`dur6.mjs` + `diff.mjs` + `amp.mjs`):** gravada a peça inteira e comparado cada frame com o anterior. Salto
  a +1,94 s da peça: quando a última parte (`dm-e4`, 1,1 + 0,8 s) acaba, o Chrome volta a compor e o véu `dm-night` pinta
  fora do corte oblíquo. Luz junto ao corte: 31,9 → 21,2 (`wedge.mjs`).
- **Só se vê na gravação do compositor:** `page.screenshot` redesenha e dá sempre 31,9. Não usar screenshots para isto.
- **Variantes medidas:** sem `transform` nas partes, não resolve; `will-change: opacity` na peça, resolve, com uma camada
  a mais; `clip-path` no próprio véu, resolve e sem camada. **Escolhido o `clip-path`** (`work.css`).
- **Depois da correção:** luz estável a 1920 (31,9) e a 1440 (32,0). Sem salto em 1920 e 1440; a 390 resta o texto do
  horário a acertar a nitidez, sem cunha (`d7c-amp.jpg`).
- **`sweep.mjs` (1920):** sem saltos fora do esperado em 7 peças; os movimentos listados são os desenhados (galeria,
  tira de fotografias). *Before* de Experiences medido só com `wedge.mjs`; *Always* de Artists não coberto.
- **Xiaomi, versão final (`phone-dur.mjs`, `phone-work.mjs`, `phone-pass.mjs`):** *During* gravado no telefone (305 frames):
  luz junto ao corte estável em 38,5 de +1,65 s a +5,95 s, sem salto. Momentos a rodar: 90 fps, p95 11,2 ms, 0 frames
  > 25 ms (2 corridas). Scroll pelo Work: 66 fps, p95 33 ms, 9–10 frames > 25 ms e 3–4 > 50 ms. Passagem (3 corridas): a
  descer 61–63 fps, a subir 56–59 fps, 1–4 frames > 50 ms; números de um gesto simulado.
- **Não verificado:** iPhone.

### Décima segunda revisão do owner (30/10): qualidade das fotografias e *Before*
- **Causa da má qualidade:** os originais têm 3453×5172; a AVIF a 50 tirava-lhes o grão (`q30.mjs`, crop lado a lado).
  **Corrigido:** as fotografias do fotógrafo (`fine`) passam a AVIF 78 e JPEG 88, com larguras 640, 960, 1280 e 1600 (era
  1440). Conteúdo e originais intactos.
- **Peso:** `weddings-before` 640 AVIF 16 → 39 KB, 960 31 → 87 KB; `weddings-day` 960 69 → 285 KB; 1600 até 955 KB. Com
  muito grão a AVIF sai maior do que a JPEG, e o browser fica com a AVIF. O grão pesa; a medir com cuidado no 4G.
- **Weddings *Before*:** as palavras sobem (`top` 24 → 15 %) e o véu mantém-se escuro até ao fim da data. Contraste do
  linho no pedaço mais claro atrás de cada linha (`before31.mjs`): data 2,95 → 4,85 a 1920, 2,72 → 4,71 a 390, 2,04 → 4,57
  a 320. **Custo:** o céu fica cinzento escuro.
- **Véu aligeirado a pedido do owner (30/10, 0,5 / 0,45):** a data desce para 3,11 a 1920, 2,99 a 390 e 2,87 a 320; o
  contraste é medido sem a sombra das palavras. Escolha do owner, à espera da sua vista.
- **Não verificado:** peso e fluidez no Xiaomi depois das novas fotografias; iPhone.

### Décima terceira revisão do owner (30/10): fotografias do Unsplash
- **Aplicadas por escolha do owner:** *For a moment*, Experiences *Before*, *During* e *After*. *On record* e *Always*
  ficam as de IA, com menos compressão; *Always* continua em aberto. Originais de 3024–3675 px, SHA-1 verificado na cópia
  para `media-src/stock/`, licença em `assets.md` §3.
- **Tratamento `calm`:** o mesmo para as quatro (tom quente, negros suaves), com saturação própria: 0,72, 0,7, 0,55 e 0,8.
- **A entrada não muda:** ids novos (`*-photo`); a lâmina continua com o concerto de IA em P&B.
- **Efeito encontrado:** a fotografia clara de *For a moment* deixava *Room I of III* e *Open since* sobre a parede pálida.
  Véu `dm-room` mais forte no topo; contraste no pedaço mais claro (`room.mjs`): mínimo 5,32 a 1920/1440/390, 4,85 a 320.
- **`six.mjs`:** seis momentos, fotografia e peça, a 1440 e 390: sem erros, nada a falhar. typecheck, lint e build passam.
- **Não verificado:** Xiaomi (ecrã bloqueado, `phone-work.mjs` não ligou), `sweep.mjs` com as novas fotografias; iPhone.

### Décima quarta revisão do owner (30/10): *Always* e o vidro das peças
- ***Always*:** imagem nova do owner (`artists-always-photo`), `calm` 0,8, cortados 64 px à esquerda (o batente). A lâmina
  da entrada não muda.
- **O vidro das peças era fosco:** 14 px de desfoque, escurecido e sem lente, nas peças *Reply by RSVP*, etiqueta e
  convite. **Corrigido:** a mesma receita da barra (8 px, × 1,6 no desktop; saturação 1,6; brilho 1,04), película 0,2 e a
  mesma lente, com `lensMap` passado para `src/lib/lens.ts`, agora com o raio do canto.
- **Convite:** o corte oblíquo isola a peça e o vidro só via o véu. A fotografia entra na peça (`dm-still`).
- **`glass30.mjs` (2×):** o `backdrop-filter` calculado traz a lente nas três peças e na barra; mapas desenhados; zero
  erros. Vistos de perto: a silhueta e o arco veem-se através do vidro. `six.mjs` a 1440 sem erros; a 390 só antes desta
  revisão. typecheck, lint e build passam.
- **Custo:** a lente é um filtro SVG; na barra não custou no Xiaomi, mas aqui fica sobre fotografias e não foi medida.
- **Xiaomi com tudo aplicado (gesto simulado):** momentos a rodar 90 fps, p95 11,2 ms, 1 frame > 50 ms em seis janelas de
  8 s. Scroll 66 fps, p95 33 ms, 3–4 > 50 ms. Passagem 59–65 fps a descer, 54–58 a subir, 1–3 > 50 ms. Iguais às medições
  antes das fotografias e do vidro. Não medido: peso em rede móvel; primeiro carregamento das fotografias.
- **Não verificado:** Safari e iPhone ficam sem lente, só com o desfoque.

### Décima quinta revisão do owner (31/10): o quadrado confirmado e a medição final
- **Quadrado em Experiences *During*:** o owner confirmou que desapareceu.
- **Build, `typecheck`, `lint`:** passam, sem avisos.
- **PC (`pc.mjs`):** sete viewports e os testes de movimento reduzido, sem JS, teclado, regresso e refresh; `errors: []`, sem
  overflow horizontal. `moments.mjs` e `nine.mjs`: sem erros.
- **`sweep.mjs` a 1920:** sem saltos em cinco peças; *On the day* e *After* de Experiences listam a galeria e a tira,
  movimentos desenhados. *Always* e *Before* de Experiences não cobertos (o primeiro momento de cada capítulo não entra sempre na gravação).
- **`sweep.mjs` a 390:** todas as peças listam movimento a partir de +1,0 s. Sem linha de base a 390 e não visto a olho.
- **Peso no Xiaomi (carga fria, sem cache):** 3,70 MB em 50 pedidos à chegada (imagens 2 572 KB, vídeo 928 KB, JS 139 KB,
  fontes 114 KB); 3,73 MB depois dos três capítulos. Medido em localhost, por USB: são bytes, não tempo em 4G.
- **Xiaomi, fluidez (`phone-work.mjs`, `phone-pass.mjs`, gesto simulado):**

  | Medida | 30/10 | 31/10 |
  |---|---|---|
  | Momentos a rodar | 90 fps | 90 fps, p95 11,1 ms; 61 fps depois de reiniciar o Chrome |
  | Scroll pelo Work | 66 fps | 59–63 fps, 4–5 frames > 50 ms; 37 fps depois de reiniciar o Chrome |
  | Passagem, a descer | 59–65 fps | 36–41 fps, 1–3 > 50 ms |
  | Passagem, a subir | 54–59 fps | 31–41 fps, 2–5 > 50 ms |
  | **Controlo:** zona simples da página | 75–84 fps (29/10) | 46–50 fps |

- **A queda não vem do código da passagem:** o código não mudou desde 30/10 às 14:32, o controlo caiu quase o mesmo (~40 %),
  e simular 14:30 e 22:30 não muda nada. Poupança de bateria desligada, 27 °C, thermal 0, sem pressão de memória, ligado à
  corrente; reiniciar o Chrome não ajudou. **Causa não encontrada.** A carga do sistema estava alta (loadavg ~7). A mudança
  para 61 fps sugere que o ecrã baixou de 90 para 60 Hz; não confirmado.
- **Não verificado:** a passagem com o dedo do owner (o gesto simulado não é o critério), o peso em 4G, o iPhone.

### Décima sexta revisão do owner (31/10): o tremor da entrada e a passagem
- **Medidor:** `?fps` no endereço (`src/components/fps-meter.tsx`): fps do último segundo, pior frame e frames > 25 e > 50 ms
  desde o último toque. Instrumento de teste; **sai antes de publicar**.
- **Tremor no zoom, confirmado:** frame de 88–122 ms ~180 ms depois de E3, em todas as corridas, com o vídeo a saltar até 5
  frames (`entr-diag`, trace no Xiaomi). Duas causas:
  1. `update()` da barra: 24 `elementsFromPoint` a cada estado da entrada e a cada imagem carregada; 61 ms na thread principal.
     Agora não corre em e2–e4 nem durante a passagem (`bar-client.tsx`). O vidro lê antes e depois: 0,18 ao aparecer, 0,17 depois.
  2. O Chrome redesenhava o véu para a escala máxima ~165 ms depois do início do zoom. Corrigido com uma animação declarada em
     E1 com atraso, em vez de uma transição iniciada em E3 (`entrance.css`).
- **Erro meu, corrigido a seguir:** a primeira correção (animação em pausa) fazia a escala saltar para 160 no primeiro frame:
  **o zoom pelo O deixou de existir** e os números "bons" eram falsos. O owner viu-o. Sem `from` explícito a animação parte da
  escala final. **Regra nova:** `entr-check.mjs` só conta uma corrida se a escala do véu crescer frame a frame.
- **Depois, com o zoom verdadeiro (Xiaomi, 5 corridas, portão ok):** 87–88 fps, 0 paragens do vídeo, 0 frames perdidos; antes
  85 fps, frame de 77–88 ms, até 4 perdidos. Resta um frame de 33–44 ms a ~1,3 s (E4, em 4 de 5 corridas).
- **Ecrã real do Xiaomi (`screenrecord`, 510 frames):** sem picos de luz no zoom, O nítido, véu sai sem resíduo, lâminas por ordem.
- **Seis ecrãs:** Chrome 1920×1080, 1366×768, 768×1024, 820×1180; WebKit (motor do Safari, no Windows) 393×852 e 430×932: escala
  sempre a crescer, sem erros, sem overflow, O certo em frames exatos. Chrome 122–141 fps. **WebKit no Windows corre a 4–5 fps sem
  GPU: vale para a imagem, não para fluidez.** Um frame de 167 ms a 1920 (uma vez, em E4), por repetir.
- **Passagem:** 36–41 fps → 50–57 a descer, 45–51 a subir, a 90 Hz (`phone-pass.mjs`). Numa ronda intermédia deu 38–41, com tudo
  a 60 fps (entrada 58–60, p95 16,5): o telemóvel oscila entre 60 e 90 sem o pedirmos. Explica parte da queda de manhã; não confirmado.
- **Critério:** `acceptance.md` pede 60 fps estável e nenhuma tarefa > 50 ms. Por cumprir na passagem (> 50 ms: 1–4) e no scroll
  do Work (5–8). Na entrada: tarefas de 56–78 ms a 3 das 3 corridas.
- **`pc.mjs`:** `errors: []`, sem overflow. typecheck, lint, build passam.
- **Não verificado:** o olho do owner; fluidez em iPhone real.

### Décima sétima revisão do owner (31/10): o tremor ao assentar
- **Sintoma do owner:** tremor no filme quando diminui para assentar (*dolly* 1,14 → 1), no PC e no Xiaomi, com fps bons.
- **Medição:** filme parado num frame, palavras e barra escondidas, posição da crista das montanhas frame a frame por deslocamento
  sub-pixel: gravação do ecrã no Xiaomi (`dolly.mjs`, `track.cjs`) e screencast no PC (`dolly-pc.mjs`).
- **Resultado:** com o vídeo, saltos até ±1,3 px e 24 inversões; só com o poster, suave. Opacidade, filtro, `will-change` e
  `clip-path` no vídeo não resolvem (±0,4 px no melhor caso).
- **Causa:** o compositor arredonda à grelha de píxeis a posição de um vídeo alinhado aos eixos.
- **Correção:** rotação de 0,03° permanente em `.e-film` e na passagem. Inversões: Xiaomi 24 → 1 no teste e 9 de ruído (≤ 0,26 px) no build
  final; PC 9 → 1. Zoom verificado pelo portão.
- **Passagem para Weddings (a atual fica, decisão do owner):** tirar vídeo, recorte, barra ou aura não muda nada (33–40 fps a 60 Hz). Trace de
  2,06 s: 113 desenhos do compositor (~55 fps) e 55 frames da thread principal (~27 por s), com espera de raster da GPU (commit até 50 ms).
- **Não verificado:** iPhone real; o olho do owner.

### Décima oitava revisão do owner (31/10): a curva do filme e a pilha
- **Curva do *dolly*:** `cubic-bezier(.3,0,.2,1)` → `(.37,0,.63,1)`, mesma duração e escala. Cálculo: tempo a rastejar a < 0,15 px por frame
  0,33 → 0,09 s; pico 2,2 → 1,3 px por frame.
- **Passagem para Weddings:** a passagem para CSS fica adiada (owner: "n sei se vale a pena").
- **Pilha de cartões:** opções em https://claude.ai/artifact/EENJtCtWgXHrjnM434Zmc4. Medidas numa página isolada no Xiaomi, sem o peso do site: ~90 fps nas quatro.

### Décima nona revisão do owner (31/10): da entrada pelo O até o vídeo desaparecer
- **62 fps em repouso:** não é o site. O ecrã do Xiaomi estava a 60 Hz: 61 fps com o filme a rodar, parado, sem a rotação e sem a barra (`rest.mjs`); filme 30 fps, 0 perdidos.
  O telemóvel alterna 60/90 Hz sozinho; causa não apurada. O medidor nunca passa do ecrã.
- **Entrada:** cada estado em `<html>` recalculava a página: 42 ms a abrir o zoom, 64 ms a chegar o estado final. Agora é uma só linha de tempo declarada no escuro
  (`e0` → `run` → fim), em `entrance.css`; nada se escreve durante o movimento.
- **Passagem:** de script para `ScrollTimeline` no compositor; recorte substituído por janela em arco com contra-escala (`flight()` em `work-client.tsx`). Alternativa em script mantida.
  `rangeStart: CSS.px()` é ignorado pelo Chrome: usar a string `'100px'`. Quem lê o portão apanhou isto (escala final 2,48 em vez de 1).
- **Xiaomi (`full.mjs`, portão zoom + palavras + lâminas + arco):** a 90 Hz 89,5–90 fps, pior frame 33 ms; a 60 Hz 60,4–61,1 fps, pior 33 ms, intervalo do filme até 66 ms.
  Passagem: 76 desenhos/s (eram 55), pior frame da thread principal 15 ms (era 64). Tremor (`dolly.mjs`): 1 inversão.
- **Scroll pelo Work (não mexido):** 45–48 fps a 60 Hz, 3–5 frames > 50 ms; por tratar.
- **Seis ecrãs (`passcheck.mjs`, Chrome no 2.º ecrã, WebKit visível):** escala até 1, voltar para cima certo, salto por gesto, sem erros. `modes.mjs`: movimento reduzido, sem JS, tecla e lâmina sem erros.
- **Pilha:** A e B com mola (`linear()`), ~61 fps a 60 Hz na página isolada.
- **Não verificado:** iPhone real; fluidez no WebKit do Windows; `pc.mjs` completo (lança browser próprio, por migrar); a pilha no site.

### Vigésima revisão do owner (31/10): a pilha A no site
- **Construída:** cartões opacos com película (`.w-ph::after`), troca por Web Animations em `change()` de `work-client.tsx`, mola sampleada em `linear()`. A película escurece mais cedo ao passar para trás (0,5 a 30 %), sem máscara.
- **Xiaomi (`phone-pile.mjs`, a 60 Hz, gravado):** três capítulos 60,6–60,8 fps, p95 16,5 ms, 5–7 frames > 25 ms, 0 > 50 ms; cartões a mexer em 147 frames (portão). Saltar momento e toques rápidos acabam nos lugares certos.
- **Não verificado:** a 90 Hz; PC; `moments.mjs` (lança browser próprio); iPhone real.
- **Passagem:** opções 1 e 3 em https://claude.ai/artifact/BQJNPwzzAZQqhRAv4t4B55; a lâmina de Weddings e o arco usam a mesma fotografia.

### Vigésima primeira revisão do owner (31/10): desktop e refinamento
- **Lâmina (`?lamina`, no site real, por escolher):** a lâmina de Weddings voa até ao arco no compositor (`bladeFlight()`), inclinação por shear, curva por duas caixas em crossfade, 1,4 ecrãs de scroll. `lamina.mjs`: 1920, 1366, 820, 393: certo, volta para trás certo, sem erros.
- **Cartões:** deslocamento 58 % → 20 %; o cartão desvanece a sair em vez de saltar para trás; a peça sai com o cartão (espera 450 → 40 ms). A regra de 29/10 (peça primeiro) existia por causa da pilha transparente.

### Vigésima segunda revisão do owner (31/10): a aterragem e o trajeto para trás
- **Bug:** o palco, por baixo da entrada, contava como visível e rodava sem ninguém o ver; ao voltar para trás a peça ficava ligada e ao aterrar aparecia antes da fotografia. Reproduzido (`landing.mjs`: `on: 1` no topo, 3 s depois).
- **Correção:** `onStage()` em `work-client.tsx`: o palco só trabalha com a passagem aterrada; ao sair repõe primeiro momento, sem peça, sem preenchimento.
- **`landing.mjs` (393 e 1920):** descer, voltar, topo, aterrar outra vez, abanar na fronteira, ir a outro capítulo e voltar: estado certo em todos os pontos, sem erros; aterragem vista frame a frame.
- **Cartões:** lateral 40 % (58 % e 20 % rejeitados), 1,45 s, passa por baixo com mola, peça sai com o cartão. Xiaomi a 60 Hz: 60,8–60,9 fps, p95 16,5 ms, 3–4 frames > 25 ms, 0 > 50 ms.
- **Não verificado:** a gesto real do owner; 90 Hz; iPhone real.

### Vigésima terceira revisão do owner (31/10): salto da lâmina, a linha, o regresso do cartão
- **Salto da lâmina:** o enquadramento assumia que a fotografia enchia a largura do arco, e a cópia não trazia a sombra da lâmina. `takeover.mjs`: era até 5 px e +45 de luz; agora 0 px e ≤ 2 de luz, em 393, 820 e 1920. Enquadramentos calculados pelas proporções da própria fotografia.
- **Linha:** a primeira separação acendia com a peça (`.w-li[data-k='0']`); regra retirada, fica sempre apagada.
- **Regresso do cartão:** o salto é a mudança de camada a meio. Três alternativas no storyboard (`pilha-test.mjs`, Xiaomi a 60 Hz, página isolada): ~61 fps nas três; por escolher.

### Vigésima quarta revisão do owner (31/10): a barra de luz; a lâmina como passagem normal
- **Barra de luz:** a cópia da lâmina entrava por cima do nome e da sombra e, nos primeiros píxeis de scroll, isso piscava. As caixas voam agora por baixo das palavras (`.e-window`, z 3); o nome fica inteiro e sai sozinho. `barra.mjs`, gesto de ida e volta gravado no Xiaomi: subida máxima de luz por frame +8 → +3 (ruído).
- **Lâmina normal:** `?lamina` e a janela em arco retirados; `.e-counter` removido. `takeover.mjs` 0 px, luz ≤ 0,6; `landing.mjs` (393) e `lamina.mjs` (quatro tamanhos) certos; `modes.mjs` sem erros; WebKit 393 e 430 sem erros, 20 animações de scroll. Xiaomi a 60 Hz: 54 desenhos/s, pior frame da thread principal 27 ms.
- **Não verificado:** gesto real do owner; 90 Hz; iPhone real; `pc.mjs` completo.

### Vigésima quinta revisão do owner (31/10): a película, o rato e o regresso 1
- **Barra na lâmina:** a sombra (`.e-blade-shape::after` e a da cópia) coincidia com o corte e uma linha da fotografia passava por baixo em posições fracionárias (`barra-pc.mjs`, screencast a 1440: linha inferior a variar 56 níveis num scroll curto e volta). Sombra agora ultrapassa o corte.
- **Rato:** cada movimento gravava `--px/--py` em `<html>` e recomeçava a transição de `translate`. Agora `sequence.ts` suaviza e escreve em cada lâmina, só enquanto assentam.
- **Regresso do cartão:** versão 1 no site: sai para o lado a apagar-se e entra por trás vindo do mesmo lado (1,65 s). A troca de camada acontece com o cartão invisível.
- **A linha de luz, causa final:** a película dentro da caixa era cortada com a fotografia e uma linha ficava descoberta (12 → 103 níveis, só em frames do compositor; `barra-frame.mjs`). A sombra voa agora à parte, por cima, e a fotografia acaba 2 px antes da borda: 12–13 níveis em todos os frames a 1440.
- **Bug novo, corrigido:** chegar a `#capítulo` ou recarregar abaixo da passagem deixava animações presas nos cartões e no texto (`swapFrames` 855 → 206).
- **Xiaomi (`phone-pile.mjs`, 60 Hz):** regresso 1 no site, 60,8–60,9 fps, 0 frames > 50 ms; saltar e tocar depressa certos.
- **Não verificado:** tremor do rato medido apenas pelo mecanismo, não por rastreio de imagem; gesto real; 90 Hz; iPhone real.

### Vigésima sexta revisão do owner (31/10): a linha, de novo, e o cartão em diagonal
- **A linha ao forçar scroll para trás no topo** (`barra-pull.mjs`, toque real no Xiaomi, `edge.cjs`): mesmo em repouso a última fila da lâmina estava ~7 níveis acima das vizinhas e subia a 73 com a página em movimento. Fotografia e sombra eram camadas separadas (translate3d) e cada uma suavizava a borda fracionária. Transform 2D: uma só camada em repouso.
- **A barra escura para a frente:** vinha dos 2 px a menos na fotografia. Agora a caixa acaba no píxel do dispositivo da lâmina (para baixo) e a sombra passa-a 1,5 píxel físico.
- **Cartão:** a versão que desvanece misturava fotografias (recusada). Sólido, diagonal para trás (30 %, −10 %, escala 0,9), 1,45 s. Xiaomi a 60 Hz: 60,6–60,9 fps, 0 frames > 50 ms.
- **Não verificado:** a mudança de camada do cartão a olho no site; gesto do owner; 90 Hz; iPhone real.
- **Regresso do cartão, final (owner):** o movimento em diagonal com o apagar da versão 1: sai a desvanecer na diagonal, troca de camada invisível a meio, reaparece atrás na mesma linha (1,65 s). `phone-pile.mjs`, Xiaomi.

### Vigésima sétima revisão do owner (31/10): o conjunto, o hover, o medidor
- **Hover nas lâminas:** não era tremor contínuo: arranque a alta velocidade, salto de 1,44 px no primeiro frame (`rato-over.mjs`). Curva com entrada suave, 2,2 s: primeiro passo ~0,3 px, 0 inversões; passo máximo restante 0,8–1,3 px, origem não identificada.
- **Cartão:** cartão, película e peça no mesmo relógio (1,7 s); volta sem paragem, invisível só entre 44 e 54 %, troca de camada a meio. Sem espera entre a peça e o cartão.
- **Xiaomi a 60 Hz:** 59,8–60,5 fps; Weddings 15 frames > 25 ms e 1 > 50 ms (a peça a mover o vidro), outros 6–8 e 0.
- **Medidor:** só em localhost/127.0.0.1 e com `?fps`. Regra em CLAUDE.md.
- **Não verificado:** 90 Hz, iPhone real, passagem com a nova película.

### Auditoria de 31/10
Relatório completo em `docs/development/v5-auditoria-entrada-work.md`: sete tamanhos, percurso de ida e volta, Xiaomi a 60 e 90 Hz, sete bugs corrigidos, decisões por aprovar.

### Revisão do owner de 1/11: tremor das lâminas, passagem a 768, regresso do cartão
- **Tremor das lâminas:** reproduzido com `shake.mjs` (rato a abanar entre Artists e Experiences). A lâmina III era a pior: 9 inversões em x, passo máximo 3,0 px em y; a I: 0.
  Causas: profundidade pintada com a página, a cair em píxeis inteiros; uma só suavização por frame, que deixava passar o abanar e piorava com mais Hz; nome e sombra a voltar atrás ao cruzar a borda.
  Corrigido: camada por lâmina só com rato (`will-change: translate`), duas suavizações no relógio, 0,18 s de espera ao sair. Depois: x 1 inversão; y 5 inversões, passo máximo 1,67 px. As inversões em y subiram de 2 para 5 e a medição mistura o deslize do hover: falta o olho do owner.
  Simulação numérica (abanar a 5 Hz, ±126 px, lâmina III): 60 Hz 1,40 → 0,50 px; 144 Hz 2,34 → 0,33 px. A medição real frame a frame (`tremor.mjs`) falhou: só 3 amostras.
- **Passagem a 768:** a descer e a subir com roda real, carga direta bem. Após redimensionar 1440 → 768, a lâmina trocava de ficheiro, `naturalWidth` era 0, NaN, e a fotografia voava sem enquadramento e saltava ao aterrar. Corrigido: a passagem espera pela imagem, e as caixas refazem-se em cada medição. Keyframes iguais em carga direta e redimensionada. Sem regressão a 1440 (`wheel768.mjs`, `wheel-resize.mjs`).
- **Arco a 768:** tablet ao alto, 60 % de largura, 42 % de altura, texto a 56 %.
- **Regresso do cartão:** diagonal mantida, apaga até 26 % do percurso (era 44 %). `moments.mjs` corre sem erro; o aspeto não foi avaliado em gravação.
- **Validação:** tsc e eslint sem avisos, build bem.
- **Não verificado:** tablet real; Xiaomi com estas alterações (só recarregado); 320×640 não alterado; `nine.mjs`, `sweep.mjs` e `pc.mjs` não repetidos; iPhone.

### Segunda revisão do owner de 1/11: cartão com a peça, risco branco, composição a 768
- **Cartão:** a peça ia sobre o cartão ainda inteiro e apagava-se à parte; parecia voltar à imagem normal antes de recuar. Agora entra no cartão ao sair (`carried`, `drop()` a 49 %) e cartão, filtro, zoom e etiqueta saem como um só. Visto frame a frame em Artists *For a moment*. Weddings não gravado.
- **Risco branco:** a última linha da fotografia ficava sem sombra enquanto esta animava. `risco.mjs`, Artists: 18,6 → 2,0 níveis a 1440; 1,8 a 1920. A fotografia pára 2 px antes do corte. O primeiro valor de 5,6 (`overflow: visible`) foi variação; `overflow` saiu na mesma.
- **768×1024:** `tour2.mjs` de cima ao fim do Work e volta, carga direta, redimensionada (1440 → 768) e modo de dispositivo com toque; nove peças com `nine768.mjs`. Layout certo nos três; defeito visível: texto de dois capítulos sobreposto. Corrigido só em tablet ao alto (saída 0,22 s).
- **Validação:** tsc, eslint, build, `moments.mjs` sem erros de página.
- **Não verificado:** tablet real; passagem e cartão medidos no Xiaomi; `pc.mjs`, `nine.mjs`, `sweep.mjs`; iPhone.
- **Correções depois da verificação (1/11):** o corte de 2 px deixava uma barra escura na lâmina de Weddings no Xiaomi: passou a valer só com rato; ecrã do Xiaomi visto, barra desaparecida; risco no PC 1,7 níveis. A saída de 0,22 s não chegava: o texto do momento nunca se apagava com o capítulo; regra própria em tablet ao alto, com o novo a entrar 0,24 s depois. `tour2.mjs` a 768: texto limpo nos dois sentidos.
- **Ficou por decidir:** o telemóvel tem a mesma regra de texto; não foi alterado.

### Terceira revisão do owner de 1/11: risco preto e tremor no zoom das lâminas
- **Sintoma:** com o rato parado sobre qualquer lâmina, risco e tremor em baixo durante o zoom, a crescer e a encolher. Os cartões, o nome na barra e a composição a 768 o owner deu como bem.
- **Causa:** a profundidade vertical deixava a borda inferior em frações de píxel, onde fotografia e sombra, em camadas separadas, eram cortadas de forma diferente. O corte de 2 px só trocou o risco branco pelo preto.
- **Decisão:** profundidade só na horizontal; a borda inferior fica fixa num píxel do dispositivo; corte de 2 px retirado; camada fixa na fotografia (`will-change`, só com rato). Efeito visual: as lâminas deixam de subir e descer 4–6 px com o rato. Para reverter: `sequence.ts`.
- **Medido:** `hover.mjs` com rato parado: linha 2,0 / 1,1 / 0,4 níveis (lâminas I, II, III); com a vertical eram 6,3 / 18,6 / 0,6. `risco.mjs` Artists 1,6 a 1440. A 1920 e 1536 só o primeiro frame gravado dá 7,4–7,6, antes de a lâmina ser alinhada. Inversões da fotografia: 2 / 0 / 0.
- **Não verificado:** ecrã com devicePixelRatio fracionário; Xiaomi (o código novo só corre com rato); iPhone.

### Ronda completa de 1/11: scroll do início ao fim e volta
- **PC, Chrome visível, roda real (`tour3.mjs`):** 1920×1080, 1440×900, 768×1024, 390×844, 320×640, página inteira nos dois sentidos: 0 erros, 0 overflow, de volta ao topo sem peça acesa, passagem limpa, filme a correr. Depois das duas correções abaixo repetido a 1920, 768 e 390.
- **`pc.mjs` ligado ao Chrome de testes (`pc-c.mjs`), sete tamanhos:** 0 erros; movimento reduzido, sem JS (1440, 390, 320), teclado, tecla a saltar, regresso, refresh a meio: bem. Corrido antes das correções da barra e do link.
- **Xiaomi (`--experimental-websocket`):** momentos 89–90 fps; scroll no Work 63–66 fps (p95 33–44 ms, 4–5 frames > 50 ms); passagem a descer 78–80 fps, a subir 72–74 fps (2 frames > 50 ms). Três corridas. Sem gesto real de dedo.
- **Corrigido:** a barra ficava em 02 Method sobre Experiences ao subir; agora recua para a secção anterior. *01 Work* no índice levava à entrada; agora aterra em Weddings (`chapterOf`).
- **Em aberto:**
  - Texto de dois capítulos sobreposto ~0,5 s ao mudar de capítulo, a 1920, 1440, 390 e 320. Só corrigido em tablet ao alto (#73 define 0,65 s). Decisão do owner.
  - 320×640 Weddings: *Every project…* (621–639) sobrepõe o crédito (617–634).
  - Barra: 3 amostras uma secção atrasadas em saltos de 1/4 de ecrã a 1440 e 768; mediu-se 140 ms depois do salto, sem efeito visto com a roda real.
- **Nota de teste:** o Chrome do 2.º ecrã não desenha frames sem gravação ativa; medições com `requestAnimationFrame` ou `IntersectionObserver` precisam de screencast ligado (`tremor.mjs` falhou por isto).
- **Não verificado:** iPhone, tablet real, `sweep.mjs`, `nine.mjs`.

### Decisões do owner sobre a ronda (1/11, README #83)
- **Mudança de capítulo:** a correção do tablet passou a todos os tamanhos. **Crédito:** escondido abaixo de 360 px; a 320 o rodapé termina a 639 de 640, a 390 o crédito continua visível.
- **Medido:** `tour3.mjs` nos cinco tamanhos, nos dois sentidos: 0 erros, 0 overflow, regresso ao topo limpo; `moments.mjs` sem erros; tsc, eslint, build.
- **Não verificado:** `pc-c.mjs` e Xiaomi não repetidos depois destas alterações; iPhone, tablet real, `sweep.mjs`, `nine.mjs`.

### Primeiro teste no iPhone (owner, 1/11, README #84)
- **Reportado no Safari:** a imagem parava acima da barra de baixo; ao puxar para atualizar, o vídeo parava por baixo da ilha dinâmica, com cor lisa em cima; ao descer, uma mancha de luz fora da bola do menu.
- **Corrigido:** `viewport-fit=cover`; entrada, palco e percursos do scroll em `lvh`; `.e-final` e `.w-ch` terminam no viewport pequeno (`--room`), o fundo continua até ao pé; `clip-path` estático nas ilhas, só no iOS (`@supports (-webkit-touch-callout: none)`).
- **Medido no Xiaomi (`ios-room.mjs`, gesto real, barra visível 779 px, escondida 835 px):** entrada e palco 835 px; palavras em 779; rodapé do Work termina em 745. Descer até Experiences e voltar ao topo: 0 erros, 0 overflow. Ecrã real capturado com `adb screencap`: filme até ao pé. A faixa escura em `Page.captureScreenshot` é artefacto da captura.
- **Passagem no Xiaomi (`phone-pass.mjs`, 3 execuções):** a descer 78–81 fps, 0 frames > 50 ms; a subir 72–76 fps, 3 frames > 50 ms em cada execução. Iguais à medição anterior.
- **PC (`tour3.mjs`):** 1440×900 e 390×844, nos dois sentidos: 0 erros, 0 overflow, regresso limpo. `tsc`, `eslint` e build passam.
- **Não verificado:** as três correções no próprio iPhone, que é a única prova delas; a causa da mancha é hipótese, sem captura; menu aberto no iPhone com `viewport-fit=cover`; 1920, 768, 320; tablet real; `pc-c.mjs`, `sweep.mjs`, `nine.mjs`.

### Segundo olhar do owner no iPhone (1/11)
- **Confirmado pelo owner:** a mancha do menu saiu. **Não resolvido:** o vídeo continua a parar acima da barra do Safari e abaixo da ilha dinâmica, apesar de `viewport-fit=cover` e `lvh`. O Xiaomi não reproduz isto.
- **Ferramenta:** `D:\STUDIO-tools5-m5\ios\` (`proxy.mjs`, `hud.js`, `tape.cjs`), porta 3130, sobre o build, sem tocar no site: `● rec`, marca, envio de fotos e vídeos, testes *Fundo magenta*, *Réguas*, *Filme a sangrar*. Provada no Xiaomi com `hud-smoke.mjs`: gravar, enviar, ligar e desligar um teste; alcançável por Wi-Fi. Não testada no Safari.

### Gravação do iPhone (1/11, README #85)
- **Aparelho:** iPhone 402×874, Safari 27.2. Fita: página de 714 a 754 px, safe areas 0 mesmo com `viewport-fit=cover`; 62 px em cima são sempre do Safari. Barra recolhida: a página chega ao fundo do ecrã. Só chegou um vídeo e uma fita a `ios\out\`; o segundo vídeo não está lá.
- **Cor:** faixa do Safari (27,25,24) contra topo do filme (112,90,69). A cor da página segue a cena (`--scene`, `theme-color`). Xiaomi: entrada `rgb(126,103,79)`, regressa a carvão na passagem. Efeito no Safari por ver.
- **Scroll na sequência:** dois swipes reais no Xiaomi: `scrollY` 0, sequência continua; depois do fim a página anda; um toque completa (`hold.mjs`).
- **Tremor no fim da entrada:** vídeo do iPhone a 60 fps, banda de 1206×260 px, 96 frames: sem frames repetidos nem inversões de sentido; passos de 0,2 a 0,9 px físicos (0,3 CSS px) com cadência irregular no fim. Filme a 30 fps. Sem alteração feita.
- **Regressão:** `tour3.mjs` 1440 e 390: 0 erros, 0 overflow. Passagem no Xiaomi: 75–76 fps a descer, 74–75 a subir (antes 78–81 e 72–76), 2–3 frames > 50 ms a subir.

### Moldura do Safari (1/11, README #86, por aprovar a olho)
- **Evidência:** gravação do iPhone das 16:50: a cor do filme tingiu a faixa de cima e a de baixo por igual, e criou uma banda castanha sob o pé escuro do filme. No Work não há borda: chão de cor lisa igual à faixa.
- **Aplicado:** faixas a carvão na entrada; filme com 84 px de transição em cada ponta, só com `-webkit-touch-callout`; no Work, o chão do capítulo.
- **Medido no Xiaomi:** a regra forçada por CDP (`frame.mjs`), ecrã real com `adb screencap`: transição limpa, título e lâminas intactos. `hold.mjs`: scroll retido na sequência, `theme-color` carvão na entrada, `rgb(33,29,24)` e `rgb(23,27,34)` no Work. tsc, eslint, build.
- **Não verificado:** a regra no próprio Safari; menu aberto no iPhone; `tour3.mjs` depois desta alteração.

### Terceiro olhar no iPhone (1/11, README #86)
- **Pedidos do owner:** moldura com a cor da hora; em baixo, o filme acompanhar a barra; saída abrupta da ilha *Chapter One | 01 Work*; texto a tremer em baixo ao fazer scroll.
- **Moldura da hora:** `frame*` em `tuning.ts`. Xiaomi às 17:08, luz evening: `--scene` e `theme-color` `#261d15`. As outras três horas só confirmadas como valores definidos, não vistas.
- **Barra ao sair:** causa: o texto da secção era apagado de imediato. Agora fica até o fundido acabar, 0,9 s (`barexit.mjs`: *01 Work* mantém-se até opacidade 0).
- **Pé do filme:** transição de 44 px presa a `100dvh`. Xiaomi com a regra forçada: bom aspeto com a barra visível; a barra não recolheu neste teste, por isso acompanhar a barra fica por ver no iPhone.
- **Texto a tremer:** por resolver. Chegaram duas fitas, sem imagem. Fitas: palco imóvel (`stageTop` 0), 4 frames > 50 ms numa fita. Vídeo das 16:50: sem oscilação clara, medição grosseira. Falta gravação de ecrã do momento.
- tsc, eslint, build passam. **Não verificado:** Safari; `tour3.mjs` depois destas alterações.

### Bordas do filme com desfoque (1/11, README #86)
- **Evidência (fita 17:21):** marca do owner a 1,7 s, página parada, barra aberta: a barra escura era a transição de 44 px. `dvh` no Safari anda em saltos (727 → 743): acompanhar a barra nunca seria suave. Só chegou fita, sem imagem.
- **Aplicado:** `.e-edge` só no iOS: dois desfoques (3 e 10 px) e cor em rampa de 13 pontos; em baixo, parada no viewport pequeno, com cor lisa por baixo. Saem com o filme na passagem.
- **Medido:** Chrome de testes a 402×754 com a regra forçada (`edge-pc.mjs`): sem camadas visíveis, título e lâminas intactos, opacidade 1 → 0,59 → 0,04 → 0, sem erros. `tour3.mjs` 390 e 1440: 0 erros, 0 overflow. tsc, eslint, build.
- **Não verificado:** Safari; custo de dois desfoques sobre o vídeo no iPhone; Xiaomi desligado do PC (`hold.mjs` e `phone-pass.mjs` não repetidos); texto a tremer continua sem gravação de ecrã.

### Bordas na passagem (1/11, README #86)
- **Reportado:** ao avançar, o filtro de cima quase desaparecia e o filme ficava cru até ao topo; em baixo, uma camada de luz ao aterrar e uma camada cinzenta a meio da passagem. Só chegaram fitas, sem imagem: diagnóstico pela descrição do owner e pelo código.
- **Causas:** as bordas saíam com o filme desde 5 % do percurso; a moldura era mais clara do que o pé do filme (17,15,14), por isso a transição clareava; a cor da faixa mudava logo no início da passagem.
- **Aplicado:** bordas inteiras até 74 % de H, saem até 90 %; a cor passa à do palco nesse ponto (`data-passed`); moldura escurecida; pé só com cor, 110 px.
- **Medido no Chrome de testes, 402×754, regra forçada (`edge-pc.mjs`):** opacidade 1, 1, 0,32, 0 aos 300, 520, 640 e 1200 px; sem camada clara nem cinzenta nos frames. `tour3.mjs` 390 e 1440: 0 erros, 0 overflow. tsc, eslint, build.
- **Não verificado:** Safari; fluidez do desfoque no iPhone; Xiaomi desligado; texto a tremer sem gravação de ecrã.

### Investigação das cores no Safari (1/11, README #86)
- **Evidência:** gravação do iPhone de 37 s, cores amostradas de 0,2 em 0,2 s. Faixa de cima 47,47,45 com carvão; 37,34,31 com `#1a140f`: sempre mais clara do que a cor dada. Barra aberta 44,37,33; pequena 24,20,17. Ao passar a câmara, a faixa saltou de 47 para 37 e o bordo da página de 29 para 25 num frame. No Work a faixa ficou nos 37 enquanto o chão era 28, e só mudou mais tarde: o Safari segue as mudanças com atraso.
- **Conclusão:** cada mudança de cor por cena criava um degrau. Eliminadas: uma cor por visita, uma camada fixa `.frame`. Removidos `.e-edge`, `--scene`, `data-passed`.
- **Medido depois:** Chrome de testes 402×754, regra forçada: sem degrau de cor ao longo da passagem; pé fora no Work, topo mantém-se. `tour3.mjs` nos cinco tamanhos: 0 erros, 0 overflow. tsc, eslint, build.
- **Limite conhecido:** barra aberta 44 contra página 23: faixa do Safari, sem controlo do site; com a barra pequena desaparece.
- **Não verificado:** Safari; custo do desfoque fixo no iPhone; se a camada fixa de baixo acompanha a barra sem saltos; menu aberto; Xiaomi desligado; texto a tremer, não identificado na gravação.

### Crédito, palavra do momento e simulador (1/11, README #87)
- **Crédito:** *Photographs* saiu do site; `word.mjs`: 0 nós, texto ausente. O tremor reportado era nessa linha.
- **Palavra ao entrar no Work:** 402×754, passagem com texto a 0,25, 0,72 e 0,95 de opacidade: palavra vazia; ao aterrar começa a encher do zero (91,97 % → 81,78 % por preencher).
- **Regressão:** `tour3.mjs` 390, 1440, 320: 0 erros, 0 overflow. tsc, eslint, build.
- **Simulador da moldura:** https://claude.ai/artifact/A7pZMaQ54BJD8wHJiQp5WQ (fonte em `ios/sim/`). Quatro opções com o filme real; por decidir pelo owner. Faixas nas outras horas estimadas.
- **Não verificado:** Safari; Xiaomi desligado.

### Faixas de cor do Safari (1/11, README #86)
- **Investigação:** fontes da comunidade dizem que o Safari 26 ignora `theme-color` e lê a cor de elementos fixos na borda, ou fica com uma imagem da página. Explica o 73,63,56 sobre o Work escuro. Sobha: `#1A1919` em `theme-color` e `body`; Belgrade `viewport-fit=cover`; Brandon sem nada; Cartier recusou o pedido. Visto só o HTML, não em iOS.
- **Aplicado:** faixas sólidas de 4 px; cor da hora = chão de Weddings = véu da entrada; pontas do filme nessa cor.
- **Medido no Chrome de testes, 402×754, regra forçada:** a cor não muda da capa até Weddings; muda uma vez em Artists, Experiences e depois do Work; pontas do filme 1 → 0,32 → 0 na passagem; frames sem degrau. `tour3.mjs` 390, 1440, 320: 0 erros, 0 overflow. tsc, eslint, build.
- **Não verificado:** tudo no Safari: se a faixa fica exatamente da cor pedida é a hipótese central. Xiaomi desligado.

### Gravação das 18:23 no iPhone (1/11, README #86)
- **Em baixo:** a zona sob a barra toma a cor pedida (24,23,30 para `#181a20`), mas fica com a cor anterior até à mudança seguinte. Corrigido: tirar a faixa e repô-la 120 ms depois. Por confirmar.
- **Em cima:** com a faixa fixa, a zona da ilha fica a 62, seja qual for a cor pedida; sem ela, era a cor pedida mais cerca de 12. Faixa de cima retirada.
- **Calibração:** `http://192.168.1.202:3130/__diag/lab` (`ios/lab.html`) passa 12 cores no topo e com scroll; serve para fazer a tabela entre a cor pedida e a pintada. Por gravar.

### Primeira calibração (1/11)
- **Faixa de cima para cor da página, topo / com scroll:** 0 → 42 / 35; 12 → 50 / 44; 17 → 54 / 47; 23 → 57 / 51; 29 → 61 / 55; 36 → 66 / 60. A página de teste não tinha `color-scheme: dark`, e no site já se mediu 37 com a página a 25. Segunda calibração preparada no mesmo endereço, com tema, faixa fixa e cor da raiz a variar.

### Correção da calibração (1/11)
- **Erro de medição:** a linha usada para a "faixa de cima" passava pelos algarismos do relógio. Os valores 37, 47, 58, 62 e a tabela da primeira calibração estão errados; a conclusão de que o Safari clareia é falsa.
- **Medido de novo em y 6 e 54, sem texto, página de calibração:** faixa, página e barra iguais em todas as cores: 0, 17, 28,25,24, 36.
- **No site, mesma gravação:** faixa de cima 29,26,25 sobre 24,23,30, a cor do `body`; barra 26,25,28, a meio caminho. Causa: `body` a carvão e `html` na cor da hora. Corrigido: ambos na mesma cor. Por confirmar no iPhone.
- As rondas B, C e D da calibração não correram, e já não são precisas.

### Gravação das 18:40 no iPhone (1/11)
- **Bem:** capa, entrada pelo O, Weddings: ilha, página e barra iguais, a passagem sem degrau; Artists certo a descer.
- **Mal:** em Experiences a ilha ficou em 29,26,23 e a barra em 26,25,28; a subir, tudo desatualizado. Causa provável: o Safari não relê enquanto a página anda.
- **Aplicado:** faixas em cima e em baixo, repostas a 80 ms, 500 ms, 1,2 s e quando o scroll para. Cantos cinzentos da foto na passagem somem mais cedo (fundido de 0,40–0,78 para 0,24–0,50).
- **Medido:** `strips.mjs`, Chrome com a verificação de iOS forçada. Regressão `tour3.mjs` 390. tsc, eslint, build.
- **Não verificado:** releitura no Safari; se os cantos eram o bug do filtro.

### Gravação das 18:48 no iPhone (1/11)
- **Barra de baixo:** certa em todos os capítulos, nos dois sentidos, com cerca de 0,5 s de atraso.
- **Ilha:** ficou em 29,26,23 de 8,2 s a 23,8 s, parada em Experiences e Weddings. Hipótese: elemento sticky no topo sobrepõe-se à faixa fixa (um relato da comunidade descreve isto). Aplicado no iOS: entrada e palco param a 6 px do topo. Por confirmar.
- **Fade de baixo:** 190 → 96 px; tinta do fundo do filme 0,55 → 0,32, só no iOS.
- **Medido:** Chrome com a regra forçada, passagem e capa; `tour3.mjs` 390; tsc, eslint, build.

### Gravação das 18:56 no iPhone (1/11)
- **Resultado:** os 6 px não resolveram e foram retirados. Barra de baixo e página certas nos dois sentidos. Ilha: seguiu a capa e mudou uma vez para Artists (13,2 s); ficou em 29,26,23 em Experiences, Weddings e capa até ao fim (32 s). Em todas as gravações desde as 18:36, Experiences nunca chegou à ilha.
- **Proposta ao owner:** cor da hora em todo o Work; o teste `Cor única no Work` no HUD mostra-a sem tocar no site. Decisão pendente.

### Cenas por baixo da barra do Safari (1/11)
- **Pedido do owner:** como no site da Tesla no iPhone, esticar vídeo e fundos em baixo, sem cor própria. Tesla recusou o pedido (403): não visto.
- **Aplicado só no iOS:** retiradas as faixas e o fade de baixo; filme e chãos 130 px além do fim da página; Work com `overflow-y: clip`.
- **Medido:** Chrome com a regra forçada, `tour3.mjs` 390, tsc, eslint, build.
- **Não verificado:** se o Safari desenha a página por baixo da barra: só o iPhone diz. A cor da barra sem faixa pode voltar ao que era.

### Referência Not a Tesla App (1/11)
- **Gravação 19:08:** nesse site o conteúdo passa por baixo da barra até ao fim do ecrã, aberta ou pequena. No nosso, o filme acaba em y 815 (14,11,10 → 25,27,31), e por baixo fica a cor do Safari, mesmo com o filme a sangrar 130 px.
- **HTML dessa referência:** sem `viewport-fit=cover`, `theme-color` clara, conteúdo em fluxo.
- **Aplicado:** `viewport-fit=cover` retirado. `lab.html` agora com riscas: fluxo, sticky e sticky com filho a sangrar. `tour3.mjs` 390, tsc, eslint, build. Efeito no Safari por ver.

### Teste de riscas no iPhone (1/11, README #86)
- **Fluxo normal:** riscas por baixo da barra até ao fim do ecrã, aberta ou pequena; com scroll, também atrás da ilha. **Sticky de 100 lvh:** pára onde acaba, e por baixo fica cor lisa; a sua cor pinta as faixas do Safari mesmo fora do ecrã. Blocos 3 e 4 não chegaram a ser vistos.
- **Site sem `viewport-fit=cover`:** igual; a causa não era essa.
- **Aplicado só no iOS:** `--screen` = 100 lvh + 130 px em entrada, palco e percursos; palco 70 px acima do ecrã com o chão do capítulo; letras do véu no ecrã visível.

### Gravação das 19:21 no iPhone (1/11, README #86)
- **Confirmado pelo owner:** em baixo o site vai até ao fim do ecrã. **Ilha:** acompanha Weddings, Artists, Experiences e a volta (22,25,31 em Experiences; 29,26,23 em Artists), cerca de 0,2 s antes do chão.
- **Flick:** sem pulsos de brilho nas médias por linha, de 4,4 s a 8,6 s; aos 8,65 s, quando a rampa começa a sair, a zona do desfoque salta ±2 níveis. Desfoque retirado. Causa provável, não provada.
- **Ajuste:** chão do capítulo em 0,45 s no iOS, para coincidir com a ilha.

### Fita das 19:31 no iPhone (1/11)
- **Marcas do owner:** y 679, 679, 753, com H = 884: 0,77 a 0,85 H, sem imagem. Coincidem com a saída da rampa (0,74–0,90 H), com o filme ainda a 8–18 %. Rampa agora sai a 0,90–0,98 H, depois do filme. Por confirmar.

### Ecrã do iPhone fechado (1/11, README #86)
- **Owner, no iPhone:** "ficou bem agora perfeito". Em baixo, conteúdo até ao fim do ecrã; em cima, cores certas; passagem da capa para Weddings sem o defeito.
- **Não verificado depois destas alterações:** Xiaomi, desligado do PC; `pc-c.mjs`, `sweep.mjs`, `nine.mjs`; tablet real; teclado, movimento reduzido e sem JavaScript.

### Ronda final do M5: Xiaomi e desktop (1/11)
**Desktop, Chrome de testes no 2.º ecrã**
- `tour3.mjs` 1920, 1440, 768, 390, 320, nos dois sentidos: 0 erros, 0 overflow, regresso limpo. `pc-c.mjs`: sete tamanhos sem erros; movimento reduzido sem entrada nem vídeo; sem JS sem overflow; ordem de teclado certa; *Welcome back*; refresh a meio.
- `full.mjs`, normal e com as regras do iOS: flick ao fim e volta; scroll, tecla e clique na entrada; chegada por endereço a seis secções; lâmina, nome, Voltar e Avançar; menu, Esc com foco devolvido; menu para About e volta; momento preso; redimensionar no Work e a meio da passagem; 2560×1440, 1024×600, 844×390, 360×640, 820×1180. 0 erros, 0 overflow.
- `sweep2.mjs` a 1440: saltos só a 1,05–1,24 s de cada peça, quando a peça entra. Só 6 de 9 peças apareceram no tempo de medição.
**Bugs encontrados e corrigidos**
1. Vindo de um capítulo adiantado para o topo, o palco ficava nesse capítulo durante a passagem seguinte. Agora volta a Weddings.
2. Um capítulo que saía mantinha a peça ligada, com 12 animações escondidas. Agora descansa 1,3 s depois de sair.
3. A cor da página era uma variável em `<html>`, e cada mudança recalculava a página inteira. Agora é escrita em `html` e `body`.
**Xiaomi (`phone-pass`, `phone-work`, `phone-bar`, `phone-long`, `hold`)**
- Passagem: a descer 83–86 fps, 0 frames > 50 ms; a subir 74–81 fps, 2–3 > 50 ms. Work com scroll: 75–77 fps, 3–4 > 50 ms (66 antes da ronda). Momentos parados: 90 fps, 0 > 50 ms. Menu: 85–89 fps. Página inteira: 67–69 fps, 8–10 > 50 ms.
- Mudança de capítulo: pico de 110–122 ms → 66–88 ms. Picos do Method e About desapareceram. Scroll na entrada bloqueado, toque completa. Temperatura 28 °C.
**Por resolver**
- Mudança de capítulo no Xiaomi ainda custa 66–88 ms a um frame, e é o maior defeito medido.
- Frame único de cerca de 278 ms a 0,94 ecrã no Chrome de testes do PC, sem tarefa no traço e sem equivalente no Xiaomi. Causa não encontrada.
- **Não verificado:** iPhone depois destas três correções; tablet real; `nine.mjs`; leitor de ecrã; rede lenta real.

### Weddings mais longo e secção da barra (2/11, README #88)
- **Owner, iPhone:** Weddings → Artists passava depressa demais nos dois sentidos; Artists → Experiences estava bem. Frame lento do Xiaomi aceite.
- **Fita do iPhone, 2/11 10:50:** depois da passagem, Weddings durou 0,7–1,0 s e Artists 1,4–2,2 s. Em scroll, Weddings tinha ~480 px e Artists 884 px. A troca dá-se quando o passo seguinte cruza o meio do ecrã, e o passo de Weddings começa debaixo da passagem.
- **Correção:** o passo de Weddings passou a 1,5 `--screen` e o Work a 4,9 `--screen`, só com movimento.
- **Bug que a correção trouxe, corrigido:** a subir, o fim da entrada chegava à faixa da barra dentro de Weddings e escondia a ilha do nome (`data-section` = top a 1802 px). Agora, quando duas marcas partilham a faixa, ganha a que vem depois na página.
- **Xiaomi (`long-ch.mjs`, cópia de `phone-long.mjs` que regista o capítulo), duas voltas:** W → A a 2071–2092 px (antes 1650), A → E a 2899–2900 px. Weddings tem agora ~910 px depois da passagem e Artists ~829. A subir, a barra fica em `work` em todo o Work. Frames > 40 ms iguais aos de antes (máximo 99–100 ms à saída do Work).
- `typecheck`, `lint` e `build` passam.
- **Não verificado:** iPhone (espera pelo owner), viewports do PC (`tour3`, `full.mjs`), teclado, sem JS. O movimento reduzido não muda, porque a regra está dentro de `prefers-reduced-motion: no-preference`.
- **Experiences, mesma regra (2/11, fita do iPhone das 11:01):** Experiences ficava parado ~365 px, 0,4 s, antes de o palco se soltar. O último passo passou a 1,5 `--screen` e o Work a 5,4. Xiaomi, duas voltas: Experiences fica parado de 2896–2908 px a 3683–3717 px, ~800 px. Weddings ~910 e Artists ~830. O frame à saída do Work está em 99–111 ms (antes 99–100). Lint e build passam. iPhone por ver.

### Palavra do momento na troca de capítulo (2/11, README #89)
- **Vídeo do iPhone das 11:13:** o limite do BEFORE preenchido, seguido a 60 fps num recorte do vídeo. Na troca de capítulo o texto desaparece durante ~0,4 s e volta a aparecer com ~15 px (meio B) já cheios, nas duas chegadas a Experiences (6,2 s e 23,4 s) e também em Artists (10,15 s). Depois enche de forma linear, a ~27 px/s; as "paragens" são os espaços entre letras. Fora do ecrã durante 0,8 s (7,6–8,3 s), o enchimento continuou, como devia.
- **Correção:** na troca de capítulo, a palavra espera 450 ms (`--fill-lead` na `.w-mom`, que o `.w-wf` herda) e o primeiro momento conta os 6 s a partir daí.
- **Erro meu, corrigido na mesma ronda:** a primeira versão punha `animation-delay` no botão, e a animação está no filho, por isso o atraso não fazia nada. O Xiaomi mostrou-o.
- **Xiaomi, depois da correção:** troca aos 547 ms; o texto começa a aparecer aos 914 ms; a palavra começa a encher aos ~1055 ms, com o texto a 0,5 de opacidade e a palavra vazia até lá. Typecheck, lint e build passam.
- **Atenção nas medições do Xiaomi:** `Page.navigate` para o mesmo endereço com outro `#` não recarrega a página, e o telemóvel continuou com o JS antigo. Usar `?r=<tempo>`.
- **Não verificado:** iPhone; o ritmo completo de 6 s depois do atraso (só no código).

### Título do capítulo e margem na troca (2/11, README #90)
- **Vídeo do iPhone das 11:30, recorte do título a 30 fps:** na chegada a Experiences, "III Experiences" anda ~0,17 s e salta para o lugar final num frame. Visto aos 5,6–6,0 s. Na fita há também muitas trocas Artists ↔ Experiences entre os 6 e os 20 s.
- **Título:** o FLIP passou de "transição a `none`, dois rAF, transição a ''" para `el.animate()` com 1,2 s e o `--ease`. Uma viagem ainda a decorrer é cancelada; a nova parte do retângulo e da escala que se veem (escala lida da matriz do `transform`).
- **Troca de capítulo:** o `IntersectionObserver` no meio do ecrã deu lugar a uma leitura no scroll (três `getBoundingClientRect`, sem reflow durante o scroll), com uma margem de 12 % do ecrã nos dois sentidos.
- **Chrome de testes, 390×844, scroll com rato (o toque emulado não faz scroll):**
  - O título anda de forma contínua de left 229 / largura 114 até 31 / 191 em ~1,2 s (339 → ~1500 ms), sem saltos.
  - Partindo de 20 px antes da troca, com seis oscilações: ±40, ±80 e ±110 px não mudam de capítulo. ±160 px (19 %) muda uma vez, para Experiences, e não volta. Antes, ±40 px já trocava a cada oscilação.
- Typecheck, lint e build passam.
- **Não verificado:** Xiaomi (bloqueado, o adb não o acorda); iPhone; o ritmo com o dedo real.

### Pilha de fotografias na troca (2/11, README #91)
- **Vídeo do iPhone das 12:00, banda da fotografia a 60 fps (média e centróide dos píxeis claros):** troca para Experiences às 15,06 s. A pilha que sai desaparece num frame às 15,333 s (+0,27 s). A que entra só aparece às 15,417 s (+0,35 s), sobe de forma contínua até 15,600 s e salta às 15,617 s (+0,55 s). Depois fica parada. Na chegada das 5,73 s, o mesmo salto às 6,133 s (+0,40 s).
- **Correção:** `fly()` em `passage()` — as duas pilhas animam com `el.animate()` (1,1 s, `--ease`) a partir do estilo calculado no momento da troca. Uma viagem anterior é cancelada. As regras CSS continuam como estado final.
- **Chrome de testes, 390×844:** em Artists → Experiences as duas pilhas cruzam-se de forma contínua (0,91/0,09 → 0,50/0,50 aos +130 ms → 0,10/0,90 aos +440 ms → 0/1 aos ~900 ms). A pilha que entra sobe 117 → 101 px sem saltos. Typecheck, lint e build passam.
- **Não verificado:** iPhone (a causa do corte no Safari não está provada; a correção é a mesma que resolveu o título na #90); Xiaomi (bloqueado).

- **Owner, iPhone, 2/11:** "ficou corrigido, parece-me tudo bem agora". #88–#91 aprovadas no iPhone. Por medir no Xiaomi: #90 e #91, porque o telemóvel estava bloqueado.

### Rebordo branco nos cartões do Work (2/11)
- **Owner:** "o filtro que entra em todos os cartões, especialmente notável em Weddings, tem uma borda branca".
- **Causa (captura a 1440, 2×, ampliada):** a peça de cada momento (`.w-dm`, com o véu escuro) é uma camada sobre o cartão, com o mesmo recorte. Na borda suavizada, os dois recortes deixam passar metade cada um, e via-se um fio de fotografia sem véu. Não vinha da película dos cartões de trás: testado com `::after` a -2 px, sem mudança, e revertido.
- **Correção:** `.w-dm` com `inset: -1px`. O véu cobre a borda da fotografia e o píxel de fora fica sobre o fundo escuro. Na mesma captura ampliada o fio desapareceu. Lint e build passam.
- **Não verificado:** iPhone e Xiaomi.
- **Vidro da barra:** a borda que o owner vê é o aro de luz aprovado (#69, #80). Página de comparação com quatro variantes (como está, aro suave, sem aro, sem aro e sem lente), feita com capturas do site: https://claude.ai/artifact/LXX3DjkKNWoExydD3dFMgg. Aguarda a escolha do owner.
- **Owner, 2/11:** o rebordo branco dos cartões está corrigido (confirmado). O aro do vidro da barra e do menu fica como está (opção A).

## M6 — Method

### Passo 2: o Method parado (2/11)
- **O que é:** `src/components/method/` (`method.tsx`, `method.css`, `method-client.tsx`). O estado final de 7–11 em sequência, que é também a versão sem JavaScript e com movimento reduzido:
  - o estúdio da hora, preso atrás da secção (uma imagem de sala sem luz, #94) e a luz como camada (no telemóvel, redonda e atrás dos ecrãs, C);
  - *No templates. No copies.* e *Make it yours* (`<label>`, sem JS escondido);
  - seis ecrãs vivos no desktop, três no telemóvel, com a data, a hora e o nome;
  - a capa (*Your first/second chapter*, ou *Chapter One · for / Ana*);
  - o fim no escuro, com uma luz redonda medida pela largura.
- **Pipeline:** `npm run images -- --only=studio` copia as salas de `media-src/method/final/` sem as recodificar.
- **Barra:** qualquer elemento com `data-lum` declara o seu brilho (antes só `section`). O Method declara o do estúdio por hora (manhã .84, dia .87, fim de tarde .70, noite .14) e o fim escuro .1. Sobre o papel claro as ilhas ficam a .47–.50.
- **Bugs encontrados e corrigidos:**
  1. As regras do esqueleto das secções por construir (margens, `picture` a 420 px) apanhavam o Method.
  2. No ecrã do casamento, a fotografia (item flex) empurrava o título para fora.
  3. Pintar as bordas da página com o papel do estúdio deixava o About, ainda sem fundo, sobre papel claro. Revertido: o estúdio cobre o ecrã.
- **Chrome de testes, varrimento lento nos dois sentidos** (do fim do Work ao About, passos de 1/9 de ecrã): 1920×1080, 1440×900, 768×1024, 390×844, 320×640. 0 erros, 0 overflow, secção da barra certa, escuro das ilhas como acima.
- **Nome:** escrito tecla a tecla, *Ana* aparece igual nos seis templates e compõe cada ecrã, a capa, *For Ana.*, *Talk to us, Ana* e *Hello, Ana.* no menu. Apagado, tudo volta ao texto de origem.
- **Teclado:** do campo, o Tab vai para *Talk to us*, com foco visível.
- **Sem JS:** o texto lê-se inteiro; o campo não aparece.
- **Xiaomi (dedo sintetizado, toda a secção, dia):**

| Scroll | Desce | Sobe |
|---|---|---|
| Lento, 600 px/s | 73 fps | 76 fps |
| Normal, 1500 px/s | 70 fps | 72 fps |
| Rápido, 3500 px/s | 62 fps | 65 fps |

  Dentro do Method, só frames isolados de 44–55 ms. O maior (133 ms) cai antes, na saída do Work (já conhecido, #88).
- **Ecrã do Xiaomi:** capturas em sete pontos; as ilhas leem-se sobre o estúdio; *Your second chapter* para quem volta.
- **Não verificado:** iPhone (cor das bordas do Safari e camadas da luz no OLED); horas reais diferentes de dia no telemóvel (só forçadas no PC); leitor de ecrã.

### Passo 3: a cena presa e a ponte do Work (2/11)
- **O que é:** `method-stage.ts`. Com JavaScript e sem movimento reduzido, o Method é uma cena presa de 7,4 ecrãs:
  - pré: o fundo escuro de Experiences (#171b22), para a costura com o Work não se ver;
  - 7: o desenho do guia sai do lugar do palco do Work e multiplica-se em seis templates (três no telemóvel), enquanto o estúdio acende;
  - 8a–8c: as folhas saem e revelam os ecrãs (desktop dois a dois, telemóvel um a um);
  - 9: o ecrã em destaque é o do capítulo escolhido na entrada (no telemóvel, a ecrã inteiro);
  - 10: a capa;
  - 11: a luz baixa.
- **Técnica:**
  - fases por scroll, com margem de 2,5 %;
  - cada passagem é uma Web Animation que parte do estado visível;
  - as cartas são desenhadas no maior tamanho que vão ter e só reduzem (nunca ampliam);
  - a luz anda por `transform`;
  - a barra lê .12 no escuro (pré, 11) e o brilho do estúdio no resto.
- **Posições:** as do storyboard v46, com duas exceções:
  1. o primeiro ecrã revelado no telemóvel desce de 40 % para 47 % (a 40 % tapava *Make it yours*);
  2. no desenho de telemóvel, a cena vive numa moldura de proporção de telemóvel (largura limitada pela altura). Num telemóvel não muda nada; num tablet ao alto (768 × 1024) os ecrãs, a capa e o destaque passavam do ecrã. A frase e a capa do telemóvel têm o mesmo limite pela altura.
- **Chrome de testes, fase a fase, a descer e a subir em passos de 1/8 de ecrã:** 1920, 1440, 768, 390, 320, e também manhã (1440) e noite (390). A ordem das fases está certa nos dois sentidos; 0 erros; 0 overflow.
- **Frames medidos na página (rAF), a 390 e a 1440, em 11 passagens** (incluindo 11 → 10, 10 → 9, 9 → 8c, 7 → pré): máximo 7–21 ms, 0 frames > 40 ms. A gravação de ecrã mostrava pausas de 201–264 ms em pré → 7 e 8c ↔ 9, mas eram da própria gravação; os rAF não as têm.
- **Outros casos:**
  - movimento reduzido: estado final, sem cena;
  - por `#method`: chega à fase 7;
  - focar o campo na fase 11 leva à 7 (o scroll vai no frame seguinte, porque o browser repunha o scroll depois do foco);
  - *Talk to us* pelo teclado leva à 11;
  - o nome compõe os templates na fase 7;
  - mudar o tamanho a meio (1440 → 900 × 700 → 390) recoloca tudo, sem overflow.
- **Fotografias:** os ecrãs em destaque no telemóvel pedem a fotografia à largura do ecrã (`100vw`), porque abrem a ecrã inteiro.
- **Não verificado:** Xiaomi (bloqueado durante este passo); iPhone; a passagem da lâmina do Work para a cena no ecrã real.
- **Xiaomi (2/11, ao fim do dia, fim de tarde), passagens medidas por rAF, scroll parado depois de cada salto:** 7 → 8a, 8a → 8b, 8b → 8c, 8c → 9, 9 → 10, 10 → 11 e os regressos correm a 88,7–90 fps, com máximo de 22–45 ms.
- **pré → 7 (as luzes acendem):** começava com um frame de 182 ms.
  - Correção 1: o estúdio e as fotografias das cartas são descodificados quando o Method está a um ecrã de distância → 132 ms.
  - Correção 2: antes da cena, as cartas e o estúdio ficam a 0,1 % de opacidade, para já estarem desenhados → 55–100 ms (varia entre corridas).
- **As folhas deixaram de animar a moldura, as margens e os cantos** (só as cores): cada frame refazia a disposição de três a seis cartas. Os cantos do ecrã a ecrã inteiro mudam de uma vez.
- **Scroll de dedo sintetizado pela cena inteira (6178 px):**

| Scroll | Desce | Sobe |
|---|---|---|
| Lento, 600 px/s | 80 fps, 11 frames > 40 ms | 82 fps, 8 > 40 ms |
| Normal, 1500 px/s | 76 fps, 4 > 40 ms | 77 fps |
| Rápido, 3500 px/s | 57 fps | 70 fps |

  Antes das correções: lento a descer 75,5 fps com 22 frames > 40 ms. Os frames maiores (77–111 ms) caem na saída do Work (já conhecida) e no início da cena. No rápido, uma passagem atravessa várias fases e os voos sobrepõem-se.
- **Ecrã do Xiaomi, fase a fase:** igual ao Chrome de testes; o campo à vista nas fases 8; o casamento a ecrã inteiro na 9.

### Passo 3b: A + B, a 163, o ecrã inteiro e a capa feita do ecrã (2/11, README #96, #97)
- **O que mudou:**
  - Antes da cena vê-se o *On-site guide*, a última peça de Experiences, no lugar do palco do Work, sobre a noite.
  - Na fase 7, uma cortina oblíqua de noite (#171b22), com o bordo iluminado, desliza e abre o estúdio, que já estava desenhado por baixo. O guia torna-se o primeiro template e os outros saem dele.
  - Na fase 9 (telemóvel), o ecrã em destaque ocupa o ecrã inteiro, por baixo da barra; o menu do site desce para 24cqw.
  - Na fase 10, o ecrã em destaque transforma-se na capa: a fotografia cresce por escala até à carta inteira, o painel creme desce e apaga-se, e o véu e as palavras da capa sobem uma a uma.
  - O ecrã do casamento usa a Solteiros 163, a cores (SHA-1 76E916D6… igual na origem e em `media-src/weddings/`), em 640, 960 e 1280 px; o maior pesa 209 KB em AVIF.
- **Primeira versão da lâmina: uma faixa a mover a própria sala.** Problemas encontrados:
  1. no telemóvel, a 150 % de largura, o bordo inclinado atravessava o ecrã em baixo (390 × 844);
  2. o Xiaomi só desenhava a sala quando a faixa abria (frames de 78–100 ms).
  Trocada por uma cortina de cor lisa movida por `transform`: pré → 7 passou a 66–79 ms na mesma medição.
- **A capa primeiro animava a altura da fotografia:** isso redesenhava a carta inteira em cada frame, ao tamanho do ecrã (100–122 ms). Passou a ser só `transform`: 55–66 ms.
- **As folhas perderam a transição de cor;** as leituras de estilo de cada mudança de fase foram agrupadas antes das animações.
- **Xiaomi, por rAF, com a página acabada de carregar (salto de scroll):**
  - pré → 7: 79–144 ms (varia entre corridas);
  - 9 → 10: 55–110 ms;
  - todas as outras passagens: 88–90 fps, com máximo de 22–44 ms.
  - Com traço de desempenho, o 9 → 10 não tem nenhuma tarefa acima de 14 ms. O pico é de primeira vez (descodificar e desenhar a fotografia grande); por indício, não provado.
- **Xiaomi, scroll de dedo:**

| Scroll | Desce | Sobe |
|---|---|---|
| Lento | 80 fps | 82 fps |
| Normal | 75 fps | 73 fps |
| Rápido | 70 fps | 64 fps |

  Ainda há frames isolados de 110–122 ms no início da cena e ao formar a capa, e um de 243 ms numa passagem rápida para cima, na saída do Work.
- **Chrome de testes, fase a fase nos dois sentidos, a 1920, 1440, 768, 390 e 320:** 0 erros, 0 overflow. Também passam: movimento reduzido, entrada por `#method`, mudança de tamanho a meio.
- **Gravação frame a frame a 390:** a cortina varre o ecrã e o guia multiplica-se; 9 → 10 é um só objeto, nos dois sentidos.
- **Não verificado:** iPhone. No tablet ao alto, o ecrã em destaque fica do tamanho da moldura de telemóvel (a altura toda, não a largura).

### Passo 3c: revisão do owner — a lâmina sobre Experiences, fase 10, refresh, Accept (2/11, README #98)
- **O que o owner viu:** no desktop o Method subia como um bloco escuro, com um template sozinho à esquerda, e só depois passava a lâmina; a fase 10 tinha dois ecrãs esbatidos de um lado e um do outro; um refresh em Artists ou Experiences mostrava Weddings e corria até ao capítulo; o botão Accept parecia ajustar-se antes da resposta.
- **Causa do bloco escuro:** o Method por cima do Work tinha o fundo da hora (#181a20 à noite), e tapava o Experiences em vez de o deixar ver. Com o fundo transparente na cena presa:
  - em −0,6 e −0,05 telas antes da cena vê-se o Experiences; em −0,05 já está em During, com o guia (1440 e 390, scroll em passos);
  - na passagem gravada, a lâmina atravessa o próprio Experiences e o estúdio fica atrás dela; o guia torna-se o primeiro template e multiplica-se (1440 e 390).
- **Fase 10, 1440:** a capa ao centro, dois ecrãs esbatidos de cada lado.
- **Fase 10, 390:** em repouso a capa fica limpa. Durante a passagem vê-se uma faixa creme em baixo: é o fundo do ecrã enquanto a fotografia cresce. Faz parte do desenho e foi deixada como está.
- **Refresh** (`reload.mjs`, amostra por frame desde o primeiro script):
  - em Artists (1440) e Experiences (1440 e 390), o palco fica a opacidade 0 até ~135–147 ms;
  - depois aparece já no capítulo certo, sem passar por Weddings.
- **Accept** (`accept.mjs`, posição por frame): o cartão crescia de 96 % ao subir. Agora só sobe; durante todo o momento *Before* a pílula mantém a largura (83,8 px), e a troca para a confirmação é sequencial, sem as duas sobrepostas.
- **Xiaomi, rAF, página acabada de carregar (salto de scroll):**
  - pré → 7: 77 fps, com frames de 44–66 ms (antes 79–144 ms);
  - 9 → 10: 84 fps, máximo de 77 ms;
  - as outras passagens: 87–90 fps, máximo de 22–55 ms.
- **Barra:** passa a *02 Method* só quando o topo do Method entra na faixa de cima (−0,05 telas); antes disso mostra *01 Work*.
- **typecheck, lint e build:** passam.
- **Chrome de testes, fase a fase nos dois sentidos, a 1920, 1440, 768, 390 e 320 (`phases.mjs`):** todas as fases em ordem, 0 erros. Também passam o teclado (campo e *Talk to us*) e a mudança de tamanho a meio (`edges.mjs`).
- **Não verificado:**
  - iPhone;
  - scroll de dedo no Xiaomi depois desta mudança;

### Timer depois de escolher um momento no Work (2/11)
- **O que o owner viu:** ao tocar num momento (Before, During, After), o timer e o preenchimento da palavra começavam logo, com as cartas ainda a mexer.
- **Agora:** a palavra e os 6 s do momento esperam que a pilha assente.
  - Quando a carta vem do lugar seguinte da pilha, esperam 1,12 s (o fim da mola).
  - Quando a carta vem de trás e atravessa a pilha, esperam 1,55 s.
- **Medido** (`tap.mjs`, 1440, posição da carta e progresso do preenchimento por frame):
  - carta do lugar seguinte: já está parada aos ~0,6 s; o preenchimento começa aos 1,2 s;
  - carta de trás: fica a 2 px do lugar aos 1,55 s; o preenchimento começa aos ~1,5 s.
- **typecheck, lint e build:** passam.
- **Não verificado:** Xiaomi e iPhone.
### Passo 3d: a passagem em dois passos (2/11, README #99)
- **O que mudou:**
  - Fase nova *slit* (a fenda), entre o *pre* e a 7. A 7 dispara meia tela depois e o Method passou a ter 7,9 telas.
  - A lâmina tem duas arestas movidas por `transform`.
  - O desenho do guia é medido a partir da fotografia do Work.
  - O desenho e o papel são duas camadas, e os ecrãs vivos só aparecem debaixo do papel.
  - Experiences apaga-se por baixo de uma camada com o fundo do Work.
- **Gravação frame a frame** (`rec7.mjs`; fenda, abertura, volta à fenda, volta ao início):
  - 1440 à noite, 2560 × 1305 à noite, 390 de dia (fuso emulado).
  - O desenho fica da altura da fotografia, também a 2560.
  - Na primeira gravação viam-se as fotografias dos ecrãs através do papel; corrigido.
  - No telemóvel, de dia, a fenda clara passava por baixo da ilha esquerda da barra, que ficava clara. Na fenda, a barra passa a ler a luz da hora.
- **Scroll rápido, um salto do *pre* para além dos dois gatilhos:** fenda aos 2 ms, 7 aos 1658–1666 ms (1150 + 500 de espera), nos três tamanhos.
- **Xiaomi, rAF, duas corridas:**
  - *pre* → fenda: 86 fps, máximo de 44 ms (89 ms uma vez);
  - fenda → 7: 85 fps, máximo de 66 ms;
  - todas as outras passagens: 86–90 fps;
  - para trás, 7 → fenda e fenda → *pre*: 88 fps.
- **Xiaomi, scroll de dedo:**

| Scroll | Desce | Sobe |
|---|---|---|
| Lento | 83 fps | 84 fps |
| Normal | 75 fps | 75 fps |
| Rápido | 85 fps | 75 fps |

  Frames isolados de 44–110 ms. 0 erros.
- **Chrome de testes, fase a fase nos dois sentidos, a 1920, 1440, 2560 × 1305, 768, 390 e 320:** todas as fases em ordem, 0 erros.
- **Teclado:** o campo, focado na fase 11, traz de volta a 7. Na ronda anterior o `edges.mjs` corria sem emulação de foco e dizia 11 → 11; o "passa" registado no passo 3c não estava verificado.
- **Página parada (movimento reduzido), a cinco tamanhos:** 0 overflow, 6/6 imagens.
- **typecheck, lint e build:** passam.
- **Não verificado:** iPhone.
### Passo 3e: voltar atrás da fenda, scroll mais curto, cor das bordas (2/11)
- **O que o owner viu:** ao voltar da fenda para o Experiences, a borda da lâmina e o desenho do telemóvel desciam com a página.
  - **Causa:** acima da cena o palco do Method deixa de estar preso, porque o topo da secção já está abaixo do ecrã. A lâmina a fechar e o desenho a apagar-se iam com o scroll.
  - **Correção:** enquanto larga (1,1 s), o palco fica fixo no sítio exato onde estava e depois volta a sticky.
  - **Medido** (`leave.mjs`, posição do desenho por frame enquanto se sobe 40 px por frame): a 390 fica nos 121 px e a 1440 nos 164 px durante todo o apagar. Antes descia; numa versão intermédia saltava 20 px no início.
- **Scroll do Method:** passou de 7,9 para 5,7 telas. Do 7 ao 11 eram 5,2 telas e agora são 3,4.
  - Chrome de testes, fase a fase nos dois sentidos, a 1920, 1440, 2560 × 1305, 768, 390 e 320: todas as fases em ordem, 0 erros.
  - Teclado: o campo, focado na fase 11, traz de volta a 7.
- **Cor das bordas da fenda:** fotografadas nas quatro luzes, como estão agora e com uma proposta (bordas na cor da luz da hora). A decisão é do owner: https://claude.ai/artifact/RvZLvVX4QYbfSna9Cxuruf
- **typecheck, lint e build:** passam.
- **Não verificado:**
  - scroll de dedo no Xiaomi depois de encurtar, porque o ecrã do telemóvel estava desligado;
  - iPhone.
### Passo 3f: o palco preso antes da fenda; a barra; as bordas (2/11)
- **O owner viu de novo o bug** (gravação no desktop, 2560 × 1305, scroll para trás e para a frente sobre a fenda): a borda e o ecrã do telemóvel ainda desciam.
  - Reproduzido com a gravação dele (`replay.mjs`): antes de passar a *pre*, a secção já descia 37 px (a faixa morta, mais o scroll que chega antes do script) e o palco era fixado 37 px abaixo.
  - **Causa de fundo:** o palco só ficava preso a partir da fenda.
  - **Correção:** a secção do Method começa meia tela antes da cena, transparente sobre o Work (margem −2,1 telas, altura 6,2). O palco já está preso quando a fenda abre e fecha. O último passo do Work ganhou essa meia tela (3 telas; Work 6,9). A ponte para *During* fica meia tela antes da fenda.
  - **Medido com a mesma gravação:** o palco fica em 0 em todos os 1055 frames visíveis; o desenho fica a 206–209 px (é medido de novo da fotografia em cada entrada).
- **Barra:** a marca nova do início do Method tinha 1 px de altura e um scroll rápido saltava-a, por isso a barra ficava em *01 Work* na fenda. Agora a marca vai até ao fim do Method.
  - Verificado com scroll lento e com saltos, nos dois sentidos, a 1440 e 390: *work* antes, *method* na fenda.
- **Barra sobre a fenda clara no telemóvel, com uma hora de dia verdadeira** (fuso emulado): a ilha escurece e lê-se. Com a hora posta à mão a ilha fica com o vidro da hora em que a página abriu; é um artefacto do teste.
- **Bordas:** acrescentada à página de decisão uma proposta B (sem linha, a luz da sala a derramar para os dois lados, na cor da hora), fotografada nas quatro luzes, desktop e telemóvel. Ainda não está no site.
- **Chrome de testes:**
  - fase a fase a 1440, 2560 e 390: em ordem, 0 erros;
  - teclado: 11 → 7;
  - página parada: 0 overflow, 6/6 imagens.
- **typecheck, lint e build:** passam.
- **Não verificado:**
  - Xiaomi depois destas mudanças (o ecrã estava desligado);
  - iPhone.
### Passo 3g: a luz "B suave" e o vidro do desenho (2/11, README #100)
- **No site:** as linhas das arestas foram substituídas por duas camadas de luz que andam com a lâmina (mesma duração e curva). O desenho tem um vidro a 30 %, sem `backdrop-filter`.
- **Gravação frame a frame** (`rec7.mjs`):
  - 1440 à noite;
  - 390 de dia (fuso emulado): o desenho lê-se dentro da fenda clara.
  - Abertura, volta à fenda, volta ao início: sem erros.
  - Salto rápido: fenda aos 2 ms, 7 aos 1660 ms.
- **typecheck, lint e build:** passam.
- **Não verificado:**
  - Xiaomi: o ecrã continua desligado e não se pode acordar pelo adb, por isso as medições das últimas quatro rondas estão em falta (3e a 3g);
  - iPhone.
### Xiaomi depois das rondas 3e a 3g (2/11, telemóvel acordado)
- **rAF, página acabada de carregar (`raf.mjs`, posições da cena nova):**
  - *pre* → fenda: 82–85 fps, um frame de 89–111 ms;
  - fenda → 7: 82–84 fps, dois frames de 66–100 ms;
  - 9 → 10: 83–86 fps, máximo de 55–68 ms;
  - as restantes passagens: 87–90 fps;
  - para trás, 7 → fenda e fenda → *pre*: 88 fps, máximo de 44–55 ms.
- **Pré-pintar a luz a 0,1 %** não mudou os picos (99–111 ms).
- **Bisseção dos picos com CSS injetado:** sem a luz, sem o vidro e sem os dois, os picos são os mesmos (55–133 ms, variam de corrida para corrida). São frames da primeira vez que a fenda e as cartas se desenham depois de a página carregar; a luz e o vidro não pesam.
- **Scroll de dedo (`phone.mjs`), duas corridas:**

| Scroll | Desce | Sobe | Na ronda 3d |
|---|---|---|---|
| Lento | 79–80 fps | 80 fps | 83 / 84 |
| Normal | 80–82 fps | 75 fps | 75 / 75 |
| Rápido | 83–84 fps | **61–66 fps** | 85 / 75 |

- **Atirar para cima ficou pior** (61–66 contra 75 fps). Com a luz e o vidro desligados fica igual (62 fps), por isso a causa é o Method mais curto: o mesmo gesto atravessa mais fases por segundo, e cada fase começa as suas animações. Os frames acima de 40 ms são de 44–99 ms, cerca de 10 em 150.
- **A julgar a olho no telemóvel** (owner).
### Passo 3h: a fenda segue o desenho, vidro liso, luz sem degraus, segundo passo mais cedo (2/11)
- **Fenda no desktop:**
  - antes era uma parte fixa do ecrã (0,40–0,60). A 2560 × 1305 ficava 37 px à direita do desenho, sem lhe tocar (owner);
  - agora é posta a partir do desenho medido: a aresta esquerda cruza o pé do desenho a 13 % da largura dele, e a fenda tem 0,93 larguras de desenho. Valores tirados de 1440, onde estava aprovada;
  - a 1440 dá 0,401–0,602, igual ao que estava;
  - no telemóvel fica a fenda original.
- **Vidro do desenho:** sem o brilho diagonal (saía em degraus e parecia uma luz falsa). Liso a 30 %, com o rebordo de cima a 20 %.
- **Luz da fenda sem degraus:** a queda é agora uma máscara PNG ditherizada (Bayer 8 × 8) por hora, com a força já dentro (`scripts/spill-mask.mjs`, 8 ficheiros de 0,4 KB); a cor é opaca no CSS.
  - Medido na mesma linha de píxeis, de noite, a 2560: antes, patamares de 10–20 px por tom; agora, 41 → 23 um tom de cada vez, com dither.
- **Segundo passo:** a fenda toca em 1,0 s (era 1,15), espera 0,25 s (era 0,5), e a 7 dispara a um terço de tela (era meia).
  - Salto rápido: abre aos 1260 ms (era 1660), a 2560 e 390.
- **Xiaomi, rAF:** *pre* → fenda 86 fps (máximo 44 ms); fenda → 7 85 fps (máximo 77 ms).
- **Chrome de testes:** fase a fase a 1440, 2560 e 390, em ordem, 0 erros. A 2560, a subir, o passo do teste saltou da 7 para o *pre* sem passar pela fenda (a faixa da fenda tem agora 0,12 tela); o site fecha a lâmina a partir de aberta.
- **typecheck, lint e build:** passam.
- **Por decidir:** a fenda à noite, com o candeeiro dentro dela (página de decisão).
- **Não verificado:**
  - scroll de dedo no Xiaomi depois desta ronda;
  - iPhone.
### Fim do dia 2/11: o passo 9 no Xiaomi e a decisão em aberto
- **Passo 9 no Xiaomi** (`phone9.mjs`, ecrã 392 × 779 com a barra do Chrome):
  - o ecrã do casamento a "ecrã inteiro" tem 360 × 779 px, com 17 px de noite de cada lado;
  - **causa:** os cartões do telemóvel têm a forma fixa 9 : 19,5 e o ecrã visível é mais baixo;
  - **correção aprovada com os cartões a 58 % (README #101):** os cartões passam a ter a forma do ecrã de quem vê. Por fazer.
- **Storyboard de avaliação da saída de Experiences** (quatro variantes, desktop e telemóvel, imagens do site): `docs/design/v5/storyboards/saida-experiences/`.
  - Testado no Chrome de testes a 1440 e 390: 0 erros, 0 overflow.
  - Corrigido antes de publicar: a janela não recortava porque a propriedade em Web Animations é `clipPath`, não `clip-path`.
### Passo 4: a saída de Experiences pela luz da hora, C2 (3/11, README #101, #102)

**O que mudou:** a fenda em dois passos saiu (fase `slit`, o desenho do guia, `measureDraw`, `.m-drawing`). Fases: `pre → 7 → 8a…11`, o 7 no
instante em que o palco fica preso. A luz é a mesma caixa de recorte (`.m-wipe`, `.m-wipe-b`, `.m-wipe-in`), agora juntada no lado da hora
(`data-light`: manhã → esquerda, dia → meio, fim de tarde e noite → direita) e aberta de uma vez (1,5 s, `cubic-bezier(.45,0,.3,1)`); de volta
recua para o mesmo lado (0,8 s). A fotografia do guia no Work: `scale(1.14)` a partir do transform do Work (animação normal; ver Xiaomi). Cartões: à espera no lugar
(opacidade 0,001) e cada um aparece quando a luz passou pelos quatro cantos; ao voltar, sai antes de o primeiro canto ficar descoberto.
Frase: duas linhas, cada uma quando a luz lhe chega; depois recua (0,86, opacidade 0,7); *Make it yours* `scale(1.4)` / `1.1`; cursor
`.m-caret` a piscar 8 × 530 ms e fixo (escondido com foco ou texto). Telemóvel: `--m-ar` = forma do ecrã (9:21 a 9:16), `F = min(W, H·ar)`;
baralho a 58 %, 8 a × 1,26 e mais abaixo; frase a `44px + 7vh`. Folha do 8 a repousar mais abaixo (desktop −24 %, telemóvel ao lado).

**Como:** `npm run typecheck`, `npm run lint`, `npm run build`, `next start -p 3100`; Chrome de testes (9444, 2.º monitor):
`D:\STUDIO-tools\v5-m6\passage.mjs` (passagem a tempo real, 8a, 9, recuo, nova passagem, fim apressado) e `modes.mjs` (movimento
reduzido, sem JS, teclado).

**Números:**
- typecheck, lint (0 avisos), build: passam.
- Overflow horizontal: 0 em 1920×1080, 1440×900, 768×1024, 390×844, 320×640 (−15 no desktop = barra de scroll).
- Sem erros de consola em nenhuma ronda.
- Fim apressado (descer logo para o 8a): `7@13–50 ms`, `8a@327–373 ms` nos 5 tamanhos (alvo 300 ms + o frame seguinte).
- 9 no telemóvel: 0,0 → 390×844 e 0,0 → 320×640 (ecrã inteiro); 768×1024: 96 → 672 (forma 9:16 centrada, como previsto).
- Recuo: fase `pre`, a fotografia do Work volta a `matrix(1,0,0,1,0,0)`, frase a 0; descer outra vez repete a passagem.
- Distâncias no 7: campo → cartões 53 px (390), 17 px (320), 82 px (1440), 88 px (1920); frase a 98 px do topo (390), 85 px (320).
- Contraste da frase a 0,7 (contra a cor do fundo de cada hora): manhã 4,2, dia 4,4, fim de tarde 3,1, noite 7,5 : 1 (texto grande, ≥ 3).
- Defeitos encontrados e corrigidos nesta ronda: cartões meio vistos sobre o escuro no recuo (tempo do recuo linear → curva real e cantos);
  a folha do 8 sobre a frase (telemóvel) e sobre o campo (desktop, 320, 768); o cursor sobre o "Y"; o campo invisível ~2 s quando
  alcançado pelo teclado (agora a passagem acaba logo).
- Movimento reduzido e sem JS: o Method parado como antes (frase, campo, seis/três ecrãs, capa, fim); o cursor não existe (0 px).
- Teclado: foco no campo desde cima → fase 7, campo visível, cursor escondido; "Ana" aparece nos templates.

**Xiaomi (392 × 779, Chrome; `phone-passage.mjs` e `phone2.mjs` em `D:\STUDIO-tools\v5-m6\`):**
- A fotografia do Work com `scale` **somado** (`composite: 'add'`) corria no fio principal: passagem a 73 fps e um primeiro frame de 376 ms
  (82–87 fps sem ela). Passou a uma animação normal a partir do transform do Work: **passagem 83–87 fps**, primeiro frame 77–166 ms.
- Ao voltar, a fotografia a encolher à vista custava ~20 fps (59–67); agora volta ao tamanho de uma vez, ainda debaixo da luz, e a animação
  só sai quando nada mexe: **recuo 77–82 fps** (frames isolados de 66–166 ms, também no início da passagem; ontem os picos de primeira vez
  eram 55–133 ms).
- **Dedo (gestos sintéticos, mesma sessão, luz `day`):**

  | | lento ↓ | normal ↓ | fling ↓ | lento ↑ | normal ↑ | fling ↑ |
  |---|---|---|---|---|---|---|
  | versão de ontem (fenda), medida hoje | 72 | 68 | 69 | 73 | 67 | 53 |
  | C2 (hoje), duas rondas | 80–81 | 77–78 | 69–72 | 68 | 58–59 | 33–38 |
  | C2 com os cartões do telemóvel de ontem (46 %, 9 : 19,5) | 80 | 78 | 68 | 69 | 62 | 44 |
  | C2 sem o avanço da fotografia | 80 | 77 | 70 | 69 | 58 | 39 |

  **A descer melhorou; a subir piorou**, sobretudo o fling rápido (53 → 33–38). Os frames lentos caem entre o 9 e o fim do Method
  (3000–5100 px dentro do Method), não na passagem. Os cartões maiores (#101: ~1,8 × os píxeis de cada cartão) explicam parte (fling ↑
  44 → 35); a fotografia não. O resto não se separou do ruído do aparelho. **Por decidir pelo owner, com o dedo** (CLAUDE.md: a
  performance pesa-se, não é bloqueio).

**Não verificado:** iPhone; leitor de ecrã; o fling para cima com o dedo do owner.

### Passo 4b: o cursor, o 9 com a barra do Chrome escondida, a cena mais longa no telemóvel (3/11, owner no Xiaomi)

**O que mudou:** (1) o cursor deixava de piscar quando um dedo ainda a fazer scroll apressava a passagem (o \`hurry\` cancelava-o): agora
recomeça os seus ~4 s quando o campo chega, e também quando o campo volta (do 9 para o 8); (2) o 9 tinha a altura do ecrã com a barra do
Chrome à vista (779 px) e deixava uma faixa do estúdio em baixo quando a barra se escondia (835 px): os cartões do telemóvel usam agora a
altura \`100lvh\` (lida de um elemento de prova) e o ecrã inteiro começa no topo; (3) a cena do Method no telemóvel passou de 4,7 para 6
ecrãs (secção \`7.5 × --screen\`, era 6,2): cada fase ~28 % mais scroll.

**Números (Xiaomi, \`phone-fix.mjs\`):** cursor a piscar depois de uma passagem apressada (8a), parado e visível aos 5 s; 9 com a barra
escondida: cartão 0,0 → 393 × 835 em 392 × 835 (\`lvh\` 835); cena: \`travel\` 5010 px (era ~3812). Chrome de testes: 1440, 390, 320 sem
erros nem overflow, 9 de ponta a ponta (390, 320), fim apressado 339–357 ms, recuo limpo. Dedo: ↓ 82 / 80 / 74, ↑ 72 / 60 / 38 fps
(o fling para cima continua por decidir).

**Não verificado:** iPhone (no Safari \`lvh\` é o ecrã com as barras recolhidas: o 9 passa por baixo da barra de baixo quando esta aparece).

### Passo 4c: o cursor a piscar de facto; o ritmo do Method no telemóvel (3/11, owner no Xiaomi)

**O cursor:** a animação \`[{opacity:1},{opacity:0}]\` com \`steps(1, end)\` e \`direction: 'alternate'\` nunca mostrava a metade apagada (o
degrau aplica-se ao progresso já invertido: na volta ficava aceso). O teste anterior só via a animação "a correr". Agora: fotogramas
explícitos (aceso 530 ms, apagado 530 ms, × 4, depois fixo). Xiaomi (\`phone-caret.mjs\`): opacidade amostrada a cada 100 ms após a
passagem — apagada a 3,3 s, 4,3–4,6, 5,3–5,7, 6,4–6,7 s, depois 1; capturas do ecrã inteiro com o traço visível e sem ele. O storyboard
principal tinha o mesmo erro (CSS \`alternate\` + \`steps\`): corrigido da mesma maneira.

**Todas as passagens, com o dedo, para a frente e para trás** (\`phone-sweep.mjs\`: traços de meio ecrã a 1100 px/s com pausas de 0,7 s,
gravação do ecrã, folhas de contacto por passagem com \`sheets.cjs\`): entrada → Weddings → Artists → Experiences → 7 → 8a → 8b → 8c → 9 → 10 →
11 → About, e de volta. Nenhum defeito visual nas duas direções (a luz de dia abre do meio e volta ao meio; a capa volta ao 9; os cartões
voltam ao baralho; Experiences regressa). Sem erros.

**Ritmo:** com a cena a 6 ecrãs, 8a → 8b → 8c ficavam a **0,57 ecrã** cada e um traço de dedo saltava duas fases. No telemóvel os passos ficaram
iguais (\`STARTS_PHONE\`, cena 6,2 ecrãs, secção \`7.7 × --screen\`): medido no Xiaomi, de fase em fase **0,84–0,92 ecrã**, nos dois sentidos;
do 7 ao 8a 1,58 (a passagem e o convite). Desktop sem alteração.

### Passo 4d: iPhone e Xiaomi do owner — o 9 no iOS, a ponte sem *During*, o scroll rápido (3/11, README #103)

**O que mudou:** o ecrã inteiro do 9 tem a altura do palco preso (\`stage.offsetHeight\`: Android \`100lvh\`, iOS \`100lvh + 130px\`); no iPhone
do owner \`100lvh\` deixava ~60 px de estúdio em baixo, sob a barra flutuante do Safari (gravação 12:34, quadros a 13,5 / 15,5 / 17 s). A
ponte do Work deixou de mudar o momento para *During*: segura o momento à vista (\`remaining\` como na pausa) e larga-o ao voltar.

**Números:** Xiaomi (\`phone-bridge.mjs\`): duas rondas a entrar no Method a partir de *Before* — \`m=0\` do princípio ao 7 (1,46–1,61 s), sem
salto; 9: cartão 0,0 → 393 × 835 com palco 835. Scroll rápido (\`phone-sweep.mjs\` 3000 px/s × 1 ecrã e 4000 px/s × 2 ecrãs, ida e volta):
todas as fases por ordem, sem erros; nos flings, sobreposições transitórias de duas fases (cada uma parte de onde a anterior estava), nada
fora do lugar no fim.

**Não verificado:** o 9 no iPhone depois da correção (o owner vê); o toque (por escolher).

### Passo 4e: o 9 no iOS (palavras), o 10 → 11 pelo centro, o cursor mais baixo (3/11, owner no iPhone)

- 9: \`.m-card.is-full .s-wed-tx { align-content: start }\` — a data fica logo por baixo do título (390 × 844: ~670 px, longe do fundo).
- 11 no telemóvel: a capa vai para \`[50, 44, 46]\` e apaga-se em 0,55 s (antes ia para o lugar do 8, ao lado, em 1,1 s). 390 × 844: aos 0,2 s
  só um vestígio claro da capa atrás da frase, aos 0,45 s nada; as letras nunca se cruzam.
- Cursor: \`0.85em\` (era 1,05): 17,9 px num campo de 29,6 (390), 39,4 px num de 63,4 (1440). O storyboard principal com o mesmo valor.
- typecheck, lint, build: passam; sem erros de consola.

**Não verificado:** o 9 no iPhone com a barra do Safari (o owner vê).

### Passo 4f: as bordas da página no Method (3/11, owner no iPhone, gravação 13:46)

**Defeito:** na passagem, uma faixa de ~80 px em baixo (sob a barra do Safari) em carvão #1f1d19 sobre a noite azul de Experiences
(#171b22), e no estúdio a área da ilha escura. Causa: \`paintEdges\` (entrance/sequence.ts) dava carvão a toda a secção \`method\`.
**Agora:** o Method escreve \`data-edge\` por fase e o script das bordas lê-o. Cores medidas no Chrome de testes (390 × 844, fila de cima
do ecrã, PNG lido pelo ffmpeg). Amostragem (\`edges.mjs\`, fim de tarde): Experiences e passagem até 1,4 s rgb(23,27,34); 1,7 s em diante
rgb(197,177,158); 9 rgb(161,178,187); 11 rgb(23,24,21); About rgb(30,29,26); de volta ao 7, ao 11 e a Experiences, as mesmas. Sem erros.

**Não verificado:** no iPhone (o owner vê); a cor da área da ilha muda de uma vez quando a luz acaba (1,5 s), não com a aresta.

### Passo 4g: o bloqueio no 7 e a cor da ilha em sincronia com a luz (3/11, owner no iPhone, gravação 14:11)

**Bloqueio:** a gravação mostra a cena no 7 enquanto o owner percorre o Method até ao About e volta. Causa: \`hurry()\` corria a cada evento
de scroll e punha \`passageEnds = agora + 300 ms\`; com eventos contínuos o fim nunca chegava (só se destrancava com 0,3 s sem scroll). Os
testes anteriores tinham pausas. **Reproduzido** com \`continuous.mjs\` (scroll a cada frame, sem pausas, da passagem até 75 % da cena):
versão antiga \`7@230ms … end 9\` (sem fases pelo meio); corrigida \`7 → 8a@2150 → 8b → 8c → 9\` (6 s), também a 3 s, 12 s e em 1440 × 900.
\`fuzz.mjs\` (30 sequências aleatórias à volta da passagem, Chrome; 25 com gestos de toque no Xiaomi): 0 erradas. \`batch\` liberta a fila
mesmo se uma fase falhar (\`try/finally\`).

**Cor da ilha** (\`sync.mjs\`: pixel do topo ao centro contra a cor de \`html\`, 390 × 844): a transição de 0,3 s centra-se na passagem da
aresta pelo centro do topo — ida: manhã 570–650 ms, dia 520–600, fim de tarde 760–850 (página 26 → 216/221/186, borda a meio); volta:
a borda ficava escura logo (a secção passa a \`work\` acima da marca do Method): agora segura a cor do Method até a aresta sair (manhã
447 ms, dia 487, fim de tarde 451, borda a meio da transição). Sequência completa (\`edges.mjs\`) igual à de 4f.

**Não verificado:** no iPhone (o owner vê).

### Passo 4h: o toque (README #104)

Chrome de testes, 390 × 844, toque emulado (\`chrome-press.mjs\`; \`phone-press.mjs\` para o Xiaomi, que estava a dormir): cor de toque do
browser \`rgba(0,0,0,0)\`; momento, nome do capítulo, botão do menu e link do menu, sob o dedo: \`scale 0.96\`, \`brightness(0.55)\`; em
repouso \`none none\` (a animação sai). Cada um continua a funcionar: o momento passa a \`aria-pressed=true\`, o menu abre, o link do menu
fecha-o e leva à secção. Sem erros. **Xiaomi** (toques reais, `phone-press.mjs`): os mesmos valores, os mesmos resultados, sem erros. **Não verificado:** no iPhone.

### Passo 4i: o Work parado durante a luz; o cursor no desktop (3/11, owner no desktop)

\`workmove.mjs\`: o palco do Work ficava preso só até 540 px depois do início da cena (1440 e 390), e depois subia — com a roda a continuar
durante a luz, Experiences subia sob a aresta. Agora (\`workhold.mjs\`, roda +900 px em 0,5 s após o gatilho): topo do palco 0 até ~1,55 s,
depois −380 (1440) / −413 (390), já debaixo da luz; altura da página igual antes e depois (13133 / 12707); de volta acima da cena, o palco
no lugar (0) e a fase \`pre\`. Sem erros. Cursor no desktop: 26,9 px num campo de 63,4 (era 39,4).
**Não verificado:** no iPhone (o palco do Work lá tem −70 px de topo; a cópia do lugar lê o retângulo real, por isso deve ficar igual).

### Passo 4j: o campo Make it yours recomposto (3/11, owner)

\`head.mjs\` (cinco tamanhos, dpr 2, cursor aceso, recortes): antes, a 1440 o nome tinha 46 px (33 × 1,4) contra 21 px da etiqueta e o cursor
começava acima da linha de base. Agora: 1920 etiqueta 14 / nome 32 px; 1440 12,2 / 27,4; 768, 390, 320 10,9 / 19,2; mesma linha de base;
cursor 0,78 em a começar logo abaixo da linha de base. Xiaomi (\`phone-head.mjs\`, noite): composição e um nome escrito ("Annabelle")
dentro do sublinhado. Sem erros. **Não verificado:** iPhone.
- Meio-termo no desktop (owner, 3/11): 1920 etiqueta 15,2 / nome 36,8 px; 1440 13,2 / 31,7 px; telemóvel sem alteração (10,9 / 19,2). Cursor e
  sublinhado acompanham (em); mesma linha de base. Sem erros.

### Passo 4k: refresh no 8 (iOS), o 8a no desktop, idas e voltas rápidas no Xiaomi (3/11, owner)

- **Refresh no 8** (\`refresh8.mjs\`, 390 × 760, palco 890 como no iOS por \`--screen: 100lvh + 130px\`): depois do refresh em 8a, campo 216 /
  cartões 254 (38 px livres); o 9 de 0 a 890. Sem o palco alto: igual. Antes, no iPhone do owner, os cartões subiam sobre o campo.
- **Desktop 8a a 0,6 ecrã:** \`fuzz.mjs\` 1440 × 900, 25 sequências: 0 erradas; \`continuous.mjs\`: 7 → 8a → 8b → 8c → 9 → 10.
- **Idas e voltas rápidas sobre a costura Work ↔ Method** (\`phone-rapid.mjs\`, Xiaomi, 8 idas e voltas de 650 px a 2600 px/s): antes 58,2 fps,
  58 frames > 40 ms; sem a transição de cor das bordas 67,5 / 41; sem ela e sem o avanço da fotografia 68,7 / 36. Agora (transição só no iOS,
  medidas escritas só quando mudam, Work preso por CSS em vez de script): **66,9 e 68,1 fps, 45 e 43 frames > 40 ms**; o maior (190–220 ms)
  é a primeira passagem. Frames de 50–110 ms ainda nos recuos.
- **Work preso por CSS:** último passo 4 ecrãs, secção 7,9, Method sobre os últimos 3,1. \`workhold.mjs\`: topo do palco 0 durante toda a
  passagem com a roda a continuar (1440 e 390); altura da página igual à de antes (13133 / 12707); no Xiaomi os estados começam onde
  começavam (Experiences 2940, 7 a 4471 px).
- **8a no desktop reposto a 1,15 ecrãs** (owner, 3/11: a 0,6 não ficou bem).

### Passo 4l: cartões do telemóvel 9 : 16, o baralho junto ao campo (3/11, owner)

\`seven.mjs\` (palco como no iOS, 402 × 700, 390 × 844, 320 × 640): cartão do 7 226 × 402 (era 226 × 489 a 390); topo do baralho 16–19 px
abaixo do campo nos três (era 33–60); 8a sem tocar no campo (17–30 px); \`refresh8.mjs\`: depois do refresh em 8a, 30 px livres; o 9 de 0 a
890 (palco) e de 0 a 760. Sem erros. **Não verificado:** iPhone.

### Passo 4m: desfeito o 9 : 16; os cartões originais com a salvaguarda do campo (3/11, owner no iPhone: "curtos, prefiro os originais")

Cartões de novo na forma do palco e o baralho a 64–66 %; só descem se esse lugar os puser sobre o campo (topo do baralho 30 px abaixo do
campo, primeiro cartão do 8 34 px). `refresh8.mjs` com o palco como no iOS, refresh em 8a a 402 × 640 / 700 / 790: cartões 26 / 25 / 26 px
abaixo do campo; o 9 enche o palco (770 / 830 / 920). Xiaomi: 9 de 0 a 835. Sem erros. **Não verificado:** iPhone.

### Passo 4n: o baralho do telemóvel a 55 % (3/11, owner)

Lado a lado 58 / 55 / 52 (`sizes.mjs`, Android 392 × 779 e iOS-like 402 × 760): escolhido 55. Depois: `seven.mjs` cartão 214 × 536 (390),
221 × 457 (402 × 700), 176 × 423 (320); topo 17–37 px abaixo do campo; `refresh8.mjs` 25 px depois do refresh em 8a; o 9 de 0 a 835 no
Xiaomi; 10 → 11 sem erros. **Não verificado:** iPhone.

### Validação final do M6 antes do commit (3/11, noite)

typecheck, lint (0 avisos), build: passam. \`npm run images -- --only=studio\`: escreve as 8 máscaras da luz, idênticas às de antes (SHA-1).
\`modes.mjs\` (1440, 390): movimento reduzido e sem JS sem overflow e sem cursor; teclado → 7, campo visível, "Ana" nos templates.
\`passage.mjs\` 1920 × 1080 dia, 768 × 1024 noite, 320 × 640 fim de tarde: sem overflow, fim apressado 342–346 ms, sem erros.
**Não verificado no conjunto final:** iPhone (o owner viu as rondas anteriores), leitor de ecrã, rede lenta, tablet real.

---

## M7a — About (estados 12–14), sessão na nuvem, 4/11 — branch `v5-cloud-about`, por validar pelo owner

**O que foi construído** (`src/components/about/`: `about.tsx`, `about.css`, `about-stage.ts`, `portrait.ts`, `about-client.tsx`;
`page.tsx`, `globals.css`): o estado 14 em HTML (sem JS e com movimento reduzido lê-se assim); com JS e movimento, a secção fica
1,3 ecrãs por cima do fim do Method, presa e invisível, e a passagem corre quando o topo do About chega ao topo do ecrã (0,3 ecrã antes de o
Method largar o 11): 12 a 0, 13 a 0,5, 14 a 0,95 ecrãs, banda morta 0,025, solta-se a 1,3. Fonte: storyboard About v5 (B) e o painel
"About em movimento" do storyboard principal (com as afinações de 4/11). A saída 11 → 12 segue a proposta da README #65 (Talk to us,
passos, frase por último), que no README ainda está marcada "a aprovar".

**Ambiente:** contentor na nuvem, Chromium headless do Playwright (render por CPU), `next start -p 3100`. **Sem as fotografias:**
`media-src/` e `public/media/v5/` não estão no Git; para testar foi feito um **retrato substituto sintético** (`media-src/about/portrait-124.jpg`,
um desenho com o texto "TEST STAND-IN — NOT THE PORTRAIT", não commitado) e corrido `npm run images -- --only=portrait` (saturação 0,427,
cor + P&B derivado + as duas auras). As outras imagens do site deram 404 nestes testes (filtradas na contagem de erros).

**Testado (scripts no scratchpad da sessão, não guardados no repositório: `walk.cjs`, `wheel.cjs`, `back.cjs`, `gest.cjs`, `centre.cjs`,
`modes.cjs`, `perf*.cjs`):**
- `typecheck`, `lint` (0 avisos), `build`: bem.
- **Cinco tamanhos** (1920×1080, 1440×900, 768×1024, 390×844, 320×640): fases 12 → 13 → 14 → (volta) 12 → pre corretas em todos; 0 px de
  scroll horizontal; 0 erros de consola (além dos 404 das imagens ausentes). Nome a 12 centrado sob o retrato em todos (medido: centro do
  nome = centro do retrato ± 0 px); no telemóvel o nome a 54,5 % (460 px em 844).
- **Roda do rato, passo a passo (1440×900):** o Method está no 11 antes do gatilho; 12 cobre-o; ao voltar, o 11 reaparece com as palavras
  (opacidade 1, sem animações deixadas). Dois defeitos encontrados e corrigidos: (1) a zona por baixo do palco invisível ficava por
  pintar → o palco antes do 12 é recortado (`clip-path`), não `opacity: 0`; (2) um fio vertical nas arestas do retrato no 12 → o escuro
  passa 2 px para fora da fotografia.
- **Gestos:** rato parado onde o retrato chega no 13 → fica P&B (antes ficava a cores: o Chrome dá um `pointerenter` sem movimento;
  agora só um rato que se mexe); hover → cor, sair → P&B; toque e segurar (CDP) → cor, largar → P&B; arrastar a começar no retrato →
  P&B. Teclado: Tab a partir do *Talk to us* do Method chega ao retrato e leva ao 14 (antes saltava o About inteiro, com `visibility`);
  Enter → `aria-pressed="true"`; Tab seguinte → *04 Questions ↓* e a cor volta ao P&B. O retrato é um `role="button"` com o nome do alt.
- **Movimento reduzido e sem JavaScript** (contra `next start`; 1440, 390, 320): o 14 em fluxo depois do Method, sem sobreposição, tudo
  visível; a 320×640 a secção tem 648 px.
- **Contraste** (linho sobre o fundo): crédito a 0,6 → 5,8 : 1 na sala, 4,7 : 1 sobre uma aura cinza média; *04 Questions* e a etiqueta a
  0,7 → 7,5 : 1; parágrafo 0,82 → 9,8 : 1. **A refazer com o retrato real** (a aura dele é outra).
- **Desempenho, indicativo apenas** (headless, render por CPU, CPU × 4): 11 → 12 a partir do 11 assente 149 frames, 7 > 25 ms; 12 → 13 156
  frames, 1 > 25 ms; telemóvel 390: 1–2 > 25 ms por passagem. No mesmo ambiente o próprio 10 → 11 do Method dá 37 > 25 ms em 98: o custo
  está no que o Method desenha por baixo (bisseção: sem o palco do Method 9–16 lentos; sem o *spot*, a aura, o retrato ou o nome, igual).

**Riscos de desempenho a medir no Xiaomi** (README #68): o *spot* do 12 (camada de 2 × o retrato, `scale` até ~3 no desktop); o
recorte por `clip-path` estático do palco antes do 12 (não animado); as duas auras esticadas com máscara (como no Work); as duas fotografias
do retrato carregadas (P&B e cor, ~2 pedidos).

**Não verificado:** Xiaomi (sem acesso daqui), iPhone/Safari (as bordas da página no About ficam no carvão `#1e1d1a` pelo `sequence.ts`,
a sala é `#171816`/`#1b1c1a`; não mexi na entrada), o retrato real (enquadramento `object-position: 50% 30%` nos dois formatos, a aura,
o brilho por trás das ilhas da barra), leitor de ecrã, rede lenta, tablet real.

### Passo 2: o que o owner viu (4/11) — a passagem rápida, a página a mexer, a luz às camadas

**Owner, no PC:** (1) *Made once, for one moment* → *I'm Flávio.* "super rápido, não há sensação de transformação"; (2) na fase da foto a
página mexia para cima e para baixo; (3) a foto redonda → o *I'm Flávio* completo: "a luz aparece baratada e bugada, cheia de camadas, com
má resolução".

**Causas:** (1) a passagem corria sobre as palavras do próprio Method, que larga o 11 0,3 ecrã depois do gatilho, por isso era apressada (0,3 s)
logo aos 0,18 ecrã de scroll — qualquer gesto normal; (2) acima do gatilho havia uma banda morta em que a fase continuava no 12 mas o palco
já não estava preso e descia com a página; (3) a luz era uma camada escura com um furo, do dobro do retrato, escalada até ×3: desenhada pelo
Chrome em baixa resolução, com faixas nos tons escuros, e o seu retângulo via-se sobre a sala a acender.

**Corrigido:**
- **Uma cópia do 11** (`about-stage.ts`, `copy()`: o `.m-stage` do Method clonado, inerte, com as regras do Method; o que ainda se mexia é
  copiado onde se vê): a passagem corre inteira, ~3 s, ao seu ritmo, faça o scroll o que fizer. Só as palavras e os ecrãs da cópia ficam à
  vista; a sala é a do About (o mesmo escuro, a mesma luz), por isso o retrato aparece por baixo das palavras enquanto elas saem (antes, a
  1,4 s, a sala ficava vazia). 13 espera pelo fim do 12; só é apressado a 0,25 ecrã de o palco se soltar. Nenhum ficheiro do Method mudou.
- **Ritmo:** 12 no gatilho, 13 a 1,0 ecrã, 14 a 1,7, solto a 2,3 (era 0,5 / 0,95 / 1,3): um gesto do dedo (~0,8 ecrã) nunca atravessa duas fases.
- **Palco preso antes do gatilho** (0,3 ecrã; a secção sobre os últimos 1,6 ecrãs do Method, 3,6 de altura; marca da barra `.a-start`).
- **A luz, sem camada escura:** a luz do 11 (o mesmo gradiente do `.m-dark`, numa camada do seu tamanho) desliza da frase até ao retrato e
  junta-se nele, só a encolher (nunca desenhada acima da sua resolução); o retrato desvanece para as arestas num círculo (a máscara do
  storyboard, fixa); no 13 **o círculo abre-se** escalando `.a-open` enquanto `.a-img` escala o inverso em cada instante (24 keyframes da
  mesma curva), por isso a fotografia fica parada e só a luz cresce — **em oval na proporção da fotografia**, para os quatro lados ficarem
  nítidos juntos (aberto por igual, os lados endureciam muito antes do topo: um "tubo" de luz). Aberto, a máscara e as escalas saem.

**Medido** (Chromium headless, `next start`):
- Filmagem 1440 × 900 e 390 × 844 (0,5–3,2 s do 12, 0,25–2,6 s do 13), gatilho por um gesto normal (0,75 ecrã) que continua: a passagem
  corre inteira; a 1 s a frase ainda sai e o retrato já aparece; sem retângulos nem faixas no 13 (visto a tamanho real).
- Palco parado: cinco scrolls de −0,35 a +0,25 ecrã à volta do gatilho → topo do palco 0 px em todos (1440 e 390).
- Costura 11 → 12, primeiro frame contra o 11 (chegada pela roda, Method assente): 1440 diferença máxima 3 níveis; 1920 317 canais > 8 (os
  números vivos dos ecrãs); 390 máximo 13. Corrigido pelo caminho: os passos repousam a 0,75 e saíam de 1 (um frame mais claros).
- Regressão: 5 tamanhos (fases, 0 overflow, 0 erros), gestos e teclado, movimento reduzido e sem JS: como no passo 1.
- Desempenho indicativo (CPU × 4): 11 → 12 1440 185 frames, 8 > 25 ms, um de ~100 ms no gatilho (provavelmente a cópia feita nesse frame:
  se o Xiaomi o mostrar, fazê-la durante os 0,3 ecrã presos antes); 12 → 13 150 frames, 5 > 25 ms; 390: 3 e 1.

**Por ver pelo owner:** se o ritmo (≈3 s, 1,0 / 1,7 ecrãs) e a luz a abrir em oval são o que esperava; Xiaomi e iPhone.

### Passo 3: o risco no hover do 12 e as camadas da luz no 13 (4/11, owner no PC)

**Owner:** (1) em hover no 12 via-se um risco à direita, "que na verdade é a imagem a revelar-se"; (2) "o efeito de luz no momento 13 tá
fraco, consigo ver claramente camadas".

**Causas:** (1) o retrato tem 33 --u de largura (475,2 px a 1440, fracionário); enquanto a cor aparece o Chrome desenha-a numa camada sua
por baixo da máscara circular, a máscara arredonda os limites para baixo e a última coluna da fotografia escapa-lhe: uma linha clara na
aresta direita, só durante a revelação. Não reproduzível aqui (composição por CPU), causa deduzida da geometria. (2) Duas coisas: a
atmosfera era a aura de 48 px do Work esticada mais de 30× (o browser desenha-a em facetas), e os gradientes escuros (a luz, a máscara da
aura) são desenhados sem dithering — degraus de um nível em centenas de píxeis, que se veem como anéis. Medido: a ×4–×5 de contraste os
anéis eram claros na luz do 12 e na borda da aura do 13.

**Corrigido:**
- `.a-open` (o elemento com a máscara) passa 2 px para fora do recorte da fotografia: a coluna que escapa à máscara fica fora do recorte.
- `npm run images` escreve também `portrait-aura-lg.jpg` e `portrait-mono-aura-lg.jpg` (192 × 288, desfoque 16, JPEG 82, ~2,5 KB), opção
  `auraLarge`; o About usa-as. A aura de 48 px do Work não muda. **No PC: `npm run images -- --only=portrait`** (ficheiros novos, sem `--force`).
- **O grão da sala** (`.a-grain`): o do storyboard (overlay a 0,1) foi medido aqui a ±0,05 de nível no escuro — o overlay escala com o escuro,
  não fazia nada. Passou a ser um dithering: ruído claro (um mosaico SVG `feTurbulence`, desenhado uma vez) com alpha muito baixo, em
  mistura normal (sem `mix-blend-mode`), por cima da sala e da luz, por baixo do retrato e das palavras. Medido: ruído de alta frequência
  ±1,3–1,5 níveis na sala (era 0–0,3); a ×4 os anéis desfazem-se; a tamanho real não se vê textura.
- O grão soma +2,2 níveis em média no escuro: as cores de fundo do About descem 2 (`#151614`, `#191a18`), para se ver o aprovado
  (`#171816`, `#1b1c1a`). Costura 11 → 12 medida (chegada pela roda): escuro 23,0 → 23,2, luz 76,6 → 76,1 (1440); 70,1 → 70,1 (390).

**Regressão:** 5 tamanhos (fases, 0 overflow, 0 erros), gestos (rato parado, hover, segurar, arrastar), teclado, movimento reduzido e
sem JS: como antes. Indicativo, CPU × 4: 11 → 12 1440 192 frames, 5 > 25 ms (máx. 50); 12 → 13 153, 2; 390: 3 e 1.

**Por ver pelo owner:** o risco do hover no 12 no PC (não reproduzível aqui); a luz do 13 com o retrato real; o grão no Xiaomi (custo: uma
camada de ecrã inteiro em mistura normal, estática).

### Passo 4: os riscos no 12 com o hover — reproduzidos com composição por GPU (4/11, owner no PC)

**Owner:** "na transição 12 ainda consigo ver riscos na imagem, especialmente se fizer hover com o rato" (depois do passo 3).

**Reproduzido:** os testes anteriores eram com composição por CPU e a 100 %, onde o defeito não aparece. Com `--use-angle=swiftshader
--enable-gpu-rasterization` (composição por GPU) e escalas de portátil Windows (100 / 125 / 150 %), `lines.cjs`/`lines3.cjs` procuram
colunas e linhas retas da altura (ou largura) do retrato: **a 100 %, no primeiro frame do hover, uma linha clara de altura inteira nas
colunas 956–958** (a aresta direita, em 957,49 px). Com a cor sempre numa camada própria (`will-change`) a linha ficava **permanente** —
a causa é a cor como camada da GPU debaixo da máscara: o recorte (`overflow: hidden` do retrato) arredondado para fora e a superfície da
máscara para dentro, a tira entre os dois desenhada sem máscara. A margem de 2 px do passo 3 não chegava; píxeis CSS inteiros resolviam a
100 e a 150 %, não a 125 % (483 px CSS = 603,75 px de ecrã).

**Corrigido:**
- Sem recorte à volta da fotografia mascarada (com movimento): a máscara já é transparente nas arestas e, enquanto a luz abre, a escala
  inversa mantém a fotografia do seu tamanho. A margem de 2 px saiu. Verificado: sem linhas a 100 / 125 / 150 / 200 % e a 2,75 (telemóvel),
  também com a cor sempre em camada própria, em 9 instantes do 11 → 12 com a cor a entrar.
- O retrato em píxeis inteiros (`round()` no CSS; o movimento até ao centro do 12 calculado da posição exata para acabar num píxel inteiro).
- Sem recorte, a camada escalada para abrir a luz (até ×2,5 × 3,8) apanhava o rato por cima de meio ecrã e das palavras, e a cor não
  voltava ao P&B ao sair (encontrado na regressão): `.a-open` sem eventos, as fotografias com eles (a barra lê o brilho da imagem por baixo
  das ilhas: medido 0,43 sobre o céu do retrato no telemóvel). E o fim da abertura reescrevia as escalas por cima do estado aberto: agora o
  estado aberto cancela a animação antes de se aplicar.
- **A abertura da luz:** primeiro estica ao longo do lado comprido até à oval inscrita na fotografia (os lados curtos ainda suaves), depois
  abre-se por igual até aos cantos — as quatro arestas chegam juntas. Antes, o círculo do 12, que já toca nos lados, endurecia-os primeiro
  (lados retos sob um topo redondo, GPU a 125 %).

**Regressão:** 5 tamanhos, gestos (rato parado, hover, sair, segurar, arrastar), teclado, movimento reduzido, sem JS, costura com o 11
(±0,5 nível): bem. Indicativo, CPU × 4: 11 → 12 194 frames, 3 > 25 ms; 12 → 13 156, 1 (1440 e 390).

**Ferramenta para o PC:** os mesmos scripts correm contra o Chrome real com GPU; o que aqui é SwiftShader é uma aproximação da GPU.

### Passo 5: a cor da sala no hover estava ao contrário do storyboard (4/11, owner)

**Owner:** "a cor da luz no hover na posição 13 — storyboard não está na ordem inversa no site?"

**Medido** contra as atmosferas do próprio storyboard (artifact principal, `img/a-124-mono.jpg` e `img/a-124.jpg`), e as que o
`images.mjs` fazia do mesmo retrato (`img/p124.jpg`, 640 px, usado a partir daqui como mestre local de teste, fora do Git):

| | repouso (P&B) | hover (cor) |
|---|---|---|
| storyboard | cinzento, saturação 0,000, média 71 | saturação 0,361, média 80 |
| site, antes | sépia, **0,423**, média 144 | **0,269**, média 131 |
| site, agora | cinzento, 0,000, média 78 | 0,356, média 78 |

Causa: a aura P&B levava o tom quente `#b8936a` — aceite para as fotografias P&B do **Work** (README #75, 3: ponto de partida), não para o
About, cujo storyboard tem um cinzento; com ele a sala tinha mais cor em repouso do que com a cor, e o hover parecia tirá-la. E as auras do
site eram ~2 × mais claras do que as do storyboard.

**Corrigido (só as auras grandes do About, `auraLarge`; as do Work não mudam):** a P&B sem o tom quente (só o tom leve do próprio P&B), as
duas a 0,6 da luz da fotografia, a de cor com a saturação reposta (× 1,35: o desfoque maior mistura mais as cores). Visto no site com o
retrato real (1440 e 390): em repouso a sala é cinzenta à volta do retrato P&B; no hover ganha os azuis do céu e os verdes e castanhos
da encosta, com o retrato.

**No PC:** as `-aura-lg.jpg` já existem do passo 3 — **`npm run images -- --only=portrait --force`**.

### Passo 6: a sala do 13 sem anéis (imagem acabada); no telemóvel o retrato nasce na frase (4/11, owner)

**Owner:** (1) "a luz de fundo na 13 · A sala acende-se nota-se muito camadas, má qualidade, principalmente desktop"; (2) "em mobile a
transição 11 para 12 a foto devia nascer mais centrada com o texto Made once … não ficou aplicado".

**(1) Causa:** a sala era montada pelo browser — uma aura JPEG de 8 bits, esticada, debaixo de uma máscara CSS e de uma opacidade, sobre o
fundo: quatro arredondamentos, e a queda lenta e escura voltava a ter anéis mesmo com o grão (×3 de contraste, 1440, retrato real).
Como no Method (`spill-mask.mjs`): uma queda só fica lisa se o ficheiro tiver o valor final. **Corrigido:** `scripts/about-room.mjs`
(chamado pelo `npm run images`, fonte `room`) faz a sala inteira — a aura desfocada a 16 bits, a máscara e a opacidade do storyboard em
vírgula flutuante sobre o fundo, um só arredondamento — em PNG sem perdas: `about/room-{mono,col}-{wide,tall}.png` (1280 × 800 e
600 × 1300; 110 / 155 KB e 87 / 122 KB; o de cor só é preciso no gesto). A página só os estica ao ecrã (a mesma geometria, a qualquer forma
de ecrã); o grão continua por cima. As auras grandes do passo 3 (`-aura-lg.jpg`) saíram. Verificado: o PNG sem anéis a ×3; no site a ×3
os anéis do lado direito desapareceram (fica o grão e a forma da própria aura). Cores como no passo 5 (P&B cinzenta, cor do storyboard).
**Custo:** ~110 KB a mais no desktop (~87 KB no telemóvel) quando o About se aproxima, e outro tanto a cores; antes ~2,5 KB.

**(2) Medido:** a geometria seguia o storyboard de 4/11 (retrato do 12 com o centro a 33 %, frase do Method a 35 % / centro 40,8 %), mas o
retrato nascia 8 % acima da frase e 11 % acima da luz. **Corrigido:** no telemóvel o retrato do 12 centra-se na frase do 11 medida em cada
ecrã, e o nome fica por baixo à distância do storyboard (21,5 %). Medido: centro do retrato = centro da frase a 390 × 844 (40,8 %),
392 × 851 (40,8 %), 320 × 640 (37,8 %), 768 × 1024 (42,1 %); filmado: a 1 s o retrato aparece onde a frase está a sair. O desktop não muda
(o retrato tem 80 % da altura).

**Regressão:** 5 tamanhos, gestos, teclado, movimento reduzido, sem JS, costura com o 11 (±0,5 nível), linhas com GPU (100 % e 2,75): bem;
ilha da barra sobre o céu do retrato 0,47. Indicativo, CPU × 4: 11 → 12 192 frames, 3 > 25 ms (um de ~100 ms no gatilho, a cópia do 11 — já
registado); 12 → 13 155, 2.

**No PC:** `npm run images -- --only=portrait` escreve os quatro `room-*.png` (ficheiros novos); `portrait-aura-lg.jpg` e
`portrait-mono-aura-lg.jpg` já não são usados e podem ser apagados de `public/media/v5/about/`.

### Passo 7: o scroll do início ao About e de volta; a navegação pelo menu até ao About (4/11, pedido do owner)

**Como:** Chromium headless, `next start`, retrato real como mestre local. `roundtrip.cjs`: do topo ao fim do About e de volta, a passo de
visitante (roda no desktop, `scrollBy` no telemóvel), a cada meio ecrã a página assenta 3,2 s e guarda-se o estado (secção da barra,
capítulo do Work, fase do Method e do About, palco do About visível) e uma imagem pequena; a ida e a volta comparam-se no mesmo ponto; depois
uma passagem rápida (saltos de 2 ecrãs) comparada com a lenta. `menu.cjs`: de quatro sítios (topo, Work, Method no 9, About no 14) abrir o
menu e escolher 01 Work, 02 Method, 03 About — onde aterra, o que se vê a 0,4 s e a 3,5 s, a barra, o menu fechado — e ainda o nome da barra
(→ topo), recuar e avançar no browser, o índice do colofão, *04 Questions ↓*, e chegar com `/#method` e `/#about`. 1440 × 900 e 390 × 844.

**Scroll ida e volta:** 27 (desktop) e 30 (telemóvel) pontos e a passagem rápida, sem erros de consola. Onde a ida e a volta diferem é sempre
dentro de uma banda morta (desenho, não defeito): a margem de 12 % entre capítulos do Work (README #90) e a banda de 2,5 % entre fases do
Method (verificado ponto a ponto contra os inícios das fases). O About igual nos dois sentidos e na passagem rápida em todos os pontos.
Um ponto do Method (y 6750, 8b/8c) era do teste: a roda do Chrome é animada e o teste parava antes do ponto; corrigido o teste.

**Menu — encontrado e corrigido:**
1. **02 Method** aterrava no topo da secção (y 4320 a 1440), que ainda é o Experiences do Work, com *01 Work* na barra; **03 About** no topo
   da sua (y 8460), que ainda é o 11 do Method, com *02 Method*. O Method e o About começam por cima do fim da secção anterior. Agora
   (`src/lib/address.ts`, chamado pela barra) o endereço aterra onde a secção começa de facto a ver-se — a marca `data-starts` que a barra já
   lê — de uma vez: o menu, o índice, recuar/avançar e um endereço com que se chega. Medido: 02 Method → y 4771 (o 7 a correr, *02 Method*);
   03 About → y 8731 (o 12, *03 About*); igual no telemóvel (4474 / 9454). Com movimento reduzido ou sem JS as marcas não se mostram e fica o
   salto do browser (as secções não se sobrepõem).
2. Chegado ao About por um salto, o 12 copiava o "11" do Method, que nunca tinha sido visto (do 9 apanhava os ecrãs a meio do voo: um cartão
   fantasma no centro). Agora, num salto (o endereço marca `data-jump` em `<html>`; o About lê também um salto grande entre frames) a passagem
   começa do quarto escuro e da sua luz, sem cópia; a descer pelo scroll a cópia continua (costura medida igual: ±0,5 nível).
3. A volta do About (14 → 11) ficava presa sobre o ecrã 2 s mesmo quando o scroll a levava para longe (o scroll suave do Work até a um
   capítulo; um fling): agora solta-se logo que a secção passa um ecrã acima.
4. Saltos que passam ou deixam o About põem-no no lugar de uma vez (só a chegada ao 12 corre a passagem).

**Resultado (os dois tamanhos):** as 12 combinações origem → destino, o nome → topo, recuar → About, avançar → Method, o índice → About,
*04 Questions ↓* → Questions (14, a barra *04 Questions*), `/#method` e `/#about` — todos no sítio certo, a barra certa, o menu fechado, 0 erros.
O 01 Work usa o scroll suave do próprio Work (não mudou): pelo caminho atravessa o Method e o About; aterra certo.

**Não verificado:** iPhone (o recuo e o avanço do Safari, a barra do Safari), Xiaomi com o dedo; a gota do menu aparece por cima nos
primeiros 0,4 s de cada navegação (é o fecho do próprio menu, M4).

### Passo 8: no iPhone, o Method a passar atrás da ilha no 12 → 13 (4/11, owner)

**Owner, iPhone:** do 12 para o 13 via-se na faixa da ilha dinâmica a secção anterior a correr, com texto.

**Causa:** com scroll, o Safari mostra atrás da ilha a página que está logo acima do ecrã (teste de riscas de 1/11, README #86). O palco do
About ficava preso no topo exato do ecrã; acima dele a secção é transparente (sobrepõe-se ao fim do Method) e passava por baixo o Method.
**Corrigido, só no iOS e no telemóvel** (como o palco do Work): o palco sobe 70 px acima do ecrã (`--a-lift`), com a sala do About nesses 70
px; o resto fica no mesmo sítio (padding). Num iPad (layout de desktop, sem ilha) não se aplica.

**Medido com a regra forçada no Chromium** (não corresponde a `-webkit-touch-callout`): 402 × 874 e 390 × 844, 12 / 13 / 14 — o ecrã igual a
sem ela (máx. 9–11 níveis, 0 canais > 12: o grão), palco a −70 px, sala a −70 px, conteúdo a 0; costura com o 11 igual (luz 70,1 → 70,1).
A fotografia a continuar por trás da ilha foi experimentada e retirada: esticada 70 px mudava o enquadramento do retrato (só há 59 px de
fotografia acima, a 402 × 874) — fica para a decisão do ecrã inteiro no site todo.

**Sobre o ecrã inteiro (resposta ao owner):** no primeiro ecrã, parado no topo, a faixa da ilha é do Safari e pinta uma cor lida da página
(medido a 1/11, também com `viewport-fit=cover`): o vídeo da entrada não pode ir para trás dela. Com scroll, a ilha mostra a página logo acima
do ecrã: cada cena presa pode lá pôr a sua imagem em vez de uma cor. Proposta, por decidir: só a entrada parada com cor; o resto com a
imagem de cada cena (mexe na Entrada, no Work e no Method). **Não verificado:** tudo no iPhone.

### Passo 9: iPhone do owner — o Method desfeito; o retrato no 13 (4/11)

**Owner, iPhone:** (1) o Method a tremer; (2) a faixa da ilha no Method com outra cor; (3) no 9 do Method a cor da ilha programada, a chegar
antes da imagem; (4) no 13 do About a ilha com uma cor de fundo, não a imagem; (5) no 13 a fotografia mal enquadrada, só o cimo do corpo.

**(1)(2) Desfeito** (`08d0d81`, revert de `a0f2eec`): o Method desenhava a sua faixa acima de um palco preso com `clip-path` e a secção
cortada com `overflow-x: clip` — o que o Safari nunca tinha mostrado fazer bem (o teste de riscas de 1/11 só provou o fluxo normal e o palco do
Work, que sobe como caixa). O Method volta ao estado aprovado no iPhone. **A refazer à maneira do Work** (o palco sobe 70 px, o conteúdo
desce 70 px dentro dele), o que resolve também (3) — o 9 levaria a própria página em destaque para trás da ilha. Por fazer, a decidir.

**(4)(5) Corrigido no About, só iOS e telemóvel:** o retrato mede 48 % da altura do ecrã durante o scroll (`lvh`), não do ecrã pequeno
(`svh`, com as barras do Safari, bem mais baixo no iPhone do que em qualquer outro aparelho); a fotografia estende-se 70 px para cima,
pendurada do seu topo (`object-position: 50% 0`): a ilha mostra as primeiras linhas da fotografia (o céu), e o ecrã mostra-a daí para baixo
(402 × 874: linhas 70–490 de 602, contra 59–464 nos outros). No 12 fica por baixo da máscara da luz.

**Medido com a regra forçada (402 × 874):** 12 / 13 / 14 nas fases certas; palco a −70, fotografia a −70 no 13 e no 14, retrato e nome nos
mesmos píxeis; com o palco baixado 70 px (para ver a faixa) o céu da fotografia continua para cima no 13 e no 14, e no 12 fica a sala
escura (a máscara). **Não reproduzível aqui:** a diferença entre `svh` e `lvh` (o Chromium emulado não tem as barras do Safari) — só o
iPhone mostra o enquadramento novo.

---

## O Method em ecrã inteiro no iPhone, à maneira do Work (4/11, owner)

**Pedido do owner:** no iPhone o Method como se o ecrã fosse inteiro, a ilha por cima do site: a luz do 7 enche o ecrã todo; os cartões a sair
para cima passam por trás da ilha; o 9 estica no comprimento do ecrã todo, a sua imagem atrás da ilha, sem uma cor a replicar; nenhuma cor
programada no Method. Sem mudar o ecrã visível. (A primeira tentativa, `a0f2eec`, desenhava acima de um palco preso com `clip-path` e
fazia tremer o Method no iPhone; desfeita em `08d0d81`.)

**Feito (só iOS, telemóvel, com movimento — `method.css`, `method-stage.ts`):** como o palco do Work: o palco começa 70 px acima do ecrã e é
70 px mais alto (`top`/`margin-top` −70, `--m-lift`); o que se vê desce 70 px dentro dele (`translate` independente na cabeça e nos cartões,
o 11 a partir dos 70 px) — no ecrã fica onde estava; o chão do Work, a luz e o transbordo da luz enchem o palco todo, as três caixas da luz a
rodar à volta do topo do ecrã como antes; o estúdio no seu lugar e, por cima, o seu próprio reflexo (`-webkit-box-reflect`, só WebKit:
a parede continua com a luz da hora, sem costura e sem cor medida); o escuro do 11 sobe (a luz redonda no mesmo sítio); no 9 o ecrã inteiro
fica 70 px mais alto, do topo físico do ecrã para cima, a fotografia leva os 70 px, o painel creme e o menu da página ficam onde estavam.
O script desconta a subida onde mede contra o palco: a altura do ecrã (`LVH`), a forma e o lugar do ecrã inteiro do 9, onde a luz encontra as
palavras, o segurar ao recuar, o comprimento da cena. No About, a cópia do 11 fica sem subida (está no próprio ecrã). Desktop, iPad e Android
não mudam (a subida é 0 e as fórmulas são as de antes).

**Medido com a regra forçada no Chromium (402 × 874, 390 × 844; noite e dia; estúdio provisório — imagens de teste geradas aqui, fora do Git,
porque as do Method não vêm no repositório):**
- A luz do 7 parada em 6 instantes (300–2500 ms): igual com e sem a regra sem as imagens (máx. 2–4 níveis); com o estúdio provisório, orlas
  de 1 px na margem esquerda e uma diagonal ténue ao ângulo da luz (Δ ≤ 53 em píxeis soltos) — da reamostragem das caixas inclinadas e do
  reflexo no Chromium; o site sem a regra já tem uma coluna pontilhada nessa margem. Visto ampliado: não se nota a tamanho real. No Safari
  pode ser diferente.
- Fases assentes: antes da luz, 7, 8a, 10, 11 iguais (o 7 só o cursor a piscar); o 9 muda como pedido (o ecrã inteiro sobe; título e data no
  mesmo sítio; o menu da página desceu 70 px para ficar abaixo da barra — encontrado e corrigido no teste).
- A passagem 11 → 12 com as duas subidas (Method e About): o ecrã inteiro do 11 contra o primeiro frame do 12, máx. 6–7 níveis.
- A faixa acima do ecrã (palco baixado no teste): antes da luz o Experiences; no 7 a aresta a atravessar; 8 e 10 a parede refletida; 9 a
  fotografia da página; 11 o escuro. Scroll lateral 0. Regressão: 1440 e 390 (About), menu → Method / About certos, 0 erros.
- Um engano do teste corrigido: media o palco com a subida incluída e parava uma fase antes.

**Não verificado:** tudo no iPhone — o tremor (agora sem `clip-path` nem `overflow-x: clip`, como o Work), o reflexo no Safari, os cartões a
passar atrás da ilha (o 8 no telemóvel afasta as folhas para o lado; só as que saem para cima a passam), a imagem do 9 atrás da ilha.
O código das cores (`data-edge`) continua, mas fica tapado pelo palco: só se veria no topo da página e no elástico.

## As cores do topo (ilha do iPhone, barra do Chrome) lidas da imagem desenhada — 4/11, owner

**Bugs do owner (iPhone e Android):** (1) Work → Method: no 7 a aresta de luz certa, mas ao aterrar a cor de cima da ilha mudava e ficava
errada; (2) 11 → 12: a imagem saltava outra vez; (3) a voltar ao 10 a cor da ilha mudava para uma cor errada; no Chrome do Android as cores
também não ficavam bem, sobretudo a voltar para trás. Pedido: ver se era código antigo das cores da barra de topo.

**O que era (código antigo, sim):**
- As bordas do Method (`data-edge`, lidas pelo `entrance/sequence.ts`) eram **valores fixos medidos no Chrome a 390 × 844** (`--m-edge` por
  hora em `method.css`, `FULL_EDGE` para o 9, `#171815` para o 11). No iPhone as cenas presas têm mais 130 px (`--screen`), o estúdio em
  `cover` é cortado de outra maneira e o seu topo é outra cor: certo durante a aresta, errado ao assentar.
- O escuro do 11 entra em 1,8 s (e sai em 0,7 s), mas a borda passava a escura **de uma vez**: escuro sobre o estúdio ainda aceso a ir para o
  11, e claro sobre o escuro a voltar ao 10 (bug 3).
- O 9 do telemóvel recebia a cor antes da imagem lá estar; o `decode` do estúdio, ao acabar, repunha a borda **por cima** da que esperava a
  luz chegar à ilha.
- No About: a borda do 13 → 12 ficava escura sobre o céu do retrato ainda aberto; no fim do About (o palco solto, a subir com a página) ficava
  a cor do céu sobre o que vinha a seguir; numa entrada rápida no 13 a borda era lida antes de o retrato chegar ao topo e ficava escura.
- O salto do 11 → 12 no iPhone: o lugar da frase do 11 era medido contra o palco do Method, que no iPhone começa 70 px acima do ecrã
  (`--m-lift`): o retrato nascia 70 px fora da frase.

**Feito (lógica):**
- `src/lib/top-colour.ts` (novo): `bandColour(img, caixa, faixa, fit, posição)` — a cor média de uma faixa da imagem **tal como está desenhada
  neste ecrã** (`cover` com `object-position`, ou `fill`), por um canvas de 8 × 2; `over`, `parseColour`, `hex`. Só imagens da mesma origem;
  falha → `null` e fica a cor de reserva.
- Method (`method-stage.ts`): `studioTop` lê o topo do estúdio da própria imagem da sala (a do `decode`, em `cover` no palco), mais a luz da
  hora (`--m-key`, a sua geometria e a **opacidade dela agora**); `studioOrDark` põe por cima o escuro do 11 **à opacidade que tem agora**;
  `featuredTop` lê o 9 da fotografia do ecrã em destaque (ou o seu fundo). No iPhone a faixa é a dos 70 px que a ilha vê: no estúdio o seu
  próprio reflexo (as primeiras 70 linhas); no 9 a fotografia que lá sobe. Depois de cada mudança a borda **segue** 1,9 s (lida a cada 100 ms)
  enquanto a luz e o escuro assentam; o 9 do telemóvel espera o fim do voo (`MOVE` + 60 ms); o `decode` não passa por cima de uma borda à
  espera. Os valores fixos (`--m-edge`, `FULL_EDGE`) ficam só como reserva se a imagem não se puder ler.
- About (`about-stage.ts`): `data-edge` próprio, composto como o topo é desenhado: o escuro do 12 (`#171816`); por cima a sala acesa
  (`.a-lit`, lida da imagem, à opacidade que tem agora); por cima, no telemóvel, o retrato **na medida em que se vê no topo** — pelo círculo
  de luz enquanto abre (a máscara do `.a-open`: sólida até 58 % do lado mais curto, transparente a 100 %, escalada por k) e todo, aberto;
  nada, quando subiu com a página. Ao ir para o 13/14 e ao voltar ao 12 a borda é relida a cada 100 ms durante 1,8 s; com a cor (hover,
  segurar) durante 1,4 s; solta no fim, a cada frame em que o palco se mexe (fora do topo → o escuro da secção `#1b1c1a`). Por relógio
  (1,2–1,5 s ao 13, 0,3/0,5 s ao 12) ficava sempre adiantada num ecrã e atrasada noutro. A frase do 11 medida no ecrã por baixo da subida do
  Method (o salto do 11 → 12).
- `entrance/sequence.ts`: na secção About usa a borda do About (ou a do Method enquanto o 11 ainda é o que se vê); a transição de 0,3 s no
  iOS também no About; vigia o `data-edge` do About. No Android continua sem transição (custo medido no Xiaomi a 3/11).

**Como se testou (Chromium sem ecrã, telemóvel; as regras do iOS forçadas com todos os blocos `@supports (-webkit-touch-callout)` do site,
incluindo `--screen` = lvh + 130 px):**
- `audit.cjs`: do primeiro passo do Work ao fim do About e de volta, de 70 em 70 px, com pausas de 2,2 s a cada ecrã; compara o fundo do
  `<html>` (= a cor da ilha / da barra) com os 6 px de cima do ecrã, e conta séries de 3+ amostras com Δ > 18 níveis. Android 390 × 844
  (fuso local e Tóquio), iOS 402 × 874 (local e Chicago: noite e dia).
- `tl2.cjs`: linha do tempo de uma mudança (borda contra topo a cada ~80 ms) — 10 → 11, 11 → 10, Work → 7, 9 → 10, 12 → 13, 13 → 12.
- `birth.cjs`: 11 → 12 no telemóvel — a frase no 11, a mesma na cópia, o centro onde o retrato nasce.

**Números:**
- Antes (Android): 4 séries erradas — 10 → 11 (Δ152), fim do About (Δ155, nos dois sentidos), 13 → 12 (Δ164).
- 10 → 11 no iOS: a borda segue o escuro (Δ 37–41 nos primeiros 250 ms, ≤ 21 depois, 0 assente); 11 → 10: Δ78 → 4 em 330 ms (antes ficava
  escura). Work → 7: a borda muda 150–250 ms antes de a aresta chegar ao topo (o centro da transição de 0,3 s, como desenhado), depois Δ ≤ 13.
- 11 → 12: a frase no 11, na cópia e o centro do retrato a nascer no mesmo píxel — Android 344 / 344 / 344, iOS forçado 424 / 424 / 424.
- 12 → 13 no iOS forçado: a borda acompanha a sala a acender (Δ 8–13) e o retrato a chegar ao topo (Δ86 numa amostra, ~100 ms de atraso,
  depois ≤ 11); 13 → 12: Δ ≤ 9 até ao retrato sair do topo, Δ71 em duas amostras na queda, depois ≤ 2.
- **Depois (auditoria completa, a mesma de antes):** Android 390 × 844 local e Tóquio: **0 séries erradas** (eram 4). iOS forçado 402 × 874
  local e Chicago: séries de 3 amostras (~0,3 s com a página sempre a andar) no 10 ↔ 11 (Δ 43–63, o atraso de uma leitura de 100 ms) e no
  9 ao voltar do 10 (Δ35, o voo do cartão); no fim do About e no 7 de dia (Δ19) a faixa que a ilha vê (acima do ecrã) não é a que o teste
  vê (o topo do ecrã) — o retrato a subir mostra o corpo escuro no ecrã enquanto o céu continua acima dele. 0 erros de página.
- Regressão: ida e volta 1440 e 390 (só as diferenças das bandas mortas do Method, como antes), menu 1440 e 390 certos (um "chegar com
  #about" falhou uma vez com quatro browsers em paralelo; repetido 5 vezes sozinho, certo), reduzido e sem JS 1440/390/320 sem sobreposição
  nem scroll lateral, walk 390 e 1440 sem erros, hover/segurar certos, costura 11 → 12 máx. 6–7 níveis.

**Não verificado:** o iPhone verdadeiro (a faixa acima do ecrã não se vê no Chromium: o teste compara com o topo do ecrã, e no 7 e no fim do
About a faixa que a ilha vê é outra — diferenças de até ~20 níveis no estúdio e no retrato a sair são isso); o Xiaomi (a borda relida a cada
100 ms durante 1,9 s no Method: 19 mudanças do fundo da página; antes era 1). As imagens do estúdio usadas aqui são provisórias (as reais
não estão no repositório): as cores exatas no iPhone só com as verdadeiras.

## As bordas do Method no iPhone: palco preso + espelho; a entrada espera o vídeo — 7/11, MacBook

**Bugs do owner (iPhone, 6–7/11):** a faixa da ilha e a de baixo ficavam com a cor do estúdio antes de a luz do 7 acabar o percurso (o
pedido: acompanhar a luz do lado que ela já passou, nada fabricado); às vezes a câmara passava o O com o poster parado (a mulher quieta).

**O que se descobriu (Simulador iOS 27.3 no Mac — Xcode 27.3 beta por `DEVELOPER_DIR`, html/body magenta para separar cena de cor):**
- O que impedia a cena de chegar à ilha era o `-webkit-box-reflect` do estúdio (os 70 px acima eram o reflexo, que o Safari não desenha
  ali), não o sticky: o palco preso, com as suas camadas próprias (a luz, os cartões), é desenhado atrás da ilha e por baixo da barra.
- O palco segurado em fluxo por uma animação de scroll (tentativa do dia, lab4/lab6) chega à ilha mas, com dedo rápido, fica um fotograma
  atrás: o palco inteiro 5–20 px fora e de volta (gravação do iPhone, perfil de luminância fotograma a fotograma; lab6 com a página sem
  trabalho também). Saiu. Uma faixa de reserva (cópia do fundo em fluxo por baixo do palco) ficou em
  `docs/development/ios-lab/attempt/method-band-1107.patch`, desnecessária.
- No regresso ao Work o palco fica `fixed` enquanto a luz fecha, e o Safari não desenha `fixed` atrás da ilha (faixa de cima magenta).

**Feito:** `method.css` (bloco iOS) — `.m-mirror` (a foto da sala virada nos 70 px de cima; a sala com o mesmo corte; a luz da hora desce
com `translate`) no lugar do reflexo; `method.tsx` — o elemento. `method-stage.ts` — no iPhone (`reaches`), na ida a cor das bordas só muda
quando a luz cobre os quatro cantos das duas faixas (antes: ao passar o meio, 855 ms; agora ~1530 ms); no regresso como antes (ao deixar a
ilha, com o desvanecer). `entrance/sequence.ts` — a sequência espera o `playing` do vídeo (≤ 2,5 s, abaixo da guarda de 3 s; sem esperar se
o vídeo falha ou o `play()` é recusado, ex. Poupança de energia).

**Medido:**
- Simulador, html magenta: 7, 8a, 8b, 8c, 9, 10, 11 sem magenta na ilha nem em baixo — 17 Pro (402 × 714 visível), 17 Pro Max (440 × 796),
  17e (390 × 699), dia e noite. Passagem 6 → 7 gravada (10 fps, faixas de cima e de baixo): o lado por iluminar fica o Work até a luz lá
  chegar; regresso como antes de 7/11. Entrada 3× (`?autorec`): a câmara arranca no fotograma do `playing`; no zoom (2 s depois) o vídeo
  a opacidade 1.
- iPhone do owner (Safari 27.2): "parece resolvido" — sem tremer, a passagem certa; a entrada "parece corrigida".
- Xiaomi (Chrome 156, ligado ao Mac, CDP): entrada 3× — câmara no `playing`, 89–90 fps durante a câmara. Method, gesto de toque, A/B com
  `830d3de`: 6 → 7 83,5 / 86,8 / 86,8 fps antes, 83,4 / 86,4 / 87,2 agora; 7 → 6 86,7–87,7 antes, 86,4–87,9 agora — sem regressão.
- Desktop: Chrome 157 a 1920 × 1080 e 1440 × 900 — entrada 120 fps sem fotogramas longos; Method 116–120 fps; sem overflow. Safari 27.2
  (janela 1324 × 888) — entrada e Method a 59–60 fps (limite do Safari); sem overflow.
- `npm run typecheck`, `npm run lint` (sem avisos), `npm run build`: passam.

**Não verificado:** Safari a 1920 × 1080 (o ecrã do Mac é 1728 × 1117); capturas do Safari do Mac (sem permissão de gravar o ecrã);
teclado, reduced motion e sem JS não mudam (CSS só com `data-js` e movimento; o script só corre com movimento) — não repetidos.
**Já existia (a melhorar):** ~100–120 ms ao disparar o 7 no Xiaomi; ~105 ms ao passar o O (Safari, Simulador); a 1.ª descodificação
do estúdio a 1920 (592 ms).

**Ferramentas novas (laboratório, nunca no site):** consola remota no proxy (`/__diag/run`), `?autorec=<s>` no painel, `lab6`; tudo em
`docs/development/ios-lab/README.md` §5b.

## About no iPhone: o fundo depois do 14, o salto do 12 → 11, a foto do 13 mais acima — 7/11, MacBook

**Pedidos do owner (iPhone, 6–7/11):** bug 11 — depois do 14 a faixa de baixo do Safari (e o Questions) cinzenta clara com a página
escura; ao voltar do 12 para o 11 a imagem salta; no 13 a foto devia subir um pouco ("vê-se pouco da minha foto").

**Causas e o que se fez:**
- Bug 11: o Questions, o Contact e o colofão (ainda por desenhar, M7) não tinham fundo e mostravam a cor do html, que no iPhone é a cor
  lida do topo (o céu do retrato) enquanto o About sobe. Fundo carvão próprio nos três (`globals.css`), como já se viam no desktop.
  (Tentado primeiro: o About pôr carvão fixo nas bordas no iPhone — revertido: se o Safari não desenhar o topo, o céu lido é melhor reserva.)
- Salto 12 → 11: ao voltar, o palco do About fica `fixed` (`a-leaving`) sem medir onde está, e no iOS a sua margem de −70 px (a subida)
  somava-se ao `top`: sticky −70 → fixed −140 (Simulador, iPhone 17 Pro; −58 → −128 num regresso lento). `about-stage.ts`: `hold()` fixa
  o palco no pixel onde está, menos a margem; `unhold()` em todos os sítios onde se larga.
- Foto do 13: no iPhone pendurada pelo topo (`object-position: 50% 0`), o ecrã mostrava as linhas 70–432 de 602, cortado à cintura.
  `about.css` (bloco iOS): `50% 35%` → linhas 130–492, até às mãos; os 70 px atrás da ilha continuam o céu da foto. Também o 12 (o mesmo
  retrato no círculo) mostra mais. Só iOS (no Xiaomi o 13 já mostra assim).

**Medido:** Simulador iOS 27.3 (17 Pro): depois do 14 o Questions carvão, html magenta sem magenta em baixo nem em cima; o regresso
12 → 11 por código rápido e lento: o palco no mesmo pixel ao fixar (−70 → −70, −58 → −58), gravado fotograma a fotograma sem salto;
12, 13, 14 vistos com a foto mais acima. Xiaomi (CDP): Questions carvão depois do About; barra do Chrome a seguir o topo. typecheck,
lint, build: passam.
**Atenção nos testes:** o Xiaomi num separador do site responde à mesma consola remota do proxy — tirá-lo do site (about:blank) antes de
testar no Simulador (houve leituras trocadas nesta sessão).
**iPhone do owner (7/11, noite):** "parece tudo bem" — o regresso 12 → 11 sem salto, a foto do 13 mais acima, sem faixa cinzenta.
**Desktop:** Chrome 157 (CDP) a 1440 × 900 e 1920 × 1080 e Safari 27.2 (1324 × 888): o regresso 12 → 11 por roda / suave e passo a
passo — o palco no mesmo pixel ao fixar (0 → 0); 12, 13, 14 como antes (a foto só sobe no iPhone); Questions, Contact e colofão carvão;
sem overflow.
**Não verificado:** o bug 12 (topo do 14 instável) não se reproduz no Simulador; o owner não o voltou a referir.

## Revisão dos bugs de 6/11 em todas as plataformas; a etiqueta da barra; as palavras do 7 no 8 → 9 — 7/11, MacBook

**Método:** um percurso automático igual em todo o lado (Work → 7 → 8a–c → 9 → 10 → 11 → 12 → 13 → 14 e de volta ao Work, fase a fase por
scroll suave), com fita por fotograma (etiqueta da barra, fases, saídas) e gravação do ecrã sincronizada para ver cada bug no seu momento.
Simulador iOS 27.3 (17 Pro), Xiaomi (Chrome 156, CDP + `screenrecord`), Chrome 157 a 1440 × 900 e 1920 × 1080, Safari 27.2 (1324 × 888).

**Encontrado e corrigido:**
- **Bug 1 (etiqueta antes da cena):** a etiqueta seguia só a posição: *02 Method* sobre o Work 0,2 s na ida, *02 Method* sobre o retrato
  1,9 s a voltar do 12, *02 Method* sobre Experiences 2,4 s a voltar do 7 (iPhone). Agora cada cena diz quando é vista (`data-seen`): o
  Method quando a luz passa o meio do topo (e até a deixar ao voltar), o About quando o retrato está a meio (1,55 s; ao voltar 0,55 s);
  `bar-client.tsx` decide entre Work/Method/About por isso enquanto há cenas, e pela posição no resto e sem movimento. O `data-section`
  do html continua a posição (as cores das bordas leem-no). Gravação: a etiqueta muda no mesmo fotograma em que a cena passa.
- **Bug 3 (palavras do 7 fantasma no 8 → 9):** ainda acontecia (Simulador e Xiaomi): as palavras (camada 4) por cima do ecrã a crescer
  (camada 2), a desaparecer em 1 s. Agora saem em 0,25 s e no 9 ficam por baixo dos ecrãs (`method.css`, `[data-phase='9'] .m-head`).

**Verificado sem mudança (resolvidos pelas correções de hoje):** 2 (retângulo no Work → 7: a passagem limpa nos dois telemóveis);
7, 8 (retrato a voltar do 14/13 para o 12: fecha-se no círculo, *I'm Flávio.* no lugar); 9 (frase do 11 ao voltar: aparece no sítio, sem
descer); 10 (13 → 14: crédito na faixa de baixo da foto, sem retângulo); 12 (topo do 14 estável). 6 (escuro do 11 até ao topo) já
confirmado antes.

**Medido (percurso inteiro):** etiqueta ≠ cena só nos primeiros 5–14 ms (antes de a barra ter texto) — Simulador, Xiaomi, Chrome 1440 e
1920, Safari. fps: Simulador 57 (Mac a desenhar), Xiaomi 84,6–86,2, Chrome 118,5–119,5, Safari 59,7. typecheck, lint, build: passam.
**Não verificado:** o iPhone do owner com dedo depois destas duas correções.

## Telemóvel: o Method e o About mais lentos e o scroll a parar em cada fase — 7/11, MacBook

**Pedido do owner (iPhone, 7/11):** "os tempos de animações e scroll no Method estão rápidos demais, especialmente em mobile; às vezes passo
setores sem querer" — do início do Method ao fim do About, nos dois sentidos. Escolha do owner: afinar + parar em cada fase; só telemóvel.

**Feito (só `max-width: 899px`, com movimento):**
- Fases mais longas: Method ~1,1 ecrã por passo (8a 1,5 · 8b 2,6 · 8c 3,7 · 9 4,8 · 10 5,9 · 11 7,0; cena 7,8; secção 9,3 ecrãs);
  About 13 em 1,1, 14 em 2,2, solto em 2,9 (secção 4,2). As relações entre os dois mantêm-se (a passagem do About meio ecrã depois do 11).
- Animações ×1,25: todas as do Method e do About (voos, luz, derrame, empurrão da foto, cursor, cópia do 11), e os relógios ligados a
  elas (bordas, etiqueta, fim das passagens, saídas).
- O scroll pára em cada fase: marcas (`.m-snap`, `.a-snap`) um pouco depois do início de cada fase e da banda morta, mais uma em
  Experiences (por cima) e uma no Questions (por baixo); `scroll-snap-type: y mandatory` + `scroll-snap-stop: always` só enquanto o
  Method ou o About estão em cena (ou a luz a recuar) — `:has()` em `method.css`. `proximity` foi tentado: um gesto rápido passava 3 fases.
- Saltos do site (menu, endereços, nome da barra, capítulos do Work): `src/lib/unsnapped.ts` desliga a paragem durante o salto (com ela,
  um salto para o Work aterrava em Experiences).
- No telemóvel, chegar ao 13 durante a passagem do 12 apressa-a (antes esperava 3,75 s e o scroll seguia até ao Questions).

**Medido:** Xiaomi (CDP, gestos de toque rápidos `speed 3000`): cada gesto avança exatamente uma fase, para a frente e para trás,
do 7 ao 14; para trás do 7 pára em Experiences; para a frente do 14 pára no Questions; no Work o scroll fica livre; percurso inteiro
89 fps, etiqueta certa. Simulador iOS 27.3: o Safari aplica a paragem (`y mandatory`); menu → Work, nome → topo, menu → Method aterram
certos; percurso inteiro com a etiqueta sempre certa e o 13 logo a seguir ao 12. Safari desktop: sem marcas, sem paragem, tempos como
antes. typecheck, lint, build: passam.
**Não verificado:** o dedo no iPhone do owner (a paragem com inércia real do iOS) — é o veredicto; o Xiaomi depois das duas últimas
correções (adormeceu; as correções só tocam em saltos e na passagem do 12).

**Depois (owner, iPhone, 7/11 22:42):** "estragaste o 9 e o 10, não é o cartão correto, uma nova etapa". O cartão em destaque era o de
Experiences porque Experiences foi escolhido na entrada (decisão #45, sem mudança; no Simulador sem tocar na entrada: Weddings). A "etapa"
era o 9 → 10 com o ritmo novo: as palavras do ecrã saíam e as da capa só entravam depois — um cartão escuro vazio quase 1 s no guia de
Experiences (sem fotografia). Agora cruzam-se (`becomeCover`: saída 450 ms, capa a partir de 250 ms em vez de 600). Simulador, gravado
com Experiences e Weddings escolhidos: o vazio passa a ~0,1 s; o *Your first chapter* entra enquanto o ecrã sai. Escolha do owner:
manter o ritmo e a paragem, tirar o vazio.
**E depois (owner, 7/11):** "o correto é o card com as pessoas" — o ecrã em destaque passa a ser sempre o do casamento (README #105).
Comparado antes (`830d3de`) e agora em 1440 × 900 e 390 × 844 (Chrome, CDP): sem lâmina escolhida, 8c/9/10 iguais; com a lâmina
Experiences tocada na entrada, o 9 (telemóvel: ecrã inteiro) e o 10 (capa) são o do casamento, no telemóvel e no desktop.

## Revisão "vejo bugs em desktop e mobile" — comparação com a manhã (`830d3de`), 7/11 noite

**Método:** as duas versões lado a lado (worktree em `830d3de`, porta 3101); 20 transições (Work → 7 → … → 14 e de volta), 5 fotogramas
cada a tempos fixos depois da mudança de fase (× 1,25 no telemóvel novo), SSIM por fotograma; Chrome a 1440 × 900 e 390 × 844 (toque).
- **Desktop:** igual à manhã em todas as transições (SSIM ≥ 0,95; as diferenças são só o instante da captura). Muda só o que era de
  propósito: a etiqueta no fim volta a *01 Work* (de manhã ficava *02 Method*).
- **Telemóvel (Chrome):** a mesma composição e a mesma ordem; o 8c → 9 sem *No templates* em fantasma (bug 3, de propósito).
- **Revertido:** o cruzamento do 9 → 10 (`70665f9`) — feito para o guia de Experiences, que já não vai à frente (#105); com o ecrã do
  casamento punha *The seventh of November* e *Your first chapter* um sobre o outro.
- **Xiaomi, gestos de toque reais (CDP, 13 para a frente + 13 para trás, paragem ligada) — dois defeitos da paragem por fase:**
  (1) de Experiences um gesto passava o 7 e caía no 8a (a paragem só ligava no 7; a passagem da luz cortada) → liga-se meio ecrã antes
  (`data-near`, method-stage.ts / method.css); (2) as marcas do 11 e do 12 a ~200 px: um gesto saltava 11 → 13 e 12 → 10 → a marca do
  12 a 0,4 ecrã dentro dele. Depois: cada gesto uma fase em todo o percurso, nos dois sentidos, a etiqueta certa.
- Simulador iOS e Chrome 1440: o percurso inteiro com a etiqueta certa. typecheck, lint, build: passam.

## Desktop: o 11 a passar para o About; o risco claro no fundo da capa do 10 — 7/11 noite

**Owner (Chrome do Mac):** "às vezes a dar scroll não pára no 11 e começa logo o About"; "no 10 a imagem não preenche bem o card, vê-se
um risco branco em baixo". Os dois já existiam de manhã.
- 11: no desktop durava ~0,4 ecrã antes de a passagem do About começar. A cena passa de 4,7 para 5,6 ecrãs (secção 7,1), com os passos
  de 7 a 11 nos mesmos sítios: medido (Chrome 1728 × 913, scroll a 2 % do ecrã) 11 → 12 = 1,25 ecrãs; 8a 6,71 · 8b 7,06 · 8c 7,50 ·
  9 8,05 · 10 8,70 · 11 9,35 como antes. O telemóvel não muda (as suas fases e a sua altura).
- 10: a fotografia da capa crescia 1/0,6 = 1,6667, exatamente o cartão; na aresta ficava o creme do ecrã (uma linha de brilho 102 contra
  ~40 à volta, Chrome 1728 × 913 a 2×). Agora 1,68 (5 px além, cortados pelo cartão): sem pico.
- Percurso inteiro em Chrome 1440 e 1920: 120 fps, a etiqueta certa. typecheck, lint, build: passam.

## A paragem por fase também no desktop; preso em Experiences; a passagem cortada — 7/11 noite e 8/11

**Owner:** desktop "às vezes não pára no 10" (escolha: parar em cada fase também no desktop); iOS "a andar rápido para trás fica preso no
Experiences e não anda mais"; iOS "de Experiences para o Method, se for rápido e continuar, passo a animação da luz e vai logo para a
segunda".
- **Preso:** a paragem ligava-se "perto do Method" até 0,7 ecrã (`data-near`) e também enquanto a luz recuava (`.m-leaving`); na marca de
  Experiences (0,3 ecrã acima) era a única marca e cada gesto para cima voltava a ela (Simulador: 400 px para cima, 0 px). Agora `near`
  só abaixo dela (0,2 ecrã) e sem `.m-leaving`: na volta rápida, em Experiences, a paragem está desligada e o scroll sobe.
- **Passagem cortada:** um gesto durante a passagem do 7 apressava-a para 0,3 s (regra de 3/11). Com a paragem, já não: o 8a espera
  pela luz (Simulador: gesto aos 0,4 s → 8a aos 3,3 s). O teclado continua a apressá-la.
- **Desktop:** a mesma paragem (`.m-snap`/`.a-snap` também no desktop; o CSS fora da regra do telemóvel). Com a marca logo depois de cada
  início, 7 → 8a e 12 → 13 ficavam a mais de um ecrã e um gesto de trackpad de 300–450 px voltava para trás (Chrome, gestos sintéticos);
  o 11 alongado (5,6) piorava. Desktop de volta a 4,7 ecrãs (decisão de 2/11) e marcas dentro de cada fase a ≤ 0,8 ecrã umas das outras
  (Method 0,45/1,25/1,825/2,325/2,9/3,5/4,1; About 0,25/1,05/1,75). A paragem separa-se por secção (Work/Method vs About) e larga-se
  0,3 ecrã antes de o About soltar o palco (`data-free`): do 14 um gesto segue para o Questions.
- **Medido:** Chrome 1728 × 913, gestos de 400 px: uma fase por gesto de Experiences ao 14 e de volta a Experiences. Xiaomi, gestos de toque:
  uma fase por gesto de Experiences ao Questions e de volta. Simulador iOS: os dois casos acima. typecheck, lint, build: passam.
- **Não verificado:** Safari do Mac com trackpad real; o iPhone do owner com dedo.

## Telemóvel de volta ao `ad808d9`, desktop como em `addc06d` — 8/11 (por validar)

**Owner (iPhone, 8/11):** com o `addc06d` "ficou simplesmente partido o Method de novo" (vídeo enviado, por analisar); o desktop está
aprovado. Pedido: voltar atrás no telemóvel, documentar, validar no iOS e só então commit e push; o "ficar preso" investiga-se na próxima
sessão. Feito: no telemóvel `data-near` até 0,7 ecrã, a passagem do 7 apressada por um gesto e a regra da paragem de `ad808d9`
(`@media (max-width: 899px)`, com `.m-leaving`); no desktop a regra nova (`@media (min-width: 900px)`). typecheck, lint, build: passam.
**Não verificado nesta reversão** (o owner teve de sair): Xiaomi, Simulador, iPhone — o owner valida no iPhone.

## O scroll do telemóvel nas duas pontas da cena; a passagem inteira; a volta sem salto — 8/11 tarde, MacBook (por validar no iPhone)

**Fonte:** gravação do iPhone do owner, 8/11 11:47, 36 s (`docs/development/ios-lab/out/2026-11-08T11-49-00-ScreenRecording_11-08-2026_11-47-57_1.mp4`,
só neste Mac; build `9b437e1`), idas e voltas rápidas Experiences ↔ 7/8a; e o vídeo do `addc06d` (`…00-16-21…mp4`, "partido").
Pedido do owner: ver o vídeo, corrigir, testar no Simulador o percurso inteiro (entrada → fim do About) nos dois sentidos, com scroll
normal, rápido, muito rápido e navegações estranhas, sem mudar a composição de cada etapa; no fim Xiaomi, Chrome e Safari.

**Encontrado no vídeo (e reproduzido no Simulador com dedo, ver "Ferramentas"):**
1. **Preso em Experiences** (bug A, 9,5–15 s do vídeo: o indicador de scroll mexe, a página não): a paragem ligada na marca de
   Experiences (`data-near` até 0,7 ecrã e `.m-leaving`) era a única marca ao alcance. Simulador: 4 gestos para cima, 0 px.
2. **A passagem da luz cortada** (bug B, 1,5–3,75 s: a luz em 0,75 s, depois 8a, 8b, 8c, 9 em 1,5 s): um gesto durante a passagem apressava-a.
3. **As palavras do 7 sobre o escuro do Work** antes de a luz lá chegar (2,0–2,1 s, 31,0 s): cada linha entrava quando a luz chegava ao
   seu meio, e a caixa da linha é da largura do ecrã.
4. **A cena inteira a saltar 70 px para cima** ao começar a volta 7 → Experiences (17,75 → 17,9 s): o palco passa a `fixed` com
   `top: −70px` e no iOS mantinha a `margin-top: −70px` do sticky. Simulador: −70 → −140 px.
5. **O vídeo do `addc06d` ("partido"):** um gesto no 7 correu até ao About (20,0 → 21,75 s). No Simulador, o mesmo com gestos fortes: a
   paragem estava desligada quando o gesto começou e ligou-se a meio da inércia — o iOS só respeita a paragem que está em vigor quando o
   dedo larga. Também na versão de ontem: um gesto forte de Experiences ia ao 10, do fundo da página ao 11.
6. (Simulador) **A luz a saltar** ao inverter a meio do fecho (um gesto para baixo 0,1 s depois de um para cima): recomeçava do lado da hora.

**Corrigido (só telemóvel, salvo 3; o desktop fica como aprovado):**
- 1: a paragem acima da cena só entre a marca de Experiences e o 7, e enquanto um gesto de volta não pousa (`backing`, solto ao repousar:
  `scrollend` ou 180 ms parado). Em repouso na marca está desligada: o gesto seguinte sobe livre. (Desligar pelo dedo a meio do arrasto
  foi tentado: o iOS perdeu a mudança 2 vezes em 6.)
- 2: durante a passagem (2,3 s, até a tese recuar) só as marcas do 7 e de Experiences ficam (`data-passage`, method.css): um gesto para a
  frente volta ao 7 e a luz nunca é cortada; depois disso um gesto avança (apressando só o resto: o campo). A retenção só se liga se a
  página está mesmo no 7 (um salto ou o Safari a repor o lugar ao recarregar, ligada por um instante, levavam a página ao 7).
- 5 (cima): um gesto rápido vindo do fundo do Work que a inércia leve além do 7 é trazido à marca do 7 (uma vez por passagem, invisível sob o
  palco preso), e de novo quando a retenção acaba — só depois de um toque real (`src/lib/finger.ts`): o iOS ignora parte de um scroll
  pedido durante a inércia e continua.
- 5 (baixo): a paragem do telemóvel continua pelo Questions e pelo Contact, com uma marca no fim da página (`about-stage.ts`): nenhum gesto
  para trás começa com ela desligada. (Uma correção por JS foi tentada e retirada: um toque durante a inércia do iOS não chega à página
  e o retorno lutava contra o dedo; `overflow: hidden` para parar a inércia também falhou — num caso a página foi ao topo.)
- 3: cada linha entra quando a luz passou o texto inteiro (os quatro cantos do texto, `Range`) — telemóvel e desktop.
- 4: `margin-top: 0` no palco `fixed` (bloco iOS de method.css).
- 6: a luz recomeça de onde está se ainda estava a fechar.
- Saltos: o menu no telemóvel aterra na primeira marca da secção (03 About aterrava no início, e o gesto seguinte só ia à marca); o foco do
  teclado no 11 é um salto (`unsnapped`).

**Medido — Simulador iOS 27.3 (iPhone 17 Pro, 402 × 714/754), dedo real** (arrastos do rato na janela do Device Hub, inércia e barras do
Safari reais; build final):
- Uma fase por gesto, Experiences → Questions → fim e de volta ao topo: gestos normais (280 pt, 110 ms), fortes (450 pt, 45 ms) e lentos
  (300 ms + 250 ms parado). Experiences nunca preso: do 7 pousa em Experiences, o gesto seguinte sobe livre.
- Gesto forte para dentro a partir do Work (1300, 2400, 3300, 3900, 4200 px): sempre 7 (12/12; antes 8a). Para trás a partir do Questions
  e do fundo: sempre 14 / Questions (8/8; antes 12, 11, 10).
- 4 gestos rápidos durante a passagem: fica no 7, a luz inteira; o gesto seguinte vai ao 8a. 20 gestos fortes sem pausa, nos dois sentidos:
  nunca preso nem incoerente (às vezes uma fase passa sem se ver: 13 à ida, 8b à volta). Vaivém rápido Experiences ↔ 7: coerente.
- Menu de 0, Experiences, 7, 9, 13, Questions, fundo → 02 Method (7), 03 About (12), 04 Questions, 05 Contact, 01 Work: certos.
  Voltar/avançar do browser: certos, e o gesto seguinte avança uma fase. Recarregar no 7, 8a, 9, 13: fica no lugar (uma regressão minha,
  ao 7, encontrada e corrigida).
- Gravações: a passagem com as palavras só onde a luz passou; a volta sem salto; o percurso inteiro 7 → 14 → fim → Experiences, cada
  fase com a sua composição (folhas em `scratchpad/simrec`, temporárias).
- **Xiaomi** (Chrome, CDP, gestos de toque com inércia, antes da última limpeza de `finger.ts`, sem mudança de comportamento): uma fase
  por gesto normal nos dois sentidos; entrar do Work com gesto forte → 7 (6/6); recarregar fica no lugar; saltos do menu certos. Arrastos
  de quase um ecrã a 6000 px/s passam uma fase (o próprio arrasto passa uma marca); a versão de ontem, no mesmo teste, ia de 7 a 10 e ao
  Questions. **fps não medido** nesta versão: o Xiaomi desligou-se do Mac antes.
- **Chrome desktop** (eventos reais de trackpad do macOS, com fases e inércia, 1500 × 913): como aprovado (o 8a mostra-se sozinho no fim
  da passagem; uma fase por gesto à volta). **Safari desktop** (1324 × 808): igual à versão de ontem no mesmo teste (às vezes uma fase
  passa num gesto, nos dois builds). Chrome com toque emulado 390 × 844, 320 × 640, 768 × 1024: uma fase por gesto (a 390 às vezes duas;
  ontem, no mesmo teste, de Experiences ia ao 8a e saltava uma sim uma não). Overflow horizontal 0 em 1920, 1440, 768, 390, 320.
- Movimento reduzido (390, 1440): sem paragem, sem marcas, a página percorre-se toda; sem JavaScript (`next start`): o texto todo, overflow
  0; sem erros de consola. typecheck, lint, build: passam.

- **Xiaomi, build final (8/11 tarde, religado):** a mesma bateria, os mesmos resultados. **fps da passagem, A/B com `9b437e1`** (gesto de toque,
  3 idas e voltas cada): 6 → 7 ontem 78,6 / 83,9 / 83,5 fps, agora 76,3 / 85,5 / 83,7; 7 → 6 ontem 77,3–79,8, agora 78,4–79,7; o pior
  fotograma ~100–120 ms nos dois (já conhecido), e na 1.ª passagem depois de carregar 199 ms ontem / 221 ms agora (a 1.ª descodificação). Sem regressão.
- **Owner (iPhone, 8/11):** a retenção durante a passagem da luz "parece-me bem, é assim que quero" — aprovada. A paragem pelo Questions e pelo
  Contact (com a marca no fim da página) fica para rever ao fazer o M7.

**Não verificado:** o percurso inteiro no iPhone do owner; um trackpad e uma roda físicos no desktop (só eventos sintéticos do macOS); iOS com
o rato do Simulador não é um dedo (velocidades parecidas, não iguais).

**Ferramentas (novas, `docs/development/ios-lab/finger/`):** `simtouch.swift` (arrastos e eventos de trackpad pelo rato; o WebStorm precisa de
Acessibilidade — dada pelo owner a 8/11), `lab.sh` (bateria: `fwd`/`back`, `allbat`, `jump`, `ph`), `xiaomi-strokes.mjs`, `xiaomi-fps.mjs`,
`chrome-strokes.mjs`, `reduced-nojs.mjs`, `windows.swift`. O Xcode 27 mostra o Simulador no **Device Hub**
(`~/Downloads/Xcode-beta.app/Contents/Applications/DeviceHub.app`); o Simulator.app do Xcode 16.1 não abre os iOS 27.

## M7a — Questions (estados 15–18) — 8/11 noite, MacBook (por validar pelo owner)

**Pedido do owner:** as Questions exatamente como no storyboard; as perguntas a ajustar no desktop e no telemóvel; uma aberta de cada vez;
o scroll testado para a frente e para trás, a parar sempre nas Questions como nos outros capítulos.

**Feito:** `src/components/questions/` (`questions.tsx` servidor, `questions.css`, `questions-client.tsx`), no lugar do esqueleto em `page.tsx`.
- Storyboard principal, "04 Questions" (estados 15–18, valores do artefacto): o papel do estúdio em pedra (`#DCD5C8 → #BEB5A6`, luz em cima à
  esquerda, linha do chão, vinheta; o grão como ruído escuro de baixa opacidade, sem modo de mistura, como no About); a âncora como
  título (*What do you* / *actually create?* em itálico), a resposta, os capítulos (desktop em lista com numerais e setas; telemóvel numa
  linha com barras finas, sem numerais); oito perguntas numeradas, a primeira sem filete; o + roda para ×; a resposta desdobra por
  `grid-template-rows 0fr → 1fr` (0,7 s) e aparece em 0,6 s; uma aberta de cada vez; *05 Contact ↓* só no desktop.
- Desktop: a moldura 16 : 10 do storyboard (`--u`, como o About). Telemóvel: uma coluna; o estúdio fica no ecrã enquanto a lista corre.
- 14 → 15 (proposta da README #65, desenhada no storyboard): o papel sobe como um cartão sobre o último ecrã do About (as Questions
  sobrepõem-se a ele, com sombra no topo); o About sobe 12 % mais devagar e escurece por baixo — animação ligada ao scroll em CSS
  (`view-timeline` das Questions, `timeline-scope` no `main`), no compositor; sem suporte, o papel sobe sobre o About parado.
  Depois a âncora entra (1,1 s), e as perguntas uma a uma (0,7 s, 0,1 s entre elas), uma vez.
- Sem JavaScript: todas as respostas abertas (no desktop a moldura cresce com elas). Movimento reduzido: tudo no lugar, sem sobreposição.
- iPhone: a cor das bordas nas Questions é a do papel (`sequence.ts`).

**O scroll (o que mudou e porquê):**
- Um gesto do 14 pára no topo das Questions (a marca no topo do papel, `about-stage.ts`). A espera depois do 14 encurtou (o papel começa
  0,35 ecrã depois do início do 14 no telemóvel, 0,25 no desktop; antes o palco era largado 0,7/0,6 depois), para o 14 ficar a ~1,1 ecrãs
  das Questions.
- A paragem continua pelas Questions e pelo Contact, com marcas a cada 0,75 do ecrã visível até ao fim da página (seguem a altura da
  página: abrir uma resposta). Testado e posto de lado: (a) paragem desligada nas Questions → um gesto forte de volta atravessava o About
  até ao Method 9–11; (b) um script a trazer de volta → lutava com o dedo (um toque durante a inércia do iOS não chega à página);
  (c) a secção como área de paragem maior que o ecrã → o iOS não deixa parar dentro.
- Desktop: a paragem também continua pelas Questions (a regra deixou de depender da secção e do `data-free`, que saiu).
- Saiu a compensação de scroll ao fechar uma resposta acima da que se abre (puxava a página para dentro do About a 320 × 640 e lutaria
  com as marcas): a pergunta tocada sobe suavemente.

**Medido:**
- **Simulador iOS 27.3, dedo:** do Work ao fim e de volta, gestos normais, fortes e lentos: uma paragem por gesto; Q → fim em passos;
  do fundo para trás → Questions → 14; gestos fortes do fundo e do topo das Questions: 14 ou Questions (8/8); com a 7.ª resposta aberta
  as marcas seguem e o texto lê-se numa paragem; menu e saltos (Method 7, About 12, Questions, Contact, Work) certos; capítulos das
  Questions → Work (Weddings, Artists, Experiences) certos.
- **Chrome desktop (1500 × 888, eventos reais de trackpad):** Experiences → … → 14 → Questions → fim e de volta, uma paragem por gesto.
- **Safari desktop (1324 × 888):** à ida certo; à volta Questions → 14 às vezes precisa de 2–3 gestos curtos (400 px): a subida do papel é
  um ecrã de scroll, o 14 fica a 1,1 ecrãs das Questions (as outras fases ≤ 0,8). O Chrome passa à primeira (conta a inércia).
- **Visual (Chrome):** 1920, 1440, 768, 390, 320: composição do storyboard, sem overflow horizontal (um de 86 px a 1440 — a margem
  lateral global — corrigido).
- **Teclado:** Tab do *04 Questions ↓* do About → capítulos → perguntas, foco visível; Enter abre, Espaço abre a seguinte e fecha a anterior.
- **Movimento reduzido e sem JS** (390, 1440): conteúdo todo, sem overflow, sem erros de consola. typecheck, lint, build: passam.
- **Contraste:** tinta `#2A2823` sobre o papel ~13 : 1; resposta (0,85) ~10 : 1; números (0,55) ~3,3 : 1 (decorativos, `aria-hidden`); a
  barra sobre o papel (vidro a 0,50, o máximo aprovado na #71) ~3,9 : 1 — abaixo de 4,5 : 1 para texto pequeno: decisão do owner.

**Xiaomi (Chrome, CDP, gestos de toque com inércia, 392 × 779) — e dois bugs encontrados nele:**
- Gestos normais de Experiences ao fim: `7 8a 8b 8c 9 10 11 12 13 14 Q0 fim`, 3/3; de volta, uma fase por gesto até Experiences. Na 1.ª
  volta logo depois de carregar, uma vez 10 → 12 (sem repetir).
- Fortes (700 px a 6000 px/s): passam uma fase (o item 1 em aberto); do fundo para trás → 14 (3/3); do topo das Questions para trás →
  13 ou 14; do 14 para a frente → fim (passa o topo das Questions); 6 gestos rápidos seguidos de Experiences → 7, do 14 → fim.
- Perguntas: uma aberta de cada vez (tocar outra fecha a anterior, tocar a aberta fecha), o scroll não mexe; com a 2.ª aberta as marcas
  seguem até ao fim. Menu: *04 Questions* → topo das Questions, *05 Contact* → fim, *03 About* → 12; capítulo *Weddings* → Work.
- **fps:** 14 → Questions (subida do papel + entrada) 86,2 / 88,3 / 88,7, pior fotograma 22–33 ms, 0 acima de 50 ms; Questions → 14
  85,6–87,9 (pior 22–23 ms); pelas Questions e o Contact 89,7.
- **Bug: o papel tapava o Contact e o rodapé (telemóvel).** O papel colado (`sticky`) tem margem negativa de um ecrã, e o `sticky` mede-se
  pela caixa da margem (0 de altura): ficava no topo do ecrã depois do fim das Questions e cobria o Contact e o colofão, com os links
  por baixo dele. → `overflow: clip` nas Questions (sem contentor de scroll: o papel continua colado). Depois: Contact e colofão
  visíveis e os links do índice respondem (Chrome 1920, 1440, 768, 390, 320; Xiaomi; Simulador), overflow 0.
- **Bug: chegar com `#questions` no telemóvel abria no Method** (Chrome 390 × 844: y 10 644 para o topo em 13 799): o browser saltava
  antes de as cenas terem a altura. → `address.ts` trata `#questions` e `#contact` como `#method`/`#about` (salto depois de a página
  estar montada; menu e índice também). Depois: chegar com `#questions` → topo das Questions e com `#contact` → fim, em Chrome 320, 390,
  768, 1440, 1920, Xiaomi e Simulador (4/4); menu certo nos três.
- Depois das duas correções: Xiaomi e Simulador, o percurso normal Experiences → fim e o regresso do fundo (`Q0 14 13`) iguais; typecheck,
  lint, build passam.

**Owner (8/11 noite), três pontos — corrigidos:**
1. *"Precisamos definir uma pausa/paragem no About, senão dás scroll, o About carrega e passa logo para o Questions."* Reproduzido:
   Simulador, gestos a ~0,6 s, `11 → 12 → 12 → 14 → Q` (a passagem do 12 ainda a correr); Chrome 1440 (roda), `12 12 12 14` — a página
   ia às marcas do 13 e do 14 por baixo do 12 e o 12 saltava para 14, sem o 13. → **retenção do 12, como a do 7** (aprovada no iPhone):
   enquanto a luz encontra o retrato (2,4 s × tempo; 3 s no telemóvel) só a marca do 12 fica à frente (`.about[data-passage]`,
   `method.css`); um gesto levado além dela por inércia é trazido uma vez, e no fim da retenção a página volta à marca se a inércia a
   deixou fora (`about-stage.ts`, como `endHold` do Method). Telemóvel e desktop. Nunca num salto (menu, endereço).
   - **Safari desktop:** com só as marcas do 11 e do 12 ligadas durante a retenção, ao acabar a página ia ao **7 do Method** — o Safari
     guarda a paragem pela ordem entre as marcas (a 2.ª de [11, 12] → a 2.ª de todas, o 7). → só se desligam as marcas **depois** do 12;
     as do Method ficam. Depois: certo.
   - **Medido:** Simulador (dedo), do 11 com gestos a 0,4/0,6/1,0/1,5 s: `12 12 13 14 Q` (o 2.º gesto fica no 12); 2 gestos fortes → 12
     (na marca, 2/2); para trás durante a retenção → 11 (2/2, também forte). Chrome desktop (trackpad real): `12 12 13 14 Q`; para trás → 11;
     no fim fica no 12. Safari desktop (trackpad real): `12 12 13 14 Q`; para trás → 11; no fim fica no 12. Bateria inteira do Simulador
     igual à anterior (uma vez, num gesto forte para trás, `13 → 14` — 3 repetições depois: `14 13 12 11 10`, limpo).
2. *"Notei um lag ao carregar o Questions, desktop e mobile."* Medido sem lag de desenho (Chrome 1440 e 390: 119–120 fps, pior
   fotograma 11–25 ms, nenhum *long animation frame*, 1.ª vez e 2.ª; Xiaomi 86–89 fps). O lag era a entrada: começava com o papel quase
   em cima (0,3 s + 1,1 s; a última pergunta ~2,3 s) — o papel chegava vazio (contra a regra 1 do storyboard). → começa com o papel a um
   quarto da subida, a âncora em 0,9 s, as perguntas a 0,35 s + 0,07 s cada (0,6 s): tudo lá ~1,4 s depois. Simulador: a âncora já se vê
   durante a subida; com o papel em cima as perguntas estão a chegar.
3. *"Em mobile ao carregar a cor não fica full screen."* As Questions no telemóvel mediam 765 px num ecrã de 779–835 (Xiaomi): com o papel
   recortado ao fim da secção (a correção de cima), em baixo via-se o carvão do Contact. → `min-height: var(--screen)` no telemóvel.
   Depois: no topo das Questions o fundo do ecrã é papel (Chrome 320, 390, 768; Simulador, até debaixo da barra do Safari).
- Movimento reduzido e sem JS (390, 1440): sem marcas, overflow 0, palavras todas, sem erros. Fim da página e links do índice certos
  (1920–320). typecheck, lint, build: passam.

**Owner, iPhone, fim da noite:** "continuo a ver a cor que não enche no iOS" — o ponto 3 **não está resolvido no iPhone** (passa no
Simulador e no Chrome). Por investigar (handoff, "ABERTO PARA AMANHÃ").

**Não verificado:** o iPhone do owner (pontos 1 e 2); trackpad físico; **o Xiaomi depois destes três** (bloqueou-se a meio). O Contact (estados 19–21) ainda é o esqueleto: no fim da página a barra diz
*04 Questions* e as bordas do Safari ficam da cor do papel por cima do Contact escuro — fica para o M7b.

## Revisão do M7a com o owner, ponto a ponto — 9/11, MacBook (aprovados pelo owner no iPhone)

Vídeos do owner em `docs/development/ios-lab/out/` (2026-11-09T10-18, 10-42, 10-48; só neste Mac). Simulador iOS 27.3 (`v5-iphone`,
402 × 874), Safari 27.2 desktop (1324 × 850). Node 22.23.4 oficial (SHA-256 verificado) no scratchpad: o `/usr/local/bin/node` 20.5 é
antigo demais para o Next 16.3.

1. **A cor que não enchia no iOS (topo das Questions).** Causa: com a página deslocada, o Safari mostra atrás da ilha os 70 px acima do
   ecrã; parado nas Questions, era o fim escuro do About (vídeo 10-18: faixa cinzenta por cima do papel; reproduzido no Simulador).
   - Uma faixa fixa acima do ecrã (`top: -70px`) **não é desenhada** pelo Safari (Simulador, magenta: nada).
   - 1.ª tentativa: o papel prolongado 70 px acima, a aparecer por opacidade nos últimos 70 px da subida (`clip-path` na secção). Certo
     tecnicamente; o owner achou a mudança feia (vídeo 10-42: uma faixa cinzenta translúcida sobre o cartão). Abandonada.
   - **Feito:** no iPhone (com movimento e JS) o cartão sobe mais 70 px e passa por baixo da ilha; a paragem das Questions fica 70 px
     mais abaixo (`about-stage.ts` placeMarks, `address.ts`) e as palavras 70 px mais abaixo no cartão (`questions.css` `--q-lift`). Os
     gradientes do papel são calculados sobre a altura maior (`--q-h`): o ecrã parado é o mesmo (diferença média 0,002/255). Na subida
     vêem-se mais 70 px de papel acima do título. Sem `clip-path` (fica o `overflow: clip`). Simulador: paragem em 14 523 (era 14 453),
     vindo de cima e de baixo; barra *04 Questions*. **Aprovado** pelo owner.
   - Os ícones da barra de estado passam a branco durante a subida e voltam a preto (vídeo 10-48): é o iOS a reagir ao escurecimento do
     About (a-dim). Testado: mesmo com 0,3 de escurecimento (contra 0,85) o iOS já os põe brancos; deixar o topo sem escurecer cria uma
     faixa clara. **Owner: fica assim.**
2. **12 com a fotografia inteira** (vídeo 10-18, 8,5–12 s): voltar ao 12 antes de o 13 acabar de abrir a luz. Causa: o temporizador de
   `setOpen(true, 1750)` não era cancelado no regresso. → `setOpen(false)` no 12 e no regresso ao Method. Simulador (scroll programado,
   12 → 13 → 12): antes, a 700 ms, fotografia aberta no 12; depois, 300/700/1200/1600 ms, luz fechada; ficar no 13 abre. **Aprovado.**
3. **A "segunda pílula" dentro da ilha esquerda.** O Safari (iOS 27.3 e desktop 27.2) passou a aceitar `url()` no `backdrop-filter`: a
   lente (feita para o Chromium) ligava-se, **não desenha nada** (ilha com e sem ela: diferença 0) e o filtro ficava com o mapa de uma
   largura antiga — a pílula (medida: +5–8 de luminância do início da ilha até ~170 px). Desligar/ligar o filtro limpava-a. → lente só
   fora do WebKit (`bar-client.tsx`, `navigator.vendor`). Simulador: 3 cargas e 6 saltos pelo menu sem pílula. **Aprovado.**
4. **O 14 antes das Questions.** Um gesto seguido passava às Questions antes de o texto do 14 entrar. → retenção do 14 como a do 12:
   chegando ao 14 por gesto (do 13 ou do 12), durante 1,6 s (+1 s vindo do 12) × tempo, as marcas das Questions e abaixo desligam-se
   (`.about[data-story] .a-snap[data-at='below']`, `method.css`); para trás livre. Telemóvel e desktop. Simulador (scroll programado):
   para a frente a 0,3/1,2/2 s → fica no 14; depois → Questions; para trás durante a retenção → 13. **Aprovado.**
5. **A barra no Safari desktop** (cor, tremer no 12, o Method a mexer-se nela no 13/14). Gravação a 120 fps (11 → 12 → 13 → 14, scroll
   programado): nada disso com a build sem lente. **A cor do topo do Safari 27.2 (Mac):** ignora `theme-color` e o fundo da página depois
   de carregar; segue um elemento fixo com a largura toda no cimo (uma faixa de teste pintou-o) e não acompanha as mudanças de cor dele.
   Com a lente ligada (cópia na porta 3102) o topo era igual em 5 sítios — não é deste dia. O owner vê o 3100 **certo**; pelo proxy
   (`hud.js`, elementos fixos) via-se errado: **avaliar a cor do topo do Safari desktop sempre sem o proxy**.

Decididos sem trabalho (owner, 9/11): contraste da barra sobre o papel (~3,9 : 1) — um meio-termo mais tarde; o trackpad curto das
Questions para o 14 no Safari desktop — sem problema; o 8 no telemóvel mantém as três paragens; a paragem nas Questions antes do
Contact entra com o Contact (como em todo o site).

typecheck e lint passam; build feita depois de cada ponto. **Não verificado:** gestos reais com o dedo no Simulador (só scroll
programado; o owner validou com o dedo no iPhone), o Xiaomi com estas mudanças, reduced-motion e sem JS desde a revisão (as regras novas
só existem com JS e movimento), as cinco larguras da validação.

## Passagem completa: Xiaomi, Chrome e Safari desktop, telemóvel emulado, reduced-motion, sem JS — 9/11 noite, MacBook

Build com as cinco correções do dia (secção anterior). Ferramentas novas: `docs/development/ios-lab/finger/wheel.swift` (eventos reais do
macOS: roda de rato e trackpad) e `finger/journey.mjs` (a página inteira, gesto a gesto, num Chrome de teste); ver o README do laboratório.

**Xiaomi (Chrome, CDP, toque com inércia; proxy próprio em 3133):**
- Bateria (`xiaomi-strokes.mjs`): normal para a frente `W 7 7 8a 8b 8c 9 10 12 13 14 Q Q` — **uma vez o 11 não apareceu** (10 → 12);
  repetido de propósito 7 vezes (10 → 11 → 12, e 8c → 9 → 10 → 11 → 12 ao ritmo da bateria): sempre certo. Não reproduzido. Para trás,
  normal: uma fase por gesto até Experiences. Gestos fortes (700 px, 6000 px/s) passam fases (`7 8a 8c 10 12 14`; para trás do 7 um
  gesto forte vai até ao topo do Work, que é livre) — já em aberto. Do Work com gesto forte → 7 (6/6). Do fundo, forte para trás → 13 / 14.
  Saltos do menu certos. Vaivém Experiences ↔ 7 coerente.
- fps 6 ↔ 7 (`xiaomi-fps.mjs`, 3 idas e voltas): 81,8–87,7 fps; pior fotograma ~100 ms, 210 ms na 1.ª passagem depois de carregar (as
  duas já conhecidas, iguais a 8/11).
- **Não medido:** a subida do papel (14 → Questions) com o fundo novo das Questions — o Xiaomi adormeceu e o MIUI não deixa acordá-lo
  por adb.

**Chrome desktop (1500 × 913, eventos reais do macOS, `wheel.swift`):**
- Roda de rato, um clique de cada vez: de Experiences 40 px, 40 px, depois 7 e uma fase por clique; 13 → 14 → Questions → fim e de volta
  ao Method: uma fase por clique.
- Trackpad (gesto de 300 px com inércia), de Experiences ao fim e de volta ao topo: **uma fase por gesto em todo o percurso**, nos dois
  sentidos.
- Os eventos `mouseWheel` do CDP davam "preso em Experiences" (a paragem liga a ~90 px da marca e o Chrome encaixa na mais próxima a cada
  evento) e "preso no 14" (a 990 px das Questions): **artefacto do teste**, não acontece com eventos reais. Registado no README do
  laboratório.

**Safari desktop 27.2 (1324 × 850, eventos reais de trackpad):** de cima ao fim, uma fase por gesto do 7 ao 14, Questions, fim; para cima
do 14 ao topo, uma fase por gesto; 60 fps (o ecrã do Safari a 60 Hz), pior fotograma 53 ms (3 acima de 50 ms em ~2 min). Barra certa,
overflow 0. Dois pontos:
- **De Experiences para o 7, gesto de 300 px: entra 3 vezes em 5**; nas outras 2 fica em Experiences e o gesto seguinte entra. A mesma
  mecânica: a paragem liga a meio do gesto (`data-near`, 0,2 ecrã antes da cena; a marca de Experiences a 0,3) e o Safari encaixa na
  marca mais próxima, ainda Experiences. **Não corrigido**: mexe nas marcas do desktop aprovadas a 8/11 — proposta para o owner.
- Das Questions para o 14 três gestos curtos seguidos não chegam (um forte chega): o ponto já aceite pelo owner (9/11, "acho que não há
  problema").

**Chrome com toque emulado (`journey.mjs`):** 390 × 844, 320 × 640, 768 × 1024: uma fase por gesto da entrada ao fim e de volta ao topo;
119 fps, pior 34–75 ms; sem erros. A etiqueta da barra chega depois da fase no 7 (*01 Work*) e no 12 (*02 Method*), e no 11 a subir
(*03 About*): é o atraso desenhado (a barra muda quando a secção está à vista), não um defeito.

**Reduced-motion e sem JS** (`reduced-nojs.mjs`, `next start`): 390 e 1440 — sem paragem, sem marcas, a página percorre-se toda,
overflow 0; sem JS o texto todo (*No templates*, *Made once*, *Talk to us*); sem erros de consola.

**Overflow horizontal:** 0 em 1920, 1440, 768, 390, 320 (amostras a cada meio ecrã, a página inteira). **Texto abaixo de 12 px:** só nas
peças em miniatura do Work e nos ecrãs do Method (`dm-*`, `s-k`, 9–11,9 px) — são imagens de interfaces, como desenhadas; e `w-foot` a
11,5 px a 768. Registado, não mudado.

**Teclado nas Questions (1440):** Tab percorre as perguntas, foco visível (1 px sólido), Enter e Espaço abrem e fecham, `aria-expanded`,
`aria-controls` e a região com `aria-labelledby` certos.

**Uma ocorrência não reproduzida:** numa captura a 390 o endereço `#questions` mostrou o 11 do Method; repetido 7 vezes (à frente, em
segundo plano, depois de outra largura): aterra sempre nas Questions. Provavelmente uma captura tirada com a janela tapada.

**Não verificado:** a subida do papel no Xiaomi; o iPhone do owner com a passagem inteira desta build (o owner validou os cinco pontos);
o Simulador com dedo (só scroll programado); Safari desktop com roda de rato; Firefox.

## M7b — Contact (estados 19–21) e a passagem A (#106) — 9/11 noite, MacBook (por aprovar pelo owner)

Escolha da passagem: storyboard à parte (`docs/design/v5/storyboards/saida-questions/`, https://claude.ai/artifact/6V7KkG5HXtvfWVSGdrij5h),
quatro maneiras com o vídeo da entrada; o owner escolheu a **A** (README #106).

**Construído:** `src/components/contact/` (servidor + ilha): a sala (poster da entrada, o mesmo ficheiro de vídeo pedido só ao aproximar,
véu de carvão e uma luz quente baixa), a pergunta aprovada, a linha das horas (chegada + agora, ao minuto), **Talk to us →** (ig.me) e o
endereço em texto; o colofão (*Built around you.* / *Built around Ana.*, *Chapter One · 2026*, índice `#index`, Instagram e Telegram). A
passagem: as Questions ganham um ecrã de papel no fim, o Contact fica por baixo dos seus dois últimos ecrãs (a sala a partir de um ecrã
antes da passagem, por cima do About e por baixo do papel), e o papel e as últimas perguntas desvanecem enquanto a pergunta sobe
(`animation-timeline` da cena do Contact); no fim o colofão entra e a cena sobe para lhe dar lugar (no telemóvel por quanto o colofão
cobre de facto, medido). Paragens: Questions (de 0,75 em 0,75 ecrã até ao último ecrã de perguntas, se mostrar ≥ 0,35 ecrã a mais) →
Contact → fim. A barra diz *05 Contact* (marca com altura até ao fim da página). Sem JS / movimento reduzido / Firefox: tudo em fluxo.

**Encontrado e corrigido durante a construção:**
- **Regressão de hoje de manhã (no commit `602858d`):** no Chrome o papel das Questions perdia o fundo (`background-image: none`) — o
  Chrome rejeita um gradiente radial com tamanho `calc()` de percentagem e comprimento; via-se só a cor lisa da secção. Agora os
  gradientes originais em todo o lado e a versão recalculada (`--q-h`) só no iOS. **Esteve assim no Chrome e no Android desde de manhã.**
- O About e a cor da página viam-se por trás do papel a desvanecer → a sala presa um ecrã antes, camadas About 3 · sala 4 · Questions 5
  · palavras 6; no telemóvel a sala só aparece quando as Questions acabaram de subir (senão vinha 70 px à frente do papel).
- A linha do tempo da passagem na secção inteira (mais alta do que o ecrã) dava 0,31 a meio → na cena da pergunta.
- A marca do Contact com 0 px: um salto passava-a e a barra ficava em *04 Questions* (Chrome 390) → altura até ao fim.
- No iPhone o colofão (com o espaço da barra do Safari) tapava o botão → a subida da cena medida a partir da altura real do colofão; o pé
  do colofão `100lvh − 100svh` (o `--room` do iOS contava os 130 px das cenas presas).
- Chegar diretamente ao Contact mostrava só o filme até o script correr (a pergunta escondida à espera da entrada) → só se esconde quando
  o Contact ainda está abaixo do ecrã ao arrancar.
- Uma paragem a mais nas Questions no iPhone (142 px abaixo da primeira) → só com ≥ 0,35 ecrã.

**Medido:**
- Chrome (capturas a 1440, 390, 320, 768, 1920): a passagem (papel → filme, a pergunta a subir), a paragem do Contact e o fim nas cinco
  larguras; overflow 0; o filme toca à vista (`c-playing`) e pára fora — no Chrome de teste com a janela atrás o vídeo não carrega (é o
  Chrome a poupar, não o site).
- Chrome toque 390 (passagem completa): uma fase por gesto até Questions → Contact → fim, 119 fps, sem erros. **Para cima a partir do fim,
  um gesto de 320 px passa o Contact e vai às Questions** (o colofão mede 260 px no telemóvel; gestos de 120–200 px param no Contact).
- Safari desktop (trackpad real): 14 → Questions → Contact → fim e de volta, uma fase por gesto, exceto **Questions → Contact, que pediu
  dois gestos** (um ecrã de distância; o mesmo do 14 → Questions, a afinar com a subida). O filme toca.
- Simulador iOS 27.3: a passagem, o filme, *05 Contact*, a ilha escura ao carregar no Contact. **Com saltos programados a zona da ilha
  ficava com a cor das Questions** (o Safari não a atualiza sem um scroll real): por ver no iPhone, com o dedo.
- Movimento reduzido (390, 1440): sem paragem, sem marcas, overflow 0. Sem JS: a pergunta, o botão (`ig.me`), o endereço, o colofão e o
  índice no HTML; sem erros de consola. typecheck, lint, build: passam.

**Não verificado:** o iPhone do owner (passagem, ilha, filme), o Xiaomi (adormecido: fps da passagem e do filme), 320 e 768 com toque
de ponta a ponta (só capturas), Firefox (sem `animation-timeline`: fica em fluxo, não visto).

### M7b — refeito depois do vídeo do owner (10/11 manhã)

Vídeo do owner (iPhone, `ios-lab/out/2026-11-10T09-55-42…`): "tem vários bugs… o implementado não está como definimos". Lido
fotograma a fotograma; reproduzido no Simulador **com dedo real** (Device Hub + `simtouch`, proxies próprios 3134/3135 para que outros
separadores não respondam à consola).
- **Não era o storyboard A:** a pergunta subia com a página por cima do papel ainda claro; no iPhone **o colofão via-se já na paragem do
  Contact**, por baixo do botão e sobreposto (o ecrã visível do iPhone é mais alto do que `100svh`). → a cena do Contact fica presa desde
  o início do Contact, invisível; o colofão só começa `2 × --screen + 50svh` depois.
- **A luz apagava-se de uma vez no iPhone** (o encaixe leva a página em ~0,3 s e a passagem estava presa ao scroll) e **ao voltar o Safari
  deixava a animação de scroll em 0,91**: as Questions invisíveis na sua própria paragem. → a passagem passa a ser **tocada**: quando o
  início do Contact passa meio ecrã (`.c-dusk`; volta a 0,7) o papel desvanece em 1,4 s, a pergunta entra aos 0,9 s, a linha e o botão
  aos 1,6 s; para trás saem em 0,4 s e o papel volta em 0,9 s.
- Tocada com **transições CSS**: o iOS cortou-as (o papel saiu de uma vez, a pergunta já inteira; README #90, #91). Com **Web Animations**:
  começada durante a inércia do encaixe, o iOS deixava a pergunta em 0 até ao gesto seguinte (relógio a correr, nada no ecrã; 2 vezes em
  3 corridas). → **o script desenha a passagem fotograma a fotograma** (opacidade e uma subida curta, quatro camadas, ~2,5 s; os estados
  finais ficam no CSS). Repetido o caso que falhava 3 × 3: a pergunta e a linha sempre a 1.
- **Do colofão para cima um gesto normal passava o Contact** (o colofão tem 230–260 px): o meio ecrã a mais acima resolve.
- Chegar com `#contact`: a luz já em baixo antes do script (`sequence.ts` põe `c-dusk c-lit`), as palavras visíveis até a ilha correr.

**Medido depois:**
- Simulador iOS 27.3, dedo real: 14 → Questions → Contact (a luz baixa, a pergunta, depois a linha) → fim (colofão sem sobrepor) → Contact
  → Questions (a luz volta) → 14, uma fase por gesto, também com gestos de 320 pt; a ilha e a barra de baixo escuras no Contact.
- Safari desktop 27.2, trackpad real (gestos de 400): 14 → Q → Contact → fim e de volta, uma fase por gesto (Q → Contact passou a ir
  num gesto); Contact ↔ fim 3 × 3. `#about`, `#questions`, `#contact` aterram (4/4; 2/2 com a janela atrás e trazida à frente). Duas
  aterragens no topo vistas antes não se repetiram.
- Chrome desktop 1500 × 913, trackpad e roda reais: 14 → Q → Contact → fim e de volta, uma fase por gesto/clique; o filme só toca no fim.
- Chrome toque 390 e 320, a página inteira: uma fase por gesto até ao fim e de volta ao topo (agora também fim → Contact → Questions),
  119 fps, pior fotograma 49–50 ms, sem erros.
- typecheck, lint, build: passam.

- **Xiaomi** (Chrome, CDP, toque com inércia; 3 corridas 14 → Q → Contact → fim → Contact → Q): paragens sempre certas; a passagem
  Q → Contact 80,4–81,5 fps (ecrã 90 Hz), pior fotograma 33–44 ms; Contact → Q 77,2–79,2 fps, pior 33–44 ms. **O filme tocava nas
  Questions, escondido por trás do papel** (a secção começa dois ecrãs antes) → toca só a partir do início do Contact, 15 % dentro do ecrã;
  medido depois: parado nas Questions, a tocar no Contact; a passagem 80,4–80,7 fps, mas em 2 de 3 corridas **um fotograma de 58–67 ms**
  quando o filme arranca (por baixo do papel a escurecer). Trocado de propósito: menos bateria e processador nas Questions.

**Não verificado:** o iPhone do owner; 768 com toque de ponta a ponta.
- **A barra sobre as Questions com letra branca, ilegível** (owner, iPhone, 10/11) — regressão do Contact: a camada das palavras do Contact
  (`.c-hold`, transparente, z 6) estava sobre o ecrã inteiro das Questions; a barra lê o brilho pelo que está por cima (`data-lum` do
  Contact, 0,1) e punha o vidro leve sobre o papel; e **apanhava os toques** destinados às perguntas. → `pointer-events: none` na camada
  (só o botão, o endereço e o colofão recebem toques); com a luz em baixo as Questions dizem à barra 0,1 (o escuro do Contact). Medido:
  Questions — vidro 0,50 com o contorno para papel claro (Simulador, Chrome 390 e 1440, Xiaomi); Contact — 0,06; um toque numa pergunta
  abre-a (Simulador com dedo, Xiaomi com toque).

### M7b — a passagem como o storyboard A e as bordas (owner, vídeo do iPhone das 13:22, 10/11)

O owner: "não ocupa full screen", "a transição não está igual ao storyboard e as cores especialmente das bordas topo e fundo ficam
bugadas na transição". Visto no vídeo (`ios-lab/out/2026-11-10T13-23-18-…mp4`, fotograma a fotograma e com cores medidas):
- **As perguntas subiam com a página** meio ecrã antes de a luz baixar e apagavam-se a sair do ecrã; no storyboard A ficam no lugar e
  desvanecem. → a caixa das perguntas **presa onde está** durante o último ecrã de papel (`questions.css`, `position: sticky` à altura da
  sua paragem, −70 px no iOS; com uma resposta aberta que passe o fundo do ecrã, presa quando o fim da lista fica a 18 `--p` do fundo do
  ecrã visível, `--q-foot` medido em `questions-client.tsx`). Dois pormenores: o ecrã a mais deixou de ser `padding-bottom` da secção
  (um sticky fica dentro da caixa de conteúdo do pai: sobre o padding as perguntas continuavam a subir, Simulador) e passou a um bloco
  `::after`; no desktop a caixa ocupa as duas linhas do grid, como o papel (um item de grid só fica preso na sua área: subia 105 px,
  Chrome 1440).
- **A faixa debaixo da barra do Safari e a zona da ilha** (vêm de `html`/`body`) ficavam na pedra do papel enquanto a sala já escurecia
  (no vídeo: borda `#c2b9aa` sobre página `#968f83`) e depois passavam a escuro de uma vez: é isto o "não ocupa o ecrã inteiro". →
  `sequence.ts`: com a luz em baixo (`c-dusk`) as bordas das Questions são o carvão, mudadas com o papel — no iOS uma transição de
  `background-color` de 1,1 s com a curva do papel e começada 0,1 s dentro (o Safari pinta a faixa ~1 fotograma depois); de volta 0,9 s
  depois de 0,15 s, como o papel. No Android muda de uma vez (a transição repintava a página, #103).

**Medido (Simulador iOS 27.3, dedo real, gravado a 60 fps, cores lidas a 20 fps):**
- As perguntas: paradas (topo da caixa −70 px antes, durante e depois) até desaparecerem; a pergunta do Contact a seguir. Com a última
  resposta aberta: presa a −113 px, a lista inteira visível; um gesto leva ao Contact e outro traz de volta a −70.
- A borda de baixo contra a página logo acima (soma RGB): **antes até 133 durante ~0,6 s**; com 1,4 s 109–133; com 1,1 s 116; com
  1,1 s e −0,1 s **≤ 77 por ~0,3 s, ≤ 30 no resto**; no fim 2–12. A volta: ≤ 19. A ilha (topo) segue igual.
- No Contact, parado, a ilha fica `#1e1c1a` e a sala logo abaixo da barra `#2e2c28` (diferença 46, a sala tem o céu do filme por baixo
  do véu); a faixa de baixo 9. Deixado assim (o Safari só aceita uma cor para as duas).
- Chrome (CDP) 390 toque: a caixa a 0 px durante toda a passagem e na volta. 1440 × 900, 1280 × 720, 1920 × 1080: presa a 0 até ao fim
  da secção (sondado de 0 a 900 px de scroll: 0 px; a 1000 px −100, já fora da secção); com a roda sintética (rajada de 20 eventos)
  o gesto passa ~100 px além da paragem e volta, e a caixa acompanha esse excesso enquanto desvanece.
- typecheck, lint, build: passam.

**Não verificado:** o Xiaomi (não estava ligado ao adb); o Safari desktop com o trackpad real; o iPhone do owner.

### M7b — o Contact de ponta a ponta do ecrã; o fim da página (owner, iPhone 16:35 e Safari desktop 16:39, 10/11)

O owner: (1) "o vídeo continua a não estar full screen nem na zona da ilha nem em baixo, vejo claramente barras de cor"; (2) "ao forçar
scroll para o fim consigo ver o ajuste da cor no fim aos saltos"; (3) no desktop "um traço tipo risco no ecrã com o scroll no contact" e
"um ajuste no fim". Medido nos vídeos (cores linha a linha; o desktop varrido a 30 fps à procura de linhas escuras de lado a lado):
- (1) A zona da ilha e a faixa debaixo da barra do Safari são pintadas pelo Safari **numa cor lisa** (62 pt cada no Simulador, fora do
  ecrã da página; com a barra aberta a de baixo cresce 40 px): nunca mostram o filme. O filme acabava nelas a seco (topo `#1b1b19` →
  filme `#24–2e`), duas barras. → como a entrada (#86): **o filme nasce dessa cor** em cima (130 px) e volta a ela no fundo do ecrã
  (os últimos 110 px até `100dvh`, que acompanha a barra), só no iOS; a cor das bordas no Contact passou a ser a da sala (`#1b1c1a`,
  `sequence.ts`). Uma primeira rampa a acabar em `100svh − 30 px` comia ~190 pt do filme em baixo; corrigida.
- (2) No iPhone, no fim, o salto elástico levava o fim da página (o colofão) para cima da cena presa: *Built around you.* sobre o
  endereço. E com a barra do Safari aberta (ecrã 40 px mais baixo) o colofão ficava sobre o endereço mesmo parado: a subida da cena era
  medida uma vez, com a barra recolhida. → **sem salto elástico** no iOS e com rato/trackpad (`overscroll-behavior-y: none` em `html`;
  no Android com toque fica, é o gesto de recarregar); a subida da cena calculada no CSS com `100dvh` (`--c-below`, `--c-colo` medidos).
- (3) O risco: uma faixa preta de ~20 px no fundo do ecrã, só durante o salto elástico no fim da página (1,8 s, 4,5–7,5 s do vídeo). Sai
  com o salto.

**Medido depois:**
- Simulador iOS 27.3: no Contact, do topo ao fundo, a cor passa da faixa lisa ao filme sem degrau, com a barra recolhida e aberta
  (capturas). No fim, gestos forçados para baixo e um para cima: o espaço entre o endereço e o colofão nunca abaixo de 24 px (588
  fotogramas), com a barra recolhida (ecrã 754) e aberta (714).
- Safari desktop 27.2, trackpad real (`wheel.swift`): no fim, 4 gestos forçados — a página fica parada; 0 fotogramas com linha escura
  em 240.
- typecheck, lint, build: passam.

**Não verificado:** o Xiaomi (não ligado ao adb); o iPhone do owner.

### M7b — outra abordagem: o comportamento de um visitante real, medido em vez de adivinhado (owner, vídeo do iPhone 17:03, 10/11)

O owner: (1) as barras na ilha e em baixo "ainda pior"; (2) no fim "se forçar continua a forçar"; (3) o risco ainda no 3100, Safari e
Chrome. Pedido: testar como um utilizador (gestos normais e forçados, ida e volta, Questions → Contact → fim e de volta) no Chrome, no
Safari, no Simulador e no Xiaomi, e ver com os olhos. Cada causa foi primeiro **medida**:
- **(1) De onde vem a cor das faixas no iOS** (Simulador, sondas): `html`/`body` pintados a verde → as duas faixas verdes; o fundo da sala
  a vermelho → nenhuma; o véu a azul → só a página. **As faixas são sempre a cor da página, lisas; o filme nunca lá chega** (o Safari
  reserva-as, #85). A rampa de 16:4x escurecia 130 px do filme junto à ilha: daí "pior". → a cor da página no Contact **é a do próprio
  filme no topo do ecrã, lida do fotograma que está a passar** (8 × 2 px de 0,7 em 0,7 s, com o véu calculado por cima; `top-colour.ts`
  passa a ler vídeo; `contact-client.tsx` põe `data-edge`, `sequence.ts` pinta, 0,6 s); sem rampa em cima; em baixo o filme vai para essa
  cor nos últimos 110 px. Medido no Simulador, parado no Contact: faixa da ilha contra o filme logo abaixo **9–12** (soma RGB; antes 46–62).
- **(2) No fim**: (a) com `100dvh` (16:4x) cada gesto forçado mostrava/escondia a barra do Safari e a pergunta saltava 40 px → a subida da
  cena volta a uma medida fixa, a do ecrã mais pequeno (`100svh`): a cena não salta; com a barra recolhida o colofão fica 40 px mais
  abaixo. (b) a paragem do fim era "fim da página − altura do ecrã" medida uma vez: com a barra do browser noutro estado ficava 40 px
  (iPhone) / 56 px (Xiaomi) antes do fim → **a marca do fim está agora no pé da página e alinha pelo pé** (`scroll-snap-align: end`):
  verificado no Xiaomi (o pé da marca no pé do ecrã com a barra à vista, 779). O que sobra é a barra do browser a entrar e sair, como em
  qualquer site.
- **(3) O risco**: gravado o Chrome desktop a 30 fps e procuradas linhas de lado a lado em todos os fotogramas: **a única é o filete do
  colofão** (`border-top`, do storyboard), que subia sobre o filme com o gesto. → o colofão entra a desvanecer e o filete só no último
  quinto da entrada. Medido: Chrome — antes cruzava ~55 linhas do ecrã com contraste 6–12; agora só as últimas 14, em 0,3 s, a crescer.
  Safari desktop — 0 linhas escuras em 450 fotogramas; a sair o filete some logo, a entrar aparece nas 1–2 últimas linhas.
- **Encontrado no Xiaomi a testar (não reportado):** aterrar em `#questions` deixava **o papel vazio, sem as perguntas**. O browser
  entrega duas leituras de uma vez ao observador (fora do ecrã, antes do salto; dentro, depois) e o código lia só a primeira. Corrigido
  em todos os observadores de um só elemento (Questions, Contact — o filme e as palavras —, Work — a rotação dos momentos —, entrada — o
  vídeo —, Method — a pré-descodificação): lêem a última. Medido: as perguntas aparecem ao aterrar.

**Medido depois (o percurso de um visitante):**
- Simulador iOS 27.3, dedo real, gravado: Q → Contact → fim → 3 gestos forçados → pequeno para cima → Contact → Q → ida-e-volta rápida →
  dois gestos rápidos. A cena não salta no fim; a ida-e-volta rápida (0,6 s) 4/4 de volta às Questions; ida e volta calmas 3/3 certas.
- Xiaomi (Chrome, toque CDP com inércia): o mesmo percurso; as perguntas presas a 0 px enquanto se vêem; colofão nunca a menos de 24 px do
  endereço; ~84 fps, pior fotograma 44 ms, 0 acima de 50 ms (antes desta volta 89 ms).
- Chrome e Safari desktop, trackpad real (`wheel.swift`): Q → Contact → fim → volta; nenhuma linha a atravessar o ecrã.
- typecheck, lint, build: passam.

**Visto e deixado:** o Safari desktop, com o endereço mudado por AppleScript para `#questions`, aterrou no topo 2 vezes em 2 (já às 16:49,
antes destas mudanças) — por investigar. Uma vez no Simulador um gesto para cima a meio da inércia passou as Questions até ao About (não
repetido em 4; é o tema dos gestos rápidos em todo o site, #103-16).
**Não verificado:** o iPhone do owner.

### A passagem por máscara, opção C — o custo medido (lab7, Xiaomi, 10/11)

O owner prefere a C do storyboard `saida-mascara` (o filme atravessa o ecrã de lado, borda suave oblíqua) mas teme o custo, com o filme a
tocar por baixo. `ios-lab/labs/lab7.html` (`/__diag/lab7?m=…`): ecrã inteiro do telemóvel, o papel das Questions, o filme do site a tocar
(720 × 1280) com o véu, e a passagem de 1,2 s, ida e volta, três vezes por corrida, por três maneiras:
`mask` — a máscara redesenhada a cada fotograma (como o storyboard); `slide` — uma janela com a borda suave fixa, deslizada por transform,
e o filme lá dentro deslizado ao contrário (fica parado no ecrã): só transformações; `clip` — `clip-path` a cada fotograma, borda dura
(referência). `&still` — o filme parado durante a passagem.

| maneira (3 corridas × 3 passagens) | fps | pior fotograma | > 25 ms | > 50 ms |
|---|---|---|---|---|
| mask, filme a tocar | 90,3–90,5 | 11–22 ms | 0 | 0 |
| slide, filme a tocar | 90,5 | 11 ms | 0 | 0 |
| clip | 90,4–90,5 | 11–13 ms | 0 | 0 |
| mask / slide, filme parado | 90,5 | 11 ms | 0 | 0 |

Ecrã de 90 Hz: as três ficam no máximo. Visto nas capturas a meio: `mask` e `slide` iguais (a `slide` precisou da borda transparente nos
primeiros 45 vw da janela, senão via-se o lado da janela, por ser oblíqua). **Não medido:** o site inteiro (a barra de vidro ao vivo por
cima do filme a mudar), o iPhone (risco de piscar com máscara sobre vídeo, a ver no Simulador e no iPhone do owner).

### M7b — a passagem E (README #107), testada como um visitante (10/11)

**O que mudou:** o Contact passa a ser uma camada própria por cima das Questions (`contact.css`: `z-index: 6`, sem toques a não ser
nos links); o papel das Questions escurece por uma camada `.q-dim` (`questions.tsx`, `questions.css`); a passagem é um só progresso de 0 a
1 que desenha as rampas da E do storyboard (`contact-client.tsx`): as perguntas saem (0–0,2), o papel escurece (0,06–0,46), o filme
acende-se (0,42–0,7), a pergunta (0,62–0,84), a linha e *Talk to us* (0,82–1); 3 s a ir, 2 s a voltar, ×4 se a página já passou a
paragem seguinte. Começa assim que um gesto leva a página 15 % do caminho entre as duas paragens, para o lado da outra (antes: só com o
início do Contact a meio do ecrã — um gesto lento ou curto não mexia nada durante meio ecrã e voltava). Saíram os remendos das faixas do
iPhone (cor lida do filme, rampas). **Encontrados e corrigidos a testar:** um toque no escuro do Contact abria uma pergunta invisível
(as perguntas, apagadas, ainda recebiam toques → `pointer-events: none` com a luz em baixo); o Safari desktop aterrava no topo com
`#questions`/`#contact` (a entrada limpava o endereço ao ver-se inteira no carregamento, antes do salto → só limpa depois de o
visitante ter saído e voltado ao topo): 4/4 aterragens certas.

**Medido:**
- **Ecrã inteiro no iPhone** (Simulador iOS 27.3): parado no Contact, as linhas debaixo da ilha variam com o filme (não há faixa lisa), e
  em baixo também; no fim da página o filme vai até à ilha; em baixo a página acaba na cor da sala, igual ao filme ali.
- **Simulador, dedo real, gravado:** normal, rápido (fling) e lento, para a frente e para trás: paragens certas; a sequência como no
  storyboard (papel → escuro → filme → pergunta → linha; e ao contrário). Um gesto lento que não passa meio caminho volta às Questions, e a
  passagem desfaz-se com ele. Dois gestos rápidos (1,0 s) chegam ao fim (uma vez em três ficou no Contact; não repetido em 2 depois).
- **Chrome desktop 1500 × 913, trackpad real (`wheel.swift`):** gesto normal, lento (150 eventos em 1,2 s) e rápido, ida e volta; roda de
  rato: tudo certo. Um gesto **rápido para cima a partir do fim** passa o Contact e vai às Questions (3/3) — igual com a marca do fim antiga:
  é o tema dos gestos rápidos em todo o site (#103-16), não desta passagem. Vidro da barra: 0,50 sobre o papel, 0,06 no Contact.
- **Safari desktop 27.2, trackpad real:** normal, lento, rápido, ida e volta, e roda: tudo certo (aqui também o rápido para cima a partir
  do fim pára no Contact). Gravado: a sequência da E.
- **Xiaomi (Chrome, toque com inércia, CDP):** normal, lento e rápido, ida e volta; dois gestos até ao fim e volta: paragens certas.
  83,9 fps em média (ecrã 90 Hz), pior fotograma 66 ms, 2 acima de 50 ms em 3 599 (quando o filme arranca).
- typecheck, lint, build: passam.

**Não verificado:** o iPhone do owner; 768 com toque; movimento reduzido e sem JS depois desta mudança (a estrutura sem movimento não
mudou; o `.q-dim` sem JS é um `span` vazio).

## M7b — o que faltava depois da E — 11/11, MacBook (build de 10/11 19:05, por commitar)

- typecheck e lint: passam (sem avisos). A build no 3100 é a de 10/11 19:05; nenhum ficheiro de `src/` ou `content/` mais novo.
- **Movimento reduzido** (Chrome de teste :9223, `next start`), 390, 768, 1440, 320: sem paragens (a página percorre-se em passos de
  meio ecrã sem ser puxada), chega ao fim, overflow 0, nenhum vídeo carregado; a pergunta do Contact, *Talk to us*, a assinatura do
  colofão, os links do índice e as Questions visíveis (opacidade 1, no ecrã, sem nada por cima).
- **Sem JS** (mesmas larguras): o mesmo, sem `data-js`; *No templates*, *Made once*, *Is there something*, o endereço e *Talk to us*
  (em maiúsculas pelo CSS; o `href` é `ig.me`) no texto. Sem erros de consola.
- **Toque emulado com inércia** (`chrome-strokes.mjs` com as fases Q/C e o fim, 20 gestos de ida e 20 de volta):
  768 × 1024 — `W W 7 8a 8b 8c 9 10 11 12 13 14 Q C C·fim …` e de volta `C Q 14 13 … 7 W…`; 390 × 844 — igual. Uma fase por gesto
  nos dois sentidos, overflow 0 em cinco pontos da página.

**Não verificado:** o Xiaomi (não estava ligado); Firefox; o iPhone do owner (lista do handoff de 10/11, a testar agora).

### As bordas do iOS na passagem E — 11/11, MacBook (vídeo do owner 13:43)

- **Owner:** "na transição do contact para o questions em cima na ilha dinâmica ele muda uma parte já para a cor do questions antes de
  fazer a transição; a mesma coisa do questions para contact".
- **Medido no vídeo** (luminância média por fotograma, 15 fps: faixa da ilha y 0–30 px contra a página y 330–400 px): Questions →
  Contact, a ilha escurece aos 17,03 s (209 → 176) com a página a 205, ~0,35 s à frente; Contact → Questions, a ilha clareia aos 20,9 s
  (32 → 92) com a página a ~40, que só clareia aos 21,97 s: ~1 s à frente.
- **Causa:** as bordas eram uma transição CSS de tempo fixo (`sequence.ts`: 1,1 s a sair rápida, 0,9 s depois de 0,15 s na volta) e o
  papel segue o progresso da passagem (`contact-client.tsx`: o escurecer entre 0,06 e 0,46 do caminho, a sala entre 0,42 e 0,7; 3 s e 2 s).
- **Correção:** no iOS a passagem pinta as bordas a cada fotograma, com a cor do topo do ecrã (papel `#dcd5c8`, o escurecer `#141412`,
  a sala `#1b1c1a`, nas mesmas rampas); o `sequence.ts` cede-lhas enquanto `data-c-run` está posto. Custo igual ao da transição (o fundo
  da página repintado a cada fotograma, só no iOS).
- **Simulador (iPhone 17 Pro, iOS 27.3, dedo real, gravado):** volta 2,73–3,27 s ilha 31 → 215, página 33 → 211; ida 7,07–8,0 s ilha
  216 → 26, página 217 → 29 — nos mesmos fotogramas. Resta, no começo da volta, ~0,5 s com a ilha um pouco mais escura que o filme
  (30 contra 45): a cor usada é o escuro da sala, o filme sob a ilha é um pouco mais claro.
- typecheck, lint, build: passam.

**Ponto 1 do owner (uma "barra de cor" a subir com o colofão):** não reproduzido. No Simulador, gesto do Contact para o fim, gravado: só
o colofão sobe; a sala fica parada (medido: `.c-room` −70..884 px na paragem e no fim). No vídeo do owner (6,7–7,1 s) também não se mede
uma faixa a subir na margem esquerda. Pedido ao owner o segundo do vídeo.

**Não verificado:** o iPhone do owner; o Xiaomi (desligado; esta mudança só corre no iOS).

### A sala do Contact presa até às Questions (`--c-reach`) — 11/11, MacBook (vídeo do owner 14:09)

- **Owner:** Questions → Contact bem; "o scroll do contact para o questions não está bem, o vídeo desce, vê-se uma barra em cima e depois
  faz a transição". Pediu para investigar antes de corrigir.
- **Medido no Simulador** (a cada fotograma: topo da sala, da secção, da cena, opacidade da sala): na paragem do Contact a sala está a
  −70 px (atrás da ilha) e a secção a −884; na volta, a secção chega às Questions só a −28 px do topo e a sala (sticky) não sai dela:
  nos últimos 42 px do gesto a sala desce com a página (−70 → −28) com opacidade 1, e só depois se apaga (6,0 s). É o vídeo a descer e a
  faixa da ilha descoberta.
- **Tentado e medido sem efeito:** margem negativa na sala (o WebKit mantém um sticky dentro da secção; com `flow-root` também).
- **Correção:** a secção começa `--c-reach` (50svh) mais acima; a marca `c-start` e o fluxo da sala compensam. Antes/depois (Simulador):
  cena 14495, `c-start` 15379, colofão 16620, altura da página 16910 — iguais.
- **Depois, build:** Simulador, C → Q → C → fim → C com dedo real: a sala a −70 em 991/991 fotogramas. Chrome 390 com toque, 20 gestos de
  ida e volta: as mesmas paragens (Q 13799, C 14575, fim 15257), overflow 0. lint, build: passam.

**Ponto 3 (o colofão):** os fotogramas do vídeo das 14:09 não mostram nada a mexer além do texto e do filete por cima de *Built around
you* (diferença entre fotogramas 4,6 s e 6,0 s; perfis de luminância nas margens: estáticos). Imagem para o owner apontar:
`docs/development/ios-lab/out/colofao-fotogramas-11nov.png`.

**Não verificado:** o iPhone do owner; o Xiaomi (desligado).

### O fundo do ecrã no fim da página, iPhone (`.c-shade`) — 11/11, MacBook

- **Owner (14:09 e depois):** "ao subir o texto em baixo ele ajusta uma barra de cor"; também no Simulador. Pediu para parar os remendos,
  avaliar o componente e testar visualmente.
- **Visto no Simulador:** capturas a 0/30/50/70/85/100 % do caminho Contact → fim, e o gesto real gravado: no fim, uma faixa lisa no fundo
  do ecrã, por baixo de *05 Contact*, a crescer com o texto.
- **Prova:** a sala trocada por riscas e a página pintada de magenta — a sala não se mexe (−70..884, riscas paradas), e só no fim da
  página a zona por baixo da barra do Safari fica magenta: o Safari não pinta nada abaixo do fim do documento, pinta a cor da página.
  Em RGB (vídeo do owner e Simulador): por baixo da barra 27,27,24 (o `#1b1c1a`), o filme logo acima 24,24,22 — uma faixa mais clara e mais
  fria, a aresta a subir nos últimos ~60–100 px de scroll. Não é o texto do colofão.
- **Correção:** `.c-shade` na sala (só iPhone, com movimento e linhas de scroll): do pé do ecrã mais pequeno (100svh) para baixo a cor
  `#1b1c1a` lisa, com 160 px de transição por cima, a entrar com o colofão (opacidade na linha `--c-end`, inteira aos 60 % da entrada).
  `timeline-scope: --c-end` passou da `.c-hold` para a `.contact` (a sala está fora da `.c-hold`).
- **Depois, build, Simulador:** opacidade 0 na paragem do Contact, 1 no fim; no fim do 740 pt ao fundo tudo 27,27,24, por baixo da barra
  também — sem aresta (gravado, fotograma a fotograma).
- **Chrome:** a cena continua a subir com o colofão (1440: escala 0,79, −81 px; 320: −71 px; 390: `--c-up` 0, como antes). `.c-shade`
  não aparece fora do iOS. typecheck, lint, build: passam.

**Não verificado:** o iPhone do owner com o filme a tocar (no Simulador o filme não toca: vê-se o cartaz); o Xiaomi (desligado).
- **Revisto (owner: "se fizeres scroll para frente e trás no fim consegues ver o filtro a ajustar-se por baixo"):** ligado ao scroll, o
  escurecer via-se a crescer e a diminuir a cada gesto. Agora é fixo (sem animação; `timeline-scope` de volta à `.c-hold`). Na paragem do
  Contact, com e sem ele, no mesmo fotograma do filme: iguais à vista (Simulador). Vaivém Contact → fim → Contact → fim gravado: do 740 pt
  ao fundo 27,27,24 em todos os fotogramas, na paragem e no fim (as linhas 780–820 com 58/46 são os botões da barra do Safari aberta).
  lint, build: passam.

### O fundo do ecrã em gestos rápidos no fim (o filme cortado no 100svh) — 11/11, MacBook + iPhone do owner

- **Owner:** "se fizeres scroll rápido no fim para frente e para trás continuas a ver o filtro a ajustar em baixo"; pediu para ver o
  acontecimento e interpretar o código.
- **No iPhone do owner (16:53):** gravador por fotograma na página (consola remota, 4289 fotogramas) + gravação do ecrã. A sala e o
  escurecimento nunca se mexem (−70 e 554 em todos); a área visível alterna 714 ↔ 754 (a barra do Safari abre e fecha). No vídeo, em
  fotogramas soltos (1,77, 2,33–2,40, 2,83, 3,37, 3,83 s), uma faixa escura avermelhada com textura no fundo do ecrã (linhas 810–870 pt,
  valores 11–17 contra 24–26), a aresta à altura da barra do Safari.
- **Reproduzido no Simulador** (a mesma faixa, os mesmos fotogramas de transição da barra): é o filme cru. O filme e o cartaz vão até
  884 px, abaixo do fim da página; quando a barra abre ou fecha, o Safari mostra essa zona antes de pintar lá as camadas desenhadas (o
  véu, o escurecimento) — o vídeo, camada própria sempre inteira, aparece sem eles durante 1–3 fotogramas.
- **Correção:** `clip-path: inset(0 0 calc(100% − --c-lift − 100svh) 0)` no cartaz, no filme e no véu (iPhone): cortados onde o
  escurecimento já é sólido; o mesmo tamanho e o mesmo enquadramento. Por baixo só fica a cor lisa da sala, igual à da página.
- **A/B no Simulador** (8 gestos rápidos, ida e volta, filme a tocar, dedo real): sem o corte 3 fotogramas com a faixa; com o corte 0.
  Build: duas séries de 8 gestos, 16 aberturas/fechos da barra, 0 fotogramas com a faixa. Os restantes desvios no fundo são os botões da
  barra do Safari (iguais nas duas versões). lint, build: passam.

**Não verificado:** o iPhone do owner com a build nova; o Xiaomi (desligado; a regra é só do iOS).

## M7b — passagem completa do Contact: Xiaomi, Chrome e Safari desktop — 11/11 fim da tarde, MacBook (build com `--c-reach`, `.c-shade` e o corte)

Owner: no iPhone "pareceu ok". Estado verificado em cada paragem (`cstate.js`: secção, `c-dusk`, opacidade da sala, da pergunta, da linha,
das perguntas das Questions, do colofão no fim, etiqueta da barra, overflow) — nenhuma incoerência em nenhum dos testes abaixo.

**Xiaomi Mi 11 Lite (Chrome, 392 × 779, toque com inércia por CDP, `?wake`):**
- Normal (320 px) e médio (500 px): Q → C → fim e fim → C → Q → 14 → 13, uma paragem por gesto; repetido 3× de cada ponto: 18/18.
- Arrasto lento sem largar com força: 30 % do ecrã volta às Questions; 70 % passa ao Contact. Vaivém a meio da passagem (5×): estado
  certo no fim. Dois gestos seguidos: Q → fim, e de volta → Q. Toque no escuro do Contact: nenhuma pergunta abre; toque numa pergunta
  nas Questions: abre e fecha. Saltos do menu `#questions`/`#contact`: certos.
- fps: Q → C 77,3 (1 fotograma de 55 ms em 331), C → fim 88,1, fim → C 87,8, C → Q 81,7 (1 de 55 ms em 349).
- **Gesto muito forte para cima (700 px a 6000 px/s):** do fim → Questions 2/3 (passa o Contact), do Contact → 14 3/3 (passa as Questions).
  Para baixo nunca passa. É o tema dos gestos rápidos em todo o site (#103-16), adiado pelo owner.

**Chrome desktop (1500 × 913, ecrã 120 Hz, eventos reais do macOS `wheel.swift`):** trackpad normal (300 px), roda (1 clique), trackpad
lento (150 eventos): uma paragem por gesto nos dois sentidos, Q → C → fim → C → Q → 14 → 13. Gesto curto (120 px) desde Q → C. Inversão a
meio da passagem nos dois sentidos: estado certo. Endereços `#contact` e `#questions`: certos. fps ~119, pior 25 ms, 0 acima de 50 ms.
**Trackpad muito rápido (1200 px):** Q → fim (passa o Contact), fim → Q (passa o Contact) — o mesmo tema.

**Safari desktop 27.2 (1324 × 888, eventos reais):** tudo como no Chrome e também o trackpad muito rápido: uma paragem por gesto
(Q → C → fim, fim → C → Q). Endereços certos. 60 fps, pior 22 ms, 0 acima de 50 ms.

**Movimento reduzido e sem JS** (Chrome, 390/768/1440/320): sem paragens, chega ao fim, overflow 0, pergunta, *Talk to us*, colofão, índice
e Questions visíveis; sem erros de consola.

**Não verificado:** Firefox (não instalado); o teste do dia no iPhone foi do owner (visual, "pareceu ok").

## About: o 12 um terço mais rápido — 11/11 noite, MacBook (por aprovar pelo owner)

- **Owner:** "ta a demorar muito tempo a carregar o 12 para depois avançar para o 13, o tempo de espera até aparecer [I'm Flávio] … acho
  que pode continuar elegante e ser mais rápida".
- **Antes** (`about-stage.ts`, desktop; telemóvel × 1,25): as palavras do 11 saem 0–1,4 s; a luz desliza 0,3–2,7 s; o retrato 0,7–2,4 s;
  *I'm Flávio.* 2,0–3,0 s (telemóvel 2,5–3,75 s) — o nome só depois de tudo o resto; retenção 2,4 s; a passagem acaba aos 3,0 s.
- **Agora:** a mesma ordem e as mesmas sobreposições, ~⅓ mais curto, o nome a entrar enquanto o retrato acaba: palavras 0–0,95 s
  (`LEAVE` 450/0, 500/100, 800/100, 650/300; a volta igual), luz 1600 ms desde 200, retrato 1200 desde 450, nome 700 desde 1200;
  `HOLD_MS` 1600, `PASSAGE_MS` 2000; a barra diz *03 About* a meio do retrato (1050 ms). Desempenho: as mesmas animações, mais curtas.
- **Medido no Xiaomi** (toque por CDP, do 11 do Method, 2×): nome começa 1,51 s, inteiro (≥ 0,9) 2,10 s; retrato inteiro 1,79 s; a
  retenção acaba 1,95 s (antes: nome 2,5 s, retenção 3,0 s). Um 2.º gesto 0,8 s depois fica no 12 (2/2); 2,7 s depois passa ao 13 (2/2).
- **Chrome desktop (trackpad real):** 11 → 12 → 13 → 14 → Questions, uma fase por gesto (2/2); nome 1,20–1,68 s.
- **Safari desktop (trackpad real):** o mesmo (nome 1,18–1,65 s); gestos seguidos 10 → 11 → 12 → 13 → 14 → 13 → 12 → 11 → 10, uma fase
  por gesto. **Visto:** logo a seguir a um salto do menu para *03 About*, um gesto para cima foi do 12 ao 10 em 2 de 5 (a volta 12 → 11
  não foi mexida; ligado à aterragem do salto — a rever com os gestos rápidos).
- typecheck, lint, build: passam.

**Não verificado:** o iPhone do owner (o veredicto da composição).

## Avaliação das paragens no site inteiro, ida e volta — 11/11 noite, MacBook (pedido do owner)

Owner: "avalia os pontos de paragem com scroll frente e trás do site inteiro… entre about questions e contact às vezes consigo passar do
contact para o about e ele fecha logo o questions, não há paragem aí". Posição depois de cada gesto (`where.js`); o Work não tem paragens
(scroll livre, aprovado), o resto paragens obrigatórias (`scroll-snap-stop: always`).

| | gesto normal ↓ | gesto normal ↑ | gesto rápido ↓ | gesto rápido ↑ |
|---|---|---|---|---|
| Simulador iOS (dedo real) | 7 … 14 Q C fim — certo | C Q 14 … 7 — certo | certo | certo |
| Xiaomi (toque CDP) | certo | certo | salta 8b, 11, 13, C | salta 14, 12, 10, 8c, 8a, o Work |
| Chrome desktop (trackpad real) | 7 → 7 → **8b** (salta 8a) | certo | salta 8a–8c, 10, 11, 13, Q | salta 14, 12, 11, 9, 8c… |
| Safari desktop (trackpad real) | 7 → 7 → **8b** (salta 8a) | 12 → **10** (salta 11), 1× | salta 8a/8b, 9, 11 | salta 11, 9, 8b |

**"No fim, um gesto para baixo volta ao Contact" — falso, um erro do teste (corrigido a seguir):** o detetor (`where.js`) só dizia "fim" a
menos de 3 px do fim da página. Chega-se ao fim com a barra do Safari recolhida (altura 754, página em 16156); o gesto seguinte abre a barra
(754 → 714) e o fim da página passa a estar 40 px abaixo — o detetor passou a dizer "C". Registo por fotograma e eventos (`scroll`,
`scrollend`, `resize`, chamadas de scroll do código instrumentadas): **a página não se mexe** (16156 em todos os fotogramas, nenhuma
chamada de scroll). Captura: o colofão inteiro (464..754) acima da barra, a pergunta e *Talk to us* no sítio. Nada a corrigir.

**Questions na volta do Contact (Simulador, 3×):** a página pára nas Questions aos 1,03 s, o filme apaga-se aos 1,10 s, o papel aos 1,72 s,
as perguntas aparecem aos 1,77 s e estão inteiras aos 1,98 s — ~0,75 s de papel vazio com a página já parada. Um 2.º gesto aí leva ao 14
(como deve: uma paragem por gesto), e as Questions "fecham" sem se terem visto. Com um só gesto, C → Q certo 8/8 no Simulador (normal e
rápido, com a barra a abrir). Não reproduzido com um só gesto.

### A volta Contact → Questions em 1,2 s (era 2 s) — 11/11 noite, MacBook (por aprovar pelo owner)

- `contact-client.tsx` `BACK_MS` 2000 → 1200 (a ida, 3 s, igual; as mesmas rampas do storyboard E).
- **Simulador (dedo real), 4×:** a página pára nas Questions aos 0,92–1,08 s; o filme apagado 0,65–0,71 s, o papel claro 1,02–1,08 s, as
  perguntas aparecem 1,05–1,10 s e estão inteiras 1,18–1,23 s — com a página a parar (antes: 0,75 s de papel vazio, perguntas aos 1,77 s).
  Q → C → fim → C → Q → 14: certo 3/3.
- **Xiaomi:** normal e médio, fim ↑ → C e C ↑ → Q 3/3 cada; muito forte ainda passa (tema dos gestos rápidos, sem mudança).
- **Chrome e Safari desktop (trackpad real):** C ↑ → Q 3/3 cada, o estado inteiro (perguntas visíveis, sala apagada) aos 1,6 s.
- typecheck, lint, build: passam.

**Não verificado:** o iPhone do owner (o veredicto do ritmo da volta).

## Revisão do owner no iPhone (12/11 manhã) — o nome do 12, a retenção nas Questions, a barra num salto — 12/11, MacBook

Owner (iPhone): (1) o 12 mais rápido: "tempo está bom", mas "no scroll para trás há momentos em que o texto *I'm Flávio* salta para
lugares que não é suposto" (vídeo `ios-lab/out/2026-11-12T11-43-22-…mp4`); (2) a volta em 1,2 s "parece ok"; (3) "se eu estiver no contact
e começar sempre a dar scroll para trás enquanto a animação começa, como não há paragem obrigatória no questions posso acabar por parar no
about"; (4) o fim com gestos rápidos "agora parece bem".

### 1. O nome a saltar na volta 13 → 12 → 11
- **Medido no vídeo do owner** (60 fps, posição da linha de texto por fotograma, `nametrack.mjs` no scratchpad): nas 3 voltas 13 → 12 → 11
  com o 2.º gesto antes de o nome acabar de descer, o nome cai de uma vez 27, 35 e 47 px (e encolhe) para o lugar do 12, e só depois
  desvanece. As voltas sem 2.º gesto e as idas: contínuas.
- **Causa** (`about-stage.ts`): cada voo novo cancela o anterior do mesmo elemento; a saída para o Method dava ao nome só a opacidade, e
  o nome caía para onde o último voo terminado o tinha deixado.
- **Correção:** a caminho do 12, o retrato e o nome continuam a descida que levavam (o voo não é substituído) e o nome só desvanece
  (uma animação de opacidade por cima, `fadeOver`, até ao voo seguinte); a frase (`.a-say`) sai com o seu deslocamento.
- **Simulador (dedo real), 4× (2.º gesto 0,4–1,3 s depois):** sem salto; o nome segue a 3–4 px por fotograma como antes da saída (antes da
  correção: 16–28 px num fotograma no Simulador). **Chrome e Safari desktop (trackpad real), 2× cada:** contínuo (13–14 px por fotograma,
  a velocidade da descida no desktop; os passos de 16–23 px são fotogramas de 18–27 ms).

### 3. A retenção nas Questions durante a volta do Contact (novo, `data-c-hold`)
- **Reproduzido antes de mudar:** Simulador, 2 gestos normais com 0,6 / 0,9 / 1,4 s → 14 (3/3); Safari desktop 3/4 → 14.
- **Feito:** enquanto a luz volta às Questions (a passagem de volta, 1,2 s) e até a página parar, as marcas acima das Questions (o About e o
  Method) saem (`method.css`, como as retenções do 7, do 12 e do 14); um gesto para trás fica nas Questions. Nunca para um salto do site.
- **Tentado e mudado (medido):** (a) desligar as marcas e devolvê-las tal e qual — **no Safari desktop a página saltava para o Method**
  ao acabar (4/4: o Safari guarda a paragem pela ordem entre as marcas; com as de cima fora as Questions eram a 1.ª, e devolvidas foi para
  a 1.ª de todas). Agora solta com o encaixe desligado um fotograma e a página posta onde está: 0 saltos. (b) Retenção pelo relógio: a
  inércia longa do trackpad passava-a e ia ao 14 — agora acaba no primeiro repouso depois da volta (e nunca com um dedo no ecrã).
  (c) Dois gestos muito rápidos levavam a página por instantes ao 13; o About ligava a sua retenção do 14 (sem as marcas das Questions) e,
  ao soltar, o Chrome saltava 1004 px para o 14 — o About já não liga essa retenção enquanto a página está presa nas Questions.
- **Simulador (dedo real):** 2 normais 0,3/0,4/0,6/0,7/0,9/1,0 s → Q; 3 rápidos (normal, forte, forte) → Q; 2 fortes → Q; lento → Q; ↑
  e ↓ a meio → C; depois de cada um, ↑ → 14 e ↓ → C (sem salto); percurso C ↑↑↑↑ ↓↓↓↓↓: Q 14 13 12 13 14 Q C fim. Um 3.º gesto que
  começa depois de a luz voltar (1,5 s) vai ao 14 — um gesto, uma paragem.
- **Chrome e Safari desktop (trackpad real, 2.º gesto lançado 0,4–0,8 s depois do 1.º):** normal 2× e 3×, lento, muito rápido 2× → Q
  (6/6 cada); depois ↑ → 14 e ↓ → Q. Safari, muito rápido: 1× o ↓ seguinte ficou no 14; não repetido em 4 seguidos.
  Bateria do Contact (`desk-contact.sh`): como em 11/11 (os gestos muito rápidos ainda passam paragens noutros sítios — #1 do handoff).
- **Movimento reduzido e sem JS** (`reduced-nojs.mjs`, 390 e 1440): sem paragens, overflow 0, sem erros (o "Talk to us" lido a falso é o
  teste: o texto está em maiúsculas por CSS e está no HTML).

### Encontrado a testar: a barra dizia *04 Questions* sobre o About depois de um salto do menu
- Do Contact para *03 About* pelo menu (Chrome e Safari desktop): a página no 12 e a barra em *04 Questions* (`bar-client.tsx`: a saída
  do início do Contact punha a secção anterior, mesmo com o About já na faixa). Agora fica a última secção na faixa. Já existia antes de
  hoje (nada disto mexe na barra). Uma primeira tentativa (só sem nenhuma secção na faixa) deixava a barra presa: os marcos do Method e do
  About são altos e estão quase sempre na faixa — desfeita.
- **Saltos** C→About, C→Method, C→Questions, C→Work, Q→About, About→C, Work→Q, Method→About, Q→Method: lugar e barra certos no Chrome,
  Safari e Simulador (o *#method* no desktop aterra em Experiences, como antes, `address.ts`). **Percurso da página inteira a descer e a
  subir** (passos de 137 px, a secção comparada com a geometria): 0 erros em 196 / 202 / 240 posições (Chrome, Safari, Simulador).

- typecheck, lint (0 avisos: os dois de `frames-band.mjs`/`frames-rgb.mjs` corrigidos), build: passam.

**Não verificado:** o Xiaomi (não ligado: `adb devices` vazio; o toque emulado do Chrome por CDP não respondeu nesta sessão); o iPhone
do owner (o veredicto); Firefox.

## Desktop "7 → 7 → 8b" e o Safari preso em Experiences — 12/11 tarde, MacBook

### "7 → 7 → 8b" (corrigido, `method-stage.ts` `DESK_MARKS`)
- **Reproduzido** (Chrome 1500 × 913, trackpad real, `wheel.swift`): Experiences → ↓ → ↓ 0,8 s depois → (3 s) ↓ = 8b, 3/3.
- **Medido por fotograma:** o 8a não era saltado. O 2.º gesto levava a página à marca do 8a (5980) e ela repousava lá, mas a fase
  ficava no 7 durante 3,5 s. A marca do 8a (1,25 ecrã) estava 16 px **antes** do início do 8a com a banda morta (1,15 + 0,025 de
  `choose`), e era a única assim (8b…11 passam todas). Um gesto normal passava o limiar com a inércia e voltava; um gesto durante a
  passagem da luz, ou lento, repousava na marca com o 7 em palco, e o gesto seguinte mostrava o 8a de passagem e acabava no 8b.
- **Feito:** a marca do 8a em 1,3 ecrã (30 px depois do limiar). Tentei também a do 7 em 0,5, mas desfiz: não fazia falta.
- **Depois:** Chrome 3/3, o 8a chega sozinho ~1 s depois de a página parar (quando a luz acaba), como aprovado no desktop a 8/11.
  Percurso 7 → 11 → 7 com gestos de 300, 200 e 120 (6 ↓ e 6 ↑ cada): **uma fase por gesto**, Chrome e Safari, 6/6 em cada série.

### Safari desktop: preso em Experiences (encontrado; **já existia**, por decidir com o owner)
- Do Work para o Method com gestos de trackpad, quando a página repousa na marca de Experiences (`out`) ou perto dela, cada gesto para
  baixo volta a ela: Safari 1500 × 1000, gestos de 300: 4324 ↔ 4752 sem entrar (3/3); a 1324 × 888 (o tamanho de 11/11): gestos de 300
  entram, de 200 ficam presos, de 450 ficam presos 7 gestos e depois entram. O menu → *02 Method* aterra nessa marca: preso 3/3. O
  Chrome entra sempre. Com a marca original do 8a também fica preso: não vem de hoje (11/11 só testou gestos de 300).
- **Mecanismo** (registo por fotograma, Safari 27.2): ~95 px depois da marca de Experiences o Method liga o encaixe (`data-near`, 0,2 ecrã
  antes da cena) e o Safari volta logo à marca de Experiences, desliga, o gesto continua, volta a ligar… Sem essa marca (experiência
  injetada) o Safari salta o 7 e vai ao 8a: escolhe a marca com estado (pela ordem, como nas Questions), não pela mais próxima.
- **Corrigido a seguir (owner escolheu a opção a, 12/11), medido a cada passo:**
  1. Marca de Experiences desligada / "estacionada" no topo da página (injetado): o Safari passa o 7 e vai ao 8a, ou não chega —
     ligar o encaixe a meio do gesto é o que o Safari não aguenta.
  2. **Encaixe já ligado em repouso em Experiences** (desktop: `data-near` desde a própria marca, e dentro da cena): do Work entra; mas
     de Experiences em repouso os gestos de 300–360 px voltavam a Experiences (0/9). Causa medida: nenhum script mexe na página
     (`scrollTo`/`focus` instrumentados: 0 chamadas); as marcas e a altura não mudam; a página volta num fotograma 30–50 ms depois de a
     fase passar a 7 — o *layout* dessa troca cai entre o fim do dedo e a inércia, e o WebKit põe a página na marca onde o gesto
     começou (`resnapAfterLayout`). Com o encaixe sempre ligado (injetado) igual: não é o estilo do encaixe.
  3. **Marca de Experiences a 0,05 ecrã do início da cena** (desktop; era 0,3; o telemóvel fica a 0,3): a imagem é a mesma — capturas a
     0,3 e a 0,05 com diferença de píxeis 0 (o palco está preso em toda a zona) — e o 7 chega nos primeiros 50 px, com o dedo pousado.
     Ainda 5/28 de volta: a página oscilava na fronteira e cada troca pre ↔ 7 fixava/soltava o palco (`m-leaving`, `top: 0px` —
     *layout*, MutationObserver com valores antigos).
  4. **O palco só passa a fixo quando ia mesmo mover-se** (desktop: quando o topo da secção chega a 0,15 ecrã do topo; até lá o `sticky`
     segura-o no mesmo píxel): sem *layout* nas trocas dentro da zona.
- **Depois (build final):** Safari, de Experiences em repouso, gestos 150–600 px: **45/48 entram no 7** (as 3 voltas: gestos de 150 e 270
  que mal passam o início da cena e voltam à marca mais próxima; o gesto seguinte entra). Do Work com gestos de 200 / 300 / 450: pára em
  Experiences e entra no 7 (3/3); o menu → *02 Method* → ↓ → 7 → 8a. Chrome: do Work direto ao 7 (como antes), menu → 7 → 8a.
- **Percurso 7 → 11 → 7 → Experiences → Work** com gestos de 300 e 120, Chrome e Safari: uma fase por gesto em todos.
- **A volta da luz com o palco preso** (o pedido de 2/11), Chrome e Safari, 1, 2 e 3 gestos ↑ do 7 e um gesto forte (sobe ~1300 px para o
  Work): o palco a 0 px em **todos** os fotogramas do 1,1 s da volta; a retenção liga-se só quando precisa (249–674 ms) e não se liga se a
  página fica em Experiences.
- **Telemóvel (Simulador, dedo real):** marcas iguais às da manhã; Experiences ↓×7 → 11, ↑×8 → Work, fortes 3/3, dois gestos durante a
  passagem → 7: sem mudança.
- typecheck, lint (0 avisos), build: passam. **Não verificado:** Xiaomi (não ligado), Firefox, o Safari do owner com um trackpad real.

## Safari desktop "12 → 10" — os saltos do menu fora das marcas — 12/11 fim da tarde, MacBook

- **Reproduzido:** menu → *03 About*, depois ↑ 450 (trackpad real): 10 em 7/8 (↑ 300: 11, 10/10).
- **Medido:** o salto deixava a página em 9060, **entre** as marcas do 11 (8780) e do 12 (9294): no desktop `address.ts` aterrava no início
  marcado da secção, não numa marca. O Chrome encaixava a seguir na mais próxima (e assim *02 Method* acabava em Experiences com *01 Work*
  na barra — o que `address.ts` queria evitar); o Safari deixava a página fora de qualquer marca, e o gesto seguinte passava o 11.
- **Feito:** no desktop como no telemóvel, o salto aterra na primeira marca da secção (`address.ts`).
- **Depois (Chrome e Safari):** *03 About* aterra no 12 (9294 / 9084); ↑ 300 → 11 (4/4 cada); ↓ → 13 (3/3); *02 Method* aterra no 7
  com *02 Method* na barra, ↓ → 8a, ↑ → 7 (3/3); *04 Questions*, *05 Contact*, *01 Work* certos. Safari ↑ 450 do 12: 11 em 3/4.
- **O que fica (gestos rápidos, #1 do handoff, já existia):** com gestos de 450 px os dois browsers passam fases onde as marcas estão a
  ~½ ecrã (8a → 8c, 8c → 8a, Chrome 2/4 12 → 10; Safari 12 → 10, 8b → 7). Com 300 / 200 / 120: uma fase por gesto.
- typecheck, lint, build: passam. Telemóvel: o código do salto é o mesmo de antes (já usava a primeira marca).

## Xiaomi Mi 11 Lite com tudo o de 12/11 — 12/11 noite (toque por CDP, 392 × 779)

- **Contact** (`xiaomi-contact.mjs`): normal ↓/↑ uma paragem por gesto; lento, vaivém, dois gestos seguidos, toques: certos; fps Q → C
  81, C → fim 90, fim → C 90, C → Q 82 (1 fotograma de 55 ms em 349). Forte ↑ ainda passa paragens (#1, como em 11/11).
- **Retenção nas Questions:** do Contact, 2× ↑ a 400 / 700 ms, 3× a 500 ms, 2× fortes (500 px) a 600 ms, 2× lentos: **Q 10/10**; depois
  ↑ → 14 e ↓ → Q em todos. Menu do Contact → *03 About*: 12, barra *about* (3/3).
- **Site inteiro** (`xiaomi-walk.mjs`): normal ↓ topo → fim e ↑ fim → topo, uma fase por gesto; forte ↓/↑ salta fases (#1, já existia).
- **O nome no 13 → 12 → 11** (2.º gesto a 400 / 600 / 900 ms): nenhum passo acima de 6 px por fotograma enquanto visível (3/3).

## O menu — correções e bateria (owner, 12/11 noite: "não deve ser possível dar scroll com o menu aberto"; "em mobile… continua a existir uma barra em cima e em baixo")

### Detetado (medido antes de mudar)
1. **Scroll com o menu aberto** (todas as plataformas): Simulador, um gesto com o menu aberto levou a página das Questions ao Contact
   por trás dele (14523 → 15379).
2. **Barras de cor no iPhone:** captura no Simulador sobre as Questions — a faixa do relógio e a da barra do Safari na cor do papel. Sondas
   (Simulador, iOS 27.3): uma caixa `fixed` nunca chega às faixas (verde: nunca); uma caixa **na página** (absolute) chega às duas
   (magenta em cima, ciano em baixo); o vidro (`backdrop-filter`) e uma tinta numa caixa na página também chegam.
3. **Barra de estado do Android na cor da cena** com o menu escuro por cima (Xiaomi, sobre o papel: `#dcd5c8`).
4. **Anel de foco à volta de "01 Work"** ao abrir com o dedo (Simulador) — o foco ia para o 1.º link; **e à volta de "Menu"** ao fechar com
   o rato (Safari desktop, clique real).
5. **Janela redimensionada com o menu aberto:** mais larga, um canto de 8 px por cobrir; estreita (passa ao layout do telemóvel), o
   círculo ficava centrado onde o botão estava (fecharia para fora do botão).

### Corrigido (`bar-client.tsx`, `bar.css`, `bar.tsx`, `sequence.ts`)
1. **A página fica parada com o menu aberto:** gestos (`touchmove`), roda/trackpad (`wheel`) e as teclas que fazem scroll (Espaço, PgUp/PgDn,
   Home/End, ↑/↓) — por eventos, não por `overflow: hidden` (mudar o layout da página com ela numa paragem faz o Safari reencaixar). Ao fechar
   tudo volta.
2. **iPhone: o menu fica na página enquanto está aberto** (absolute onde está o ecrã), e o vidro corre numa caixa (`.menu-room`) 80 px acima
   e 160 px abaixo do ecrã: passa debaixo da ilha e da barra do Safari. Ao fechar volta a `fixed` (um link do menu move a página, não o menu).
3. **Android (e desktop): `theme-color` com o menu aberto = a película do menu sobre a cor que lá estava** (`sequence.ts`, pelo fundo medido
   ao abrir: escuro .30, misto .50, claro .66); volta à cor da cena ao fechar. No iPhone nada a pintar (o próprio menu está nas faixas).
4. **Foco:** aberto com o teclado vai para o 1.º link (como antes); com o dedo/rato vai para o próprio menu (sem anel). Fechado com o dedo/rato
   o foco volta ao botão **sem anel** (a próxima tecla devolve-o); com Esc, com anel.
5. **Redimensionar com o menu aberto** recalcula a gota (centro e raio).

### Testado (build final)
- **Navegação pelo menu, 5 × 5 (de cada secção para cada secção, 25 por plataforma):** Chrome 1500, Safari 1500, Simulador iPhone, Xiaomi —
  **100/100**: lugar certo (Work, 7, 12, Questions, Contact), etiqueta da barra certa, menu fechado, página sem `inert`.
- **Página parada com o menu aberto**, em 5 sítios (Work, 9, 13, Questions, fim): Chrome e Safari com trackpad ↓↑, roda, Espaço, PgDn, ↓, End
  — 10/10 parada; Simulador com o dedo (normal, forte, forte) 5/5; Xiaomi (toque normal, normal, muito forte 700 px) 5/5. Depois de fechar o
  scroll volta (Simulador 4/4 onde há para onde ir; Xiaomi 9 → 10 5/5, igual a nunca ter aberto).
- **Faixas no iPhone** (Simulador, capturas): Work, 9, 13, Questions, fim — o vidro debaixo do relógio e da barra do Safari (aberta e
  compacta) em todos; abrir e fechar gravados (a gota cresce do botão e volta a ele).
- **Android** (Xiaomi, toques reais): barra de estado + barra do Chrome na cor do vidro (Questions `#dcd5c8` → `#58554f`, Work, 13) e de
  volta ao fechar; sem anel ao abrir e fechar.
- **Teclado** (Chrome e Safari, teclas reais): Enter abre no 1.º link; Tab ×10 fica no menu; Esc fecha e devolve o foco (com anel); Enter num
  link navega. **Clique real:** sem anel ao abrir e ao fechar.
- **Toques/cliques rápidos** (desktop): duplo → fechado e a página mexe-se a seguir; triplo → aberto; link escolhido 60 ms depois de abrir →
  navega. **Simulador:** duplo toque certo; um toque durante a inércia de um gesto só pára a página (é o iOS), o seguinte abre.
- **Abrir durante as passagens** (Chrome e Safari): durante a do 7, a do 12, a do Contact e a volta às Questions — ao fechar o estado está
  certo (`cstate.js` sem ✗) e o gesto seguinte vai para o sítio certo.
- **Redimensionar com o menu aberto** (Chrome): 1728, 800, 500, 1500 de largura — coberto e centrado no botão em todos.
- **Movimento reduzido** (Chrome 390 e 1440): abre e fecha (sem a gota), links certos. **Sem JS:** *Menu* leva a `#index` (5 links).
- Percurso da barra pela página inteira, a descer e a subir: 0 erros (Chrome, Simulador; Safari 0 em 2 de 3 corridas — 1 leitura no
  topo numa corrida, não repetida: tempo do teste, 120 ms por posição).
- typecheck, lint (0 avisos), build: passam.

### Não verificado / falta
- **Xiaomi, com toques reais:** links do menu, toques rápidos e abrir durante as passagens — o telemóvel adormeceu com o ecrã bloqueado
  (o adb não pode acordá-lo: sem `INJECT_EVENTS`). As mesmas situações passaram no desktop e no Simulador; no Xiaomi passaram a matriz
  (por cliques de script), a página parada e a cor da barra.
- **O iPhone do owner** (o veredicto das faixas e do vidro nelas, com a barra do Safari a mudar); Firefox; rotação do telemóvel com o menu
  aberto; leitores de ecrã (VoiceOver/TalkBack).
- Windows (barras de scroll clássicas): o menu não mexe no `overflow`, por isso a página não deve saltar — não testado.

### A barra sem números (owner, 12/11 noite: "tirava os números e deixava só o nome")
- `bar-client.tsx`: a secção escrita só com a palavra (*Chapter One | Questions*); o menu guarda os números. Saiu a regra `.bar-sec i`.
- Medido (Chrome, com *Questions*, a mais longa): ilha da esquerda 209 px a 320 (folga entre as ilhas **35 px**, era 19), 243 a 390 (55),
  279 a 1440. Capturas a 320, 390, 1440 e no Simulador (*Chapter One | ABOUT*): certas. typecheck, lint, build: passam.

## A foto do Weddings "bugada" + passeio "como um visitante" nas 4 plataformas — 12/11 noite, MacBook

### O bug do vídeo do owner (iPhone, `ios-lab/out/2026-11-12T21-14-30-…mp4`, 4,4 s)
- **Visto** (fotograma a fotograma): a descer e a subir entre a entrada e o Weddings, a foto voava para / de uma **caixa quadrada no canto
  de cima à esquerda** em vez da lâmina do Weddings; ~0,6 s de ecrã escuro antes das lâminas.
- **Causa** (sonda no Simulador): o voo da lâmina para o arco (`work-client.tsx` `flight()`, animações na linha do scroll) media a lâmina
  com `getBoundingClientRect()` **onde a página estava**. Refeito longe do topo — recarregar a meio da página, mudar de tamanho, a imagem da
  lâmina a chegar tarde — a entrada retida já tinha subido com a página: o voo partia de **−9427 px** (feito a 9204 px). Chrome, feito no
  topo: certo (566 px).
- **Correção:** a lâmina medida no sítio da entrada retida (`top` menos o deslocamento da entrada). Simulador recarregado a 11 722 px:
  o voo parte de **386 px** (a lâmina, 385); gravação de 3 gestos para cima e 2 para baixo: a foto entra e sai da lâmina, sem caixa.

### O passeio (ferramentas novas em `ios-lab/finger/`)
- `watch.js` (vigia dentro da página) + `watch-dump.js`; `human-xiaomi.mjs` (toque por CDP), `human.mjs sim|chrome|safari` (dedo do
  `simtouch`, trackpad/roda/cliques reais do `wheel`). Do topo ao fim e de volta, gestos normais/lentos/rápidos (no desktop também a roda do
  rato), pausas 0,3–3 s, um gesto ao contrário de vez em quando, o menu aberto (com um gesto por baixo) e fechado, um momento do Work e uma
  pergunta tocados; depois 6 links do menu de sítios diferentes. Captura em cada paragem (revistas todas).
- ⚠ Erros do próprio teste, corrigidos antes das corridas que contam: o filtro de elementos excluía a barra (o menu nunca abria); o `RANDOM`
  do zsh não avança dentro de `$( )` (todos os gestos iguais) — passou para Node; o Safari volta ao mesmo sítio ao recarregar (usar um
  endereço novo).

| | gestos | menu (links) | menu aberto + gesto | erros | restos | fotogramas > 50 ms |
|---|---|---|---|---|---|---|
| Xiaomi (2 corridas) | ~60 | 6/6 certos | — (não calhou) | 0 | 0 | 46 e 50 (pior 199 ms a entrar no 7, 188 na passagem da entrada) |
| Simulador iPhone 17 Pro | ~50 | 5/6 (ver 1) | 3/3 parada | 0 | 0 | (o Simulador não mede desempenho) |
| Chrome 1500 × 1000 | ~65 | 6/6 | 3/3 parada | 0 | 0 | 2 |
| Safari 1500 × 1000 | ~60 | 6/6 | 6/6 parada | 0 | 0 | 41 |

### Encontrado
1. **iOS — toque perdido num link do menu enquanto aparece** (não corrigido, decisão): *Questions* a 0,5 s e 0,7 s depois de abrir → o
   menu fica aberto (3/3); a 0,9/1,0/1,1 s → navega; *Work* a 0,7 s (ainda opacidade 0) → navega. Gravados os eventos: `pointerdown`,
   `touchstart`, `pointerup`, `touchend` no link — **sem `click`**. O WebKit não manda o clique quando o toque cai em conteúdo a tornar-se
   visível (a transição de opacidade das palavras do menu). Xiaomi e desktop: sem o problema.
2. **Gestos rápidos que passam paragens** (#1, conhecido) — casos novos: Xiaomi 8a → 8c, 8c → 10, 12 → 14, 14 → C (sem as Questions),
   meio da passagem → 7 (o Work inteiro), 7 → topo (o Work inteiro a subir); Chrome/Safari trackpad rápido: topo → Artists, 14 → C. iOS:
   nenhuma paragem do Method saltada; no Work (sem paragens) W2 → meio da passagem.
3. **A passagem da entrada sem paragem**: gestos lentos/roda deixam a página a meio (Simulador 637, 704, 860 px; Chrome 1043–1199; Xiaomi
   287–797): foto meio voada, sem texto, barra escondida. Nativo; decisão.
4. Xiaomi: uma volta do fim parou no Contact a 14 531 em vez de 14 416 (1 vez em 4); não repetido.

### Verificado e não é bug
- **Contact vazio logo depois de um gesto forte do 14** (Xiaomi): o gesto saltou as Questions e a passagem do Contact toca inteira (~3,3 s:
  sala 1,6–2,2 s, pergunta 2,2–2,7 s, linha 2,8–3,2 s) — a captura a 1,3 s apanhou o escuro do meio. Do 14 com gestos normal e forte
  pára nas Questions (3/3).
- **Barra "Method" no 12** a 0,6 s: espera que o About seja visto (`bar-client` `seen()`); a captura logo a seguir já diz *About*.
- **`scroll-snap-type: none` 2 s depois do menu → Work**: o salto do Work segura-o 2,6 s de propósito (`land`).
- **`data-c-hold` no Contact** (Safari): dura o que dura a passagem do Contact e sai no fim (~3–5,5 s; reproduzido com trackpad real, com
  e sem o menu aberto a meio) — nunca preso.
- **Menu "armed" com o menu aberto**: os dois fotogramas antes de *open*; as capturas mostram-no aberto.
- **Em *4794* a secção já é "method" e a barra diz *Work***: é a paragem em Experiences (opção a) — o ecrã é o Work.

### Não verificado
- O iPhone do owner (a correção do voo e o toque do menu no aparelho real); Xiaomi com o menu aberto + gesto (não calhou nas corridas;
  verificado na sessão do menu); Firefox; leitores de ecrã.
- typecheck, lint (0), build: passam.

## A passagem por tempo (owner, 12/11 noite: "one stroke dispara a animação e não o scroll controla a animação") — README #109

### O que mudou (`work-client.tsx`, `work.css`)
- O voo lâmina → arco, o filme, as palavras e o texto do Work: as mesmas animações, agora no relógio do documento (cada uma guarda
  o seu troço dos antigos 1,4 ecrãs, em `delay`/`duration`/`endDelay`), **1,6 s a ir, 1,2 s a voltar** (a julgar no iPhone).
  `prog` (onde a passagem está) e `goal` (a ponta para onde vai); o estado `data-pass` desenhado a partir de `prog`.
- **Disparo:** 12 px de um gesto, nos dois sentidos (a 0,04 do ecrã, 37 px, uma tecla ↓ do Safari não chegava). Só conta o dedo:
  o encaixe do iOS a levar a página de volta depois de um gesto lento não é um gesto para trás.
- **Nunca a meio:** em repouso entre o topo e o Weddings a página vai para a ponta da passagem — invisível, a entrada e o palco
  estão retidos ali.
- **Paragem no Weddings** (`.w-pass-snap`, `data-pass-zone`): ligada só em repouso no topo (ligada no Weddings levava um gesto
  para a 1.ª marca do Method, saltando Artists; ligada durante um gesto, o Safari puxa para uma marca).
- **Fora do iOS:** o gesto que dispara leva a página já à ponta e segura-a com `overflow: hidden` enquanto a passagem toca
  (o Chrome e o Safari deixam um gesto forte passar uma `scroll-snap-stop`, o #1: um gesto rápido do topo cruzava o Work até
  Experiences com a passagem cortada). A paragem desliga-se nesse momento (ligada, o Safari levava o 2.º clique de uma roda à marca de
  Experiences, com `overflow` ou sem ele). **No iOS** a paragem segura; com `overflow` o dedo ainda no vidro continuava a fazer scroll
  a partir do novo sítio (50–700 px além do Weddings, 6/6) — por isso lá não; seguro por eventos (`touchmove`) enquanto toca.
- Correções feitas pelo caminho: o estado nunca chegava a `done` (1,4 H − H sobre 0,4 H dava 0,99999…); a mudança de tamanho
  desenhava o estado antes de repor o sítio (ficava `on` no Weddings); o repouso no iOS esperava 300 ms depois de o dedo sair
  (um dedo parado antes de levantar e o encaixe do iOS juntos levavam a página a 1922).
- **Encontrado no passeio (Simulador) e corrigido:** depois do menu → Work estando já no Weddings, um gesto para cima ficava sem
  resposta até ~1,5 s (o menu deixa o encaixe desligado 2,6 s e o scroll desse tempo era tomado pelo salto); agora um scroll só é do
  salto se nada do visitante (dedo, roda, teclas) mexeu a página antes — 2/2 vai ao topo; saltos do menu e do nome continuam instantâneos.
  E o 1.º gesto do passeio "ia para Artists": o toque do teste para acabar a entrada caiu na lâmina do Weddings (é um link) — não é bug.

### Testado (build final; Chrome 1500 × 1000 e Safari 27.2 com trackpad/roda reais do `wheel`; Simulador iPhone 17 Pro com o dedo do `simtouch`)
| | ↓ do topo e ↑ do Weddings | resultado |
|---|---|---|
| Chrome — trackpad normal, lento, rápido, muito rápido; roda 1, 2, 6 cliques; trackpad mínimo (60) | 16/16 | Weddings 1278 (+ até 68 px de resto da roda, ainda Weddings) / topo |
| Safari — os mesmos | 16/16 | Weddings 1307 / topo |
| Chrome — teclado real (espaço, setas, Page Down/Up) | 6/6 | |
| Safari — espaço e Page Down/Up | certos | setas: ver abaixo |
| Simulador — normal, lento (180 e 150 pt), rápido, dedo parado 0,3–0,4 s antes de levantar, mínimo (70 pt) | 16/16 | Weddings 1238 / topo |
| Menu → Work (do Method), nome → topo, menu → Method | certos, sem passagem (saltos) | |
| Mudar de tamanho no topo e no Weddings (Chrome 1100 × 800 e volta) | certo (`done` no novo 1,4 H) | |
| Movimento reduzido (Chrome) | sem passagem, sem paragem, scroll normal | |
| Sem JS | as marcas só existem com JS; CSS só com `data-js` | |
- **Dois gestos seguidos:** desktop, 2.º gesto 0,5 s depois → fica no Weddings (o resto do 2.º passa depois de soltar, ainda no
  Weddings: 1722 / 1751). iPhone: 2.º gesto 1,3 s depois → seguro (Weddings); **1,1 s depois → passa para Experiences** (ver abaixo).

### Não resolvido / não verificado
- **iPhone, 2.º gesto enquanto a página ainda está no encaixe do 1.º (~1,2 s):** o iOS não entrega esse toque à página (não há como
  o segurar) e a próxima marca ativa é a de Experiences. Resolve-se com as paragens do Work (#2 do owner): passa a parar em Artists.
- **Xiaomi:** não testado — ecrã bloqueado (acordado por adb, mas o desbloqueio é do owner).
- **Setas no Safari:** com teclas sintéticas o Safari não faz scroll com as setas de forma fiável em nenhum sítio do Work (também
  fora da passagem) — por verificar com um teclado real.
- O iPhone do owner (os tempos 1,6 / 1,2 s são para ele julgar).
- **Bug reportado pelo owner no iPhone (fim da noite, sem vídeo, por investigar):** "se começares a andar para trás e para a frente
  (scroll) no Weddings ele buga a animação". Suspeitas e plano em `v5-handoff.md` (COMEÇAR AQUI). Não reproduzido ainda: os testes acima
  fizeram ↓ e ↑ com 2–3 s de intervalo e só pares de gestos seguidos; alternâncias rápidas no Weddings não foram testadas.

## Paragens no Work e o 2.º gesto durante a passagem (13/11) — README #110; bug 1 dos vídeos do owner

### O bug (vídeo do owner, iPhone, 12/11 23:50)
No vaivém entre a entrada e o Weddings, a foto voa até ao arco e logo a seguir aparece **III Experiences** (~0,5 s; 10,2–10,9 s passa
também pelo Artists) antes de voltar ao Weddings.

### Causa (medida no Simulador, gravador por fotograma: `scrollY`, `data-pass`, relógio da passagem, `data-ch` do Work)
- Um 2.º gesto 0,4 e 0,9 s depois do 1.º: a página ia de 1238 a **4471** (a marca `out` do Method = Experiences), passagem cortada (`put(end)`), 2/2.
- **O iOS não entrega à página os toques de um gesto começado enquanto ela ainda assenta** (ouvinte de `touchstart`: só o 1.º gesto
  aparece), por isso `holdEvents` não o pode segurar. Solto além do Weddings, o encaixe procura a marca seguinte **no sentido do gesto,
  à distância que for**: sem paragens no Work, a do Method.
- Tentativa descartada: desligar, durante a passagem, todas as marcas abaixo do Weddings → o 2.º gesto voou até ao fim da página
  (16106), 2/5. Sem marca à frente o iOS deixa a página livre.

### O que mudou (`work-client.tsx`, `work.css`)
- **Marca do Artists** (`.w-pass-snap[data-at='artists']`, topo do degrau + 1); Experiences usa a `out` do Method. Encaixe (`data-pass-zone`)
  ligado em repouso do topo à marca do Experiences (era só no topo); desligado durante a retenção do desktop (`holdFor`).
- **As marcas do Work estão sempre presentes; só o encaixe liga/desliga.** Primeira versão (marcas ligadas com a zona): Safari desktop,
  do 7 um gesto para cima ia **ao topo** e do Experiences para baixo **ao 8c** — o WebKit repõe a página na marca pela ordem, e marcas a
  aparecer/desaparecer acima mudam essa ordem. A retenção da volta do Contact (`data-c-hold`) tira-as com as outras acima das Questions.
- **iPhone: a página parada no Weddings enquanto a passagem toca** (`lockPage`, `overflow: hidden`, a partir de 15 px do Weddings); um gesto
  para trás é lido pelo dedo e inverte a passagem (a página vai ao topo, invisível).
- Os endereços dos capítulos (`land`) aterram nas paragens (o Experiences na `out`: o topo do seu degrau ficava mais perto da marca do Artists).

### Testado (build final)
| | resultado |
|---|---|
| Simulador, 2.º gesto a 0,3 / 0,6 / 0,9 / 1,2 s | Weddings 4/4, passagem inteira (antes: Experiences 2/2 a 0,4 e 0,9) |
| Simulador, gesto para trás com a página parada (0,8 e 1,2 s) | inverte, topo 2/2 |
| Simulador, vaivém 5× a 0,3 / 0,5 / 0,8 s | nunca sai do Weddings, nenhum outro capítulo visto, 3/3 |
| Simulador, normal (300 pt/120 ms), lento (180/400), forte (450/45) | topo → W → A → E → 7 → E → A → W → topo, uma paragem por gesto, 3/3 |
| Simulador, percurso até ao 11 e de volta ao topo | uma fase por gesto, 20/20 |
| Simulador, Contact → Questions → 14 → 13 → 12; 3 gestos rápidos do Contact | certo; ficam nas Questions |
| Simulador, `#weddings` / `#artists` / `#experiences` do topo | 1238 / 2565 / 4471, nas paragens |
| Chrome 1500 × 1000, trackpad normal e lento | uma paragem por gesto, ida e volta |
| Safari 27.2 1500 × 934, trackpad normal e lento, roda 1 e 2 cliques | uma paragem por gesto, ida e volta (até ao 7) |

### Não resolvido / não verificado
- **Chrome, roda do rato:** entre o Artists e o Experiences (2,35 ecrãs) o Chrome avança no máximo um ecrã por gesto e pode parar a meio
  (4280, ainda Experiences); o clique seguinte chega à marca. Antes eram ~20 cliques para atravessar o Work.
- **Trackpad muito forte (1200 px):** Chrome salta o Artists (o #1, gestos rápidos fora do iOS); Safari 1× fica no Artists em vez de avançar.
- **Xiaomi** (não ligado ao adb), **o iPhone do owner**, Firefox. Movimento reduzido e sem JS: sem alterações de código nesses caminhos
  (as marcas só existem com JS e com movimento), não repassados.

### Depois do vídeo do owner (iPhone, 13/11 00:45, build com as paragens): um gesto forte do topo passa o Weddings
- No vídeo (2 de 2, 0,55 → 1,0 s e 7,0 → 7,5 s): a passagem começa, é cortada e a página pára no **Artists**. Os outros capítulos param bem.
- **Não reproduz no Simulador** (21/21 no Weddings, até 540 pt em 15 ms): o dedo simulado nunca é tão rápido como um dedo real.
- Leitura (a confirmar com a fita do owner): num iPhone real um gesto forte não é segurado pela `scroll-snap-stop: always`; o iOS pára
  na marca mais perto de onde a inércia levaria. Do topo, com o Artists a 2565, o Artists; antes das paragens, a marca seguinte era a do
  Experiences — o "Experiences" do primeiro vídeo era, provavelmente, um só gesto forte.
- **Correção (`passHold`, `data-pass-hold`, só iOS):** do gesto que começa a passagem até ela acabar, as marcas depois do Weddings saem
  (só marcas abaixo da página: a ordem do WebKit não muda); voltam logo que um dedo leva a página além do Weddings (2.º gesto → Artists).
- Simulador: um gesto (normal e forte) → Weddings 5/5; 2.º gesto a 0,3 s → Artists, a 0,6 / 0,9 / 1,2 s → Weddings, a 1,6 s → Artists
  (depois da passagem); percurso normal e forte topo → 8a → topo, uma paragem por gesto 2/2.
- **Por verificar no iPhone do owner**, com a fita (`hud.js` ● rec; a coluna `pass` tem agora `Z` encaixe ligado, `H` paragens do Work
  retidas, `L` página parada).

## Questions: ler uma resposta sem a passagem para o Contact começar (13/11) — README #111; bug 4 dos vídeos do owner

### O bug (vídeo do owner, iPhone, 12/11 23:53)
Com *Is it only digital?* aberto, um gesto pequeno para ler sobe a página ~30 px (o título debaixo da barra) e às vezes as perguntas
desbotam, a barra diz *CONTACT*, e tudo volta (0,9–1,5 s, 3 s, 12,5 s, 14 s).

### Causa (Simulador, gravador por fotograma: `scrollY`, `c-dusk`, `data-c-run`/`c-hold`, opacidade de `.q-box`)
- A passagem começa a 15 % do caminho entre as paragens (128 px de 856 no iPhone 17 Pro) — por desenho (#107).
- Arrasto lento de 220 pt com o dedo parado 0,3 s antes de levantar: a passagem começou (f 0,17), as perguntas desceram a **0,01**, e o
  encaixe levou a página de volta às Questions; voltaram. Gestos de 40–90 pt: nada (não chegam aos 15 %).

### O que mudou (`contact-client.tsx`, `place()`)
Com um dedo no ecrã (`fingerDown`, `lib/finger.ts`) a passagem só começa (ou volta) a meio caminho; com o dedo levantado, como antes.

### Testado (Simulador, dedo do `simtouch`, uma resposta aberta)
| gesto | antes | agora |
|---|---|---|
| ↓ 100 pt lento, parado antes de largar | nada | nada, fica nas Questions |
| ↓ 220 pt lento, parado | perguntas a 0,01 e de volta às Questions | a passagem só começa depois de largar, com a página a ir para o Contact; Contact |
| ↓ 160 / 300 / 400 pt lentos, parados | Contact | Contact, a passagem começa ao largar |
| ↓ 60 pt / 80 ms, 300/120, 450/45 (rápidos) | Contact | Contact, a passagem começa logo |
| ↑ do Contact 60 / 100 / 200 pt lentos, parados | — | ficam no Contact, sem a luz voltar |
| ↑ do Contact 300 pt lento; 60/80; 300/120 | — | Questions, a volta começa ao largar / logo |
| percurso 12 → fim → 11, gestos normais | — | uma paragem por gesto |

### Não verificado
Xiaomi (Chrome Android também tem dedo: o mesmo caminho), o iPhone do owner. Desktop sem mudança de código no seu caminho (sem dedo),
não repassado.

### Depois do vídeo do owner (iPhone, 13/11 01:16): o bug era outro — "quando abres uma pergunta e fazes scroll para avançar o texto todo vai para cima"
- No vídeo: com *What about the domain and hosting?* aberta, cada gesto para avançar sobe a caixa ~40 px (o título debaixo da barra) e
  volta; sem resposta aberta nada sobe. (A mudança do dedo acima fica: escolhida pelo owner, resolve o desbotar e voltar do 1.º vídeo.)
- **Causa 1 (medida, Simulador, topo da caixa por fotograma):** a caixa subia até o fim da lista ficar 18 `--p` (~59 px) acima do fundo do
  ecrã (`questions.css`, `top` com `--q-foot`). Com a resposta aberta o fim da lista estava só 5 px abaixo do ecrã: subia **65 px**
  (−70 → −135) a cada gesto; fechada, 0. **Correção:** sem a margem — sobe só o que está escondido.
- **Causa 2:** a caixa é segura durante um ecrã (o `::after` da secção, 884 px) e a paragem do Contact está onde esse ecrã começa; a
  resposta aberta alonga a caixa (925 → 1019 px) e o caminho até ao Contact (856 → 949): solta, a caixa subia os últimos ~60 px enquanto
  desbotava (opacidade 0,71 → 0). **Correção:** `--q-over` (`questions-client.tsx`, = caixa − papel, em `<html>`): o `::after` cresce isso
  e o Contact começa outro tanto mais acima (`contact.css` `margin-top`), por isso nada no Contact muda de sítio (medido: `c-start`, o
  colofão e o fim da página iguais aos de antes, para cada resposta).

| resposta aberta (Simulador, gesto 300/120 para o Contact) | caixa enquanto se vê: antes | agora |
|---|---|---|
| nenhuma | −70 | −70 |
| 0 / 4 / 7 | −96 / −114 / −114 | −70 / −70 / −70 |
| 1 | −156 | −96 (26 px escondidos) |
| 2 / 3 / 5 / 6 | −135 | −75 (5 px escondidos) |
- Volta do Contact com a 6 aberta: caixa parada (−70). Percurso 12 → fim → 12 com a 6 aberta: uma paragem por gesto. Desktop (Chrome 1500):
  `--q-over` 0 (a caixa tem altura fixa).
- **Encontrado, não é desta mudança (também com o CSS antigo injetado):** depois de abrir e fechar uma resposta, o fim da página fica 114 px
  além do colofão (`scrollHeight` 17024 com o colofão a acabar em 16910) — o WebKit não encolhe a página. Pode estar ligado ao bug 5 do
  owner ("um 3.º scroll no Contact puxa tudo para cima"). Por investigar com o 5.
- Não verificado: Xiaomi (Chrome Android, telemóvel sem `--q-lift`), o iPhone do owner, 320 × 640.

### Refeito com a ideia do owner (vídeo 13/11 10:07: "ainda está igual e parece ter causado algum lag"): a resposta fecha ao avançar
- **Ainda subia:** a 1.ª resposta (a mais longa) leva o fim da lista além de `100svh` (o ecrã com a barra do Safari à vista); a barra do
  owner estava recolhida, a lista via-se toda, mas a caixa subia para a mostrar.
- **O lag era meu:** `--q-over` era escrito em `<html>` a cada fotograma da resposta a abrir (0,7 s) — a página inteira recalculada.
- **Cabe sempre?** (pedido do owner; Chrome emulado, a resposta mais longa aberta, barra à vista — alturas estimadas, exceto o iPhone 17 Pro
  medido no Simulador): **não** — iPhone 17 Pro 26 px escondidos (cabe com a barra recolhida), 390 × 664 60, mini 375 × 629 124, SE
  375 × 548 179 (fechada já 47), Xiaomi 392 × 700 35 (cabe sem a barra), Android 360 × 720 69, 360 × 640 117, 320 × 640 138; cabem Pro
  Max 440 × 800, Pixel 412 × 780, tablet 768 × 1024. Com a resposta a fechar ao avançar, a lista volta inteira.
- **O que mudou:** sai o `--q-over` (`questions.css` `::after`, `contact.css` como antes). `questions-client.tsx` mede a caixa **com as
  respostas fechadas** (as alturas abertas descontadas): `--q-rest` (a altura da caixa num telemóvel — abrir uma resposta já não alonga
  a página) e `--q-foot` (o fim da lista fechada: a caixa só sobe se nem fechada couber), escritos na secção e só quando mudam. E **a
  resposta aberta fecha** quando a página passa 12 px além da paragem das Questions, a caminho do Contact (não para o About).

| (Simulador, iPhone 17 Pro; Chrome emulado) | resultado |
|---|---|
| cada uma das 8 respostas aberta | caixa 925 e página 16910 sempre iguais (antes 925–1039 / 16910–17024); 392 × 700, 375 × 629, 320 × 640, 375 × 548 e o desktop também constantes |
| gesto 300/120 para o Contact com a 0 / 1 / 2 / 6 / 7 aberta | caixa parada (−70) enquanto se vê; a resposta fecha ~9 fotogramas depois do início; Contact |
| arrasto de 60 pt para baixo, parado, com a 0 aberta | a resposta fecha, fica nas Questions |
| arrasto de 80 pt para cima com a 6 aberta | continua aberta, fica nas Questions |
| Contact e volta | as Questions com tudo fechado |
| percurso Questions → fim → 12 com a 1.ª aberta; forte 450/45 ida e volta | uma paragem por gesto |
- Os 114 px a mais no fim depois de abrir/fechar uma resposta (ver acima) **deixaram de acontecer**: a página já não muda de altura.
- Não verificado: o lag no iPhone do owner e no Xiaomi (o Simulador não mede isso); Xiaomi em geral.
- **O título nunca passa para debaixo da barra (owner, 13/11):** sai também a subida que mostrava o fim de uma lista **fechada** mais
  longa que o ecrã (`--q-foot`, só 375 × 548 com a barra à vista, 47 px: a última linha espera que a barra recolha). Simulador, topo de
  *What do you actually create?* enquanto se vê, gesto 300/120 para o Contact e arrasto de 60 pt, sem resposta / 1.ª / 7.ª aberta:
  **64–65 px em todos** (fundo da barra a 54).
- **B (owner, 13/11): a resposta fecha quando a luz começa a baixar** (`c-dusk`, observado em `questions-client.tsx`), não nos primeiros
  12 px do gesto (a A, primeira ideia do owner). Simulador, 1.ª e 7.ª abertas: arrastos de 60 e 200 pt parados (a página volta às
  Questions) → **a resposta fica aberta**, 4/4; gestos 300/120, 120/120 e 200/500 → fecha **no fotograma em que a luz começa** (opacidade
  das perguntas ainda 1), Contact, 5/5; arrasto para cima → fica aberta; Contact e volta → tudo fechado, 4/4 (uma 5.ª deu "aberta": o
  gesto para baixo não chegou ao Simulador, a página nunca saiu das Questions). Título a 64–65 px em todos.
- **Owner, no iPhone dele (13/11): "confirmado OK".** Não verificado: Xiaomi.

## Questions ↔ Contact com gestos rápidos (13/11) — README #112; bug 3 dos vídeos do owner

### O bug (vídeo do owner, iPhone, 12/11 23:52) e a medição (Simulador, gravador por fotograma: `scrollY`, secção, `c-dusk`, opacidades)
- **Ida, 2 gestos fortes a 0,5 s:** Contact e logo o fim — **o colofão aos 0,85 s, a pergunta aos 1,15–1,25 s** (a passagem de 3 s apressada).
- **Volta, 2 gestos a 0,4 s:** a barra *QUESTIONS* ainda no escuro (0,7 s); a pergunta sai aos 1,12 s e as perguntas voltam aos 1,73–1,87 s:
  **~0,6 s de escuro vazio** (pelas rampas do E: as perguntas só com o papel aceso, x < 0,2; a pergunta sai em x 0,62).
- A barra muda com o scroll, a luz com o relógio (*CONTACT* sobre o papel ainda claro). Owner escolheu corrigir a ida e a volta, não a barra.

### O que mudou
- **Ida** (`contact-client.tsx` `data-c-on`, `about-stage.ts` `data-past`, `method.css`): do início da passagem ao 1.º repouso depois de
  ela acabar, as marcas além do Contact (colofão, fim da página) saem; um 2.º gesto volta a parar no Contact. Só marcas abaixo da página.
- **Volta** (`contact-client.tsx` `run`): entre x 0,62 e 0,2 a três vezes a velocidade.

### Testado
| | resultado |
|---|---|
| Simulador, 2 gestos 450/45 a 0,3 / 0,5 / 1,0 / 2,0 s | Contact sempre (0,3 s 2/2); a pergunta aos ~2 s, no tempo dela; o colofão ainda espreita enquanto o dedo arrasta (como no 7 e no 12) |
| Simulador, 2 gestos a 3,6 s (passagem acabada) | colofão |
| Simulador, volta do Contact 300/120 e 450/45 | pergunta fora → perguntas de volta: **317 / 350 ms** (antes ~680) |
| Simulador, percurso 12 → fim → 12 | uma paragem por gesto |
| Chrome 1500, trackpad: 2 gestos a 0,5 s, depois ↓ ↑ ↑ | Contact → colofão → Contact → Questions, 2/2 |
| Safari 27.2, trackpad, o mesmo | os 2 gestos rápidos → Contact 4/4; **encravamentos de um gesto no Contact** (↓ 1/3, ↑ 1/3) — **também com a retenção anulada por CSS injetado** (o comportamento antigo: os mesmos 1/3): antigos, o #1 do Safari, não desta mudança |

### Não verificado
O iPhone do owner, o Xiaomi.
- **Owner (13/11): "parece-me ok".** Não verificado: Xiaomi.

## O fim da página e a barra do browser (13/11) — README #113; bug 5 dos vídeos do owner

### O bug (owner, 12/11 23:53: "no contacto existe um 2.º scroll que abre o Built around you, mas ainda existe um 3.º scroll que puxa tudo para cima")
Simulador (iPhone 17 Pro): Contact → ↓ fim (y 16156, ecrã 754, barra recolhida) → ↓ o Safari mostra a barra (ecrã 714, a página fica) e a
pergunta desce 11 px → ↓ **a página anda mais 40 px** (16196): o colofão 463 → 423, a pergunta volta 102 → 91. Com a barra à vista o fim
da página está 40 px mais abaixo (`maxY` = altura − ecrã), e no fim do iOS um gesto sem marca à frente vai livre até lá.
- Tentativa descartada: a última marca fixa no pé − `100lvh`, com `scroll-snap-align: start` — o iOS ignora-a, o gesto vai livre ao fundo.

### O que mudou
- `contact.css`: depois do colofão, `.c-hold::after` com `100lvh − 100svh` de altura (40 px iPhone, 0 desktop); o colofão `sticky`,
  `top: calc(100svh − var(--c-colo))` — o seu pé no ecrã curto, e assim fica nos últimos píxeis; as animações da entrada do colofão
  (colofão, filete, pergunta e ação a subir) acabam `100lvh − 100svh` antes (`animation-range: entry 0% entry calc(100% − …)`): com a
  barra à vista o WebKit dava-as a 0,88 na paragem.
- `about-stage.ts`: a última marca é o pé da página − `100lvh` (régua), `scroll-snap-align: start`; sai a marca alinhada pelo pé
  (`data-align='end'`, `method.css`). O colofão tem 73 px vazios por baixo do texto: com a barra à vista não tapa texto nenhum.

### Testado
| | antes | agora |
|---|---|---|
| Simulador: Contact → ↓ ×4 e um forte, barra recolhida e à vista | colofão 463 → 423, pergunta 91 → 102 → 91 | colofão 423–424, pergunta 91 (progresso 1,00), *Talk to us* 313, opacidade 1 e filete em todos; o texto do colofão acaba a 641 (barra a 714) |
| Simulador: voltar (↑ ↑) | | Contact → Questions |
| Chrome 1500 × 857: Contact → ↓ ×3 → ↑ ↑ | | fim 12365, colofão 619 → 857 sempre; Contact → Questions — igual a antes |

### Não verificado
O iPhone do owner; o Xiaomi (barra de 56 px: o colofão tem de ter ≥ 56 px vazios por baixo do texto lá — a medir); Safari desktop.

### Depois do iPhone do owner (13/11 11:51): "ainda dá um saltinho" e "o Built around you sobe demasiado … a ideia é quase ser um footer"
- No vídeo: ao chegar ao fim o colofão parava e ainda subia ~40 pt devagar, e repousava ~113 pt acima do fundo: a margem do colofão num
  telemóvel já contava a barra (`4svh + 100lvh − 100svh`) e o espaço novo contava-a outra vez.
- **Correção:** com JavaScript e movimento, num telemóvel, a margem do colofão é só `4svh` (o espaço depois dele já é o da barra).
- Simulador, Contact → ↓ fim: chegada contínua (os últimos 14 px em ~0,5 s, o encaixe do iOS), **texto do colofão a 681, 73 px acima do
  fundo (754) — onde estava antes de #113**; com a barra à vista e com mais gestos: colofão 463–464, texto 681, pergunta 131, sem mexer.
  A pergunta fica 40 px mais abaixo do que antes (131 em vez de 91): a cena sobe só o que o colofão (mais baixo) precisa.
- **Owner: "ainda sobe muito comparada com a barra do browser".** Margem do colofão num telemóvel `max(10px, 1.5svh)`. Simulador: a
  última linha a 699 — **15 px acima da barra do Safari** (714) e 55 px acima do fundo com a barra recolhida (o botão do Safari fica
  por baixo); igual com a barra à vista e com mais gestos (colofão 481–482); volta: Contact → Questions → 14. Capturas no scratchpad
  da sessão (end-a/b.png).
- **Owner: "não vejo diferença"** (18 px) → escolheu **o colofão encostado ao fundo, a subir com a barra** (em vez de reservar o lugar da
  barra). Tentativa descartada: colofão `sticky; bottom: 0` num invólucro com a altura da barra — o iOS segura um `sticky` ao ecrã grande e
  a barra tapava o texto até ao gesto seguinte (Simulador). **Feito:** sai o espaço depois do colofão; a última marca volta a ser a do pé
  (`scroll-snap-align: end`); `contact-client.tsx`: ao encurtar o ecrã com a página no fim (a barra do Safari a entrar), a página vai já
  para o novo fim. Margem do colofão `max(10px, 1.5svh)`.
  Simulador: fim com a barra recolhida — última linha **15 px acima do fundo** (o botão do Safari ao lado); ↓ a barra entra e o colofão
  sobe **com ela** (521 → 481), linha 15 px acima da barra; ↓ ×2 e forte: nada se mexe; pergunta 149, progresso 1,00 sempre; volta Contact →
  Questions. Capturas `f-a.png` / `f-b.png` no scratchpad da sessão.
- **Owner (13/11): "está ok"** (o colofão como rodapé). Não verificado: Xiaomi.

## O texto do Contact e o colofão mais suaves (13/11) — README #114
- **Pedido (owner):** "as animações do contact estão muito bruscas e não smooth elegante como o resto do site" — o texto do Contact (a
  pergunta, a linha, *Talk to us*) e o colofão.
- **Medido antes:** a pergunta 0,66 s e a linha + ação 0,54 s, curva de entrada e saída cúbica (3× a velocidade média a meio), a subir 4 %
  do ecrã; o colofão (opacidade, filete) e a subida da cena por `view-timeline` — à velocidade do gesto, no iPhone o encaixe do iOS.
  O resto do site: as Questions 0,9 s / 0,6 s com `cubic-bezier(0.2, 0.7, 0.2, 1)`, 5 %.
- **Feito:** `contact-client.tsx` — `settleIn` (essa curva), a pergunta em x 0,56–0,86 da passagem de 3 s, a linha 0,72–0,98, subida 2 %;
  o colofão por tempo: `--c-in` 0 → 1 (1,1 s a entrar, 0,7 s a sair, a curva do site), logo que o colofão aparece no fundo do ecrã;
  `contact.css` — o colofão, o filete (só no último quinto), a pergunta e a ação lidos de `--c-in`; saem os `view-timeline` e os
  `@keyframes` (c-ask-up, c-now-up, c-colo-in, c-rule-in).
- **Simulador (iPhone 17 Pro):** Questions → Contact — a pergunta 0,05 → 0,95 de 1,99 a 2,47 s, a linha de 2,47 a 2,89 s, máx. 1,1 px por
  fotograma; Contact → fim — o colofão de 0,34 a 0,93 s, a cena sobe 22 px em ~0,9 s (máx. 1,4 px por fotograma); volta ~0,6 s.
- **Chrome 1500:** o fim igual a antes (pergunta a 77 px, escala 0,79, colofão opaco com o filete); volta ao Contact.
- Não verificado: o iPhone do owner (o veredicto), o Xiaomi, o Safari desktop.
- **Owner (13/11): "parece-me bem".** Não verificado: Xiaomi, Safari desktop.

## Method, telemóvel: o ecrã inteiro (9) para a capa *Your first chapter* (10) sem salto (13/11) — bug 2 dos vídeos do owner
- **O bug (owner, iPhone, 12/11 23:51):** "a animação para o your first chapter parece estar a dar um salto e não está smooth".
- **Medido (Simulador, fotograma a fotograma, o cartão do Weddings, a foto, o painel, o menu):** no fotograma em que 9 passa a 10 o cartão
  ia de 954 a 884 px de altura, a foto de 600 a 530, **o painel de texto subia 70 px**, os cantos passavam de retos a redondos — tudo antes
  de se mexer; depois ~100 ms parado. Causa: o ecrã inteiro tinha a sua própria forma (`.is-full`: a proporção do ecrã e da ilha, mais
  70 px; cantos retos; sem sombra; foto e painel com alturas suas) e a classe saía de uma vez. Em 8c → 9 o menu do ecrã saltava 53 px.
- **Feito (`method-stage.ts`, `method.css`):** o ecrã inteiro é o cartão na sua forma, ampliado por igual (`FULL`, ~1,08 no iPhone: os
  lados ~16 px além do ecrã, os cantos e a sombra fora dele); saem as regras de forma, cantos, sombra e alturas do `.is-full`. O menu desce
  por `translate` animado com o cartão (as suas palavras; 15cqw e a ilha no iOS) em vez de `top`. As palavras no topo do painel
  (`.is-full`) entram logo e, em 9 → 10, saem aos 420 ms, já desvanecidas.
- **Simulador:** 9 → 10 contínuo (o cartão sem degrau; a classe sai com as palavras e o menu a 0,04 de opacidade); o menu — maior passo
  por fotograma enquanto se vê: 8c → 9 10 px (com o cartão a crescer), 9 → 10 3 px, 10 → 9 1 px, 9 → 8c 5 px; em 9 o menu e as palavras onde
  estavam (menu y 110, palavras 533 em vez de 530). Ainda há um fotograma longo no início de cada mudança de fase (80–110 ms no Simulador,
  nos dois sentidos, já antes): o custo de começar todas as animações da fase — **a medir no iPhone e no Xiaomi**, o Simulador não serve.
- Não verificado: o iPhone do owner, o Xiaomi (Android: sem a ilha, `FULL` = 1 — a forma já era a mesma; muda só o menu, agora animado).
- **Owner, no iPhone dele (13/11): "acho que está corrigido sim".** Não verificado: Xiaomi.

## Xiaomi Mi 11 Lite: os 5 bugs e o Contact mais suave (13/11) — `finger/xiaomi-bugs.mjs`, `finger/xiaomi-drag.mjs`
Chrome 157, 392 × 779 (barra) / 835 (sem barra), `adb forward tcp:9222 …`, `adb reverse tcp:3133 tcp:3133`. Gestos de toque com inércia
por CDP (`Input.synthesizeScrollGesture`; ⚠ não dão eventos de toque à página — para o "dedo no vidro" usar `xiaomi-drag.mjs`,
`Input.dispatchTouchEvent`; o `adb shell input swipe` precisa no MIUI de "Depuração USB (definições de segurança)").

| | resultado |
|---|---|
| **1** um gesto do topo — normal / forte / muito forte | Weddings 9/9 |
| **1** dois gestos a 0,3 / 0,6 / 0,9 / 1,2 s | Weddings 4/4 |
| **1** percurso normal | topo → W → A → E → 7 → E → A → W → topo, uma paragem por gesto |
| **1** percurso forte (700 px a 6000 px/s) | W → **E (passa o Artists)** → 7 → 8a; de volta 8a → 7 → **topo (passa o Work)** — o #1 dos gestos rápidos fora do iOS (já registado a 12/11 no Xiaomi), não destas mudanças |
| **1** vaivém 5× a 0,3 / 0,5 / 0,8 s | só Weddings (a 0,8 s também Artists: um gesto depois da passagem acabar) |
| **4** gesto para o Contact com a 1.ª / 7.ª aberta | título fixo (70) enquanto se vê; a resposta fecha no fotograma em que a luz começa |
| **4** arrastos de 90 / 150 / 250 px com toque real, parados (7.ª aberta) | ficam nas Questions, a resposta aberta; um gesto rápido de 300 px → Contact, fechada |
| **3** dois gestos fortes a 0,3 / 0,5 / 1,0 s das Questions | Contact 3/3 (o colofão espreita enquanto o dedo arrasta, como no iPhone) |
| **3** volta do Contact, normal / forte | escuro entre a pergunta e as perguntas: 287 / 277 ms |
| **5** fim: ↓ e mais 3 gestos | colofão encostado ao fundo (835), última linha a 16 px; nada se mexe; ↑ pequeno → Contact; ↓ → fim igual |
| **2** 8c → 9 → 10 → 11 e volta | cartão: maior passo 11–17 px por fotograma; menu ≤ 6,5 px; um fotograma longo no início de cada fase, 42–95 ms (9 → 10: 87 ms; a 2/11 eram 122) |
| **Contact** passagem Questions → Contact (3 s) | média 12,2 ms (~82 fps), mais longo 69 ms, 4 acima de 34 ms |
| **Contact** chegada do colofão / volta | média 11,3 / 11,1 ms, mais longo 23 ms, nenhum acima de 34 ms |

Não verificado: um dedo verdadeiro no Xiaomi (gestos sintéticos por CDP; o owner pode confirmar à mão).
