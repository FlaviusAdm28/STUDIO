# V5 — estratégia para o scroll do site inteiro (15/11/2026, aprovada pelo owner: começar pela fase 0)

O owner, depois de duas rondas a 15/11 (Chrome com bugs visuais no Weddings e no Contact → Questions; o Safari a recarregar a página):
"antes de mexermos em código precisamos de uma estratégia para corrigir o site todo, perceber o que está a acontecer, porque Chrome e
Safari estão com problemas diferentes e o que podemos fazer por ordem lógica". Esta é a estratégia. **Nenhuma correção de scroll se faz
fora dela.**

## Diagnóstico (15/11)

1. **O Safari rebenta por um defeito do WebKit que o site dispara.** `WebCore::ScrollAnimationMomentum::updateScrollExtents()` (SIGSEGV,
   endereço 0x40) ← `didAddScrollbar` ← um layout forçado (`scrollY`, `getClientRects`). Duas vezes, igual: 14/11 01:54 e 15/11 12:55
   (`~/Library/Logs/DiagnosticReports/com.apple.WebKit.WebContent-*.ips`). Gatilho: a raiz volta a ter barra de scroll (sai o
   `overflow: hidden`) com uma inércia de trackpad a correr — `holdFor` do Work, `:root[data-wheel-held]` (globals.css), o menu.
2. **Demasiados donos da posição da página, sem saberem uns dos outros.** 10 ficheiros de script com `scrollTo`/`overflow`/encaixe/
   `preventDefault` (o Work 1371 linhas, o Method 1100, o About 904, o Contact 487), 7 CSS a ligar e desligar o encaixe por estado, 15+
   marcas na raiz (`pass`, `passHold`, `passZone`, `wheelHeld`, `cOn`, `cHold`, `cRun`, `jump`, `menu`, `held`, `film`…), ~15 tempos fixos
   (`PASS_MS` 1600, `STORY_MS` 1600, `HOLD_MS` 1600, `ON_MS` 3000, `BACK_MS` 1200/800…). Ex.: o salto de *Chapter One* deixa o encaixe
   desligado 1,6 s (`unsnapped`) e isso desligava, sem ninguém saber, a proteção da passagem do Work (bug de 15/11).
3. **Os testes mediam onde a página assenta, não o que se vê.** Na ronda do owner de 15/11 12:51 as posições e estados estão certos e não
   há fotogramas > 50 ms, e mesmo assim há "lag e inconsistências" no Weddings: os bugs estão dentro das animações.

### Porque é que o Chrome e o Safari falham de formas diferentes

| | Chrome 157 | Safari 27.2 |
|---|---|---|
| Cancelar um gesto de trackpad | só o 1.º evento → o resto segurado com `overflow: hidden` | todos os eventos → `overflow` desnecessário |
| Ligar/desligar `overflow` na raiz | às vezes aplica um delta atrasado depois do `scrollTo` (0 → 121, 14/11) | rebenta (acima) |
| Encaixe depois de um gesto | escolhe pelo sentido do gesto (um arrasto de 100 px foi a Artists, 15/11) | mantém a página na marca por ordem; marcas a aparecer/desaparecer movem-na |
| Pontas da página | sem elástico | elástico: `scrollY` < 0 e > fim, lidos pelo site como scroll |

### Causas de fundo

| | Causa | Bugs que explica (lista do handoff) |
|---|---|---|
| R1 | vários sítios a decidir onde fica a página | 15/11 (13 px no Weddings), C, os 2 do Work de 14/11, gestos que saltam paragens |
| R2 | segurar a página com `overflow: hidden` | o crash do Safari; deltas atrasados do Chrome |
| R3 | o encaixe ligado e desligado por estado/CSS | B, C, saltos de marca do Safari, encaixe pelo sentido no Chrome |
| R4 | retenções de tempo fixo | A2, gestos "comidos", velocidades (Contact → Questions) |
| R5 | passagens montadas com cópias e trocas de elementos | D (arco que salta, fotografia que muda), G |

