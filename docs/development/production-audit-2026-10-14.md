# CHAPTER ONE — Auditoria da produção · 14 de Outubro de 2026

Auditoria técnica, visual e funcional do site publicado, feita **directamente no domínio público de
produção** `https://studio-pi-ivory.vercel.app/`. Só diagnóstico: nenhum ficheiro, configuração ou
deployment foi alterado durante a auditoria. É o ponto de partida da branch `v3`.

Cada afirmação tem um destes estados, e a distinção deve ser preservada em qualquer leitura futura:

| Marca | Significado |
|---|---|
| **CONFIRMADO** | Medido directamente, com o método indicado. |
| **CONFIRMADO EM EMULAÇÃO** | Medido, mas em condições emuladas (rede ou CPU); não medido em hardware ou rede reais. |
| **HIPÓTESE** | Observado ou plausível, mas não reproduzido ou não isolado. |
| **NÃO É PROBLEMA** | Verificado e excluído. |
| **NÃO MEDIDO** | Fora do alcance desta auditoria. |

---

## 1. O que foi testado

| | |
|---|---|
| URL | `https://studio-pi-ivory.vercel.app/` — o domínio público. O URL do deployment (`studio-jyfdmpqcz-flavio15.vercel.app`) foi excluído: exige autenticação Vercel e devolve a página de login. |
| Deployment | GitHub deployment `7068328100`, ambiente *Production*, commit `dd53786558246e08f48da323a7eff45b44c758e8`, estado *success* (14 Out, 14:34 UTC). |
| Confirmação do build servido | caminhos `/_next/static/immutable/` (formato do Next 16.3 na Vercel); JS total 670 698 B (o build 16.3.8 local tem 670 210 B; 16.2.12 tinha 731 379 B); CSS idêntico ao build validado, excepto os nomes com hash das fontes. |
| Git | `master` = `origin/master` = `v2` = `origin/v2` = `dd53786`; working tree limpo. |

**Ambientes, e o que cada um vale:**

| Ambiente | Como | Vale como |
|---|---|---|
| Xiaomi Mi 11 Lite 5G, Android 10, Chrome 155 | o domínio público aberto num **separador novo** do Chrome do telefone, por intent; ferramentas ligadas por CDP **só** a esse separador (os do dono não foram tocados). Gestos por `Input.synthesizeScrollGesture` / `synthesizeTapGesture` (o pipeline de toque real do aparelho, mas **não um dedo**). Wi-Fi. | dispositivo real |
| Chrome 155 desktop (headless), este PC | Playwright, viewports 320×640, 360×800, 375×667, 375×812, 390×844, 768×1024, 1440×900, 1920×1080 | browser desktop real; telefones = emulação de viewport |
| WebKit (Playwright 26.x, Windows) | 1440×900, 375×812, 320×640 | motor WebKit, **não** Safari iOS |
| Emulação de rede (Chrome) | Fast 4G (9 Mb/s, 60 ms), Slow 4G (1,6 Mb/s, 150 ms), 3G (0,75 Mb/s, 300 ms), CPU 4× | emulação |
| Emulação de CPU | Chrome desktop com CPU 4× mais lenta | emulação de um portátil modesto |

**Instrumentação — só observação.** Nenhuma função da página foi substituída. Tempos de frame por
`requestAnimationFrame`; escritas em `:root` contadas por um `MutationObserver` (com `oldValue` para
saber que propriedades mudaram); custo da main thread e atribuição das recalculações pelo trace do
próprio Chrome (`devtools.timeline` e `disabled-by-default-devtools.timeline.invalidationTracking`);
análise com `D:\STUDIO-tools\perf-audit\trace.mjs`. Scripts e dados em bruto: pasta `prod/` do
scratchpad da sessão (fora do repositório).

**Correcção de metodologia registada.** Uma primeira tentativa usou um proxy local em `:3000` para
reutilizar `run.mjs` no telefone; foi interrompida pelo design owner antes de qualquer medição e
abandonada. Nenhum resultado desta auditoria vem desse caminho.

---

## 2. Resumo executivo

- **Estado geral:** produção saudável e estável. Sem bugs que impeçam o uso, sem erros de consola, sem
  pedidos falhados, sem overflow, CLS 0, sem recarregamentos na navegação, e nenhum estado
  inconsistente reproduzido.
- **Lentidão real, medida no dispositivo:** o scroll não atinge 60 fps num Android de gama média —
  **35–46 fps, p95 50–130 ms** no Xiaomi —, por recalculações de estilo do documento inteiro (~65–70 ms
  cada) provocadas por escritas de variáveis CSS em `:root` (AUD-001). É lentidão real, não só
  oportunidade.
- **Trabalho desnecessário em repouso:** o carrossel do Work ocupa 35 % da main thread sem ninguém tocar
  (AUD-003).
- **Redes lentas:** em Slow 4G / 3G emulados a abertura estica muito (AUD-004). Em Wi-Fi real está boa.
- **Limitações principais:** sem iOS Safari; sem rede móvel real; scroll medido só no Chrome do
  telefone.

---

## 3. Findings

### AUD-001 · Recalculações de estilo do documento inteiro fazem o scroll engasgar no Android

- **Categoria:** performance · **Estado:** CONFIRMADO · **Severidade:** P1 · **Esforço:** alto
- **Impacto:** num Android de gama média o scroll avança aos soluços na Opening, Work, About, Method e
  Questions. Como todo o conteúdo visível está fixo/pinned, o que se vê só actualiza ao ritmo da main
  thread (o compositor continua a apresentar 53–61 fps).
