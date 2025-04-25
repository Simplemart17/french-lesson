# French Tutor AI - Frontend

This is the frontend application for the French Tutor AI project, built with Next.js, TypeScript, and Tailwind CSS.

## Database Setup

The application uses PostgreSQL with Prisma ORM for database access. Follow these steps to set up the database:

1. Make sure you have PostgreSQL installed and running with a database named `french_lesson`
2. Configure your database connection in the `.env` file:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/french_lesson?schema=public"
   ```
3. Run the database setup commands:
   ```bash
   # Push the Prisma schema to the database
   npm run db:push
   
   # Seed the database with initial data
   npm run db:seed
   
   # Or run both commands together
   npm run db:setup
   ```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/french-lesson.git
cd french-lesson/frontend
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the frontend directory with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

Build the application for production:

```bash
npm run build
# or
yarn build
```

Start the production server:

```bash
npm start
# or
yarn start
```

## Project Structure

```
/src
  /components     # Reusable UI components
  /pages          # Next.js pages
  /styles         # Global styles
  /hooks          # Custom React hooks
  /utils          # Utility functions
  /types          # TypeScript type definitions
  /services       # API service functions
  /store          # Redux store configuration
```

## Features

- Voice input and output for French language practice
- Writing correction with AI feedback
- TCF/TEF exam preparation modules
- Progress tracking
- Adaptive learning based on user proficiency
- Conversational practice with AI