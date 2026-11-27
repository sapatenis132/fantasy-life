# Etapa 1.5 — O Moinho Afogado

Versão 0.6.0, 26/11/2026. Continuação sobre a fundação 1.4, sem alteração do kernel 1.3 nem da base original.

A primeira expedição conecta objetivos escolhidos, preparo, capacidades e consequências. Descubra o caminho nos recados da praça ou na trilha do bosque. Procure ferramentas, investigue a voz ou reabra a travessia. Você pode recuar, mudar de interesse e solucionar o guardião sem luta. O destino da roda altera atividades e relações no retorno.

```sh
node etapa_1_5/verificar.mjs
node scripts/preparar-pages.mjs
```

- `src/world.mjs`: quatro lugares adicionais, rotas condicionais e contexto fixo por seed.
- `src/content.mjs`: extensão declarativa do catálogo congelado 0.5; catálogo 2.
- `src/life.mjs`: necessidades/progressão, ganchos de expedição, visão pública e migração validada.
- `src/ui.mjs` e `template.html`: HUD preservada, mapa em duas regiões e objetivos em janela própria.
- `build.mjs`: HTML autocontido atual e snapshot 0.5.2 independente.
- `tests/`: regressões de vida/HUD e cobertura do capítulo, continuidade e interface.
- `scripts/comparar.mjs`: quatro trajetórias com escolhas reais, mesma identidade e seed, sem injetar recursos.
- `evidencias/vidas/`: saves importáveis das quatro trajetórias; contêm spoilers dos destinos.

194 casos no conjunto atual, mais 71 de compatibilidade 0.5 e 14 da base original. Isso inclui casos equivalentes entre as versões. Inspeção em Chrome remoto não substitui Android físico. Conteúdo ainda curto; não há evidência de 50h de variedade. O confronto atual resolve um encontro e abre caminho para combate com decisões táticas na 1.6.

Leia `docs/DESIGN_E_IMPLEMENTACAO.md`, `docs/MIGRACAO.md` e `docs/VALIDACAO_INTERFACE.md`. A etapa 1.4 continua congelada para validar saves e testes anteriores. Novas alterações de catálogo precisam de migração antes da publicação.
