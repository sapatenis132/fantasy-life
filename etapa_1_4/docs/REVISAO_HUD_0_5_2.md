# HUD 0.5.2 — necessidades presentes e cuidados rápidos

26/11/2026. Continuação da HUD 0.5.1 a pedido do usuário: manter as necessidades sempre visíveis, de forma contida e sem atrapalhar a cena.

## Entrega

No celular, o cabeçalho acompanha a rolagem e reúne quatro medidores pequenos: Comida, Energia, Higiene e Ânimo. “Comida” representa a mesma saciedade do motor: barra cheia significa personagem alimentado. Cada medidor tem rótulo e barra; valor exato e situação baixa estão no nome acessível e na consulta. Não há lista de números sobre o texto da história. A faixa permanece presente durante escolhas, resultados e navegação na cena. Nas janelas de consulta, o próprio painel apresenta os detalhes relevantes; o cabeçalho não é colocado acima das janelas modais.

Tocar em uma necessidade abre uma janela com seu valor, orientação e cuidados do lugar atual. As mesmas barras do painel lateral também são clicáveis. As opções reutilizam as condições, custos e efeitos reais de `rotina`: não foi criada uma recuperação gratuita nem automática.

- Comida: refeição ou ajuda na taverna em troca de comida.
- Energia: descanso ou sono no quarto.
- Higiene: lavar-se no quarto ou no poço.
- Ânimo: lazer ou descanso; orientação também lembra a possibilidade de conversar.

Abrir e fechar não passa tempo, não altera RNG, não escolhe pelo jogador e não interrompe uma decisão pendente. Durante decisão/ação em curso, a consulta continua disponível, mas não permite iniciar outra rotina. Condição baixa usa marcador “!” e texto acessível, além da cor. Não há alerta piscando.

O cabeçalho móvel dá prioridade ao lugar atual. O nome do personagem continua no painel, evitando que um nome longo esconda a localização. Espaços entre descrição, atividades e saídas foram reduzidos. As áreas tocáveis dos medidores têm pelo menos 44 px de altura. O diário permanece separado da cena.

## Validação

142 casos atuais aprovados: 71 anteriores, 43 de vida e 28 da UI atual. Os 14 testes históricos originais também foram executados separadamente. Casos novos cobrem medidores durante escolhas, consulta sem efeito, cuidado com custo real, aviso não dependente de cor, bloqueio durante decisão, recuperação indisponível no lugar e atalho das barras laterais.

Chrome remoto em preview gerenciado, em viewports CSS de 320×568, 360×640 e 412×915. Sem rolagem horizontal. Faixa de 45 px; cabeçalho completo de aproximadamente 108–109 px. Descrição e duas atividades iniciais ficaram na primeira tela; em 320×568, a saída inicial terminou em y=557,14. Nenhuma sobreposição entre cabeçalho e cena no início.

Após uma refeição, a faixa atualizou a saciedade para 100 e o ânimo para 78. O relógio passou para 08:20 e o saldo para 16 moedas, conforme o custo da ação. Consultar higiene na praça indicou onde lavar-se, sem viajar ou cobrar tempo. Escape fechou a consulta e devolveu foco a `quick-need-hygiene`. Na rolagem observada, o cabeçalho permaneceu em y=0 e a faixa continuou visível.

Medidas em `../evidencias/HUD_0_5_2_MEDIDAS.json`. Android físico, zoom e leitor de tela completos permanecem pendentes.

## Preservação

Revisão de apresentação: motor, catálogo, necessidades, probabilidades e chave `fantasy-life-vida-1.4` não foram alterados. Saves 0.5.0 e 0.5.1 continuam compatíveis. Os atalhos apenas apresentam comandos existentes; não alteram o balanceamento do RPG.
