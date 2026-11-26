# Plano de continuidade — Fantasy Life

Versão 0.4.0 · 26/11/2026.

## Estado atual

**1.3 — Arquitetura de escolhas e agência implementada como fatia de laboratório.** O motor 1.2 foi evoluído; a base histórica permanece intacta. Veja `etapa_1_3/README.md`, o contrato e o relatório em `etapa_1_3/docs/`. O documento mestre mantém autoridade sobre GDDs antigos.

Há contrato versionado, condições, participantes, efeitos permitidos, resultados condicionais/probabilísticos, iniciativas sem sorteio, informação por indivíduo, custos, rotina automática, fila causal, ações interrompidas, save/load, migração v1 e visão pública. A amostra possui 12 decisões e 34 opções conectadas. O HTML serve para revisar esse recorte; não é a etapa 1.6 completa.

## O que verificar ao retomar

1. Ler `DOCUMENTO_MESTRE.md`, este plano, `etapa_1_3/README.md` e `docs/ARQUITETURA_ESCOLHAS.md`.
2. Executar, da pasta principal: `node etapa_1_3/scripts/verificar.mjs`.
3. Conferir os quatro percursos e estados em `etapa_1_3/evidencias/`.
4. Abrir o HTML e completar a validação visual/toque/save/exportação em navegador e Android. Os testes de integração do HTML usam VM e DOM mínimo; não verificam layout. `tests/navegador.mjs` contém os cenários preparados, mas sua execução ficou bloqueada por falta de Chromium local utilizável. Não declarar esses testes como aprovados.
5. Preservar o histórico antes de mexer nos contratos; não reiniciar o motor nem publicar no repositório do RPG isométrico.

## Próxima etapa funcional: 1.4 — estrutura de personagens

Entregar uma estrutura mínima reutilizável para jogador e NPC, antes de geração procedural de nascimento. Aplicar os contratos de escolhas já existentes; evitar trocar toda a arquitetura por um sistema novo.

- Identidade persistente: nome, nascimento, povo/raça e regras de idade, residência, estado vital. Estágios de vida devem ser dados, sem fixar duração humana para todos.
- Separar aptidões, habilidades, condições, traços e conhecimentos. Só criar uma dimensão se ela alterar escolhas ou consequências demonstráveis. A lista de atributos do GDD 0.1 é proposta, não obrigação de implementar sete barras.
- Relações direcionais, parentesco e memórias relevantes sem afeição automática. Registrar quem sabe o quê e a origem plausível das informações. Rumor e certeza ainda não existem na fatia 1.3.
- Ligação dinâmica de participantes: uma oportunidade pode selecionar uma pessoa plausível, fixar seu ID na ocorrência e manter essa identidade até a resolução. Não substituir um NPC morto por outro silenciosamente.
- Disponibilidade por residência, idade/etapa, saúde e compromisso; revalidar iniciativas, ações em curso, rotinas e consequências. Hoje as rotinas continuam durante ações breves no mesmo contexto; viagens ainda precisam de regras próprias.
- Reaplicar parte da amostra com contextos/indivíduos distintos para verificar que origem influencia meios e relações sem impor destino.

Critérios: integridade de IDs/entidades; idades coerentes; conhecimentos privados preservados; consequências referenciando a mesma pessoa após save; escolhas realmente diferentes por capacidade/vínculo; ausência de atributos decorativos; HUD sem expansão obrigatória. Não criar centenas de eventos nesta etapa.

## Pendências e limites conhecidos

- Completar testes visuais/acessibilidade e verificar abertura de HTML/armazenamento no Android real.
- Os valores de prática, renda, custos e confiança são provisórios; não há análise de estratégia dominante ou teste humano de diversão.
- A meta de 50 horas não foi atingida nem demonstrada. Catálogo de revisão é pequeno e se esgota.
- Não há nascimento procedural, economia/social completos, recuperação de saúde, viagens, morte natural ou ciclo de infância a velhice.
- Fingerprint de catálogo é a serialização completa; diário e ledgers crescem. Compactação, migrações entre catálogos e desempenho de décadas são futuros trabalhos.
- O catálogo tem IDs concretos de participantes; semântica antirrepetição não abrange ainda contexto por entidade nem memória entre vidas.

## Roadmap vigente

| Etapa | Situação / entrega |
|---|---|
| 1.1 Identidade/GDD | Concluída como documentação |
| 1.2 Tempo/diversidade | Laboratório original preservado; fachada temporal revista na 1.3 |
| 1.3 Escolhas/agência | Implementada, 67 testes atuais aprovados; validação visual pendente |
| 1.4 Estrutura de personagens | Próximo bloco funcional |
| 1.5 Nascimento procedural | Após validar o modelo de indivíduos e família |
| 1.6 Primeiro protótipo de vida | Integração de nascimento, vida, save e ciclo básico; o HTML 1.3 não a substitui |
| 2–14 | Mundo; relações; educação; profissões/economia; magia; aventura/combate; organizações/política; justiça; legado; conteúdo; arte/UI; balanceamento; publicação Android |

## Modo de trabalho

Escolhas e liberdade > consequências/variedade > profundidade sistêmica > gerenciamento. Ampliar em fatias verificáveis, manter documentos vivos, registrar falhas e limites, medir variedade de trajetórias em vez de apenas IDs. Não alegar publicação ou testes inexistentes. O repositório específico foi confirmado e criado: `sapatenis132/fantasy-life`. Usá-lo para este projeto; verificar `PUBLICACAO.md` para o estado do GitHub Pages.
