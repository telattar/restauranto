# 🧑‍🍳👩‍🍳👨‍🍳 Restauranto
A very simple backend project where I google "NestJS best practices" every 5 minutes.
Bonus: live order updates using websockets 👾

## Features

- **NestJS architecture**: Modular backend structure.
- **Prisma ORM** using PostgreSQL database.
- **Real-time order updates**: websocket support for live order status tracking.
- **Caching** for fast API responses.
- **Validation and error handling**: DTOs and global filters keep data clean.
- **Unit and E2E tests**: test coverage from logic to endpoints.
- **CI/CD**: Automated linting and tests via GitHub actions.
- **Strict-typing**: for TypeScript safety.

## Getting started

 1. Clone and install

```bash
git clone https://github.com/telattar/restauranto.git
cd restauranto
npm install
```

 2. Configure your environment

Copy `.env.sample` to `.env` and set your PostgreSQL connection string:

```
DATABASE_URL=postgresql://user:password@localhost:your-port/some-database
```

 3. Run DB migrations using Prisma

```bash
npx prisma migrate dev --schema=src/database/schema.prisma
```

 4. Start the server

```bash
nest start --watch
```

 5. Run the tests

- Unit Tests
  ```bash
  npm run test
  ```
- End-to-End Tests
  ```bash
  npm run test:e2e
  ```
---

## API Overview

### Restaurants

- `GET /restaurants` — List all restaurants (cached to improve performance)
- `GET /restaurants/:id` — Get restaurant by ID
- `POST /restaurants` — Create a restaurant
- `PATCH /restaurants/:id` — Update a restaurant
- `DELETE /restaurants/:id` — Delete a restaurant

### Products

- `GET /products` — List all products
- `GET /products/:id` — Get product by ID
- `POST /products` — Create a product
- `PATCH /products/:id` — Update a product
- `DELETE /products/:id` — Delete a product

### Orders

- `GET /orders` — List all orders (paginated)
- `GET /orders/:id` — Get order by ID
- `POST /orders` — Create an order
- `PATCH /orders/:id` — Update order status

### Real-Time

- WebSocket namespace: `/order-status`
- Events: `order-status`, `created-order`
