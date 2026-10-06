# CHAPTER ONE — Scroll Journey Audit

## Phase 01 — Experience compression · audit only

**Auditoria realizada a 4 de Outubro de 2026.** Mede quanto scroll o CHAPTER ONE exige para ser
compreendido e navegado, e onde esse scroll produz pouca consequência visual. É um diagnóstico:
**nenhuma alteração funcional foi feita, e nada do que aqui se propõe foi implementado.**

Este documento é independente de `AUDIT-2026-10-SCROLL-PERFORMANCE.md`. A auditoria de performance mede o
custo de cada frame; esta mede a distância que a mão percorre. As duas análises não se misturam — a
secção 9 regista apenas onde se tocam.

| Marca | Significado |
|---|---|
| **MEDIDO** | Obtido directamente nesta auditoria. |
| **REGISTO** | Citado de um registo já existente no projecto (indica-se qual). |
| **MODELO** | Derivado de medições por aritmética, com os pressupostos escritos. |
| **ESTIMATIVA** | Ordem de grandeza para uma proposta; não é um alvo nem um número a implementar. |
| **UNKNOWN** | Não foi possível medir; explica-se porquê. |

### Estado do repositório

```
master        = 133f080
origin/master = 133f080
v2            = 133f080
```

Medido sobre `next build` + `next start` deste commit (o CSS tem o mesmo hash do de produção,
`2b7h_r_m_11cz.css`). Os scripts e os dados estão **fora do repo**, em `D:\STUDIO-tools\journey-audit`
(`scan.mjs`, `analyze.mjs`, `driven.mjs`, `gestures.mjs`; `scan-*.json`, `journey.json`,
`gestures.json`).

---

## 1. A pergunta

> *Quantos gestos de scroll são realmente necessários para uma pessoa compreender e navegar pelo
> CHAPTER ONE?*

A sensação a testar: a Opening exige demasiado scroll, são precisos muitos pequenos movimentos para os
estados avançarem, demora demasiado a chegar a WORK, e depois de WORK também pode haver scroll a mais.

**Resposta curta, medida:**

- Num telemóvel o site mede **48,8–49,1 viewports**; num desktop **34,5–34,6**. O telemóvel paga
  **1,41× mais** scroll relativo, e isso é uma decisão explícita do código (o runway `coarse` é 1,5× o
  `fine`), não um acidente de layout.
- Até ao título do Work vão **22,4–22,5 viewports** num telemóvel (15,0 no desktop). Com um swipe
  normal, medido em Android, isso são **19–34 gestos**.
- A primeira frase do site — *Every unforgettable moment deserves an experience.* — só aparece aos
  **10,0 viewports** num telemóvel (6,7 no desktop): **8–15 swipes normais**.
- A sensação de *"intervalos em que nada acontece"* **não se confirma literalmente** na Opening: o
  scroll estritamente morto até ao Work é só 0,3–0,5 viewports. O que se confirma é outra coisa: longos
  trechos em que **acontece muito pouco por gesto** — 6,2–6,4 viewports da Opening num telemóvel em que
  menos de 0,25% do ecrã muda a cada passo.

---

## 2. Metodologia

### 2.1 Varrimento da jornada — MEDIDO

Chrome 154 dirigido por CDP, uma instância por lote, viewport aplicado na própria sessão com guarda de
largura, altura e `pointer` (lição registada no `SESSION-HANDOFF.md`). Nove configurações:

| Viewport | Ponteiro | Emulação |
|---|---|---|
| 320×640, 360×780, 375×667, 375×812, 390×844 | `coarse` | mobile + touch |
| 768×889 | `coarse` | touch (tablet) |
| 768×889, 1440×889, 1920×889 | `fine` | desktop |

Em cada uma, o documento inteiro foi percorrido em passos de **1/8 de viewport** (12,5vh), e em cada
passo, depois de o ecrã estabilizar, registou-se:

- a **posição do próprio driver** — `--junction` + `--junction-at`, nunca `scrollY` (o `scrollY` corre à
  frente da mola de input; lição registada no handoff);
- o **texto visível** (elementos com opacidade efectiva ≥ 0,35, dentro do viewport), com tamanho e
  posição;
- **quanto do ecrã mudou** desde o passo anterior: percentagem de píxeis cuja luminância mudou mais de
  4/255, e a variação média de luminância do frame inteiro (para apanhar derivas lentas de luz que não
  mexem em nenhum píxel "de repente");
- **todos os valores que o driver escreveu inline** (em `:root`, `.v2-stack`, `.v2-thesis`,
  `.publication`, `#method`, as palavras da fila), para saber se algum valor de coreografia se moveu.

Duas precauções:

- **O vídeo do hero foi congelado no browser de medição** (`HTMLMediaElement.prototype.play`
  neutralizado em runtime, nada no projecto). Sem isso o driver volta a pôr a filmagem a tocar e a
  medida de "quanto muda o ecrã" fica contaminada pelo movimento da própria filmagem.
- **As batidas tocadas por relógio** (C28, C29, C30: 0,6 s) foram deixadas assentar: cada passo espera
  até dois screenshots consecutivos serem iguais.

### 2.2 Definições usadas nas tabelas

| Termo | Definição |
|---|---|
| **viewport (vp)** | Distância ÷ altura do viewport. 1 vp = 100vh. |
| **quieto** | Passo em que menos de 0,25% do ecrã mudou **e** a deriva média de luminância foi < 0,2. |
| **morto** | Passo quieto **e** em que nenhum valor escrito pelo driver se moveu (excluindo os que só publicam a posição). |
| **consequência por viewport** | Soma da variação média de luminância dos passos de um segmento ÷ viewports do segmento. Compara quanto "muda a imagem" por unidade de scroll. |
| **evento de texto** | Passo em que o conjunto de texto visível (≥ 12px, excluindo o rail) muda. |

### 2.3 Gestos — MEDIDO em Android, MODELO no desktop

Os gestos tácteis foram medidos, não supostos: toques reais ao nível do sistema (`adb shell input swipe`)
no emulador Android 14 / Chrome 113, três repetições por gesto, ecrã 1080×2400 a DPR 2,75 (viewport
393×744 com a barra de URL visível). Mede-se o deslocamento total até repouso, com a inércia do Android.

| Gesto | Percurso do dedo | Duração | Scroll resultante | Viewports | Repouso após |
|---|---|---|---|---|---|
| Micro-movimento | 69px (8% do ecrã) | 250–600 ms | 61–78px | 0,08–0,10 | ~1,0–1,5 s |
| Pequeno movimento | 131px (15%) | 250–600 ms | 135–181px | 0,18–0,24 | ~0,9–1,1 s |
| Swipe médio, lento | 305px (35%) | 700 ms | 342px | 0,46 | ~1,4 s |
| Swipe médio, normal | 305px (35%) | 300 ms | 496px | 0,67 | ~1,3 s |
| Swipe médio, rápido | 305px (35%) | 150 ms | 955px | 1,28 | ~1,5 s |
| Swipe longo, lento | 524px (60%) | 900 ms | 589px | 0,79 | ~1,7 s |
| Swipe longo, normal | 524px (60%) | 350 ms | 903px | 1,21 | ~1,5 s |
| Flick longo | 524px (60%) | 150 ms | 2212px | 2,97 | ~2,1 s |
| Flick forte | 524px (60%) | 90 ms | 4591px | 6,17 | ~2,7 s |

