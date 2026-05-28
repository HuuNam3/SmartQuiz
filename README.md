# Smart Quiz

An interactive review and quiz application about Vietnam's maritime sovereignty, built with Next.js App Router, React 19, and MongoDB.

The system has two main user flows:

- Students sign in with a `classId`, study the review materials, complete 4 reinforcement stations, and take a 6-question quiz.
- Teachers sign in with a demo code to view the scoreboard and export results to Excel.

## Main Features

- Sign in with a student group code.
- Review page with images, accordion sections, and audio playback.
- `Mystery Voyage` reinforcement mode with 4 stations, 5 questions per station, scoring, and station unlock codes.
- Main quiz with 6 random questions selected from a 10-question bank, limited to 6 minutes.
- Student profile page showing quiz score, station scores, and total score.
- Teacher dashboard with near real-time progress tracking and Excel export.
- Data stored in MongoDB through API routes in `src/app/api`.

## Tech Stack

- Next.js `16.2.1`
- React `19.2.4`
- TypeScript
- Tailwind CSS `v4`
- MongoDB Node Driver
- shadcn/ui, Radix UI, Sonner, Framer Motion
- `xlsx` and `file-saver` for Excel export

## User Flow

### Student

1. Open the home page and enter a `classId`.
2. Read the review materials at `/review`.
3. Complete the 4 stations at `/consolidation`.
4. Unlock the main quiz with access code `OT123456`.
5. View the result at `/profile`.

### Teacher

- Teacher demo code: `gv001`
- After signing in with this code, the app redirects to `/bashboard`
- Teachers can view the scoreboard and export an Excel file

## Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=smart_quiz
```

The app will fail on startup if either of these variables is missing.

## Minimum MongoDB Seed Data For Demo

The application does not generate sample data automatically. To run a demo, you should prepare at least the following data.

### `users` Collection

Example teacher record:

```json
{
  "classId": "gv001",
  "class": "GV",
  "group": 0,
  "admin": true,
  "ping": 0,
  "updatedAt": { "$date": "2026-01-01T00:00:00.000Z" }
}
```

Example student record:

```json
{
  "classId": "hs001",
  "class": "12A1",
  "group": 1,
  "admin": false,
  "ping": 0,
  "score": 0,
  "scoreStep": [-1, -1, -1, -1],
  "continueStep": -1,
  "updatedAt": { "$date": "2026-01-01T00:00:00.000Z" }
}
```

### `codes` Collection

Each station needs one unused unlock code:

```json
[
  { "stationCode": 1, "code": "CODE1", "used": false },
  { "stationCode": 2, "code": "CODE2", "used": false },
  { "stationCode": 3, "code": "CODE3", "used": false },
  { "stationCode": 4, "code": "CODE4", "used": false }
]
```

Notes:

- The main quiz access code is currently hardcoded as `OT123456`.
- Station unlock codes are loaded from the `codes` collection.
- The teacher demo code has been standardized to `gv001`.

## Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Main Project Structure

```text
src/
  app/
    api/
      codes/route.ts
      users/route.ts
    consolidation/page.tsx
    profile/page.tsx
    quiz/page.tsx
    review/page.tsx
    bashboard/page.tsx
    page.tsx
  components/
  context/
  lib/
public/
```

## Existing API Endpoints

- `GET /api/users`: fetch all users
- `POST /api/users`: create a new user
- `PUT /api/users`: update `ping`, quiz score, station scores, or continuation state
- `GET /api/codes`: fetch station unlock codes
- `PUT /api/codes`: mark a code as used

## Implementation Notes

- The project uses App Router under `src/app`.
- `next.config.ts` currently allows dev origins from `localhost`, `192.168.1.34`, and `192.168.1.96`.
- The teacher dashboard route is `/bashboard`, matching the current folder name.
