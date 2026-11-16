# V5 — o motor de scroll: avaliação e opções (15/11/2026, para decisão do owner)

O owner, 15/11, depois de um dia de correções: "eu gosto das animações que definimos, mas precisamos de uma solução de scroll que funcione no
desktop Chrome e Safari e no mobile Chrome e Safari… avaliar o nosso motor de scroll, a complexidade dele, e perceber se vale a pena reescrever
o motor por algo mais compatível universalmente e que não parta… o que devemos fazer com as paragens… avaliar sites de renome… em vez de
mitigar edge cases que estão a partir o site todo." Este documento responde. **Nenhum código muda antes da decisão.**

## 1. O motor que temos

Medido no código a 15/11:

| | |
|---|---|
| Código que mexe no scroll | ~5300 linhas em 11 ficheiros (Work 1375, Method 1100, About 904, Entrance 515, Contact 487, barra 480, …) |
| Sítios que movem, seguram ou desligam a página | 42 (`scrollTo`, `overflow`, `scroll-snap-type`, `preventDefault`) |
| Regras de encaixe no CSS | 19, ligadas e desligadas por estado |
| Escutas de roda/toque/scroll/teclado | 41 |
| Marcas de estado na raiz | 16 (`pass`, `passHold`, `passZone`, `wheelHeld`, `cOn`, `cHold`, `cRun`, `jump`, `menu`, `near`, …) |
| Tempos fixos | 16 (`PASS_MS` 1600, `BACK_MS` 1200/800, `ON_MS` 3000, `STORY_MS` 1600, `HOLD_MS` 1600, …) |
| Comentários que citam um bug medido | 104 |
| Bugs de scroll no catálogo | 23 (`v5-scroll-catalogue.md`) |

**Porque parte:** o desenho pede *um gesto, uma paragem* (17 paragens) e passagens **por tempo** que seguram a página enquanto tocam. O
browser não dá ao site o controlo da inércia do trackpad nem do arremesso no telemóvel: o Chrome deixa cancelar só o 1.º evento de um gesto,
o Safari só o resto de um gesto cujo 1.º cancelou, o Chrome do Android não deixa cancelar o arremesso, o iPhone decide a paragem quando o
dedo sai. Por isso o site deixa o browser mover a página e depois **tenta travá-la** — com `overflow`, encaixe ligado/desligado, `scrollTo`
de correção, retenções por relógio. Cada travão é um caso; cada caso abre outro (a 15/11: largar a página na hora certa travou o crash do
Safari e tornou o scroll "pegajoso"). Não é falta de cuidado: é a direção errada. **Nenhum ajuste a este motor resolve os quatro browsers.**

## 2. Como fazem os sites de referência

- **Apple (páginas de produto):** scroll nativo, sem paragens nem travões. Cada cena é uma secção alta (2–5 ecrãs) com um palco
  `position: sticky`; a animação anda com a **posição** do scroll (scrub), para a frente e para trás. Quem manda na velocidade é o dedo.
- **Estúdios premiados (Awwwards):** scroll nativo, muitas vezes suavizado no desktop (Lenis, que embrulha o scroll nativo) + GSAP
  ScrollTrigger: cenas fixadas (*pin*) e animações ligadas à posição (*scrub*); quando há "encaixe", é suave e **só no fim** do gesto.
- **Sites "secção a secção" (fullPage.js):** o site sequestra a roda e anima de secção em secção. É o modelo do nosso *um gesto, uma
  paragem*. Problemas conhecidos: a inércia do trackpad do Mac (o site só recebe `deltaY`, nada mais), teclado, leitores de ecrã,
  vertigem, telemóveis; o próprio autor do fullPage.js desaconselha o encaixe CSS obrigatório numa página inteira.
- **CSS `scroll-snap: mandatory` na página inteira:** bom para carrosséis; numa página com cenas altas tem bugs abertos no WebKit e no
  Firefox (presos depois de um arremesso, etc.) — o que vivemos.
- **Animações CSS ligadas ao scroll (`animation-timeline: scroll()/view()`):** Chrome 115+, Safari 26+. No Safari ainda **sem aceleração**
  (menos fluido): usar com o JS como reserva, ou JS desde o início.

## 3. As opções

