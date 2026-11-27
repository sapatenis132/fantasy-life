# Do simulador anual ao diário vivido — 0.5.0

26/11/2026. Este documento descreve a entrega 0.5.0. Direção revisada após a entrega: o projeto é um RPG de fantasia com as mecânicas de relações, calendário, necessidades, treino e lugares de Course of Temptation. BitLife deixa de ser referência ativa. O documento mestre e o plano de continuidade registram a nova prioridade de exploração, progressão e aventuras; as regras anuais antigas permanecem somente no histórico e no laboratório legado.

## Experiência entregue

Criação resumida por nome e origem, com povo, traço, talento, dom e seed em personalização opcional. O começo é fixo em Ponteclara, às 08:00, com um jovem adulto. Origens e contextos poderão variar para ampliar os caminhos do RPG; nascimento e infância jogáveis não são requisitos. Humano começa aos 18 anos, elfo aos 40 e anão aos 30. Essas idades são parâmetros iniciais do mundo, não uma simulação completa de estágios ou longevidade.

O diário mostra o resultado recente, o lugar e as pessoas presentes. A ação principal abre iniciativas locais. Mapa e personagem ocupam abas próprias; outras possibilidades bloqueadas ficam recolhidas e explicam condições concretas. Não há avanço offline nem sorteio ao consultar uma aba. A HUD mostra horário/data/moedas e avisa necessidades apenas quando baixas.

## Como os sistemas produzem escolhas

| Sistema | Efeito verificável |
|---|---|
| 8 lugares conectados | Caminhos têm custo, percorrem trechos e podem ser interrompidos; encontrar uma decisão não teleporta o personagem |
| Calendário | Ações custam minutos; moradores seguem horários; uma aula marcada pode ser cumprida, recusada com aviso ou perdida |
| Saciedade e energia | Limitam tarefas exigentes; comida, descanso e sono recuperam; sem morte instantânea por uma barra vazia |
| Higiene e ânimo | Alteram aproximação social e aprendizado, respectivamente |
| Origens e talentos | Mudam habilidade inicial e ganho por prática; não fecham profissões |
| Traços | Observador encontra outra solução; Sociável melhora aproximação; Persistente aprende mais com uma tentativa malsucedida |
| Povos | Anão perde menos energia na rotina; elfo consegue coletar à noite sem lanterna; humano usa o ritmo básico |
| Dons | Eco espiritual abre conversa com presença e uma passagem; Pulso vital cura com custo e intervalo; potencial latente pode despertar por estudo/exploração |
| Habilidades | Ofício, Alquimia, Arcanismo, Esgrima e Exploração; ao alcançar 60, abrem técnicas ou usos concretos |
| Relações | Confianças direcionais separadas; amizade exige iniciativa e reciprocidade suficiente; convivência não vira romance automático |
| Conhecimento | O livreiro aprende sobre o livro quando consultado; Maíra só recebe a descoberta do poço quando você a conta |
| Projetos e trabalho | Pagamento e avanço só na conclusão de tempo dedicado; não rendem durante viagem, lazer ou sono |
| Aleatoriedade | Oportunidades em marcos fixos, com chance, contexto, limites e intervalo; qualidade do reagente nasce uma vez no encontro e persiste |

Cadeias conectadas: estudar/consultar/vender o livro; construir/guardar/vender a lanterna ou usá-la na coleta noturna; investigar o poço por habilidade/traço/dom e compartilhar ou guardar o achado; encomenda especializada após compartilhar; encontrar uma encomenda e devolver ou vender; examinar/comprar/recusar um reagente e depois preparar tinta; salvar uma criatura por técnica/dom ou tentativa incerta.

Rotinas têm custos moderados. Sem dinheiro nem comida, ajudar na taverna em troca de refeição permite recuperar-se e voltar a trabalhar. Esse caminho evita um bloqueio econômico no começo. Valores de renda, confiança e crescimento ainda precisam de sessões humanas de balanceamento.

## Continuidade técnica

O motor 1.3 conserva transações, PRNG salvo, fila causal, custo de escolhas, pilha de ações interrompidas e validação de participantes. Foram acrescentadas extensões opcionais:

