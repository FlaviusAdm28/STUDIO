> **Origem desta cópia.** Investigação realizada para a V4 (fases 1 e 2, 24 de outubro de 2026),
> copiada sem alterações de `D:\STUDIO\docs\design\v4\creative-research.md` (ficheiro não versionado na
> worktree V4, SHA-1 `26749821ada8a8df7be249078cbaf4a515089b0c`) para a worktree V5 no M0, a 24 de
> outubro de 2026. **É contexto e evidência histórica, não autoridade.** As decisões aprovadas para a V5
> estão em `docs/design/v5/README.md` e `direction.md` e prevalecem sobre qualquer recomendação abaixo
> (por exemplo: a V5 deriva o P&B da própria fotografia a cores; Instagram é o contacto; `bespoke` não é
> proibida por princípio). O original na V4 não foi alterado.

---

# CHAPTER ONE V4 — investigação criativa

*Documento vivo da investigação V4. Fase 1 (auditoria e proposta "A Edição") e Fase 2 (estudo de cinco
referências e direções revistas). Nenhuma direção está aprovada. Nada aqui é implementação.*

*Atualizado: 24 de outubro de 2026 · branch `v4` · nenhum código alterado.*

---

## 0. Estado e como ler

- **Estado:** investigação concluída até à Fase 2. **À espera da decisão do design owner** (secção 9).
- **Autoridade:** este documento **não** substitui `docs/design/v2/` nem o `CLAUDE.md`. Se uma direção
  for aprovada, é preciso escrever a nova fonte de autoridade da V4 e rever o `CLAUDE.md` (que ainda
  declara a V2 como autoridade e manda preservar `spine` / `timeline`). Os documentos de marca
  `docs/brand/01–04` continuam bloqueados e governam a V4.
- **Legenda de evidência**, usada em todo o documento:
  - **[O]** observado diretamente no browser nesta investigação (Chrome desktop, janela 1538×784 CSS
    px reportados pela ferramenta; o `innerWidth` da página reportou 2560);
  - **[C]** lido no código-fonte servido pelo site (HTML/JS/CSS) ou medido via APIs do browser
    (`performance`, DOM);
  - **[E]** fonte externa / conhecimento geral não verificado nesta sessão — **confirmar antes de usar**;
  - **[I]** inferência minha.
- **Nenhuma métrica de desempenho foi medida** (sem traces, sem Lighthouse). Onde há números de bytes,
  vêm de `performance.getEntriesByType('resource')` ou de tamanhos de ficheiro, e dizem-no.

### Limitações da Fase 2

- **Mobile não foi observado em nenhuma referência.** A janela do Chrome controlada pela extensão não
  aceitou redimensionar (`resize_window` reportou sucesso, a página continuou a medir 2560 px). O
  controlador CDP do projeto (`D:\STUDIO-tools\browser-automation`, porta 9333) não estava a correr e
  não o arranquei, porque a fase proibia iniciar/reiniciar processos. O comportamento mobile do convite
  descrito abaixo vem do **código-fonte** [C], não de observação.
- Os sites com scroll suave (Lenis / smooth-scroll) responderam aos eventos de roda **sintéticos** da
  ferramenta; a sensação de lentidão registada pode ser parcialmente um artefacto desse método [I].
  Está assinalado onde importa.
- Saltos programáticos (`window.scrollTo`) no Belgrade Arbor dessincronizaram a cena; essas capturas não
  foram usadas como evidência.
- Pressão-e-mantém no convite foi feita com `PointerEvent` despachados por script, não com um dedo.

---

## 1. Fase 1 — o que continua válido

*Resumo da auditoria apresentada em conversa a 24 de outubro de 2026 (não tinha sido guardada).*

### Diagnóstico do site atual

- A homepage é uma narrativa de 14 estados em que o scroll avança uma história em vez de mover a página:
  ~31 700 linhas, `globals.css` com 12 149, `timing.ts` 3 392, `timeline.ts` 2 371, registo C1–C49.
- Problemas: o visitante não sabe onde está (frames presos, abertura obrigatória, navegação a aprender
  — `III — Studio`, ticks, fólios); a oferta chega tarde; o Work é um carrossel com relógio que o
  visitante não controla; o Method não explica; cada ajuste custa tempo, asserções e registo.
- **A marca já pede a V4:** `03` *"We decide the order. They decide the pace."* e `04` §11.2 proíbem
  reter a pessoa. O site atual contraria ambos.

### Preservar

Documentos de marca 01–04; conteúdo e tom (*Digital experiences built for moments worth remembering*,
*We stay close to every detail*, *No templates. No copies.*, a pergunta do Contact, Questions V4); a
fotografia real de `public/media/new`; a stack (Next 16 + React 19 sem dependências, `next/font`, texto
em `content/site.ts`); princípios de acessibilidade (foco, `inert`, reduced motion, sem scripts); o
controlador CDP; Vercel.