As contas de gestos deste documento usam três referências:

- **pequeno movimento** = 0,18–0,24 vp;
- **swipe normal** = 0,67–1,21 vp (médio a longo, velocidade normal);
- **flick** = 2,97 vp.

**No desktop os gestos não foram medidos.** Usa-se um **MODELO**: um entalhe de roda = 100px (o valor por
omissão do Chrome em Windows), ou seja 0,11 vp a 889px de altura. Trackpad: **UNKNOWN**.

### 2.4 O que não foi medido

- **Pessoas reais.** Os gestos são sintetizados: movimento linear e largada abrupta. A distribuição real
  de gestos de um visitante é **UNKNOWN**.
- **iOS Safari** e a sua inércia: não testado.
- **Telemóvel físico**: não testado.
- **Tempo de leitura necessário** por frase: não medido. A classificação de um trecho como espaço de
  leitura é um juízo sobre a função, não uma medição.
- **Resolução**: 12,5vh por passo. Uma transformação mais curta do que isso pode cair entre dois passos.

---

## 3. Como o comprimento está construído — REGISTO

Três factos do código explicam quase tudo o que se mede a seguir (`src/motion/timing.ts`, secção
*DISTANCE · how far the hand travels*):

1. **O comprimento é cotado em `vh`, por runway, com um par `fine` / `coarse`:**

   | Runway | `fine` | `coarse` |
   |---|---|---|
   | `shot` (Chapter I → II) | 1672vh | 2508vh |
   | `act` (Chapter III) | 660vh | 990vh |
   | `method` | 484,5vh | 726,75vh |
   | `about` | 175vh | 262vh |
   | `asked` | 200vh | 300vh |
   | `askedLead` | 150vh | 180vh |

   A razão escrita no código: *"`fine` is a mouse wheel, `coarse` is a thumb — a flick carries far more
   momentum than a notch, so touch gets a longer runway for the identical choreography."*

2. **`shot` é 3,75× o que já foi** (446vh → 1672vh), deliberadamente — *"the approved B14 pacing arriving
   in the film"*. O mesmo comentário diz: ***"This is the number to dial if the site is too long.
   Halving all three halves the site and keeps every proportion."*** O projecto já tem, portanto, um
   dial de comprimento que não retima nada.

3. **A junção 05 → 06 tem uma tabela de preços por fase** (`memories.pricing`), com três *holds* a 2,9 /
   2,9 / 3,2 e a ponte a 3,0, aprovada a 1 de Setembro de 2026 — quando as três ocasiões ainda eram
   **scrubbed**. Desde C28 (1 de Outubro) as ocasiões são **tocadas por relógio em 0,6 s**, e o registo
   diz expressamente que *"the pricing above is untouched, so the distance of the zone is exactly what
   it was"*. Os holds foram cotados para uma frase que se lia à medida que a mão avançava; hoje a frase
   desenha-se sozinha e a mão continua a pagar a mesma distância.

---

## 4. Medições — totais

### 4.1 Comprimento total e distância até ao Work — MEDIDO

| Viewport | Total (px) | Total (vp) | Até ao título do Work (px) | Até ao título do Work (vp) | Do título do Work ao fim (vp) |
|---|---|---|---|---|---|
| 320×640 coarse | 31 413 | 49,1 | 14 320 | 22,4 | 26,7 |
| 360×780 coarse | 38 148 | 48,9 | 17 444 | 22,4 | 26,5 |
| 375×667 coarse | 32 659 | 49,0 | 14 940 | 22,4 | 26,6 |
| 375×812 coarse | 39 636 | 48,8 | 18 156 | 22,4 | 26,5 |
| 390×844 coarse | 41 176 | 48,8 | 18 974 | 22,5 | 26,3 |
| 768×889 coarse | 44 541 | 50,1 | 19 980 | 22,5 | 27,6 |
| 768×889 fine | 30 658 | 34,5 | 13 320 | 15,0 | 19,5 |
| 1440×889 fine | 30 739 | 34,6 | 13 320 | 15,0 | 19,6 |
| 1920×889 fine | 30 765 | 34,6 | 13 320 | 15,0 | 19,6 |

*"Título do Work"* = o primeiro passo em que a categoria (*Wedding experiences*) está visível. O estado
08 (o rail acende, o Work fica composto) começa mais tarde: aos 25,0 vp num telemóvel e aos 16,6 no
desktop.

### 4.2 Onde aparece cada momento, em viewports desde o topo — MEDIDO

| Viewport | II Philosophy | Tese | A wedding. | An artist. | A memory. | Título do Work | About | Method | Questions | Contact |
|---|---|---|---|---|---|---|---|---|---|---|
| 320×640 c | 7,1 | 10,1 | 12,8 | 14,6 | 15,6 | 22,4 | 28,8 | 38,6 | 45,5 | 48,1 |
| 360×780 c | 7,0 | 10,1 | 12,8 | 14,6 | 15,7 | 22,4 | 28,8 | 38,7 | 45,5 | 48,0 |
| 375×667 c | 7,1 | 10,1 | 12,8 | 14,6 | 15,7 | 22,4 | 28,7 | 38,7 | 45,5 | 48,0 |
| 375×812 c | 7,0 | 10,0 | 12,8 | 14,6 | 15,7 | 22,4 | 28,8 | 38,7 | 45,5 | 47,9 |
| 390×844 c | 7,0 | 10,0 | 12,8 | 14,6 | 15,7 | 22,5 | 28,8 | 38,7 | 45,5 | 47,9 |
| 768×889 c | 7,1 | 10,1 | 12,7 | 14,6 | 15,7 | 22,5 | 28,7 | 38,8 | 45,4 | 49,2 |
| 768×889 f | 4,7 | 6,7 | 8,5 | 9,7 | 10,5 | 15,0 | 19,2 | 26,3 | 30,8 | 33,6 |
| 1440×889 f | 4,7 | 6,7 | 8,5 | 9,7 | 10,5 | 15,0 | 19,4 | 26,5 | 31,0 | 33,6 |
| 1920×889 f | 4,7 | 6,7 | 8,5 | 9,7 | 10,5 | 15,0 | 19,4 | 26,5 | 31,0 | 33,7 |

### 4.3 Em gestos

**Telemóvel (390×844) — MODELO sobre gestos MEDIDOS:**