- **Condições:** Xiaomi real, Chrome 155, 392×779, produção; gestos por zona de 1 400–5 000 px, nos dois
  sentidos, a 400, 1 200 e 4 000 px/s.
- **Passos para reproduzir:** abrir o domínio no telefone, esperar o fim da abertura, percorrer cada zona
  com o dedo a velocidade constante e gravar um trace.
- **Evidência (1 200 px/s, por zona; fps e intervalos de frame por rAF):**

  | Zona | Sentido | fps | p95 (ms) | máx (ms) | style (ms/frame) | JS | layout | main thread |
  |---|---|---|---|---|---|---|---|---|
  | Opening | ↓ | 38,0 | 65,4 | 81,9 | 17,5 | 3,5 | 1,1 | 88 % |
  | Memory→Work | ↓ | 34,7 | 81,8 | 98,3 | 23,9 | 2,2 | 0,9 | 96 % |
  | Work | ↓ | 41,1 | 98,1 | 163,6 | 40,5 | 4,3 | 2,0 | 86 % |
  | About | ↓ | 36,9 | 65,5 | 82,0 | 19,9 | 3,0 | 0,7 | 92 % |
  | Method | ↓ | 37,1 | 65,4 | 65,6 | 20,3 | 2,1 | 0,8 | 79 % |
  | Questions | ↓ | 39,3 | 49,2 | 81,9 | 20,9 | 1,9 | 0,7 | 89 % |
  | Contact | ↓ | 46,0 | 32,8 | 65,6 | 9,2 | 1,6 | 0,7 | 91 % |
  | Opening | ↑ | 37,9 | 65,4 | 81,8 | 19,4 | 2,4 | 1,2 | 92 % |
  | Memory→Work | ↑ | 38,0 | 81,6 | 98,1 | 20,2 | 3,9 | 0,7 | 101 % |
  | Work | ↑ | 38,5 | 81,9 | 163,8 | 34,5 | 4,1 | 1,4 | 88 % |
  | About | ↑ | 41,1 | 98,2 | 130,6 | 38,1 | 4,2 | 1,4 | 106 % |
  | Method | ↑ | 40,6 | 98,1 | 131,1 | 46,1 | 4,1 | 1,8 | 103 % |
  | Questions | ↑ | 26,9 | 130,6 | 262,1 | 71,3 | 7,8 | 5,0 | 119 % |
  | Contact | ↑ | 49,5 | 32,8 | 49,1 | 13,4 | 1,7 | 0,9 | 130 % |

  (A percentagem de main thread pode passar de 100 % porque soma eventos sobrepostos do trace; lê-se
  como "saturada".)

  - A velocidade não muda o custo: a 400 e a 4 000 px/s, 30–45 fps e o mesmo estilo por frame.
  - **Custo por recálculo** (invalidation tracking): o documento inteiro (300–311 elementos) custa
    **64,5–69,9 ms**; um recálculo dirigido (< 50 elementos) 3–7 ms. Há 22–44 recálculos do documento
    inteiro por gesto (Work ↓: 44 = 2 848 ms; Questions ↑: 30 = 1 935 ms; About ↓: 22 = 1 538 ms).
  - **Atribuição** (invalidation tracking do Chrome): o gatilho principal é "Inline CSS style
    declaration was mutated" em `<html>` — 121 registos no Work ↓, 68 no About ↓, 55 no Questions ↑.
  - **Censo das escritas em `<html>` por gesto** (MutationObserver com `oldValue`):

    | Zona | Registos | Propriedades que mudam (contagem) |
    |---|---|---|
    | Opening ↓ | 105 | `--env-ground-at` 87, `--env-exposure` 61, `--env-venice` 49, `--junction-at` 37, `--env-hero` 37, `--env-field` 25, `--env-ground` 6, `--junction` 4 |
    | Memory→Work ↓ | 198 | `--film-sat` 112, `--film-con` 100, `--env-exposure` 91, `--film-lum` 88, `--cam-scale` 76, `--work-in` 64, `--env-ground-at` 63, `--env-pan` 60 |
    | Work ↓ | 230 | `--env-exposure` 145, `--junction-at` 93, `--env-field` 90, `--env-pan` 81, `--film-sat` 54, `--film-con` 48, `--film-lum` 42, `--cam-scale` 36 |
    | Work ↑ | 265 | os mesmos, com contagens 48–158 |
    | About ↓ | 124 | `--env-contrast` 77, `--env-exposure` 67, `--m-room-at` 57, `--env-studio` 46, `--junction-at` 42 |
    | Method ↓ | 104 | `--junction-at` 62, `--env-exposure` 59, `--rl-warm` 14, `--rl-blue` 13 |
    | Questions ↓ | 63 | `--env-return` 34, `--junction-at` 32, `--env-exposure` 25, `--env-method` 19, `--env-leave` 18 |
    | Contact | 0 | — |

  - `--haste` **não aparece em nenhuma zona** (a hipótese da auditoria de 4 Out está resolvida por C33).
  - **Desktop:** 1440×900 e 1920×1080, CPU deste PC: 97–144 fps, p95 7–21 ms, 0–3 frames > 33 ms por
    zona; mas a main thread já está 63–82 % ocupada e o estilo custa 4–7 ms por frame.
    **CPU 4× (emulação):** 36–59 fps, p95 48–63 ms, estilo 18–25 ms/frame (Contact: 104 fps).
- **Ficheiros:** `src/app/scroll-stage.tsx` (`put`, `root.style.setProperty`, `--junction` /
  `--junction-at`, `--aperture`), as cadeias `calc(var())` em `:root` de `src/app/globals.css` e
  `src/motion/environment.ts`.
