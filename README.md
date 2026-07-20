# Workout Log

A workout tracker. Log your sessions, track sets/reps/weight, save
routines as templates so you can start them again in a tap, and see
your progress over time on per-exercise charts and lifetime stats.

Backend is ASP.NET Core 8 (C#) with EF Core over PostgreSQL. Frontend
is React 19 + TypeScript on Vite, styled with Tailwind and shadcn/ui.
Statistics are computed in the background by a Hangfire job instead of
on every write, so logging a set stays fast.

## Running it

Easiest way is Docker. Copy the env template, fill in real values, and
bring it up:

```bash
cp .env.example .env
docker-compose up --build
```

Frontend's at `localhost:80`, API at `localhost:8080`.

If you'd rather run things directly:

```bash
# backend
cd backend/api
dotnet run --project PresentationLayer
# swagger at localhost:5158/swagger, hangfire dashboard at /hangfire

# frontend, in another terminal
cd frontend
npm install
npm run dev
# localhost:5173
```

## Layout

```
backend/api/
├── PresentationLayer/   controllers, DTOs, Program.cs
├── BusinessLayer/        services, Result<T>, JWT
└── DataAccessLayer/      EF DbContext, entities, migrations

frontend/src/
├── api/                 axios instance, handles auth refresh
├── components/
├── context/              auth + theme
├── hooks/react-query/    data fetching
├── pages/
├── routes/
└── schemas/              zod validation
```

## Env vars

`.env.example` has the full list — DB connection string, JWT
issuer/audience/signing key, and Cloudinary creds for profile pictures.
The frontend also needs `VITE_API_URL` pointing at the API.

## Migrations

```bash
cd backend/api
dotnet ef migrations add <Name> --project DataAccessLayer --startup-project PresentationLayer
dotnet ef database update --project DataAccessLayer --startup-project PresentationLayer
```
