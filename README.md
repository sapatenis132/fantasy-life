# Fantasy Life

Simulador de vida medieval fantástico textual, com liberdade de trajetória, escolhas significativas e consequências persistentes. Projeto em português, inspirado na acessibilidade de BitLife e nas possibilidades narrativas de Life in Adventure e 1 in 8 Billion.

Estado atual: **etapa 1.3 — arquitetura de escolhas**, versão 0.4.0. A amostra começa em uma situação fixa aos 16 anos. Há 12 decisões, 34 opções conectadas e rotinas automáticas. O ciclo completo de vida e a geração de nascimento são etapas futuras.

## Testar

A amostra para o GitHub Pages está em `docs/index.html`. Abra o endereço do Pages quando a publicação estiver ativada. O mesmo arquivo funciona como HTML autocontido, em um navegador com JavaScript. Não exige servidor de jogo ou API externa.

O jogo tenta salvar no próprio navegador. A seção de arquivos permite exportar/importar a vida. O save do endereço online é separado do save de um arquivo baixado; use a exportação/importação para transferir progresso.

## Desenvolvimento

Leia `DOCUMENTO_MESTRE.md` e `PLANO_DE_CONTINUIDADE.md`. Código e documentação da versão atual estão em `etapa_1_3/`; a base original e o histórico documental permanecem preservados.

```sh
node etapa_1_3/scripts/verificar.mjs
node scripts/preparar-pages.mjs
```

A verificação cobre 67 testes atuais, incluindo 500 percursos novos e quatro trajetórias controladas. Testes visuais e no Android físico devem ser registrados separadamente. A amostra não demonstra cinquenta horas de variedade.

Para atualizar a versão online, reconstrua `docs/`, envie a alteração à branch publicada e aguarde o GitHub Pages concluir. Os detalhes estão em `PUBLICACAO.md`.
