# Documento de Game Design — Simulador de Vida Fantástico
**Versão 0.1 | Etapa 1.1 | 26/11/2026**  
Estado: proposta de design inicial, não implementada. Nome definitivo em aberto.

## 1. Visão do produto
Um RPG textual de simulação de vida, do nascimento à morte, em um mundo medieval fantástico. A fantasia é parte da vida cotidiana, não apenas das aventuras. A unidade de jogo é uma vida individual; uma campanha pode futuramente continuar com outra pessoa do mesmo mundo. O jogador não precisa salvar o reino, combater ou acumular riquezas para ter uma vida interessante.

Plataforma proposta: navegador mobile em orientação vertical, português como idioma inicial, execução local em HTML/CSS/JavaScript, sem servidor ou IA generativa obrigatórios. Distribuição futura por GitHub Pages e possível empacotamento Android. Interface, cenário, nomes e números abaixo são provisórios; a escolha de tecnologia será validada no protótipo. Não há repositório ou versão publicada nesta etapa.

Experiência desejada: curiosidade sobre a próxima vida, apego a pessoas, expressão pessoal, satisfação por aprender, surpresa coerente e histórias que o jogador queira contar. Não há pontuação universal que imponha um tipo de sucesso.

## 2. Pesquisa e decisões derivadas
- BitLife: [Google Play](https://play.google.com/store/apps/details?id=com.candywriter.bitlife). Incorporar menu de atividades, diário cronológico e decisões fáceis de entender. Evitar transformar cada ação em uma repetição manual de botões.
- Eight Billion Lives / 1 in 8 Billion: [site oficial](https://eightbillionlives.com/). Incorporar nascimento ponderado pela população e condições sociais. Existem várias implementações públicas com nomes similares; esta é uma referência representativa, não identificação confirmada da versão jogada pelo usuário. Nosso mundo usará distribuições fictícias, não estatísticas reais.
- Life in Adventure: [Google Play](https://play.google.com/store/apps/details?id=com.StudioWheel.Bard). Incorporar escolhas com requisitos, capacidades e consequências. A aventura será uma carreira opcional, não a estrutura obrigatória da vida.
- Crusader Kings II: [GDC, Emergent Stories](https://gdcvault.com/play/1020774/Emergent-Stories-in-Crusader-Kings); [Crusader Kings III](https://www.paradoxinteractive.com/games/crusader-kings-iii/about). Adotar indivíduos, relações e obrigações que persistem; não adotar o foco exclusivo em governo e dinastias.
- Tarn Adams: [Characterization and Emergent Narrative in Dwarf Fortress](https://www.degruyterbrill.com/de/document/doi/10.1515/9783839453452-007/html). Aplicar causalidade sistêmica e memória, sem simular detalhes que não produzam decisões relevantes.
- Emily Short: [Beyond Branching](https://emshort.blog/2016/04/12/beyond-branching-quality-based-and-salience-based-narrative-structures/). Usar unidades narrativas modulares com pré-condições e efeitos em vez de uma árvore gigantesca de finais.
- [MDA, Hunicke, LeBlanc e Zubek](https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/). Projetar a partir da experiência pretendida: mecânica de parentesco → obrigações e apoios entre indivíduos → apego, rivalidade e legado. Mecânica de aptidões → oportunidades desiguais → descoberta e expressão. Mecânica de tempo → consequências e custos de oportunidade → tensão e planejamento.
- [RimWorld Console Edition](https://rimworld.double11.com/features). Incorporar controle de ritmo e diversidade de incidentes, sem fabricar tragédias arbitrárias para punir vidas tranquilas.

Pesquisa documental, não testes práticos dos jogos. As recomendações são decisões de design próprias, não promessas de reproduzir as implementações das referências.

## 3. Pilares e critérios de rejeição
1. Liberdade: caminhos comuns e extraordinários são igualmente legítimos. Rejeitar história principal obrigatória e classe inicial permanente.
2. Identidade: nascimento e experiências afetam opções, sem determinar destino. Rejeitar bônus meramente cosméticos de raça/origem.
3. Causalidade: eventos respeitam local, idade, recursos, conhecimentos e vínculos. Rejeitar NPC morto que envia convite, relação sem histórico ou recompensa sem origem.
4. Persistência: fatos significativos sobrevivem à troca de tela, ao envelhecimento e ao save. Rejeitar reinicialização anual de relações.
5. Rejogabilidade: variar situações, estratégias e trajetórias, não apenas nomes e textos.
6. Profundidade por interação: priorizar regras reutilizáveis que afetem vários sistemas; evitar centenas de variáveis independentes sem uso.
7. Acessibilidade: informação importante à vista, detalhes sob demanda, controle de ritmo pelo jogador.
8. Fantasia divertida: longevidade, magia e criaturas podem quebrar expectativas terrestres; regras internas coerentes, não realismo exaustivo.

## 4. Ciclo de jogo e tempo
Nascimento → estado atual → decisão/atividade → avanço → consequências → diário → nova decisão. Morte encerra a vida; sucessão é uma expansão.

Três tipos de ação: imediata (zero ou poucos dias), projeto/atividade persistente (semanas a anos), evento reativo (uma decisão diante de uma situação). O botão principal de avanço oferece intervalos sugeridos de um mês, uma estação ou um ano. Infância inicial pode oferecer saltos maiores. Estes intervalos serão testados na etapa 1.2. O calendário interno mantém precisão de dias, mas não exige que o jogador controle todos eles.

Atividades persistentes possuem carga de tempo, duração, requisitos, custos, progresso e condição de interrupção. Não se pode dedicar simultaneamente toda a semana a dois trabalhos. Ações imediatas com benefício repetível também têm custo ou limite contextual, impedindo progresso infinito sem tempo. Eventos urgentes interrompem saltos; o restante do intervalo não é perdido nem consumido silenciosamente. Mudanças rotineiras são resumidas no diário; acontecimentos críticos exigem atenção. Se não houver algo relevante, avanço não precisa gerar um incidente.

Ordem conceitual de simulação: definir próximo marco temporal → atualizar atividades e recursos → atualizar indivíduos e mundo → registrar fatos → selecionar evento elegível → pausar se requer decisão → continuar até destino. Eventos agendados usam data e identificador estável; mortes e outras mudanças invalidam eventos incompatíveis. Em caso de empate de data, ordem estável por prioridade e ID. Detalhes técnicos ficam para 1.2.

## 5. Personagens e nascimento
Proposta de grupos de dados: identidade, raça e estágio de vida, residência, família e domicílio, condições atuais, aptidões, traços, habilidades, recursos, relações, histórico. NPC e jogador compartilham modelo de identidade e vínculos; profundidade de simulação pode variar por relevância.

Atributos preliminares: vigor, destreza, intelecto, percepção, presença, vontade, potencial mágico. Condições como saúde, bem-estar e estresse não são aptidões permanentes. Habilidades treináveis (esgrima, agricultura, arcanismo, negociação) são distintas dos atributos. Números, escalas e fórmulas serão definidos na etapa 1.3. Não criar um atributo se não houver decisões ou consequências que ele influencie.

Nascimento padrão aleatório ponderado: região pela distribuição de nascimentos → povo/raça pela demografia local → domicílio coerente com região e estrato → família e condições materiais → características individuais. Não sortear todas as dimensões independentemente: uma criança de camponeses não recebe patrimônio aristocrático sem motivo. Hereditariedade probabilística, variação individual e desenvolvimento posterior impedem determinismo. A origem oferece limitações e oportunidades, não obrigações narrativas. Modo de nascimento personalizado pode ser acrescentado depois; não haverá rerrolagem necessária para que a vida comum seja jogável.

Estágios: primeira infância, infância, adolescência, vida adulta, maturidade e velhice, com limiares específicos por raça quando aplicável. A disponibilidade de escolhas depende também de capacidade, costumes e lei local. O jogador não gerencia diretamente ações complexas de um recém-nascido; primeiras decisões podem ser saltos/respostas simples. Responsáveis tomam decisões autônomas nos primeiros anos. Raças e culturas não são equivalentes: não fixar personalidade ou moralidade pela origem.

## 6. Narrativa: eventos escritos e simulação
Tipos complementares: (a) fatos sistêmicos, por exemplo falecimento de um NPC; (b) storylets, cenas escritas com pré-condições; (c) projetos iniciados pelo jogador; (d) arcos persistentes com estados e prazos. Não há obrigação de concluir arcos opcionais.

Cada evento possui ID, versão, categoria, condições, participantes por referência, contexto, prioridade, peso, limite de repetição, cooldown, texto, opções, requisitos, custo temporal e resultados. Resultados expressos em operações permitidas, não scripts arbitrários dentro do conteúdo. Consequências futuras referenciam IDs de pessoas ou entidades e datas, não somente texto. Um evento pode registrar fato, alterar recurso, criar vínculo, agendar oportunidade ou mudar estado de arco.

Seleção: filtrar condições impossíveis; priorizar obrigações urgentes e eventos diretamente causados por ação; pesar relevância pessoal, novidade e contexto; aplicar cooldown e diversidade; sortear com gerador determinístico da vida. Pesos não autorizam violar pré-condições. Eventos relevantes podem competir por atenção, mas fatos do mundo não desaparecem por não serem apresentados. O jogador recebe informações conforme o que seu personagem pode plausivelmente saber. Diário distingue fatos observados, rumores e inferências quando necessário.

Exemplo original de cadeia (nomes ilustrativos):
- Aos 9 anos, um artesão local precisa de ajuda. Opções: ajudar, recusar, negociar pagamento quando plausível. Ajudar consome uma tarde, cria memória de colaboração e altera confiança. Não garante amizade.
- Anos depois, o mesmo artesão está vivo, próximo, precisa de aprendiz e possui relação positiva: pode oferecer vaga. Se mudou de região, oferta presencial não é possível; se morreu, o arco termina ou passa a um sucessor apenas se uma regra própria o permitir.
- Aceitar inicia aprendizagem, ocupa parte da agenda e permite acumular competência. Recusar não impede estudar com outras pessoas. A oficina pode prosperar ou falir independentemente do jogador.
- Uma falha profissional pode resultar em prejuízo, tensão ou aprendizado, sem exigir game over. Não toda falha precisa premiar.

Pseudodados de exemplo (ilustrativos, não contrato final):
```json
{
  "id": "social.artesao.convite.v1",
  "requires": ["lifeStage=child_or_adolescent", "npc.alive", "npc.local", "npc.profession=artisan", "npc.hasVacancy", "relationship.trust>=threshold"],
  "repeat": "once_per_player_npc",
  "choices": [
    {"id": "accept", "effects": ["start_apprenticeship(npc.id)", "remember(accepted_offer)"]},
    {"id": "decline", "effects": ["remember(declined_offer)"]}
  ]
}
```

## 7. Escolhas, risco e progressão
Cada escolha importante deve alterar pelo menos uma dimensão relevante: oportunidade, relação, recurso, informação, identidade ou risco. Nem toda cena necessita teste; decisões simples têm resultado determinado. Quando há incerteza, usar competência, dificuldade, contexto, ferramentas, ajuda e acaso limitado. Mostrar requisitos conhecidos e indicação qualitativa de risco, sem revelar segredos que o personagem não conhece. Testes podem produzir sucesso parcial e consequências variadas. Não penalizar automaticamente a escolha moralmente boa ou beneficiar sempre a cruel. Evitar opção claramente superior sem custo em todas as situações.

Progressão pela prática, ensino e experiências; não XP universal por clicar em atividades. Proficiência deve permitir novas ações, não apenas números maiores. Combinar habilidades (alquimia e medicina, por exemplo) deve abrir caminhos distintos. Personagens podem mudar de carreira, acumular ofícios e perder oportunidades por decisões e tempo. Magia poderosa exige meios de aprendizado, custo ou limitação coerente; não é obrigação para a vida interessante.

## 8. Mundo e NPCs: escopo sustentável
Mundo planejado com regiões, assentamentos, organizações, culturas e população. Proposta inicial: geografia autoral com demografia, indivíduos e circunstâncias procedurais. Não é necessário gerar continentes completos por seed na v0.1. Próximos estudos decidirão mundo fixo ou híbrido. Tempo global avança junto à vida e não durante o jogo fechado por padrão.

Simulação em níveis: indivíduos próximos (família, amigos, colegas) atualizados com detalhes; contatos distantes atualizados por marcos; população anônima agregada. NPC nomeado possui ID, residência, idade, ocupação, traços, vínculos e fatos relevantes. Decisões autônomas consideram capacidade, desejo, relações e oportunidades. Conhecimento não é compartilhado globalmente. Mudanças significativas preservam referência e data.

Família e relações são direcionais: confiança de A em B pode ser diferente da confiança de B em A. Parentesco é vínculo estrutural, não afeição automática. A vida do NPC não gira em torno do jogador. A mesma pessoa não deve desaparecer simplesmente ao fechar um menu. Guerras, epidemias e grandes crises são futuras expansões; a base deve aceitar efeitos regionais sem reescrever todas as atividades.

## 9. Interface e apresentação
Mobile vertical; texto conciso e evocativo. Tela principal: identidade, idade/local, poucos indicadores essenciais, diário, botão de avanço, menus de atividades e pessoas. Detalhes de atributos, habilidades, posses e mundo em telas próprias. Decisões interrompem avanço quando necessário e apresentam custos e requisitos conhecidos. Desabilitar opções somente com motivo explicável; não misturar bloqueio de interface com falha de simulação. Tamanho de texto ajustável como meta; evitar imagens obrigatórias para entender a informação. Diário filtrável no futuro. Arte será definida depois do núcleo de jogo; sem comprometer a identidade visual por atalhos precoces.

## 10. Arquitetura preliminar
Motor separado da interface. Estado serializável com versão, seed e estado do PRNG, relógio, jogadores/NPCs, entidades, relações, atividades, eventos pendentes, histórico e IDs únicos. Catálogos de raças, atividades e storylets externos em dados versionados. Cada ação validada pelo motor produz efeitos atômicos e entradas no diário; a UI não altera diretamente atributos. Fluxo de execução: comando → validação → resolução → atualização → registro → renderização. Save local após ações completas, exportação/importação e migração de versão planejadas. Falha de save deve ser comunicada; não substituir arquivo válido por estado incompleto. Não depender de conexão para lógica principal. PRNG persistido e IDs estáveis permitem reproduzir bugs; mesma seed, versão e ações devem produzir o mesmo estado. A implementação técnica detalhada não faz parte desta entrega.

## 11. Recorte jogável v0.1 (proposta)
Objetivo: uma vida simples, do nascimento à morte, jogável mesmo sem sistemas avançados. Três raças de teste, três ambientes sociais, três estratos materiais, família inicial, atributos básicos, seis atividades, quatro etapas funcionais ou mais de vida, 30 storylets originais (10 infância, 10 adolescência, 10 adultez/velhice), pelo menos quatro cadeias de dois ou mais eventos, envelhecimento de parentes próximos, diário, salvamento e reinício. Quantidades são metas propostas, não conteúdo pronto. Trabalhos adultos simples serão necessários para não deixar metade da vida vazia. Pelo menos três trajetórias: vida rural, artesanato, aprendizado acadêmico/mágico rudimentar. Não incluir combate completo, política profunda, dinastias controláveis, economia global, geração de mapas extensos ou arte final no primeiro protótipo. Não chamar a v0.1 de jogo completo.

## 12. Aceitação e testes
- Gerar 1.000 nascimentos automaticamente: distribuição dentro de tolerância estatística definida, nenhum domicílio inválido, nenhum ID duplicado, atributos dentro dos limites.
- Rodar vidas com seeds fixas e ações iguais; comparar estado final e histórico. Save/carregamento no meio não muda resultados.
- Rodar ao menos 100 vidas automatizadas com ações válidas; nenhuma exceção, idade regressiva, recurso negativo sem regra de dívida, relação com ID inexistente ou morte sem encerramento. Isso testa robustez, não diversão.
- Testar salto de um ano que encontra evento obrigatório no terceiro mês: pausar no dia correto; retomar o restante após escolha; evitar evento duplicado. Testar NPC que morre antes de convite agendado.
- Testar que repetição de ações gratuitas não produz benefício ilimitado e que cooldowns persistem após salvar.
- Testar seis vidas manualmente com origens e trajetórias distintas; medir variedade de situações e decisões, número de cliques repetidos e pontos mortos. Registrar evidências, não só contagem de eventos.
- Testar interface em viewport de 360 × 640 e 412 × 915 CSS px e em Android real quando disponível; alvos de toque confortáveis, sem rolagem horizontal, informação legível. Testes efetivos ainda não realizados.
- Testar acessibilidade das escolhas: motivo de bloqueio claro; retorno de ação compreensível; avanço interrompível; resumo de vida e possibilidade de reinício.

## 13. Riscos e medidas
Explosão de conteúdo: templates condicionais e chains reutilizáveis, com textos escritos e revisão de repetição. Mundo incoerente: invariantes e simulação por níveis. Grind: projetos persistentes e custos de oportunidade. Vida comum vazia: conteúdo doméstico, aprendizado, carreira e relações antes de aventuras. Aleatoriedade injusta: sinais de risco, pesos contextuais, alternativas e falhas variadas. Telas lotadas: divulgação progressiva. Desempenho: benchmark no celular antes de aumentar escala. Complexidade sem diversão: protótipos de baixo custo e testes de decisões reais. IA externa não necessária e não prevista no MVP.

## 14. Próximas etapas
1.2: especificar relógio, avanço, interrupções, agenda, tipos de atividade, limites anti-grind e casos de teste. Produzir protótipo do motor temporal antes de expandir conteúdo.
1.3: formalizar personagem, atributos, condições, traços e progressão; definir estrutura de dados e limites.
1.4: geração de nascimento e família, distribuição ponderada, regiões de teste e consistência.
1.5: integrar interface, eventos, diário e save no protótipo jogável; validar os critérios acima.
Etapas posteriores: worldbuilding, NPCs/relações, educação, profissões, magia, combate, organizações, justiça, dinastias, conteúdo, arte, balanceamento e publicação. Ordem poderá ser refinada conforme dependências.

Decisões firmes de direção: simulador textual de vida fantástica, liberdade de carreira, escolhas e tempo, sem trama obrigatória. Propostas reversíveis: calendário e granularidade, tecnologia, escala do MVP, quantidade de raças/eventos, interface, nomenclatura, mundo híbrido, sucessão, distribuição e dificuldade. Nenhuma implementação, teste em celular ou publicação ocorreu nesta etapa.
