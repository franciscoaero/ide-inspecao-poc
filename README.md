# IDE para Configuração e Simulação de Regras de Inspeção

Prova de conceito de uma IDE local para escrever, validar e simular regras de inspeção de tampas industriais. A aplicação usa somente dados fictícios: não processa imagens, não acessa câmeras e não se conecta a máquinas ou ambientes de produção.

## O que já funciona

- edição de receitas em uma linguagem específica de domínio (DSL);
- análise léxica e sintática;
- validação semântica de parâmetros, variáveis e faixas;
- painel de problemas com linha e mensagem;
- simulação com cenários fictícios;
- resultados `APROVAR`, `REVISAR` ou `REJEITAR`, acompanhados da regra responsável;
- exemplos prontos e testes automatizados.
- execução local, sem telemetria ou chamadas para serviços externos.

## Pré-requisitos

- Node.js 20 ou superior;
- npm 10 ou superior.

## Como executar

```powershell
npm install
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

## Validação antes de uma entrega

```powershell
npm test
npm run build
```

## Estrutura

```text
src/
├── components/   # componentes visuais
├── data/         # receitas e cenários fictícios
├── language/     # lexer, parser, AST e validação semântica
└── simulation/   # execução das regras
```

Consulte [docs/LINGUAGEM.md](docs/LINGUAGEM.md) para conhecer a gramática usada na POC e [docs/ESCOPO.md](docs/ESCOPO.md) para as decisões de escopo.

## Publicação

Nesta etapa, o projeto é totalmente local. A criação do repositório remoto no GitHub e qualquer estratégia de hospedagem ficam para uma etapa posterior, após a validação funcional.

Consulte também [SECURITY.md](SECURITY.md) antes de publicar ou compartilhar o repositório.

