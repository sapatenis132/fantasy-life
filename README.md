# Fantasy Life

RPG de vida medieval fantástico textual, em português, com escolhas, consequências e liberdade de trajetória.

**[Jogar Fantasy Life](https://sapatenis132.github.io/fantasy-life/)**

Versão **0.5.0 — Ponteclara**, etapa 1.4. Crie um personagem, acompanhe o diário, circule pela vila e decida como aprender, trabalhar, construir relações e investigar o que encontrar. Ações movem um calendário; capacidades e informações abrem soluções diferentes. O jogo começa com um jovem adulto; nascimento procedural e ciclo completo de vida são próximos blocos.

A história aparece primeiro. Use **O que fazer aqui**, **Mapa** e **Personagem**. O menu superior contém exportação/importação. Saves ficam no navegador; exporte para transferir entre aparelhos. A [versão anterior](https://sapatenis132.github.io/fantasy-life/legado/) e sua chave de save foram preservadas.

## Desenvolver

Leia `DOCUMENTO_MESTRE.md`, `PLANO_DE_CONTINUIDADE.md` e `etapa_1_4/README.md`. O kernel 1.3 foi estendido sem reiniciar a arquitetura. `base_original/` e os registros anteriores continuam preservados.

```sh
node etapa_1_4/verificar.mjs
node scripts/preparar-pages.mjs
```

126 casos atuais e 14 históricos separados; inspeção mobile documentada em `etapa_1_4/evidencias/VALIDACAO_MOBILE.md`. Isso não comprova 50 horas de variedade nem substitui teste Android físico.
