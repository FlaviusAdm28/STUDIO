# CHAPTER ONE — Performance Audit

## Baseline

**Auditoria realizada a 4 de Outubro de 2026.** Este documento é o baseline oficial de performance do
CHAPTER ONE neste estado do projecto. É um arquivo: regista o que foi medido, o que não foi, e o que foi
recomendado. **Nenhuma recomendação aqui descrita foi implementada.**

Cada afirmação está marcada com um destes estados, e a distinção deve ser preservada em qualquer leitura
futura:

| Marca | Significado |
|---|---|
| **CONFIRMADO** | Medido directamente nesta auditoria. |
| **PROVÁVEL** | Consistente com as medições, mas o mecanismo ou a relação causal não foi isolado. |
| **HIPÓTESE** | Não suportado por medição neste ambiente. |
| **NÃO MEDIDO** | Fora do alcance do ambiente usado. |
| **RECOMENDAÇÃO** | Proposta de investigação. Não implementada. |
| **NÃO É PROBLEMA** | Medido e excluído como causa principal. |

### Estado do repositório

```
Baseline:
master        = 133f080
origin/master = 133f080
```

Este é o estado de produção usado como referência para esta fase (`v2` e `origin/v2` estavam no mesmo
commit, `133f080` — *DEMO 2 - ALL READY*).

- O working tree estava limpo no início e no fim da auditoria.
- Nenhuma alteração funcional foi feita durante a auditoria. O `next build` usado para a comparação local
  só escreveu em ficheiros ignorados pelo git (`.next/`, `tsconfig.tsbuildinfo`).
- O CSS do build local tem o mesmo hash do CSS servido em produção (`2b7h_r_m_11cz.css`), ou seja, o
  código comparado é o mesmo.
- Os scripts e os resultados (JSON por zona e por ambiente) encontram-se **fora do repo**, em
  `D:\STUDIO-tools\perf-audit`.
- O Android SDK encontra-se **fora do repo**, em `D:\STUDIO-tools\android-sdk` (o AVD em
  `D:\STUDIO-tools\android-avd`).

---

### 1. Contexto da auditoria

**Origem.** Num Xiaomi Mi 11 Lite real, com Google Chrome, a versão de produção
(`https://studio-pi-ivory.vercel.app/`) mostrava animações scroll-driven a avançar aos soluços,
sobretudo na Opening e nas primeiras secções; Questions e Contact pareciam significativamente mais
suaves.

**O que foi feito.**

- Auditoria realizada **sobre a produção**, no URL acima.
- **Comparação local vs produção**: o mesmo código servido com `next build` + `next start`, nas mesmas
  condições de medição.
- **Android emulator**: AVD com as métricas do Mi 11 Lite, Android 14, Chrome 113, scroll táctil
  sintetizado por CDP.
- **Chrome 154 desktop** com métricas de telemóvel (393×800, DPR 2,75) e **CPU limitada** a 4× e 6×,
  para validar que os resultados não eram artefacto do Chrome 113 do emulador.

**Limitações do ambiente** (detalhe na secção 9):

- O **telemóvel físico ainda não foi perfilado**. As conclusões vêm do emulador e do Chrome 154 desktop
  com CPU limitada.
- A **GPU Adreno real ainda não foi medida**. O emulador usa a GPU do host.
- **iOS Safari ainda não foi testado.**

---

### 2. Executive Summary

**O Vercel NÃO é a causa do lag de runtime.**

**O principal bottleneck identificado é o recálculo de estilo na main thread, provocado pelo scroll
driver escrever CSS custom properties em `:root`** em quase todos os frames.

- **CONFIRMADO:** cada escrita de uma custom property herdada em `:root` obriga o Chrome a recalcular o
  estilo do documento inteiro — **≈300 elementos por frame**, em todas as zonas menos Contact.
- **CONFIRMADO:** o estilo representa **~90% do tempo da main thread** durante o scroll. JS do driver,
  layout e paint somados ficam abaixo de 6 ms por frame — **não são o principal bottleneck**.
- **CONFIRMADO:** o build local tem os mesmos números que a produção, e a página faz **0 pedidos de
  rede durante o scroll**.
- **CONFIRMADO:** **100% do conteúdo visível está fixo/pinned**, portanto tudo o que se move depende da
  main thread. Quando ela produz 8–20 fps, o movimento avança aos soluços mesmo que o compositor continue
  a apresentar frames.