- **Causa provável:** valores consumidos só pelo Environment e pelo rail são escritos em `:root`, e a
  cadeia de derivadas (`--junction-at` → `--jp1…13` → ~50 propriedades) é herdada por todo o documento.
  Coincide com o diagnóstico estrutural de 6–7 Out (`D:\STUDIO-tools\mobile-lag\out\SESSION-STATE.md`,
  "6. Diagnóstico estrutural", e `custom-property-map.md`). A Fase 1 (44 escritas órfãs) e a Fase 2
  (`--haste`, C33) já estão em produção; a Fase 3 — localizar as escritas — nunca foi feita.
- **Sugestão:** levar, uma propriedade de cada vez, as escritas com um só consumidor (Environment, rail)
  para o elemento consumidor e cortar a herança a partir de `:root`. A experiência "variante C" (6 Out,
  mesmo telefone) deu **−55 a −60 % de estilo e +4 a +10 fps**, mas partiu o rail e divergiu em 18–37
  elementos por posição — por isso não pode ser aplicada em bloco.
- **Risco:** alto — estes valores alimentam as zonas congeladas (C27–C31, C38) e as asserções do
  `timeline.ts`.
- **Validação:** comparação por posição com o build actual (`six` / `six-diff` com controlo de ruído),
  testes no telefone real zona a zona, revisão visual das zonas congeladas, iPhone.

### AUD-002 · Questions → Method (a subir) é a pior zona

- **Categoria:** performance · **Estado:** CONFIRMADO (três passagens: 400, 1 200 e 4 000 px/s)
  · **Severidade:** P2 · **Esforço:** médio
- **Impacto:** voltar de Questions para o Method é a passagem mais visivelmente aos soluços.
- **Condições:** Xiaomi real, Chrome 155, 392×779, produção.
- **Evidência:** 26,9–38,5 fps; p95 98–131 ms; máximo 196–262 ms; estilo **68–74 ms/frame**. Na mesma
  zona a descer: ~39 fps e 20–25 ms. Além das escritas em `:root`, **241–263 mutações por gesto em
  `.publication`** (`--qf*`, `--qfr*`, `--jgone*`) causam recalculações de 50–249 elementos a ~27 ms
  cada (21 por gesto, 570 ms) e 30 do documento inteiro (1 935 ms).
- **Ficheiros:** `src/app/scroll-stage.tsx`, bloco de Questions (`pubEl.style.setProperty`).
- **Causa provável:** a saída escalonada *on a thumb* (`b6fc788`, `TIMING.questions.thumb`) escreve as
  variáveis de cada linha em `.publication` (91 elementos), quando cada linha tem 1–29 consumidores
  (mapa de 6 Out).
- **Sugestão:** escrever as variáveis de cada linha na própria linha, sem mexer nos timings (congelados).
- **Risco:** médio; não muda valores, só onde são escritos.
- **Validação:** `reach-check`, `six-diff` na zona de Questions, telefone real nos dois sentidos.

### AUD-003 · O carrossel do Work consome 35 % da main thread em repouso

- **Categoria:** performance · **Estado:** CONFIRMADO · **Severidade:** P2 · **Esforço:** baixo
- **Impacto:** com o telefone parado no Work, o CPU continua ocupado sem nada visível a justificá-lo
  (bateria, aquecimento), e o scroll no Work parte de uma main thread já ocupada.
- **Condições:** Xiaomi real, Chrome 155, produção, 5 s em repouso por secção, sem input; custo pela
  API `Performance.getMetrics` do próprio Chrome.
- **Evidência:**

  | Secção em repouso | main thread | script | style | layout | recálculos/s | layouts/s |
  |---|---|---|---|---|---|---|
  | Opening (topo) | 77 ms/s | 17 | 0 | 0 | 0 | 0 |
  | **Work (carrossel vivo)** | **353 ms/s** | 17 | **202** | 4 | **84** | 9 |
  | About | 107 ms/s | 19 | 0 | 0 | 0 | 0 |
  | Method | 85 ms/s | 20 | 0 | 0 | 0 | 0 |
  | Contact (respiração) | 275 ms/s | 17 | 94 | 36 | 91 | 91 |

- **Ficheiro:** `src/app/work-experiences.tsx` — o `tick` em `requestAnimationFrame` chama `paint()` em
  todos os frames enquanto a secção está composta, e `paint()` escreve `--p` em todas as palavras da
  fila, incluindo as que ficam em `0`. O invalidation tracking durante o scroll no Work regista
  "`BUTTON.v2-queue-word` · Inline CSS style declaration was mutated".
- **Causa (actualizado na experiência da `v3`, ver abaixo):** a hipótese das escritas redundantes **não
  se confirmou** — o custo vem da actualização contínua do valor de preenchimento da palavra que enche.
- **Sugestão original:** escrever só quando o valor muda e só na palavra que enche — ou, como alternativa a
  avaliar, o enchimento conduzido por uma animação CSS de duração `TIMING.work.queue.holds`.
- **Risco:** baixo se `TIMING.work.queue` e o comportamento C14 ficarem iguais.
- **Validação:** tempo do enchimento antes/depois, pressão numa palavra, troca (dip), reduced motion.

#### AUD-003 · experiência na `v3`, primeira variante (14 Out 2026) — **substituída pela variante DPR ≥ 2, abaixo**

*Registo da primeira variante, que aplicava o limite de um pixel de dispositivo em qualquer densidade.
Mantido tal como foi medido; a decisão e os resultados da variante actual estão na secção seguinte.*

