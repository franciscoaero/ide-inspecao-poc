# Segurança

## Limites da aplicação

Esta prova de conceito é executada localmente e trabalha somente com receitas e medições fictícias. Ela não possui autenticação, banco de dados, integração com equipamentos industriais, telemetria ou envio de dados para serviços externos.

O servidor de desenvolvimento e a prévia de produção ficam vinculados a `127.0.0.1`, impedindo exposição involuntária na rede local. O editor de código também é empacotado com a aplicação e não depende de uma CDN durante a execução.

## Dados que não devem entrar no repositório

- credenciais, tokens, chaves ou arquivos `.env`;
- imagens, nomes, caminhos ou configurações pertencentes a ambientes reais;
- amostras ou documentos confidenciais de empresas parceiras;
- dados pessoais ou informações de produção.

## Verificação antes de publicar

Execute:

```powershell
npm ci
npm audit
npm test
npm run build
git status
```

Confirme também que `git remote -v` aponta somente para o repositório esperado antes do primeiro envio.

## Relato de vulnerabilidades

Possíveis vulnerabilidades não devem ser abertas inicialmente em uma issue pública. Comunique o responsável pelo projeto em canal privado para análise antes da divulgação.