| Até… | Viewports | Pequenos movimentos | Swipes normais | Flicks |
|---|---|---|---|---|
| a primeira frase (tese) | 10,0 | 42–56 | 8–15 | 3–4 |
| *A wedding.* | 12,8 | 53–71 | 11–19 | 4–5 |
| o título do Work | 22,5 | 94–125 | 19–34 | 8 |
| About | 28,8 | 120–160 | 24–43 | 10 |
| Method | 38,7 | 161–215 | 32–58 | 13 |
| Questions | 45,5 | 190–253 | 38–68 | 15–16 |
| Contact (fim) | 48,8 | 203–271 | 40–73 | 16–17 |

Cada swipe normal demora ~1,3–1,5 s até repouso (MEDIDO). Chegar ao título do Work só com swipes
normais são, portanto, **da ordem de 25–50 s de gestos contínuos**, sem contar qualquer leitura
(MODELO).

**Desktop (1440×889) — MODELO, entalhe de roda = 100px, não medido:**

| Até… | px | Entalhes de roda |
|---|---|---|
| a primeira frase (tese) | 5 956 | ~60 |
| o título do Work | 13 320 | ~133 |
| Contact (fim) | 30 739 | ~307 |

---

## 5. O mapa completo da jornada

Referência de telemóvel: **390×844 coarse**. Referência de desktop: **1440×889 fine**. Os segmentos são
intervalos da posição do driver (`p` = junção + fracção); as subdivisões de 03 → 06 são as posições de
disparo congeladas em C28 / C29 / C30.

### 5.1 Tabela pedida — telemóvel (390×844)

| Segmento | px | vh | viewports | Tipo | Valor narrativo | Fricção | Candidato |
|---|---|---|---|---|---|---|---|
| **01 → 02** · Chapter One → Chapter II | 3 265 | 387 | 3,87 | A, com fricção D | Alto: o sobrevivente viaja e muda de face (C31-A) | Alta — uma só transformação em 3–6 swipes | MAYBE |
| **02 → 03** · Chapter II → II Philosophy | 3 270 | 387 | 3,87 | D | Baixo por gesto: marcador, anoitecer, a palavra desfoca, o numeral entra — tudo em tipo de 12–14px | **Muito alta** — a menor consequência visual do filme | **STRONG** |
| **03 → 04a** · o par expande e solta | 1 687 | 200 | 2,00 | A | Médio | Média | MAYBE |
| **03 → 04b** · vazio, depois a tese chega | 1 119 | 133 | 1,33 | E + B | Alto: a primeira frase | Média — a tese fica parada ~1,0 vp aqui | MAYBE |
| **04 → 05a** · tese em leitura | 995 | 118 | 1,18 | B | Alto (leitura) | Média — soma-se ao 1,0 vp anterior: 2,2 vp parados para duas linhas | MAYBE |
| **04 → 05b** · frame limpo | 396 | 47 | 0,47 | E | Estrutural (C29) | Baixa | NO |
| **04 → 05c** · *A wedding.* chega | 602 | 71 | 0,71 | B cotado como scrub | Alto | Alta | **STRONG** ⚠ C28 |
| **05 → 06a** · *A wedding.* parada | 920 | 109 | 1,09 | C na prática | — a frase já está escrita | Alta — 100% quieto | **STRONG** ⚠ C28 |
| **05 → 06b** · *An artist.* | 931 | 110 | 1,10 | B cotado como scrub | Alto | Alta — 89% quieto | **STRONG** ⚠ C28 |
| **05 → 06c** · *A memory.* | 1 566 | 186 | 1,86 | B cotado como scrub | Alto: a última frase tipográfica | Alta — 67% quieto | **STRONG** ⚠ C28 |
| **05 → 06d** · sobrevivente desfaz-se · fotografia sozinha | 1 000 | 118 | 1,18 | A | **Muito alto** — a ponte (C12/C13) | Baixa | NO |
| **06 → 07** · fotografia · a composição abre | 2 669 | 316 | 3,16 | A | **Muito alto** — câmara, pan, exposição | Baixa — 4% quieto | NO |
| **07 → 08** · rail · o Work compõe-se | 2 651 | 314 | 3,14 | A | Muito alto | Baixa a média | MAYBE |
| **08 → 09** · Work | 1 815 | 215 | 2,15 | C / B | O scroll não controla o carrossel (C13/C14) | Média — scroll para sair | MAYBE |
| **09 → 10** · Work → About (About inteiro) | 7 342 | 870 | **8,70** | A (cruzamento) + B (leitura) + C (cauda) | Alto, mas é o maior bloco do site | **Alta** — 1,26 vp mortos no fim | **STRONG** (cauda) · MAYBE (resto) |
| **10 → 11** · About → Method | 2 447 | 290 | 2,90 | E / A | Alto — passagem de tempo na mesma sala (C17–C19) | Baixa | NO |
| **11 → 12** · Method | 2 751 | 326 | 3,26 | B | Leitura — 6 eventos de texto | Média | MAYBE |
| **12 → 13** · Method → Questions | 2 700 | 320 | 3,20 | B / E | Leitura — 10 eventos de texto | Média | MAYBE |
| **13 → 14** · Questions → Contact | 2 151 | 255 | 2,55 | misto | Congelado (C25, C26, C27) | Baixa no telemóvel | NO |
| **14** · Contact | 899 | 107 | 1,07 | B | Fecho | Baixa | NO |

⚠ C28 = a zona 05 está **congelada**, incluindo as suas distâncias. *STRONG* significa que a medição a
aponta como candidata; **não** significa que deva ser alterada. Qualquer mudança aí é do design owner.

### 5.2 A mesma jornada no desktop (1440×889)

| Segmento | px | vh | viewports | Entalhes (modelo) |
|---|---|---|---|---|
| 01 → 02 | 2 293 | 258 | 2,58 | ~23 |
| 02 → 03 | 2 294 | 258 | 2,58 | ~23 |
| 03 → 04a | 1 187 | 134 | 1,34 | ~12 |
| 03 → 04b | 785 | 88 | 0,88 | ~8 |
| 04 → 05a | 699 | 79 | 0,79 | ~7 |
| 04 → 05b | 278 | 31 | 0,31 | ~3 |
| 04 → 05c | 433 | 49 | 0,49 | ~4 |
| 05 → 06a | 635 | 71 | 0,71 | ~6 |
| 05 → 06b | 655 | 74 | 0,74 | ~7 |
| 05 → 06c | 1 098 | 124 | 1,24 | ~11 |
| 05 → 06d | 700 | 79 | 0,79 | ~7 |
| 06 → 07 | 1 878 | 211 | 2,11 | ~19 |
| 07 → 08 | 1 858 | 209 | 2,09 | ~19 |
| 08 → 09 | 1 356 | 153 | 1,53 | ~14 |
| 09 → 10 | 5 473 | 616 | 6,16 | ~55 |
| 10 → 11 | 1 838 | 207 | 2,07 | ~18 |
| 11 → 12 | 1 932 | 217 | 2,17 | ~19 |
| 12 → 13 | 1 933 | 217 | 2,17 | ~19 |
| 13 → 14 | 2 530 | 285 | 2,85 | ~25 |
| 14 | 884 | 99 | 0,99 | ~9 |

