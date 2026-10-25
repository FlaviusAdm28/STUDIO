# V5 — Direção criativa: "First Page"

*Aprovada pelo design owner a 24/10/2026. Substitui as direções anteriores da V5 ("A Edição" em papel e
"a secretária sob a lâmpada"), registadas em `history.md`.*

## O conceito

O nome do estúdio é literal: **a primeira página de um capítulo, composta no instante para quem chega.**
O site repara na pessoa — a data e a hora dela, a luz da hora dela, se já cá esteve — e abre como uma
experiência e não como uma página. Depois, com calma e clareza, mostra o que o estúdio faz.

Três qualidades, por esta ordem:

1. **Calma e segurança artística.** Tons de pedra e linho, transições lentas e suaves, muito espaço,
   nada a piscar ou a saltar. Quem chega sente que está em boas mãos.
2. **WOW à chegada.** Uma entrada artística, fora do padrão, que se vê logo — sem obrigar a esperar.
3. **Clareza comercial.** Em segundos percebe-se o que é o Chapter One e o que se pode contratar.

**Não é uma evolução do site original** (V1–V4, o "filme" com scroll preso). Desse site recupera-se
apenas um asset — o vídeo da silhueta ao pôr do sol — e uma lição de navegação (a secção atual sempre
visível). Tudo o resto é novo.

## Referências e o que se leva de cada

(Estudadas no browser; análise completa em `research/creative-research.md` §3.)

| Referência | Princípio que a V5 adota |
|---|---|
| **Cartier — Le Chœur des Pierres** | Objetos preciosos sobre um fundo calmo; **tocar num objeto abre a sua história** e a cor dele inunda o ecrã; "o feito e o seu desenho" (a peça e o seu guache) |
| **Belgrade Arbor** | Fotografias **recortadas em formas próprias** que se transformam umas nas outras; camadas em profundidade; ação comercial sempre à mão |
| **Sobha Privy Collection** | Escala cinematográfica; **itálico caligráfico + maiúsculas serifadas**; navegação por **capítulos numerados** |
| **Brandon Yasin** | Interface mínima e precisa em letra pequena; **hora local**; o trabalho como protagonista com legendas curtas |

E o que **não** se leva: scroll sequestrado ou horizontal, preloaders, texto revelado palavra a palavra,
WebGL e vídeo pesado — os problemas que estas referências têm e que a V5 tem de evitar.

## Atmosfera e paleta (aprovada)

| Token | Valor | Uso |
|---|---|---|
| `--charcoal` | `#1E1D1A` | Fundo principal — escuro quente, não preto |
| `--moss` | `#2C332D` | Fundo secundário (blocos, superfícies de apoio), à maneira da Belgrade |
| `--linen` | `#EEE8DD` | Texto principal e superfícies claras de leitura |
| `--stone` | `#D8D0C2` | Superfícies claras secundárias (Method, Questions — opcional) |

- **A cor forte vem só das imagens** (como as pedras da Cartier). A interface usa cor apenas para estado.
- Ritmo: transições de 0,8–1,2 s com curva suave (`cubic-bezier(0.2, 0.7, 0.2, 1)` como ponto de
  partida); nada linear, nada elástico.
- Contraste mínimo AA em todo o texto (verificar cada par com cálculo, como no M1).

## Tipografia (aprovada)

- **Cormorant Garamond** — o que "fala": títulos, o CHAPTER ONE da entrada (maiúsculas, com
  espaçamento generoso), números de capítulo e momentos em **itálico** (à maneira da Sobha).
- **Schibsted Grotesk** — o que se lê e opera: texto corrido, interface, etiquetas em versaletes
  pequenas e espaçadas (à maneira de Brandon Yasin).
- Já configuradas em `src/fonts/index.ts` (subconjunto `latin`, que cobre o português; 3 ficheiros).
  Se a entrada precisar de um peso mais forte de Cormorant para as letras-janela (letras grossas deixam
  ver mais vídeo), avaliar acrescentar **500 ou 600** — custo ~40 KB por peso; decidir no protótipo.

## A estrutura (página única)

1. **Entrada** — "Através das letras" (o momento WOW e pessoal).
2. **Work** — um palco, três capítulos (Weddings, Artists, Experiences), três momentos cada, por camadas.
3. **Method** — como trabalhamos; *No templates · No copies · Built around you · Nothing made to fit twice*.
4. **About** — quem sou, dedicação ao trabalho.
5. **Questions** — as seis perguntas aprovadas.
6. **Contact** — Instagram, com o toque pessoal da hora.

Especificação de cada secção em `pages.md`; de cada interação em `interactions.md`.

## Princípios de execução

- **Nada bloqueia.** O scroll e os links funcionam desde o primeiro milissegundo; qualquer gesto completa
  a animação da entrada.
- **Animação por gesto, na chegada ou em passagens ligadas ao scroll** (revisto a 25/10): passagens em
  CSS, só transform/opacity, uma cena presa de cada vez, medidas no Xiaomi (`interactions.md` §0). O WOW
  é prioridade; o limite é o lag medido, não a técnica.
- **Leve por construção**: transformações, opacidade, clip-path e traços SVG; sem WebGL, sem
  `backdrop-filter`, sem desfoques animados grandes; vídeo só na entrada, recodificado e pequeno.
- **Alvo mínimo: Xiaomi Mi 11 Lite sem lag**, medido no próprio telemóvel em cada marco
  (`acceptance.md`).
- **Acessível**: teclado, foco visível, alternativas a gestos, `prefers-reduced-motion` com versão
  desenhada, conteúdo completo sem JavaScript.
- **Honesto**: nada de projetos, clientes, números ou preços inventados; o texto vive em `content/v5.ts`.