| | A. Continuar a remendar | B. Motor "secção a secção" próprio | C. Scroll nativo + cenas fixadas, animações pela posição | D. Scroll nativo + passagens por tempo que não seguram + encaixe suave no fim |
|---|---|---|---|---|
| O que é | o motor de hoje | o site move a página de paragem em paragem (desktop); o telemóvel fica com o encaixe nativo | cada paragem passa a ser uma cena com comprimento (≈ 1–1,5 ecrãs) com o palco `sticky`; a passagem anda com o dedo | o dedo move a página livremente; ao chegar a uma cena, a passagem toca no seu tempo sem segurar a página; parado entre duas cenas, a página desliza suave até à mais próxima |
| Paragens | travadas | exatas, impostas | não há paragens; há cenas — não se passa uma sem a ver | "paragens suaves" só em repouso |
| Funciona nos 4 browsers | não (23 bugs) | desktop sim; telemóvel continua com o nativo (dois motores) | **sim** — é scroll nativo | sim |
| Suave | não | depende da nossa curva; a inércia do trackpad tem de ser filtrada à mão (frágil) | **sim** (nativo; opcional suavizar a roda no desktop) | sim |
| Crash do Safari | continua possível | desaparece (sem `overflow`) | **desaparece** (nada segura a página) | desaparece |
| Animações aprovadas | iguais | iguais (por tempo) | **o mesmo desenho, mas guiado pelo dedo**: para a frente e para trás à velocidade do dedo | iguais (por tempo); podem tocar atrasadas ou ser cortadas por um gesto rápido |
| Acessibilidade (teclado, leitor de ecrã, movimento reduzido) | frágil | fraca (scroll sequestrado) | **boa** (nativo) | boa |
| Código | 5300 linhas e a crescer | reescrever o motor (~1500?) + manter o do telemóvel | **reescrever os condutores das passagens; ~1/3 do código de hoje**; apagam-se o regulador, as retenções, o `unsnapped`, as 19 regras de encaixe | intermédio; mantém sincronização de estados |
| Risco | alto (cada correção parte outra coisa) | médio-alto (a deteção de gestos é o problema de hoje noutro sítio) | **médio** (muda a sensação das passagens; precisa da aprovação do owner) | médio (estados das passagens a meio) |
| Contradiz decisões aprovadas | — | não | **sim:** README #110 (um gesto, um capítulo) e as passagens por tempo (#81–92 e seguintes) | parcialmente (#110) |

## 4. Recomendação

**C, com uma pitada de D:** scroll nativo em todos os aparelhos, cada paragem de hoje passa a ser uma **cena fixada** com o seu comprimento,
e as passagens aprovadas — os mesmos desenhos, as mesmas fotografias, os mesmos keyframes — passam a andar com a **posição** em vez do
relógio. É o que a Apple e os estúdios de referência fazem, e é o único caminho que não depende de travar a inércia de cada browser.

- **O que acontece às paragens:** deixam de ser travões. Uma cena tem comprimento suficiente para que um gesto normal a percorra a ver; um
  gesto muito forte passa mais depressa, mas nunca parte nem salta uma animação (vê-se a passar). Se quisermos o "pousar" de hoje, só um
  **encaixe suave em repouso**: quando a página para entre duas cenas, desliza até à mais próxima — nunca durante um gesto, nunca a ligar e
  desligar regras.
- **O que fica por tempo:** o que não é passagem — os momentos do Work (6 s), a entrada, os pormenores dentro de uma cena.
- **O Work já foi assim:** a passagem do Work nasceu ligada ao scroll ("the old scroll-driven passage", `work-client.tsx`) e passou ao relógio
  por causa dos travões; os keyframes já estão escritos por progresso (0 → 1,4 ecrãs).
- **Dependências:** nenhuma obrigatória (JS próprio: `animation.currentTime` a partir da posição, como o Work já faz). Suavizar a roda no
  desktop (Lenis) seria opcional, com a aprovação do owner.

**Como se chega lá sem partir nada:**
1. **Protótipo de uma passagem** — topo ↔ Weddings, a mais amada e a mais partida — num endereço próprio (`?scene`), ao lado da de hoje.
   O owner experimenta no Chrome, Safari, iPhone e Xiaomi e decide pela sensação.
2. Se aprovado: o Work inteiro, depois o Method, o About, Questions/Contact — uma secção de cada vez, a bateria da fase 0 (posições **e**
   vídeo) a passar nos quatro browsers antes da seguinte.
3. Apagar o que deixa de ser preciso (regulador, retenções, `unsnapped`, regras de encaixe, marcas de estado).

**Decisões pedidas ao owner:** (1) a direção C (passagens guiadas pelo dedo, sem travões) — sim ou não; (2) o encaixe suave em repouso — sim
ou não; (3) entretanto, o site volta ao estado da manhã de 15/11 (o scroll que o owner preferia; o crash do Safari pode voltar a aparecer
até à obra nova) — sim ou não.

Fontes (consultadas a 15/11): WebKit — scroll-driven animations no Safari 26 (WWDC25, sessão 233; WebKit bug 222295: sem aceleração);
Chrome Developers — scroll-driven animations; Lenis + GSAP ScrollTrigger (fóruns GSAP); scrolljacking e acessibilidade (frontendchecklist,
Web Designer Depot); limites do `scroll-snap` (alvarotrigo.com; WebKit bugs 253078, 223406; Mozilla 1744289); trackpad do Mac em scroll
próprio (dev.to, "a journey through Mac trackpad hell"); a técnica das páginas de produto da Apple (CSS-Tricks e outros).

## 5. Resposta do owner (15/11, noite) e recomendação revista

