[javascript-image]: https://img.shields.io/badge/javascript-red
[javascript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[cypress-image]:https://img.shields.io/badge/cypress-10.6.0-beige
[cypress-url]:https://docs.cypress.io/guides/overview/why-cypress

# Desafio Automação de Cenários Essenciais
[![Versão JavaScript][javascript-image]][javascript-url]
[![Versão do Cypress][cypress-image]][cypress-url]

Estrutura do projeto:
```
./
│  ├── cypress/
│  │   ├── fixtures/
│  │   ├── e2e/ (specs)
│  │   ├── config/ (env JSONs: dev.json, qa.json, ...)
│  │   └── support/
│  │       ├── BookStore/
│  │       ├── Home/
│  │       ├── SignIn/
├── .gitignore
├── cypress.config.js
├── package.json
└── README.md
```

---

## Como executar os testes

Pré-requisitos
- Node.js (recomendado >=16) e npm
- Dependências do projeto instaladas: `npm install`

Executar localmente (interativo)
1. Instalar dependências:
   - npm install
2. Abrir o Cypress Test Runner (interativo):
   - npm run cy:open

Executar localmente (headless)
- npm test

Executar selecionando o ambiente (configurações em `cypress/config`)
- Por padrão o teste usa o ambiente `qa` configurado em `cypress/config/qa.json`.
- Para executar usando outro ambiente (ex.: `dev`) passe a flag `--env version=dev` ao Cypress. Exemplos:
  - npx cypress run --env version=dev
  - npm test -- --env version=dev

Observação: o arquivo `cypress.config.js` carrega automaticamente o JSON de ambiente a partir de `cypress/config/{version}.json`.

---

## Justificativa técnica (objetiva) e boas práticas adotadas

Por que usar Cypress
- Testes end‑to‑end rápidos e de fácil integração com a aplicação web.
- Boa experiência de debugging (time travel, screenshots, runner interativo).
- Suporte a intercepts e fixtures para controlar rede e tornar testes determinísticos.

Principais boas práticas aplicadas neste projeto
- Gerenciamento de ambientes centralizado: `cypress/config/*.json` e `cypress.config.js` carregando o ambiente selecionado.
- Setup via app-actions / API: comandos customizados (em `cypress/support/commands.js`) para preparar estado quando o setup não é o foco do teste.
- Testes independentes: cada spec deve rodar isoladamente; uso de seed/reset quando necessário.
- Asserções significativas: verificar texto, status, URL e contagem/estado de elementos, não apenas existência.
- Integração com Allure para relatórios de execução (configurada no projeto).