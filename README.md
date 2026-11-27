# Fantasy Life

RPG de fantasia medieval textual, em português, com exploração, evolução do personagem, relações e escolhas com consequências. Calendário, necessidades, treino e deslocamento entre lugares se inspiram nas mecânicas de Course of Temptation, adaptadas ao nosso mundo de fantasia, sem seu cenário ou conteúdo adulto.

**[Jogar Fantasy Life](https://sapatenis132.github.io/fantasy-life/)**

Versão **0.5.1 — Ponteclara**, etapa 1.4. Crie um personagem, acompanhe o diário, circule pela vila e decida como aprender, trabalhar, construir relações e investigar o que encontrar. Ações movem um calendário; capacidades e informações abrem soluções diferentes. O jogo começa com um jovem adulto. Os próximos blocos aprofundam objetivos, exploração, progressão, relações e aventura. BitLife deixa de orientar o projeto; referências a essa direção em documentos antigos são históricas.

A cena mostra o lugar, as pessoas, o que fazer e as saídas próximas. No celular, abra o painel pelo botão superior para consultar condições, personagem, mapa, pessoas, agenda e diário. Em telas largas, esse painel fica à esquerda. Arquivos contém exportação/importação. Saves ficam no navegador; exporte para transferir entre aparelhos. A [versão anterior](https://sapatenis132.github.io/fantasy-life/legado/) e sua chave de save foram preservadas.

## Desenvolver

Leia `DOCUMENTO_MESTRE.md`, `PLANO_DE_CONTINUIDADE.md` e `etapa_1_4/README.md`. O kernel 1.3 foi estendido sem reiniciar a arquitetura. `base_original/` e os registros anteriores continuam preservados.

```sh
node etapa_1_4/verificar.mjs
node scripts/preparar-pages.mjs
```

135 casos atuais e 14 históricos separados; inspeção mobile documentada em `etapa_1_4/docs/REVISAO_HUD_0_5_1.md`. Isso não comprova 50 horas de variedade nem substitui teste Android físico.
