# Fantasy Life — relatório da etapa 1.3

**Versão 0.4.0 · 26/11/2026.** Arquitetura de escolhas e agência implementada como fatia verificável, a partir do motor existente. Fonte e testes originais conservados byte a byte. Documento mestre, plano, changelog e prompt de continuidade atualizados; os anteriores estão em `historico/`.

## O que mudou para o jogador

O jogador pode buscar trabalho e estudo, decidir o destino de um livro, combinar conhecimentos para construir uma lanterna, voltar a um problema adiado e obter uma encomenda como consequência de uma intervenção. Nenhuma dessas iniciativas exige receber um sorteio favorável primeiro.

Examinar o livro não o consome: vender depois conserva as anotações. Entregá-lo à mentora cria contato, sem aceitar uma profissão automaticamente. Ajudar a família admite dinheiro, trabalho e uma criação própria. Recusar um compromisso preserva a possibilidade de tomar outra iniciativa; consequências já ocorridas continuam no mundo.

O tempo tem um botão principal de envelhecer, com pausa diante de decisões. Ocupação e projeto progridem automaticamente; custos e prática não dependem de cliques de treino. A interface de revisão é um HTML autocontido, com tentativa de save local e exportação/importação.

## Escopo implementado

| Camada | Entrega |
|---|---|
| Contrato | ID/versão, condições, participantes, opções, efeitos e resultados; validação sem scripts de conteúdo |
| Agência | Iniciativas, requisitos, motivos de bloqueio, opções reveladas por conhecimento e resultados condicionais/ponderados |
| Causalidade | Efeitos imediatos e tardios, conhecimento individual, relações direcionais mínimas, invalidação por morte/local/contexto |
| Tempo | Marcos fixos semanais, ação demorada interrompível, respostas demoradas com suspensão da ação anterior, retomada/abandono |
| Persistência | Save v2, migração do laboratório v1, fila e ações em curso persistentes, proteção contra clique duplicado e catálogo incompatível |
| Conteúdo | 12 decisões, 34 opções, 6 atividades e 6 consequências; três retomadas reutilizam abordagens existentes |
| Revisão | HTML simples, testes reproduzíveis, quatro trajetórias estruturais e saves importáveis |

## Aceitação da arquitetura

| Critério do plano original | Evidência efetiva |
|---|---|
| Mesmo estado/seed/escolhas reproduzem resultados | Comparação integral de save, inclusive resultados incertos e interrupção/save/load |
| Escolhas alteram fatos e oportunidades | Quatro trajetórias medidas; notas, dinheiro, prática, confiança, contatos e encomenda divergem |
| Escolhas impossíveis não executam | Recursos, compromissos, token, pessoa morta/ausente e rollback de efeitos inválidos |
| Consequências persistentes e únicas | Consequência após save aplicada uma vez; evento no dia da morte invalidado; instâncias repetidas rejeitadas |
| Iniciativa sem evento aleatório | Trabalho/estudo, livro, criação, comércio, retorno ao poço e ao telhado |
| Decisão bloqueia avanço indevido | Pausa, escolha sem auto-retomada, preservação de alvo, respostas demoradas e abandono |
| Clique frequente não cria oportunidades | Mesma simulação em salto e cliques diários; consultas de UI não mudam PRNG/exposição |
| Relatório real e trajetórias diferentes | Logs de execução, 500 percursos novos, quatro estados estruturais e limites abaixo |

## Testes executados

Ambiente: Node.js v24.22.3. Comando de reprodução: `node etapa_1_3/scripts/verificar.mjs`, a partir da pasta principal.

| Conjunto | Resultado |
|---|---:|
| Regressão dos casos 1.2 no motor evoluído | 14/14 |
| Agência, tempo, efeitos, persistência e conteúdo | 47/47 |
| Bundle HTML em VM com DOM mínimo | 6/6 |
| Total da versão atual | **67/67** |
| Base histórica executada separadamente | 14/14, mesmos casos, sem somar como novos |

