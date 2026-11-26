# Publicação da amostra

Destino autorizado pelo usuário em 26/11/2026: repositório separado **sapatenis132/fantasy-life**, com GitHub Pages para testes pelo celular.

## Estado desta preparação

Repositório público criado: [sapatenis132/fantasy-life](https://github.com/sapatenis132/fantasy-life). Arquivos e testes preparados. A ativação do GitHub Pages é a etapa final; o endereço online será registrado após confirmar a publicação.

## Configuração prevista

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
