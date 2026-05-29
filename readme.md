# 🚀 Mindshare API

Um projeto robusto e focado na construção de uma API RESTful escalável e de alta performance onde pode compartilhar ideias em um grupo.

## 🛠 Tecnologias Usadas

O projeto foi desenvolvido com as seguintes tecnologias e ferramentas:

* **[Node.js](https://nodejs.org/)** - Ambiente de execução JavaScript server-side.
* **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript que adiciona tipagem estática e segurança.
* **[Prisma ORM](https://www.prisma.io/)** - ORM de próxima geração para Node.js, facilitando a modelagem e consultas ao banco de dados.
* **[Fastify](fastify.dev)** - Framework web rápido e minimalista.
* **[Biome](https://biomejs.dev/)** - Ferramenta de formatação e linting ultra-rápida, substituindo Prettier e ESLint.
* **[Dotenv](https://github.com/motdotla/dotenv)** - Gerenciamento e carregamento de variáveis de ambiente de forma segura.

## 📍 Mapeamento de Endpoints

Abaixo está a documentação base dos endpoints disponíveis nesta API. Todas as requisições devem incluir o cabeçalho apropriado de `Content-Type: application/json` quando aplicável.

### Autenticação e Usuários *(Exemplo - Ajuste para o seu projeto)*

| Método | Rota | Descrição | Requer Auth |
|---|---|---|:---:|
| `POST` | `/api/auth/login` | Autentica um usuário e retorna um token. | ❌ |
| `POST` | `/api/users` | Cria um novo usuário no sistema. | ❌ |
| `GET` | `/api/users` | Retorna a lista de usuários cadastrados. | ✅ |
| `GET` | `/api/users/:id` | Retorna os detalhes de um usuário específico. | ✅ |
| `PUT` | `/api/users/:id` | Atualiza os dados de um usuário existente. | ✅ |
| `DELETE`| `/api/users/:id` | Remove um usuário do sistema. | ✅ |

<details>
<summary><b>📄 Ver Exemplo de Resposta - <code>GET /api/users</code></b></summary>

```json
[
  {
    "id": "cuid123456789",
    "name": "João Silva",
    "email": "joao.silva@example.com",
    "createdAt": "2023-10-01T12:00:00Z"
  }
]
```
</details>

## 💻 Como usar no seu PC (Rodando localmente)

Siga o passo a passo abaixo para configurar e executar a aplicação na sua máquina local.

### Pré-requisitos

* Node.js (v18 ou superior recomendado)
* Banco de Dados configurado e rodando (ex: PostgreSQL, MySQL ou SQLite)
* Git

### Passo a passo da Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/mindshare.git
   cd mindshare
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Configuração das Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto (onde o arquivo `package.json` está localizado). Caso possua um `.env.example`, faça uma cópia dele:
   ```bash
   cp .env.example .env
   ```
   Abra o arquivo `.env` e configure a conexão com o seu banco de dados e a porta desejada:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/mindshare_db?schema=public"
   PORT=3000
   ```

4. **Execute as Migrations do Banco de Dados**
   Sincronize as tabelas do seu banco de dados e gere o Prisma Client:
   ```bash
   npx prisma migrate dev
   # ou para puxar um banco existente sem apagar dados:
   # npx prisma db push
   ```

5. **Inicie o Servidor**
   Para rodar a aplicação em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   A API estará rodando em `http://localhost:3000`.

## 📝 Scripts Disponíveis

No diretório do projeto, você pode rodar os seguintes comandos:

* `npm run dev`: Inicia o servidor em modo de desenvolvimento com hot-reload.
* `npm run build`: Compila o código TypeScript para JavaScript (para produção).
* `npm start`: Inicia o servidor com o código compilado da pasta `dist/` (ou `build/`).
* `npm run lint`: Verifica a qualidade do código com o Biome.
* `npm run format`: Corrige automaticamente e formata os arquivos do projeto com o Biome.

## 💡 Contribuindo

Sinta-se à vontade para abrir _Issues_ e _Pull Requests_ para sugerir melhorias ou reportar problemas encontrados.

---

⌨️ Feito com ☕ e dedicação.
