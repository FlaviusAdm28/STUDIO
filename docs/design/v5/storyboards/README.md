# Storyboards V5 (fontes HTML)

As fontes dos storyboards aprovados a 25 de outubro de 2026. **A especificação escrita está em
`../storyboard.md`**; estes ficheiros são a referência visual.

| Ficheiro | O que é | Versão publicada (privada, do owner) |
|---|---|---|
| `storyboard-principal.html` | **O percurso completo**: entrada E1–E4, estados 1–21, menu, as quatro luzes | https://claude.ai/artifact/9vkDx379vuwuiaXre62cxz |
| `about.html` | O About isolado (com as transições A e B) | https://claude.ai/artifact/5G8FJpVYRoHxo88AQRzx59 |
| `questions.html` | As Questions isoladas | https://claude.ai/artifact/K7YyGSYHnk8gUZDJxdNZJ5 |
| `contact.html` | O Contact isolado | https://claude.ai/artifact/K9RnZgQzKFm2kX4X6Jbu2d |
| `menu.html` | O menu (vidro preparado e real, lado a lado) | https://claude.ai/artifact/8RUxXgEmC4qsWfHT89R7dS |
| `method-fundos.html` | A comparação dos fundos do Method (A céu · B papel · C estúdio) | https://claude.ai/artifact/BXjm27YtSD842RUEP9eARW |

**As imagens não estão no repositório** (o repositório é público e são fotografias do owner): ficam em
`media-src/storyboards-2026-10-25/img/` (fora do Git). Para abrir estes HTML localmente com imagens, copiar essa
pasta `img/` para aqui (`docs/design/v5/storyboards/img/`, que o `.gitignore` exclui). Os ficheiros `about.html`,
`questions.html`, `contact.html` e `menu.html` esperam as suas imagens em `img/` ao lado; as subpastas de
`media-src/storyboards-2026-10-25/` têm cada uma a sua.

Ao abrir localmente sem `<!doctype>`, o browser entra em modo quirks e trata nomes de classes sem distinguir
maiúsculas; os ficheiros já evitam as colisões que isso causava (`.cl`/`.cL`, `.l`/`.L`).
