# Histórico de desenvolvimento

## 0.5.2 — 26/11/2026 — necessidades contidas e presentes

- Quatro medidores persistentes no cabeçalho móvel: comida, energia, higiene e ânimo.
- Consulta e cuidados do lugar por toque, com custo real e bloqueio durante decisões/ações em andamento.
- Barras laterais também acessam cuidados; avisos baixos com marcador e texto acessível.
- Lugar em destaque no cabeçalho, barras mais legíveis e espaçamento mais compacto entre ações e saídas.
- 142 casos atuais aprovados e 14 históricos separados; medição de três viewports CSS, rolagem e foco.
- Motor, catálogo, balanceamento e save preservados.

## 0.5.1 — 26/11/2026 — HUD por lugar e cena

- Histórico deixa de preencher a descrição atual; diário em janela própria.
- Painel lateral em telas largas e recolhível no celular, inspirado na organização visual pesquisada de Course of Temptation.
- Lugar, ações, pessoas presentes e saídas próximas na área central; viagem direta pelos locais vizinhos.
- Personagem, habilidades, mochila, pessoas, mapa, agenda e arquivos em janelas; abas com teclado e foco restaurado ao fechar.
- Resultado do comando aparece como passagem breve; Continuar retorna ao local sem tempo adicional.
- Catálogo, regras e save 0.5.0 preservados; nenhum reinício exigido.
- 135 testes atuais aprovados, 14 históricos separados; medidas em três viewports CSS e conferência desktop.

## Direção revista após 0.5.0 — 26/11/2026

- RPG de fantasia como identidade central; BitLife deixa de orientar novas decisões.
- Course of Temptation como referência estrutural para relações, calendário, necessidades, treino e deslocamento entre lugares, sem cenário ou conteúdo adulto.
- Continuidade passa a aprofundar objetivos, exploração, capacidades, relações e aventura.
- Nascimento, infância, envelhecimento até a morte e sucessão deixam de ser entregas obrigatórias.
- Documento mestre, plano, apresentação e instruções de retomada alinhados; a implementação publicada permanece 0.5.0.

## 0.5.0 — 26/11/2026 — Ponteclara / etapa 1.4

- Evolução do motor 1.3, com perfil temporal opcional em minutos e compatibilidade anterior verificada.
- Criação de personagem, origens, povos, traços, talentos e dons com usos nas escolhas.
- Diário, mapa de oito lugares, agendas, necessidades, relações direcionais e habilidades com técnicas.
- Trabalho/projeto por tempo dedicado; aula marcada e consequências de presença/atraso.
- Oportunidades com PRNG salvo, exame de informação e cadeias de descobertas compartilhadas.
- Opções contextuais, bloqueios recolhidos e requisitos explicados; ajustes do mapa após medição em 320 px.
- Versão anterior em `/legado/`, chave separada e transferência sem descartar compromissos ativos.
- 126 casos atuais aprovados e 14 da base original separados; 100 percursos integrados novos. Meta de 50h e Android físico continuam pendentes.


## 0.4.1 — 26/11/2026 — revisão mobile

- História e resultado atual na primeira tela, próximos das decisões.
- Cabeçalho compacto, um controle principal de tempo e navegação História/Atividades/Personagem.
- Arquivos, seed e informações do protótipo em menu separado.
- Consulta de iniciativas sem aplicação automática; navegação não avança o relógio.
- Save e regras do motor preservados; 71 testes locais aprovados.
- Comparação de versões em 320×568, 360×640 e 412×915 no Chrome remoto. Android físico e bateria Playwright completa ainda pendentes.
- Pesquisa e evidências documentadas em `etapa_1_3/docs/REVISAO_UX_0_4_1.md`.

## 0.4.0 — 26/11/2026 — etapa 1.3

- Evolução do relógio e seletor 1.2; código histórico preservado.
- Contrato de conteúdo 1, save 2, validação de dados/operações, migração do save 1 e proteção contra reaplicação.
- Condições compostas, participantes, opções por conhecimento/recursos/vínculos, resultados condicionais/probabilísticos e diário de intenção/resultado.
- Iniciativas sem sorteio, consequências persistentes, rotinas por categoria, interrupções de ações demoradas e retomada/abandono com custos preservados.
- Seleção em marcos semanais fixos, separada de cliques/abertura de menus; seed inicial misturada antes do PRNG existente.
- Fatia com 12 decisões/34 opções, 6 atividades/6 consequências. Retornos ao telhado e poço corrigem bloqueios causados pelo ritmo inicial.
- HTML autocontido com comando principal de envelhecer, exportação/importação e comunicação de falha ao salvar.
- 47 testes de agência, 6 de integração do HTML em VM e 14 de regressão aprovados; mais verificação dos 14 originais intactos. Inclui 500 percursos novos e quatro trajetórias estruturais.
- Validação visual em navegador/Android pendente por limitação do ambiente. Meta de 50 horas ainda não demonstrada.

## 0.3 — pacote de migração preservado

Documento mestre consolidou prioridade de escolhas, HUD simples, meta de variedade e inserção da etapa 1.3 de agência antes do modelo de personagens. Código do laboratório 1.2 e seus 14 testes recebidos sem alterações. Arquivos de referência em `historico/` e `base_original/`.
