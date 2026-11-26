# Verificação de navegador — Ponteclara 0.5.0

26/11/2026. Chrome remoto; harness público em `/vida-preview/`, com armazenamento próprio. Viewports em pixels CSS; não emulação de aparelho nem teste Android físico.

## Primeira passagem e correções

Criação de Liora, estudo do livro, consulta de mapa/custo do caminho, deslocamento até a oficina, conversa com Maíra e reload preservando a vida às 09:30. A narrativa inicial coube acima do dock em 320×568, 360×640 e 412×915. Medidas do primeiro candidato:

| Viewport | Base do texto narrativo | Base do contexto | Topo do dock | Rolagem horizontal |
|---|---:|---:|---:|---|
| 320×568 | 271,11 | 348,13 | 456,50 | Não |
| 360×640 | 251,30 | 306,64 | 528,50 | Não |
| 412×915 | 225,80 | 281,14 | 803,50 | Não |

A medição dos botões revelou proximidade/sobreposição no primeiro mapa a 320 px. A disposição foi refeita com mais espaço vertical, antes da publicação final. As opções bloqueadas do livro também foram recolhidas em “Outras possibilidades”, com requisito concreto, para reduzir a lista inicial.

A integração do HTML novo tem 12 testes em VM/DOM mínimo: criação, ação, navegação sem tempo, mapa, reload, importação válida/inválida, cópia de recuperação, troca de personagem, chave legada e falha de armazenamento. Não são testes de CSS.

## Limites

Android físico, leitor de tela, zoom e transferência de arquivos entre aparelhos continuam pendentes. Não alegar aprovação de uma bateria local Chromium: o binário necessário não está disponível no ambiente. A observação visual e as medidas deste documento foram obtidas no Chrome remoto, pela página de revisão publicada.