A bateria de agência contém 500 percursos automatizados válidos atravessando escolhas, pausas e saves. A regressão contém mais 500 sequências legadas de laboratório. Os quatro caminhos abaixo verificam diferenças no estado em vez de apenas sequências de IDs.

As verificações de HTML executam o bundle real para detectar problemas de sintaxe/empacotamento, ligação dos comandos, save/reload/importação, decisão pendente e erro de armazenamento. Usam uma superfície DOM mínima em VM. **Não verificam pixels, rolagem, foco real, toque, acessibilidade completa ou download num navegador.**

## Comparação controlada

Mesma seed 2026, recursos, idade, NPCs e mundo inicial; estado medido após 365 dias. Dados gerados por `scripts/demonstrar.mjs`.

| Caminho | Moedas | Ofício | Arcanismo | Livro / notas | Confiança de Maíra | Consequência distinta |
|---|---:|---:|---:|---|---:|---|
| Cuidar de casa | 12 | 7 | 0 | 1 / 0 | 0 | Conserva o achado sem seguir aventura |
| Trabalho e comércio | 71 | 60 | 0 | 0 / 0 | 1 | Conhece a banca por contato da venda |
| Aprendizagem acompanhada | 12 | 187 | 12 | 0 / 0 | 3 | Ganha técnica sem renda de trabalho |
| Conhecimento, criação e retorno | 60 | 88 | 28 | 0 / 1 | 1 | Volta aos problemas com preparo e conclui encomenda |

Todas as casas acabam reparadas, com custos e trajetórias diferentes. Essa convergência conserva os efeitos anteriores. A tabela não é um ranking: números são provisórios e não há objetivo universal. Trajetórias completas, ações por data e saves estão em `../evidencias/`.

## Problemas encontrados e tratados

- **Criação chegava depois da conversa doméstica:** o jogador agora pode retomar o telhado após recusar e usar a lanterna produzida posteriormente. Reparar também remove a interdição do quarto já danificado.
- **Preparar-se fechava uma oportunidade:** o poço ganhou adiamento com retorno por iniciativa própria. O jogador não precisa depender de novo sorteio para usar a técnica aprendida depois.
- **Recompensa fantasma em conclusões simultâneas:** a conclusão de uma atividade que cancela outra na mesma data agora impede a conclusão/recompensa da cancelada. Há teste específico.
- **Resposta demorada consumia o restante do salto:** agora só sua própria duração avança; a ação suspensa e o restante do ano continuam aguardando retomada explícita. Há teste de reação demorada e de pausa anual.
- **Importação e aplicação parcial:** arquivos inválidos e falhas de efeito não alteram o estado válido; falha de armazenamento é comunicada sem apagar a escolha na sessão.

## Validação visual pendente

O pacote traz `tests/navegador.mjs` com cenários para 320×568, 360×640, 412×915 e 1280×800, abertura direta e falha de armazenamento. As tentativas de inicialização encontraram ausência de Chromium utilizável; a alternativa remota não acessou o servidor local. Esses cenários **não foram aprovados** e não entram no total de 67. Não houve teste em Android físico nem teste humano de jogabilidade.

## Limites e próximos passos

A meta de cinquenta horas orienta o design e ainda não foi demonstrada. A amostra é pequena, com começo fixo aos 16 anos; seu conteúdo se esgota. Não existe geração de nascimento, autonomia social completa, envelhecimento/morte natural, viagens ou economia/medicina final. Participantes ainda são IDs concretos; o conhecimento não distingue rumor e certeza.

Há fundamentos reutilizáveis para ampliar variedade, mas não prova de balanceamento ou de ausência de estratégia dominante. O save fixa o catálogo completo e o histórico cresce; compactação e migração entre conteúdos precisam de trabalho posterior.

O próximo bloco funcional é **1.4 — estrutura de personagens**, com identidade compartilhada jogador/NPC, progressão multidimensional e ligação dinâmica de participantes. A validação visual pode ser concluída em paralelo à revisão dessa base, preservando a HUD simples. O primeiro protótipo integral de vida permanece na etapa 1.6.