### 5.3 Gestos por segmento — telemóvel (MODELO sobre gestos MEDIDOS)

| Segmento | Viewports | Pequenos movimentos | Swipes normais | Flicks |
|---|---|---|---|---|
| 01 → 02 | 3,87 | 16–22 | 3–6 | 1–2 |
| 02 → 03 | 3,87 | 16–22 | 3–6 | 1–2 |
| 03 → 04 (inteira) | 3,33 | 14–19 | 3–5 | 1–2 |
| 04 → 05 (inteira) | 2,36 | 10–13 | 2–4 | 1 |
| 05 → 06 (inteira) | 5,23 | 22–29 | 4–8 | 2 |
| 06 → 07 | 3,16 | 13–18 | 3–5 | 1–2 |
| 07 → 08 | 3,14 | 13–17 | 3–5 | 1–2 |
| 08 → 09 | 2,15 | 9–12 | 2–3 | 1 |
| 09 → 10 | 8,70 | 36–48 | 7–13 | 3 |
| 10 → 11 | 2,90 | 12–16 | 2–4 | 1 |
| 11 → 12 | 3,26 | 14–18 | 3–5 | 1–2 |
| 12 → 13 | 3,20 | 13–18 | 3–5 | 1–2 |
| 13 → 14 | 2,55 | 11–14 | 2–4 | 1 |
| 14 | 1,07 | 4–6 | 1–2 | 1 |

**Nenhuma junção do site se atravessa com um swipe normal.** A mais curta (08 → 09) pede 2–3. Um flick
(2,97 vp) não chega a atravessar uma junção da Opening (3,16–5,23 vp), com excepção de 04 → 05.

### 5.4 Leitura, movimento espacial e silêncio, por segmento

| Segmento | Texto envolvido | Leitura | Movimento espacial | Silêncio |
|---|---|---|---|---|
| 01 → 02 | `Chapter` · `One` · `II` | Não — é um título | Sim: `Chapter` viaja e encolhe de 43px para 13px | Não |
| 02 → 03 | `Chapter` · `II` · `Philosophy` (12–14px) | Não | Mínimo | Não é silêncio — é pouca coisa |
| 03 → 04a | `II` · `Philosophy` | Não | Sim: o par expande e solta | Não |
| 03 → 04b | a tese (2 linhas, 25px) | Sim | Não | Sim, antes da tese |
| 04 → 05a | a tese | Sim | Não | Não |
| 04 → 05b | — | — | Não | **Sim — deliberado** (C29) |
| 04 → 05c · 05 → 06a–c | `A wedding.` · `An artist.` · `A memory.` (31px) | Sim, duas palavras cada | A pilha recua | Não |
| 05 → 06d | — | — | Sim: a fotografia sobe | **Sim — deliberado** (a ponte) |
| 06 → 07 | — | — | **Sim: câmara, pan, exposição** | Sim — só imagem |
| 07 → 08 | eyebrow, fila, categoria, identificação | Curta | Sim: abertura, rail a desenhar | Não |
| 08 → 09 | categoria e fila (relógio) | Curta | Pouco | Não |
| 09 → 10 | claim (2 linhas, 39px), parágrafo (15px), `Built exclusively / for you.` | **Sim — a maior leitura do site** | Sim no cruzamento | Sim na cauda |
| 10 → 11 | sai About, entra a sala do Method | Não | Sim | Sim |
| 11 → 12 · 12 → 13 | as linhas do Method (14–30px) | Sim | Câmara (`--mdrift`) | Não |
| 13 → 14 | as seis perguntas, uma resposta | Sim | Sim na saída | Não |
| 14 | o fecho do Contact | Sim | Não | Não |

---

## 6. Opening → Work, em profundidade

### 6.1 Quanto espaço, e de que tipo — MEDIDO

No telemóvel (390×844), do topo ao estado 08 (Work composto):

| | Viewports | Parte |
|---|---|---|
| **Total** | **25,0** | 100% |
| Prólogo tipográfico (01 → 05, até *A memory.* desaparecer) | 17,5 | 70% |
| Fotografia e reframe (05 → 06d, 06 → 07, 07 → 08) | 7,5 | 30% |
| Passos **quietos** (menos de 0,25% do ecrã muda) | 6,4 | 26% |
| Passos **mortos** (quietos e nenhum valor do driver se move) | 0,5 | 2% |

No desktop (1440×889): total 16,6 vp; quietos 2,7 vp (16%); mortos 0,0 vp.

**A distinção é o principal achado desta secção.** A Opening quase não tem scroll morto: há sempre
alguma coisa a mover-se (a luz deriva, a exposição muda, um valor avança). O que tem é **scroll de baixa
consequência**: trechos em que o que se move é pequeno de mais para ser sentido como resposta ao gesto.

### 6.2 Consequência visual por viewport de scroll — MEDIDO

Variação de luminância percorrida por viewport de scroll (quanto maior, mais a imagem responde à mão):

| Segmento | 390×844 | 1440×889 |
|---|---|---|
| 01 → 02 | 6,1 | 8,4 |
| 02 → 03 | **3,0** | **3,8** |
| 03 → 04a | 6,0 | 7,6 |
| 03 → 04b | 2,9 | 5,5 |
| 04 → 05a · tese parada | 0,9 | 1,7 |
| 04 → 05c · *A wedding.* chega | 0,7 | 0,7 |
| 05 → 06a · *A wedding.* parada | **0,4** | 0,9 |
| 05 → 06b · *An artist.* | 1,3 | 1,7 |
| 05 → 06c · *A memory.* | 3,3 | 6,3 |
| 05 → 06d · fotografia sozinha | 17,1 | 50,7 |
| 06 → 07 · a composição abre | 22,2 | 64,8 |
| 07 → 08 · o Work compõe-se | 41,3 | 83,5 |

Duas leituras:

- **A resposta ao gesto está concentrada no fim.** Os primeiros 17,5 vp do telemóvel (70% do caminho até
  ao Work) vivem entre 0,4 e 6,1; os últimos 7,5 vp entre 17 e 41. O visitante faz a maior parte dos
  gestos na parte que menos lhe responde.
- **No telemóvel, o reframe de Veneza responde menos do que no desktop** (17–41 contra 51–84) — o
  recorte em retrato mostra menos da fotografia a mover-se, e o runway é 1,5× mais longo. A zona de maior
  valor do filme é a que mais perde no telemóvel.

### 6.3 Quantos estados cabem num gesto — MODELO

