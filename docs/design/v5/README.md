# Chapter One V5 — fonte de autoridade do design

*Atualizado a 25 de outubro de 2026 (decisões #19–#40 com o owner; storyboard v3.1: https://claude.ai/artifact/9vkDx379vuwuiaXre62cxz). Worktree `D:\STUDIO-v5`, branch `v5`, base `fe1bd33`.*
*Para retomar o trabalho, ler primeiro `docs/development/v5-handoff.md` (secção **COMEÇAR AQUI**).*
*O desenho completo aprovado está em **`storyboard.md`** (estado a estado, com o texto) e no storyboard visual
https://claude.ai/artifact/9vkDx379vuwuiaXre62cxz.*

## Ordem de autoridade

1. **`docs/brand/01-vision.md` … `04-visual-language.md`** — a marca. Bloqueados.
2. **Este `README.md`, `storyboard.md` e `direction.md`** — o design V5. Prevalecem sobre tudo o resto em `docs/`.
3. **`pages.md`, `interactions.md`, `assets.md`, `acceptance.md`, `roadmap.md`, `prompts.md`** —
   especificação de trabalho. Seguem `direction.md`; conflitos registam-se em §Decisões abertas.
4. **`history.md`** — o que foi tentado e rejeitado na V5 e porquê (M1 papel, M1 "secretária").
5. **`research/`** — investigação e evidência (V4 fases 1–2, folhas de contacto, referências). Contexto,
   não autoridade.
6. **Histórico V1–V4** — `docs/design/v2/`, `docs/design/archive/`, `docs/development/02-*`, `03-*`,
   `SESSION-HANDOFF.md`, `prototypes/`. Só valem se uma decisão for expressamente recuperada.

## A direção, numa frase

**"First Page"** — uma galeria calma e escura em tons de pedra e linho, onde a entrada é uma
experiência pessoal (a data e a hora de quem chega, o vídeo visto *através das letras* de CHAPTER ONE)
e o Work mostra, num só palco e por camadas, o que se pode contratar em Weddings, Artists e
Experiences. Inspirada em Cartier, Belgrade Arbor, Sobha e Brandon Yasin — **não** é uma evolução do
site original (V1–V4). Detalhe em `direction.md`.

## Decisões aprovadas pelo design owner

| # | Decisão | Quando |
|---|---|---|
| 1 | V5 independente na worktree `D:\STUDIO-v5`; **a V4 fica intocada**; **sem commits/pushes/deploys** sem pedido explícito | M0 |
| 2 | Tipografia **A: Cormorant Garamond + Schibsted Grotesk** | revisão M1 |
| 3 | **Direção nova "First Page"**, inspirada nas quatro referências e **diferente do site original** (o original foi o primeiro conceito, não é base) | sessão final 24/10 |
| 4 | Atmosfera de **calma e segurança artística**; o fundo **pode ser escuro**. Paleta **carvão `#1E1D1A` · musgo `#2C332D` · linho `#EEE8DD` · pedra `#D8D0C2`** — aprovada | 24/10 |
| 5 | **A entrada é o mais importante**: data/hora pessoal, título muito evidente e estético, animação artística logo à chegada, fora do padrão, **sem bloquear** | 24/10 |
| 6 | Entrada **"Através das letras"**: o vídeo do site original visto por dentro das letras de CHAPTER ONE → a câmara entra pelo O → vídeo em ecrã inteiro → três lâminas oblíquas (Weddings, Artists, Experiences). Aprovado ("parece bem") | 24/10 |
| 7 | **Usar o vídeo do site original** (`hero_demo4`), recodificado: 1920×960 MP4 2,1 MB (desktop) e recorte vertical 720×1280 MP4 0,95 MB (mobile). Avaliação aprovada ("boa") | 24/10 |
| 8 | **Uma só página**: Entrada → Work → Method → About → Questions → Contact. **Sem páginas por capítulo** (`/weddings`, `/artists`, `/experiences` deixam de existir) | 24/10 |
| 9 | **Work uniforme**: três capítulos no mesmo palco, mesma estrutura, três momentos cada, por camadas animadas (como nas referências) | 24/10 |
| 10 | Weddings usa **fotografias reais a P&B** da pasta Solteiros: **002 (Before) · 154 (On the day) · 343 (After)** — aprovado ("ok") | 24/10 |
| 11 | Artists e Experiences usam **imagens geradas por IA** pelo owner (já entregues, 6 + 1 opcional) | 24/10 |
| 12 | **Method: três opções** ("Papel vegetal", "Cartas iguais", "Composto à tua volta") construídas como **componentes isolados, lado a lado**, para o owner decidir. Guardar as três. **Substituída pela #30 (25/10)** | 24/10 |
| 13 | **About**: aprovado (quem sou, dedicação; retrato 124) | 24/10 |
| 14 | **Navegação no estilo da V4** (secção atual numerada + menu de ecrã inteiro em serifa), melhorada — aprovada ("perfeito") | 24/10 |
| 15 | **Desempenho**: alvo mínimo **Xiaomi Mi 11 Lite sem lag**; nada pesado; animação só por gesto ou na entrada; medir no telemóvel | 24/10 |
| 16 | Contacto: **Instagram** (perfil verificado; `ig.me` por verificar) | M0 |
| 17 | Direitos das fotografias de casamento: o owner **confirmou** autorização comercial (sem documentos vistos pelo agente) | M0 |
| 18 | `bespoke`/`unforgettable` não são proibidas por princípio; avaliar no contexto | M0 |
| 19 | **Direitos do vídeo** `hero_demo*`: confirmados — o vídeo foi feito pelo owner | 25/10 |
| 20 | **Subtítulo** sob CHAPTER ONE: *Digital experiences built for moments worth remembering.* (a tagline do original fica de fora) | 25/10 |
| 21 | **Numeração**: a Entrada fica fora → `01 Work · 02 Method · 03 About · 04 Questions · 05 Contact` | 25/10 |
| 22 | **Entrada**: entra-se pelo O (vídeo em ecrã inteiro) e o título **reaparece centrado, mais pequeno, em letra sólida** sobre o vídeo, com o subtítulo; as **três lâminas** ficam como a oferta; a **navegação aparece com o estado final** (sem JS, sempre visível) | 25/10 |
| 23 | **Chamada para a ação: "Talk to us"** (substitui *Start a project*, que soa a processo/formulário). Leva ao Instagram para falar com a pessoa. Canal: só Instagram (não foi pedido email) | 25/10 |
| 24 | **Passagens ligadas ao scroll e cenas presas são permitidas** (revê a regra "nada ligado ao scroll"). O limite é o **lag medido** no Xiaomi, não a técnica; o **fator WOW é prioridade** — as regras de `interactions.md` §0 são um mínimo contra o lag, não um teto | 25/10 |
| 25 | **O caminho** cena a cena e as passagens (`interactions.md` §0): Entrada → Work "página a virar"; Work → Method "a luz entra"; Method → About retrato que ganha cor; About → Questions sem passagem; Questions → Contact pergunta grande presa | 25/10 |
| 26 | **Work: o scroll muda os capítulos** (palco preso, I Weddings → II Artists → III Experiences; Weddings primeiro, é o público principal), **o toque muda os momentos**; separadores I · II · III sempre visíveis | 25/10 |
| 27 | **Momentos em rotação automática** (~7 s, a afinar) com a palavra do momento a **encher-se de cor** (como no original); tocar num momento pára a rotação; pausa com rato/foco; sem rotação em reduced motion | 25/10 |
| 28 | **O desenho da peça sempre visível**, pequeno, ao lado da fotografia — **sem botão**; o rato amplia-o, um toque amplia/fecha no telemóvel, foco + Enter no teclado. **Fundo por capítulo**, sempre escuro: I escuro quente · II ocre escuro · III azul-noite (fecha a aberta #9) | 25/10 |
| 29 | *No templates. No copies.* tem de ficar na memória de quem visita. Proposta aceite em princípio: **três sítios** — passagem Work → Method (grande), Method (demonstrada), rodapé junto ao Talk to us. Confirmar no storyboard | 25/10 |
| 30 | **Method "Feito para quem chega"** (substitui a #12): templates iguais em papel vegetal transformam-se em **peças únicas compostas com o momento do visitante** — dia, hora, luz da hora, se já cá esteve (as quatro aprovadas) — e juntam-se na **capa do capítulo dele**; nome opcional. Quer-se o **momento mais WOW do site**. Pormenores em aberto (#6 abaixo) | 25/10 |
| 31 | Campo do nome: **"Make it yours"** (posição revista pela #36). Com nome, as peças e as frases usam-no (*Built around Ana.*) e o Contact também (*Talk to us, Ana.*); nada é enviado nem guardado | 25/10 |
| 32 | **Storyboard v3 aprovado como conceito** ("adoro este conceito"): Entrada → Work → Method numa só animação contínua, sem quadros vazios — cada passagem leva um elemento da cena anterior. Referência visual: https://claude.ai/artifact/9vkDx379vuwuiaXre62cxz | 25/10 |
| 33 | **Entrada → Work**: a moldura do vídeo **encolhe até à moldura em arco do palco** e dissolve-se na primeira fotografia de Weddings (substitui a "página a virar" da #25) | 25/10 |
| 34 | **Céu da hora** (só na entrada, como tinta, e no Method, como fundo inteiro): gradiente suave de várias cores, à maneira da app de meteorologia do iOS, **em tons de estúdio** — pouca saturação, pedra/pó/névoa, grão fino; nada sólido nem berrante. Imagens leves pré-preparadas, mexidas só com transform/opacity | 25/10 |
| 35 | **Method — ecrãs de experiências web vivas** (substitui as peças "impressas" da #30): os templates são ecrãs de site iguais; as peças únicas são **Wedding website · RSVP · Portfolio · Digital exhibition · Event website · On-site guide**, com fotografias, movimento e o momento de quem chega. **6 no desktop, 3 no telemóvel** (Wedding website, Digital exhibition, On-site guide). Só o ecrã em destaque mexe por dentro | 25/10 |
| 36 | **Make it yours logo no início**, por baixo de *No templates. No copies.*, na ponte Work → Method; tudo o que vem depois já usa o nome | 25/10 |
| 37 | **Ponte Work → Method**: o desenho da peça que está à vista no fim do Work **multiplica-se nos ecrãs-template** enquanto sobe o céu da hora | 25/10 |
| 38 | **Telemóvel sem moldura de telemóvel**: no telemóvel os ecrãs são cartões sem bezel; o ecrã em destaque **abre-se até ocupar o ecrã inteiro**. No desktop a moldura fica | 25/10 |
| 39 | **Final do Method em luz**: os ecrãs apagam-se em pontos de luz no céu, a sala escurece um pouco (leva ao musgo do About) e fica **uma só frase**: ***Made once, for one moment.*** — com nome: *Made once, for one moment, Ana's.* Os quatro passos numa linha pequena + **Talk to us**. *No templates. No copies.* **não se repete** no fim do Method (revê a #29 §3) | 25/10 |
| 40 | **Work — atmosfera de cor da própria fotografia** à volta dela (à maneira do iOS), sobre fundos calmos — em vez de fundos de cor sólida por capítulo (revê a #28). As P&B de Weddings recebem uma aura quente. Aura = a imagem minúscula e desfocada, pré-gerada, esticada e com máscara; troca por opacidade. **Aprovada no tom da v3.2** (mais pequena, menos saturada, desvanece mais cedo) | 25/10 |
| 41 | **"O feito e o seu desenho" passa a ser: a fotografia torna-se o site** (substitui o desenho separado das #27–#28). Hover (desktop) / toque (telemóvel) / foco + Enter: a fotografia recolhe-se (clip-path) para o herói de um ecrã desenhado à volta dela — navegação, título com a data de quem visita, botão — com a peça sublinhada na lista. Indicação discreta *Hover / Tap the photograph*. No fim de Experiences acontece sozinho e esse site desenhado é a ponte para o Method (revê a #37). **Recusada pelo owner a 25/10**: corta a imagem sem sentido e duplica informação; o hover tem de mostrar algo com propósito e WOW — em exploração (aberta #14) | 25/10 |
| 42 | **Work — "cada peça mostra o que faz"** (ideia aprovada pelo owner; substitui a #41): o hover (desktop) / toque (telemóvel) / foco + Enter passa para **os nomes das peças** e faz uma demonstração da função da peça **sobre a fotografia inteira, sem a cortar** — Save-the-date: a data enorme; Wedding website: a foto sobe como página e aparecem as secções; Digital invitation: o convite abre-se; RSVP: responde-se; On-site guide: o programa com a hora de quem visita. **Descoberta**: círculo visível antes de cada peça + *Hover / Tap a piece to see what it does* + a primeira peça de cada momento mostra-se sozinha uma vez. No telemóvel **toque no nome**, não *segurar* (não se adivinha e choca com o scroll da cena presa). A ponte para o Method parte do *On-site guide*. Demonstração no storyboard v3.3 — **por confirmar** | 25/10 |
| 43 | **Work simplificado — "cada momento mostra a sua peça"** (substitui a #42 a pedido do owner: "não quero complicar"): **o scroll muda o capítulo, o tempo muda o momento, e cada momento mostra sozinho uma peça a funcionar** sobre a fotografia inteira, sem a cortar — sem hover, sem botão, nada para descobrir. Uma peça por momento, nove: Weddings *Wedding website · Live photo gallery · One year on*; Artists *Portfolio · Digital exhibition · Archive of works*; Experiences *Invitation & RSVP · On-site guide · Thank-you page*. As outras peças ficam escritas na lista; a mostrada leva um círculo. Ritmo de partida: foto ~1,6 s + peça ~3,6 s. Tocar num momento fixa-o. Storyboard v3.4 — **fechado pelo owner a 25/10** | 25/10 |
| 44 | **Entrada → Work, aterragem**: com scroll aterra-se **sempre em I Weddings**; um clique numa lâmina (Artists ou Experiences) aterra **nesse capítulo** do Work, com esse capítulo ativo. A escolha fica guardada em memória da página (para a #45) | 25/10 |
| 45 | **Method — o capítulo escolhido na entrada volta no Method**: o ecrã em destaque (desktop) e o ecrã que abre a ecrã inteiro (telemóvel, #38) são do capítulo de quem visita — Weddings → Wedding website, Artists → Digital exhibition, Experiences → On-site guide. Sem escolha (só scroll) → Weddings | 25/10 |
| 46 | **A Entrada e o Work estão fechados** (owner, 25/10): #22, #33, #40, #43 e #44 são o desenho a implementar | 25/10 |
| 47 | **Fundo do Method = estúdio** (opção C; revê o "céu" da #34 no Method): o papel de fundo de um estúdio de fotografia — parede que curva até ao chão, **luz com direção dada pela hora** (manhã fria pela esquerda · dia alta e neutra · fim de tarde quente e rasante pela direita · noite escura com um candeeiro), vinheta, grão de papel, e **sombras suaves dos ecrãs no chão**. No site: uma imagem pré-preparada por hora (~40–60 KB) + uma sombra pequena por ecrã; nada recalculado ao vivo. A entrada mantém a tinta da hora sobre o vídeo | 25/10 |
| 48 | **Fim do Method = a luz do estúdio baixa** (revê os pontos de luz da #39): a sala escurece, **no desktop, os ecrãs da capa afastam-se para os lados e ficam, discretos (~60 %), a deixar o centro livre para o texto; no telemóvel saem por completo** (não há espaço) e fica **uma luz calma e redonda**, medida pela largura do ecrã para não esticar no telemóvel, sobre *Made once, for one moment.* (+ *For Ana.*), os quatro passos numa linha e **Talk to us**; leva ao escuro do About. Só opacidade | 25/10 |
| 49 | **O Method está fechado e aprovado, incluindo o fim revisto da #48** (owner, 25/10: "é isso, aprovado"): #30, #35–#39, #45, #47, #48 e o efeito do nome (o nome igual em todos os templates, depois cada ecrã composto à volta dele; capa com o nome como título; *For Ana.* no fim). Referência: storyboard v3.6, https://claude.ai/artifact/9vkDx379vuwuiaXre62cxz | 25/10 |
| 50 | **About — o retrato fica a P&B e a cor revela-se por gesto** (owner, 25/10; revê a cor "por scroll" da #25): hover no desktop, **segurar** no telemóvel (aqui funciona: o About não fica preso), foco + Enter no teclado; ao largar **volta sempre ao P&B**. Uma só fotografia (P&B derivado da 124 a cores). Indicação discreta no crédito: *Hover / Hold for colour*. **Sem** a imagem IA do espaço de trabalho (nem como fundo) | 25/10 |
| 51 | **Voz: *we* na marca, *I* só no About** (owner, 25/10): o Chapter One fala em *we* em todo o site; o About é o Flávio a falar (*I'm Flávio.*) | 25/10 |
| 52 | **O About está fechado e aprovado** (owner, 25/10: "perfeito, aprovo") — storyboard v5 (https://claude.ai/artifact/5G8FJpVYRoHxo88AQRzx59): transição B (a luz fica no centro, o retrato aparece nela com *I'm Flávio.*, o nome é um só elemento que sobe a título por `transform`, a frase entra depois), fundo com a atmosfera da fotografia (cor devagar, ~2 s), retrato P&B com cor por hover/segurar, grelha editorial no desktop, texto v4, voz *I* (#51), sem imagem IA | 25/10 |
| 53 | **As Questions estão fechadas e aprovadas** (owner, 25/10): as luzes do estúdio acendem-se — **fundo na pedra da marca feita estúdio** (curva do papel, luz com direção, vinheta, grão); pergunta-âncora sempre visível como título, **sem rótulo "Questions" por cima** (a navegação já diz onde se está), com os três capítulos a levar ao Work (no desktop em lista com setas; **no telemóvel numa só linha de texto, *Weddings | Artists | Experiences*, separados por barras verticais finas** (sem filetes nem sublinhados, sem numerais no telemóvel), para dar espaço às perguntas; **a primeira pergunta não tem filete por cima** (desktop e telemóvel); **as ligações *Weddings / Artists / Experiences* sobem ao Work e abrem esse capítulo** (a mesma regra das lâminas, #44: scroll suave até à posição do capítulo; salto direto em reduced motion; âncoras sem JavaScript) — aprovado pelo owner; mesmas proporções: pergunta ≈ 0,42 × título); **oito perguntas** numeradas, uma resposta aberta de cada vez; respostas do storyboard v2 (https://claude.ai/artifact/K7YyGSYHnk8gUZDJxdNZJ5) com o preço como **ponto de partida, não tabela** (*starts from €50* para uma peça única — decisão do owner, alertado para o risco). Já no storyboard principal (estados 15–18) | 25/10 |
| 54 | **Contactos** (owner, 25/10; revê a #23): **Talk to us → Instagram** (ação principal; o owner testa o `ig.me`); no colofão **Instagram @chapterone.studio.pt** e **Telegram @flavius28**; **TikTok quando existir**; email só quando o owner der um endereço (não inventar). O vídeo escuro no Contact e *Built around you.* (*Built around Ana.*, numa só linha no telemóvel) **aprovados** | 25/10 |
| 55 | **O Contact está fechado e aprovado** (owner, 25/10): a luz baixa e o vídeo da entrada muito escuro; a pergunta aprovada presa um instante; **a linha da hora** (*You arrived at 21:14. It's 21:31 now — a good moment to tell us about it.*) aprovada; **Talk to us → Instagram**; colofão com *Built around you.*, índice e contactos (#54). ***Back to the first page ↑* saiu** — o índice já leva a qualquer secção. **Todas as secções da página estão desenhadas e aprovadas**; referência: storyboard principal, estados 1–21 (https://claude.ai/artifact/9vkDx379vuwuiaXre62cxz) | 25/10 |
| 56 | **Navegação fechada** (owner, 25/10; revê a #14 e `pages.md` §0): **a mesma barra e o mesmo menu em todos os ecrãs** (sem índice lateral no desktop) — barra sempre visível: secção atual à esquerda; à direita, no desktop, a hora + *Talk to us* + **Menu**, no telemóvel só **Menu**; em baixo de cada secção, a seguinte (*04 Questions ↓*). O menu abre-se **a partir do botão como uma gota** (clip-path circular, ~0,9 s) e é de **vidro preparado** (a secção por trás numa imagem já desfocada + película + brilho de aresta + grão; **sem `backdrop-filter`**); cinco secções numeradas em Cormorant (a atual em itálico com ponto), *Hello, Ana.* com nome, *Talk to us* → Instagram, contactos, a hora. `<dialog>`, foco preso/devolvido, Esc; reduced motion: fade. Referência: https://claude.ai/artifact/8RUxXgEmC4qsWfHT89R7dS (também no fim do storyboard principal) | 25/10 |
| 57 | **Revisão final do storyboard principal** (owner pediu, 25/10): acrescentada a **sequência da entrada** (E1–E4) que faltava; **a barra com ≡ Menu em todos os estados**; corrigidos a capa do Method (colisão de classes), o ecrã que tapava *Make it yours* e o ecrã inteiro por baixo da barra no telemóvel, e os separadores do Work abaixo da barra. **Correção de especificação:** a câmara entra pelo **traço** do O (zoom pelo centro daria ecrã escuro). Especificação completa em `storyboard.md` | 25/10 |
| 58 | **Entrada corrigida** (owner, 25/10: "parece bugado, não parece que a câmara entra"; "a hora aparece muito em cima"): **o vídeo fica parado e o véu com as letras recortadas é que avança** (escala no véu, origem no traço do O), com um ligeiro avanço da imagem; a dedicatória logo acima do título. **A barra alinhada pela linha da etiqueta da secção** em cada ecrã (estava desalinhada no telemóvel) | 25/10 |

## Decisões abertas

*Revistas a 25/10, no fim do dia. Quase tudo ficou fechado com o storyboard (#19–#57); as fechadas ficam riscadas
para se ver o percurso. **Nota:** a 25/10 uma edição automática cortou o fim deste ficheiro (itens 14–19 e o mapa
dos documentos); foram reconstruídos aqui com o estado final de cada um.*

1. ~~Direitos do vídeo~~ — **fechada** (#19).
2. ~~Texto da entrada~~ — **fechada**: subtítulo (#20); dedicatória *Weekday, D Month · HH:MM* / *Welcome back · …* (storyboard, #57).
3. **Linhas descritivas de cada peça do Work** — o agente redige, o owner aprova (antes do M5).
4. ~~Momentos e peças de Artists e Experiences~~ — **fechada** com o Work (#43, #46; tabela em `storyboard.md`).
5. ~~Texto do About~~ — **fechada** (#52).
6. ~~Palavras dos ecrãs do Method~~ — **fechada** com o Method (#49; texto no storyboard; ajustes finos no M6).
7. **`ig.me/m/chapterone.studio.pt`** — o owner testa no telemóvel; até lá, *Talk to us* leva ao perfil.
8. **Organização dos ficheiros e derivados** — autorizada (M2), **por fazer** (`assets.md` §5 e §7).
9. ~~Cor do capítulo Weddings~~ — **fechada** (#28, depois #40).
10. ~~Fundos do About e das Questions~~ — **fechada** (#52, #53).
11. ~~Email~~ — **fechada** (#54): só quando o owner der um endereço.
12. ~~"No templates. No copies." no rodapé~~ — **fechada** (#54): o colofão assina *Built around you.*
13. **Ritmo e escalas finas** (rotação dos momentos ~1,6 + 3,6 s, alturas presas, escalas) — afinar no protótipo e no Xiaomi.
14. ~~O hover / desenho do Work~~ — **fechada** (#43: cada momento mostra a sua peça).
15. ~~Aura de cor no Work~~ — **fechada** (#40).
16. ~~154 ou 157~~ — **fechada**: 154 (P&B).
17. ~~Fotografia do ecrã de casamento no Method~~ — **fechada**: Solteiros 299 (#49).
18. ~~Method com nome~~ — **fechada** (#49).
19. ~~Fundo e fim do Method~~ — **fechada** (#47, #48).
20. ~~About~~ — **fechada** (#52).
21. ~~Questions~~ — **fechada** (#53).
22. ~~Contact~~ — **fechada** (#55).
23. ~~Menu~~ — **fechada** (#56).
24. **TikTok** — entra no colofão quando existir (#54).

## Mapa dos documentos

| Documento | Conteúdo |
|---|---|
| **`storyboard.md`** | **O percurso completo aprovado (25/10): entrada E1–E4, estados 1–21, menu; técnica de cada estado; todo o texto aprovado** |
| `direction.md` | Conceito "First Page", atmosfera, paleta, tipografia, referências e o que se leva de cada |
| `pages.md` | Estrutura da página única e componentes (o desenho de cada secção: `storyboard.md`) |
| `interactions.md` | Regras de movimento (§0) e técnica de cada parte, acessibilidade, reduced motion |
| `assets.md` | Vídeo, fotografias, imagens IA, derivados (§7: o que o desenho aprovado pede), pastas, direitos |
| `prompts.md` | Prompts para o ChatGPT (gerar ou regenerar imagens) |
| `acceptance.md` | Orçamentos de desempenho, o que medir no Xiaomi e por que ordem, critérios de aceitação |
| `roadmap.md` | Marcos de implementação (M2–M8) para o desenho aprovado |
| `history.md` | Iterações rejeitadas e lições |
| `research/` | Investigação V4, folhas de contacto, referências |
| `../../development/v5-handoff.md` | **Retomar aqui**: estado exato, processos, próximos passos |
| `media-src/storyboards-2026-10-25/` (fora do Git) | As fontes HTML dos storyboards e as imagens pequenas que usam |
