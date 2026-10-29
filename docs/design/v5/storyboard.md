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
   | Já cá esteve | `localStorage` (`c1.lastVisit`), com try/catch; **conta como regresso só se a última visita foi há mais de 30 min** (um refresh nunca dá *Welcome back*); sem prazo (README #66) | *Welcome back* na dedicatória; *second chapter* na capa (**sempre *second*, nunca se conta**) |
   | Capítulo escolhido na entrada | clique numa lâmina (memória da página) | aterragem no Work; ecrã em destaque do Method |

6. **Voz:** *we* em todo o site; *I* só no About (README #51). Site em inglês.

---

## Entrada — "Através das letras" (E1–E4)

| | O que se vê | Técnica |
|---|---|---|
| **E1** | Carvão. Só a **dedicatória**, **logo acima de onde vai aparecer o título** (não no topo): *Sunday, 25 October · 21:14* (*Welcome back · …* para quem volta) | opacidade, 600 ms |
| **E2** | **CHAPTER ONE** enorme; **o vídeo vê-se por dentro das letras** | véu SVG carvão com o texto recortado (máscara) por cima do `<video>`; anima-se só com `transform` |
| **E3** | **A câmara entra pela letra O**: **o vídeo fica parado e é o véu que avança** — o véu com as letras recortadas cresce até a letra cobrir o ecrã, enquanto a imagem avança um pouco (de 1,14 para 1), como uma câmara a entrar | `transform: scale(~120)` **no véu** (medido 27/10: com ~60 o desktop ficava 40 % escuro; origem no meio do traço) (nunca na imagem recortada: escalar a imagem com as letras transforma-a numa mancha), origem **no traço esquerdo do O** — a letra é a janela, o miolo do O é véu. Letra-janela num peso mais forte de Cormorant (500/600, +1 ficheiro). Plano B: véu rasterizado |
| **E4 = estado 1** | Vídeo em ecrã inteiro com a **tinta da hora**; **a dedicatória fica, no topo, por cima do título** (README #64); **CHAPTER ONE** reaparece centrado e mais pequeno, em letra sólida; subtítulo *Digital experiences built for moments worth remembering.* em Cormorant itálico, como a dedicatória (README #79); **três lâminas oblíquas** *I Weddings · II Artists · III Experiences*; a barra | lâminas em `clip-path` oblíquo, entram em profundidade (translate + leve rotação, 120 ms entre elas) |

- **E3 é só a passagem** (~1,2 s, de 1,4 a 2,6 s): nunca fica parado; no storyboard aparece fixo só para se ver o
  meio do movimento.
- **O vídeo carrega e toca desde o primeiro instante**, por trás do véu (já no E1); por isso **no E2 vê-se o vídeo em
  movimento dentro das letras**. Se a rede ainda não o tiver, vê-se o poster (o mesmo fotograma) até arrancar —
  nada bloqueia nem fica preto. Um só pedido por formato de ecrã (`hero-1920.mp4` ou `hero-720x1280.mp4`).
- Corre sozinha à chegada (~2,6 s), **uma vez por carregamento** (um refresh no topo mostra-a outra vez); **qualquer gesto
  salta para o final**. **O E4 é o topo da página** (README #66): o E1–E3 não são lugares da página, são a chegada; ao voltar
  ao topo vê-se o E4, a entrada não se repete.
- Reduced motion / Save-Data / vídeo falhou / sem JS → começa no final, com o poster.
- **Aterragem no Work** (README #44): com scroll aterra-se sempre em **I Weddings**; uma lâmina leva a **esse
  capítulo** (e fica em memória para o Method).

## 01 Work (estados 2–6)

| # | O que se vê | Técnica |
|---|---|---|
| **2** | **O vídeo torna-se o palco:** a moldura do vídeo encolhe até à moldura em arco do palco e dissolve-se na primeira fotografia de Weddings; o texto do Work entra ao lado | passagem por scroll: `transform` da moldura do vídeo + opacidade; o vídeo pausa quando deixa de se ver |
| **3** | **I · Weddings**, momento *Before*: palco preso; fotografias em camadas com **aura da própria fotografia**; **sem separadores debaixo da barra: o título é a navegação** (README #62) — o capítulo atual grande, sempre à esquerda, numeral do tamanho da palavra; os outros a seguir, pequenos (telemóvel: à direita do título, o seguinte maior e o único tocável, I → II → III → I); momentos *Before · On the day · After*: **a palavra do momento enche-se com o tom das fotografias do capítulo** e, cheia, passa à seguinte (os já passados ficam apagados); lista das peças com filetes, **a peça mostrada em primeiro** e a linha de cada peça (README #60, #61) | palco `sticky`; aura = imagem minúscula desfocada pré-gerada, esticada com máscara radial; palavra que enche = cópia na cor aberta com `clip-path` |
| **4** | **O momento mostra a sua peça:** depois da foto (~1,2 s), a peça principal do momento anima sobre a fotografia inteira (~2,8 s) — o momento dura **4 s**, o tempo da palavra a encher (README #73); na lista, a peça é a primeira, com um círculo e *on the photograph* | uma demonstração de cada vez, `transform`/`opacity` |
| **5** | **II · Artists** — ao descer muda o capítulo: luz e fotografias de Artists; momentos *Always · For a moment · On record* | a atmosfera nova sobe pelo palco (~1 s); moldura retângulo |
| **6** | **III · Experiences**, momento *During*: o *On-site guide* mostra-se sozinho — é a ponte para o Method | recorte oblíquo; fundo azul-noite |

**As nove peças demonstradas** (README #43): Weddings — *Wedding website* (a foto sobe como página e aparecem as
secções), *Live photo gallery* (chegam as fotografias dos convidados), *One year on* (a data, um ano depois);
Artists — *Portfolio* (as obras deslizam), *Digital exhibition* (entra-se na sala, *Open since 21:14*), *Archive of
works* (índice numerado); Experiences — *Invitation & RSVP* (o convite sobe, *Accept* escolhido), *On-site guide* (o
programa com a hora de quem visita), *Thank-you page* (*Thank you for coming*).

- **Regra única:** o scroll muda o capítulo; o tempo muda o momento; cada momento mostra uma peça. Tocar num
  momento fixa-o; pausa com rato/foco sobre o palco; reduced motion: sem rotação. **Depois do último momento volta ao
  primeiro, no mesmo capítulo** — o tempo nunca muda o capítulo (README #61).
- **Capítulos (README #62):** o Work começa sempre em *I Weddings*, salvo se a pessoa escolheu outra lâmina na entrada.
  Ao mudar de capítulo, o que chega cresce e desliza para a esquerda; os outros apagam-se e voltam pequenos nos seus
  lugares; o texto que sai esbate-se no lugar enquanto o novo entra por opacidade (FLIP, só `transform`/`opacity`; reduced motion: sem
  passagem). **A passagem está em aberto** (README aberta #28). No
  telemóvel o capítulo seguinte tem área de toque de 44 px; o outro é só texto.
- **Linhas no ecrã (README #61):** só os filetes entre as peças de cada momento; nem sublinhado nos capítulos nem
  linha por baixo dos momentos.
- Os capítulos no título, as lâminas da entrada e as ligações das Questions levam à posição de scroll do capítulo.
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

**A barra (README #67 e #69):** **duas ilhas de vidro**. À esquerda **o nome e a secção** — *Chapter One | 03 About*
(o nome em Cormorant, um filete fino, a secção); **no topo (E4) não há ilha do nome** — o título *CHAPTER ONE* já é o
nome; a ilha entra com o Work (estado 2), enquanto o título sai (README #70). No E4 fica só a ilha do menu. **Clicar no nome sobe ao topo e mostra a entrada
outra vez** (qualquer gesto salta para o E4; reduced motion / sem JS: só o topo). À direita: no desktop a hora, *Talk to us*
e **≡ Menu** (a palavra fica; *Close* com o menu aberto); no telemóvel **três traços de comprimentos diferentes (100 / 70 /
85 %), sem palavra, num círculo de vidro**, que viram **X** ao abrir (os de fora cruzam-se, o do meio recolhe-se) —
`aria-label` *Menu* / *Close menu*, 44 px de toque. O meio fica aberto. As duas ilhas à mesma distância da borda, com a
mesma altura e o mesmo centro (telemóvel 10 px e 56 px; ≤ 380 px 8 px e 52 px; desktop 20 px e 64 px).

**A barra afinada (README #71, 28/10 — A2):** as ilhas estão **sempre lá**, **discretas** (só desfoque e escuro, um fio
de luz, sem brilho nem sombra), **mais pequenas** (44 px no telemóvel, 48 no desktop) com as bordas nas margens da página, e
mais ar até ao conteúdo (44 / 64 px). O escuro mede-se só por baixo das palavras e fica no máximo a .50; sobre o papel claro
as palavras levam uma sombra escura própria. Referência: `D:\STUDIO-tools\glass-test-1027\composicao.html`.

**O vidro (README #69, aprovado a 28/10):** vidro ao vivo estilo iOS — desfoque **8 px no telemóvel, × 1,6 no desktop**,
saturação 1,6, brilho diagonal, aro de luz e **lente** no bordo de cada ilha (o fundo dobra e aumenta nos últimos 14 px).
**Vidro escuro adaptável:** a tinta é sempre linho; o vidro nunca passa a claro — sobre fundos claros **escurece mais**,
cada ilha pelo brilho real do que tem por trás (de .06 sobre o carvão a ~.70 sobre o papel), recalculado no scroll no
máximo de 80 em 80 ms, com 0,45 s de transição.

**O menu:** **ocupa o ecrã** e **cresce como uma gota que nasce na ponta redonda direita da ilha do menu** (no telemóvel, o
círculo do botão), já do tamanho dessa ponta — um círculo de vidro por `transform: scale`, 0,9 s (**não `clip-path`**: dava
flicks no Chrome Android). O mesmo vidro, mais desfocado (× 1,4), com película escura, **mais densa quando a parte por
trás das palavras é clara**. Conteúdo: *01 Work … 05 Contact* em Cormorant grande, **números a ~0,42 da palavra, em
itálico, com algarismos alinhados** (a atual em itálico com ponto), *Hello, Ana.* com nome, *Talk to us* (Instagram),
contactos, a hora; **sombra suave no texto**. As palavras entram uma a uma quando a gota as cobre (a partir de 0,32 s);
ao fechar saem primeiro. `<dialog>`, foco preso e devolvido ao botão, Esc; reduced motion: fade (README #56).

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
| | On record | Press kit · **Archive of works** |
| III Experiences | Before | **Invitation & RSVP** · Event website · Teaser page |
| | During | **On-site guide** · Digital programme · Live gallery |
| | After | Memory archive · Shared gallery · **Thank-you page** |

Rodapé do Work: *Every project is proposed for its occasion.* — O texto dentro das demonstrações é o do storyboard
(rascunho de interface).

**Linhas de cada peça** (README #3, fechada; aprovadas uma a uma pelo owner a 26/10). No storyboard visual estão
na secção *As linhas de cada peça*. **Como aparecem no Work** (README #60, fecha a aberta #25): **desktop, todas as linhas**
por baixo dos nomes; **telemóvel, uma de cada vez**, aberta logo debaixo do nome escolhido (de início a peça mostrada;
um toque ou foco + Enter noutro nome abre a dele). **A peça mostrada é sempre a primeira da lista**; as outras seguem
pela ordem da tabela. Sem JavaScript: todas as linhas. Referência: https://claude.ai/artifact/1SyUrVinmfSgGASdZzG16E, versão D.

| Peça | Linha | Estado |
|---|---|---|
| I Weddings · Save-the-date | *Your date, announced in your own way, before anything else is decided.* | aprovada 26/10 |
| I Weddings · Wedding website | *One complete site for your wedding: your story, the day and how to get there, the tables, the menu, and a live gallery that stays open after the day.* | aprovada 26/10 |
| I Weddings · Digital invitation | *The invitation itself, written and shaped for the two of you, made to be opened on a phone: the words, the date, the place and the way there.* | aprovada 26/10 (redação do owner) |
| I Weddings · RSVP | *Your guests reply in a minute: who is coming, what they would like to eat, and anything you should know.* | aprovada 26/10 |
| I Weddings · Seating plan | *The tables, laid out as they are in the room, so everyone finds their place on their phone, as they arrive.* | aprovada 26/10 (redação do owner; promete a planta da sala) |
| I Weddings · Day-of page | *The day, hour by hour: when the ceremony begins, when dinner is served, and where everyone should be.* | aprovada 26/10 (distinguir do *On-site guide* de Experiences) |
| I Weddings · Live photo gallery | *Your guests add their photos as the day unfolds, and everyone sees them appear, together, in one place.* | aprovada 26/10 |
| I Weddings · Private memory gallery | *Your photographer's and your guests' photos, kept together in a private place, and only you choose who sees them.* | aprovada 26/10 (redação do owner, com ajuste de gramática aceite) |
| I Weddings · Thank-you page | *The last page of the day: a thank-you your guests will want to keep.* | aprovada 26/10 (distinguir da *Thank-you page* de Experiences) |
| I Weddings · One year on | *A year later, the day comes back: a page that opens on your anniversary, with the moments you chose to keep.* | aprovada 26/10 |
| II Artists · Portfolio | *Your work, shown the way you see it: an artist's site built around your pieces, not around a template.* | aprovada 26/10 |
| II Artists · Online gallery | *A gallery that never closes, where each piece can be seen up close and at its own pace.* | aprovada 26/10 |
| II Artists · Digital exhibition | *Your exhibition, opened to anyone, anywhere, for as long as it runs.* | aprovada 26/10 |
| II Artists · Release page | *Your new work, announced with the same care you put into making it.* | aprovada 26/10 |
| II Artists · Press kit | *The page you send before anyone asks: who you are, what you make, and how to reach you.* | aprovada 26/10 |
| II Artists · Archive of works | *Every work you have made, numbered and dated, in an archive that grows with you.* | aprovada 26/10 |
| III Experiences · Invitation & RSVP | *The invitation and the reply in one gesture: your guests open it, read it, and accept.* | aprovada 26/10 |
| III Experiences · Event website | *Your event, given its own address and its own look, from the first announcement to the day itself.* | aprovada 26/10 |
| III Experiences · Teaser page | *A first glimpse, before anything is revealed: enough to make people curious, not enough to say it all.* | aprovada 26/10 |
| III Experiences · On-site guide | *What is happening now, what comes next and where to find it, open on every guest's phone while they are there.* | aprovada 26/10 |
| III Experiences · Digital programme | *Everything you would hand out on paper, made to be read on a phone and kept afterwards.* | aprovada 26/10 |
| III Experiences · Live gallery | *The event as it happens, in photos from everyone in the room, gathered while it is still going on.* | aprovada 26/10 |
| III Experiences · Memory archive | *A record of the occasion, for the people who were there and for those who will ask about it.* | aprovada 26/10 |
| III Experiences · Shared gallery | *One link for every guest, with the official photos and their own, side by side.* | aprovada 26/10 |
| III Experiences · Thank-you page | *A thank-you to everyone who came, with a moment from the event and a word on what comes next.* | aprovada 26/10 (redação do owner) |

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

- Teste do `ig.me` no telemóvel do owner (aberta #7).
- TikTok e email, quando existirem (#54).
- Valores finos de ritmo e escala (rotação dos momentos, alturas presas, escalas) — afinam-se no protótipo e no
  Xiaomi (aberta #13).