Num telemóvel, um swipe normal (0,67–1,21 vp) avança:

| Junção | Comprimento (vp) | Avanço por swipe normal |
|---|---|---|
| 01 → 02 | 3,87 | 17–31% da junção |
| 02 → 03 | 3,87 | 17–31% |
| 03 → 04 | 3,33 | 20–36% |
| 04 → 05 | 2,36 | 28–51% |
| 05 → 06 | 5,23 | 13–23% |
| 06 → 07 | 3,16 | 21–38% |
| 07 → 08 | 3,14 | 21–38% |

Nenhum estado coexiste com outro no mesmo gesto normal: cada gesto fica **dentro** de uma junção. As
únicas excepções são as três ocasiões, e só porque o relógio as desenha — não porque o gesto as alcance.

### 6.4 Onde a transformação termina antes de a próxima começar — MEDIDO

Intervalos em que nenhum valor escrito pelo driver se move (390×844). Note-se que rampas declaradas em
CSS a partir de `--junction-at` não aparecem aqui — por isso estes intervalos são um **limite inferior**
do que está parado, e são cruzados com a medida de píxeis:

| Onde | Intervalo de `p` | Distância | O que está no ecrã |
|---|---|---|---|
| 01 → 02, fim | 1,88 → 1,97 | 318px | `Chapter II` já pousado |
| 02 → 03 | 2,14 → 2,30 | 530px | `Chapter II`, à espera do anoitecer |
| 02 → 03 | 2,56 → 2,69 | 424px | `II`, à espera de a palavra desfocar |
| 04 → 05 | 4,31 → 4,47 | 318px | a tese, parada |
| 09 → 10 | 9,35 → 9,41 | 424px | o claim do About |
| 09 → 10 | 9,61 → 9,68 | 530px | About, entre o parágrafo e a segunda afirmação |
| 09 → 10, fim | 9,85 → 9,99 | **1 060px** | About completo, nada se move |
| 13 → 14 | 13,31 → 13,46 | 318px | as perguntas |

### 6.5 A zona 05: holds cotados para scrub, frases tocadas por relógio

Este é o caso mais claro de **scroll mecânico criado por uma mudança de mecanismo**, e resulta de cruzar
um REGISTO com uma medição:

- **REGISTO** (`timing.ts`, `memories.pricing`; `implementation-reconciliation.md` C28): os holds das
  três ocasiões estão cotados a 2,9 / 2,9 / 3,2 — três vezes o custo de uma fase normal — e foram
  aprovados quando as frases eram scrubbed. Desde C28 cada frase desenha-se num relógio de 0,6 s, e a
  distância ficou exactamente a que era.
- **MEDIDO:** as três ocasiões ocupam **4,76 vp** num telemóvel (0,71 + 1,09 + 1,10 + 1,86) e **3,18 vp**
  no desktop. Nesse espaço, 67–100% dos passos são quietos e a consequência por viewport é a mais baixa
  do filme (0,4–3,3).

Ou seja: a mão percorre 4–7 swipes normais por três frases de duas palavras, cada uma das quais já está
escrita 0,6 s depois de ser disparada.

**Há uma tensão real aqui, e é o motivo por que isto não é uma compressão trivial.** O REGISTO de C28
mostra que as frases, encadeadas, precisam de tempo: *"0.9s left `A memory.` never fully drawn at
~1500px/s"*, e a 6000px/s só *A wedding.* é vista, e é limpa. Um flick medido percorre 2 212px em ~2 s —
mais de 1 000px/s. **O gesto que tornaria a Opening suportável (o flick) é exactamente o que salta o seu
conteúdo.** Encurtar a zona sem mais nada aumenta esse desencontro em vez de o resolver.

### 6.6 Segmentos essenciais e candidatos

| Narrativamente essenciais — não tocar | Candidatos a compressão |
|---|---|
| 05 → 06d — a fotografia sozinha (a ponte) | 02 → 03 — a menor consequência do filme |
| 06 → 07 — a composição abre | Zona 05 — os holds das três ocasiões ⚠ C28 |
| 07 → 08 — o rail e o Work | 01 → 02 — uma transformação em 3–6 swipes ⚠ C31-A |
| 04 → 05b — o frame limpo (C29) | A tese parada: 2,2 vp para duas linhas ⚠ C29 / C30 |
| A troca de face de `Chapter` (C31-A) | 03 → 04a — a expansão do par (2,0 vp) |

---

## 7. Mobile vs desktop

### 7.1 O telemóvel paga mais scroll relativo — MEDIDO

| | Telemóvel (coarse) | Desktop (fine) | Razão |
|---|---|---|---|
| Total | 48,8–49,1 vp | 34,5–34,6 vp | 1,41× |
| Até ao título do Work | 22,4–22,5 vp | 15,0 vp | 1,50× |
| Até à primeira frase | 10,0–10,1 vp | 6,7 vp | 1,50× |
| Do título do Work ao fim | 26,3–26,7 vp | 19,5–19,6 vp | 1,35× |

- **Todos os telemóveis pagam o mesmo em viewports** (48,8–49,1), do 320×640 ao 390×844: o comprimento é
  função de `vh`, não da largura. Em píxeis varia de 31 413 a 41 176.
- **A diferença é toda do ponteiro.** O 768×889 mede 34,5 vp em `fine` e 50,1 vp em `coarse`. Um tablet
  táctil paga o runway de telemóvel.
- **A razão 1,5× é a do código**, não uma consequência de layout: `shot`, `act`, `method`, `about` e
  `asked` têm todos o par `coarse` = 1,5 × `fine` (`askedLead` 1,2×).

### 7.2 O argumento do multiplicador, contra o que foi medido

O código justifica o 1,5× com *"a flick carries far more momentum than a notch"*. Medido:

| Gesto | Viewports por gesto |
|---|---|
| Entalhe de roda (modelo, 100px a 889px) | 0,11 |
| Pequeno movimento táctil | 0,18–0,24 |
| Swipe normal táctil | 0,67–1,21 |
| Flick táctil | 2,97 |

O argumento é **verdadeiro por gesto**: um swipe normal vale 6–11 entalhes. O que a medição acrescenta é
o outro lado: o flick, que é o gesto que justifica o runway mais longo, **ultrapassa os relógios de
0,6 s** da zona 05 (REGISTO C28). O runway longo foi desenhado para o gesto que não consegue ver o
conteúdo; para o gesto que consegue (o swipe normal), é 1,5× mais trabalho.

Se um visitante real usa mais swipes ou mais flicks é **UNKNOWN**.

### 7.3 Os mesmos ramps, uma experiência proporcionalmente diferente — MEDIDO