- **NÃO MEDIDO:** o custo de GPU num Adreno real. Tudo o que este documento diz sobre GPU é hipótese.

---

### 3. Performance Scorecard

Emulador Android 14, CPU 1×, scroll táctil a 1200 px/s. Valores em **ms por frame da main thread**. A
última coluna é o Chrome 154 desktop com métricas de telemóvel e CPU 4×.

| Zona | FPS | p95 frame | JS | Style | Layout | Paint | Commit | Frames sem main update | Severidade | Chrome 154 @4× (fps / style) |
|---|---|---|---|---|---|---|---|---|---|---|
| Opening (01→07) | 9–20 | 83–317 | 1,2–2,9 | **28–48** | 0,6–1,7 | 0,8–1,5 | 2,8–7,0 | 70% | severe jank | 8–10 / 91–106 |
| Work | 12 | 133 | 2,8 | **38,6** | 1,2 | 1,6 | 6,0 | 73% | severe jank | 8,4 / 107 |
| About | 20 | 67 | 3,1 | **23,1** | 0,8 | 0,9 | 3,2 | 58% | visibly janky | 11,5 / 76 |
| Method | 19,5 | 67 | 1,9 | **26,8** | 1,1 | 1,2 | 3,7 | 60% | visibly janky | 9,6 / 94 |
| Questions | 15 | 100 | 2,5 | **26,6** | 0,6 | 0,8 | 5,4 | 67% | visibly janky | 11,2 / 78 |
| Contact | 13–17 | 117–133 | 2,2–2,7 | **6,9–23** | 0,6–0,8 | 2,4 | 5,1 | 65% | slightly degraded | 21 / 42 (ou ~90 fps / 1,7 quando `:root` não é escrito) |

*Frames sem main update* = frames do pipeline do compositor apresentados sem actualização da main thread
(parciais) ou perdidos, sobre o total, medido por trace no emulador.

**Observações associadas — CONFIRMADO:**

- **Frames longos.** Na Opening e em Work, praticamente todos os frames passam de 33 ms e a maioria de
  50 ms. Em Work, 56 de 64 frames ficaram acima de 50 ms e 10 acima de 100 ms.
- **Velocidade e direcção.** Lento (400 px/s), rápido (4000 px/s), reverse e pequenos vaivéns (±160 px)
  dão o mesmo custo por frame. O jank não depende da velocidade nem da direcção.
- **CPU 2× no emulador.** 5–11 fps, com estilo a 56–112 ms por frame. O site está no limite de CPU.

**Distribuição do tempo da main thread** (Chrome 154, CPU 4×, zona Work):

```
Style     ████████████████████████████  63,2 ms  (~90%)
JS        █                              2,5 ms
Paint     █                              2,0 ms
Commit    ▌                              1,3 ms
Layout    ▌                              0,5 ms
GPU       não mensurável neste ambiente
```

---

### 4. Opening por segmento

Emulador Android 14, CPU 1×, scroll táctil a 1200 px/s.

| Segmento | FPS | Style (ms/frame) |
|---|---|---|
| A · Chapter One | 10,9 | 47,9 |
| B · Chapter II | 14,1 | 35,7 |
| C · Philosophy | 11,7 | 34,2 |
| D · Thesis | 20,1 | 27,9 |
| E · Occasions | 8,8 | 37,8 |
| F · Venice | 12,2 | 38,5 |
| G · Work | 12,0 | 38,6 |

**A abertura no seu próprio relógio, sem scroll — NÃO É PROBLEMA (CONFIRMADO):** 47 fps, 2 ms de estilo
por frame. O que falha é o scroll, não a chegada do Hero.

---

### 5. Bottlenecks

#### P0 — root custom property writes

**Estado: CONFIRMADO, confiança alta.**

- **Onde:** `src/app/scroll-stage.tsx` (linhas 853, 865, 1591–1596, 1620, 1732–1762 no commit
  `133f080`).
- **O que acontece:** o driver faz **3–13 escritas por frame**, quase todas em **`:root`**, que já tem
  **111 custom properties inline**. Cada escrita invalida o estilo do documento inteiro: **≈300
  elementos** recalculados por frame (p50 de 296–318 consoante o ambiente), em todas as zonas menos
  Contact (p50 de 5).
- **Custo medido:** uma única escrita de uma custom property não usada em `:root` custa **5,2–5,6 ms a
  1×** e **36–39 ms a 4×** no Chrome 154. No emulador custa **12–19 ms**.
