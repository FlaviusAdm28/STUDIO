# V5 — Roteiro de implementação

*Ordem acordada a 24/10/2026. Cada marco termina com validação (`acceptance.md`) e revisão do owner.
Sem commits/pushes/deploys sem pedido explícito.*

## Como se constrói: por módulos (owner, 29/10 — README #75)

Um módulo de cada vez, pela ordem da página; **o seguinte só começa quando o anterior está fechado**:

1. Construir só esse módulo, sobre o esqueleto (o resto da página fica como está, legível).
2. Validar por inteiro: typecheck, lint, build; os cinco viewports; teclado, reduced motion, sem JS
   (`next start`); sem overflow; contraste; **medir no Xiaomi** (fps, p95, frames > 25 ms) e ver no PC numa
   janela de Chrome visível.
3. O owner vê e aprova (no PC e no Xiaomi).
4. Commit próprio do módulo (só quando o owner pedir) e registo no handoff.

A passagem que liga dois módulos pertence ao módulo que chega (o estado 2, entrada → Work, vai com o Work).

## M2 — Preparação (autorizado a 25/10)

- [x] Perguntas ao owner; todo o percurso desenhado e aprovado (README #19–#56; `storyboard.md`).
- [x] **Organizar assets** em `media-src/` (`assets.md` §5; SHA-1; nada na V4) — 29/10.
- [x] **Derivados** da fotografia e do vídeo (posters, Work, Method, About, auras) — 29/10. Os fundos do estúdio,
      a luz com furo e a sombra de ecrã fazem-se no M6; a imagem de partilha no M7.
- [x] **Texto aprovado** em `content/v5.ts`, por secção; tempos em `content/tuning.ts` (#59) — 29/10. Alt text verificado contra
      cada imagem (#75); *Skip to content* fica rascunho.
- [x] **Limpeza** — lista mostrada e aprovada pelo owner; foi mais longe: a V5 refeita do zero (README #74), 29/10.
- [x] typecheck, lint, build — 29/10.

## M3 — Entrada (E1–E4 e estado 1)

- [x] Vídeo + tinta da hora + véu SVG com CHAPTER ONE + entrar pelo **traço** do O + título/subtítulo + lâminas +
      dedicatória + *welcome back*; qualquer gesto completa; reduced motion / Save-Data / sem vídeo / sem JS — 29/10.
- [x] **Medido no Xiaomi** — 90,5 fps, p95 11,2 ms, 0 frames > 25 ms em todas as fases (5 corridas), com o véu
      rasterizado pela GPU (`will-change`; sem ele 48–58 fps). O plano B (imagem) não foi preciso.
- [ ] **Aprovação do owner** no PC e no Xiaomi; abertas #31 (tinta), #32 (contraste), #33 (janela do O).

## M4 — Barra e menu

- [ ] `SiteBar` (duas ilhas, vidro ao vivo com lente e escuro adaptável) + `MenuOverlay` (gota por `transform: scale`, `<dialog>`) — README #69; secção atual por IntersectionObserver.

## M5 — Work (estados 3–6)

- [ ] Passagem **estado 2** (o vídeo da entrada torna-se o palco), medida no Xiaomi — veio do M3 (#75).
- [ ] Palco preso, o título como navegação (#62), aura, camadas, rotação dos momentos, **nove demonstrações**, aterragem por capítulo.
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