**Controlo e candidata.** Controlo = build local de `dd53786` (`D:\STUDIO-v3-control`, `node_modules`
próprio); candidata = `v3` com a alteração, não commitada. Os dois servidos lado a lado e medidos com o
mesmo procedimento, no mesmo aparelho/browser/viewport, no mesmo dia. São builds locais do mesmo commit,
não a produção.

**O que a baseline mostrou (antes de mexer):**

- **As escritas com valor inalterado não custavam nada.** Um `MutationObserver` com `oldValue` nas
  palavras da fila regista **0 mutações por segundo com o mesmo valor**: o Chrome descarta um
  `setProperty` que repete o valor. Retirá-las só pouparia uma chamada JS.
- **A causa é a palavra que enche.** O seu `--p` mudava em todos os frames — ~114 mutações/s no desktop,
  ~72/s no Xiaomi — e cada mudança obriga a um recálculo de estilo (3–4 elementos). É a **única** fonte de
  recálculo em repouso no trace (578 × "`BUTTON.v2-queue-word` · Inline CSS style declaration was mutated"
  em 4 s).
- O `--p` só é lido pelo `clip-path: inset(0 calc((1 - var(--p, 0)) * 100%) 0 0)` de `.v2-queue-fill`
  (`src/app/globals.css`).

**A alteração** (`src/app/work-experiences.tsx`, +26 −1): `paint()` guarda o último valor escrito e a
largura medida de cada palavra, e só escreve quando a extremidade do preenchimento avança **pelo menos um
pixel de dispositivo** (`|Δp| × largura × devicePixelRatio ≥ 1`). O 0 e o 1 são sempre escritos exactos;
enquanto a largura ainda não foi medida (0), escreve todas as mudanças, como antes. O relógio, a promoção
e a pressão lêem `elapsed`, não o valor escrito; `TIMING.work.queue`, a sequência, o dip e C14 ficam
iguais.

**Medições, Work em repouso:**

| | Controlo | Candidata | Variação |
|---|---|---|---|
| **Xiaomi real**, Chrome 155, 392×779, 3 × 10 s, duas passagens alternadas | | | |
| main thread | 261–285 ms/s | 188–216 ms/s | **−25 %** |
| style (`getMetrics`) | 124–126 ms/s | 92–97 ms/s | −25 % |
| recálculos/s | 87–88 | 25–32 | **−67 %** |
| style no trace | 53,5–53,9 ms/s | 21,1 ms/s | −61 % |
| escritas nas palavras/s | 72 | 19 | −74 % |
| intervalo entre trocas | 9049–9060 ms | 9049–9050 ms | igual |
| **Chrome desktop 1440×900** | | | |
| main thread | 167–187 ms/s | 100 ms/s | −42 % |
| recálculos/s | 142–144 | 22–26 | −83 % |
| **Chrome 390×844, CPU 4× (emulação)** | | | |
| main thread | 451–498 ms/s | 235–289 ms/s | −44 % |
| recálculos/s | 130–132 | 17–23 | −85 % |

A medição em produção (353 ms/s no Xiaomi, mais acima) e a de controlo local (261–285 ms/s) foram feitas
em condições diferentes e não se comparam entre si; a comparação válida é controlo vs candidata.

**Interacções** (Chrome desktop, controlo vs candidata): pressão na palavra que enche → troca 350 / 348 ms;
numa palavra em espera 351 / 348 ms; Enter pelo teclado 332 / 334 ms; categoria e ordem da fila depois de
cada pressão iguais; reduced motion — a fila não avança sozinha e a pressão funciona nos dois; 0 erros. O
teste de hover apanhou uma troca a decorrer e não é conclusivo (igual nos dois builds).

**Regressão:** typecheck, lint, build e asserções do `timeline.ts` passam; `six` controlo vs candidata
(51–89 valores por viewport) dentro do ruído controlo vs controlo (51–81), 0 overflow, 0 problemas;
navegação (1 carga, mesmos pontos de chegada, Chrome e WebKit), foco do menu, arranque iOS (0 escritas no
`currentTime`), Questions (`reach-check`) e Contact (0 de 246 campos diferentes) iguais ao controlo.

**Comparação visual** (Chrome desktop headless, capturas em pixels de dispositivo a cada ~22–42 ms,
cronometradas a partir do fim da troca que inicia o preenchimento — o mesmo evento nos dois builds):

| Movimento da extremidade | Controlo DPR 1 | Candidata DPR 1 | Controlo DPR 2,75 | Candidata DPR 2,75 |
|---|---|---|---|---|
| amostras em que a extremidade se moveu | 68 % | 34 % | 64 % | 62 % |
| "escada" local depois de retirar a tendência (rms / máx) | 0,26 / 0,64 px | 0,33 / 0,82 px | 0,70 / 1,58 px | 0,74 / 1,74 px |
| movimentos para trás | 1 | 1 | 2 | 1 |

- **DPR 2,75 (densidade do Xiaomi): equivalente.** As capturas sincronizadas aos 0,5 / 2 / 4 / 6 / 7,6 /
  8,1 / 8,3 s mostram a extremidade no mesmo ponto; as curvas sobrepõem-se.
- **DPR 1 (monitor 1440): diferença mensurável e pequena.** No controlo a extremidade avança em fracções de
  pixel (anti-aliasing); na candidata avança em passos de um pixel inteiro, ~17 por segundo, parada entre
  eles. A amplitude fica abaixo de ±1 px e a posição nunca se afasta do controlo mais do que ~0,8 px.
