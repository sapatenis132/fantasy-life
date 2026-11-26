# Arquitetura de escolhas — contrato 1

## Fronteiras

`createEngine(catalog)` compila uma cópia privada do catálogo. A API recebe estado serializável e comandos. A UI obtém `view(state)` e nunca precisa acessar as consequências secretas. O catálogo contém dados; funções, `eval`, scripts de efeito e caminhos de escrita livres são rejeitados.

Esta é uma evolução do relógio 1.2: conserva avanço por marcos, fila ordenada, pausa, retomada, stop, agenda legada, PRNG e seleção ponderada. Acrescenta contrato narrativo, validação, transações, atividades por categoria e seleções periódicas. A implementação histórica não foi alterada.

## Identidade e versões

| Objeto | Identificação |
|---|---|
| Catálogo | `schemaVersion: 1`, `id`, `version` inteira |
| Decisão, atividade, consequência | `id` estável e `version` inteira |
| Pessoa / objeto / local / conhecimento | IDs persistentes no estado; labels separados |
| Ocorrência na fila ou escolha | Número monotônico `id`, gerado pelo motor |
| Save | `version: 2`, seed, PRNG atual e identificação do catálogo |

O save fixa também a serialização completa do catálogo como fingerprint. Mudanças de conteúdo, mesmo sem aumentar `version`, impedem carregamento silencioso. É deliberadamente simples e aumenta o tamanho do save. Não é uma assinatura de segurança ou proteção contra edição manual.

Saves v1 do laboratório são migrados preservando dinheiro, relógio, agenda, fila, ofertas pendentes e PRNG. NPCs legados recebem label igual ao ID e local de laboratório. Não são inventados parentes, habilidades ou objetos. Novas vidas misturam a seed antes do mesmo xorshift32 para reduzir a correlação inicial entre seeds vizinhas; não há garantia de distribuição estatística ideal. A continuidade exata de novos sorteios entre motores de versões diferentes não é prometida.

## Decisão

Uma decisão possui `kind` (`action` ou `opportunity`), `family`, `domain`, título/texto, `repeat: {max,cooldown}`, condições opcionais, participantes e opções. O limite de repetição é explícito e finito nesta fatia. Oportunidades com `selection: {weight}` podem entrar no seletor semanal; outras chegam por causalidade/agendamento.

Cada opção exige:

| Campo | Significado |
|---|---|
| `id`, `label`, `intent` | Identidade, ação visível e intenção registrada |
| `hint`, `blockedReason` | Custos/riscos conhecidos e motivo público de bloqueio |
| `cost: {money,days}` | Valores inteiros não negativos; dias ≤ 36.500 |
| `visibleWhen` | Condição opcional para revelar a existência da abordagem |
| `requires` | Condição opcional para habilitar/executar a abordagem |
| `effects` | Operações comuns aos resultados, aplicadas na conclusão |
| `outcomes` | Resultados `{id, weight, text, effects, when?}` |

O motor seleciona entre resultados cujas condições forem verdadeiras na conclusão. Pesos são relativos; todos precisam ser positivos e finitos. Deve existir ao menos um fallback incondicional. Quando há vários resultados elegíveis, o fallback também participa do sorteio; não significa automaticamente “falha”. Quando só existe um, não se consome acaso.

`participants: [{id, alive:true, local:true}]` exige pessoa viva no local do jogador. `local:false` admite presença remota; não exige ausência. Participantes e condições são reavaliados na apresentação e na conclusão. Requisitos de opção também são reavaliados na conclusão, mas o custo já reservado não é cobrado novamente. Não repita o próprio custo monetário em um requisito que deva continuar verdadeiro depois do pagamento.

## Condições

| Forma | Consulta |
|---|---|
| `{all:[...]}`, `{any:[...]}`, `{not:...}` | Composição lógica |
| `{stat:'money',op:'gte',value:9}` | `money`, `health`, `age`, `skill:oficio`, `aptitude:intelecto` ou `trust:maira:player`; operadores `eq/gte/lte` |
| `{flag:'casa_reparada',is:true}` | Flag pessoal booleana; ausente equivale a false |
| `{world:'quarto_interditado',is:true}` | Fato do mundo; ausência não equivale a false |
| `{item:'grimorio',min:1}` | Quantidade de um objeto |
| `{knows:{who:'player',fact:'diagramas'}}` | Conhecimento de um indivíduo |
| `{person:'maira',alive:true,local:true}` | Estado/presença de pessoa |
| `{freeSlot:'project'}` | Ausência de compromisso na categoria `project` ou `occupation` |

Exemplo real: um projeto pode exigir diagramas conhecidos, condução segura, prática de ofício e espaço para um projeto. As condições não revelam automaticamente seus valores; somente a apresentação autorizada por `view()` chega à UI. Autores precisam escrever motivos que o personagem possa conhecer. A validação sintática não identifica toda frase que revele um segredo.

## Operações permitidas

