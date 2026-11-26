# Plano de continuidade — Fantasy Life

0.5.0 · 26/11/2026.

## Ponto de retomada

**1.3 preservada; 1.4 implementada como fundação conectada de personagem e vida cotidiana.** A direção foi revista por solicitação do usuário: diário vivido, calendário por ações, necessidades, lugares, relações e capacidades de fantasia. Não voltar a tratar o botão anual como experiência principal. O começo atual é um jovem adulto em Ponteclara.

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
- Diário central, abas simples, informações secundárias recolhidas, save/importação/exportação e versão anterior preservada.

Não confundir isso com o modelo social/familiar completo, NPCs com personalidades acabadas ou primeira vida completa do nascimento à morte.

## Próximo bloco: 1.5 — nascimento e contexto procedural

1. Definir dados de família, residência, situação econômica e fases de vida por povo, reutilizando identidade/tempo/conhecimento atuais.
2. Gerar situações iniciais coerentes a partir da seed, com diferentes recursos, pessoas e pressões. Origem oferece meios, não impõe destino.
3. Dar a cada início ao menos duas iniciativas viáveis e um caminho de recuperação; testar contra bloqueios de comida, renda, acesso e tutela.
4. Fazer infância, dependência e passagem de tempo funcionarem sem treinos e refeições clicados centenas de vezes. Projetar rotinas opcionais/resumos antes de expandir anos.
5. Ligar participantes por contexto, fixando a identidade da pessoa escolhida na ocorrência, inclusive depois de save/load. Os diálogos atuais têm IDs concretos; não são seleção genérica por papel.
6. Variar primeiros conflitos e consequências, não somente nomes/raça/números iniciais. Comparar trajetórias com a mesma seed e escolhas diferentes.

Critérios para chamar a etapa de pronta: nascimento/família coerentes, etapas etárias por povo, disponibilidade plausível, capacidades com soluções diferentes, informação privada preservada, nenhum início sem alternativas, UI simples e testes de continuidade. Manter início adulto rápido como laboratório acessível.

## Pendências que não devem desaparecer do roadmap

- Sessões humanas de diversão e balanceamento; a meta de 50h está distante e não foi demonstrada.
- Android físico, leitor de tela, teclado, zoom e exportação/importação real em diferentes aparelhos. A integração VM não substitui esses testes.
- Objetivos e personalidade de NPCs, vínculos familiares, rumores com origem, memória social e consequências tardias mais variadas.
- Treino/trabalho por blocos são o recorte atual. Automatização opcional e resumo de rotinas antes de décadas de simulação.
- Dados de habilidade/condição dos NPCs ainda precisam do mesmo aprofundamento do jogador.
- Raridade de dons ainda não existe: a criação atual permite escolher para testar. Balancear povos/talentos e evitar escolhas dominantes.
- Catálogo fixado por fingerprint, histórico crescente e migrações gerais; planejar migração antes de mudar o catálogo publicado.
- Transferência do legado só sem fila/atividades/decisão/avanço. Não apagar o arquivo anterior nem descartar compromissos para facilitar migração.

## Roadmap

| Etapa | Estado |
|---|---|
| 1.1 Identidade/GDD | Preservada e atualizada |
| 1.2 Tempo/diversidade | Base histórica preservada; perfil em minutos acrescentado |
| 1.3 Escolhas/agência | Implementada; 71 casos anteriores continuam passando |
| 1.4 Personagem e fatia de rotina | Implementada na 0.5.0; expansão social/etária continua no plano |
| 1.5 Nascimento procedural e família | Próximo bloco funcional |
| 1.6 Primeiro ciclo de vida | Integrar fases, rotinas resumidas, morte e consequências de longo prazo |
| 2–14 | Mundo, relações profundas, educação, profissões/economia, magia, aventura/combate, facções/política, justiça, legado, conteúdo, arte/UI, balanceamento e Android |

Trabalhar por fatias jogáveis; preservar código/histórico; registrar o que foi testado e o que ainda não existe. Qualidade, criatividade e agência acima do volume de sistemas.