| | Telemóvel | Desktop |
|---|---|---|
| Scroll quieto, Opening → Work | 6,2–6,4 vp | 2,7–4,0 vp |
| Scroll quieto, Work → fim | 2,6–6,4 vp | 4,7–5,9 vp |
| Consequência por vp, reframe de Veneza (06 → 07) | 22,2–29,8 | 49,5–70,9 |
| Consequência por vp, Work compõe-se (07 → 08) | 41,2–45,9 | 68,7–85,1 |

- **Na Opening, o telemóvel tem cerca do dobro do scroll quieto do desktop.**
- **Depois do Work a relação inverte-se em parte**: no desktop o Method e o Contact são mais quietos
  (ver 7.4), porque as mesmas linhas de texto ocupam uma fracção menor de um ecrã maior.

### 7.4 Segmentos que mudam de carácter entre os dois

| Segmento | Telemóvel | Desktop | Leitura |
|---|---|---|---|
| Zona 05 (ocasiões) | 4,76 vp, 67–100% quieto | 3,18 vp, 50–83% quieto | Longa nos dois; mais longa no telemóvel |
| 02 → 03 | 3,87 vp | 2,58 vp | Baixa consequência nos dois |
| 06 → 08 (Veneza → Work) | 6,30 vp, resposta 22–41 | 4,20 vp, resposta 65–84 | **Funciona no desktop; no telemóvel é longa para o que mostra** |
| 11 → 13 (Method) | 6,46 vp, 0–4% quieto (390) | 4,34 vp, 50–59% quieto | No telemóvel cada linha enche o ecrã; no desktop há muito scroll entre linhas |
| 13 → 14 | 2,55–2,86 vp, ~0,1 vp morto | 2,85 vp, 1,0 vp morto | Cauda morta só no desktop |
| 13 → 14 em tablet coarse | 3,82 vp, 1,8 vp morto | — | O pior caso desta junção |
| 14 (Contact) | 1,07 vp, 0 morto | 0,99 vp, 0,9 vp morto | Cauda morta só no desktop |

No 320×640, o Method (11 → 13) tem 38–58% de passos quietos e runs de 1,3–1,5 vp; nos telemóveis mais
altos quase nenhum. O ecrã mais baixo é o que mais sofre nessa secção.

**Desktop e telemóvel não pedem a mesma solução.** O desktop tem caudas mortas localizadas no fim
(13 → 14, Contact) e um Method espaçado; o telemóvel tem um problema de distribuição na Opening e o
multiplicador 1,5× por cima de tudo.

---

## 8. Work → Contact

**Respeita-se tudo o que já foi validado.** C25, C26 / S1, C27 (Questions B, D-gate, altura de repouso,
histerese), o grid de leitura mobile, o grupo de fecho do Method e o rail 768–900 **não são tratados
como defeitos**. Onde a medição diz que uma zona é longa, isso é uma observação.

| Trecho | Telemóvel (vp) | Desktop (vp) | O que acontece | Tipo | Observação |
|---|---|---|---|---|---|
| **Work** (título visível → sai) | ~5,1 | ~3,7 | O carrossel roda por relógio (C13/C14); o scroll compõe e depois abre a abertura | A depois C | O scroll não controla o que se vê; serve para sair. O handoff já regista *Venice → Work's static frame* como adiado para a fase estética |
| **Work → About** (cruzamento) | ~1,7 | ~1,2 | Sobreposição de Veneza para o estúdio | A | Consequência alta (30–45% do ecrã por passo) |
| **About** (claim → fim) | ~6,5 | ~4,6 | Claim, parágrafo, segunda afirmação, oferta; depois nada | B, com cauda C | **O maior bloco do site.** 1,26 vp mortos no fim (1,12 no desktop) |
| **About → Method** | 2,90 | 2,07 | Passagem de tempo na mesma sala | E / A | Essencial (C17–C19); 4% quieto |
| **Method** | 3,26 | 2,17 | Sete linhas e uma nota, câmara contínua | B | 6 eventos de texto; ~1 linha por 0,4–0,5 vp |
| **Method → Questions** | 3,20 | 2,17 | A luz volta, as linhas saem uma a uma | B / E | 10 eventos de texto (C25) |
| **Questions → Contact** | 2,55–2,86 | 2,85 | As perguntas, a saída, o hero devolvido | misto | Congelado. No desktop, 1,0 vp morto; em tablet coarse, 1,8 vp |
| **Contact** | 1,07 | 0,99 | O fecho escreve-se | B | No desktop, 0,9 vp morto na cauda |

Scroll estritamente morto de Work ao fim: **1,2–2,0 vp** nos telemóveis, **2,5–3,0 vp** no desktop,
**3,5 vp** em tablet coarse.

A junção **09 → 10 merece nota à parte**: é registada como *Work → About*, mas 90% dela é o próprio
About. O claim aparece a `p` 9,2 e o frame só é largado depois de 10,0. São 870vh num telemóvel — 18% do
site inteiro — para um título de duas linhas, um parágrafo e uma segunda afirmação.

---

## 9. Performance — observação separada

A auditoria de performance concluiu que o bottleneck de runtime é o driver a escrever custom properties
em `:root`. **Nada disso é tratado aqui**, e nenhuma das propostas abaixo é uma optimização de
performance. Registam-se apenas as zonas onde as duas análises se tocam, para a fase futura:

- **A Opening inteira (25,0 vp num telemóvel) é scroll-driven em `:root`.** Os trechos de baixa
  consequência visual (01 → 05, 17,5 vp) são os mesmos em que cada frame paga o recálculo de estilo do
  documento inteiro. *Esta área contém muito scroll-driven work e poderá ser relevante para a futura
  optimização de performance.*
- **A zona 05 e o 02 → 03** são onde o visitante faz mais gestos por menos resposta — e, pela outra
  auditoria, onde cada um desses gestos produz frames a 9–20 fps no emulador.
- **O About (09 → 10)**, com 8,70 vp, é a junção mais longa e escreve em `:root` durante toda ela.

Encurtar a distância **não** reduz o custo por frame. As duas coisas são independentes e devem ser
decididas em separado.

---

## 10. Top 10 pontos de fricção

Ordenados por: impacto na experiência, quantidade de scroll, frequência, impacto mobile, facilidade
potencial de compressão.