## As fases

**Fase 0 — Ver o que o owner vê (sem mexer no site).**
- Um varrimento automático da página inteira, ponta a ponta, no Chrome e no Safari reais (e no Xiaomi; o iPhone pelo owner):
  intensidades 60/120/300/800 px + as cadeias do owner; os dois sentidos; gestos isolados, em rajada, invertidos a meio de uma passagem;
  entradas por gesto, menu, *Chapter One*, teclado.
- Além da posição: **uma fita por fotograma do que está no ecrã** (caixas, opacidades e transformações dos elementos que contam: o arco, a
  fotografia que voa, o palco, as palavras, a barra; os ecrãs do Method; o retrato; a pergunta do Contact) + vídeo do ecrã. Um bug visual é
  um salto de um elemento num fotograma sem razão (a página parada ou a animar suave), uma mudança de imagem, uma velocidade fora do
  aprovado.
- Resultado: **o catálogo de bugs numerado** (`v5-scroll-catalogue.md`): browser, gatilho reprodutível, prova (fita, vídeo), causa
  provável. Inclui os do owner (A2, C, D, E, F, G, 15/11) e os que o varrimento encontrar.

**Fase 1 — Ligar cada bug a uma causa (R1–R5)** e confirmar ou corrigir o diagnóstico antes de qualquer obra.

**Fase 2 — Decisão do owner sobre a arquitetura.** Recomendação: **um único condutor do scroll** — uma lista ordenada de paragens para a
página inteira; uma forma de segurar por browser (cancelar eventos no Safari, nunca `overflow`); uma forma de saltar (menu, *Chapter One*,
endereços, capítulos); as secções deixam de mexer no scroll e só declaram as paragens e quando uma passagem toca. O comportamento aprovado
(um gesto, uma paragem; as passagens) mantém-se. Alternativa: continuar caso a caso (mais barato por passo; é o que nos trouxe aqui).

**Fase 3 — Obra, por ordem:**
1. o crash do Safari (o mais grave e isolado);
2. o condutor, com o catálogo a correr nos dois browsers;
3. migrar as secções uma a uma, de cima para baixo (entrada/Work → Method → About → Questions/Contact); depois de cada uma o catálogo
   inteiro passa no Chrome, Safari e Xiaomi antes da seguinte; cada bug corrigido fica como teste permanente;
4. os bugs visuais dentro das passagens (D, Contact → Questions, G, E) — independentes do scroll;
5. as decisões pendentes do owner (A2, velocidades); depois M8 e produção.

Custo/risco: o condutor mexe no núcleo; desempenho medido no Xiaomi; o iPhone pelo owner. As duas correções de 15/11 (`finger.ts`,
`work-client.tsx` + `unsnapped.ts`) ficam no disco, por commitar; o condutor absorve-as.

## Fase 1 — cada bug ligado à sua causa (15/11)

Prova: o catálogo (`v5-scroll-catalogue.md`, fitas e vídeos da fase 0) e o código. "Confirmada" = o mecanismo visto no código e nas fitas;
"provável" = falta uma sonda (lista no fim).

