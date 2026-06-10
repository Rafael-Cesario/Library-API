# Library API

Library API é uma aplicação backend responsável pelo gerenciamento de livros e autores através de operações CRUD completas. O projeto modela uma relação muitos-para-muitos entre livros e autores. Além das funcionalidades principais, a aplicação foi desenvolvida utilizando práticas modernas de desenvolvimento backend, incluindo validação de dados, tratamento centralizado de erros, testes automatizados e ambientes isolados para desenvolvimento e testes.

Stack: Typescript, Express, Prisma, PostgreSQL, Docker, Vitest, Supertest, ZOD. 

Uma coleção do Postman está disponível no repositório para facilitar a exploração e os testes dos endpoints da aplicação.

# Como executar

Requisitos: Node 24.11.0, Docker 28.2.2, NPM 11.7.0

````bash
git clone https://github.com/Rafael-Cesario/Library-API.git
cd library-api
npm install
````

Crie os arquivos:
.env.development
.env.test

````bash
// .env.development
PORT=4000
DATABASE_URL="postgresql://admin:admin@localhost:5432/library_dev?schema=public"

// .env.test
PORT=5000
DATABASE_URL="postgresql://admin:admin@localhost:5433/library_dev?schema=public"
````

Subir os container
````bash
docker compose up
````

Executar as migrations
````bash
npx dotenv -e .env.development -- npx prisma migrate dev
npm run test-setup
````

Executar a aplicação: npm run dev

Executar os testes: npm run test



