| # | Ponto | Medição | Porque dói | Mobile | Facilidade |
|---|---|---|---|---|---|
| **1** | **A primeira frase chega tarde** | Tese aos 10,0 vp (telemóvel), 6,7 (desktop): 8–15 swipes | Dez ecrãs de scroll antes de haver uma frase para ler | Muito alto | Média |
| **2** | **02 → 03 · Chapter II → II Philosophy** | 3,87 vp; consequência 3,0/vp, a mais baixa de uma junção inteira; tipo a 12–14px | 3–6 swipes em que quase nada parece mudar | Muito alto | Alta |
| **3** | **Zona 05 · as três ocasiões** | 4,76 vp; 67–100% quieto; frases desenhadas em 0,6 s | Holds cotados para scrub pagos depois de a frase já estar escrita | Muito alto | Média ⚠ C28 |
| **4** | **O multiplicador `coarse` 1,5×** | 48,8–49,1 vp contra 34,5–34,6 | Estrutural: tudo o que é longo é 1,5× mais longo num telemóvel | Total | Alta (um dial) — mas mexe em tudo |
| **5** | **About · 09 → 10** | 8,70 vp, 18% do site; 1,26 vp mortos no fim | O maior bloco do site para a menor quantidade de conteúdo novo | Alto | Alta na cauda |
| **6** | **01 → 02 · Chapter One → Chapter II** | 3,87 vp para uma palavra viajar | Uma só transformação repartida por 3–6 swipes — micro-scroll clássico | Alto | Média ⚠ C31-A |
| **7** | **A tese parada** | 2,2 vp (3,69 → 4,50) + 0,47 vp de frame limpo | Duas linhas seguradas por 2–4 swipes | Médio | Média ⚠ C29 / C30 |
| **8** | **Work · o scroll não controla o que se vê** | ~5,1 vp com o título do Work no ecrã; 08 → 09 são 2,15 vp | Scroll para sair, não para ver | Médio | Baixa (decisão de desenho, C13/C14) |
| **9** | **Veneza no telemóvel** | 06 → 08: 6,30 vp, resposta 22–41 contra 65–84 no desktop | A melhor passagem do filme responde menos de metade no telemóvel | Alto | Baixa — é a zona a proteger |
| **10** | **Caudas mortas no fim (desktop e tablet)** | 13 → 14: 1,0 vp morto (desktop), 1,8 (tablet coarse); Contact: 0,9 vp morto (desktop) | *"Porque é que ainda tenho de fazer scroll?"* literal | Baixo (≈0,1 vp) | Baixa ⚠ C26 / C27 |

Fora do top 10, por serem leitura legítima: o Method (11 → 13, 6,46 vp para 16 eventos de texto) e a
expansão do par em 03 → 04a (2,0 vp).

---

## 11. A experiência de destino

*Se reconstruíssemos apenas a distribuição do scroll — sem tocar na estética, na ordem, no texto ou nos
mecanismos — como deveria ser?*

1. **Um gesto, uma consequência.** A unidade de desenho deixa de ser a fracção de junção e passa a ser o
   gesto medido: um swipe normal (0,67–1,21 vp) deve completar, ou quase, uma transformação legível.
   Hoje nenhuma junção cabe num swipe.
2. **A distância segue a consequência.** Os trechos em que a imagem responde muito (Veneza, a composição
   a abrir, o Work a compor-se) merecem a distância que têm, e no telemóvel talvez mais. Os trechos em
   que responde pouco (02 → 03, os holds da zona 05) devem custar pouco.
3. **Segurar uma frase é do relógio, não da mão.** Onde uma frase já se desenha sozinha (C28–C30), o
   tempo de a ler pertence ao visitante: fica o tempo que ele quiser parado, e sai com um gesto. Pagar
   distância por um hold que já não é scrubbed é pagar duas vezes.
4. **Chegar cedo à primeira frase.** A tese é a primeira coisa que se lê; deve estar a poucos gestos do
   topo, não a dez ecrãs.
5. **Nenhum scroll só para libertar espaço.** Caudas em que nada se move (About, Contact e 13 → 14 no
   desktop) não têm função narrativa.
6. **Telemóvel e desktop cotados em separado, pela medição.** O par `fine` / `coarse` já existe; o que
   falta é a razão entre eles ser justificada trecho a trecho, não um 1,5× uniforme.
7. **O gesto rápido não deve saltar o conteúdo.** Se o runway longo existe para o flick, o flick tem de
   conseguir ver a Opening. Hoje não consegue (REGISTO C28).

Isto não define números. Define a relação que os números teriam de respeitar.

---

## 12. Três estratégias

Todas as distâncias abaixo são **ESTIMATIVAS** de ordem de grandeza, derivadas das medições; nenhuma é
um valor a implementar.

### Modelo A — Conservador

