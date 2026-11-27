# Plano de continuidade — Fantasy Life

Versão jogável 0.5.2 · Direção revista em 26/11/2026.

## Ponto de retomada

**1.3 preservada; 1.4 implementada como fundação conectada de personagem e vida cotidiana.** A direção foi revista por solicitação do usuário: diário vivido, calendário por ações, necessidades, lugares, relações e capacidades de fantasia. A orientação mais recente retira BitLife das referências ativas: desenvolver um RPG de fantasia com as mecânicas de calendário, relações, necessidades, treino e lugares de Course of Temptation, sem seu cenário ou conteúdo adulto. O começo atual é um jovem adulto em Ponteclara e serve como base para o RPG principal.

Ler `DOCUMENTO_MESTRE.md`, `etapa_1_4/README.md`, `etapa_1_4/docs/DESIGN_E_IMPLEMENTACAO.md` e evidências atuais. Executar `node etapa_1_4/verificar.mjs`. Publicar com `node scripts/preparar-pages.mjs`; enviar código, documentação e build juntos ao repositório **sapatenis132/fantasy-life**, branch `main`, Pages `/docs`.

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

## Próximo bloco: 1.5 — consolidar o ciclo de RPG e variar contextos

1. Conectar um objetivo escolhido pelo jogador a uma expedição ou conflito com diferentes soluções. Preparo, equipamentos, habilidades, informações e vínculos devem mudar as alternativas e os resultados.
2. Aprofundar os lugares atuais: situações persistentes, retornos, descobertas e consequências observáveis. O mapa precisa oferecer razões para ir e voltar.
3. Dar aos moradores objetivos, reações e memória das interações. Suas agendas criam oportunidades de encontro; sua presença e seu conhecimento continuam limitados. Selecionar participantes plausíveis por contexto e fixar seus IDs na ocorrência, inclusive após save/load.
4. Integrar treino e capacidades de fantasia às situações jogáveis. Aprender uma técnica ou despertar um dom precisa mudar o que o personagem consegue fazer, com caminhos também viáveis para outros perfis.
5. Variar origens e condições iniciais por seed quando isso gerar experiências diferentes. Criar ao menos duas iniciativas viáveis e uma forma de recuperação para cada começo, sem exigir nascimento ou infância jogáveis.
6. Projetar atalhos e rotinas opcionais para atividades repetidas. Calendário e necessidades sustentam decisões de preparo e convivência; evitar repetição obrigatória de refeições, descanso e treino.
7. Preparar a próxima fatia de risco/combate com consequências persistentes e espaço para alternativas plausíveis. Não apagar soluções sociais, mágicas ou de exploração para impor um único caminho.

Critérios: objetivo e iniciativa do jogador, capacidades com soluções diferentes, consequências que afetam retornos, informação privada preservada, nenhum começo sem alternativas, UI simples e continuidade após save/load. Comparar trajetórias e efeitos, não apenas quantidade de eventos.

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
| 1.5 Ciclo de RPG e variedade de contextos | Próximo bloco funcional; objetivos, exploração, capacidades e relações conectadas |
| 1.6 Primeira região aprofundada | Consolidar aventura, risco/combate, equipamentos, magia e retornos com consequências |
| Blocos posteriores | Mundo, relações profundas, ofícios/economia, magia, aventura/combate, facções, justiça, conteúdo, arte/UI, balanceamento e Android; reavaliar etapas antigas segundo a identidade de RPG |

Trabalhar por fatias jogáveis; preservar código/histórico; registrar o que foi testado e o que ainda não existe. Qualidade, criatividade e agência acima do volume de sistemas.
