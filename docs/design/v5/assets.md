# V5 — Assets

*Consolidado a 24/10/2026 (fim da sessão). Os inventários anteriores (M0 e revisão do M1) estão
resumidos no fim, em §Histórico de assets.*

Regras: **originais nunca são alterados nem movidos**; trabalha-se com **cópias** em `media-src/`
(excluída do Git por `/media-src/` no `.gitignore` da V5); só **derivados otimizados** vão para
`public/media/v5/`. Cada cópia é verificada por SHA-1.

---

## 1. Vídeo da entrada (aprovado)

**Fonte**: `D:\STUDIO\public\media\hero\video\hero_demo4.mov` — QuickTime, H.264 Main, 2880×1440,
30 fps, 12,12 s, ~20 Mb/s, 30,8 MB, md5 `716eca5be43d…` (inalterado). A silhueta de uma mulher ao pôr do
sol sobre montanhas, tons de sépia. Alternativas: `hero_demo2.mov` (11,9 s), `hero_demo3.mov` (14,7 s).
O site original servia `hero_demo4_6mbps.mov` (9,1 MB) e descarregava-o duas vezes.

**Direitos: por confirmar** (origem desconhecida; nome "demo") — decisão aberta #1.

**Codificações de teste** (feitas a 24/10, guardadas em `media-src/video/test-encodes/`, fora do Git):

| Ficheiro | Formato | Tamanho | SSIM vs fonte |
|---|---|---|---|
| `hero-1920.mp4` | 1920×960, H.264 High, CRF 23, sem áudio, faststart | **2,12 MB** | 0,9916 |
| `hero-720x1280.mp4` | recorte vertical 810×1440 a partir de x=1006, escalado para 720×1280, CRF 24 | **0,95 MB** | 0,9907 |
| `poster-wide.png` / `poster-tall.png` | fotograma aos 4,4 s (silhueta) | — | — |

A figura está a ~51 % da largura e o sol a ~45 %: o recorte vertical mantém os dois.

**Ferramenta**: o ffmpeg do Cypress que já existe na máquina (nada instalado):
`C:\Users\35191\AppData\Local\Cypress\Cache\15.8.1\Cypress\resources\app\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe`

**Comandos** (fonte → `media-src/video/`; depois copiar finais para `public/media/v5/video/`):

```
ffmpeg -i hero_demo4.mov -an -vf "scale=1920:960:flags=lanczos" -c:v libx264 -profile:v high \
  -preset slow -crf 23 -maxrate 4M -bufsize 8M -pix_fmt yuv420p -movflags +faststart hero-1920.mp4

ffmpeg -i hero_demo4.mov -an -vf "crop=810:1440:1006:0,scale=720:1280:flags=lanczos" -c:v libx264 \
  -profile:v high -preset slow -crf 24 -maxrate 2M -bufsize 4M -pix_fmt yuv420p -movflags +faststart \
  hero-720x1280.mp4

ffmpeg -ss 4.4 -i hero_demo4.mov -frames:v 1 poster-wide.png
ffmpeg -ss 4.4 -i hero_demo4.mov -frames:v 1 -vf "crop=810:1440:1006:0" poster-tall.png
```

Os posters passam por `npm run images` (AVIF/JPEG) quando a entrada for implementada. Considerar
também uma versão 1280×640 para ecrãs médios se o protótipo o justificar.

---

## 2. Weddings — fotografias reais P&B (aprovadas)

