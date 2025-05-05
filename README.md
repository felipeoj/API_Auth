# API - Auth

API com autenticação JWT, 2FA e testes automatizados.

---

### Status do Projeto

Este projeto ainda está em desenvolvimento. Testes adicionais, ajustes de funcionalidades e melhorias na cobertura de código estão previstos para as próximas atualizações.

---

![NestJS](https://img.shields.io/badge/NestJS-v9.0.0-red)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-v18.0-green)

Esta API é uma aplicação backend desenvolvida com o framework **NestJS** e **TypeScript**. Este projeto foi criado como parte de um portfólio para demonstrar habilidades em desenvolvimento de APIs seguras, autenticação JWT, 2FA (autenticação de dois fatores) e boas práticas de arquitetura de software.

---

## Funcionalidades

### Autenticação JWT:

- Login e registro de usuários.
- Geração e validação de tokens de acesso e refresh tokens.

### Autenticação de Dois Fatores (2FA):

- Geração de QR Code para 2FA.
- Validação de segredos 2FA.

### Gerenciamento de Usuários:

- Registro de novos usuários.
- Validação de e-mails e senhas.

### Segurança:

- Cookies HTTP-only para refresh tokens.
- Suporte a `cookie-parser` para manipulação de cookies.

### Arquitetura Limpa:

- Separação de responsabilidades com uso de módulos, serviços, controladores e casos de uso.
- Repositórios para abstração de acesso a dados.

---

## Tecnologias Utilizadas

- **Framework:** [NestJS](https://nestjs.com)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org)
- **Banco de Dados:** Prisma ORM com suporte a PostgreSQL
- **Autenticação:** Passport.js com estratégias JWT
- **Validação:** Zod
- **Segurança:**
  - `cookie-parser`
  - Middleware para proteção de rotas
- **Testes:** Jest (unitários e de integração)
- **Outras Dependências:**
  - `qrcode` para geração de QR Codes
  - `@nestjs/config` para gerenciamento de variáveis de ambiente

---

## Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org) (v18 ou superior)
- [PostgreSQL](https://www.postgresql.org/)
- npm ou yarn

### Passo a Passo

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/felipeoj/API_Auth.git
   cd API_Auth
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz com:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/securedb
   JWT_SECRET=seu_jwt_secret
   JWT_REFRESH_SECRET=seu_refresh_jwt_secret
   ```

4. **Configure o Prisma:**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Inicie o servidor:**

   - Modo de desenvolvimento:
     ```bash
     npm run start:dev
     ```
   - Modo de produção:
     ```bash
     npm run start:prod
     ```

6. **Acesse a API:**
   ```
   http://localhost:3000
   ```

---

## Documentação da API

### Autenticação

- `POST /auth/signup` – Registra novo usuário

```json
{
  "email": "user@example.com",
  "firstName": "teste",
  "lastName": "testeJr",
  "password": "senha123",
  "username": "usuario"
}
```

- `POST /auth/login` – Realiza login

```json
{
  "identifier": "user@example.com ou username",
  "password": "senha123"
}
```

- `POST /auth/refresh` – Gera novo token com refresh token

### 2FA (Autenticação de Dois Fatores)

- `POST /auth/2fa/enable`  
  Habilita a autenticação de dois fatores para o usuário atual.  
  **Não requer corpo na requisição.**

- `POST /auth/2fa/verify`  
  Valida o código 2FA enviado pelo usuário.  
  **Exemplo de body:**

  ```json
  {
    "code": "123456"
  }
  ```

---

## 🧪 Testes

- **Testes unitários:**

  ```bash
  npm run test
  ```

- **Testes de integração:**

  ```bash
  npm run test:e2e
  ```

- **Cobertura de testes:**
  ```bash
  npm run test:cov
  ```

---

## Segurança

- **Cookies HTTP-only:** tokens de refresh armazenados em cookies protegidos.
- **Validação de Dados:** entradas validadas com Zod.
- **Autenticação JWT:** tokens para proteger rotas.

---

## 📄 Licença

Este projeto está licenciado sob a licença [MIT](https://opensource.org/licenses/MIT).

---

## 👤 Autor

- **Nome:** Felipe Oliveira
- **LinkedIn:** (https://www.linkedin.com/in/felipeoj/)
