# Fantasy Life

RPG de fantasia medieval textual, em português, com exploração, evolução do personagem, relações e escolhas com consequências. Calendário, necessidades, treino e deslocamento entre lugares se inspiram nas mecânicas de Course of Temptation, adaptadas ao nosso mundo de fantasia, sem seu cenário ou conteúdo adulto.

**[Jogar Fantasy Life](https://sapatenis132.github.io/fantasy-life/)**

Versão **0.6.0 — O Moinho Afogado**, etapa 1.5. A primeira expedição opcional conecta objetivos, preparo, exploração, capacidades e retornos à vila. Investigue uma voz, recupere ferramentas ou reabra uma travessia. Você pode contornar, desativar ou enfrentar o guardião e escolher entre quatro destinos para o moinho. As escolhas mudam caminhos, trabalho, cuidados, recursos e aquilo que os moradores sabem.

Há doze lugares, equipamento de preparo, provisões, curativos e treino por blocos de duas horas. O confronto atual é uma resolução de encontro com risco de ferimentos; combate completo é o próximo aprofundamento. BitLife deixou de orientar o projeto.
A cena mostra o lugar, as pessoas, o que fazer e as saídas próximas. No celular, quatro medidores discretos mantêm as necessidades à vista; toque em um deles para consultar cuidados do lugar. No celular, abra o painel pelo botão superior para consultar condições, personagem, mapa, pessoas, agenda e diário. Em telas largas, esse painel fica à esquerda. Arquivos contém exportação/importação. Saves ficam no navegador; exporte para transferir entre aparelhos. A [versão anterior](https://sapatenis132.github.io/fantasy-life/legado/) e sua chave de save foram preservadas.

## Desenvolver

Leia `DOCUMENTO_MESTRE.md`, `PLANO_DE_CONTINUIDADE.md` e `etapa_1_5/README.md`. O kernel 1.3 foi estendido sem reiniciar a arquitetura. `base_original/` e os registros anteriores continuam preservados.

```sh
node etapa_1_5/verificar.mjs
node scripts/preparar-pages.mjs
```

194 casos do conjunto atual, além de 71 de compatibilidade 0.5.2 e 14 históricos. Inclui 100 expedições completas, comparação de preparo em 200 confrontos e quatro trajetórias sem recursos inseridos. Isso não comprova 50 horas de variedade nem substitui teste Android físico. Veja `etapa_1_5/docs/DESIGN_E_IMPLEMENTACAO.md`.

Saves 0.5 são migrados automaticamente, inclusive em decisões e ações em andamento. Uma cópia anterior fica em chave independente, acessível em Arquivos → cópia 0.5.2. Nenhum reinício é necessário; exporte o personagem para transferir entre aparelhos.