| # | Bug | Causa | O mecanismo | Certeza | Onde se corrige |
|---|---|---|---|---|---|
| 1 | Safari recarrega a página | **R2** | O WebKit rebenta quando a raiz volta a ter barra de scroll com uma inércia a correr. Quem tira e repõe o `overflow` no desktop: `holdFor` do Work (`work-client.tsx:1147`, `:1159`) e `:root[data-wheel-held]` do regulador (`globals.css:161`, `finger.ts:132`) | confirmada (3 relatórios iguais: 14/11 01:54, 15/11 12:55 e 14:49) | condutor: segurar sem `overflow` |
| 7 | Um gesto logo depois de um salto atravessa paragens (desktop até 4, iPhone 1) | **R3 + R1** | Cada salto do site (`address.ts:45`, `bar-client.tsx:125`, `method-stage.ts:1068`, `work-client.tsx:1292`) passa por `unsnapped()`, que desliga o encaixe 1,6–2,6 s (`unsnapped.ts:15`); o regulador, ao ver o encaixe desligado, larga o gesto (`finger.ts:93`, `stop = null`); no telemóvel não há nada que segure | confirmada | condutor: o salto é dele, as paragens nunca desligam |
| 14 | Android: gestos fortes passam paragens no Method/About/Contact | **R3** | As paragens confiam no `scroll-snap-stop: always` (`method.css:952`), que o Chrome do Android não respeita num arremesso; o Work aguenta porque a passagem segura a página; o regulador só existe no desktop (`finger.ts:162`, `fine()`) | confirmada (também medido a 11/11, `work-client.tsx:1132`) | condutor no toque (ver o risco abaixo) |
| 15 | Safari: Artists ↑ foi ao topo, saltando o Weddings | **R1** (o regulador) | Sonda A (15/11, `desk/probe-owners.js`): 32 passadas Artists ↑ (vindas de baixo e de cima), **0 falhas** — raro (1 em ~60). A fita da matriz já o explica: a página foi de 1368 a 0 com o regulador a segurar (`wheelHeld`) e **antes** de o Work tirar o `overflow` (o `holdFor(0)` só veio 18 ms depois). Quem a moveu foi o regulador: leu um 2.º gesto dentro do mesmo (a regra do "gesto novo" por subida brusca, `finger.ts:77`) e foi à paragem seguinte; o Work só reagiu ao topo | confirmada pela fita; o gatilho exato (a inércia do Safari a dar um salto) é raro | condutor: um gesto acaba por tempo sem eventos, não por subidas de magnitude dentro da inércia |
| 16 | End/Home: Chrome para no About 14, Safari anda uma paragem | **R3** | Ninguém trata End/Home: a tecla vai ao fim nativo e o `scroll-snap-stop: always` obriga-a a parar na primeira marca com paragem obrigatória (Safari) ou numa retenção pelo caminho (Chrome) | confirmada (sem código de teclas para End/Home: só `bar-client.tsx:324` e `work-client.tsx:686` os reconhecem, para outras coisas) | condutor: as teclas são dele (End = fim, Home = topo, PageDown = paragem seguinte) |
| 17 | Safari: a primeira PageDown/Espaço no Weddings perde-se | **R3** | A marca do Weddings está em 1,4 × H (`work-client.tsx:661`); com H = 977 dá 1367,8 px, a página assenta em 1367 e a tecla seguinte "encaixa" na mesma marca | confirmada | condutor: paragens em píxeis inteiros |
| 18 | Chrome: na volta ao topo o arco some ~0,6 s e reaparece a meio | **R5** | O voo é feito com duas cópias da fotografia (`work-client.tsx:800–818`), paradas a opacidade 0 desde a última passagem. Na fita a cópia está a 100 % desde o 1.º fotograma da volta, mas o Chrome só a pinta ~0,6 s depois. **Sonda B** (`desk/probe-paint.js`): com as cópias a 0,002 em vez de 0 e a imagem descodificada (`img.decode()`), o arco fica no ecrã a volta inteira, contínuo do palco à lâmina (`p1-B-chrome-21.95.png`) | **confirmada** | passagens: as cópias nunca a 0 (ou pintadas e descodificadas antes de voar) |
| 19 / 2 | Safari e iPhone: na volta o arco troca de fotografia num fotograma | **R5** | O palco mostra a **peça** (`w-dm > dm-pimg`, a contagem, 515 × 741, mais escura); a cópia que voa é a fotografia simples (484 × 724). A troca faz-se em ~25 ms, porque o palco se apaga nos primeiros 10 % da volta (os cartões entram a 0,9 do relógio: `work-client.tsx:865`) | confirmada (fita: o palco e a cópia lado a lado, 196 113 ms) | passagens: a volta parte do que está no ecrã (a peça apagada antes, ou a cópia igual ao palco) |
| 6 / 20 | Contact → Questions: o linho entra em 67–120 ms | **R4** (afinação) | Na volta, o troço entre a pergunta apagada e as Questions de volta corre a 3× (`contact-client.tsx:194`), pedido a 13/11 para cortar ~0,5 s de escuro vazio. 0,36 do relógio × 1200 ms ÷ 3 ≈ 144 ms | confirmada | **decisão de desenho do owner**: o papel a acender mais devagar, sobreposto ao escuro, em vez de rápido depois dele |
| 21 | Arrasto lento: para baixo fica, para cima vai ao topo | R1 | A passagem do Work arranca a 12 px (`NUDGE`, `work-client.tsx:1166`); para baixo o encaixe devolve o arrasto ao Weddings antes | confirmada | sem obra (owner: sem problema) |
| 22 | Safari: fotogramas de 59–75 ms nos saltos do menu e nas passagens do Method/About | ? (desempenho) | **Sonda C** (fita leve, sem elementos): **28 fotogramas > 50 ms** em 229 s — 5 em cada salto do menu (66–75 ms), 4 na passagem 11 → 12 (64 ms), 9 numa subida do Method (59 ms). Não é custo da fita | **real**; a causa por medir (perfil do Safari) | fase 3, depois do condutor (um salto do condutor pode não precisar de desligar/religar o encaixe, que obriga o Safari a recalcular) |
| 3, 4, 5 | (do owner, 14/11) | R1/R3 | Não reproduzidos depois das correções de 15/11 | — | ficam no catálogo como testes |