### Abandonar

O modelo de progressão (`spine`, `story`, `timeline`, `timing`, `scroll-stage`, `environment`, `sheet`,
`modelb`), o Ledger, a abertura obrigatória, o carrossel temporizado, o Method 3D, os fundos fixos, o
vídeo do hero (101 MB de fontes em `public/media/hero/video`; 9 MB servido).

### Proposta "A Edição" (Fase 1)

O estúdio é monocromático; a cor pertence ao trabalho (`04` §1 e §3). Fotografias a preto e branco que
ganham cor ao serem seguradas. Publicação editorial com capítulos, scroll normal. Papel marfim
(~`#ECE6DB`), tinta (~`#141210`), taupe (~`#8C7F70`); uma única mudança de luz (Contact escuro).
Cormorant Garamond + Schibsted Grotesk (já no projeto; tipo final ainda em `open-decisions` §7).
Estrutura: barra fixa → abertura → Work em três capítulos → como trabalhamos → Studio → Questions →
Contact. Interações: segurar para cor; provas com inclinação ≤ 3°; experimentar o trabalho real num
painel; chegada única das secções; contacto com a categoria pré-escolhida. Alternativa rejeitada:
"Mesa de luz" (navegação espacial a aprender, mobile fraco).

### Assets (Fase 1, sem repetir a inspeção)

- `public/media/new`: 12 fotografias de Helder Couto, uma só sessão (o casal do convite, Raquel &
  Flávio), 4016×6016 no máximo, 3–11 MB cada. **10 a preto e branco, 2 a cores (124, 195); só a 195 é
  horizontal.**
- Seleção: 299 (vestido ao vento, estrada) abertura · 303 (estrada, centrada) alternativa · 195 (casal,
  cores, horizontal) Weddings desktop · 023 (mãos, cavalos) detalhe · 046 / 067 retratos · 337 (costas
  do vestido, escuro) Contact · 124 / 126 retrato masculino → Studio · 179 / 182 editoriais, céu.
- `public/media/projects/*` e `public/media/studio/*` (1536×1024) **parecem** gerados por IA [I] —
  confirmar; se forem, contrariam `04` §6 (*"The subject is real"*).
- Lacunas: masters a cores das fotografias P&B; material real de Artists e Experiences; direitos de uso
  comercial (fotógrafo e casal); pipeline AVIF/WebP e masters fora de `public/` e do Git.
- **Git:** as 12 fotografias estão **em staging** (95 MB). Não foram tocadas.

---

## 2. Referências

| # | Site | URL |
|---|---|---|
| 1 | Brandon Yasin | https://brandonyasin.com/ |
| 2 | Cartier — Le Chœur des Pierres | https://www.cartier.com/en-fr/lechoeurdespierres |
| 3 | Belgrade Arbor | https://belgradearbor.rs/en |
| 4 | Sobha Privy Collection | https://sobha-privy-collection.com/ |
| 5 | Convite Raquel & Flávio | https://invite-mu-five.vercel.app/ |

Brandon Yasin e Belgrade Arbor mostram um selo "Site of the Day" da Awwwards na página [O]. É contexto,
não critério.

---

## 3. Análise por referência

### 3.1 Brandon Yasin — portefólio de diretor criativo

**Ideia visual principal.** A homepage *é* o trabalho: uma fila de seis imagens grandes, cada uma com
uma etiqueta minúscula em maiúsculas (*BESTSELLER 50 FESTIVAL*, *RAINS*, *LOUIS VUITTON*…), sobre papel
claro, com quatro cantos de interface em tipo de 9–10 px [O].

**Memorável porque** a interface quase desaparece: assinatura manuscrita no topo, *MENU / CONTACT*,
*LOCAL TIME 12 . 05* e um círculo. O resto é fotografia de alto nível [O].

**Navegação** [O][C]:
- A roda vertical move a fila **na horizontal**, em loop infinito (os casos repetem-se). O documento
  tem exatamente a altura da janela (`scrollHeight` = `innerHeight` = 1305), portanto não há scroll
  vertical na homepage. Nuxt + Lenis (classe `lenis` no `<html>`).
- *MENU* abre três cartões que são pré-visualizações das páginas: *cases*, *archive*, *about*.
- Página de caso (`/cases/bestseller`): título enorme fixo à esquerda (*bestseller 50 festival*),
  metadados no rodapé (*ART DIRECTION · DIGITAL, PRINT & SPATIAL DESIGN*), e a coluna direita faz
  scroll normal com imagem e texto em corpo grande.
- About: frase grande (*I build refined brands and experiences across digital and physical spaces*),
  retrato, três valores numerados, processo.

**Interações relevantes:**
1. Roda → movimento horizontal em loop. Propósito: dar ritmo de "fita de contactos". Custo: o visitante
   tem de perceber que a roda move para o lado [I].
