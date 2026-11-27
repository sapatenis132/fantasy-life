# Verificação de interface — 0.6.0

26/11/2026, Chrome remoto, preview gerenciado. Ambiente de revisão com chave de save independente do personagem principal.

Percurso executado por controles visíveis: criação → praça → rumores → investigar voz → mapa/arredores → mirante → passagem com calma → moinho → galeria sem combate → câmara → libertar presença → diário/objetivos → reload. O diário marcou presença e travessia concluídas; ferramentas ficaram abertas. Após recarregar, 11:10, 18 moedas, consequência na sala e medidores foram preservados.

Molduras CSS 320×568, 360×640 e 412×915. Área útil com scrollbar: 305, 345 e 397 px. `scrollWidth` igual à largura útil nas três; quatro alvos do mapa dos arredores sem interseção e com altura mínima de 45 px. Na menor tela, cabeçalho 108,03 px, narrativa de y=220,45 até 329,20; quatro controles de necessidades com 44 px de altura. Texto na primeira tela, sem histórico despejado na sala. Alternativas do guardião e detalhes do risco foram conferidos; custos apareceram antes da ação.

Janelas são nativas, com conteúdo rolável e navegação própria. Necessidades ficam no cabeçalho durante a gameplay; o modal de consulta escurece a cena ao abrir. O mapa em regiões mantém os lugares legíveis sem acrescentar uma tela de gerenciamento à abertura do jogo.

Os testes VM/DOM verificam estado, conteúdo e interações; esta observação cobre layout e um percurso real. Não foi teste em Android físico, zoom ampliado ou leitor de tela. A mesma seed não garante resultados iguais se o jogador tomar ações diferentes e consumir eventos em outro momento.

Publicação será registrada em `PUBLICACAO.md` após observar a versão no endereço público.
