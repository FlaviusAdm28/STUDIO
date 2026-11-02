# Auditoria — Entrada, transição e Work (31 de outubro de 2026)

**Âmbito:** só Entrada, transição para o Work e Work. Method, About, Questions e Contact não foram avaliados.
**Referência:** `docs/design/v5/storyboard.md`, README e, onde há decisão mais recente do owner, essa decisão, assinalada.
**Em validação, não aprovadas:** A. passagem pela lâmina (README #81); B. pilha de cartões (README #82).

**Como foi testado:** Chrome visível no 2.º ecrã a 1440×900, 1920×1080, 768×1024, 1024×768, 390×844, 360×800, 320×640 (`audit.mjs`, `audit2.mjs`);
Xiaomi Mi 11 Lite real, em produção local, a 60 e 90 Hz; toque real no Xiaomi só no início do scroll. WebKit só na ronda anterior (393 e 430).

## Respostas

| # | Pergunta | Resposta |
|---|---|---|
| 1 | A Entrada corresponde ao storyboard? | Sim, com um corte de filme e uma contradição do storyboard por decidir. |
| 2 | A transição para o Work funciona? | Tecnicamente sim, nos sete tamanhos. Não é o estado 2 do storyboard: é a experiência A. |
| 3 | O Work corresponde nas três categorias? | Na estrutura, sim. Três diferenças por decidir: rodapé no telemóvel, seguinte em baixo, regra de tocar. |
| 4 | Os carrosséis funcionam em todos os estados? | Sim, depois de um bug corrigido. Fica por validar a mistura de imagens. |
| 5 | Frente e trás? | Tinha 3 bugs, corrigidos. |
| 6 | Consistência entre ecrãs? | Boa, sem overflow nem erros. 320×640 está no limite. |
| 7 | Desempenho? | Entrada e cartões bons. Scroll dentro do Work abaixo do critério. |

## Bugs — corrigidos nesta auditoria

| Bug | Antes | Agora |
|---|---|---|
| Chegar por lâmina ou por `#capítulo`: a barra ficava sem secção e sem a ilha do nome | Artists e Experiences: secção `top`, nome oculto | secção `work`, nome visível |
| Clicar em *Chapter One* na passagem e no início do Work não subia | ficava em y 1182 | sobe a 0 |
| Saltar para o topo (nome, botão Atrás) não reiniciava o palco | peça ligada; aterrava com o momento errado e a fotografia da lâmina não coincidia | primeiro momento, sem peça |
| Pausar com o rato durante a fotografia sozinha deixava o momento sem peça | `demo: false` em pausa | a peça aparece, como na pausa por toque |
| Título de Experiences partia em duas linhas a 1024×768 | 75 px de altura | 52 px, uma linha |
| Filtros de *Always* cortados a 320 px | *Prints* cortado | cabem, em letra de 8 px nessa largura |
| Crédito *Photographs* aparecia antes de a lâmina chegar | visível durante o voo | chega com a fotografia |

## Desvios do storyboard — para decisão do owner

| Onde | Storyboard | Site | Observação |
|---|---|---|---|
| Passagem, estado 2 | o vídeo encolhe até ao arco e dissolve-se | a lâmina de Weddings cresce até ao arco; o filme apaga-se | experiência A |
| Regra 1, "um elemento leva à cena seguinte" | cumprida pelo vídeo | cumprida pela lâmina | a favor da experiência A |
| Aterragem por scroll vs lâminas | aterra em Weddings | uma lâmina escolhe o capítulo, mas só a de Weddings voa | com lâmina de Artists ou Experiences, há salto direto |
| Ritmo dos momentos | 4 s (1,2 + 2,8) | 6 s (1,2 + 4,8) | decisão do owner a 29/10; o storyboard não foi atualizado |
| Tocar num momento | "fixa-o" | outro muda e a rotação segue; o atual pausa | decisão do owner a 29/10; idem |
| Pausa | rato ou foco sobre o palco | rato só sobre a fotografia; foco de teclado no palco | decisão do owner a 29/10; idem |
| Em baixo de cada secção | a seguinte (`02 Method ↓`) | não existe no Work | decidir com o Method |
| Rodapé *Every project is proposed…* | no Work | oculto no telemóvel | confirmar se é intencional |
| Nome na barra | "sobe ao topo e mostra a entrada outra vez" (menu) contra "a entrada não se repete" (entrada) | sobe ao E4, sem repetir | contradição no próprio storyboard |

## Problemas visuais

- **320×640:** a última peça da lista quase toca no crédito, e várias peças ficam muito densas. Sem sobreposição medida, mas no limite.
- **768×1024:** a fotografia fica pequena para o espaço, com muito vazio à direita.
- **Corte no filme:** verde para sépia aos ~2 s, visível dentro das letras. O owner considerou que não é problema; fica registado por o storyboard dizer que o poster é o mesmo fotograma.

## Desempenho (Xiaomi)

| Medida | 90 Hz | 60 Hz |
|---|---|---|
| Entrada | 88,8–89,5 fps, pior frame 33 ms até ao fim do movimento | 60–61 fps |
| Fim da entrada, com tudo já parado menos o filme | 1 frame de 44–66 ms | semelhante |
| Passagem pela lâmina, desenhos | ~77 por segundo | ~54 por segundo |
| Passagem, pior frame da thread principal | 23–31 ms | 27 ms |
| Cartões, Artists e Experiences | 89,7–90,1 fps | 60,5 fps |
| Cartões, Weddings | 87,3–87,9 fps, até 1 frame > 50 ms | 59,8 fps, 1 frame > 50 ms |
| Scroll pelo Work | 63 fps, 5 frames > 50 ms | 45–48 fps, 3–5 > 50 ms |

**Abaixo do critério de `acceptance.md`:** o scroll pelo Work. Weddings tem o limite no cartão por a galeria levar vidro.
Os números de scroll usam gesto simulado.

## Experiência A — lâmina

Continuidade: sem salto de imagem (0 px, luz ≤ 0,6) e sem linha de luz nos testes. Composição certa nos sete tamanhos.
Clareza: conduz a Weddings, mas não diz que há outros capítulos até o Work aparecer.
Riscos: o filme desaparece mais cedo do que no estado 2, e a lâmina só existe a voar para Weddings.

## Experiência B — cartões

Funciona em troca normal, salto de momento, toques rápidos, mudança de capítulo a meio e subida a meio.
Cartão, película e peça têm o mesmo relógio. Mistura de fotografias enquanto o cartão se apaga: inerente à versão, para o owner avaliar.

## Por aprovar

1. Fechar a experiência A ou voltar ao estado 2.
2. Fechar a experiência B.
3. Tratar o scroll do Work: sem isso, o critério de fluidez não é cumprido.
4. Decidir o comportamento do nome na barra.
5. Decidir o rodapé no telemóvel e o `02 Method ↓`.
6. Atualizar o storyboard com o ritmo de 6 s e a regra de tocar.

## Não verificado

iPhone real (o owner testa no fim). Toque real em todo o percurso: só no início do scroll. WebKit depois destas correções.
Tablet físico. A bateria antiga `pc.mjs` foi substituída por esta auditoria.

## Decisões do owner depois da auditoria (31/10)

Lâmina aprovada; scroll do Work não bloqueia; rodapé visível no telemóvel (feito); `02 Method ↓` fora; storyboard atualizado só na lâmina.
Cartões, nome na barra e 320/768 por responder: ver o topo de `v5-handoff.md`.
- **Rodapé no telemóvel:** tamanho próprio (0,72 rem, era 6,6 px) e crédito por baixo dele, para não se sobreporem em Weddings.
