# V5 — Roteiro de implementação

*Ordem acordada a 24/10/2026. Cada marco termina com validação (`acceptance.md`) e revisão do owner.
Sem commits/pushes/deploys sem pedido explícito.*

## M2 — Preparação (autorizado a 25/10)

- [x] Perguntas ao owner; todo o percurso desenhado e aprovado (README #19–#56; `storyboard.md`).
- [ ] **Organizar assets** em `media-src/` (`assets.md` §5; SHA-1; nunca mover; nada na V4).
- [ ] **Derivados** de `assets.md` §7 (incluindo auras, estúdios, luz com furo, desfocados do menu, posters).
- [ ] **Texto aprovado** para `content/v5.ts` (`storyboard.md` §Texto aprovado; *Talk to us* em vez de *Start a project*).
- [ ] **Limpeza** do código da "secretária" e das rotas `/weddings|/artists|/experiences` — **mostrar a lista
      exata ao owner antes de apagar**.
- [ ] typecheck, lint, build.

## M3 — Entrada (E1–E4 e estado 1)

- [ ] Vídeo + tinta da hora + véu SVG com CHAPTER ONE + entrar pelo **traço** do O + título/subtítulo + lâminas +
      dedicatória + *welcome back*; qualquer gesto completa; reduced motion / Save-Data / sem vídeo / sem JS.
- [ ] **Medir no Xiaomi primeiro** (plano B: véu rasterizado).
- [ ] Passagem **estado 2** (o vídeo torna-se o palco), medida no Xiaomi.

## M4 — Barra e menu

- [ ] `SiteBar` + `MenuOverlay` (gota `clip-path`, vidro preparado, `<dialog>`), secção atual por IntersectionObserver.

## M5 — Work (estados 3–6)

- [ ] Palco preso, separadores, aura, camadas, rotação dos momentos, **nove demonstrações**, aterragem por capítulo.
- [ ] Redigir as linhas descritivas das peças → aprovação (aberta #3).
- [ ] Xiaomi: mudar de capítulo e de momento sem quebras.

## M6 — Method (estados 7–11)

- [ ] Estúdio por hora, templates → ecrãs, *Make it yours*, ecrã em destaque por capítulo, capa, a luz baixa.
- [ ] **A cena mais pesada**: medir no Xiaomi a seguir à entrada.

## M7 — About, Questions, Contact (estados 12–21)

- [ ] About (luz que encontra o retrato, nome FLIP, cor por gesto, atmosfera), Questions (pedra, uma aberta),
      Contact (vídeo escuro, linha da hora, *Talk to us*, colofão). Nova imagem de partilha.

## M8 — Validação final

- [ ] Todos os viewports, teclado, reduced motion, sem JS, Xiaomi, (iPhone pelo owner).
- [ ] Teste de compreensão com 3–5 pessoas.
- [ ] Decisão do owner sobre preview/produção (só com pedido explícito).
