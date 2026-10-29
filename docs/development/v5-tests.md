# Chapter One V5 — registo de testes

Cada módulo fica aqui com **o que foi testado, como, os números e o que ficou por verificar** (owner, 29/10:
"quero que comeces a documentar os testes feitos"). Um módulo só é commitado com a sua secção escrita.
Os critérios são os do `docs/design/v5/acceptance.md`; aqui fica o que foi medido de facto.

## Como se testa

**Antes de qualquer teste:** `npm run typecheck`, `npm run lint` (sem avisos), `npm run build`, depois
`npx next start -p 3100`. Nunca `next dev` para medir nem para testar sem JavaScript.

**Ferramentas** (fora do repositório, em `D:\STUDIO-tools\v5-m3\`; Node 20, os scripts do telemóvel precisam de
`node --experimental-websocket`):

| Script | Onde | O que faz |
|---|---|---|
| `pc.mjs <pasta>` | PC, Chrome visível | 7 tamanhos de ecrã (1920×1080, 1440×900, 768×1024, 390×844, 320×640 e 1440×900 com zoom do browser a 150 % e 200 %): capturas ao longo da sequência, frames, overflow, geometria, erros da consola; depois reduced motion, sem JavaScript (1440, 390, 320), saltar com uma tecla, ordem do teclado, *Welcome back*, endereço com `#`, refresh a meio da página |
| `frames.mjs <pasta> <w> <h>` | PC, Chrome visível | capturas da entrada em 8 momentos (0,45 s a 5,5 s) |
| `final.mjs <pasta>` | PC, Chrome visível | o estado final a 1440, 1920, 390 e 768, com o tamanho do título e das lâminas |
| `contrast.mjs` | PC, sem janela (só números) | contraste das palavras sobre o poster, às quatro horas, a 1440, 390 e 768 — pior caso: os 5 % de píxeis mais claros atrás de cada palavra |
| `phone.mjs [corridas] [query] [css]` | Xiaomi | a entrada carregada de novo N vezes: fps, p95 e frames lentos por fase (letras, zoom, final, depois); `sum.mjs <ficheiro>` resume |
| `hold.mjs`, `holdev.mjs` | Xiaomi | segurar uma lâmina 2,5 s: transformação da fotografia, eventos, URL depois de largar |
| `net.mjs <perfil> <corridas>` | Xiaomi | rede limitada (4G lenta: 1,6 Mbit/s, 150 ms; sem cache): quando chegam o poster, o vídeo e as fotografias das lâminas |
| `shot.mjs <ficheiro>` | Xiaomi | captura do estado final |

**Xiaomi Mi 11 Lite** (serial `c3e8fb35`, Chrome, ecrã 90 Hz): `adb reverse tcp:3100 tcp:3100` e
`adb forward tcp:9555 localabstract:chrome_devtools_remote`; no Git Bash `MSYS_NO_PATHCONV=1`. Os 90,5 fps são o
máximo do ecrã. **Ver com os olhos:** cada mudança visual é vista numa janela de Chrome no PC e em capturas do Xiaomi;
o modo sem janela só serve para números.

---

## M3 — a entrada (29/10)

Quatro rondas de revisão do owner no mesmo dia (README #76–#79). Números da **última versão** salvo indicação.

### Build
typecheck, lint (0 avisos) e build: **passam**. Formatação Prettier nas opções do repositório
(`--no-semi --single-quote --print-width 120 --trailing-comma all`): passa.

### PC (`pc.mjs`, ronda 11)
**16 verificações, 0 problemas, 0 erros na consola:**
- **Ecrãs:** os 7 tamanhos, sem scroll horizontal.
- **Sem JavaScript:** a 1440, 390 e 320 o estado final lê-se completo (poster, título, subtítulo, lâminas como links).
- **Reduced motion:** estado final de imediato, sem vídeo.
- **Saltar com uma tecla:** a entrada vai para o fim.
- **Teclado:** ordem *Skip to content › Talk to us › Menu › I Weddings › II Artists › III Experiences* (os leitores de ecrã leem "II Artists", já não "IIArtists").
- **Welcome back:** depois de mais de 30 min fora.
- **`#capítulo` no endereço:** vai direto ao capítulo, sem entrada.
- **Refresh:** a meio da página fica no lugar; no topo a entrada repete.

**Tamanhos medidos (`final.mjs`):**

| Ecrã | Título | Lâmina |
|---|---|---|
| 1440×900 | 93 px | 257×182 |
| 1920×970 | 100 px | 343×243 |
| 390×844 | 51 px | 315×93 |
| 768×1024 | 59 px | 633×113 |

**Sequência (`frames.mjs`, 1440 e 390):** E1 só a dedicatória; E2 o vídeo dentro das letras; o O nítido durante todo
o zoom; a tinta escurece durante o zoom, sem salto visível no fim.

### Xiaomi — fluidez (`phone.mjs`, 3 corridas cada)

| Ronda | Letras | Zoom | Final | Depois |
|---|---|---|---|---|
| 6 (camada do O) | 90,5 fps | 88 fps, 1 frame > 25 ms por corrida | 90,5 | 90,5 |
| 8 (tinta no zoom) | 90,4 | 86,3, 1 frame > 25 ms por corrida | 89,9 | 90,5 |
| 8 sem a tinta (controlo) | 90,5 | 85,5, 2 frames > 25 ms, 0 > 50 ms | 90,5 | 90,5 |
| 10 (letra 700, contorno) | 90,5 | 86,3, 1 frame > 50 ms por corrida | 90,5 | 90,5 |
| 11 (final) | 90,5 | 85,5, 1 frame > 50 ms por corrida | 90,5 | 90,5 |

p95 11,2 ms em todas as fases. **O frame lento é no arranque do zoom**, quando o movimento ainda é quase nulo. Existe
desde a ronda 6 e não vem da tinta: com a tinta desligada (controlo) o zoom fica igual. Também não melhora com a tinta
na sua própria camada (`will-change`) nem com a tinta atrasada 0,35 s (testado na ronda 8). Aceite.

### Xiaomi — segurar uma lâmina (`holdev.mjs`, `hold.mjs`)
- Pousar o dedo 2,5 s: a fotografia vai a escala 1,404 (= 1,3 × 1,08) e fica lá enquanto o dedo está pousado.
- O menu do Android não aparece (`contextmenu` às ~1,17 s, bloqueado).
- Ao largar não abre o capítulo (o URL fica igual) e a fotografia volta a 1,3.
- **Encontrado e corrigido:** o toque simulado pelo CDP chega com `pointerType` vazio; o código aceita agora tudo o que não seja rato.

### Xiaomi — rede lenta (`net.mjs`, 4G lenta, sem cache, 3 corridas)

| Fotografias das lâminas | Chegam | Poster | Vídeo descarregado |
|---|---|---|---|
| `lazy` (como está) | 1,2–2,1 s | ~0,85 s | ~8,1 s |
| forçadas a carregar logo | 1,2–2,2 s | ~0,84 s | ~8,1 s |

Sem diferença, por isso fica `lazy`. As lâminas aparecem aos ~3,4 s, depois de as fotografias chegarem.

### Contraste (`contrast.mjs`, final, pior caso, tinta do storyboard + contorno)

| Ecrã | Título dia / noite | Subtítulo dia / noite | Dedicatória dia | Lâminas |
|---|---|---|---|---|
| 1440×900 | 3,00 / 3,87 | 3,11 / 3,84 | 3,57 | 6,50 |
| 390×844 | 2,81 / 3,71 | 2,39 / 3,03 | 3,72 | 4,13 |
| 768×1024 | 2,38 / 3,21 | 2,43 / 3,11 | 3,00 | 4,05 |

Abaixo do alvo de dia (3 : 1 letra grande, 4,5 : 1 o subtítulo), por causa do sol atrás do título. **Aceite pelo owner**
(#32) depois de ver; sem véu, por decisão do owner. Antes: título ~2,0 (tinta do dia a 0,16, sem contorno).

### Não verificado
- **iPhone / Safari:** não se testa a partir daqui; fica com o owner.
- **Mi Browser e Firefox no Xiaomi.**
- **Rede real 4G:** só simulada.
- **O telemóvel quente.**
- **O momento exato em que o vídeo começa a tocar na rede lenta:** o registo da sequência falhou nessas corridas; só se mediu o fim da descarga.