| `op` | Parâmetros / efeito |
|---|---|
| `add` | `stat, amount`; dinheiro/habilidade não podem ficar negativos; saúde 0–100 e confiança −100–100 |
| `flag`, `world` | `id, value`; booleano pessoal ou fato primitivo de mundo |
| `item` | `id, amount`; transferência/consumo por quantidade, sem estoque negativo |
| `learn` | `who, fact`; informa somente o indivíduo indicado |
| `move`, `kill` | `who, to` ou `who`; atualiza entidade persistente |
| `schedule` | `consequence, after`; consequência existente, após pelo menos 1 dia |
| `offer` | `decision`; coloca oportunidade existente na fila da data corrente |
| `startActivity`, `cancelActivity` | `activity`; assume ou encerra compromisso declarado |

Aprender algo sobre um livro não informa todos os NPCs. Vender registra conhecimento no comprador. Mostrar a Maíra registra que ela viu o livro. Consequências possuem `requires`, participantes, efeitos e `visibility: observed/private`; uma atualização privada não gera uma entrada pública com o segredo.

Atividades definem categoria, duração, habilidade/prática diária, renda, custo diário, participantes, requisitos e efeitos de conclusão. Só há uma ocupação e um projeto simultâneos no conteúdo novo. A rotina antiga de 12 horas existe na API de compatibilidade; não é exposta pela amostra. Os dois modelos não devem ser misturados por conteúdo novo.

## Execução e tempo

1. O comando trabalha numa cópia do estado. Falha de validação/efeito descarta a cópia, inclusive gastos, IDs, PRNG e diário. Comando concluído substitui o estado original.
2. A intenção é registrada e o dinheiro reservado. Com custo zero de dias, o resultado ocorre imediatamente. Com duração, uma ação em curso guarda decisão, opção, instância, início e dias restantes.
3. O relógio encontra o próximo marco entre destino, fila, fim de rotina, conclusão da ação e pulso semanal. Rotinas com custo diário usam também marcos financeiros diários.
4. Ao chegar: mortes/fatos/consequências causais; invalidação de rotinas; conclusões válidas; conclusão da ação; seleção semanal; apresentação de oportunidades. Em empates, prioridade de tipo e ID da ocorrência estabilizam a ordem. Cada conclusão revalida seu contexto, inclusive após outra conclusão cancelar uma atividade na mesma data.
5. Uma decisão interrompe o tempo e preserva o destino. Escolher resposta imediata não retoma o salto automaticamente. Se a resposta possui duração, a ação anterior é suspensa numa pilha; o tempo dela não é contado durante a resposta. Cumprir os dias da resposta não retoma automaticamente a ação anterior nem o restante do ano: o jogador ainda precisa comandar a retomada. O destino pode ser estendido para comportar as ações assumidas.
6. O jogador pode retomar, encerrar o restante ou abandonar uma ação suspensa. Encerrar/abandonar preserva custos e tempo já transcorridos. Ações invalidadas na conclusão não recebem o resultado pretendido; o custo reservado e o tempo da tentativa são preservados.

As rotinas continuam durante ações breves no mesmo contexto. Não há modelagem de horário diário, transporte detalhado, pausas automáticas por viagem ou distribuição de atenção além das duas categorias. Esses conflitos precisam de regras adicionais antes de viagens/empregos complexos.

## API de jogo

```js
import {createEngine} from './src/motor.mjs';
import {catalog,newLife} from './content/fatia.mjs';
const e=createEngine(catalog);
const s=newLife(e,2026);
e.act(s,'livro.destino','examinar');
e.age(s); // 365 dias, interrompíveis
const v=e.view(s);
if(v.pending) e.choose(s,{instance:v.pending.instance,option:'adiar'});
const restored=e.load(e.save(s));
e.resume(restored); // quando houver avanço pendente e nenhuma decisão aberta
```

`choose` exige token de ocorrência: um clique antigo não pode resolver a decisão seguinte. `act` exige iniciativa elegível, sem decisão ou avanço em curso. `view` não altera estado, PRNG ou exposição. `advance(days)` permanece como API interna/teste; `age()` é a fachada do controle principal. `stop`, `abandon`, `cancel` completam o controle de ritmo e compromissos.

O seletor roda em dias absolutos múltiplos de sete, não na abertura de menus ou a cada clique. Repetição por ID, cooldown e penalidade por família usam memória persistente. Consequências obrigatórias/causais não passam por esse sorteio. A antiga `select` permanece apenas para compatibilidade de laboratório e não deve ser ligada diretamente a um botão do jogo.

## Limites do contrato atual

Participantes da amostra são IDs concretos; não há ainda ligação dinâmica de papéis a milhares de NPCs. Famílias semânticas não cobrem similaridade de texto/estratégia nem memória entre vidas. Conhecimento é booleano, sem rumor ou graus de certeza. Resultados não têm uma regra geral de dificuldade que transforme atributos em probabilidades; autores declaram condições e pesos. Catálogos de novas versões ainda exigem uma migração explícita. Diário e ledgers crescem com a vida; compactação/desempenho em décadas e aparelhos reais ficam pendentes.