- **Contraprova:** a mesma escrita em **`.publication`** ou num elemento **folha** custa **~0 ms**. Numa
  propriedade registada com **`inherits: false`** custa **0,1 ms**.
- **Porquê é tão caro:** o DOM tem só 285 elementos, mas há 298 custom properties computadas na raiz e
  626 declarações com `var()`. O custo é **medido**; o mecanismo exacto por elemento é **PROVÁVEL**.
- **Possível uso futuro de `@property` com `inherits: false`:** a medição acima mostra o ganho potencial,
  mas mudar a herança altera a semântica (os descendentes deixam de ler o valor), pelo que não é uma
  substituição directa. Ver a recomendação 1.

#### P1 — `--haste`

**Estado: CONFIRMADO, confiança alta.**

- **Onde é escrito:** `src/app/opening.tsx:231` (`root.style.setProperty('--haste', haste)`), e também
  na plate do hero na linha 238.
- **Continua depois da Opening:** é publicado sempre que a velocidade de scroll muda, em todas as zonas
  até Contact, muito depois de `data-opening` passar a `done`.
- **Impacto em Contact:** com `--haste` a disparar (1200 px/s), o estilo é 23 ms (emulador) ou 42 ms
  (Chrome 154 @4×). Sem ele (600 px/s) é **1,7 ms e ~90 fps**.
- **Impacto em Questions:** as escritas em `:root` são só `--junction-at` e `--haste` (≈1 por frame), e
  bastam para custar 32–45 ms por frame a 4×.
- **Potencial solução (RECOMENDAÇÃO, não implementada):** deixar de publicar em `:root` depois da
  abertura terminar, mantendo o mecanismo durante ela.
- **Risco / ganho esperado:** risco baixo; Contact e Questions passariam a custar ~2 ms de estilo por
  frame. A confirmar: se algo lê `--haste` depois de `data-opening="done"`.

#### P1 — `hero_demo4.mov`

**Estado: a existência e as características do asset são CONFIRMADAS. O impacto no jank é HIPÓTESE —
não totalmente confirmado.**

- **Asset:** `/media/hero/video/hero_demo4.mov`, **2880×1440**, **12,1 s**, **30,8 MB** (**~20 Mb/s**),
  mostrado numa área de 393×800 px CSS.
- **Dois `<video>`** com o mesmo `src` e `preload="auto"` (`.env-hero` e `.env-hero-still`).
- **Descodificação quando invisível:** medido no Chrome 154 desktop — `.env-hero` continua a descodificar
  30 frames/s durante a sessão inteira, incluindo de Venice a Questions, onde a opacidade efectiva é 0.
- **O que fica como HIPÓTESE:** que essa descodificação contribua para o jank num telemóvel real. Não
  foi possível medi-lo — o emulador mostrou artefactos verdes no vídeo, por isso o caminho de
  descodificação dele não é representativo.

#### P2 — cold load / PNGs

**Estado: os números são CONFIRMADOS. A relação com o lag percebido é só PROVÁVEL, e só na primeira
visita.**

- **Total:** **~37 MB** em **18 requests**.
- **Vídeo:** 30,8 MB.
- **Três PNG** de 1536×1024, 1,8–2,2 MB cada — **~6 MB** (`/media/studio/method.png`,
  `/media/studio/image19aug26.png`, `/media/projects/venice/venice.png`).
- Restante: JS 179 kB, CSS 20 kB, fontes 69 kB.
- **Impacto no cold load:** os três PNG estão em `<link rel="preload">` e competem com CSS e JS. A frio,
  numa ligação de ~17 Mb/s: DOMContentLoaded 5,2 s, FCP 6,8 s, load 9,2 s.
- **Warm load:** DOMContentLoaded 80 ms, FCP 1,6 s, load 0,7 s.

#### P2 — `contact-breath`

**Estado: CONFIRMADO.**

- **Onde:** `src/app/globals.css:6518` (`@keyframes contact-breath`), aplicada em `.contact-begin` quando
  `.publication[data-contact='held']`.
- **O que é:** uma animação infinita de uma **custom property** (`--breath`).
- **Trabalho contínuo em Contact:** parado nessa zona, 577 recálculos de estilo e 418 layouts em 4 s —
  ~14% da main thread só em estilo, a 1× em desktop.

#### P3 — favicon / cache

**Estado: CONFIRMADO.**

