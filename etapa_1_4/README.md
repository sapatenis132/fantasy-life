# Ponteclara — etapa 1.4 / versão 0.5.2

Uma região conectada para viver escolhas: chegar a um lugar, encontrar pessoas, cuidar de si, aprender e transformar descobertas em novos caminhos. Evolução do motor 1.3; não substitui o projeto por outro jogo.

## Executar

```sh
node etapa_1_4/verificar.mjs
node scripts/preparar-pages.mjs
```

Abra `Fantasy_Life_Ponteclara.html` ou a publicação em https://sapatenis132.github.io/fantasy-life/.

- `src/world.mjs`: lugares, conexões, calendário e horários.
- `src/content.mjs`: situações, iniciativas, condições, opções e consequências.
- `src/life.mjs`: identidade, necessidades, prática, relações, compromissos, viagens, visão pública e transferência de saves.
- `src/ui.mjs` e `template.html`: criação, cena, painel lateral/recolhível e janelas de consulta.
- `build.mjs`: bundle fechado, sem dependências de rede; preserva `docs/legado/index.html`.
- `tests/`: 43 casos de sistemas e 28 de integração do HTML em VM.
- `docs/DESIGN_E_IMPLEMENTACAO.md`: decisões, contratos e limites.

O kernel compartilhado permanece em `etapa_1_3/src/`. Perfil temporal e ganchos são opcionais: o catálogo anterior continua em dias. A base `base_original/` não foi editada.

A chave nova é `fantasy-life-vida-1.4`. A antiga `fantasy-life-agencia-1.3` não é removida. Transferência de personagem é explícita e exige ausência de fila, ação, rotina ou decisão pendente. Use a versão anterior para concluir essas situações. Importação inválida não substitui a vida atual; criar/importar outra vida guarda uma cópia anterior, quando o armazenamento permite.

A revisão da HUD 0.5.1 está em `docs/REVISAO_HUD_0_5_1.md`: lugar e ações no centro, lembranças em janela própria. O save e as regras 0.5.0 são compatíveis.

A HUD 0.5.2 mantém necessidades no cabeçalho móvel e abre cuidados por toque. Regras e saves preservados; detalhes em `docs/REVISAO_HUD_0_5_2.md`.