**Fonte**: `D:\Pessoal\myairbridge-o0RmwZNCc5y\Solteiros\` — 367 fotografias de Helder Couto (116 P&B,
251 cor, 12 horizontais). **Pasta pessoal: só leitura.** Inventário em `research/solteiros-scan.json`;
folha de contacto P&B em `research/solteiros-bw-sheet.jpg`.

O conjunto P&B conta **um dia da manhã à noite**: estrada em pleno dia (002–029) → campo e árvore
(046–126) → véu e ramo (154–222) → pôr do sol sobre o nevoeiro (228–309) → noite com flash (311–357).

| Momento | **Escolhida** | Dimensões | SHA-1 | Alternativas |
|---|---|---|---|---|
| Before | **HelderCoutoPhoto_002** (de costas, a caminhar na estrada, muito céu) | 3453×5172 | b2c31e066c7e… | 009 (3531×5289) · 021 (detalhe, 1615×2420) |
| On the day | **HelderCoutoPhoto_154** (a noiva na estrada, o véu ao vento — descrição corrigida a 25/10; "véu de renda, perfis" é a 157, a cores) | 3196×4787 | 80f5f4b55efd… | 299 (vestido ao vento) · 179 (no ramo) |
| After | **HelderCoutoPhoto_343** (noite com flash, juntos) | 3182×4766 | 16ba040817ce… | 357 (dança desfocada) · 326 (abraço à noite) |

Ficam a P&B (o owner adora). Não há revelação de cor para estas (são P&B do fotógrafo). Se um dia
for preciso um cenário que não exista, pode editar-se uma real com IA (aprovado como hipótese).

Crédito: *Photographs — Helder Couto*. Direitos: confirmados pelo owner (M0), sem documentos vistos.

---

## 3. Artists e Experiences — imagens geradas por IA (entregues pelo owner)

**Localização atual**: `D:\STUDIO\public\media\new\` (repo **V4**, já em **staging** pelo owner — não
mexer no staging da V4). Todas 1024×1536 (2:3), PNG, a cores. Folha: `research/ai-images-sheet.jpg`.

| Ficheiro (V4) | Papel na V5 | SHA-1 (12) | KB |
|---|---|---|---|
| `Estúdio de artista ao entardecer.png` | **Artists · Always** | bbcd785c8983 | 2169 |
| `Galeria Âmbar em Silêncio.png` | **Artists · For a moment** | 0873e1b1b23f | 2068 |
| `Portfólio de Luz e Texturas.png` | **Artists · On record** | 2961c6faba2a | 2400 |
| `Convite elegante à entrada iluminada.png` | **Experiences · Before** | 392ec5b2bfd1 | 2243 |
| `Concerto Íntimo em Luz Âmbar.png` | **Experiences · During** | 07fc6c294dc3 | 1735 |
| `Banquete ao Amanhecer na Villa Histórica.png` | **Experiences · After** | 5eada5160653 | 2229 |
| `Espaço de trabalho ao entardecer.png` | **About** (opcional) | 1f26bfc9351a | 1900 |

Coerentes entre si (tons âmbar/linho, luz de fim de tarde). Gerar a cores permite o P&B derivado e a
revelação de cor, se se quiser usar. Resolução máxima 1536 px de altura: suficiente para o tamanho em
que aparecem; não ampliar para lá disso.

Prompts usados/para regenerar: `prompts.md`. Referências de estilo: `research/refs/`.

---

## 4. Outros assets

| Asset | Localização | Uso na V5 |
|---|---|---|
| Retrato do fundador (cor) | `media-src/helder-couto/HelderCoutoPhoto_124.jpg` (cópia M0) | **About** |
| Fotografias M0 (cópias) | `media-src/helder-couto/` (14) | reserva; 024/157/300/302 a cores com P&B derivado já gerados |
| Materiais do convite | `D:\INVITE\media\` (15) e cópias em `media-src/invite/` (main, 171, 335, 347) | reserva (as noites 335/347 podem servir de alternativa ao After) |
| Placas IA antigas | cópias em `media-src/plates/` (as de `public/media/` saíram a 29/10) | **fora** da V5 (eram da "secretária") |
| Vídeos `.mov` | `media-src/video/` (copiados a 29/10; o original fica na V4) | fonte do vídeo da entrada; os `.mov` não se servem |
| Derivados | `public/media/v5/{entrance,work,method,about}/` | refeitos a 29/10 só com o que o desenho usa; os do M1 saíram |
| Imagem de partilha | `src/app/opengraph-image.jpg` (V1–V4) | **substituir** por um fotograma da entrada + título |
| Referências de estilo para IA | `research/refs/` (still do vídeo, 157, 024) | para o ChatGPT |

---

## 5. Organização de pastas (a fazer no início da implementação — pedido do owner)

Copiar (nunca mover) para `D:\STUDIO-v5\media-src\`, verificando SHA-1:

```
media-src/
  video/
    hero_demo4.mov                 ← cópia da fonte (opcional; a fonte fica na V4)
    test-encodes/                  ← já existe (encodes de teste)
  weddings/                        ← Solteiros: 002, 154, 343 (+ alternativas 009, 021, 299, 179, 357, 326)
  artists/                         ← always.png, for-a-moment.png, for-the-record.png   (renomeados na cópia)
  experiences/                     ← before.png, during.png, after.png                   (renomeados na cópia)
  about/                           ← portrait-124.jpg, workspace.png
  helder-couto/  invite/  plates/  ← cópias anteriores (M0/M1), ficam como reserva
