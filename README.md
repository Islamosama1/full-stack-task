# Full-Stack Task

Minimal monorepo with React (frontend) and NestJS (backend) using npm workspaces.

## Requirements

- Node.js `>=22.20.0`
- npm `>=11.13.0`

## Structure

```
apps/
  frontend/   # React 19 + Vite + TypeScript  → :3000
  backend/    # NestJS 10 + TypeScript         → :4000
```

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command                | Description                         |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Start both apps in development mode |
| `npm run build`        | Build both apps for production      |
| `npm run lint`         | Lint all files                      |
| `npm run lint:fix`     | Lint and auto-fix                   |
| `npm run format`       | Format all files with Prettier      |
| `npm run format:check` | Check formatting without writing    |

## Docker

```bash
# Start both apps
docker compose up

# Single service
docker compose up frontend
docker compose up backend
```

Production images use multi-stage builds — `target: prod` for minimal output.
