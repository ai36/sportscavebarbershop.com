# Sports Cave Barbershop

## Sports Cave Barbershop - premium barbershop booking site - [https://sportscavebarbershop.vercel.app](https://sportscavebarbershop.vercel.app/?utm_source=github&utm_medium=readme)

### Installation & control

```sh
npm i
```

### Dev-mode

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Works fully without a database — `/api/bookings` and `/api/availability` degrade to a clear error instead of crashing until `POSTGRES_URL` is set (see `docs/architecture.md`).

## Tech Stack

- React 19
- Next.js 16 (App Router) + SSR
- Tailwind CSS v4
- Drizzle ORM + Vercel Postgres (Neon)
- react-day-picker
- TypeScript

## Project docs

This project keeps a full docs/ trail (business requirements, architecture, design system) in Russian, per the project's own [documentation rule](CLAUDE.md) — see:

- [docs/overview.md](docs/overview.md) · [docs/business-requirements.md](docs/business-requirements.md) · [docs/system-requirements.md](docs/system-requirements.md)
- [docs/architecture.md](docs/architecture.md) · [docs/design-system.md](docs/design-system.md) · [docs/image-credits.md](docs/image-credits.md)
- [BACKLOG.md](BACKLOG.md) · [CHANGELOG.md](CHANGELOG.md) · [CLAUDE.md](CLAUDE.md)