**O diagnóstico confirma-se.** Todos os bugs de posição (#1, #7, #14, #15, #16, #17) vêm de R1–R3: a posição tem muitos donos, o encaixe
liga e desliga, e a página é segurada com `overflow`. Os bugs visuais (#18, #19, #6) são das passagens (R4/R5) e independentes do
scroll. Um acerto ao diagnóstico de 15/11: o Contact → Questions (#6) não é um problema de scroll, é uma afinação de tempo que o owner
decide.

### Sondas (corridas a 15/11, fim da tarde — resultados na tabela)

- **A (#15):** Safari, Artists ↑ 20 vezes, com cada `scrollTo` e cada mudança de `overflow` registados com a pilha (quem chamou).
- **B (#18):** Chrome, a volta ao topo com a cópia descodificada (`img.decode()`) e mantida pintada (opacidade 0,001 em vez de 0) — se o
  arco deixar de sumir, a causa é essa.
- **C (#22):** Safari, os saltos do menu e as passagens do Method/About sem a fita, só com o contador de fotogramas.

## Fase 2 — a proposta para o owner decidir

**Recomendação: um único condutor do scroll** (`lib/conductor.ts`, um módulo; sem dependências novas).

1. **As paragens são uma lista só**, ordenada, para a página inteira. Cada secção declara as suas (o Work: topo, Weddings, Artists; o Method:
   7…11; etc.) e quando uma passagem toca. As secções deixam de chamar `scrollTo`, de mexer no `overflow` e de ligar ou desligar o encaixe.
2. **Um gesto, uma paragem** (o comportamento aprovado, README #110) aplicado pelo condutor em todos os aparelhos: trackpad e roda no
   desktop (o regulador de hoje, que passa a ser dele), teclas (PageDown/PageUp/Espaço/setas = paragem seguinte/anterior, End = fim,
   Home = topo) e toque.
3. **Segurar sem `overflow`** (acaba o crash #1): no Safari e no iPhone, cancelar os eventos (o Safari deixa cancelá-los todos); no Chrome
   do desktop, cancelar o 1.º evento e repor a posição a cada evento seguinte; o `overflow` só fica onde não há inércia a correr.
4. **Saltar sem desligar as paragens** (acaba o #7): o menu, *Chapter One*, os endereços e os capítulos pedem o salto ao condutor; ele vai
   direto à paragem, e o gesto seguinte, venha quando vier, anda uma paragem a partir dali.
5. **Paragens em píxeis inteiros** (#17).
6. **As passagens tocam quando o condutor chega à paragem delas**, e nunca movem a página (#15).

**O que fica igual:** o desenho aprovado — as paragens, as passagens, os tempos, o que se vê. Nenhuma palavra nem imagem muda.

**Riscos, ditos já:**
- **O toque no Android (#14)** é o ponto difícil: o Chrome do Android não deixa cancelar a inércia de um arremesso depois de o dedo sair.
  Opções: (a) parar a inércia com um `scrollTo` à paragem assim que ela a passa (pode ver-se um pequeno "travão"; medir no Xiaomi);
  (b) aceitar que um arremesso forte passe uma paragem no Android, como hoje. A decisão final vem da medição no Xiaomi.
- **O iPhone** já se porta bem com o encaixe nativo (34/34): o condutor no iPhone deve mexer o mínimo (só os saltos e as teclas), e o
  veredicto é do owner no aparelho.
- **Trabalho:** mexe no núcleo das quatro secções. Faz-se uma secção de cada vez, de cima para baixo, e o catálogo inteiro (as 16 corridas
  da fase 0 + Xiaomi + Simulador) passa antes de seguir para a seguinte. Cada bug corrigido fica como teste.

**Alternativa:** continuar caso a caso (mais barato em cada passo, mas é o que nos trouxe aos 22 bugs: cada correção abre outra noutro
dono).

**À parte do condutor** (fase 3, passo 4): as passagens com cópias (#18, #19) e a decisão sobre o Contact → Questions (#6).

**Decisões pedidas ao owner:** (1) o condutor, sim ou não; (2) no Android, (a) ou (b) acima, ou medir primeiro; (3) o #6: o papel das
Questions a acender mais devagar e sobreposto ao escuro?

## Estado

- 15/11: estratégia guardada; **fase 0 em curso** (ver o handoff).
- 15/11 14:10: a matriz do desktop corrida (Chrome e Safari, M1–M8) e revista: `v5-scroll-catalogue.md` § "Encontrados pela matriz" (#15–#22). Falta: o Xiaomi, o #7 com um gesto < 1,6 s depois do menu, o #21 fora do Weddings, as respostas do owner (#21).
- 15/11 (tarde): fase 0 fechada (desktop, Xiaomi, Simulador do iPhone). **Fase 1 feita** (acima): o diagnóstico confirma-se; falta correr as sondas A–C. **Fase 2: à espera das três decisões do owner.**
- 15/11 (fim da tarde): **decisões do owner** — (1) **o condutor: sim**; (2) Android (#14): pergunta "deixamos estar?" — recomendação: construir o condutor com o caminho do toque no Android separado, ficar com (b) (como hoje) até medir; medir (a) no Xiaomi na migração e decidir pelo vídeo, sem atrasar o resto; (3) **#6: sim** — o papel das Questions acende mais devagar e por cima do escuro (fase 3, passo 4; tempos a propor e aprovar).
- 15/11 (fim da tarde): sondas A–C corridas: #15 confirmado pela fita (o regulador, raro), #18 confirmado (cópias não pintadas no Chrome), #22 real (não é a fita). **Fase 1 fechada. Próximo: fase 3, passo 1 — o crash do Safari (segurar sem `overflow`), como primeira peça do condutor.**
- 15/11 (noite): **fase 3, passo 1 feito, por aprovar** — `lib/hold.ts`: a página segurada num só sítio e largada só com a roda parada (o gatilho do crash). A via "só eventos, sem overflow" foi medida e desfeita (o Safari não deixa cancelar o resto de um gesto cujo 1.º evento passou): fica para o condutor, que terá de mover a página ele próprio desde o 1.º evento (passo 2). Novo: #23 (Android).
- 15/11 (noite): o owner usou o Safari com o passo 1 (largar só com a roda parada) — **não rebentou**. Viu outros bugs, para os passos seguintes. Próximo: passo 2, o condutor.