- **Chegada ao valor 1:** igual nos dois (fim do preenchimento aos ~8,15–8,17 s, sem salto final).
- **Pressão e troca:** capturas nos mesmos instantes desde o toque (0–2,6 s) com diferença média de 0–0,59
  níveis em 255 entre os builds — idênticas a menos do alinhamento.
- Os períodos parados de até ~2 s existem nos dois builds: são o espaço entre "Selected" e "Projects", onde
  não há tinta para o preenchimento revelar.

**Limitações:** captura feita no Chrome desktop headless — o screencast do Chrome entrega frames em pixels
CSS e perde frames, por isso a análise usa capturas recortadas em pixels de dispositivo; o tempo virtual do
Chrome bloqueia nesta página (vídeo e rede) e não foi usado. **Xiaomi real e iPhone: comparação visual NÃO
feita** (telefone bloqueado durante as capturas). A perceptibilidade dos passos de um pixel a DPR 1 é uma
avaliação visual que fica para o design owner.

**Estado desta variante:** o design owner viu a evidência e decidiu não aceitar os passos de um pixel em
DPR 1 — ver a variante seguinte. Evidência visual desta variante (capturas sincronizadas, filme da
extremidade, gráficos, vídeos lado a lado) em `scratchpad/v3/visual/index.html` da sessão, fora do
repositório.

#### AUD-003 · variante actual: o limite só a DPR ≥ 2 (14 Out 2026) — **aprovada a 15 Out 2026, commit local em `v3`**

**Decisão do design owner:** aplicar o limite de um pixel de dispositivo só quando
`devicePixelRatio >= 2`; abaixo de 2, manter a escrita do preenchimento em cada alteração, para preservar
a suavidade sub-pixel do desktop. 0 e 1 continuam exactos; o fallback com largura desconhecida mantém-se.

**Alteração** (sobre a primeira variante, `src/app/work-experiences.tsx`): a condição de saltar a escrita
ganha `ratio >= 2`; o comentário regista porquê. Diff total contra `dd53786`: +32 −1 num só ficheiro.

**Medições, Work em repouso, controlo (`dd53786`) vs esta variante, mesmas condições:**

| | Controlo | Variante DPR ≥ 2 | Leitura |
|---|---|---|---|
| **DPR 1** — Chrome desktop 1440×900 | | | |
| escritas nas palavras/s | 115 | 115 | comportamento original |
| recálculos/s | 144 | 144 | igual |
| main thread | 138–142 ms/s | 121–137 ms/s | igual (dentro do ruído) |
| intervalo entre trocas | 9042 ms | 9049 ms | igual |
| **DPR 2** — Chrome 390×844, CPU 4× (emulação) | | | |
| recálculos/s | 131 | 16–25 | **−85 %** (a primeira variante: −85 %) |
| main thread | 382–415 ms/s | 199–228 ms/s | **−47 %** (a primeira variante: −44 %) |
| escritas nas palavras/s | 111 | 14 | −87 % |
| intervalo entre trocas | 9062 ms | 9035 ms | igual |
| **Xiaomi real** (DPR 2,75) | — | — | **não re-medido** (telefone bloqueado). Em DPR 2,75 esta variante executa exactamente o mesmo ramo de código da primeira, medida no Xiaomi com −67 % de recálculos e −25 % de main thread; o resultado transita por construção, não por nova medição. |

**Movimento da extremidade** (capturas em pixels de dispositivo, cronometradas desde o fim da troca):

| | Controlo DPR 1 | Variante DPR 1 | Controlo DPR 2,75 | Variante DPR 2,75 |
|---|---|---|---|---|
| amostras em que a extremidade se moveu | 68 % | **68 %** | 63 % | 61 % |
| "escada" local (rms / máx) | 0,257 / 0,66 px | **0,257 / 0,64 px** | 0,72 / 1,70 px | 0,75 / 1,90 px |
| movimentos para trás | 2 | 1 | 2 | 1 |

- **DPR 1:** a progressão volta a ser a original — sem os passos de um pixel da primeira variante (era 34 %
  das amostras e 0,33 px rms).
- **DPR ≥ 2:** equivalente ao controlo, como na primeira variante.
- **Chegada a 1 e troca:** iguais (fim do preenchimento aos ~8,15 s; intervalo entre trocas igual).

**Interacções**, controlo vs variante, a DPR 1 e a DPR 2: pressão na palavra que enche 351/346 e 350/345 ms;
numa palavra em espera 349/350 e 346/345 ms; Enter 328/329 e 328/328 ms; categoria e ordem da fila iguais
depois de cada pressão; reduced motion sem avanço automático e com pressão; 0 erros.

**Regressão:** typecheck, lint, build; asserções do `timeline.ts` (só as notas informativas documentadas);
`six` controlo vs variante 50–88 valores por viewport contra 61–74 controlo vs controlo, 0 overflow, 0
problemas — as cinco propriedades que só aparecem na comparação controlo/variante (`--junction-at`,
`--swap`, `--qf0`, `--qr3`, `--qh3`) diferem numa só paragem cada, em milésimas ou num relógio de
Questions a meio, e aparecem nas mesmas paragens em comparações de um build consigo próprio; Contact 0 de
246 campos diferentes; navegação (Chrome e WebKit, 390 e 1440: 1 carga, mesmos pontos de chegada), foco do
menu (0 problemas), arranque iOS (0 escritas no `currentTime`) e Questions (`reach-check` 92 / 14 / 0 / 0)
iguais ao controlo. Nenhuma área
congelada foi tocada: a alteração está num único ficheiro, `work-experiences.tsx`, na escrita do `--p`.

