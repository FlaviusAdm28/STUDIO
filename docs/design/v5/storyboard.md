# V5 — O storyboard aprovado: o percurso completo

*Aprovado pelo owner a 25 de outubro de 2026 (README #19–#56). Este documento é a **especificação estado a
estado** da página única. Prevalece sobre as descrições mais antigas em `pages.md` e `interactions.md` onde
divergirem; os dois foram atualizados para apontar para aqui.*

**Referência visual (privada, do owner):** https://claude.ai/artifact/9vkDx379vuwuiaXre62cxz — entrada (E1–E4),
estados 1–21, menu, as quatro luzes do estúdio. Com controlos para a hora de chegada, o nome, *já cá esteve* e o
capítulo escolhido na entrada. **Fontes locais** (HTML + imagens pequenas, fora do Git):
`media-src/storyboards-2026-10-25/` (`work-method-storyboard.html` é o principal; `about/`, `questions/`,
`contact/`, `menu/` são as versões isoladas de cada parte; `method-backdrop.html` a comparação dos fundos).

> O storyboard é um **esboço de direção**, não código para copiar: usa imagens paradas onde o site terá vídeo,
> `background-clip: text` onde o site terá uma máscara SVG, e desfoque CSS onde o site terá imagens já desfocadas.
> A técnica a usar no site está indicada em cada estado.

---

## Regras que atravessam tudo

1. **Uma só animação contínua.** Cada passagem leva um elemento da cena anterior para a seguinte; nunca há um
   ecrã vazio à espera (README #32).
2. **Scroll nativo.** Passagens ligadas ao scroll em CSS (`animation-timeline: view()/scroll()`), só `transform` e
   `opacity`; cenas presas com `position: sticky`; uma cena presa de cada vez; ≤ 6 camadas a animar; o vídeo pausa
   fora do ecrã; alternativa para tudo (reduced motion, sem suporte, sem JS). Cada passagem é **medida no Xiaomi
   antes** de construir a seguinte (`interactions.md` §0, README #24).
3. **O que não é scroll:** a sequência da entrada (corre sozinha, qualquer gesto a completa), o tempo que muda os
   momentos do Work, o campo *Make it yours*, a cor do retrato por gesto, abrir perguntas, abrir o menu.
4. **A barra está em todos os estados** (README #56), **na mesma linha da etiqueta da secção** (alinhada pela linha de texto, não por uma percentagem): à esquerda a secção atual (`01 Work`…); à direita, no
   desktop, a hora de quem visita + *Talk to us* + **≡ Menu**; no telemóvel só **≡ Menu**. Em baixo de cada secção,
   a seguinte (`04 Questions ↓`).
5. **Personalização, sem nada enviado nem guardado no servidor:**

   | Dado | De onde vem | Onde aparece |
   |---|---|---|
   | Hora de chegada (dia, hora) | relógio do browser, guardada em memória no arranque | dedicatória da entrada; ecrãs e capa do Method; linha do Contact; barra |
   | Faixa da hora (manhã/dia/fim de tarde/noite) | a mesma hora | tinta do vídeo na entrada; a luz do estúdio no Method |
   | Nome (*Make it yours*, opcional) | campo no Method; só na página aberta | templates e ecrãs do Method, capa, *For Ana.*, *Talk to us, Ana*, *Built around Ana.*, *Hello, Ana.* no menu |
   | Já cá esteve | `localStorage` (`c1.lastVisit`), com try/catch | *Welcome back* na dedicatória; *second chapter* na capa |
   | Capítulo escolhido na entrada | clique numa lâmina (memória da página) | aterragem no Work; ecrã em destaque do Method |

6. **Voz:** *we* em todo o site; *I* só no About (README #51). Site em inglês.

---

## Entrada — "Através das letras" (E1–E4)

| | O que se vê | Técnica |
|---|---|---|
| **E1** | Carvão. Só a **dedicatória**, **logo acima de onde vai aparecer o título** (não no topo): *Sunday, 25 October · 21:14* (*Welcome back · …* para quem volta) | opacidade, 600 ms |
| **E2** | **CHAPTER ONE** enorme; **o vídeo vê-se por dentro das letras** | véu SVG carvão com o texto recortado (máscara) por cima do `<video>`; anima-se só com `transform` |
| **E3** | **A câmara entra pela letra O**: **o vídeo fica parado e é o véu que avança** — o véu com as letras recortadas cresce até a letra cobrir o ecrã, enquanto a imagem avança um pouco (de 1,14 para 1), como uma câmara a entrar | `transform: scale(~60)` **no véu** (nunca na imagem recortada: escalar a imagem com as letras transforma-a numa mancha), origem **no traço esquerdo do O** — a letra é a janela, o miolo do O é véu. Letra-janela num peso mais forte de Cormorant (500/600, +1 ficheiro). Plano B: véu rasterizado |
| **E4 = estado 1** | Vídeo em ecrã inteiro com a **tinta da hora**; **CHAPTER ONE** reaparece centrado e mais pequeno, em letra sólida; subtítulo *Digital experiences built for moments worth remembering.*; **três lâminas oblíquas** *I Weddings · II Artists · III Experiences*; a barra | lâminas em `clip-path` oblíquo, entram em profundidade (translate + leve rotação, 120 ms entre elas) |

- **E3 é só a passagem** (~1,2 s, de 1,4 a 2,6 s): nunca fica parado; no storyboard aparece fixo só para se ver o
  meio do movimento.
- **O vídeo carrega e toca desde o primeiro instante**, por trás do véu (já no E1); por isso **no E2 vê-se o vídeo em
  movimento dentro das letras**. Se a rede ainda não o tiver, vê-se o poster (o mesmo fotograma) até arrancar —
  nada bloqueia nem fica preto. Um só pedido por formato de ecrã (`hero-1920.mp4` ou `hero-720x1280.mp4`).
- Corre sozinha à chegada (~2,6 s), **uma vez por visita**; **qualquer gesto salta para o final**.
- Reduced motion / Save-Data / vídeo falhou / sem JS → começa no final, com o poster.
- **Aterragem no Work** (README #44): com scroll aterra-se sempre em **I Weddings**; uma lâmina leva a **esse
  capítulo** (e fica em memória para o Method).

## 01 Work (estados 2–6)

| # | O que se vê | Técnica |
|---|---|---|
| **2** | **O vídeo torna-se o palco:** a moldura do vídeo encolhe até à moldura em arco do palco e dissolve-se na primeira fotografia de Weddings; o texto do Work entra ao lado | passagem por scroll: `transform` da moldura do vídeo + opacidade; o vídeo pausa quando deixa de se ver |
| **3** | **I · Weddings**, momento *Before*: palco preso; fotografias em camadas com **aura da própria fotografia**; separadores I/II/III (abaixo da barra); momentos *Before · On the day · After* com **a linha que enche** | palco `sticky`; aura = imagem minúscula desfocada pré-gerada, esticada com máscara radial |
| **4** | **O momento mostra a sua peça:** depois da foto (~1,6 s), a peça principal do momento anima sobre a fotografia inteira (~3,6 s); na lista, a peça tem um círculo e *on the photograph* | uma demonstração de cada vez, `transform`/`opacity` |
| **5** | **II · Artists** — ao descer muda o capítulo: luz e fotografias de Artists; momentos *Always · For a moment · For the record* | a atmosfera nova sobe pelo palco (~1 s); moldura retângulo |
| **6** | **III · Experiences**, momento *During*: o *On-site guide* mostra-se sozinho — é a ponte para o Method | recorte oblíquo; fundo azul-noite |

**As nove peças demonstradas** (README #43): Weddings — *Wedding website* (a foto sobe como página e aparecem as
secções), *Live photo gallery* (chegam as fotografias dos convidados), *One year on* (a data, um ano depois);
Artists — *Portfolio* (as obras deslizam), *Digital exhibition* (entra-se na sala, *Open since 21:14*), *Archive of
works* (índice numerado); Experiences — *Invitation & RSVP* (o convite sobe, *Accept* escolhido), *On-site guide* (o
programa com a hora de quem visita), *Thank-you page* (*Thank you for coming*).

- **Regra única:** o scroll muda o capítulo; o tempo muda o momento; cada momento mostra uma peça. Tocar num
  momento fixa-o; pausa com rato/foco sobre o palco; reduced motion: sem rotação.
- Separadores e lâminas da entrada e ligações das Questions levam à posição de scroll do capítulo.
- Sem JS: três capítulos em sequência, momentos e peças todos visíveis.

## 02 Method — "Feito para quem chega" (estados 7–11)

| # | O que se vê | Técnica |
|---|---|---|
| **7** | **O ecrã multiplica-se:** o guia solta-se e multiplica-se em **seis ecrãs-template iguais** (*LOGO · imagem · Your title · Button*); acende-se **o estúdio com a luz da hora**; *No templates. No copies.* e por baixo **Make it yours** `[ Your name ]`. O nome escrito aparece **igual em todos os templates** | cena presa; estúdio = imagem pré-preparada por faixa horária; campo com `<label>` |
| **8** | **A transformação:** a cada passo uma folha-template levanta-se e sai; por baixo um **ecrã web vivo** composto com a data, a hora e o nome. Desktop: duas a duas; telemóvel: baralho de três | `transform`/`opacity` por scroll; a forma de cada ecrã muda uma vez, ao aparecer |
| **9** | **Todas diferentes:** seis ecrãs (Wedding website, RSVP, Portfolio, Digital exhibition, Event website, On-site guide); o **ecrã em destaque é do capítulo escolhido na entrada** e mexe por dentro. **Telemóvel:** esse ecrã abre-se a ecrã inteiro, por baixo da barra | só o destaque anima por dentro (≤ 6 camadas) |
| **10** | **A primeira página:** os ecrãs juntam-se na **capa** — sem nome *Your first chapter*; com nome *Chapter One · for* + **Ana** como título; *a first/second chapter, begun on Sunday, the twenty-fifth of October, at fourteen past nine* | |
| **11** | **A luz baixa:** a sala escurece; no desktop os ecrãs afastam-se para os lados (discretos), no telemóvel saem; uma luz redonda e calma sobre ***Made once, for one moment.*** (+ *For Ana.*), os quatro passos numa linha e **Talk to us** | luz medida pela largura (nunca esticada no telemóvel); só opacidade |

As **quatro luzes do estúdio** (manhã fria pela esquerda · dia alta e neutra · fim de tarde quente e rasante pela
direita · noite com um candeeiro): papel de fundo curvo, vinheta, grão, sombras dos ecrãs no chão (README #47).
Desktop: ecrãs com moldura de telemóvel; telemóvel: cartões sem moldura (README #38).

## 03 About (estados 12–14)

| # | O que se vê | Técnica |
|---|---|---|
| **12** | **A luz encontra-te:** a frase sai; **na mesma luz, no centro**, aparece o retrato a P&B com ***I'm Flávio.*** pequeno por baixo. No telemóvel a luz sobe até ao retrato | o retrato já está na sala; a luz é uma camada com um "buraco" (imagem) que se move com `transform` |
| **13** | **A sala acende-se:** o retrato vai para o seu lugar; **o nome sobe e torna-se o título** (um só elemento, `transform` medido, a frase só entra depois); fundo com **a atmosfera da fotografia**; a frase *So much around us is made to look the same. Yet each of us lives, feels and creates in our own way.* | grelha editorial no desktop |
| **14** | **A tua história:** parágrafo, crédito *Portrait — Helder Couto · Hover/Hold for colour*, *04 Questions ↓*. **Hover (desktop) / segurar (telemóvel) / foco+Enter** revela a cor do retrato e da sala devagar (~2 s); ao largar volta ao P&B | uma só fotografia (P&B derivado); aura P&B ↔ aura cor por opacidade |

Desktop: etiqueta *Founder · Chapter One* com filete, nome grande, frase como citação, filete, parágrafo + coluna
do crédito. Sem imagem IA (README #50, #52).

## 04 Questions (estados 15–18)

| # | O que se vê | Técnica |
|---|---|---|
| **15** | **As luzes acendem-se:** o papel do estúdio em **pedra da marca**, em plena luz (curva, luz, vinheta, grão); entra a pergunta-âncora *What do you actually create?* + resposta + capítulos | o papel sobe (`transform`) |
| **16** | **As perguntas:** oito, numeradas, entram uma a uma (uma vez) | |
| **17** | **Uma resposta:** um toque desdobra (o + roda para ×); **abrir uma fecha a anterior** | `grid-template-rows: 0fr → 1fr` + fade; `<button aria-expanded>` (ou `<details>` com JS para "uma de cada vez") |
| **18** | Outra resposta (domínio e alojamento) | |

Capítulos: desktop em lista com setas; **telemóvel numa linha** *Weddings | Artists | Experiences* com barras
verticais; ligam ao Work (README #53). Sem rótulo "Questions" por cima da âncora; a primeira pergunta sem filete.

## 05 Contact (estados 19–21)

| # | O que se vê | Técnica |
|---|---|---|
| **19** | **A luz baixa** e, por trás, **o vídeo da entrada muito escuro** (véu de carvão); a pergunta grande, presa um instante: *Is there something that deserves its own experience?* | o mesmo ficheiro de vídeo (sem 2.º pedido); só toca à vista; poster em reduced motion/Save-Data — **medir no Xiaomi** |
| **20** | ***You arrived at 21:14. It's 21:31 now — a good moment to tell us about it.*** + **Talk to us** (*, Ana*) → Instagram + *@chapterone.studio.pt* em texto selecionável | |
| **21** | **Colofão:** ***Built around you.*** (*Built around Ana.*, numa linha no telemóvel) · *Chapter One · 2026* · índice · contactos (Instagram, Telegram @flavius28) | sem *Back to the first page* (o índice basta) |

## O menu (em todas as secções)

Botão **≡ Menu** na barra → o menu **cresce a partir do botão como uma gota** (`clip-path: circle()` ~0,9 s) de
**vidro preparado**: a secção onde se está, numa imagem **já desfocada** (por secção/estado), + película carvão +
brilho de aresta + grão — **nunca `backdrop-filter`**. Conteúdo: *01 Work … 05 Contact* em Cormorant grande (a
atual em itálico com ponto), *Hello, Ana.* com nome, *Talk to us* (Instagram), contactos, a hora. `<dialog>`, foco
preso e devolvido ao botão, Esc; o botão passa a ✕ *Close*; reduced motion: fade (README #56).

---

## Texto aprovado (para `content/v5.ts`)

Entrada: dedicatória `Weekday, D Month · HH:MM` (`Welcome back · …`); título *CHAPTER ONE*; subtítulo *Digital
experiences built for moments worth remembering.*; lâminas *I Weddings · II Artists · III Experiences*.

Work — momentos e peças (Artists e Experiences: a proposta mostrada no storyboard, aprovada com o Work):

| Capítulo | Momento | Peças (a mostrada em **negrito**) |
|---|---|---|
| I Weddings | Before | Save-the-date · **Wedding website** · Digital invitation · RSVP |
| | On the day | Seating plan · Day-of page · **Live photo gallery** |
| | After | Private memory gallery · Thank-you page · **One year on** |
| II Artists | Always | **Portfolio** · Online gallery |
| | For a moment | **Digital exhibition** · Release page |
| | For the record | Press kit · **Archive of works** |
| III Experiences | Before | **Invitation & RSVP** · Event website · Teaser page |
| | During | **On-site guide** · Digital programme · Live gallery |
| | After | Memory archive · Shared gallery · **Thank-you page** |

Rodapé do Work: *Every project is proposed for its occasion.* — As linhas descritivas de cada peça continuam por
redigir (README aberta #3); o texto dentro das demonstrações é o do storyboard (rascunho de interface).

Method: *No templates. No copies.* · *Make it yours* / *Your name* · capa *Chapter One* / *Your first chapter* /
*Chapter One · for* + nome / *a first chapter, begun on {Weekday}, the {ordinal} of {Month}, at {time in words}* ·
***Made once, for one moment.*** (+ *For {Name}.*) · passos *Conversation · Creative direction · Development with
your feedback · Launch & aftercare* · *Talk to us{, Name}*.

About: *Founder · Chapter One* · ***I'm Flávio.*** · *So much around us is made to look the same. Yet each of us
lives, feels and creates in our own way.* · *I have always loved art and the moments that stay with us. Chapter One
is made from the start for each person and each moment, because no two lives are the same.* · *Portrait — Helder
Couto* · *Hover for colour* / *Hold for colour*.

Questions: âncora *What do you actually create?* — *We design and build digital experiences for weddings, artists
and unique occasions, tailored to each project.* Oito perguntas (README #53):

1. **What does it cost?** — There is no price list, because nothing here is made twice. A single piece, such as a
   save-the-date or an RSVP page, starts from €50. Larger experiences, like a complete wedding website, are quoted
   after a first conversation, around what you need.
2. **How long does it take?** — It depends on what we make together. A single piece usually needs about two weeks;
   a complete wedding website, around two months. If your date is close, talk to us and we will tell you honestly
   what is possible.
3. **How does a project work?** — Four steps: Conversation, Creative direction, Development with your feedback, and
   Launch & aftercare. We talk first, agree on a direction together, build it with you, and stay with you once it is
   live.
4. **What do you need from me?** — A first meeting, where we shape the project and sketch the first idea together.
   Then your feedback along the way: we show you the work as it grows, with regular check-ins whenever they help.
5. **Do you work in English and outside Portugal?** — Yes. We are based in Portugal and work in Portuguese and
   English, with people anywhere in the world.
6. **Is it only digital?** — Yes, we make digital experiences. If you would like printed pieces alongside them, we
   can recommend partners, and some custom graphic work can be arranged.
7. **What about the domain and hosting?** — It depends on the project. The domain is not included in the price.
   Maintenance is included for the first year, and we can also set everything up wherever you prefer.
8. **Can you work with my existing team?** — Absolutely. We can collaborate with your planner, photographer, venue
   or creative team to make sure everything works together. *(V4, aprovada)*

Contact: *Is there something that deserves its own experience?* · *You arrived at {HH:MM}. It's {HH:MM} now — a
good moment to tell us about it.* · *Talk to us{, Name}* · *@chapterone.studio.pt* · *Built around you.* /
*Built around {Name}.* · *Chapter One · {year}* · *Index* · *Talk to us* · *Instagram · @chapterone.studio.pt* ·
*Telegram · @flavius28* (TikTok quando existir; email quando houver endereço).

Menu: *01 Work · 02 Method · 03 About · 04 Questions · 05 Contact* · *Hello, {Name}.* · *Talk to us* · *Your time ·
{HH:MM}* · *Menu* / *Close* (nomes acessíveis *Open menu* / *Close menu*).

---

## O que ainda está em aberto (pequeno)

- Linhas descritivas de cada peça do Work (README aberta #3).
- Teste do `ig.me` no telemóvel do owner (aberta #7).
- TikTok e email, quando existirem (#54).
- Valores finos de ritmo e escala (rotação dos momentos, alturas presas, escalas) — afinam-se no protótipo e no
  Xiaomi (aberta #13).
