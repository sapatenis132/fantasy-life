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

## Confirmação final após publicação

Código publicado no commit `520dfee527871778324babd8ab20ce8d5db15417`. O endereço principal abriu com título **Fantasy Life — Ponteclara**, criação e acesso ao personagem antigo. `/legado/` abriu **Fantasy Life · sua história**, com a HUD anterior. Nenhuma ação foi aplicada ao personagem legado durante essa conferência.

A versão final foi repetida em 320×568, 360×640 e 412×915: manteve as medidas narrativas da tabela, sem rolagem horizontal. Oito botões do mapa, altura mínima de 44 px, **zero pares sobrepostos** em cada dimensão. O mapa em proporção quadrada e as novas posições corrigiram a sobreposição do candidato inicial.

Fluxo final na chave isolada: criar Liora → ir à oficina (08:25) → conversar com Maíra (08:45) → trabalhar uma hora na lanterna (09:45) → recarregar → consultar Personagem. Resultado observado: Ofício 41, saciedade 73, energia 76, higiene 74, ânimo 78, livro na mochila e projeto em 60/180 min. Esses resultados permaneceram após reload.

As 20 iniciativas locais, cinco oportunidades e 16 comandos internos de trecho somam 41 definições e 73 opções no catálogo. Comandos de deslocamento não contam como dilemas narrativos independentes. Essa contagem descreve a fatia, não uma prova de variedade.

## Limites

Android físico, leitor de tela, zoom e transferência de arquivos entre aparelhos continuam pendentes. Não alegar aprovação de uma bateria local Chromium: o binário necessário não está disponível no ambiente. A observação visual e as medidas deste documento foram obtidas no Chrome remoto, pela página de revisão publicada.
