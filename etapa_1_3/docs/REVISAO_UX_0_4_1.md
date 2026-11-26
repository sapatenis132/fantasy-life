# Revisão da interface mobile — 0.4.1

26/11/2026. Correção motivada pelo teste do usuário no celular: história longe da primeira tela, excesso de seções e primeiro contato pouco prático.

## Diagnóstico

A versão 0.4.0 foi organizada como um laboratório de sistemas. Cabeçalho grande, explicações, iniciativas e painéis precediam o diário. Os testes em VM confirmavam comandos, mas não a posição do texto. A verificação inicial no Chrome foi em uma janela desktop e não sustentava uma conclusão sobre o uso no celular.

## Referências realmente consultadas

| Fonte primária | Observação aplicada |
|---|---|
| [Jakob Nielsen, Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) | Dar prioridade a poucas funções principais e revelar funções secundárias quando solicitadas; rótulos claros para encontrar essas funções. Aplicação: história como tela inicial; atividades, personagem e arquivos separados. |
| [Apple HIG, Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding.md) | Aprender pela interação e adiar configuração não essencial. Aplicação: uma situação curta e uma ação contextual; detalhes sobre protótipo, arquivos e seed ficam nas opções. |
| [Life in Adventure, capturas oficiais da StudioWheel](https://play.google.com/store/apps/details?id=com.StudioWheel.Bard&hl=pt-BR) | Foi examinada uma captura promocional com narrativa e alternativas próximas. A proximidade orientou nossa composição; não foram copiados texto, arte ou identidade visual. |
| [BitLife, capturas oficiais da Candywriter](https://play.google.com/store/apps/details?id=com.candywriter.bitlife&hl=pt-BR) | Foram examinadas capturas promocionais de vida e decisão. A leitura do acontecimento precede a resposta; tratamos isso como referência de hierarquia, não como comprovação de toda a UX do aplicativo. |
| [W3C, WCAG 2.2 — Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Texto precisa se reorganizar em largura estreita sem obrigar leitura em duas direções. Foram verificados 320, 360 e 412 CSS px, sem declarar conformidade WCAG completa. |
| [W3C APG, Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Menu com nome acessível, controle de fechar e retorno do foco. O menu usa o elemento dialog nativo; abertura, enquadramento e retorno de foco foram conferidos. |

A pesquisa foi documental e visual. Não houve sessão de jogo dos aplicativos de referência nem teste com participantes externos. A aplicação e os critérios geométricos abaixo são decisões deste projeto, não recomendações numéricas extraídas dessas obras.

## Alterações aplicadas

- Cabeçalho compacto com idade/local e moedas. Saúde, habilidades, posses e compromissos ficam em Personagem.
- História e resultado atual aparecem no começo. Intenções continuam no motor, mas não repetem o resultado na apresentação.
- O primeiro contato mostra uma situação e “Ver o livro”, sem abrir o catálogo de abordagens ou os painéis administrativos.
- Um botão de envelhecer fica ao alcance na parte inferior. Ao apresentar uma escolha, o texto e as respostas ocupam a tela, e o comando de envelhecer fica oculto.
- Navegação persistente: História, Atividades e Personagem. Explorar essas áreas não passa tempo.
- Abrir uma iniciativa apresenta suas abordagens junto da situação. Voltar cancela somente a consulta; não cobra custos nem executa a ação.
- Arquivos, nova amostra, seed e informações do protótipo passam para um menu separado.
- Decisões e resultados recebem foco/retorno ao começo da leitura. Histórico anterior permanece acessível sob demanda.

O contrato do motor, o catálogo, as consequências e a chave de save publicada foram preservados. Não há reinício automático da vida do jogador.

## Comparação medida no navegador

A página de revisão publica versões antiga e nova em iframes com viewport exato. Cada cópia usa uma chave de save de teste distinta da versão principal. A interface nova usa o mesmo HTML da entrega, com alteração somente dessa chave no ambiente de teste.

| Viewport | Topo do diário antigo | Topo da narrativa nova | Fim da narrativa nova | Início dos controles inferiores | Rolagem horizontal nova |
|---|---:|---:|---:|---:|---|
| 320 × 568 | 1.268 px | 148 px | 289 px | 453 px | Não |
| 360 × 640 | 1.191 px | 148 px | 261 px | 525 px | Não |
| 412 × 915 | 1.106 px | 148 px | 261 px | 800 px | Não |

A coluna antiga mede o diário, não o parágrafo de introdução que existia acima dele. A nova narrativa integra apresentação e resultados nesse espaço principal. Nos três casos o texto inicial inteiro ficou acima dos controles, sem precisar rolar.

Uma decisão real (“Luz sob a água”) foi conferida nas três dimensões: texto começou em 148 px; a primeira resposta começou em 281, 281 e 253 px, respectivamente. As opções seguintes continuam alcançáveis pela rolagem vertical; o espaço final protege a última resposta dos controles fixos.

## Fluxos conferidos

1. Abrir a iniciativa do livro, examinar/copiar e ler o resultado na tela principal.
2. Avançar e receber uma decisão com indicação da opção indisponível.
3. Recarregar e recuperar a decisão pendente.
4. Consultar Personagem durante uma decisão e voltar à escolha, sem resolvê-la.
5. Adiar a investigação e manter o salto pausado, com 360 dias restantes neste percurso.
6. Encerrar o avanço na tela de atividades e encontrar “Voltar ao poço”.
7. Abrir arquivos em 320 × 568: diálogo de 282 px de largura, entre y=44 e y=524; fechamento devolve foco a “Opções e arquivos”.

Os 71 testes locais atuais passaram: 47 de agência, 10 de integração do HTML em VM e 14 de regressão. A base histórica passou seus 14 casos separadamente. Não se contou a comparação responsiva como parte desses testes locais.

## Limites

A comparação responsiva executou o HTML no Chrome remoto, em viewports de iframe. Isso não emula o sistema Android, a barra do navegador móvel, teclado virtual, recortes ou gestos físicos. O executável Chromium local continuou indisponível; o download oficial foi recusado pelo ambiente. O roteiro Playwright foi atualizado, mas não é apresentado como executado. Teste em Android real e avaliação humana de conforto continuam necessários.