- `/favicon.ico` devolve **404**.
- `/media/*` é servido com `cache-control: public, max-age=0, must-revalidate`, o que dá uma
  revalidação (304) em cada visita, ~50 ms cada.

#### Camadas e filtros em ecrã inteiro — sem prioridade atribuída

**Estado: o custo de GPU é HIPÓTESE; o lado CPU NÃO É PROBLEMA (CONFIRMADO).**

- 25–47 camadas a desenhar, 11–14 delas do tamanho do viewport ou maiores. Cinco plates com cadeias de
  `filter` e um gradiente radial (`.v2-grade`) cujo raio muda com o scroll.
- Memória de tiles estimada em 130–190 MB a DPR 2,75, como limite superior, excluindo a camada de
  scroll.
- Paint custa 1–2 ms por frame e a rasterização é pequena.

---

### 6. Vercel investigation

| Área | Resultado |
|---|---|
| Network | HTTP/2, TTFB 174 ms (384 ms no browser a frio); todos os pedidos 200/206 excepto `/favicon.ico` (404) |
| Runtime | Local e produção iguais a 4×: Chapter One 9,9 vs 9,2 fps, Work 8,3 vs 8,4, Questions 11,1 vs 11,2, Contact 22 vs 21 |
| Cache | `x-vercel-cache: HIT` em tudo. `/_next/static` com `immutable` de 1 ano. `/media/*` com `max-age=0, must-revalidate` (revalidação em cada visita) |
| Compressão | Brotli em HTML, CSS e JS |
| Assets | O problema é o tamanho dos ficheiros (vídeo e PNG), não a entrega |
| Server | Página estática pré-renderizada (static rendering); nada a apontar |

**Conclusão — CONFIRMADO:** local e produção apresentam números semelhantes, dentro do ruído de medição.
O runtime não depende do Vercel: a página faz 0 pedidos de rede durante o scroll. **O Vercel não é o
bottleneck de scroll.** O lag de scroll é código (CSS/driver); os assets pesam no primeiro carregamento.

---

### 7. Questions vs Contact

- **Contact — CONFIRMADO.** As escritas vão principalmente para `div.publication` (≈0 ms de estilo
  cada), e o recálculo toca 5 elementos em vez de ~300. Sem `--haste`, corre a ~90 fps mesmo a 4×.
- **Questions — só parcialmente confirmado.** A maioria das escritas (822 de 1226) vai para
  `div.publication`, e `:root` recebe ≈1 escrita por frame em vez de 2–13. Isso dá 20–30% menos estilo a
  velocidade normal e cerca de 2× mais fps num scroll mais lento (18–25 contra 10–18 a 600 px/s e
  CPU 4×). Isto ajuda a explicar porque parecem mais suaves.
- **Ainda existe jank em Questions.** Em números, Questions continua janky (11–15 fps).
- **O que não ficou explicado.** A diferença sentida no telemóvel em Questions é maior do que a que foi
  medida. Pode haver um factor perceptivo ou de GPU que este ambiente não mostra — **HIPÓTESE**.
- **Explicações descartadas (CONFIRMADO):** não é scroll nativo (0% do conteúdo visível acompanha o
  scroll, em qualquer zona) nem são transições em tempo (Questions só tem uma transição de `color`).

---

### 8. Things explicitly ruled out

A auditoria **não** encontrou nenhum destes como problema principal — **NÃO É PROBLEMA (CONFIRMADO)**:

| Excluído | Evidência |
|---|---|
| JS do driver | 1–3 ms por frame |
| Forced layouts | Zero leituras de layout no loop; zero layouts forçados por leitura |
| React renders | Zero renders durante o scroll |
| Layout (CPU) | ≤1,7 ms por frame |
| Paint (CPU) | ≤2,4 ms por frame; rasterização pequena |
| Heap growth | Heap JS estável em 4–5 MB e renderer estável em ~300–315 MB ao longo de todo o percurso; sem degradação progressiva |
| Scroll speed / direction | Mesmo custo por frame em lento, normal, rápido, reverse e vaivéns |
| Native scroll | 0% do conteúdo visível acompanha o scroll nativo; não explica diferenças entre zonas |
| Time transitions | Não explicam a diferença de Questions (uma única transição de `color`) |
| Trabalho em repouso | Dois loops `requestAnimationFrame` permanentes, ~0,5% de script, sem recálculos de estilo (excepto em Contact — ver `contact-breath`) |
| Abertura no seu próprio relógio | 47 fps, 2 ms de estilo por frame |
| Vercel / rede em runtime | Local igual a produção; 0 pedidos durante o scroll |

