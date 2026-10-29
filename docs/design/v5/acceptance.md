# V5 — Desempenho e critérios de aceitação

São **critérios a medir**, não promessas. Um marco só fecha quando os critérios aplicáveis foram
verificados e o que não foi verificado está dito.

## Alvo mínimo: Xiaomi Mi 11 Lite sem lag (decisão do owner)

- Dispositivo de referência: **Xiaomi Mi 11 Lite 5G** do owner, por USB — ADB serial **`c3e8fb35`**
  (`product:renoir_eea model:M2101K9G`), confirmado ligado a 24/10/2026.
- ADB: `D:\STUDIO-tools\android-sdk\platform-tools\adb.exe`.
- O telemóvel tem Chrome, Firefox e Mi Browser. O MIUI **bloqueia `adb shell input`** (sem toques
  injetados); o Chrome do telemóvel conduz-se por CDP (ferramentas em `D:\STUDIO-tools\mobile-lag\`;
  `phone.mjs` só aceita separadores `localhost:3000` — para a V5 em `:3100` adaptar ou criar uma cópia).
- Procedimento base:
  1. `adb reverse tcp:3100 tcp:3100` → no Chrome do telemóvel abrir `http://localhost:3100/`;
  2. no PC, `chrome://inspect` → *Performance* → gravar a entrada e a interação com o Work;
  3. critério: **sem frames longos durante as animações e as passagens ligadas ao scroll** (alvo 60 fps estável; o ecrã é 90 Hz),
     nenhuma tarefa longa > 50 ms durante a entrada ou ao trocar de capítulo/momento.
- **Não contornar** um telemóvel bloqueado/a dormir: dizer que o teste não foi feito.
- iOS Safari não é testável a partir desta máquina; o owner testa no iPhone dele (dizê-lo sempre).

## Orçamentos

| Medida | Alvo |
|---|---|
| Vídeo da entrada | desktop ≤ 2,5 MB · mobile ≤ 1,2 MB · um único pedido |
| Poster da entrada | ≤ 150 KB (AVIF) |
| Primeiro ecrã (sem o vídeo) | ≤ 500 KB transferidos |
| JavaScript de cliente próprio | ≤ 30 KB gzip (para além do runtime Next/React) |
| LCP (4G simulado) | < 2,5 s (o poster é o LCP) |
| CLS | < 0,02 |
| INP | < 150 ms |
| Fontes | 3 ficheiros (+1 se a entrada precisar de um peso extra de Cormorant) |
| Camadas animadas em simultâneo | ~6 (referência, não limite — acima disso, risco dito e medido; README #68) |
| Cenas presas no ecrã em simultâneo | 1 (referência, não limite) |

## O que medir no Xiaomi, por ordem (25/10)

1. **Entrada:** E2 (véu com letras sobre o vídeo) e E3 (escala ~60× do véu) — sem frames longos; plano B se falhar.
   **Medido a 29/10 (M3):** 90,5 fps, p95 11,2 ms, 0 frames > 25 ms, 0 tarefas longas em todas as fases (Chrome do
   Xiaomi, 5 + 3 corridas, `D:\STUDIO-tools\v5-m3\phone.mjs`).
2. **Estado 2:** a moldura do vídeo a encolher até ao palco.
3. **Work:** palco preso + troca de capítulo + rotação + uma demonstração ao mesmo tempo.
4. **Method:** a cena presa inteira (estúdio, seis ecrãs, folhas a sair, um ecrã vivo); o teclado aberto no campo.
5. **About:** a luz com furo a mover-se e o nome FLIP.
6. **Contact:** o vídeo a voltar a tocar escurecido.
7. **Menu:** a gota (círculo de vidro por `transform: scale`) a ecrã inteiro sobre cada secção, sobretudo sobre o vídeo
   da entrada; contar os frames lentos da primeira abertura depois de carregar (88–94 ms no teste de 28/10).
8. **Barra (#71, A2):** o escuro das ilhas sobre o papel e sobre fotografias que só passam por uma ponta, e o contraste
   das palavras (calcular); depois, **as duas ilhas com a lente e o escuro adaptável durante o scroll da página inteira (teste de 28/10: igual a
   não ter vidro, 90,5 fps, p95 11,2 ms) — no site, com o vídeo real e com o dedo (fling).

Critério para todos: sem frames longos durante a animação ou o scroll; nenhuma tarefa > 50 ms.

## Clareza comercial

- No estado final da entrada, sem scroll, a 1440×900 e 390×844: o que é o Chapter One (título +
  subtítulo), os três capítulos (lâminas) e **Talk to us**.
- No Work: cada capítulo mostra os três momentos e as peças com uma linha cada; mudar de capítulo é
  sempre o mesmo gesto.
- Nenhum preço, cliente, número ou projeto inventado. Imagens IA nunca apresentadas como trabalho real
  de cliente.
- Teste com 3–5 pessoas (incluindo quem se perdeu na versão antiga): ≥ 4 em 5 dizem em 10 s o que o
  estúdio faz e encontram sem ajuda o que se pode fazer num casamento e como entrar em contacto.

## Acessibilidade

- Teclado em tudo; foco visível; ordem lógica.
- Work: padrão ARIA *tabs*. Menu: `<dialog>`, Esc, foco preso e devolvido.
- Gestos com alternativa visível (botões); nada depende de hover.
- Contraste AA em todo o texto (calcular cada par; o texto sobre o vídeo precisa de véu/gradiente).
- `prefers-reduced-motion`: estado final da entrada com poster; trocas instantâneas.
- Sem JavaScript: todo o conteúdo e links (testar contra `next start`, nunca `next dev`).
- Vídeo: `muted`, sem som, sem informação essencial; `aria-hidden`.

## Validação por marco

- `npm run typecheck`, `npm run lint` (`--max-warnings 0`), `npm run build`.
- Viewports: 1920×1080, 1440×900, 768×1024, 390×844, 320×640.
- Browser de validação: Chrome com perfil próprio e CDP na porta 9222 (ver `v5-handoff.md`).
- **Xiaomi** a partir do protótipo da entrada (primeiro marco), e em todos os marcos seguintes.