```

**Feito a 29/10** (cópias, nunca movidos; SHA-1 completo verificado = original):

| Cópia em `media-src/` | Original | SHA-1 (12) |
|---|---|---|
| `video/hero_demo4.mov` · `hero_demo2.mov` · `hero_demo3.mov` | `public/media/hero/video/` (antes de sair do ramo `v5`; = V4) | 63d648beb6a7 · 3435fcd96c23 · dfd2b3adc38e |
| `weddings/HelderCoutoPhoto_002/154/343/299.jpg` | `D:\Pessoal\myairbridge-o0RmwZNCc5y\Solteiros\` | b2c31e066c7e · 80f5f4b55efd · 16ba040817ce · dd46b86be6b2 |
| `artists/always.png` · `for-a-moment.png` · `on-record.png` | `D:\STUDIO\public\media
ew\` (V4, só leitura) | bbcd785c8983 · 0873e1b1b23f · 2961c6faba2a |
| `experiences/before.png` · `during.png` · `after.png` | idem | 392ec5b2bfd1 · 07fc6c294dc3 · 5eada5160653 |
| `about/workspace.png` | idem (`Espaço de trabalho ao entardecer.png`) | 1f26bfc9351a |
| `about/portrait-124.jpg` | `media-src/helder-couto/HelderCoutoPhoto_124.jpg` | 80a838fcc8d8 |

`for-the-record.png` chama-se `on-record.png`, como o momento (*On record*). `scripts/images.mjs` lê esta estrutura
e escreve em `public/media/v5/{entrance,work,method,about}/` (os ids estão no script). As pastas `helder-couto/`,
`invite/` e `plates/` ficam como reserva; o site já não as usa.

---

## 7. Derivados que o desenho aprovado pede (25/10, para o M2)

Todos gerados por `npm run images` (ou um passo novo do mesmo script) a partir das cópias em `media-src/`; nunca
editar originais. O storyboard já os usa em versão pequena (`media-src/storyboards-2026-10-25/img/`).

| Derivado | Para quê | Notas |
|---|---|---|
| Posters do vídeo, largo e alto (AVIF/JPEG) | entrada (estado inicial, reduced motion), Contact | fotograma 4,4 s; ≤ 150 KB |
| `hero-1920.mp4`, `hero-720x1280.mp4` | entrada e Contact (o mesmo ficheiro) | `media-src/video/test-encodes/` |
| Weddings 002 · 154 · 343 (P&B) | Work | 154 é a noiva na estrada (corrigido) |
| Solteiros **299** | ecrã *Wedding website* do Method | proposta usada no storyboard |
| Artists ×3, Experiences ×3 (IA) | Work, ecrãs do Method | |
| **Auras** (~48 px, desfocadas) de cada fotografia do Work e da 124 (P&B e cor) | atmosfera do Work e do About | < 1 KB cada; P&B com tom quente |
| 124 a cores + **P&B derivado** | About | uma só fotografia |
| **Quatro fundos do estúdio** (manhã · dia · fim de tarde · noite) + o estúdio da **pedra** (Questions) | Method, Questions | papel curvo + luz + vinheta + grão; ~40–60 KB; 2 tamanhos |
| Sombra de ecrã (pequena, transparente) | Method | uma imagem |
| **Luz com furo** (camada escura com um círculo de luz) | fim do Method, entrada do About | uma imagem por proporção |
| ~~Imagens desfocadas para o menu~~ | — | **já não são precisas**: o vidro é ao vivo (`backdrop-filter`, README #69) |
| Fonte Cormorant 700 (+1 ficheiro) | a letra-janela da entrada | **700** (README #78: o storyboard pede 600 a uma família carregada a 400/500 e o navegador desenha 500 engrossado, igual a um 700 real) |
| Imagem de partilha (Open Graph) | | fotograma da entrada + título |

---

## 6. Direitos e confirmações

- Fotografias de casamento (Helder Couto): autorização comercial **confirmada pelo owner** (M0).
- Imagens IA: geradas pelo owner no ChatGPT; uso aprovado.
- Vídeo `hero_demo*`: **direitos confirmados** — feito pelo owner (README #19).
- Pessoas identificáveis: as fotografias Solteiros mostram o casal (o próprio owner e a Raquel) —
  coberto pela confirmação do owner; as imagens IA não têm rostos reconhecíveis.

---

## Histórico de assets (resumo)

- **M0**: 14 fotografias copiadas para `media-src/helder-couto/` (SHA-1 verificado); verificado que
  nenhum par "cor/P&B" é o mesmo fotograma → revelação de cor usa sempre P&B derivado da cor.
- **M1 revisão**: inventário de 65 imagens (`research/asset-contact-sheet.jpg`); copiados `main`, 171,
  335, 347 (convite) e as placas `art`, `method`, `image19aug26`; derivados em `public/media/v5/`.
- **Sessão final 24/10**: vídeo avaliado e recodificado; Solteiros analisada (367); seleção Weddings
  002/154/343; 7 imagens IA entregues pelo owner.