---

### 9. Limitations

**Ambiente Android usado:**

| | |
|---|---|
| Dispositivo | AVD `mi11lite` (imagem `google_apis` x86_64), aceleração WHPX |
| Android | 14 (API 34) |
| Chrome | 113.0.5672.136 |
| Resolução / DPR | 1080×2400, 440 dpi, DPR 2,75, viewport 393×800 |
| CPU | 4 vCPU sobre Ryzen 5 5600X |
| RAM | 6 GB |
| GPU | host, NVIDIA RTX 3070 (GLES e Vulkan via gfxstream) |

**O que isto limita:**

- **Chrome 113 no Android emulator**, não o Chrome actual. A imagem não traz Chrome estável recente.
- **Chrome 154 desktop usado para as outras medições**, com métricas de telemóvel e CPU 4× e 6×; a
  conclusão é a mesma nos dois. No desktop, o scroll foi sintetizado por roda (o gesto táctil sintético
  não é aplicado sob emulação móvel); no emulador foi táctil.
- **A GPU do emulador é a RTX 3070 do host.** Os custos de GPU, rasterização e composição não são
  representativos de um Adreno.
- **`pointer: coarse` não é representativo**: é falso no emulador, pelo que a página fica com 27,3k px de
  scroll em vez dos 39k de um telemóvel. O custo por frame não muda.
- **O vídeo no emulador** apresentou artefactos verdes; o caminho de descodificação não é representativo.
- **O Mi 11 Lite real ainda não foi perfilado.**
- **iOS Safari não foi testado.**
- **A GPU real continua uma hipótese aberta.**
- A classificação de severidade por zona foi feita por métricas, não por observação a olho.

---

### 10. Recommended investigations

**Todas as recomendações abaixo: `STATUS: NOT IMPLEMENTED`.** São propostas de investigação, não
decisões. Nenhuma foi transformada em código.

| # | Investigar | Possível solução | Risco | Ganho esperado | Dificuldade | Status |
|---|---|---|---|---|---|---|
| 1 | Mapear o consumer de cada custom property escrita por frame — que elemento lê cada uma | Escrever no contentor consumidor mais próximo (`.v2`, `.environment`, `.publication`) em vez de `:root`; ou registar com `@property` e `inherits: false` onde o consumidor é o próprio elemento | Médio-alto: 111 propriedades, consumidores espalhados, o Ledger também lê | 10–50× menos estilo por frame | Média | **NOT IMPLEMENTED** |
| 2 | Investigar `--haste` depois da Opening — se algo o lê depois de `data-opening="done"` | Deixar de publicar em `:root` após a abertura, mantendo o mecanismo durante ela | Baixo | Contact e Questions passam a custar ~2 ms | Baixa | **NOT IMPLEMENTED** |
| 3 | Investigar o vídeo — custo real de descodificação no telemóvel | Pausar o vídeo quando a plate está a opacidade 0; recodificar para ≤1080p e 4–6 Mb/s; um só `<video>` | Baixo-médio (qualidade visual a validar) | ~25 MB a menos; menos carga de descodificador | Baixa | **NOT IMPLEMENTED** |
| 4 | Rever PNG / preload — prioridade dos preloads face a CSS/JS | AVIF/WebP para as três plates; rever o preload | Baixo | FCP a frio bem mais cedo | Baixa | **NOT IMPLEMENTED** |
| 5 | Rever `contact-breath` | Animar `opacity`/`transform` directamente em vez de `--breath` | Baixo | Remove o trabalho permanente em Contact | Baixa | **NOT IMPLEMENTED** |
| 6 | Profiling no Mi 11 Lite real — GPU incluída | Ligar por USB com `chrome://inspect` e correr o mesmo harness | Nenhum | Fecha a única hipótese em aberto | Baixa | **NOT IMPLEMENTED** |

**Prioridades atribuídas pela auditoria:**

| Prioridade | Problema |
|---|---|
| P0 | Escritas por frame em `:root` |
| P1 | `--haste` em `:root` depois da abertura |
| P1 | Vídeo 2880×1440 a ~20 Mb/s sempre a descodificar |
| P2 | PNG de ~6 MB em preload e peso do carregamento a frio |
| P2 | `contact-breath` a animar uma custom property |
| P3 | `favicon.ico` 404; `max-age=0` em `/media/*` |
