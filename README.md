# Isha World Frontend

React + TypeScript + Vite frontend for the Isha World globe discovery experience.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Query
- React Router
- Globe.gl via `react-globe.gl`

## Local Setup

```bash
npm install
npm run dev
```

The app expects the backend API at:

```bash
VITE_API_URL=http://localhost:8080/api/v1
```

## Architecture

The app follows feature-based architecture:

```text
src/
  api/
  components/
  features/
  hooks/
  layouts/
  pages/
  routes/
  types/
  utils/
```

Phase 0 creates the structure and globe-first shell. Later phases will wire real API data, marker clustering, search fly-to behavior, and admin screens.