**Xiaomi real, 15 Out 2026** (M2101K9G, DPR 2,75, 392×779, Chrome a 90 Hz; `next start` local, controlo
`:3301` vs variante `:3302`; `work-rest.mjs`, 2 execuções de cada, alternadas, telefone acordado e
desbloqueado em todas):

| | Controlo | Variante DPR ≥ 2 | Diferença |
|---|---|---|---|
| main thread (6 × 10 s) | 279,9 ms/s | 203,2 ms/s | **−27,4 %** |
| style (`RecalcStyleDuration`) | 126,7 ms/s | 93,6 ms/s | −26,1 % |
| recálculos/s | 87,2 | 27,9 | **−68 %** |
| script | 22,6 ms/s | 26,1 ms/s | +3,5 ms/s (a comparação por frame) |
| escritas nas palavras/s | 71,9 | 19,0 | **−73,6 %** |
| trace 4 s: style na fila | 61,2 ms/s | 19,8 ms/s | −67,6 % |
| escritas por preenchimento (~8 s) | 720–722 | 179–180 | passo ≈ 1 px de dispositivo |
| atraso máximo da extremidade | 0 | 0,0042 (≈ 0,8 px de dispositivo) | sempre < 1 px |
| intervalo entre trocas | 9046 / 9052 ms | 9033 / 9041 ms | igual |

Em ambos os builds todos os recálculos em repouso vêm do mesmo sítio (`.v2-queue-word`, estilo inline);
os ~94 ms/s de style que restam na variante não são da fila. Preenchimento monótono e a chegar a 1 exacto
nos dois. **Equivalência funcional no telefone** (toque real e Enter por CDP, controlo vs variante): avanço
automático igual; toque na palavra que enche 641/634 ms, numa palavra em espera 635/631 ms, Enter 332/335
ms; categoria e ordem da fila iguais depois de cada toque; reduced motion (emulado por CDP) sem avanço
automático e com toque/Enter; 0 erros de consola.

**Pendente:** validação visual a olho da extremidade no Xiaomi (a suavidade está demonstrada por medição,
não vista), e iPhone / iOS Safari — nenhum dos dois testado.

**Estado:** aprovada pelo design owner a 15 Out 2026, com a condição `devicePixelRatio >= 2`; commit local
em `v3`, sem push nem deploy.

### AUD-004 · Em redes lentas a abertura estica e o vídeo engasga

- **Categoria:** performance / vídeo · **Estado:** CONFIRMADO EM EMULAÇÃO; rede móvel real NÃO MEDIDA
  · **Severidade:** P2 · **Esforço:** médio
- **Impacto:** num visitante com dados móveis fracos, preto e depois o título sozinho durante muito tempo.
  Quem faz scroll liberta o subtítulo (qualquer intenção abre o gate); quem espera não.
- **Condições:** Chrome, 390×844, CPU 4×, contexto frio, ninguém toca.
- **Evidência:**

  | Rede (emulada) | FCP | 1.º frame do vídeo | vídeo `waiting` | título → subtítulo | abertura `done` |
  |---|---|---|---|---|---|
  | Fast 4G | 1,6 s | 1,65 s | — | 0,74 s (normal) | 6,8 s |
  | Slow 4G | 4,0 s | 6,5 s | 6,3 s | **3,9 s** | **12,4 s** |
  | 3G | 7,2 s | 12,8 s | 9,5 s | **9,8 s** | **21,6 s** |

  **Cascata em Slow 4G** (FCP 3,3 s nessa passagem): as três placas (Venice 298 KB, studio 140 KB,
  method 173 KB — só necessárias a partir do estado 06) começam aos 313 ms com a mesma prioridade do JS
  (`Low`) e terminam aos 4,5–6,2 s; o último chunk de JS chega aos 3,1 s; o vídeo começa aos 1,5 s e,
  a 6 Mb/s, não consegue tocar num link de 1,6 Mb/s.

  **Comparação real — Xiaomi em Wi-Fi, produção:**

  | | sem cache (3 cargas) | cache quente (2 cargas) |
  |---|---|---|
  | TTFB | 62–86 ms | 74–79 ms |
  | FCP / LCP | 0,74–0,78 / 0,80–0,92 s | 0,61 / 0,63–0,79 s |
  | 1.º frame do vídeo | 0,72–0,86 s | 0,56–0,72 s |
  | Abertura `done` | 5,76–5,79 s | 5,63 s |
  | CLS | 0 | 0 |
  | Bytes na rede | 10,06 MB (vídeo 9,14 MB) | < 1 KB (vídeo: `206`, 45 B, da cache) |

  Tarefas longas na carga (telefone): uma de 189–225 ms e outra de 63–96 ms entre os 250 e os 480 ms,
  durante o preto da abertura.
- **Ficheiros:** `src/app/environment.tsx` (`preload="auto"`, os `<img>` das placas), gate do subtítulo
  em `src/app/opening.tsx` (`waitsForFootageAt`, `arrivesRegardlessAt` = 12 s).
- **Sugestão:** (a) adiar as placas para depois do primeiro conteúdo, garantindo-as antes do estado 06;
  (b) avaliar um encode móvel mais leve; (c) avaliar libertar o gate quando o vídeo está em `waiting`.
- **Risco:** médio — toca no arranque iOS (C37/C38 congelados: nunca fazer seek) e no reveal de Venice.
- **Validação:** redes emuladas, telefone real em dados móveis, iPhone.

### AUD-005 · O Work é invisível aos leitores de ecrã mas recebe foco do teclado

