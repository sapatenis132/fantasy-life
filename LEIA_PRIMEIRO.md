# Fantasy Life — progresso até a etapa 1.3

26/11/2026 · Versão 0.4.0. Arquitetura de escolhas implementada sobre o laboratório anterior.

Para experimentar, abra **`etapa_1_3/Fantasy_Life_Laboratorio_1_3.html`** em um navegador com JavaScript. Ele contém uma amostra fixa aos 16 anos, com iniciativas, escolhas, rotinas, diário e save/exportação. A amostra também está online em https://sapatenis132.github.io/fantasy-life/. Um fluxo básico foi confirmado no Chrome remoto; testes de viewports, toque e Android ainda estão pendentes.

## Ordem de leitura

1. `DOCUMENTO_MESTRE.md`: requisitos e estado vigente; prevalece sobre GDDs históricos.
2. `PLANO_DE_CONTINUIDADE.md`: ponto atual, pendências e próximo bloco 1.4.
3. `etapa_1_3/README.md`: uso, organização e execução.
4. `etapa_1_3/docs/ARQUITETURA_ESCOLHAS.md`: contrato de implementação.
5. `etapa_1_3/docs/GDD_0_4_Agencia.md`: decisões de design aplicadas.
6. `etapa_1_3/docs/RELATORIO_ETAPA_1_3.md` e `evidencias/`: testes, trajetórias e limites.

`base_original/` conserva integralmente código, testes e GDDs anteriores. `historico/` guarda os documentos da migração 0.3. `historico/HISTORICO_GIT.bundle` conserva os checkpoints locais anteriores à primeira publicação. O repositório oficial agora é `sapatenis132/fantasy-life`; consulte `PUBLICACAO.md` para o estado do site.

## Verificação

```sh
node etapa_1_3/scripts/verificar.mjs
```

67 testes atuais aprovados: 47 agência, 6 integração HTML em VM e 14 regressão. Os 14 originais também passaram separadamente. Há 500 percursos novos automatizados e quatro trajetórias controladas com saves. Isso não demonstra a meta de 50 horas.
