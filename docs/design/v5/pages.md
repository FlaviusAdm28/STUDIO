# V5 — A página: secções, conteúdo, navegação, componentes

> **Atualizado a 25/10/2026.** O desenho de todas as secções foi refeito e aprovado nesse dia; **a especificação
> vigente, estado a estado e com todo o texto aprovado, está em `storyboard.md`** (e as decisões no README
> #19–#56). As secções abaixo guardam o ponto de partida; onde divergirem, vale `storyboard.md`. Mantêm-se válidos
> daqui: a ordem da página, a numeração, os componentes previstos (atualizados em baixo).

*Uma só página, rota `/`. As rotas `/weddings`, `/artists`, `/experiences` do M1 foram
**removidas** a 29/10 (M2, README #74). Texto: tudo em `content/v5.ts`; o que está marcado
**rascunho** precisa de aprovação do owner.*

---

## 0. Navegação (no estilo da V4, melhorada) — aprovada

> **Revisto a 25/10 (README #56):** já não há índice lateral no desktop. A mesma barra e o mesmo menu em
> todos os ecrãs; desde a #69 (28/10) a barra são duas ilhas de **vidro ao vivo escuro** e o menu é uma gota do mesmo vidro que
> nasce da ilha do menu (ver `storyboard.md`, *O menu*). O texto abaixo é a versão
> anterior, mantida como registo.

O que se mantém da V4 (o owner gosta muito): **a secção atual está sempre visível, com número e nome**
(ex.: `02 Work`), e o **menu abre-se em ecrã inteiro com as secções em serifa grande**.

**Desktop (≥ 960px)** — índice lateral fixo, à esquerda:
- no topo, a secção atual: número pequeno + nome em Cormorant (ex.: `02` · *Work*);
- por baixo, a lista das secções em versaletes pequenos (WORK · METHOD · ABOUT · QUESTIONS · CONTACT),
  a atual marcada;
- no fundo do índice: **Talk to us** (Instagram) e a hora local do visitante (à maneira de Brandon Yasin);
- fundo próprio subtil (não fica por cima de imagens claras sem contraste).

**Mobile (< 960px)** — barra no topo:
- esquerda: número + nome da secção atual (`02 Work`);
- direita: botão de menu (ícone ≡ / ✕, nome acessível "Open menu" / "Close menu").

**Menu de ecrã inteiro** (mobile; opcional no desktop):
- véu **sólido** em carvão (o desfoque `backdrop-filter` da V4 sai — é pesado no Xiaomi);
- secções numeradas em Cormorant grande: `01 Work` · `02 Method` · `03 About` · `04 Questions` ·
  `05 Contact`, a atual marcada com `·`;
- **Talk to us** (Instagram) e a hora local no fundo;
- fecha com ✕ e Esc; foco preso enquanto aberto; foco devolvido ao botão.

**Numeração** (aprovada a 25/10, README #21): a Entrada não entra na numeração → `01 Work · 02 Method ·
03 About · 04 Questions · 05 Contact`.

**Secção atual**: detetada com `IntersectionObserver` (sem custo de scroll). Sem JavaScript, o índice
continua a funcionar como lista de âncoras.

---

## 1. Entrada — "Através das letras" (aprovada)

O que o visitante vê (sequência detalhada em `interactions.md` §1):

1. **Dedicatória pessoal** no topo, pequena e elegante — rascunho:
   *Saturday, 24 October · 21:14* (data e hora locais do visitante, em inglês).
   Variante para quem volta (guardado só no browser): *Welcome back · Saturday, 24 October · 21:14*.
2. **CHAPTER ONE** enorme, em maiúsculas Cormorant, com o vídeo visto por dentro das letras.
3. A câmara entra pelo **O**; o vídeo ocupa o ecrã.
4. Estado final:
   - o título **reaparece centrado, mais pequeno, em letra sólida** sobre o vídeo (README #22);
   - **subtítulo** (aprovado a 25/10, README #20): *Digital experiences built for moments worth
     remembering.*;
   - **três lâminas oblíquas** entram em profundidade, cada uma com imagem + nome:
     `I Weddings` · `II Artists` · `III Experiences` → levam ao capítulo respetivo no Work;
   - **Talk to us** visível (leva ao Instagram); a navegação aparece com este estado.

O que se percebe sem scroll: o que é o Chapter One (título + subtítulo), o que faz (as três lâminas) e
onde clicar.

---

## 2. Work — um palco, três capítulos, três momentos (aprovado)

> **Revisto a 25/10** (README #26–#28): o **scroll muda os capítulos** com o palco preso, os momentos
> **rodam sozinhos** (a palavra enche-se de cor) e param ao toque, e o **desenho está sempre visível** ao
> lado da fotografia, sem botão — o `[ ver o desenho ]` do esquema abaixo deixa de existir. Técnica em
> `interactions.md` §2.

**Estrutura uniforme** — o mesmo componente para os três capítulos:

```
[ I Weddings ]  [ II Artists ]  [ III Experiences ]        ← separadores (tablist)

  ┌───────────────┐   Momento 1 · Momento 2 · Momento 3     ← escolher o momento
  │   imagem do   │
  │   momento     │   Nome do momento (Cormorant itálico)
  │   (camada)    │   • Peça — linha que explica           ← lista de peças
  └───────────────┘   • Peça — linha que explica
                      [ ver o desenho ]                     ← "o feito e o seu desenho"
```

### Conteúdo (aprovado / rascunho)

**I · Weddings** — fotografias reais P&B (Solteiros). Peças **aprovadas**:

| Momento | Imagem | Peças |
|---|---|---|
| **Before** | Solteiros **002** | Save-the-date · Wedding website · Digital invitation · RSVP |
| **On the day** | Solteiros **154** | Seating plan · Day-of page · Live photo gallery |
| **After** | Solteiros **343** | Private memory gallery · Thank-you page · One year on |

**II · Artists** — imagens IA. Momentos e distribuição das peças: **rascunho, por aprovar** (decisão
aberta #4). Peças vêm da lista aprovada (*Portfolios, Online galleries, Digital exhibitions, Release
pages, Press kits, Archives of work*):

| Momento | Imagem (IA) | Peças |
|---|---|---|
| **Always** | Estúdio de artista ao entardecer | Portfolio · Online gallery |
| **For a moment** | Galeria Âmbar em Silêncio | Digital exhibition · Release page |
| **On record** | Portfólio de Luz e Texturas | Press kit · Archive of works |

**III · Experiences** — imagens IA. **Rascunho, por aprovar** (peças derivadas da investigação V4 §6):

| Momento | Imagem (IA) | Peças |
|---|---|---|
| **Before** | Convite elegante à entrada iluminada | Invitation & RSVP · Event website · Teaser page |
| **During** | Concerto Íntimo em Luz Âmbar | On-site guide · Digital programme · Live gallery |
| **After** | Banquete ao Amanhecer na Villa Histórica | Memory archive · Shared gallery · Thank-you page |

**Linhas descritivas de cada peça** — o agente redige (1 linha, concreta, sem superlativos), o owner
aprova antes de entrar em `content/v5.ts`. Exemplo de tom:
*Live photo gallery — guests add their photos by QR code during the day.*

**Rodapé do Work** (rascunho): *Every project is proposed for its occasion.* + Talk to us.

---

## 3. Method — "Feito para quem chega" (aprovado a 25/10, README #30–#39)

Conteúdo **aprovado**: *No templates · No copies · Built around you · Nothing made to fit twice.*
Passos (do texto aprovado das Questions): **Conversation → Creative direction → Development with your
feedback → Launch & aftercare**. Frase final: ***Made once, for one moment.***

Apresentação: o desenho da última peça do Work multiplica-se em ecrãs-template iguais; sobe o **céu da
hora** de quem chega; *No templates. No copies.* + **Make it yours**; os templates transformam-se em
**ecrãs de experiências web vivas** (6 no desktop, 3 no telemóvel) com o momento e o nome de quem chega;
juntam-se na capa do capítulo dele; a luz do estúdio baixa e fica a frase final + Talk to us (README #48).
Especificação em `interactions.md` §3; referência visual no storyboard v3.1
(https://claude.ai/artifact/9vkDx379vuwuiaXre62cxz).

---

## 4. About (aprovado)

- Uma frase grande sobre quem és (estilo Brandon Yasin), o retrato **124** (cor; P&B derivado; segurar
  para a cor), e **a dedicação ao trabalho** em três pontos.
- Opcional: a imagem IA *Espaço de trabalho ao entardecer* como segunda imagem.
- **Texto: em falta** (decisão aberta #5). Texto aprovado da V4 que pode servir de base:
  *We stay close to every detail.* · *We work directly with our clients from the first conversation to
  the final detail, shaping every experience around the occasion itself.* · *No templates. No copies.
  Nothing made to fit twice.* (as linhas finais passam para o Method).

---

## 5. Questions (texto aprovado, em `content/v5.ts`)

Âncora *What do you actually create?* + seis perguntas (preço, serviços, processo, prazos, colaboração,
depois do lançamento), em `<details>` nativo. A pergunta de serviços pode ligar a cada capítulo do Work.

---

## 6. Contact

- Pergunta aprovada (V4): *Is there something that deserves its own experience?* + *Tell us about it.*
- Toque pessoal (rascunho): *It's 21:14 where you are — a good moment to tell us about it.*
- Canal: **Instagram** — perfil `https://www.instagram.com/chapterone.studio.pt/` (verificado);
  `ig.me/m/chapterone.studio.pt` só depois de testado pelo owner (`content/v5.ts`, `messageVerified`).
- Chamada: **Talk to us** (com o nome, se o visitante o escreveu no Method: *Talk to us, Ana.*).
- Rodapé: secções, Instagram, *No templates. No copies.* (pequeno, junto ao Talk to us — por confirmar,
  README aberta #12), *Photographs — Helder Couto*.

---

## Componentes previstos

| Componente | Tipo | Notas |
|---|---|---|
| `SiteBar` (a mesma barra em todos os ecrãs) | servidor + ilha `NavState` | secção atual por IntersectionObserver; hora |
| `MenuOverlay` | ilha | `<dialog>`, gota por `transform: scale` com vidro ao vivo (README #69), foco preso, Esc |
| `Entrance` | servidor + ilha `EntranceSequence` | vídeo, letras-janela SVG, dedicatória, lâminas |
| `LocalMoment` | ilha | data/hora local, faixa da hora, *welcome back* (localStorage com try/catch) |
| `WorkStage` | servidor + ilha `WorkStage` | palco preso; separadores; aura; camadas; rotação dos momentos; 9 demonstrações |
| `PieceList` / `PieceDemo` | servidor + CSS | lista do momento; demonstração da peça principal |
| `Method` (+ `MadeForYou`) | servidor + ilha | "Feito para quem chega"; lê o momento da chegada de `LocalMoment` |
| `About` (+ ilha do retrato e do nome) · `QuestionList` (+ ilha "uma aberta") · `Contact` (+ vídeo) · `Colophon` | servidor | |
| `LocalMoment` → também `ArrivalStore` | ilha | hora de chegada, faixa, nome, já cá esteve, capítulo escolhido (memória da página) |
| `Picture` | reescrito no M2 (29/10) | `src/components/picture.tsx` |
| `ColourReveal` | a escrever (M7) | o do M1 saiu com a limpeza |
