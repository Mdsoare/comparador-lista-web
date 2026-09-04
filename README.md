# 📊 Comparador de Lista Web — Client-Side & DevSecOps Hardened

[![CI Pipeline](https://github.com/Mdsoare/comparador-lista-web/actions/workflows/ci-pipeline.yml/badge.svg)](https://github.com/Mdsoare/comparador-lista-web/actions/workflows/ci-pipeline.yml)
[![Deploy to GitHub Pages](https://github.com/Mdsoare/comparador-lista-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/Mdsoare/comparador-lista-web/actions/workflows/deploy.yml)
[![Security Rating](https://img.shields.io/badge/Security-DevSecOps%20Hardened-green?style=flat&logo=github)](https://github.com/Mdsoare/comparador-lista-web/security/code-scanning)
![Security: CSP Compliant](https://img.shields.io/badge/Security-CSP--Compliant-success.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Stylelint](https://img.shields.io/badge/Stylelint-264DE4?style=for-the-badge&logo=stylelint&logoColor=white)
![SAST & SCA](https://img.shields.io/badge/DevSecOps-SAST%20%26%20SCA-red?style=for-the-badge&logo=shield&logoColor=white)

---

Uma ferramenta **100% client-side**, leve e centrada em privacidade para cruzamento de dados, comparação de listas e validação rápida de itens.

Projetada sob o paradigma **Zero-Trust** e princípios de **Privacy by Design**, a aplicação opera inteiramente no navegador do usuário — **nenhuma lista, registro ou dado inserido é enviado para servidores externos ou armazenado na rede**.

---

## Demonstração & Live Access

Acesse a versão estável diretamente via GitHub Pages:  
👉 **[https://mdsoare.github.io/comparador-lista-web/](https://mdsoare.github.io/comparador-lista-web/)**

---

## O Problema e a Solução

Em processos de auditoria, análise de logs, gestão de inventários e tratamento de dados sensíveis, cruzar grandes volumes de dados em utilitários *online* terceirizados representa um risco crítico de vazamento e não conformidade com regulamentações de privacidade.

O **Comparador de Lista Web** resolve essa vulnerabilidade ao realizar o cruzamento, deduplicação, filtragem e ordenação de conjuntos de dados estritamente na memória local do browser, garantindo total isolamento de rede e confidencialidade das informações.

---

## Principais Funcionalidades

- ⚡ **Cruzamento Local Instantâneo:** Comparação rápida entre duas ou mais listas (intersecção, diferença, união) sem dependência do servidor.
- 🧹 **Deduplicação e Sanitização:** Remoção de duplicadas, normalização de caracteres e limpeza de espaços em branco em tempo real.
- 🛡️ **Privacidade Garantida:** Processamento totalmente em memória sem chamadas de API externas ou armazenamento persistente.
- 📥 **Exportação Rápida:** Utilitários para cópia direta e download dos resultados processados.
- 🚀 **Build & Bundling Otimizado:** Compilação e minificação via Vite, com tempos de carregamento ultra-rápidos.

---

## Tecnologias Utilizadas

- **Vite:** Bundler de alta performance para gerenciamento de assets e build de produção otimizado.
- **HTML5 Semantic:** Estrutura focada em acessibilidade, usabilidade e navegação intuitiva.
- **CSS3 Moderno:** Layout responsivo e estilizado construído com CSS Grid e Flexbox.
- **Vanilla JavaScript (ES6+):** Processamento eficiente de conjuntos e manipulação de strings de alta performance.

---

## Postura de Segurança (DevSecOps)

O repositório adota uma pipeline rigorosa de DevSecOps integrada ao GitHub Actions, cobrindo SAST, SCA, DAST e validações de integridade:

| Vetor de Risco | Status | Ação / Mitigação Aplicada |
| :--- | :---: | :--- |
| **Data Exfiltration** | 🛡️ Protegido | Processamento 100% Client-Side. Validação estrita de CSP impedindo chamadas externas não autorizadas. |
| **DOM-XSS** | 🛡️ Protegido | Manipulação do DOM segura utilizando estritamente APIs puras (`textContent`, `createElement`). |
| **Secret Leakage** | 🛡️ Protegido | Varredura automatizada contra credenciais e segredos em commits via **TruffleHog** e **Gitleaks**. |
| **Análise Estática (SAST)** | 🛡️ Protegido | Análise profunda de vulnerabilidades via **CodeQL**, **Semgrep** e **Horusec**. |
| **Gestão de Dependências (SCA)** | 🛡️ Protegido | Auditoria contínua de bibliotecas vulneráveis via **npm audit**, **OSV-Scanner** e **Trivy**. |
| **Análise Dinâmica (DAST)** | 🛡️ Protegido | Testes dinâmicos automatizados pós-deploy via **OWASP ZAP** e **Nuclei**. |
| **Linter & Quality** | 🛡️ Protegido | Garantia da qualidade de código via ESLint, Stylelint, HTMLHint e markdownlint. |

---

## Como Executar Localmente

### Pré-requisitos

- Node.js (v20+ LTS ou v24)
- NPM

### Passos

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Mdsoare/comparador-lista-web.git
   cd comparador-lista-web
    ```

2. **Instale as dependências:**

    ```bash
    npm ci
    ```
3. **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```
4. **Acesse a URL exibida no terminal**

    - geralmente `http://localhost:5173/comparador-lista-web/`.

5. **Para gerar a build de produção:**

    ```bash
    npm run build
    ```

---

## 📜 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

*Desenvolvido por **Marcelo Soares** | Especialista em Segurança da Informação e Computação Forense.*
