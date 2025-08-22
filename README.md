# DealSync — Starter Code (Next.js + Prisma)
Minimal starter for DealSync. Start on SQLite, or point Prisma to Supabase Postgres.

## Quick start (SQLite)
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed   # optional
npm run dev
# open http://localhost:3000

## Using Supabase Postgres
1) Create a Supabase project and copy: URL, anon key, service role key, Postgres URI
2) In `.env` set `DATABASE_URL` + `DIRECT_URL` (see .env.example)
3) In `prisma/schema.prisma` change datasource to `postgresql`
4) Run: npx prisma generate && npx prisma migrate dev --name init && npm run dev
# dealsync
