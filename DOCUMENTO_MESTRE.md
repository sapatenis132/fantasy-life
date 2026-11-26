# Fantasy Life — documento mestre de design

Versão 0.5.0 · 26/11/2026. Nome de trabalho. Estado e decisões atuais prevalecem sobre GDDs históricos.

## Identidade e prioridades

RPG de vida textual medieval fantástico. O jogador vive como um indivíduo, com espaço para uma vida comum ou extraordinária, sem classe definitiva, herói obrigatório ou campanha principal imposta. Acessibilidade de BitLife, escolhas de Life in Adventure e diversidade de 1 in 8 Billion permanecem referências; o avanço anual deixou de ser a interface principal por orientação do usuário.

1. **Liberdade e escolhas significativas.** Iniciativa, consequências e meios diferentes para perseguir objetivos. A simulação serve às escolhas.
2. **Variedade profunda.** Meta: mesmo após 50 horas, não sentir a mesma experiência. Variar conflitos, abordagens, relações, oportunidades e consequências; textos cosméticos e contagem de eventos não comprovam a meta.
3. **Interface simples no celular.** A história deve aparecer primeiro. Complexidade no motor, sistemas secundários sob demanda e nenhuma lista enorme de obrigações no primeiro instante.

Escolhas e liberdade > consequências/variedade > profundidade sistêmica > gerenciamento. Qualidade, criatividade e profundidade têm prioridade sobre volume ou velocidade.

## Direção atual: acompanhar uma vida pelo diário

Criar um personagem → perceber a situação e as pessoas presentes → escolher o que fazer ou aonde ir → viver o resultado → registrar a experiência. Ações, deslocamentos, descanso e treino movem um calendário. Dias continuam existindo no mundo, mas não são turnos que o jogador precise consumir mecanicamente. O tempo não passa durante leitura ou navegação.

Course of Temptation é referência somente para relações, agendas, calendário, necessidades, treino e navegação por lugares. Nenhum cenário ou conteúdo adulto dessa referência faz parte do projeto. Habilidades, traços, talentos, povos e dons singulares devem produzir soluções e trajetórias de fantasia, não apenas números.

Aleatoriedade é parte do gameplay: encontrar circunstâncias inesperadas, lidar com informação incompleta e avaliar risco. Preparo, capacidade, relações e decisões mudam as alternativas e seus resultados. Não sortear novamente ao abrir menus; não usar surpresa como desculpa para ignorar intenção ou consequências.

## Regras de escolhas, pessoas e continuidade

Situações modulares ligadas ao estado persistente. Separar fatos, propostas e iniciativas. Cada opção precisa de intenção compreensível, condições, custos e resultados plausíveis. Consequências podem mudar acesso, recursos, conhecimento, relações, saúde e oportunidades posteriores. Recusar, investigar, negociar, guardar para depois e não interferir devem existir quando fizerem sentido. Fracasso pode custar algo e ensinar ou mudar a situação; não precisa ser uma tela vazia nem uma recompensa garantida.

NPCs têm identidades estáveis, conhecimento individual e relações direcionais. Não sabem automaticamente o que o jogador fez. Uma pessoa que foi embora não pode concluir uma conversa como se ainda estivesse presente. Não automatizar amizade, romance, crimes ou compromissos importantes. O mundo deve progredir também sem o protagonista, com profundidade proporcional à relevância.

## Interface e tempo vigentes

- **Diário / Mapa / Personagem**; resultado e decisão juntos, cabeçalho compacto e um botão principal contextual.
- Criar nome e origem primeiro; personalização adicional recolhida.
- “O que fazer aqui” revela iniciativas locais. Opções bloqueadas ficam em “Outras possibilidades”, com requisitos explicados.
- Necessidades completas e habilidades ficam em Personagem; HUD sinaliza somente condições baixas.
- O mapa mostra lugares conectados e duração do caminho antes de viajar. Uma decisão interrompe o trecho e preserva sua duração restante.
- Retomar ou abandonar exige iniciativa. Nunca simular offline por padrão ou escolher pelo jogador.
- O kernel suporta perfis temporais. O legado permanece em dias; Ponteclara opera em minutos. O botão anual e as rotinas passivas antigas não definem a direção atual.
- Rotinas repetidas e períodos longos precisarão de automação opcional e resumos. Não expandir o jogo como uma lista infinita de tarefas de manutenção.

## Estado implementado — 0.5.0

A arquitetura 1.3 foi preservada e estendida. A fatia 1.4 entrega criação de jovem adulto, identidade reutilizável, oito lugares em Ponteclara, calendário, três moradores com agendas, necessidades com recuperação, relações direcionais e amizade, cinco habilidades com técnicas aos 60 pontos, três traços, talentos por habilidade, três povos, dois dons despertos e um potencial latente que pode despertar.

Treino, trabalho e projetos ocupam tempo dedicado. Uma aula marcada tem horário e janela de chegada. Oportunidades são selecionadas em marcos fixos com contexto e intervalo; o resultado oculto do reagente é persistido. Exemplos conectados incluem livro, poço, passagem, lanterna, coleta noturna, descoberta compartilhada, encomenda especializada e devolução ou venda de um pacote encontrado. Resolver problemas com outro conhecimento ou dom muda o que o personagem aprende e faz depois.

O jogo está em [sapatenis132.github.io/fantasy-life](https://sapatenis132.github.io/fantasy-life/), no repositório separado [sapatenis132/fantasy-life](https://github.com/sapatenis132/fantasy-life). `docs/index.html` é o build autocontido atual. A versão 0.4.1 permanece em `/legado/`. A chave de save nova é separada; transferência é explícita e recusa compromissos ainda ativos. A base original não foi alterada.

Verificação automatizada: **126 casos atuais** — 71 anteriores + 43 de vida + 12 da nova UI — e 14 testes da base histórica executados separadamente. Inclui 100 percursos integrados novos e 500 de agência da etapa anterior. Isso verifica consistência, não diversão ou 50 horas de conteúdo. Evidências e limites da verificação visual em `etapa_1_4/evidencias/VALIDACAO_MOBILE.md`.

## Limites e próximos blocos

O começo atual é fixo em uma vila e não demonstra o ciclo inteiro de vida. Nascimento procedural, família, infância, fases de vida, morte natural, romance, facções, combate completo e mundo amplo são etapas futuras. NPCs têm uma base de agenda e vínculo; objetivos, personalidade reativa e desenvolvimento autônomo ainda precisam de profundidade. Economia, curva de aprendizado e raridade de dons são provisórias.

A direção permanece: ampliar combinações e consequências antes de despejar centenas de eventos. Próximo bloco: completar validações do personagem e projetar **1.5 — nascimento, família e contexto procedural**, ligados às possibilidades de início. Preservar opção de início rápido adulto para testes, sem substituir o simulador de vida por uma aventura única. Veja `PLANO_DE_CONTINUIDADE.md` e `etapa_1_4/docs/DESIGN_E_IMPLEMENTACAO.md`.
