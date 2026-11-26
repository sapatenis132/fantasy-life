# Plano de continuidade — Work

## Ponto de partida
Não reiniciar do zero. Importar a base de laboratório, rodar testes e preservar histórico. Criar diretório de trabalho separado ou versionar antes de modificar. Os GDDs 0.1 e 0.2 são históricos; o documento mestre resolve conflitos. Não alegar publicação, testes humanos ou implementação inexistentes.

## Próximo bloco recomendado: 1.3 — Arquitetura de escolhas e agência
Inserção proposta após 1.2, antes de aprofundar personagens; renumeração apenas organizacional. Entregáveis:
- Contrato de dados para decisão, requisitos, participantes, opções, efeitos e consequências futuras; ID e versão de schema.
- Avaliador de condições e operações de efeito reutilizáveis, validadas, sem código arbitrário de conteúdo; impedir aplicação dupla e escolhas indisponíveis. Registrar intenção e resultado no diário.
- Suportar escolhas com vários resultados condicionais e probabilísticos, eventos com opções dependentes de atributos/vínculos e ações iniciadas pelo jogador. Manter incerteza e distinção entre conhecimento e verdade do mundo.
- Ligar escolhas ao relógio, fila e persistência. Verificar consequências pendentes após save/load, invalidações, tempo gasto e retomada. Usar marcos de seleção regulares para evitar exploração da frequência de cliques.
- Revisar fachada temporal para UI simples: avanço principal, atividades automáticas, pausa por decisão. Não apagar testes antigos; atualizar ou complementar casos quando contrato mudar.
- Criar amostra de conteúdo pequeno mas conectado para demonstrar agência. Evitar produzir centenas de eventos antes de validar o schema. Exemplos propostos: relações com mentor, oportunidade de estudo/trabalho, dilema familiar, projeto por iniciativa própria, incidente mágico. Cada conjunto deve permitir caminhos diferentes sem depender exclusivamente do sorteio.

## Critérios de aceitação propostos
1. O mesmo estado e seed reproduzem resultados quando as mesmas escolhas são feitas.
2. Escolhas diferentes modificam fatos relevantes e oportunidades posteriores, não apenas uma frase.
3. Opções incompatíveis não podem ser executadas; NPC morto/ausente não oferece ação impossível; recusa não aplica efeito de aceitação.
4. Consequências tardias referenciam entidades persistentes, sobrevivem ao save e ocorrem uma vez no momento devido.
5. Ações por iniciativa do jogador são possíveis sem sorteio de evento.
6. Decisão pendente impede avanço indevido; processamento não duplica eventos em retomadas.
7. Frequência de clique não aumenta oportunidades sem custo; rotina não exige repetição de treino manual.
8. Manter relatório de testes reais, cenários de falha e limites. Pelo menos demonstrar trajetórias diferentes a partir do mesmo início; avaliar diversidade estrutural e não apenas IDs. Estes critérios são metas de implementação, não resultados já verificados.

## Roadmap revisado (proposta de organização)
- 1.1 Identidade e GDD: concluído, documentação.
- 1.2 Tempo e diversidade: concluído como laboratório; revisão UX ainda pendente.
- 1.3 Arquitetura de escolhas: próxima etapa.
- 1.4 Estrutura de personagens.
- 1.5 Geração procedural de nascimento.
- 1.6 Primeiro protótipo jogável vertical, com save e ciclo básico de vida.
- 2–14: mundo; relações; educação; profissões e economia; magia; aventura e combate; organizações e política; justiça; hereditariedade e legado; expansão de conteúdo; arte e interface; balanceamento e testes; publicação Android. Iterar conforme dependências, sem compromisso de numeração rígida.

## Modo de trabalho
Pesquisar técnicas quando relevantes e transformar em decisões aplicáveis. Manter GDD vivo, changelog, testes e versões jogáveis. Construir fatias pequenas e testáveis com agência antes de expandir volume. Usar interface mobile-first. Reportar o que mudou, o que foi testado, falhas e decisões provisórias. Se houver GitHub conectado, confirmar qual repositório é do Fantasy Life antes de editar ou publicar; não usar o RPG isométrico por engano. Nenhum repositório deste jogo foi confirmado até agora.
