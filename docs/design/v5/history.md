# V5 — Histórico de iterações (o que foi tentado e porquê mudou)

Registo para não repetir caminhos já rejeitados. Datas: 24 de outubro de 2026.

## V4 (investigação, fases 1–2)

- Diagnóstico do site original (V1–V4): scroll preso e progressão por estados, lag no Xiaomi, oferta
  pouco clara, utilizador perdido no início. Proposta "A Edição" (papel e tinta, revelação de cor).
- Estudo das quatro referências (Brandon Yasin, Cartier, Belgrade Arbor, Sobha) + convite.
- Documento: `research/creative-research.md`.

## M0 — Isolamento

- Worktree `D:\STUDIO-v5`, branch `v5` em `fe1bd33`; `node_modules` próprio (`npm ci`); `sharp` 0.35.5 como
  devDependency; código V1–V4 removido só na V5; fonte de autoridade V5 criada.

## M1 — Homepage em papel (rejeitada como "demasiado estática, genérica, editorial literal")

- Fundo claro, título + fotografia 302 à direita + índice; comparação tipográfica A/B/C (escolhida **A**:
  Cormorant Garamond + Schibsted Grotesk).
- Lição: clareza e legibilidade aprovadas; faltava presença, movimento, profundidade, surpresa.

## M1 revisão — "a secretária sob a lâmpada" (rejeitada: "não gosto")

- Recuperou a atmosfera escura do site original; a abertura era uma secretária com provas e folhas de
  desenho; Weddings como folha de contacto; Artists/Experiences sobre placas IA.
- Lição do owner: **não partir do site original** — ele foi o primeiro conceito; a V5 tem de ser uma
  direção nova, inspirada nas referências.

## Proposta "evoluir o site original" (rejeitada antes de construir)

- Mesma lição: não quer uma evolução do original.

## Direção aprovada — "First Page"

- Fundo pode ser escuro; calma e segurança artística; entrada WOW e pessoal (data/hora); o vídeo do
  original é aproveitado como asset (só ele); Work num só palco por camadas; Method com três opções a
  comparar; About aprovado; navegação no estilo V4; alvo Xiaomi sem lag.
- Especificação: `direction.md`, `pages.md`, `interactions.md`.

## 25/10 — o caminho fechado com o owner (README #19–#31)

- O owner reabriu a regra "nada ligado ao scroll": **pode haver passagens e cenas presas** desde que não
  haja lag no Xiaomi; o WOW é prioridade. Regras técnicas em `interactions.md` §0.
- **Work**: a proposta "o scroll percorre os momentos" foi recusada pelo próprio owner — prendia a pessoa
  em Weddings e os capítulos nunca mudavam. Ficou o inverso: **o scroll muda os capítulos, o toque (ou a
  rotação automática) muda os momentos**.
- **"See the drawing" com botão** trocado por **desenho sempre visível** que o rato/toque amplia.
- **"Start a project"** recusado (soa a processo, a outro tipo de conteúdo) → **Talk to us**.
- **Method**: as três opções isoladas deram lugar a **uma cena** que as junta; a primeira versão
  ("uma frase personalizada") foi achada insuficiente pelo owner — precisa de mais do que a frase.

## 25/10, mais tarde — os storyboards do Method

- **v1** (peças "impressas": convite, save-the-date, bilhete…, cor sólida por hora): **recusado** — "ninguém
  entende o que são os cartões; o meu trabalho é criar cenas digitais web, não artes gráficas para
  impressão"; cores sólidas "chatas"; o quadro só com a frase "não fica nada aesthetic", com vazio a mais.
- **v2** (céu da hora + ecrãs web): direção aprovada; cores ainda demasiado sólidas; o nome aparecia só no
  fim; um telemóvel desenhado dentro do telemóvel parecia estranho; o final (lista de passos) não fechava.
- **v3 / v3.1**: **aprovado como conceito** ("adoro este conceito, a entrada no fim está perfeita").
  O desenho pequeno ao lado da foto confundia ("é só uma linha?") → redesenhado maior e ligado à peça.

## 25/10, fim do dia — Work, About, Questions, Contact, menu e a revisão

- **Work — o "desenho" da peça:** desenho pequeno ao lado da foto → recusado ("é só uma linha?"; no desktop um
  erro de CSS mostrava só um oval); "a fotografia torna-se o site" (recorte da foto num layout) → recusado (corta a
  imagem sem sentido, duplica informação); hover por peça com demonstrações → a ideia agradou mas complicava
  (3 capítulos × 3 momentos × várias peças); **ficou:** cada momento mostra sozinho a sua peça (#43).
- **Work — aura:** primeira versão demasiado forte → refinada (mais pequena, menos saturada).
- **About:** a primeira transição (a luz abre-se num círculo) mantida como alternativa; a escolhida (B) começou
  por revelar à esquerda (confuso) → a luz fica no centro e o retrato vai depois para o seu lugar; o nome saltava
  entre estados (alinhamento e itálico não se animam) → um só elemento movido por `transform`; fundo musgo liso
  → a atmosfera da própria fotografia; texto em três pontos → tirados (repetiam o Method).
- **Questions:** fundo quase-branco liso → pedra da marca feita estúdio; capítulos no telemóvel em lista → em
  tabela de três → numa linha com barras verticais (sem sublinhado nem numerais).
- **Contact:** *No templates. No copies.* no colofão → *Built around you.*; *Back to the first page ↑* → retirado.
- **Menu:** o owner pediu o *liquid glass* do menu antigo; o desfoque ao vivo foi recusado por desempenho → vidro
  preparado; índice lateral no desktop → a mesma barra e o mesmo menu em todos os ecrãs.
- **Revisão final:** faltava a sequência da entrada; a especificação da entrada pelo O estava errada (pelo centro
  ficaria escuro → pelo traço). Tudo em `storyboard.md`.

## Código atual na worktree (fim da sessão)

O código em `src/` é o da **M1 revisão (secretária)** — compila e funciona, mas **não é a direção
aprovada**. Reutilizar apenas as peças listadas em `interactions.md` §Componentes reutilizáveis e
`roadmap.md` M2; o resto é substituído.