**O dial que já existe.** Usa-se só `TIMING.distance` — o lever que o próprio código nomeia (*"this is
the number to dial if the site is too long"*) — aproximando o par `coarse` do `fine`. Não se toca numa
única fracção, janela, relógio ou tabela de preços.

| | |
|---|---|
| **O que muda** | O comprimento dos runways em ponteiros `coarse`. Mais nada. |
| **O que permanece** | Toda a coreografia, todas as proporções, toda a estrutura, todos os mecanismos. O desktop fica exactamente como está. |
| **Scroll estimado** | Entre o actual e o `fine` medido: total 48,8 → no limite 34,6 vp; até ao Work 22,5 → no limite 15,0 vp. Os dois extremos estão medidos (768×889 nos dois ponteiros). |
| **Impacto mobile** | Proporcional e uniforme: tudo encurta pela mesma razão. |
| **Impacto desktop** | Nenhum. |
| **Risco** | Médio. Encurta por igual o que tem valor e o que não tem — Veneza, que já responde menos de metade no telemóvel, fica ainda mais curta. E aproxima a mão dos relógios de 0,6 s. |
| **Complexidade** | Baixa: seis valores. |
| **Zonas afectadas** | Todas, em `coarse`. |
| **Possíveis regressões** | As baterias de C27–C31 foram medidas em px e ms nos telemóveis: todos esses números mudam e têm de ser re-validados. A zona 05 precisa de ≥ 1,8 s para as três frases encadeadas; a posição da âncora das Questions (C27, D-gate) depende de `askedLead`. |
| **O que não resolve** | A distribuição. A zona 05 e o 02 → 03 continuam a ser os trechos de menor consequência — só mais curtos. As caudas mortas do desktop ficam. |

### Modelo B — Editorial

**Redistribuir, não encolher.** Mantém-se a estrutura, a ordem, os catorze estados e todos os
mecanismos; muda-se **quanto custa cada fase**, usando os dois dials de preço que o projecto já tem
(`TIMING.distance` por runway e as tabelas `pricing` por fase), para que cada gesto produza uma
transformação.

| | |
|---|---|
| **O que muda** | O preço das fases de baixa consequência desce: 02 → 03, os holds da zona 05, a tese parada, a cauda do About, as caudas mortas do desktop. O preço das fases de alta consequência mantém-se — e no telemóvel Veneza pode até ficar com uma fatia maior do total. A razão `coarse` / `fine` passa a ser decidida por runway. |
| **O que permanece** | A sequência, os estados, as junções, os relógios de C28–C30, a troca de C31-A, a ponte, o reframe, o carrossel, as Questions e o Contact como mecanismos. `timeline.ts` e as suas asserções. C8 intacto: o scroll continua a ser dono da progressão. |
| **Scroll estimado** | Até ao Work, num telemóvel: da ordem de **12–15 vp** contra 22,5 (10–12 batidas legíveis a cerca de um swipe cada, mais o reframe de Veneza inteiro). Do Work ao fim: da ordem de **18–21 vp** contra 26,3. Total da ordem de **30–36 vp** contra 48,8. |
| **Impacto mobile** | Alto, e onde foi medido que dói: chega-se à primeira frase e ao Work em cerca de metade dos gestos. |
| **Impacto desktop** | Pequeno e localizado: as caudas mortas e, se o owner quiser, os mesmos trechos de baixa consequência. Pode ser feito só em `coarse` numa primeira fase. |
| **Risco** | Médio. Os mecanismos não mudam, mas as distâncias de zonas congeladas mudam, e isso é uma reabertura que só o design owner pode fazer. |
| **Complexidade** | Média: valores em `timing.ts` (distâncias e tabelas de preço), sem código novo. Exige a bateria de validação das zonas tocadas. |
| **Zonas afectadas** | 01 → 06 e a cauda de 09 → 10 em `coarse`; opcionalmente 13 → 14 e Contact em `fine`. |
| **Possíveis regressões** | (1) A zona 05 encurtada abaixo do tempo dos três relógios encadeados faz o `clear` de C28 apagar *A memory.* antes de estar escrita. (2) C29 / C30: os frames vazios foram aprovados em px e ms; mudam. (3) C31-A: a janela do passo foi afinada para a distância actual. (4) As asserções de `timeline.ts` sobre pesos de junção (C4-A) podem disparar de outra forma. |

### Modelo C — Experience-first

**Reestruturar a Opening.** O prólogo tipográfico (01 → 05) deixa de ser distância e passa a ser tocado,
como a chegada do Hero já é: um ou dois gestos disparam uma sequência que se desenha no seu próprio
relógio. O scroll volta a ser dono da progressão a partir da fotografia. A navegação entre capítulos
apoia-se mais no rail e no Quick Menu.

| | |
|---|---|
| **O que muda** | O modelo de progressão das junções 01 → 05: de scroll-scrubbed (ou disparado por posição) para uma sequência tocada. A relação entre o primeiro gesto e a primeira frase. |
| **O que permanece** | A ordem, o texto, a estética, One Sun B2, a fotografia como ponte, o reframe de Veneza, o Work, e tudo depois dele. |
| **Scroll estimado** | Até ao Work, num telemóvel: da ordem de **6–9 vp** contra 22,5 (o prólogo em 1–2 gestos, mais o reframe e a composição do Work). |
| **Impacto mobile** | Muito alto. |
| **Impacto desktop** | Muito alto também — muda a natureza da Opening nos dois. |
| **Risco** | **Alto.** Contradiz a regra condutora de C8 — *"scroll owns progression; time owns only what the visitor did not cause"* — e obriga a reabrir C28, C29, C30 e C31-A, todos congelados. Uma sequência tocada tem de responder a paragem, reverso e interrupção, que hoje são correctos por construção. |
| **Complexidade** | Alta: um sequenciador novo para o prólogo, a sua relação com `--haste`, o reverso, o reduced-motion e a alternativa sem scripting. |
| **Zonas afectadas** | 01 → 05 inteiras; o Ledger (os ticks de capítulo); o estado sem scripting. |
| **Possíveis regressões** | A pureza do scroll (reverso e interrupção); a abertura obrigatória e o seu relógio; a acessibilidade por teclado durante a abertura; a continuidade com Veneza; tudo o que foi validado em C28–C31. |

---

## 13. Recomendação

**Testar primeiro o Modelo B — Editorial**, limitado a **Opening → Work**, só em ponteiros `coarse`, e
numa **cópia isolada** (o processo que C31 usou: o projecto principal intacto, previews à parte, e só se
promove o que o design owner aprovar).

Porquê B e não A:

- **A medição diz que o problema é de distribuição, não só de total.** A Opening quase não tem scroll
  morto (0,5 vp); tem 70% do seu caminho (17,5 vp) em trechos que respondem pouco, e a resposta
  concentrada nos últimos 30%. O Modelo A encurta tudo pela mesma razão e deixa essa relação exactamente
  como está.
- **O Modelo A tira distância ao que mais precisa dela.** Veneza já responde menos de metade no
  telemóvel do que no desktop; um dial uniforme encurta-a tanto como ao 02 → 03.
- **B usa os mesmos dials que A**, mais as tabelas de preço que o projecto já tem para isto
  (*"PRICING — what each phase costs to scroll through. THIS IS THE LENGTH DIAL. Changing these retimes
  nothing"*). Não precisa de código novo.

Porquê B e não C:

- **C contradiz C8**, que é a regra condutora do projecto, e reabre quatro decisões congeladas há dois
  dias. É uma mudança de modelo, não de distribuição.
- **B é reversível e mensurável**: cada preço alterado é um número, e esta auditoria deixa a bateria
  (`scan.mjs`) pronta para medir antes e depois, no mesmo critério.
- **Se B não chegar, C continua disponível** — e passa a ter dados para o justificar. O contrário não é
  verdade.

**O que tem de ser decidido antes de qualquer teste**, e é do design owner:

1. Se as **distâncias** das zonas congeladas (C28, C29, C30, C31-A) podem ser reabertas num preview,
   mantendo os seus mecanismos e relógios.
2. Se a relação **gesto rápido ↔ relógios de 0,6 s** é para resolver nesta fase ou fica aceite como está
   (hoje: aceite, C28).
3. Se o teste é só `coarse` ou os dois ponteiros.

**Nada disto foi implementado.**

---

## 14. Limitações

- **Gestos sintetizados**, não pessoas. A distribuição real de gestos é UNKNOWN.
- **Gestos tácteis medidos em Android 14 / Chrome 113** no emulador; a curva de inércia do Chrome actual
  e a do iOS Safari não foram medidas.
- **Gestos de desktop não medidos**: o entalhe de 100px é o valor por omissão do Chrome em Windows;
  trackpad UNKNOWN.
- **Varrimento em Chrome 154 desktop com emulação**, não num telemóvel físico. O layout e a posição do
  driver são os reais; a barra de URL de um telemóvel (que muda a altura do viewport) não foi simulada.
- **Resolução de 12,5vh por passo.**
- **A medida de píxeis é feita com a filmagem congelada**: mede o que o scroll causa, não o que o
  visitante vê com o vídeo a correr. Nas zonas com filmagem (01 → 05), o ecrã real mexe-se mais do que
  estes números dizem — por causa do vídeo, não do gesto.
- **Os intervalos "mortos" são um limite inferior**: rampas declaradas em CSS a partir de
  `--junction-at` não aparecem como valores escritos pelo driver. Por isso a definição de *morto* exige
  também que os píxeis não mudem.
- **A classificação A–E é um juízo** apoiado em medições; o valor narrativo de um trecho é do design
  owner.
- **Tempo de leitura** não medido.