"A tua sugestão basicamente tira o trigger de animação e passa o scroll a controlar a animação, como tínhamos antes na lâmina a crescer o
Weddings? É que isso não quero." — **C fica de fora**: as passagens continuam **disparadas** (por tempo), não guiadas pelo dedo.

Com as passagens por tempo e as paragens que o owner quer manter, a recomendação passa a **B no desktop + o encaixe nativo no toque**:
- **Desktop (Chrome e Safari, trackpad, roda, teclado):** o site cancela o gesto desde o 1.º evento (os dois browsers deixam cancelar o
  resto de um gesto cujo 1.º evento foi cancelado — medido a 15/11) e **move ele próprio a página** até à paragem seguinte, numa curva suave
  e igual nos dois browsers; a inércia que sobra é ignorada; a passagem dispara ao chegar, como hoje. Sem `overflow`, sem encaixe a ligar e
  desligar, sem correções de posição: um só dono. O ponto delicado é distinguir um gesto novo da inércia do anterior (é o que fazem o
  fullPage.js e semelhantes; o nosso regulador já tem essa lógica medida).
- **Telemóveis:** ficam com o encaixe nativo, que já funciona (iPhone 34/34 no Simulador; Android certo com gestos normais). O #14 (arremesso
  forte no Android) fica para medir depois, como decidido.
- **D** (scroll livre + passagens disparadas + encaixe suave só em repouso) é a alternativa se o protótipo B não agradar: mais nativo, mas um
  gesto forte passa várias paragens.

## 6. O scroll rápido (owner, 15/11, noite)

O owner: "gosto do scroll como temos hoje: cada cena um scroll para disparar uma animação, ela entra e aterra suavemente. O que fazemos com
o scroll rápido? Paragens que não se passam (um scroll muito rápido pode passar certas animações mas pára sempre em momentos específicos), ou
deixar o scroll rápido avançar muito sem lag? Qual é o problema das correções em cima de correções? Como impedimos alguém de partir o site?"

**O problema de fundo:** dois condutores a disputar a página — o browser, que a move com a inércia que só ele controla, e as nossas regras,
que tentam travá-la depois. O scroll rápido é onde a inércia é maior, por isso é onde todos os travões chocam (o regulador, a passagem do
Work, o encaixe ligado/desligado, as retenções). Corrigir um travão mexe nos outros.

**O que resolve:** um só condutor no desktop (o motor, §5). Com ele, o scroll rápido deixa de ser uma luta e passa a ser uma **regra** que
escolhemos:
- **R-a, um gesto uma cena, sempre:** nunca parte, mas atravessar o site pede muitos gestos (o "tenho de fazer imensos scroll").
- **R-b, barreiras (recomendada):** um gesto forte pode avançar várias cenas dentro de um capítulo — as cenas passadas aparecem já no seu
  estado final (o mesmo que o movimento reduzido já desenha) —, mas **pára sempre** nas barreiras: o início de cada capítulo (proposta:
  topo, Weddings, Method 7, About 12, Questions, Contact). A cena onde aterra toca a sua animação inteira.
- **R-c, livre:** um gesto forte vai tão longe quanto a força; as cenas passadas em estado final; aterra na paragem mais próxima de onde a
  força acabaria.

**Porque deixa de partir:** o motor é uma máquina de estados (parado → a deslizar → a aterrar/animar → parado) e é o único que move a página;
o menu, *Chapter One*, os endereços e o teclado passam por ele; um gesto que chega a meio é juntado ao seguinte, nunca a um segundo
condutor; uma animação só toca com a página aterrada; uma cena saltada fica no estado final; o browser nunca move a página no desktop, por
isso a inércia não a empurra. Nos telemóveis, a mesma regra pelo encaixe nativo: `scroll-snap-stop: always` só nas barreiras.
**E o processo:** a bateria da fase 0 (posições, cadeias, rajadas, vídeo) corre e **dá veredicto automático** antes de qualquer versão chegar
ao owner — a regressão de 15/11 (o Method a passar) estava na fita e não foi vista a tempo.

## 7. Voltar a uma versão boa (owner, 15/11, noite)

"Não sei se o site hoje de manhã estava bem… sei que há uns dias estava bem, só tínhamos o problema do scroll rápido não parar, mas a
experiência de ter o site normal estava boa em todo o lado; depois começámos a partir tudo." — as versões desses dias a correr lado a lado
(cópias temporárias no scratchpad, compiladas com `next build`, nada no repositório mudou), para o owner escolher a base:

| Endereço | Versão | O que tinha |
|---|---|---|
| :3112 | `00a1462` (12/11 17:54) | M7b: o Contact e a sua passagem; Questions seguradas na volta; correções do Safari |
| :3113 | `8ac2c92` (13/11 14:08) | + os cinco bugs do iPhone do owner, o Contact mais suave, o menu e a entrada por hora |
| :3114 | `430c924` (14/11 02:48) | + o menu de vidro, a cor do topo no Android, o 1.º toque no fim, o regulador do desktop (início) |
| :3100 | hoje (por commitar) | + as correções de 14–15/11 |
