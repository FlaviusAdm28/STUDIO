# Chapter One V5 — handoff

## ▶ COMEÇAR AQUI · fim do dia 25 de outubro de 2026

**Estado:** o desenho da página V5 está **todo aprovado** — entrada, Work, Method, About, Questions, Contact e
menu (README **#19–#58**). Não há código novo: a sessão de 25/10 foi só de desenho.

**Ler, por esta ordem:**
1. `CLAUDE.md` (V5) — regras.
2. `docs/design/v5/README.md` — decisões #1–#58 e as poucas abertas.
3. **`docs/design/v5/storyboard.md`** — **a especificação estado a estado** (E1–E4, 1–21, menu), a técnica de cada
   estado e **todo o texto aprovado** para o `content/v5.ts`.
4. `interactions.md` (regras de movimento §0 e técnica), `assets.md` §7 (derivados), `roadmap.md` (M2–M8),
   `acceptance.md` (o que medir no Xiaomi e por que ordem).

**Storyboard visual** (o owner aprovou-o; privado): https://claude.ai/artifact/9vkDx379vuwuiaXre62cxz. As fontes HTML estão no repositório em
`docs/design/v5/storyboards/` (ver o `README.md` dessa pasta) e, com as imagens, em
`media-src/storyboards-2026-10-25/` (fora do Git).

**Próximo passo: M2** (autorizado pelo owner): organizar assets em `media-src/` (SHA-1, nada na V4) → derivados de
`assets.md` §7 → texto aprovado no `content/v5.ts` (*Talk to us*, oito perguntas, About, Contact…) → **mostrar ao
owner a lista exata do código da "secretária" a apagar, antes de apagar** → typecheck, lint, build. Depois M3
(entrada, medida no Xiaomi primeiro).

**Em aberto (pequeno):** linhas descritivas das peças do Work (#3) · teste do `ig.me` (#7) · TikTok e email quando
existirem (#54) · ritmos e escalas finas no protótipo (#13).

**Onde está o quê:** V5 em `D:\STUDIO-v5` (branch `v5`); V4 em `D:\STUDIO` (branch `v4`, **não tocar**: tem
staging do owner). **A branch `v5` não se abre com `git checkout v5` em `D:\STUDIO`** — está aberta na pasta
`D:\STUDIO-v5` (é uma *worktree*); abre-se essa pasta no editor. ADB/Xiaomi `c3e8fb35`; ffmpeg e ferramentas como
na secção de 24/10 abaixo.

---

## Sessão de 24 de outubro de 2026 (onde contradiz a secção acima, vale a de cima)

Quando o owner disser **"vamos começar a trabalhar"**:

1. Ler, por esta ordem: `CLAUDE.md` (V5) → `docs/design/v5/README.md` (decisões e abertas) →
   `direction.md` → `pages.md` → `interactions.md` → `assets.md` → `roadmap.md` → `acceptance.md`.
2. Confirmar o estado (abaixo) com `git status` nas duas worktrees — **a V4 não se toca**.
3. Começar pelo **`roadmap.md` M2** (preparação: uma pergunta curta ao owner + organizar assets +
   derivados + limpeza do código da "secretária") e seguir para **M3 — Entrada "Através das letras"**,
   **medida no Xiaomi antes de afinar o visual**.

### Onde está tudo

| O quê | Onde |
|---|---|
| Worktree V5 | `D:\STUDIO-v5`, branch `v5` (local, sem upstream), HEAD `fe1bd33` — **nada commitado** |
| V4 (não tocar) | `D:\STUDIO`, branch `v4`, `fe1bd33`; 4 ficheiros modificados, fotografias e 7 PNG IA **em staging pelo owner**, `docs/design/v4/` e 302/192 fora do Git |
| Produção | `master` = `fe1bd33` = site original (studio-pi-ivory.vercel.app) — inalterada |
| Decisões | `docs/design/v5/README.md` |
| Vídeo (encodes de teste) | `D:\STUDIO-v5\media-src\video\test-encodes\` (fora do Git) |
| Fotografias Weddings | `D:\Pessoal\myairbridge-o0RmwZNCc5y\Solteiros\` (só leitura): 002, 154, 343 |
| Imagens IA | `D:\STUDIO\public\media\new\*.png` (7; mapa em `assets.md` §3) |
| Folhas de contacto / refs | `docs/design/v5/research/` |
| ffmpeg | `C:\Users\35191\AppData\Local\Cypress\Cache\15.8.1\Cypress\resources\app\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe` |
| ADB / Xiaomi | `D:\STUDIO-tools\android-sdk\platform-tools\adb.exe`, serial `c3e8fb35` |

### Estado do código V5 (fim da sessão)

- Compila: `tsc`, `eslint --max-warnings 0` e `next build` a 0 (última corrida 24/10).
- O que está em `src/` é a **M1 revisão ("secretária")** — **não** é a direção aprovada. Reaproveitar só
  `Picture`, `ColourReveal`, `Develop`, o padrão de `DeskDepth` (para as lâminas), `Drawing` (base dos
  esboços), `content/v5.ts`, `src/fonts/index.ts` (fontes A aprovadas), `scripts/images.mjs`.
- Rotas `/weddings`, `/artists`, `/experiences` são marcadores → **remover** (página única).
- `public/media/v5/` tem derivados do M1 (302, 157, main, 024, 335, 347, art, method, lamp) — limpar os
  que não forem usados.

### Processos que podem estar a correr (desta sessão)

- `next start -p 3100` da V5 (último PID visto: 29156). Parar: identificar o PID na porta 3100 e
  confirmar que a linha de comando contém `D:\STUDIO-v5` antes de terminar.
- Chrome de validação com perfil próprio `D:\STUDIO-tools\browser-automation\chrome-profile` e CDP na
  porta **9222** (fecha-se sozinho por vezes; relançar com
  `chrome.exe --remote-debugging-port=9222 --user-data-dir="D:\STUDIO-tools\browser-automation\chrome-profile" --no-first-run about:blank`).
  O controlador `control.mjs` está fixo em `:3000`; para a V5 usar scripts próprios com
  `playwright-core` de `D:\STUDIO-tools\browser-automation\node_modules` (ligar por `connectOverCDP`,
  **não** chamar `browser.close()` — fecha o Chrome; terminar com `process.exit(0)`).
- Servidor ADB (`adb devices` arrancou-o).

### Decisões abertas a tratar no M2 (uma pergunta curta) — **respondidas a 25/10 (README #19–#21)**

1. Direitos do vídeo `hero_demo*`.
2. Subtítulo sob CHAPTER ONE (frase do estúdio vs. tagline original).
3. Numeração das secções no menu (Entrada fora da numeração?).
Depois, ao longo dos marcos: linhas das peças, momentos de Artists/Experiences, texto do About, escolha
do Method, teste do `ig.me`, cor do capítulo Weddings.

### O que o owner já aprovou nesta sessão (resumo — detalhe no README)

Direção "First Page" (nova, não evolução do original) · paleta carvão/musgo/linho/pedra · tipografia A ·
entrada "Através das letras" com o vídeo do original recodificado · página única · Work uniforme por
camadas · Weddings com Solteiros 002/154/343 (P&B) · Artists/Experiences com as imagens IA entregues ·
Method com três opções isoladas para escolher · About · navegação no estilo V4 · alvo Xiaomi sem lag.

---

## Registo anterior (resumo)

- **M0 (24/10)**: worktree e branch criadas; `npm ci`; `sharp` declarado; código V1–V4 removido na V5;
  documentação de autoridade inicial; 14 fotografias copiadas para `media-src/helder-couto/`.
- **M1 (24/10)**: homepage em papel + comparação tipográfica (A escolhida) — rejeitada como estática.
- **M1 revisão (24/10)**: "a secretária sob a lâmpada" — rejeitada; ver `docs/design/v5/history.md`.
- **Sessão final (24/10)**: direção "First Page" definida e aprovada; vídeo avaliado/recodificado;
  Solteiros analisada; imagens IA entregues; documentação completa (este ficheiro e `docs/design/v5/`).
