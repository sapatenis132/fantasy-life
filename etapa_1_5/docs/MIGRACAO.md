# Continuidade de saves 0.5 → 0.6

O catálogo Ponteclara passa da versão 1 à 2. A chave principal permanece `fantasy-life-vida-1.4`. Não é necessário criar personagem novo.

1. Tentar o validador atual.
2. Em catálogo Ponteclara versão 1, validar todos os dados com o código 0.5 congelado. Fingerprint adulterado ou versão desconhecida são recusados.
3. Copiar o estado, atualizar assinatura e revisão de vida, acrescentar contexto determinístico e moradores novos sem substituir pessoas já presentes.
4. Preservar tempo, RNG, fila, decisão, pilha de trabalho, tempo restante, rota, recursos, habilidades, necessidades/restos, identidade, projeto, compromisso, memórias e ledgers de repetição. Só acrescentar história de migração e campos novos.
5. Validar o resultado com o motor novo. O migrador não conclui ações, escolhe respostas, avança o relógio ou concede equipamento inicial retroativo.
6. No carregamento automático da interface, gravar todos os bytes antigos em `fantasy-life-vida-1.4-antes-0.6` antes de substituir a chave principal. Um backup existente não é sobrescrito em recargas posteriores.

Se a gravação falhar, o jogo avisa e mantém a versão migrada em memória; exportar permite guardá-la. O arquivo antigo é mantido no armazenamento. Uma importação manual preserva o personagem atual em `-backup`; o arquivo de origem também continua com o jogador. Arquivo inválido não substitui o atual.

`/legado-0-5/` é o HTML 0.5.2 congelado, adaptado apenas para ler/escrever a chave de backup anterior. Não usa a chave principal e não sincroniza alterações de volta automaticamente. Serve para abrir a cópia anterior; exportar/importar é iniciativa explícita. `/legado/` mantém o laboratório 0.4.1 e sua chave antiga.

A migração da etapa 1.3 continua explícita e recusa compromissos/filas/ações ativos, conforme o comportamento anterior. Não descartar pendências para facilitar transferência.

Testes cobrem migração com decisão no trajeto, aula/projeto e ação paga interrompida, verificando restante, efeito, dinheiro e RNG sem cobrança duplicada. O conjunto atual cobre save/load da expedição e finais exclusivos. Não alterar o catálogo 2 publicado sem novo caminho de migração; preservar estes módulos como fonte de validação histórica.
