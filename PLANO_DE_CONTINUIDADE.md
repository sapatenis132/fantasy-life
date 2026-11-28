# Plano de continuidade — Fantasy Life

Versão jogável 0.6.0 · Diretrizes narrativas atualizadas em 28/11/2026.

## Ponto de retomada

**1.3 e 1.4 preservadas; 1.5 implementada na primeira expedição conectada.** A direção foi revista por solicitação do usuário: diário vivido, calendário por ações, necessidades, lugares, relações e capacidades de fantasia. A orientação mais recente retira BitLife das referências ativas: desenvolver um RPG de fantasia com as mecânicas de calendário, relações, necessidades, treino e lugares de Course of Temptation, sem seu cenário ou conteúdo adulto. O começo atual é um jovem adulto em Ponteclara e serve como base para o RPG principal.

Ler `DOCUMENTO_MESTRE.md`, `etapa_1_5/README.md`, `etapa_1_5/docs/DESIGN_E_IMPLEMENTACAO.md` e evidências atuais. Executar `node etapa_1_5/verificar.mjs`. Publicar com `node scripts/preparar-pages.mjs`; enviar código, documentação e build juntos ao repositório **sapatenis132/fantasy-life**, branch `main`, Pages `/docs`.

## Prioridade atual — preparação narrativa de Terastera

O trabalho imediato é preparar mundo, história e região inicial antes de ampliar as mecânicas, conforme a direção estabelecida pelo autor. A base fornecida pelo autor está em `mundo/TERASTERA.md`; a ordem de trabalho, em `mundo/PREPARACAO_NARRATIVA.md`. Os cinco países são a base atual, com expansão aberta. Separar fatos, relatos e propostas; preservar as questões ainda sem resposta.

O autor define a base e o assistente desenvolve os detalhes a partir dela. Seguir `mundo/ROTEIRO_DO_AUTOR.md`, com entrega gradual e ordem flexível:

1. Base de tom e possibilidades recebida: escolhas orientam o tom; aventura é o foco com liberdade de outras vidas. Aprendizado precisa ser divertido e ter duração adequada ao jogo. Ler `mundo/TOM_POSSIBILIDADES_E_TEMPO.md`; valores exatos ainda não definidos.
2. Catálogo de povos do bloco 2 recebido: usar raças de Pathfinder das comuns às raras. Consulta de trabalho em Pathfinder 2e (edição não explicitada pelo autor), incluindo comuns/incomuns/raras; 54 ancestralidades em `mundo/POVOS_PATHFINDER.md`. Diretriz populacional de 28/11 recebida: muitas raras têm até dez indivíduos por raça além do jogador; algumas incomuns têm pequenos povoados. Não impor a escala de dez a todas, nem multiplicar cotas por lugar. Censo, âmbito geográfico, distribuição e convivência local a desenvolver. Próximo bloco sugerido: magia, habilidades, talentos e dons.
3. Vida presente dos reinos, crenças, geografia, natureza fantástica e aventura.
4. Primeira região, pessoas, vínculos e situações abertas; revisão de Ponteclara e do moinho.
5. Passado, lendas e segredos conforme relevância e interesse do autor, preservando a incerteza da Guerra dos 3. Sua resolução não condiciona o trabalho anterior.
6. Retomar a implementação da 1.6 a partir das necessidades narrativas e escolhas da região preparada.

O código e os saves da 0.6.0 continuam preservados. Preparação registrada não significa reinos implementados. A localização de Ponteclara, as causas dos mistérios e respostas secretas ainda estão em aberto. O calendário de 614 e demais parâmetros do protótipo precisam de conciliação, sem alterar saves durante o planejamento.

## Entregue nesta fatia

- Identidade comum a jogador e moradores; origens, povos, traços, talentos e dons com usos concretos no jogador.
- Habilidades e domínio liberando técnicas; aprendizado por tempo dedicado.
- Necessidades com recuperação e saída viável para personagem sem comida/moedas.
- Mapa conectado, caminhos com custo, interrupção e retomada persistida.
- Agendas, presença, conhecimento individual, confiança direcional, amizade por iniciativa e um encontro entre NPCs sem depender do jogador.
- Calendário, aula combinada, chegada, cancelamento com aviso e atraso.
- Projetos e serviços sem renda durante sono/viagem; descobertas que abrem outras atividades quando compartilhadas.
- Oportunidades contextuais com aleatoriedade salva; exame de reagente usa conhecimento sem trocar a mercadoria.
- HUD 0.5.2: lugar e ações no centro, painel lateral/recolhível, diário separado e janelas de consulta. Save/importação/exportação e versão anterior preservados.

Ainda faltam aventuras e conflitos mais profundos, combate, equipamento, magia variada e NPCs com objetivos e personalidade reativa. A entrega atual é uma fundação conectada; o roadmap deve avançar sobre ela.

A crítica ao log foi tratada na HUD 0.5.1. A 0.5.2 mantém necessidades no cabeçalho móvel e acrescenta consultas/cuidados rápidos, sem alterar regras ou saves. Ler `etapa_1_4/docs/REVISAO_HUD_0_5_1.md` e `etapa_1_4/docs/REVISAO_HUD_0_5_2.md` antes de alterar a apresentação: não preencher a sala com a última entrada do histórico.

## Etapa 1.5 entregue — O Moinho Afogado

