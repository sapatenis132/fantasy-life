# HUD 0.5.1 — lugar, cena e painel do personagem

26/11/2026. Pedido: retirar a sensação de log no meio da gameplay e aproximar a organização visual de Course of Temptation.

## Problema e correção

A versão 0.5.0 procurava a última entrada do diário e a colocava em `story-copy`, mesmo ao reapresentar um lugar ou carregar um save. Assim, texto retrospectivo e descrição atual competiam. O histórico também ficava dentro da própria área de cena.

A 0.5.1 separa três coisas:

- **Lugar:** descrição presente, pessoas e iniciativas locais, seguidas das saídas próximas com custo de deslocamento.
- **Passagem:** somente o resultado do comando que o jogador acabou de executar, ou a decisão pendente que precisa resolver. “Continuar” volta ao lugar sem tempo adicional; uma ação suspensa oferece retomada.
- **Diário:** janela própria acessada no painel. Reúne lembranças narrativas; ganhos de prática e marcadores de projeto não são despejados no texto da cena. O histórico completo do motor continua no save.

Ao recarregar, a interface apresenta o lugar atual ou a decisão pendente. Não reapresenta automaticamente uma ação antiga como se fosse a situação presente. Recompensas, fila e tempo continuam preservados.

## Referência visual realmente consultada

Foram pesquisadas e inspecionadas capturas públicas de Course of Temptation hospedadas no itch.io:

1. [Cena em Chamberlain Hall, identificada como v0.4.19](https://img.itch.zone/aW1nLzE0OTY2NTgxLmpwZw==/original/qMf%2FwD.jpg), vinculada ao [devlog 0.4.18](https://anarchothaumaturgist.itch.io/course-of-temptation/devlog/677379/course-of-temptation-minor-update-0418).
2. [Painel de pessoas com a HUD visível ao fundo](https://img.itch.zone/aW1hZ2UvMjE1MTU2NS8xMjk1NzYwOS5wbmc=/original/RSKnXg.png), encontrado na [página oficial](https://anarchothaumaturgist.itch.io/course-of-temptation).
3. [Devlog 0.7.6](https://anarchothaumaturgist.itch.io/course-of-temptation/devlog/1358039/course-of-temptation-february-update-v076), cujo autor descreve a continuidade dos elementos na barra lateral e as opções de acessibilidade.

As capturas são referências de organização, não uma garantia de que toda a interface da versão atual da obra esteja idêntica. Foram aproveitados painel lateral, hora/data/recursos, barras compactas, menus de consulta em janelas e ações contextuais junto da descrição. Não foram copiados logo, imagens, textos, personagens ou conteúdo adulto.

## Layout entregue

Em telas largas, painel de 268 px à esquerda, com personagem, lugar, horário, data, moedas, condições e atalhos. A área central contém a situação jogável e links de ação. Tipografia de fantasia nos títulos, fundo escuro e ações em azul claro.

No celular, cabeçalho compacto com botão de painel e atalho para mapa. O painel lateral recolhido abre como janela nativa, com necessidades em duas colunas e os mesmos atalhos. A cena usa a largura disponível. Não há dock inferior ocupando a leitura.

Mapa, Ficha/Habilidades/Mochila, Pessoas, Agenda, Diário e Arquivos abrem janelas próprias. Pessoas presentes oferecem acesso direto à interação; não há duplicação da conversa na lista de atividades. As saídas próximas permitem viajar sem abrir o mapa. Abrir, fechar, consultar e voltar não executa uma ação nem sorteia eventos.

Fechamento por Escape e restauração de foco foram conferidos no navegador. As abas do personagem aceitam teclado (setas, Home e End), com foco na aba ativa. Isso não substitui avaliação completa por leitor de tela.

## Continuidade e limites

Mudança de apresentação: catálogo, perfil temporal, kernel, regras e chave `fantasy-life-vida-1.4` preservados. O save 0.5.0 abre diretamente. Não é preciso começar outro personagem. O legado 0.4.1 permanece no endereço anterior.

135 casos atuais aprovados: 71 da arquitetura anterior, 43 de vida e 21 da interface atual. Base histórica: outros 14 casos, executados separadamente. Fluxos novos incluem separação de diário/cena, consulta sem passagem de tempo, saída direta, interlocutor fixo, restauração de save, decisão pendente, retomada de viagem e teclado nas abas.

A validação visual usa Chrome remoto e viewports CSS. Android físico, zoom, leitor de tela e teste prolongado continuam pendentes. Nenhuma mudança na quantidade de conteúdo ou alegação de 50 horas de variedade foi feita nesta revisão.
