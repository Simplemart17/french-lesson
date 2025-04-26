# French Lesson - Learning Platform

A modern, AI-powered French learning platform with personalized lessons, interactive exercises, and conversation practice.

## Features

- Personalized lesson plans based on user level and goals
- AI-powered French language tutor
- Grammar correction and feedback
- Conversation practice with contextual vocabulary
- Pronunciation analysis
- Progress tracking

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: OpenAI GPT-4

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL database

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/french_lesson"

# Authentication
JWT_SECRET="your-secret-key-here"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

### Installation

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client and run migrations:

```bash
npm run db:setup
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## API Endpoints

### Lessons

- `GET /api/lessons` - Get all lessons with optional filtering
- `GET /api/lessons/progress` - Get user's lesson progress

### AI Features

- `POST /api/ai/grammar-correction` - Correct French grammar and provide feedback
- `POST /api/ai/generate-conversation` - Generate conversation practice with vocabulary
- `POST /api/ai/tutor-chat` - Chat with the AI French tutor
- `POST /api/ai/personalized-lesson-plan` - Get personalized lesson recommendations

## Database Schema

The database includes tables for:
- Users
- Lessons
- Lesson Progress
- Vocabulary
- Conversations
- Messages

See `prisma/schema.prisma` for the complete schema.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request