- `catalog.clock`: unidade, ticks por dia, intervalo e chance dos pulsos.
- `createEngine(catalog, simulation)`: ganchos de validação, sincronização, progresso, marco adicional, conclusão de escolha e geração de oferta. São código confiável da aplicação; conteúdo declarativo continua sem funções/eval.
- `need:*`: necessidade numérica usada nas mesmas condições/efeitos do contrato.
- `completionRequires`: condições que precisam permanecer verdadeiras ao terminar. Evita invalidar um treino porque o esforço consumiu a energia exigida para começar.
- `resolution: 'first'`: primeira condição satisfeita, seguida de fallback; usada quando habilidade/informação determina resultado. Seleção ponderada permanece o padrão anterior.

`state.day` conserva o nome do campo por compatibilidade, mas contém ticks do perfil: dias no catálogo 1.3 e minutos no 1.4. `state.clock` valida o perfil do save e o cálculo de idade usa ticks por dia. Adaptadores de UI usam `calendar()`, nunca apresentam esse campo como dias. O catálogo é fixado por fingerprint; atualizações de conteúdo exigirão migração própria.

Necessidades guardam resto inteiro de divisão por hora. Partir 121 minutos em 121 comandos de um minuto produz a mesma perda e sequência de RNG. Ganhos de prática, entrega e salário acontecem somente ao concluir uma opção. Em uma interrupção, a resposta consome seu próprio tempo e a ação original fica suspensa. Retomar uma rota é comando explícito. Parar após o trecho atual cancela as próximas pernas e preserva a que já começou.

Identidade de jogador e moradores usa os mesmos campos (`id`, nome, povo, origem, traço, talento e dom). Saúde, conhecimentos, relações e localização permanecem no estado existente; habilidades do jogador não são duplicadas dentro da identidade. Os NPCs ainda não têm desenvolvimento completo de habilidades, emoções, objetivos ou família. Conversas são um primeiro vínculo, com IDs concretos; não há substituição silenciosa de interlocutor.

O encontro social diário entre Maíra e o livreiro demonstra vida sem o jogador; somente vira texto no diário se testemunhado. Não representa uma sociedade autônoma completa.

## Referências aplicadas

Course of Temptation foi referência estrutural de agendas, relações por iniciativa, deslocamento, necessidades e treino. Não foram importados cenário, personagens ou conteúdo adulto. Foram consultados os devlogs oficiais do autor: [relacionamentos](https://anarchothaumaturgist.itch.io/course-of-temptation/devlog/745345/course-of-temptation-sticky-situationships-update-050h), [agendas e atividades](https://anarchothaumaturgist.itch.io/course-of-temptation/devlog/1656057/course-of-temptation-september-update-v083), [habilidades e eventos](https://anarchothaumaturgist.itch.io/course-of-temptation/devlog/883186/course-of-temptation-february-update-v062) e [roadmap](https://courseoftemptation.com/roadmap). São referências pesquisadas; não uma alegação de ter jogado a obra.

A hierarquia mobile preserva os princípios já pesquisados e registrados em `etapa_1_3/docs/REVISAO_UX_0_4_1.md`: narrativa primeiro, decisões próximas ao contexto, divulgação progressiva e controles acessíveis. Nesta etapa, a validação real usa o harness `/vida-preview/` com armazenamento separado.

## Limites explícitos

Ainda não há nascimento procedural, infância, envelhecimento natural, morte por idade, família gerada, romance, combate completo, facções, economia dinâmica, cidades adicionais nem variedade sustentada por 50 horas. A criação permite escolher o dom para testar os caminhos; a distribuição de raridades entre nascimentos ainda não foi implementada. O equilíbrio entre povos e talentos é provisório.

Treino, trabalho e projeto usam blocos dedicados no protótipo. Agendas de rotinas repetidas, automação opcional e resumo de períodos longos devem ser projetados antes de expandir décadas de vida; não transformar necessidades em uma sequência obrigatória de cliques. Também faltam migrações gerais entre catálogos, compactação de histórico, acessibilidade com leitor de tela e teste no aparelho Android físico.
