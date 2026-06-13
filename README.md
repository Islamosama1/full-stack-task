# Full-Stack Task

A full-stack monorepo with a React frontend and NestJS backend, implementing JWT-based authentication with MongoDB persistence.

## Tech Stack

| Layer    | Technology                                             |
| -------- | ------------------------------------------------------ |
| Frontend | React 19, Vite 6, TypeScript, Tailwind CSS 4, shadcn/ui |
| Backend  | NestJS 11, TypeScript, Mongoose, Passport JWT          |
| Database | MongoDB 7                                              |
| Auth     | JWT (HTTP-only cookies), bcryptjs                      |
| Docs     | Swagger / OpenAPI                                      |

## Requirements

- Node.js `>=22.20.0`
- npm `>=11.13.0`
- MongoDB (local or via Docker)

## Project Structure

```
apps/
  frontend/          # React 19 + Vite + Tailwind CSS     → :3000
  backend/           # NestJS 11 + Mongoose + JWT          → :4000
    src/
      auth/          # Signup, login, logout endpoints
        dto/         # Request/response shapes
        guards/      # JwtAuthGuard
        repositories/# Database access layer
        schemas/     # Mongoose User model
      common/
        filters/     # Global exception filter
    testing/
      unit/          # Jest unit tests
```

## Features

- **Authentication** — signup, login, logout with JWT stored in HTTP-only cookies
- **Password security** — bcryptjs hashing with 12 salt rounds
- **Validation** — class-validator DTOs with a global ValidationPipe
- **Error handling** — global exception filter returning consistent `{ statusCode, error, message, timestamp, path }` responses
- **API docs** — Swagger UI auto-generated from decorators
- **Dual token delivery** — JWT returned in both the response body and an HTTP-only cookie

## Environment Variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

| Variable       | Default                          | Description                    |
| -------------- | -------------------------------- | ------------------------------ |
| `NODE_ENV`     | `development`                    | Runtime environment            |
| `BACKEND_PORT` | `4000`                           | NestJS listen port             |
| `FRONTEND_PORT`| `3000`                           | Vite dev server port           |
| `CORS_ORIGIN`  | `http://localhost:3000`          | Allowed CORS origin            |
| `MONGO_PORT`   | `27018`                          | MongoDB host port              |
| `MONGO_DB`     | `app`                            | Database name                  |
| `MONGODB_URI`  | `mongodb://localhost:27018/app`  | Full connection string         |
| `JWT_SECRET`   | `change-me-in-production`        | JWT signing secret             |
| `JWT_EXPIRES_IN`| `15m`                           | Token lifetime                 |

## Getting Started

```bash
# Install dependencies for all workspaces
npm install

# Start frontend and backend together
npm run dev
```

The frontend is available at `http://localhost:3000` and the backend at `http://localhost:4000`.

## API Endpoints

| Method | Path          | Auth required | Description       |
| ------ | ------------- | ------------- | ----------------- |
| GET    | `/`           | No            | Health check      |
| POST   | `/auth/signup`| No            | Register new user |
| POST   | `/auth/login` | No            | Login             |
| POST   | `/auth/logout`| Yes (JWT)     | Clear auth cookie |

Interactive docs: `http://localhost:4000/docs`

## Scripts

### Root (runs across both apps)

| Command                | Description                         |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Start both apps in development mode |
| `npm run build`        | Build both apps for production      |
| `npm run lint`         | Lint all TypeScript files           |
| `npm run lint:fix`     | Lint and auto-fix                   |
| `npm run format`       | Format with Prettier                |
| `npm run format:check` | Check formatting without writing    |

### Backend only (`cd apps/backend`)

| Command                   | Description                  |
| ------------------------- | ---------------------------- |
| `npm run dev`             | Start with hot reload        |
| `npm run build`           | Compile TypeScript           |
| `npm run start`           | Run compiled output          |
| `npm run test`            | Run all tests                |
| `npm run test:unit`       | Run unit tests only          |
| `npm run test:watch`      | Watch mode                   |
| `npm run test:coverage`   | Generate coverage report     |

## Testing

Unit tests live in `apps/backend/testing/unit/` and cover the auth service, guards, repository, and cookie service.

```bash
cd apps/backend
npm run test:unit
npm run test:coverage
```

## Docker

Compose starts MongoDB alongside the two apps with volume mounts for hot reload:

```bash
# Start all services
docker compose up

# Individual services
docker compose up frontend
docker compose up backend
docker compose up mongo
```

Production images use multi-stage builds:

```bash
docker compose up --build
```

The mongo service binds to host port `27018` (not 27017) to avoid conflicts with a locally running MongoDB instance.
