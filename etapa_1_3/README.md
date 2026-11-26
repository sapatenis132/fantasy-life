# Fantasy Life — etapa 1.3

Arquitetura de escolhas e agência, continuando o motor 1.2. Versão do trabalho: **0.4.1**, 26/11/2026. A base histórica permanece em `../base_original/`.

## Experimentar

**Online: https://sapatenis132.github.io/fantasy-life/**

Após a etapa 1.3, um fluxo básico foi confirmado no Chrome remoto: escolhas, pausa e recuperação do save. Os testes automatizados de múltiplos viewports e o Android físico continuam pendentes.

Abra `Fantasy_Life_Laboratorio_1_3.html` em um navegador com JavaScript habilitado. O arquivo inclui motor, conteúdo e interface; não precisa de instalação, servidor ou conexão para executar a lógica. O suporte real de abertura de arquivos e armazenamento no Android ainda precisa ser verificado.

A amostra começa aos 16 anos em uma vila fixa, com 12 moedas e um livro encontrado. A história aparece primeiro. Use **Ver o livro** para consultar as abordagens ou **Atividades** para tomar outra iniciativa. **Personagem** concentra condições, posses e compromissos. **Envelhecer** fica na parte inferior e para diante de decisões; respostas aparecem junto da situação. O menu superior reúne os arquivos e opções.

O navegador tenta salvar a cada comando. Em **Opções e arquivos**, exporte ou importe um JSON ou crie outra amostra com a mesma seed para comparar escolhas. Um save incompatível não substitui a vida atual. Se o armazenamento falhar, a interface orienta exportar o progresso. Arquivos locais podem ter restrições de armazenamento conforme o navegador.

## Caminhos para experimentar

- Copiar os diagramas, depois vender o livro; você conserva as notas.
- Entregar o livro a Maíra e aceitar ou recusar a aprendizagem.
- Buscar trabalho diretamente; combinar uma ocupação com um projeto de estudo.
- Adiar a investigação do poço e voltar por iniciativa própria quando estiver preparado.
- Recusar o conserto de casa, depois voltar com uma lanterna construída por você.
- Estabilizar a luz do poço e assumir uma encomenda decorrente desse trabalho.

São 12 decisões, 34 opções, 6 atividades e 6 consequências agendáveis. Três decisões reutilizam abordagens de situações existentes para permitir retornos; essa reutilização não é contada como três dilemas totalmente novos. A amostra valida interações, sem pretender oferecer uma vida completa ou cinquenta horas de conteúdo.

## Verificar e continuar

Na pasta principal do pacote, com Node.js 20 ou superior:

```sh
node etapa_1_3/scripts/verificar.mjs
```

O comando preserva/roda os testes originais, verifica o motor novo, reconstrói o HTML e gera quatro trajetórias com saves em `evidencias/vidas/`. São 71 testes atuais: 47 de agência, 10 do bundle HTML em VM com DOM mínimo e 14 de regressão. Os 14 originais são executados também na versão histórica; não são mais 14 testes distintos. A bateria nova contém 500 percursos automatizados.

`tests/navegador.mjs` prepara cenários para Chromium em 320×568, 360×640, 412×915 e 1280×800, abertura direta de arquivo e falha de armazenamento. Essa bateria visual **não foi concluída neste ambiente**, que não disponibilizou um executável Chromium utilizável. Ela requer Playwright e Chromium instalados; `FANTASY_LIFE_CHROMIUM` permite informar o executável. Não integra os 67 testes aprovados. A VM não substitui verificação de layout, toque, downloads reais e acessibilidade no navegador.

## Organização

| Arquivo | Função |
|---|---|
| `src/motor.mjs` | Relógio, escolhas, iniciativas, rotinas, fila, persistência e visão pública |
| `src/contrato.mjs` | Validação de catálogo, condições e operações permitidas |
| `content/fatia.mjs` | Conteúdo conectado e montagem do começo fixo |
| `src/demo.mjs` e `demo.template.html` | Apresentação simples e comandos de interface |
| `scripts/build-demo.mjs` | HTML autocontido, gerado somente dos módulos conhecidos |
| `docs/ARQUITETURA_ESCOLHAS.md` | Contratos e regras de execução |
| `docs/GDD_0_4_Agencia.md` | Decisões de design e limites |
| `docs/RELATORIO_ETAPA_1_3.md` | Aceitação, evidências e questões pendentes |
| `evidencias/TRAJETORIAS.md` | Comparação estrutural de quatro caminhos, mesma seed |

O ponto atual e a próxima etapa estão no `../PLANO_DE_CONTINUIDADE.md`. A interface é um instrumento de revisão da etapa 1.3; o primeiro protótipo completo de vida continua sendo a etapa 1.6.

## Revisão mobile 0.4.1

Fontes consultadas, critérios de primeira tela e resultados da comparação em 320×568, 360×640 e 412×915 estão em `docs/REVISAO_UX_0_4_1.md`. A comparação usou iframes reais no Chrome remoto, com saves de teste isolados; não substitui o aparelho Android físico.