- **Categoria:** acessibilidade · **Estado:** CONFIRMADO · **Severidade:** P2 · **Esforço:** baixo–médio
- **Condições:** Chrome 1440×900, produção; árvore de acessibilidade do Chrome e DOM.
- **Evidência:** a secção `#studio` é uma região **vazia** com o nome "Wedding Experience" (rótulo que a
  C13 retirou como título). **Três controlos recebem foco dentro de um antepassado
  `aria-hidden="true"`**: os botões da fila "Artists" e "Selected Projects" e o link "See full
  experience" para a obra externa.
- **Impacto:** com leitor de ecrã o Work não existe; com teclado chega-se a controlos que não são
  anunciados.
- **Ficheiros:** `src/app/work-experiences.tsx`, `src/app/page.tsx` (`aria-label={site.three.work.title}`
  na secção), a camada `.v2` com `aria-hidden`.
- **Sugestão:** um equivalente acessível fora do `aria-hidden` (lista de categorias + link) e corrigir o
  rótulo da região. Sem impacto visual.
- **Validação:** árvore de acessibilidade, ordem de Tab, VoiceOver/TalkBack à mão.

### AUD-006 · Toque duplo no INDEX cai no link do telefone em Contact

- **Categoria:** navegação · **Estado:** CONFIRMADO; já conhecido e aceite no handoff ("Observed, left")
  · **Severidade:** P3 · **Esforço:** baixo
- **Condições:** Xiaomi real, Chrome 155, produção, toques por `synthesizeTapGesture`.
- **Evidência:** tocar "Contact" duas vezes no INDEX, com 120 ms de intervalo: o segundo toque é entregue
  ao link `tel:` (`contact-link:+351 910 000 000 [delivered]`), o que em uso real abre o marcador com o
  número placeholder. O handoff registava o efeito aos ~0,35 s; acontece também aos 120 ms.
- **Sugestão:** só se for reaberto — uma guarda curta (~400 ms) depois de uma navegação pelo INDEX.
  Toca na navegação (C40), congelada.

### AUD-007 · O vídeo descodifica onde ninguém o vê

- **Categoria:** performance / vídeo · **Estado:** CONFIRMADO · **Severidade:** P3 · **Esforço:** médio
- **Condições:** Xiaomi real, trace durante o scroll.
- **Evidência:** o descodificador corre em todas as zonas; a thread de media fica a 10–24 % em About,
  Method e Questions, onde a placa do hero é invisível (53 % em Contact, onde é visível). 0 frames
  perdidos; não está na main thread.
- **Impacto:** bateria e aquecimento, não engasgos.
- **Risco de uma correcção:** pausar e retomar toca nas regras iOS (C37) e no Mi Browser (a retoma pode
  ser recusada sem gesto).

### AUD-008 · A "respiração" do Contact ocupa 27,5 % da main thread em repouso

- **Categoria:** performance · **Estado:** CONFIRMADO · **Severidade:** P3
- **Evidência:** Xiaomi real, 275 ms/s, 91 layouts por segundo em repouso. A `@keyframes contact-breath`
  anima `--breath`, que conduz o `letter-spacing` da frase (`src/app/globals.css`), o que obriga a layout
  em cada frame.
- **Recomendação:** é design aprovado; registar e só revisitar se o design owner quiser.

### AUD-009 · Congelamentos isolados de 442–621 ms

- **Categoria:** performance · **Estado:** HIPÓTESE · **Severidade:** P3
- **Evidência:** vistos uma vez cada a 400 px/s no Xiaomi (Opening ↑ 621 ms; Work ↓ 442 ms). **Não se
  repetiram** em quatro repetições com trace (duas por zona), onde as tarefas mais longas foram 52–120 ms:
  um recálculo do documento inteiro (59–81 ms) e, por vezes, 42–63 ms de GC incremental no mesmo frame.
- **Sugestão:** só monitorizar.

---

## 4. Verificado e não é problema (produção)

- **Navegação:** nenhum reload (Chrome e WebKit, telefone e desktop: 1 carga por sessão; telefone real:
  mesmo documento do princípio ao fim, `history.length` 1, morada sem fragmento).
- **Erros e recursos:** 0 erros de consola, 0 pedidos falhados, 0 overflow horizontal nas oito viewports;
  CLS 0.
- **Cache:** em cache quente o vídeo custa 45 B na rede (`206` a partir da cache). O Resource Timing
  mostrava 9,1 MB e enganava — a primeira leitura foi corrigida pela medição ao nível da rede.
- **Cabeçalhos:** vídeo e placas `public, max-age=0, must-revalidate` com ETag (o servidor responde 304);
  `/_next/static/immutable/` com `max-age=31536000, immutable`.
- **Vídeo:** o índice (`moov`) está no início do ficheiro (byte 20) — formato *faststart*.
- **`--haste`:** resolvido (C33); não aparece em nenhuma escrita.
- **Estados sob stress:** percursos "sujos" — flicks com inversões, toques no INDEX a meio de transições —
  acabam no mesmo estado de uma chegada directa à mesma posição, depois de terminados os relógios
  (1440×900: 8/8; 390×844: 7/8 — o restante terminou com o INDEX aberto porque o próprio teste o abriu a
  meio de um flick e o clique no destino falhou; é um estado modal coerente). Uma primeira leitura de
  diferenças em Questions/Contact era relógios ainda a correr; verificado aos 6 s.
- **INDEX rápido:** cinco destinos a 150 ms — vale o último, INDEX fechado, nada `inert`, a roda continua
  a mover a página.