- Três interesses opcionais no diário; quatro lugares novos e rotas persistentes que precisam ser descobertas ou abertas.
- Origem com equipamento de preparo, compra de corda/kit/lâmina, provisões e curativos; blocos de treino de duas horas.
- Cheia, névoa ou calmaria persistidas; cheia altera travessia e risco, demais condições são ambientação neste recorte. Iria ou Nilo fixados por seed, com agenda, conselho, empréstimo/devolução e retorno com memória.
- Soluções por exploração, ofício, magia/dom, técnica e confronto. Nenhuma origem exige compra ou luta para terminar.
- Quatro decisões exclusivas com atividades e relações no retorno. Sem NPC onisciente nem pagamento repetido por relato/entrega.
- Migração automática da 0.5, inclusive ação paga interrompida e decisão pendente. Backups, HTML anterior e todos os registros preservados.
- 194 casos atuais, 71 de compatibilidade 0.5 e 14 históricos; quatro saves comparativos sem recursos inseridos. Inspeção móvel em Chrome remoto, sem equivaler a Android físico.

## Bloco posterior à preparação narrativa: 1.6 — aprofundar a região e o risco

1. Evoluir o confronto de uma resolução para pequenas decisões táticas legíveis: intenção do inimigo, posição/preparo, atacar, técnica, magia, defesa e retirada. Custo e ferimento devem afetar o restante da expedição sem impor combate a todo perfil.
2. Equipar arma/ferramenta e descrever efeitos concretos. A lâmina atual funciona por posse; ainda não há slots, armadura ou inventário tático. Evitar planilha de itens.
3. Magia com efeitos distintos e limites compreensíveis; dons e técnicas devem oferecer estratégias, com soluções de exploração e conversa preservadas.
4. Dar retornos tardios ao moinho: trabalho e ambiente já mudam, mas moradores ainda não têm projetos autônomos, rumores ou conflitos continuados. Não inventar conhecimento fora da presença/relato.
5. Ampliar personalidade e habilidades próprias de Iria/Nilo e os vínculos existentes. Hoje há identidade fixa, pauta, agenda e lembranças explícitas; suas falas de conselho compartilham estrutura.
6. Medir repetição real em sessões humanas. Expandir situações combináveis e motivos de retorno antes de multiplicar mapas. A meta de 50h permanece distante.
7. Projetar automação opcional de rotina quando a duração de jornadas justificar. Blocos de treino já existem; ainda não há agenda automática.

Critérios: jogador escolhe se envolve, entende risco antes de agir, pode preparar/retirar e percebe consequência além de uma frase. Save/reload preserva intenção, fase, custo e participante. Definir migração do catálogo 2 antes de alterar opções publicadas.

Nascimento, infância, ciclo completo até a morte e sucessão deixam de ser a sequência obrigatória de entregas. Idade, origem e família podem enriquecer identidade, relações e conflitos. Propostas antigas permanecem como histórico ou possibilidades futuras, sem bloquear o aprofundamento do RPG.

## Pendências que não devem desaparecer do roadmap

- Sessões humanas de diversão e balanceamento; a meta de 50h está distante e não foi demonstrada.
- Android físico, leitor de tela, teclado, zoom e exportação/importação real em diferentes aparelhos. A integração VM não substitui esses testes.
- Objetivos e personalidade de NPCs, vínculos familiares, rumores com origem, memória social e consequências tardias mais variadas.
- Treino/trabalho por blocos são o recorte atual. Automatização opcional e resumo de rotinas conforme a duração das jornadas e objetivos.
- Dados de habilidade/condição dos NPCs ainda precisam do mesmo aprofundamento do jogador.
- Raridade de dons ainda não existe: a criação atual permite escolher para testar os caminhos do RPG. Balancear povos/talentos e evitar escolhas dominantes.
- Catálogo fixado por fingerprint, histórico crescente e migrações gerais; planejar migração antes de mudar o catálogo publicado.
- Transferência do legado só sem fila/atividades/decisão/avanço. Não apagar o arquivo anterior nem descartar compromissos para facilitar migração.

## Roadmap

| Etapa | Estado |
|---|---|
| 1.1 Identidade/GDD | Preservada e atualizada |
| 1.2 Tempo/diversidade | Base histórica preservada; perfil em minutos acrescentado |
| 1.3 Escolhas/agência | Implementada; 71 casos anteriores continuam passando |
| 1.4 Personagem e fatia de rotina | Implementada na 0.5.0, HUD revista na 0.5.2; aprofundamento social e das capacidades de fantasia continua no plano |
| 1.5 Ciclo de RPG e variedade de contextos | Implementada na 0.6.0: Moinho Afogado, preparo, exploração e retornos |
| Fundação narrativa de Terastera | Trabalho atual: consolidar mundo, história, pessoas e região inicial a partir da base do autor |
| 1.6 Primeira região aprofundada | Depois da preparação narrativa: combate com decisões táticas, equipamento, magia e consequências tardias |
| Blocos posteriores | Mundo, relações profundas, ofícios/economia, magia, aventura/combate, facções, justiça, conteúdo, arte/UI, balanceamento e Android; reavaliar etapas antigas segundo a identidade de RPG |

Trabalhar por fatias jogáveis; preservar código/histórico; registrar o que foi testado e o que ainda não existe. Qualidade, criatividade e agência acima do volume de sistemas.