2. Menu como pré-visualização de páginas — mostra *para onde* se vai, não só o nome.
3. Vídeo dentro de algumas imagens (`RAINS.mp4`, `LV.mp4`, mudos, 1080 px de largura) [C].

**Imagem, tipo, espaço, cor.** Grotesca neutra em dois tamanhos extremos (minúsculo para interface,
enorme para títulos); muito espaço negativo branco; cor só nas fotografias [O].

**O que adaptar:**
- O trabalho como primeira coisa, com etiquetas pequenas e factuais.
- Página de caso com título fixo e texto em corpo grande: lê-se com facilidade e dá autoridade.
- O menu que pré-visualiza.
- **Uma descoberta de conteúdo:** o caso Bestseller descreve *"a five-phase digital experience evolved
  from invitation to an interactive on-site guide"* [O] — é exatamente a oferta de Experiences, e mostra
  que "antes / durante / depois" é algo vendável.

**O que não copiar:** a roda que move na horizontal (contraria `03` §2 e `04` §10 *"understood before it
is used"*; esconde que há mais conteúdo); o relógio local (decoração, `03` §4); a assinatura manuscrita
como logótipo de autor (somos estúdio, não pessoa).

**Custo / risco:** Lenis + loop horizontal + vídeos inline. Não medido. [I] O risco maior é de
usabilidade, não de desempenho.

### 3.2 Cartier — Le Chœur des Pierres

**Ideia visual principal.** Duas pedras (safira, esmeralda) sobre papel branco com relevo e sombra suave,
título serifado *Le Chœur des Pierres*, *CHAPTER II* [O]. **Tocar numa pedra abre a peça que a usa.**

**Memorável porque** a segunda camada é inesperada e tem sentido: a pedra → o colar fotografado → o
**desenho em guache do colar** (com o carimbo *Cartier Paris Londres New York*) → uma mancha de aguarela
azul que enche o ecrã → frases sobre a peça → detalhes [O]. O produto acabado e o seu desenho são o mesmo
objeto em dois estados.

**Navegação** [O][C]:
- Entrada: a página não faz scroll (`scrollHeight` = `innerHeight`); há marcadores laterais *I / II*.
- Clicar na pedra abre um painel de ecrã inteiro com URL própria (`#stellara`) e um **✕** no canto. O
  scroll passa a mover esse painel.
- Interface: *MENU*, logótipo, *SOUND*, ✕. Nada mais.

**Interações relevantes:**
1. **Objeto → história** (clique). Propósito: transformar um produto numa descoberta.
2. **Fotografia ↔ desenho** ao longo do scroll. Propósito: mostrar o ofício por trás da peça.
3. Frases reveladas palavra a palavra com desfoque, ligadas ao scroll. Propósito: ritmo cerimonial.

**Imagem, tipo, espaço, cor.** Papel branco texturado; serifada de alto contraste com itálico; cor
apenas nas pedras e nas lavagens de aguarela, que tomam a cor da pedra escolhida [O].

**O que adaptar:**
- **"Tocar no objeto para abrir a sua história"** — para um estúdio, o objeto é um trabalho e a história
  é o que ele contém.
- **"O feito e o seu desenho"** — mostrar um site entregue e o esboço / a estrutura que o originou. É o
  equivalente honesto do guache: o processo como prova (`02` §8: *"how precisely we describe a moment"*).
- A cor da secção vem do objeto escolhido (o mesmo princípio do convite e da `04` §3).
- Interface reduzida a três palavras.

**O que não copiar:** a revelação palavra a palavra (proibida por `04` §11.1, *"letters arriving one at a
time"*); a linguagem de luxo (serifada de joalharia, *spectacular*); o som; o scroll dentro de um painel
sobreposto (o scroll do browser deixa de ser o da página) [I].

**Custo / risco:** sem `<canvas>` [C] — as transições são imagens e máscaras em DOM. 200 elementos
`<img>` na página [C]. A página carrega muitos scripts de terceiros de analytics (Facebook, TikTok,
Pinterest, Snapchat…) [C] — custo real, mas é da plataforma Cartier, não da direção visual.

### 3.3 Belgrade Arbor — empreendimento residencial

**Ideia visual principal.** Verde profundo e marfim; fotografias e renders recortados em **molduras
oblíquas** que ecoam a fachada em forma de copa de árvore; frases serifadas grandes; uma barra flutuante
em pílula com *MENU · logótipo · INQUIRE →* [O].

**Memorável porque** a forma das molduras vem do próprio edifício: a identidade gera a composição [I].

**Navegação** [O][C]:
- **Preloader com percentagem** antes de qualquer conteúdo: nesta sessão subiu de 29 % a 100 % ao longo
  de ~15–20 s [O] (depende da rede; não é uma medição controlada).
- Next.js (Turbopack) + Lenis; dois `<canvas>` (2540×1305 e 1792×1008) [C]; documento com 29 073 px de
  altura [C]; vídeo `home/hero.mp4` [C].
- A homepage é longa e lenta: precisei de ~55 passos de roda para passar duas frases [O] (ver nota sobre
  eventos sintéticos). Contador de progresso no canto (*01*, *02*).
- Menu em lista: *Home · 3D Experience · Residences · Business · Retail Spaces · Location · Amenities ·
  Contact · About the investor* [O].
- **Páginas internas são práticas:** `/residences` abre com uma fotografia e depois passa para papel
  marfim com **plantas de cada apartamento em cartões** (*A 1.01*, *A 1.02*), filtros por tipologia
  (*1 BR … 4 BR*), área, piso e características — em scroll normal [O].

**Interações relevantes:**
1. *INQUIRE →* sempre visível na barra. Propósito: conversão sem interromper.
2. Molduras que se deformam e trocam de imagem com o scroll. Propósito: profundidade e transição.
3. Frases reveladas palavra a palavra com desfoque, ligadas ao scroll.

**O que adaptar:**
- **O CTA principal sempre presente** na navegação (*Start a project*).
- **Separar "experiência" de "informação":** a homepage seduz, as páginas de serviço informam em fluxo
  normal com estrutura clara (cartões, filtros). É a resposta direta a "o visitante deve perceber
  rapidamente o que pode contratar".
- A forma de uma moldura nascer da identidade (para nós: a proporção de uma prova fotográfica, a página
  de um livro).

**O que não copiar:** o preloader (retém a pessoa, `04` §11.2); a revelação palavra a palavra; a pista de
scroll longa — é o mesmo problema que temos hoje.

**Custo / risco:** WebGL em ecrã inteiro + vídeo + Lenis + documento de 29 000 px. [I] É o perfil técnico
mais próximo do que estamos a abandonar.

### 3.4 Sobha Privy Collection — coleção imobiliária

**Ideia visual principal.** Abertura negra com uma **fita escultórica em 3D** em movimento lento atrás de
*The art / OF THE SUBLIME* (itálico caligráfico + maiúsculas serifadas); depois, secções brancas com
eyebrow minúsculo (*A HANDPICKED COLLECTION*), títulos em maiúsculas e fotografias de interiores em
composição escalonada [O].

**Memorável porque** o contraste negro/branco e a escala tipográfica fazem tudo parecer cerimonial.

**Navegação** [O][C]:
- *Menu* abre um ecrã inteiro com **capítulos numerados**: *Chapter 1 About · Chapter 2 Collection ·
  Chapter 3 Tenets · Chapter 4 Selection* [O]. É a forma mais clara de "capítulo como navegação" das
  cinco referências — e o nosso nome pede-o.
- *3D Map* é uma **página separada** (`/location`) [O].
- Scroll suave com amortecimento forte (classes `has-scroll-smooth`) [C]; nesta sessão a página avançou
  muito pouco por passo de roda [O] — possivelmente agravado pelos eventos sintéticos [I].
- Banner de cookies fixo no rodapé, por cima do conteúdo [O].

**Interações relevantes:**
1. "3D" que, na homepage, **é vídeo pré-renderizado**: `ribbons.mp4` (~2,8 MB transferidos),
   `expensive_spaces.mp4` (~5,3 MB), `teaser.mp4` (~2 MB) [C]; nenhum `<canvas>` na homepage [C].
2. WebGL real **só** na página de localização: um `<canvas>` de 5120×2610 [C].
3. Menu de capítulos com vídeo de fundo (`menu.mp4`, 2560 px) [C].

**O que adaptar:**
- **Capítulos numerados como menu.**
- **Isolar o que é caro:** o 3D em tempo real vive numa página própria, a pedido; a homepage usa um ativo
  pré-renderizado. Para nós: a experiência pesada (o site do cliente a funcionar) abre a pedido, nunca na
  chegada.
- Eyebrow minúsculo + título grande + imagem — uma hierarquia que se lê em segundos.

**O que não copiar:** o amortecimento do scroll; o tom imobiliário de luxo (*sublime*, *connoisseurs*);
o banner por cima do conteúdo; vídeos de vários MB na chegada.

**Custo / risco:** ~10 MB de vídeo na homepage (soma das entradas acima, não exaustiva) [C]; canvas de
5120 px na página de mapa [C]. [I] Num Mi 11 Lite isto seria um risco claro de dados e memória.

### 3.5 Convite Raquel & Flávio — comparação

**Ideia visual principal.** Página dupla negra: nomes em Cormorant à esquerda, fotografia vertical à
direita; a fotografia chega **a cores e dessatura** para P&B; depois passa a papel marfim para o convite
[O].

**Interações** [O][C]:
1. **Segurar para ver a cor** (rato, dedo ou Espaço/Enter); um movimento > 14 px cancela, para não
   confundir com scroll. Confirmado nesta sessão com eventos simulados: `data-colour` passa a `on` e a
   imagem fica a cores; ao soltar volta a `off` [O].
2. **Giroscópio opcional** em telemóvel, atrás de um botão (*Ativar movimento*): inclinação máx. 2,6°,
   deslocação 7 px, zoom 1,09 para esconder as margens; um só loop de animação que para quando a imagem
   está parada [C].
3. **Montagem no primeiro scroll:** o primeiro gesto de scroll não move a página — dispara uma sequência
   curta de cortes e só depois liberta o scroll (com uma saída de segurança de 15 s) [C], visto nesta
   sessão como um corte cruzado entre fotografias [O].
4. Puxar no topo para rever; *Rever* como botão [C].
5. Reduced motion: sem câmara nem cortes, apenas uma dissolução lenta [C].

**Mobile** (só pelo código [C], não observado): abaixo de 4:5 a fotografia ocupa a largura e os títulos
ficam por cima; o botão do giroscópio só aparece com ponteiro grosso, contexto seguro e sem reduced motion.

**Comparado com as outras:** é a única referência em que a interação mais memorável **não precisa de ser
aprendida** — segurar uma fotografia é um gesto que toda a gente já faz — e em que o movimento 3D é
**opt-in**. É também a mais leve tecnicamente: JS próprio de ~23 KB, CSS de ~18 KB (tamanhos dos ficheiros
servidos), sem bibliotecas [C].

**O que adaptar:** segurar para cor; giroscópio opt-in; reduced motion como versão desenhada; a passagem
escuro → papel como único evento de luz.

**O que não copiar:** a montagem que **retém o primeiro scroll** (contraria `04` §11.2; num site
comercial o primeiro scroll é o visitante a procurar a oferta).

---

## 4. Matriz comparativa

Legenda: ● forte · ◐ parcial · — ausente. Última coluna: o que fazer no Chapter One.

| Princípio | Brandon | Cartier | Belgrade | Sobha | Convite | Chapter One |
|---|---|---|---|---|---|---|
| O trabalho é o primeiro conteúdo | ● | ● | ◐ | ◐ | ● | **Adotar** |
| Tocar num objeto abre uma 2.ª camada | ◐ | ● | — | — | ● | **Adotar** (cor + "abrir o trabalho") |
| "O feito e o seu desenho" (ofício visível) | — | ● | — | — | — | **Adaptar** (esboço ↔ site entregue) |
| Capítulos como navegação | — | ◐ | ◐ | ● | — | **Adotar** (é o nome) |
| CTA comercial sempre visível | ◐ | — | ● | — | ◐ | **Adotar** |
| Experiência na homepage, informação em páginas calmas | ● | — | ● | ◐ | ◐ | **Adotar** |
| O caro fica isolado e a pedido | — | ◐ | — | ● | ● | **Adotar** |
| Cor vem só do material | ● | ● | ◐ | ◐ | ● | **Adotar** (já era a tese da Fase 1) |
| Interface em tipo minúsculo, títulos grandes, espaço negativo | ● | ● | ◐ | ● | ● | **Adotar** |
| Profundidade 3D subtil e opt-in | — | — | — | — | ● | **Adaptar** (desktop ponteiro, mobile opt-in) |
| Scroll nativo, sem retenção | — | ◐ | — | — | ◐ | **Obrigatório** |
| Roda → horizontal / amortecimento forte | ● | — | ● | ● | — | **Evitar** |
| Preloader / primeiro scroll retido | — | — | ● | — | ● | **Evitar** |
| Texto revelado palavra a palavra | — | ● | ● | — | — | **Evitar** (`04` §11.1) |
| WebGL / vídeo pesado na chegada | ◐ | — | ● | ● | — | **Evitar** |

**Os cinco princípios mais promissores**, por ordem: (1) tocar num objeto abre a sua segunda camada;
(2) capítulos como navegação; (3) experiência na homepage, informação em páginas próprias com CTA sempre
visível; (4) o feito e o seu desenho; (5) o caro isolado e a pedido.

**O que nenhuma referência tem e nós precisamos:** uma forma clara de mostrar **o que se pode contratar**
num serviço com várias peças. Nenhuma das cinco vende serviços; a resposta tem de ser nossa (secção 6).

---

## 5. Direções criativas

### A. "A Edição, em capítulos" — **recomendada**

*Evolução da Fase 1 com o que a investigação acrescentou: capítulos como navegação (Sobha), páginas
próprias para a informação e CTA permanente (Belgrade), o objeto que abre a sua história e o ofício
visível (Cartier), e a cor ao toque e o 3D opt-in (convite).*

- **Conceito.** O Chapter One é um livro com três capítulos — Weddings, Artists, Experiences — e cada
  capítulo é uma ocasião contada **pelo momento em que cada peça é usada: antes, no dia, depois**. O
  estúdio é papel e tinta; a cor pertence ao trabalho e aparece quando lhe tocam.
- **Primeiro ecrã.** Página dupla: à esquerda, *Chapter One* e a frase do estúdio; por baixo, o índice —
  *I Weddings · II Artists · III Experiences* — como links grandes e simples. À direita, a fotografia 299
  a preto e branco. Barra superior: *Chapter One* · *Index* · **Start a project**.
- **Navegação.**
  - Homepage curta: abertura → os três capítulos (um ecrã cada, com o objeto, uma frase e a lista do que
    se pode contratar) → Studio → Questions → Contact.
  - **Cada capítulo tem uma página própria** (`/weddings`, `/artists`, `/experiences`) com a oferta
    completa. Entra-se tocando no objeto do capítulo ou no seu nome.
  - O *Index* abre os capítulos numerados (como o menu da Sobha), também em mobile.
  - **Start a project** está sempre na barra e leva ao Contact com o capítulo pré-escolhido.
- **Work.** Em cada página de capítulo:
  1. o objeto (fotografia ou o trabalho real) e uma frase;
  2. **"Before · On the day · After"** — uma linha do tempo da ocasião onde cada peça contratável aparece
     no seu momento (ex.: Weddings — *Save-the-date → Website → Invitation → RSVP → Seating plan* · *Live
     gallery* · *Private memory gallery*), cada uma com uma frase;
  3. um trabalho real para **experimentar** (o convite abre num painel do tamanho de um telemóvel);
  4. *O feito e o seu desenho*: o mesmo ecrã em esboço e entregue, lado a lado ou alternado;
  5. Questions relevantes e o CTA.
- **Interações que a definem.**
  - **Segurar para cor** (essencial).
  - **Objeto → página** com uma transição entre documentos (View Transitions API, onde existe; noutros
    browsers é uma navegação normal) [E: suporte a confirmar] — o objeto cresce para se tornar a abertura
    da página do capítulo.
  - **Experimentar o trabalho** num painel carregado só depois do clique (essencial).
  - **Esboço ↔ entregue** num controlo simples (opcional; depende de material, secção 7).
  - **Inclinação de prova** ≤ 3° com ponteiro; giroscópio opt-in em mobile (opcional).
- **Desktop e mobile.** Desktop em páginas duplas assimétricas; mobile na mesma ordem, uma coluna, a
  linha do tempo vira lista vertical com as mesmas três etapas. Nenhuma interação depende de hover.
- **Riscos.**
  - Usabilidade: baixo; o maior risco é a linha do tempo ficar densa em Weddings (7 peças) — mitigável com
    três grupos e frases curtas.
  - Desempenho: duas imagens por fotografia "a cores" (mitigado carregando a cor só com intenção); o
    painel do trabalho real (só a pedido); View Transitions não custa nada onde não existe.
  - Manutenção: mais páginas do que hoje (4–5), mas cada uma é conteúdo em fluxo normal em
    `content/site.ts`, sem coordenação de tempos.
- **Reconhecivelmente Chapter One porque:** os capítulos são literais, a ocasião é o eixo (antes / no dia
  / depois — `01`: *"we work on what happens once"*), e a cor-ao-toque é a tese da marca (`04` §3) feita
  gesto.
- **Desvantagens honestas:** é menos "uau" à chegada do que C; vive da qualidade da fotografia e da
  tipografia, por isso exige rigor de composição; Artists e Experiences ainda não têm material real.

### B. "O Arquivo" — galeria de trabalho

- **Conceito.** À maneira de Brandon Yasin: a homepage é uma parede de trabalhos em grelha vertical (não
  horizontal), cada um com etiqueta factual; filtros *Weddings · Artists · Experiences*; serviços numa
  página à parte.
- **Primeiro ecrã.** Frase curta + a primeira fila de trabalhos.
- **Navegação.** Grelha → página de caso (título fixo, texto grande) → serviços → contacto.
- **Work.** Os trabalhos *são* a explicação; os serviços ficam numa página de serviços.
- **Interações.** Segurar para cor nos cartões; inclinação no ponteiro; transição cartão → caso.
- **Riscos.** **Fatal neste momento: temos um trabalho real** (o convite). Uma galeria com um item, ou com
  imagens geradas, contraria `02` §8 e `04` §6. Comercialmente, explica pior *o que se contrata*.
- **Chapter One?** Pouco: é a gramática de qualquer portefólio de designer.
- **Quando faz sentido:** daqui a 6–12 meses, com 8+ projetos reais, como página *Work* dentro de A.

### C. "Capítulos em cinema" — narrativa cinematográfica com navegação convencional

- **Conceito.** À maneira da Sobha: capítulos em ecrã inteiro, alternando negro e papel, fotografia a toda
  a largura, títulos cerimoniais, um ativo em movimento pré-renderizado na abertura; scroll nativo,
  menu de capítulos.
- **Primeiro ecrã.** Fotografia ou vídeo a toda a largura, *Chapter One* centrado.
- **Navegação.** Menu de capítulos; cada capítulo uma secção longa.
- **Work.** Cada categoria é um capítulo visual, com a oferta numa camada inferior.
- **Interações.** Vídeo pré-renderizado; cor ao toque; transições de capítulo por corte.
- **Riscos.** Precisa de **muito mais imagem** (vários ecrãs inteiros por capítulo) e de vídeo, que não
  temos; peso de vídeo no Mi 11 Lite; desliza facilmente de volta ao site atual (cinema primeiro, oferta
  depois); centrar tudo contraria `04` §5 (*"centring is reserved for moments meant to be ceremonial"*).
- **Chapter One?** Sim no tom, mas à custa da clareza comercial que motivou a V4.

### Comparação

| | A. Edição em capítulos | B. Arquivo | C. Cinema |
|---|---|---|---|
| Compreensão imediata | ● | ● | ◐ |
| Clareza do que se contrata | ● | ◐ | ◐ |
| Impacto visual à chegada | ◐ | ◐ | ● |
| Material disponível hoje | ◐ (falta Artists/Experiences) | — | — |
| Risco de desempenho | baixo | baixo | médio–alto |
| Custo de manutenção | baixo–médio | baixo | médio |
| Fidelidade à marca (01–04) | ● | ◐ | ◐ |

**Recomendação: A.** É a única que melhora a clareza comercial *e* tem material suficiente para começar,
e incorpora os cinco princípios mais fortes da matriz sem importar a técnica cara de nenhuma referência.

---

## 6. Oferta comercial

### Integração do conteúdo existente

- **Questions V4** (em `content/site.ts`, por guardar em commit): mantêm-se na homepage. A pergunta de
  serviços passa a ligar a cada página de capítulo. Cada página de capítulo pode repetir 2–3 perguntas
  relevantes (preço, prazos) com o mesmo texto — uma só fonte em `site.ts`.
- *We stay close to every detail*, *No templates. No copies.* → Studio.
- *Is there something that deserves its own experience?* → Contact.
- **Palavras proibidas em `04` §12 que aparecem hoje:** *bespoke* (Questions V4, linha Artists) e
  *unforgettable* (Philosophy). Não alterei; decisão do owner.

### Oferta por capítulo, organizada por momento

**I. Weddings**

| Antes | No dia | Depois |
|---|---|---|
| Save-the-date digital · Website do casamento (história, programa, local, viagem, alojamento, FAQ, multilíngue) · Convite digital · RSVP com restrições alimentares | Seating plan / encontra o teu lugar · Página do dia (horários, mapa, atualizações) · **Live gallery** (convidados partilham por QR) | **Private memory gallery** · Página de agradecimento · *Um ano depois* (aniversário) |

**II. Artists**

| Sempre | Para um momento | Depois |
|---|---|---|
| Portefólio / galeria web personalizada · Página de encomendas (commissions) · Link-in-bio desenhado (produto de entrada) | Exposição digital / viewing room com data · Página de lançamento (livro, disco, série, coleção) · Press kit digital (EPK) com downloads · Etiquetas QR + áudio-guia para uma exposição | Arquivo / catálogo de obra · Arquivo da exposição |

**III. Experiences**

| Antes | Durante | Depois |
|---|---|---|
| Microsite da ocasião · Convite + RSVP com lotação · Página de teaser / contagem | Guia no local (programa, mapa, horários — como o caso Bestseller de Brandon Yasin) · Programa digital de espetáculo · Sinalética por QR | Arquivo de memória da ocasião · Galeria partilhada |

### Ofertas novas de baixo custo recorrente

Todas assumem sites estáticos, desenvolvidos com código próprio e Claude/GPT na fase de produção, sem
serviços pagos por mês por defeito.

- **Motor comum, desenho único.** RSVP, galerias, QR e páginas de dia reutilizam infraestrutura própria
  entre clientes; o desenho é sempre novo (`02` §7 *"repeating ourselves"* refere-se ao que o cliente
  vê). [I]
- **RSVP gratuito:** formulário → Google Sheet via Apps Script [E].
- **Live gallery:** o único serviço com custo real (armazenamento e tráfego). Opções a avaliar: um
  armazenamento de objetos com plano gratuito generoso (p. ex. Cloudflare R2) [E], ou Google Drive do
  cliente; cobrar alojamento acima de um limite.
- **Alojamento:** confirmar que o plano gratuito escolhido permite uso comercial — **o plano Hobby da
  Vercel é, tanto quanto sei, só para uso não comercial** [E: verificar]. Alternativas com plano gratuito
  comercial a confirmar (Cloudflare Pages, Netlify) [E].
- **IA com custo controlado:** traduções para convidados, texto alternativo das imagens, legendas de
  arquivo — **geradas na produção**, não em tempo real, para não haver custo por visita [I].
- **Domínio:** custo anual repassado ao cliente.

### Clareza sem preços

Cada página de capítulo termina com *"Every project is proposed for its occasion. Tell us about yours."*
e o CTA — consistente com a resposta de preço já aprovada.

---

## 7. Assets por direção

| | A. Edição em capítulos | B. Arquivo | C. Cinema |
|---|---|---|---|
| Weddings | **Suficiente:** 299/303 abertura, 195, 023, 046/067, 337 + o convite real | 1 trabalho | Precisa de mais ecrãs inteiros e vídeo |
| Artists | **Lacuna** — sem material real | Lacuna | Lacuna |
| Experiences | **Lacuna** — 182 sugere "ocasião", mas é a mesma noiva | Lacuna | Lacuna |
| Studio | 124 / 126 (se for o fundador) | — | — |
| Cor ao toque | **Precisa dos masters a cores** de 299, 303, 023, 046, 179 | idem | idem |
| Esboço ↔ entregue | Produzível por nós a partir do convite (wireframes, esboços) | — | — |

**Como A contorna a lacuna de Artists e Experiences sem inventar trabalho:** esses capítulos abrem com o
**desenho** em vez da fotografia — tipografia, esboços e estruturas do que se pode fazer, ditos como
possibilidade (*What we can make for an exhibition*), nunca como portefólio falso. Quando houver um
projeto real, entra no lugar do desenho. [I] As imagens 1536×1024 atuais não devem ser usadas como
trabalho de cliente.

**Lacunas que podem condicionar a decisão:** (1) masters a cores; (2) um primeiro projeto real de
artista, mesmo pro bono; (3) direitos de uso (Helder Couto e o casal); (4) capturas do convite em
telemóvel — produzíveis por nós.

---

## 8. Viabilidade técnica (atualizada)

- **Mantém-se a Fase 1:** Next 16 + React 19 sem dependências novas; páginas em server components; JS
  em ilhas pequenas (`ColourReveal`, `Tilt`, `WorkSheet`, `Arrive`); pipeline de imagem com `sharp`
  (já instalado); metas: LCP < 2,0 s em 4G médio, CLS < 0,02, INP < 150 ms, JS da homepage < 60 KB gzip,
  primeiro ecrã < 600 KB, scroll estável a 90 Hz no Mi 11 Lite — **metas, não medições**.
- **Acrescenta-se:** rotas por capítulo; View Transitions entre documentos como melhoria progressiva
  [E: suporte por browser a confirmar antes de decidir]; nenhuma biblioteca de scroll, nenhum WebGL,
  nenhum vídeo na chegada (lições de Belgrade e Sobha).
- **Validação de compreensão** (com os amigos que se perderam): *o que faz o estúdio?* em 10 s; *o que
  podem fazer para um artista?*; *como pedes um preço?*; *o que acontece depois do lançamento?* — meta
  ≥ 4 em 5 por tarefa.

---

## 9. Decisões pedidas ao owner

1. **Direção:** A "Edição em capítulos" (recomendada), B ou C?
2. **Estrutura:** homepage + páginas por capítulo (recomendado) ou página única?
3. **Eixo "Before · On the day · After"** para apresentar a oferta — aprovado?
4. **Masters a cores e direitos:** consegues pedir ao Helder Couto os masters de 299, 303, 023, 046 e 179
   e a autorização de uso comercial (e da Raquel)?
5. **Artists e Experiences:** abrir com o *desenho* até haver trabalho real, ou procurar já um projeto
   (pro bono)?
6. **Imagens 1536×1024 atuais:** confirmas se são geradas? Se sim, retiram-se?
7. **Contacto:** endereço / canal (bloqueador comercial; `contact.write.address` é `null`).
8. **Alojamento:** plano com uso comercial permitido (ver secção 6).
9. **Texto:** manter ou trocar *bespoke* e *unforgettable* (`04` §12)?
10. **Git:** destino das 12 fotografias em staging (95 MB) — commit, Git LFS, ou masters fora do
    repositório e só derivados otimizados em `public/`?
11. **Autoridade:** aprovar que a V4 substitui a V2 como fonte de design e que o `CLAUDE.md` seja
    reescrito no início da implementação.

## 10. Próximo passo recomendado

Depois das decisões 1–3 (as restantes podem correr em paralelo):

1. Escrever a fonte de autoridade da V4 (curta) e rever o `CLAUDE.md`.
2. Guardar em commit o trabalho das Questions V4, à parte de qualquer V4 nova.
3. **Primeiro marco visual, estático, numa rota `/v4` ao lado do site atual:** a homepage (abertura +
   índice dos três capítulos) e a página **Weddings** completa com a linha do tempo *Before · On the day ·
   After*, com *segurar para cor* a funcionar numa fotografia — a 1440×900 e 390×844, e no Xiaomi através
   de um preview.
4. Teste de compreensão com 3–5 pessoas sobre esse marco, antes de construir Artists e Experiences.