- **Topo:** voltar ao topo dá o estado 1 com a abertura `done`; a abertura não se repete (por desenho).
- **Segundo plano, telefone real:** 30 s fora do Chrome a meio do carrossel e no About — ao voltar, vídeo
  a correr, `swapping` não preso, rail e estado coerentes, `.publication` sem `inert`. Contact: o vídeo
  continua a tocar em repouso, depois do toque, depois de sair do Chrome e voltar, e depois de tocar
  fora.
- **Contact por tipo de mão (desktop):** rato — hover desacelera até pausa, sair retoma; teclado — o foco
  pausa; toque e híbrido — o vídeo toca sempre. Como aprovado (C36/C37).
- **Foco:** `menu-focus` 0 problemas em Chrome e WebKit, 1440 e 390.
- **Reduced motion:** abertura em 3,3 s (contra 5,5 s), página até Contact, 0 erros.
- **About a 375 px:** a chegada pelo INDEX deixa `film-state 9` com `junction-at 1.000`, que é o próprio
  ponto de chegada; o About está composto (headline a opacidade 1, rail "02 About").
- **Links:** obra externa, WhatsApp e Telegram respondem 200.

**Fora do âmbito / conhecido:** autoplay intermitente no Mi Browser (preexistente, não prioritário);
placeholders comerciais (telefone, Instagram, propriedade de `chapterone.com`); versão sem JavaScript
(defeito registado na auditoria de `fbb4a5d`, anterior à `v2`, **não re-testado** nesta auditoria).

---

## 5. Limitações

- **iOS Safari: NÃO MEDIDO** — nenhum iPhone alcançável a partir desta máquina. WebKit do Playwright em
  Windows não é Safari.
- **Rede móvel real: NÃO MEDIDA** — só emulação no Chrome desktop.
- **Scroll no telefone:** só Chrome. Firefox e Mi Browser não foram medidos em fluidez.
- **Gestos:** sintéticos por CDP (pipeline de toque do aparelho), não um dedo.
- **GPU real:** só a fracção de tempo das threads GPU/Viz no trace; não há medição de frames da GPU.
- **Um único telefone** (Xiaomi Mi 11 Lite).
- **Overhead do trace** — as medições com trace têm algum custo próprio; as comparações são feitas sempre
  nas mesmas condições.

---

## 6. Backlog priorizado

| # | Grupo | Item | Prioridade | Benefício | Esforço | Risco | Dependências |
|---|---|---|---|---|---|---|---|
| 1 | Bugs | AUD-005 acessibilidade do Work | P2 | o Work passa a existir para leitores de ecrã | baixo–médio | baixo | — |
| 2 | Performance mensurável | AUD-003 carrossel só escreve o que muda | P2 | menos CPU em repouso no Work | baixo | baixo | C14 inalterado |
| 3 | Performance mensurável | AUD-002 linhas de Questions escrevem nos próprios elementos | P2 | pior zona (27 fps) | médio | médio | depois de #2; mesmo método de medição |
| 4 | Performance mensurável | AUD-001 Fase 3: localizar as escritas do Environment e do rail | P1 | +4–10 fps estimados (variante C), menos picos de 65–70 ms | alto | alto | harness de comparação por posição; validação do design owner nas zonas congeladas |
| 5 | Carga | AUD-004 adiar placas; avaliar encode móvel e o gate | P2 | primeiro conteúdo e subtítulo mais cedo em dados móveis | médio | médio | regras iOS C37/C38 |
| 6 | Navegação | AUD-006 guarda contra toque duplo | P3 | evita abrir o marcador por engano | baixo | baixo–médio | decisão do design owner (C40) |
| 7 | Técnico | AUD-007 pausar o vídeo fora do hero | P3 | bateria | médio | médio | iOS e Mi Browser |
| 8 | Especulativo | AUD-008 respiração; AUD-009 monitorização | P3 | bateria / investigação | — | — | design aprovado |

**Ordem decidida para a `v3`** (design owner, 14 Out): AUD-003 → AUD-002 → AUD-001 propriedade a
propriedade, uma intervenção de cada vez, cada uma medida antes e depois no mesmo dispositivo, browser,
viewport e condições. Não se avança para a seguinte se a anterior não demonstrar melhoria ou tiver
regressões.

## 7. Plano de validação

1. **Correcções isoladas primeiro** (AUD-003, AUD-005): uma worktree/diff de cada vez; typecheck, lint,
   build, asserções do `timeline.ts`; `six-diff` com controlo de ruído; testes de Contact e do menu;
   telefone real em repouso e a percorrer a zona; árvore de acessibilidade.
2. **Optimizações sustentadas por medição** (AUD-002, depois AUD-001): mesma zona, mesmo gesto, mesmo
   aparelho, pelo menos duas passagens por braço, controlo medido no mesmo dia; em AUD-001, uma
   propriedade de cada vez, comparação dos valores computados em cada paragem e revisão visual de
   C27–C31/C38.
3. **Carga e vídeo** (AUD-004): redes emuladas, telefone real em dados móveis, iPhone.
4. **Refinamentos que pedem comparação visual** (AUD-006–008): só com decisão do design owner.

## 8. O que deve permanecer congelado

Navegação (C40), foco e vidro (C39/C41), coreografia da abertura (C28–C31, C38) e regras do arranque iOS
(C37), Questions (B, D-gate, *on a thumb*) e Contact como desenhados, o scroll engine, o `timeline.ts` e
as suas asserções, e `TIMING.work.queue` / C14. AUD-002 e AUD-001 podem ser feitos sem mudar nenhum
timing ou valor — só onde os valores são escritos.
