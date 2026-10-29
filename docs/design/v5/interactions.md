# V5 — Interações: especificação técnica

> **Desde 25/10/2026 a especificação estado a estado está em `storyboard.md`** (o percurso completo aprovado,
> com a técnica de cada estado e todo o texto). Este ficheiro guarda as regras gerais (§0) e o detalhe técnico.

Regras gerais (aplicam-se a tudo):

- **Nada bloqueia.** Scroll, links e teclado funcionam desde o primeiro instante.
- **A performance pesa-se, nada é proibido** (owner, 27/10, README #68). O caminho barato é transform,
  opacity, clip-path e traços SVG em CSS. WebGL, `backdrop-filter`, `filter` animado, mais de ~6 camadas
  animadas ou cenas mais longas são possíveis: quem as propõe **diz o risco** (o custo, onde, a
  alternativa), constrói-as, e **o veredito final é a medição no Xiaomi**, mesmo depois de escolhidas.
- **Gesto, chegada ou passagem por scroll** (regra revista a 25/10, README #24): cada animação nasce de
  um gesto (clique, toque, tecla), da chegada à página ou de uma **passagem ligada ao scroll** que cumpra
  as regras de §0. O limite não é a técnica — é o lag medido no Xiaomi.
- **Alternativas**: todo o gesto tem equivalente por teclado e controlo visível; nada depende de hover.
- **`prefers-reduced-motion: reduce`**: versão desenhada — estado final imediato, trocas instantâneas.
- **Sem JavaScript**: todo o conteúdo visível e navegável (as ilhas só acrescentam).
- Curva base: `cubic-bezier(0.2, 0.7, 0.2, 1)`; durações 0,6–1,2 s; nada linear, nada elástico.

---

## 0. O caminho — fechado com o owner a 25/10/2026

### Orientações para as passagens ligadas ao scroll (contra o lag; nenhuma é proibitiva — README #68)

O owner quer WOW e aceita transições ligadas ao scroll desde que não haja lag nos telemóveis mais fracos.
O lag do site original não vinha de "acompanhar o scroll", vinha de JavaScript por frame, muitas camadas
e filtros, vídeo duplicado e uma progressão presa durante muitos ecrãs. Daí:

1. **Scroll nativo por omissão**; **cenas presas** (`position: sticky`) durante uma passagem. Outra coisa
   (sequestro do scroll, smooth scroll) só com o risco dito e medido.
2. **Ligado ao scroll, de preferência `transform` e `opacity` em CSS** (`animation-timeline: view()` /
   `scroll()`), sem JavaScript por frame — no Chrome Android corre no compositor. `clip-path`, filtros ou
   JavaScript por frame são possíveis, com o risco dito e medido no Xiaomi.
3. **Uma passagem de cada vez** como referência: uma cena presa no ecrã, ~6 camadas animadas; acima disso,
   risco a dizer e a medir.
4. **O vídeo pausa fora do ecrã.**
5. **Alternativa obrigatória**: sem suporte, reduced motion ou sem JavaScript → estado final ou gesto de
   chegada único. O conteúdo nunca depende da passagem.
6. **Medir no Xiaomi** cada passagem antes de construir a seguinte (a Entrada → Work primeiro, o Method
   logo a seguir — são as mais pesadas).

### Cena a cena

| Cena | Fundo | Passagem / chegada | Interação |
|---|---|---|---|
| **Entrada** | vídeo + tinta da hora | sequência de §1 | qualquer gesto completa; **scroll → Work em I Weddings; lâmina → Work nesse capítulo** (README #44); a escolha fica em memória para o Method (#45) |
| Entrada → Work | — | **a moldura do vídeo encolhe até à moldura em arco do palco** e dissolve-se na primeira fotografia de Weddings (README #33); o vídeo pausa quando já não se vê | — |
| **01 Work** | fundos calmos por capítulo + **aura de cor da própria fotografia** (README #40, por confirmar) | palco preso; **o scroll muda I → II → III**: a cor nova sobe pelo palco, a fotografia muda de moldura | §2 |
| Work → Method | Experiences → **o estúdio, com a luz da hora** (README #47) | **o desenho multiplica-se em ecrãs-template**; *No templates. No copies.* + **Make it yours** (README #36–#37) | campo do nome |
| **02 Method** | estúdio (#47) | §3 | §3 |
| Method → About | a luz do estúdio baixa e leva ao escuro do About (README #48) | a frase do About assenta (escala 1,04 → 1); o **retrato 124 ganha cor ao subir no ecrã** (camada de cor sobre a mesma fotografia, só opacidade) | segurar para a cor continua |
| **03 About** → **04 Questions** | por decidir | **nada** — é para ler; a calma também é uma passagem | `<details>` nativo |
| Questions → **05 Contact** | carvão | *Is there something that deserves its own experience?* grande, presa um instante; depois a linha da hora e **Talk to us** | Instagram |
| Voltar ao topo | — | a entrada mostra o estado final; não repete | — |

Valores (escalas, alturas presas) são pontos de partida a afinar no protótipo e no Xiaomi.

### *No templates. No copies.* (revisto: README #36, #39)

1. Na ponte Work → Method, grande, com **Make it yours** por baixo.
2. O Method **demonstra-a** (§3).
3. **Não** se repete no fim do Method — aí fica *Made once, for one moment.* Rodapé do site: por confirmar.

Referência visual de todo o caminho Entrada → Work → Method: storyboard v3.1, https://claude.ai/artifact/9vkDx379vuwuiaXre62cxz

---

## 1. Entrada — "Através das letras"

### Camadas (de trás para a frente)

1. `<video>` em ecrã inteiro (`object-fit: cover`), `muted playsinline loop autoplay`,
   `preload="auto"`; **uma só** fonte por formato de ecrã (ver `assets.md` §Vídeo):
   - desktop/landscape: `hero-1920.mp4` (1920×960, 2,1 MB);
   - mobile/portrait: `hero-720x1280.mp4` (recorte vertical, 0,95 MB);
   - escolha por `<source media="(orientation: portrait)">` **ou**, mais fiável, por JS no arranque
     (um único pedido; nunca dois `<video>` com o mesmo ficheiro — o site antigo descarregava duas vezes);
   - `poster` = fotograma 4,4 s em AVIF (largo e vertical), mostrado de imediato.
2. **Tinta da hora** — um `<div>` com gradiente semitransparente sobre o vídeo (sem blend modes):
   - 05:00–10:59 manhã: azul-cinza frio, alfa baixo;
   - 11:00–16:59 dia: neutro, quase nada;
   - 17:00–20:59 fim de tarde: âmbar;
   - 21:00–04:59 noite: azul profundo, mais escuro.
   (A hora vem do relógio do visitante; nada é pedido nem enviado.)
3. **Véu das letras** — um SVG em ecrã inteiro, preenchido a carvão, com **CHAPTER ONE recortado**
   (máscara SVG interna: retângulo branco + texto preto). Vê-se o vídeo através das letras. É uma camada
   estática; anima-se só com `transform`.
4. **Dedicatória** e, no fim, **título**, **subtítulo**, **lâminas** e **Talk to us** (HTML normal).

### Sequência (≈ 2,6 s; valores de partida a afinar no protótipo e no Xiaomi)

| t | Acontece |
|---|---|
| 0 | Ecrã carvão; dedicatória entra (opacidade, 600 ms). O véu cobre tudo; o vídeo (ou o poster) já está por trás |
| 0,3–1,2 s | As letras abrem-se: o véu passa de `scale(1.08)` + opacidade 0 → `scale(1)` + 1 — o vídeo aparece dentro das letras |
| 1,4–2,6 s | **Entrar pelo O**: o véu escala **a partir do traço esquerdo do O** (`transform-origin` no traço; `scale(1)` → `scale(~60)`) até a letra cobrir o ecrã; no fim, opacidade 0 e `display:none`. **Corrigido a 25/10:** escalar pelo *centro* do O enche o ecrã com o miolo da letra, que é véu (escuro); a janela é o traço. **E o que escala é o véu, nunca o vídeo**: o vídeo fica parado (com um ligeiro avanço de 1,14 → 1) e a janela aproxima-se — é isso que se lê como câmara (README #58). Letra-janela num peso mais forte de Cormorant (500/600) |
| 2,2–3,0 s | O título **reaparece centrado, mais pequeno, em letra sólida** sobre o vídeo, com o subtítulo *Digital experiences built for moments worth remembering.* (opacidade + 12 px); **três lâminas** entram em profundidade (translate + leve rotação, desfasadas 120 ms); a **navegação** e o **Talk to us** aparecem com este estado |

- **Qualquer gesto** (scroll, toque, tecla, clique) → salta para o estado final de imediato.
- **Reduced motion / Save-Data / vídeo falhou** → estado final com o poster (imagem fixa); sem véu.
- **Sem JavaScript** → estado final estático (poster + título + lâminas como links).
- A sequência corre **uma vez** por carregamento (um refresh no topo mostra-a outra vez); voltar ao topo não a repete:
  **o E4 é o topo da página** (README #66).
- **Risco a medir primeiro**: o custo de escalar um SVG grande com máscara no Xiaomi. Plano B se houver
  quebra de frames: rasterizar o véu (PNG/AVIF com transparência, 2 tamanhos) e escalar a imagem.

### Lâminas (a ideia C, no fim da entrada)

- Três painéis com `clip-path: polygon(...)` oblíquo, imagem do capítulo (P&B), nome em Cormorant.
- Profundidade: escalas e sombras ligeiramente diferentes; com ponteiro fino, deslocamento ≤ 10 px pela
  posição do rato (rAF só enquanto o rato se move).
- Clique/toque/Enter → desce até ao Work **com esse capítulo já selecionado** (âncora + estado).

### Personalização (sem dados enviados a ninguém)

- `Intl.DateTimeFormat('en-GB', { weekday:'long', day:'numeric', month:'long' })` + hora `HH:MM`.
- **O momento da chegada é guardado em memória** no arranque (dia, hora, faixa da luz, se voltou) e
  reutilizado no Method (§3) e no Contact.
- *Welcome back*: `localStorage` (`c1.lastVisit`, ISO), sempre com `try/catch`; se falhar, não aparece. **Conta como
  regresso só se a última visita foi há mais de 30 minutos** — lê-se o valor guardado *antes* de gravar a hora desta
  visita, e um refresh dentro dos 30 min nunca mostra *Welcome back*. Sempre *second chapter* (não se conta). Sem prazo
  (README #66).
- Sem geolocalização, sem IP, sem cookies, sem analytics.

---

## 2. Work — um palco; o scroll muda o capítulo, o tempo muda o momento (README #26, #40, #43, #44)

Estados 2–6 em `storyboard.md`. Técnica:

- **Palco preso** (`sticky`) durante três passos de scroll: I Weddings → II Artists → III Experiences. Separadores
  (abaixo da barra) e lâminas da entrada levam à posição de scroll do capítulo (âncoras sem JS).
- **Atmosfera de cor** (#40): aura da fotografia ativa = imagem ~48 px desfocada pré-gerada, esticada, máscara
  radial, ~50 % de opacidade; P&B de Weddings com aura quente. Troca por opacidade. Nada de `filter` ao vivo.
- **Camadas:** três fotografias empilhadas e desfasadas (frente / b1 / b2); a ativa vem à frente (opacidade +
  `transform`, ~1 s). Moldura por capítulo: I arco · II retângulo · III recorte oblíquo.
- **Momentos por tempo** (#43, ritmo da #73): **um só tempo, 4 s** — a palavra enche-se em 4 s e, cheia, passa ao momento
  seguinte; nesses 4 s a foto (~1,2 s) e depois a peça principal sobre a fotografia inteira (~2,8 s); a linha do momento enche-se (camada `scaleX`); tocar num momento fixa-o (mecanismo de parar, WCAG
  2.2.2); pausa com rato/foco sobre o palco; reduced motion: sem rotação; ao mudar de capítulo recomeça no primeiro.
- **Demonstrações** (uma de cada vez, só `transform`/`opacity`, nunca recortam a fotografia): ver a lista das nove
  em `storyboard.md`. Na lista, a peça mostrada leva um círculo (preenchido enquanto anima) e *on the photograph*.
- **Imagens por intenção**: as do capítulo seguinte carregam antes de o scroll lá chegar.
- Sem JS: os três capítulos em sequência, momentos e peças visíveis.

---

## 3. Method — "Feito para quem chega" (README #30, #34–#39, #45, #47–#49)

Estados 7–11 em `storyboard.md`. Técnica:

- **Cena presa** durante cinco passos de scroll; o estúdio é **uma imagem pré-preparada por faixa horária**
  (papel curvo + luz com direção + vinheta + grão, ~40–60 KB) + uma sombra pequena por ecrã; nada recalculado.
- **Templates → ecrãs:** cada carta tem a folha-template por cima (opacidade, não blur) e o ecrã único por baixo;
  a folha sai com `transform` ligado ao scroll; a forma do ecrã muda uma vez, ao aparecer.
- **Nome** (*Make it yours*): `<label>`, debounce ~150 ms, só em memória; aparece primeiro **igual em todos os
  templates** e depois compõe cada ecrã, a capa, *For Ana.*, *Talk to us, Ana*, o colofão e o menu. Resumo em
  `aria-live="polite"`. No telemóvel o teclado encolhe a janela: o campo fica no topo da cena e nada anima com foco.
- **Ecrã em destaque** = capítulo escolhido na entrada (Weddings por omissão); só ele anima por dentro (≤ 6
  camadas). Telemóvel: abre-se a ecrã inteiro, por baixo da barra.
- **A luz baixa** (#48): opacidade de uma camada escura com uma luz redonda medida pela **largura** (não estica no
  telemóvel); no desktop os ecrãs afastam-se para os lados (~60 %), no telemóvel saem.
- Reduced motion: estados finais sem animação. Sem JS: composição com texto genérico.

---

## 4. About (README #50–#52)

Estados 12–14 em `storyboard.md`. Técnica:

- **A luz encontra-te:** o retrato já está na sala escura; a luz é uma camada escura com um furo (imagem
  pré-preparada) que se move com `transform`; a sala acende-se por opacidade.
- **O nome** é um só elemento no lugar final; no estado de luz está deslocado e reduzido por um `transform`
  **medido** (FLIP); a frase só entra depois de ele chegar.
- **Cor do retrato:** P&B por omissão; hover (desktop), segurar (telemóvel — aqui funciona, o About não fica
  preso), foco + Enter; ao largar volta ao P&B. Uma só fotografia (P&B derivado da 124). A aura do fundo troca de
  P&B para cor ao mesmo tempo, devagar (~2 s, curva suave). Reutilizar o padrão de `ColourReveal` do M1, sem botão.

---

## 5. Navegação (README #56)

- Barra em todos os ecrãs; secção atual por `IntersectionObserver` (`rootMargin`), sem custo de scroll; sem JS a
  barra é uma lista de âncoras.
- **Barra (README #71, A2):** as ilhas sempre visíveis; o vidro é só `backdrop-filter` + película `--tint` + um fio de luz
  (`inset 0 0 0 .5px`), sem brilho nem sombra. O escuro mede-se por baixo das palavras (percentil 75 de 12 pontos), máximo
  .50; com lum > .55 as palavras ganham `text-shadow` escuro.
- **Barra (README #69):** duas ilhas, cada uma com o seu vidro num pseudo-elemento (`::before`) atrás do texto:
  `backdrop-filter: url(#lente) blur(8px) saturate(1.6) brightness(1.04) contrast(1.04)`, × 1,6 no desktop (≥ 900 px).
  A **lente** é um `feDisplacementMap` com um mapa gerado em canvas na forma da ilha (cápsula/círculo), refeito quando a
  ilha muda de tamanho. O **escuro** é uma variável `--tint` registada com `@property` (`<color>`, transição 0,45 s), posta
  por JavaScript em cada ilha a partir do brilho por trás (grelhas 24 × 24 lidas uma vez por imagem; `elementsFromPoint`
  em 15 pontos; no máximo de 80 em 80 ms durante o scroll). Sem JavaScript: um escuro médio fixo.
- **Menu:** `<dialog>`; o vidro é **um círculo** (`border-radius: 50%`, raio = da ilha ao canto mais longe) com o
  `backdrop-filter` **no próprio círculo**, que cresce por `transform: scale()` de r/R a 1 em 0,9 s a partir do centro da
  ponta direita da ilha do menu. **Nunca `clip-path` animado num elemento com `backdrop-filter`** (flicks no Chrome
  Android, gravados a 28/10) e nunca o desfoque num filho de um elemento com `clip-path` (*Backdrop Root*, 27/10). O vidro
  fica `visibility: visible` dois frames antes de crescer e `hidden` no fim de fechar. Sem lente no menu (p95 22 ms no
  Xiaomi). Foco preso e devolvido; Esc; botão ✕ *Close*; reduced motion: fade.

---

## 6. Questions (README #53)

- Fundo: a pedra da marca feita estúdio (imagem pré-preparada); o papel sobe na passagem (`transform`).
- Âncora sempre visível; oito perguntas; **uma resposta aberta de cada vez**: `<button aria-expanded>` +
  `grid-template-rows: 0fr → 1fr` e fade (ou `<details>` nativos com um pouco de JS a fechar os outros — sem JS
  ficam todos abríveis). Capítulos ligados ao Work (telemóvel: uma linha com barras verticais).

---

## 7. Contact (README #54, #55)

- A luz baixa por opacidade; **o vídeo da entrada** volta muito escuro (mesmo ficheiro, já em cache; `play()` só
  com a secção à vista, `pause()` fora; poster em reduced motion/Save-Data). A pergunta presa um instante
  (`sticky` curto). A linha usa a hora de chegada guardada no arranque e a hora atual.
- **Talk to us** → Instagram (perfil até o `ig.me` estar testado); *@chapterone.studio.pt* em texto selecionável.

---

## Componentes do M1 reutilizáveis (código existente)

- `src/components/picture.tsx` — `<picture>` AVIF/JPEG com `srcset`.
- `src/components/client/colour-reveal.tsx` — segurar/botão para a cor (testado: rato, toque, teclado).
- `src/components/client/develop.tsx` — revelação única ao entrar (IntersectionObserver) — opcional.
- `src/components/client/desk-depth.tsx` — padrão de profundidade pelo ponteiro (rAF só em movimento)
  — reutilizável para as lâminas da entrada.
- `src/components/drawing.tsx` — base para os esboços SVG das peças.
