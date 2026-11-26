# Publicação da amostra

Destino autorizado pelo usuário em 26/11/2026: repositório separado **sapatenis132/fantasy-life**, com GitHub Pages para testes pelo celular.

## Publicação confirmada

Repositório público: [sapatenis132/fantasy-life](https://github.com/sapatenis132/fantasy-life).

**Jogo: https://sapatenis132.github.io/fantasy-life/**

Primeira publicação concluída em 26/11/2026: [execução do GitHub Pages](https://github.com/sapatenis132/fantasy-life/actions/runs/45891525212), commit `6af6392c53c445189bd9e6087a16037ca426af26`. O fluxo básico foi testado no Chrome remoto: escolha, interrupção do avanço, save/reload, adiamento e retorno às iniciativas. Veja `etapa_1_3/evidencias/VALIDACAO_PUBLICACAO.md`.

## Configuração ativa

- Repositório público próprio do Fantasy Life.
- Código-fonte completo e documentos preservados.
- Branch: `main`.
- GitHub Pages: **Deploy from a branch**, pasta **/docs**.
- Entrada do site: `docs/index.html`, com `.nojekyll`.

## Atualizar

```sh
node etapa_1_3/scripts/verificar.mjs
node scripts/preparar-pages.mjs
```

Commitar o código e a versão gerada de `docs/` juntos. Após o envio, confirmar o deployment do Pages e verificar no endereço publicado uma iniciativa, uma decisão, a pausa do tempo e a recuperação do save.

O jogo é estático e não envia os saves para o GitHub: eles ficam no armazenamento do navegador usado para jogar. Exportação/importação permite transferir uma vida entre arquivo local, versão online e outro aparelho.
