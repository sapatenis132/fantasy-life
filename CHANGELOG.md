# Histórico de desenvolvimento

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
