# All India Villages API Platform

A production-ready Next.js application with App Router, Tailwind CSS, Prisma ORM, PostgreSQL (Neon compatible), and Vercel serverless API routes.

## Features

- Village model with `id`, `name`, `district`, `state`, `population`, and `createdAt`
- REST API at `/api/villages`
- GET route with filters and pagination
- POST, PUT, DELETE routes for village management
- Dashboard with add-village form, state filter, and pagination
- Seed script loading sample village data from CSV

## Project Structure

- `/app` - App Router frontend
- `/components` - Reusable React components
- `/pages/api` - Next.js serverless API routes
- `/prisma` - Prisma schema and sample CSV seed data
- `/lib` - Prisma client helper
- `/scripts` - Database seeding script

## Setup

1. Copy `.env.example` to `.env` and set your PostgreSQL connection string:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Create database schema:

```bash
npm run db:push
```

5. Seed sample village data:

```bash
npm run seed
```

6. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` to view the dashboard.

## Importing Real Village Data

1. Place all state CSV files in `/data`.
   - Example: `data/odisha.csv`, `data/bihar.csv`, `data/up.csv`, `data/tamilnadu.csv`
   - Files should use standardized columns:
     - `Area Name` or `name`
     - `DISTRICT` or `district`
     - `STATE NA` or `state`

2. Install the parser dependency:

```bash
npm install csv-parser
```

3. Run the merge and seed script:

```bash
npm run merge:seed
```

This script will read all `.csv` files in `/data`, merge rows, and insert them in batches of 1000.

## Indexing for Performance

Run these SQL commands in Neon to speed up filtering and search:

```sql
CREATE INDEX idx_state ON "Village"(state);
CREATE INDEX idx_district ON "Village"(district);
CREATE INDEX idx_name ON "Village"(name);
```

Now refresh the UI and verify that filters and search return live data.

## Deployment

This project is deployable on Vercel. Make sure `DATABASE_URL` is configured in your Vercel environment variables.

Recommended Vercel build settings:

- Framework Preset: `Next.js`
- Root Directory: `/`
- Build Command: `npm run build`
- Output Directory: `.next`

## API Reference

### GET /api/villages

Query parameters:

- `state` - filter by state name
- `search` - search village or district
- `page` - page number
- `limit` - page size

### POST /api/villages

Body:

```json
{
  "name": "Rampur",
  "district": "Hardoi",
  "state": "Uttar Pradesh",
  "population": 13200
}
```

### PUT /api/villages

Body:

```json
{
  "id": "<village-id>",
  "name": "Rampur Updated",
  "district": "Hardoi",
  "state": "Uttar Pradesh",
  "population": 13500
}
```

### DELETE /api/villages

Body:

```json
{ "id": "<village-id>" }
```

## Notes

- Use `npm run lint` to validate the codebase.
- The seed script reads `/prisma/villages.csv` and populates the database.
- This app is built for Vercel serverless deployment and Neon/PostgreSQL compatibility.
