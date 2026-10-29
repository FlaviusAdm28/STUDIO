# Storyboards V5 (fontes HTML)

As fontes dos storyboards aprovados a 25 de outubro de 2026. **A especificação escrita está em
`../storyboard.md`**; estes ficheiros são a referência visual.

| Ficheiro | O que é | Versão publicada (privada, do owner) |
|---|---|---|
| `storyboard-principal.html` | **O percurso completo**: entrada E1–E4, estados 1–21, menu, as quatro luzes | https://claude.ai/artifact/9vkDx379vuwuiaXre62cxz |
| `about.html` | O About isolado (com as transições A e B) | https://claude.ai/artifact/5G8FJpVYRoHxo88AQRzx59 |
| `questions.html` | As Questions isoladas | https://claude.ai/artifact/K7YyGSYHnk8gUZDJxdNZJ5 |
| `contact.html` | O Contact isolado | https://claude.ai/artifact/K9RnZgQzKFm2kX4X6Jbu2d |
| `menu.html` | O menu (vidro preparado e real, lado a lado) — **histórico**: o vidro decidido está na README #69 e no storyboard principal | https://claude.ai/artifact/8RUxXgEmC4qsWfHT89R7dS |
| `linhas-das-pecas.html` | **Decisão #60** (26/10; escolhida a D): quatro versões de onde e como aparece a linha de cada peça no Work (A só a peça mostrada · B todas · C uma escolhida · D desktop todas, telemóvel uma escolhida) | https://claude.ai/artifact/1SyUrVinmfSgGASdZzG16E |
| `work.html` | **Decisão #61** (26/10): só o Work (a funcionar + estados 3–6) com as linhas das peças (#60) e a proposta de tirar filetes e sublinhados; botão para comparar com o aprovado | https://claude.ai/artifact/FApw8RKTQhXoJFhhSAHs2q |
| `work-capitulos.html` | **Decisão #62** (26/10): os capítulos do Work — o título é a navegação, o capítulo atual à esquerda, e a passagem entre capítulos (por aprovar) | https://claude.ai/artifact/7hELbfAYN2P6zxsdRdNMuS |
| `barra-marca.html` | **Decisão #67 (27/10)**: o nome na barra (A escolhida), o fundo da barra (véu, vidro preparado, ao vivo; com e sem aresta), o botão do menu (três traços no telemóvel) e a abertura (a gota) — **histórico para o vidro**: decidido a 28/10 (#69) na página de teste `D:\STUDIO-tools\glass-test-1027` e passado ao storyboard principal (versão 41) | https://claude.ai/artifact/5A9tEMEjWvBCWCNLCgH4CQ |
| *(fora do repositório)* `D:\STUDIO-tools\glass-test-1027\composicao.html` | **Decisão #71 (28/10): a referência da barra.** As secções reais com sete barras para comparar; abre por defeito na **A2** (escolhida). Cópia congelada `composicao-aprovada-2810.html`. Servir com `python -m http.server 3200` nessa pasta. **O storyboard principal (versão 41) mostra o aspeto da A2 com os tamanhos antigos** — para os tamanhos e o alinhamento da barra, vale esta página | local |
| `method-fundos.html` | A comparação dos fundos do Method (A céu · B papel · C estúdio) | https://claude.ai/artifact/BXjm27YtSD842RUEP9eARW |

**As imagens não estão no repositório** (o repositório é público e são fotografias do owner): ficam em
`media-src/storyboards-2026-10-25/img/` (fora do Git). Para abrir estes HTML localmente com imagens, copiar essa
pasta `img/` para aqui (`docs/design/v5/storyboards/img/`, que o `.gitignore` exclui). Os ficheiros `about.html`,
`questions.html`, `contact.html` e `menu.html` esperam as suas imagens em `img/` ao lado; as subpastas de
`media-src/storyboards-2026-10-25/` têm cada uma a sua.

Ao abrir localmente sem `<!doctype>`, o browser entra em modo quirks e trata nomes de classes sem distinguir
maiúsculas; os ficheiros já evitam as colisões que isso causava (`.cl`/`.cL`, `.l`/`.L`).
