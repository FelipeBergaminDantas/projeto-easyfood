# 🍔 EasyFood - Sistema de Gerenciamento de Restaurantes

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue.svg)](https://www.postgresql.org/)

**EasyFood** é uma aplicação web full-stack para consulta e cadastro de restaurantes, desenvolvida como projeto acadêmico para a disciplina de Arquitetura de Software da UniFECAF. O sistema implementa autenticação JWT, CRUD completo de restaurantes e uma interface moderna em dark mode.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Rotas da API](#-rotas-da-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Testes](#-testes)
- [Documentação Adicional](#-documentação-adicional)
- [Contribuição](#-contribuição)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 🎯 Sobre o Projeto

O EasyFood é um MVP (Minimum Viable Product) que permite:

- **Usuários não autenticados**: Visualizar e buscar restaurantes por nome ou categoria
- **Usuários autenticados**: Cadastrar novos restaurantes, editar e remover estabelecimentos

O projeto foi desenvolvido seguindo os princípios de **Monólito Modular**, com separação clara de responsabilidades e camadas bem definidas.

---

## 🚀 Tecnologias

### Backend
- **Node.js** (v18+) - Runtime JavaScript
- **Express** (v4.18.2) - Framework web
- **Prisma ORM** (v5.8.0) - ORM para PostgreSQL
- **PostgreSQL** (v15+) - Banco de dados relacional
- **bcrypt** (v5.1.1) - Hash de senhas
- **jsonwebtoken** (v9.0.2) - Autenticação JWT
- **cors** (v2.8.5) - Controle de CORS
- **dotenv** (v16.3.1) - Variáveis de ambiente

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização (Dark Mode)
- **JavaScript (ES6+)** - Lógica da aplicação
- **Fetch API** - Requisições HTTP

---

## 🏗️ Arquitetura

O projeto segue o padrão **Monólito Modular** com a seguinte estrutura de camadas:

```
Frontend → Routes → Controller → Service → Prisma ORM → PostgreSQL
```

### Camadas

1. **Routes**: Define os endpoints HTTP e aplica middlewares
2. **Controller**: Recebe requisições, valida dados e retorna respostas
3. **Service**: Contém a lógica de negócio e validações
4. **Repository (Prisma)**: Acessa o banco de dados
5. **Middlewares**: Interceptam requisições (ex: autenticação JWT)

### Módulos

O projeto está organizado em módulos independentes:

- **auth**: Gerenciamento de autenticação e usuários
- **restaurants**: Gerenciamento de restaurantes

---

## ✨ Funcionalidades

### Autenticação
- ✅ Registro de novos usuários com validação
- ✅ Login com geração de token JWT
- ✅ Proteção de rotas com middleware de autenticação
- ✅ Hash seguro de senhas com bcrypt

### Restaurantes
- ✅ Listagem de restaurantes com filtros por nome e categoria
- ✅ Busca de restaurante por ID
- ✅ Cadastro de novos restaurantes (autenticado)
- ✅ Atualização de restaurantes (autenticado)
- ✅ Remoção de restaurantes (autenticado)
- ✅ Listagem de categorias únicas

### Interface
- ✅ Design responsivo e moderno em dark mode
- ✅ Filtros dinâmicos de busca
- ✅ Notificações toast para feedback
- ✅ Formulários com validação client-side
- ✅ Persistência de autenticação com localStorage

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v18 ou superior) - [Download](https://nodejs.org/)
- **PostgreSQL** (v15 ou superior) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

---

## 🔧 Instalação

### 1. Clone o repositório

```powershell
git clone https://github.com/seu-usuario/projeto-easyfood.git
cd projeto-easyfood
```

### 2. Instale as dependências

```powershell
npm install
```

---

## ⚙️ Configuração

### 1. Configure o banco de dados PostgreSQL

Certifique-se de que o PostgreSQL está rodando e crie o banco de dados:

```sql
CREATE DATABASE easyfood;
```

### 2. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```powershell
Copy-Item ".env.example" ".env"
```

Edite o arquivo `.env` com suas configurações:

```env
# Configuração do Banco de Dados
DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/easyfood"

# Configuração do Servidor
PORT=3000

# Configuração JWT (gere com: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET="sua_chave_secreta_de_128_caracteres_hexadecimais"
JWT_EXPIRES_IN="24h"

# Ambiente
NODE_ENV="development"
```

**⚠️ Importante**: 
- Nunca versione o arquivo `.env`
- Gere uma chave JWT forte de 128 caracteres hexadecimais (use o comando acima)
- Se a senha do PostgreSQL contiver caracteres especiais, encode-os para URL

### 3. Execute as migrações do Prisma

```powershell
# Sincroniza o schema com o banco de dados
npm run prisma:push

# Gera o Prisma Client
npm run prisma:generate

# Popula o banco com dados de exemplo
npm run db:seed
```

Ou execute tudo de uma vez:

```powershell
npm run db:setup
```

---

## 🎮 Executando o Projeto

### Modo de desenvolvimento

```powershell
npm run dev
```

### Modo de produção

```powershell
npm start
```

A aplicação estará disponível em: **http://localhost:3000**

### Credenciais de teste

Após executar o seed, use estas credenciais para login:

- **Email**: `admin@easyfood.com`
- **Senha**: `admin123`

---

## 🛣️ Rotas da API

### Autenticação

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/auth/register` | Registra um novo usuário | ❌ |
| POST | `/auth/login` | Realiza login e retorna JWT | ❌ |
| GET | `/auth/profile` | Retorna o perfil do usuário | ✅ |

### Restaurantes

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/restaurants` | Lista todos os restaurantes | ❌ |
| GET | `/restaurants?name=Pizza` | Busca restaurantes por nome | ❌ |
| GET | `/restaurants?category=Italiana` | Filtra por categoria | ❌ |
| GET | `/restaurants/:id` | Busca restaurante por ID | ❌ |
| POST | `/restaurants` | Cadastra novo restaurante | ✅ |
| PUT | `/restaurants/:id` | Atualiza um restaurante | ✅ |
| DELETE | `/restaurants/:id` | Remove um restaurante | ✅ |
| GET | `/restaurants/categories` | Lista categorias únicas | ❌ |

### Health Check

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/health` | Verifica status da API | ❌ |

---

## 📂 Estrutura do Projeto

```
projeto-easyfood/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── seed.js                # Dados iniciais
├── src/
│   ├── config/
│   │   └── database.js        # Configuração do Prisma Client
│   ├── middlewares/
│   │   └── auth.middleware.js # Middleware de autenticação JWT
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.service.js      # Lógica de negócio
│   │   │   ├── auth.controller.js   # Handlers HTTP
│   │   │   └── auth.routes.js       # Definição de rotas
│   │   └── restaurants/
│   │       ├── restaurant.service.js     # Lógica de negócio
│   │       ├── restaurant.controller.js  # Handlers HTTP
│   │       └── restaurant.routes.js      # Definição de rotas
│   ├── public/
│   │   ├── index.html         # Interface web
│   │   ├── style.css          # Estilos (Dark Mode)
│   │   └── script.js          # Lógica frontend
│   └── app.js                 # Configuração Express
├── server.js                  # Entry point
├── package.json               # Dependências e scripts
├── .env.example               # Template de variáveis
├── .gitignore                 # Arquivos ignorados
└── README.md                  # Este arquivo
```

---

## 🧪 Testes

### Testar autenticação manualmente

**Registrar usuário:**

```powershell
$body = @{
    name = "João Silva"
    email = "joao@example.com"
    password = "senha123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method Post -ContentType "application/json" -Body $body
```

**Fazer login:**

```powershell
$body = @{
    email = "admin@easyfood.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -ContentType "application/json" -Body $body
$token = $response.token
```

**Acessar rota protegida:**

```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/auth/profile" -Method Get -Headers $headers
```

### Testar restaurantes

**Listar restaurantes:**

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/restaurants" -Method Get
```

**Cadastrar restaurante (autenticado):**

```powershell
$headers = @{
    Authorization = "Bearer $token"
}

$body = @{
    name = "Novo Restaurante"
    category = "Brasileira"
    description = "Comida caseira"
    address = "Rua Exemplo, 123"
    phone = "(11) 98765-4321"
    rating = 4.5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/restaurants" -Method Post -Headers $headers -ContentType "application/json" -Body $body
```

---

## 🔒 Segurança

O projeto implementa as seguintes práticas de segurança:

- ✅ **Hash de senhas com bcrypt** (salt rounds: 10)
- ✅ **JWT forte** (128 caracteres hexadecimais gerados via crypto.randomBytes)
- ✅ **Autenticação stateless** com JWT
- ✅ **Validação de dados** no backend (service layer)
- ✅ **Proteção de rotas** sensíveis com middleware authenticateToken
- ✅ **Proteção contra SQL Injection** via Prisma ORM (prepared statements)
- ✅ **Variáveis de ambiente** para dados sensíveis (.env não versionado)
- ✅ **CORS** configurado adequadamente
- ✅ **Tratamento de erros** sem expor stack traces em produção

### Gerar JWT Secret Seguro

```powershell
# PowerShell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copie o resultado e cole no seu arquivo `.env` como valor de `JWT_SECRET`.

---

## 📚 Prisma Studio

Para visualizar e editar dados do banco visualmente:

```powershell
npm run prisma:studio
```

Acesse: **http://localhost:5555**

---

### 🎯 Como Revisar o Projeto

Para uma revisão completa, consulte o [REVIEW_GUIDE.md](REVIEW_GUIDE.md) que contém:

- ✅ Como verificar o banco de dados (estrutura, dados, integridade)
- ✅ Como testar autenticação e segurança JWT
- ✅ Como validar a arquitetura e separação de camadas
- ✅ Como executar testes funcionais completos
- ✅ Checklist de qualidade e boas práticas
- ✅ Ferramentas de análise (Prisma Studio, npm audit)

### 🏗️ Entendendo a Arquitetura

Para compreender as decisões arquiteturais, consulte o [ARCHITECTURE.md](ARCHITECTURE.md) que detalha:

- 📐 Padrões arquiteturais (Layered, Repository, Dependency Injection)
- 🔐 Implementações de segurança (bcrypt, JWT, validações)
- 🧩 Princípios SOLID aplicados
- 📊 Fluxo de dados entre camadas
- 🎯 ADRs (Architecture Decision Records)

---

## 🤝 Contribuição

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Felipe Bergamin Dantas - RA: 103538 - UniFECAF**

Projeto desenvolvido como parte do curso de Arquitetura de Software