# Fantasy Life — transferência para ChatGPT Work
Data: 26/11/2026 | Estado: fundações, etapa 1.2 concluída em laboratório; revisão de design pendente de implementação.

## Ordem de leitura e autoridade
1. `DOCUMENTO_MESTRE.md`: decisões mais recentes e requisitos vigentes. Prevalece sobre trechos incompatíveis dos GDDs anteriores.
2. `PLANO_DE_CONTINUIDADE.md`: próximos entregáveis, testes e critérios de aceitação.
3. `base_original/GDD_0_1_Fundamentos.md` e `base_original/etapa_1_2/GDD_0_2_Tempo_Liberdade_Diversidade.md`: pesquisa, contexto e decisões históricas preservadas.
4. `base_original/etapa_1_2/motor.mjs`, `testes.mjs` e `resultado_testes.txt`: código de laboratório e evidência dos testes.

## Como iniciar
Abra o Work, anexe o ZIP (ou extraia e envie os arquivos, caso o ZIP não seja aceito) e envie o conteúdo de `PROMPT_WORK.txt`. Mantenha este pacote como backup. Não há repositório GitHub próprio do Fantasy Life confirmado, nem build jogável publicada. Não confundir com o projeto RPG isométrico do usuário.

## Verificação
Em Node.js, execute `node base_original/etapa_1_2/testes.mjs` a partir desta pasta. Na preparação desta transferência, os 14 testes passaram novamente. As 500 trajetórias são sintéticas; 498 sequências distintas em seis seleções não demonstram 50 horas de variedade real. Nenhuma alteração no motor original foi feita nesta migração.
