# French Lesson - Learning Platform

A modern, AI-powered French learning platform with personalized lessons, interactive exercises, and conversation practice.

## Features

- Personalized lesson plans based on user level and goals
- AI-powered French language tutor
- Grammar correction and feedback
- Conversation practice with contextual vocabulary
- Pronunciation analysis with AI-powered text-to-speech
- Progress tracking

### New AI Text-to-Speech Feature

The platform now includes high-quality AI-powered text-to-speech for French pronunciation:

- Natural-sounding French pronunciation using OpenAI's TTS API
- Multiple voice options for varied learning experience
- Automatic fallback to browser-based TTS when offline
- Intelligent caching to reduce API calls
- Integrated with vocabulary, lessons, and pronunciation exercises

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL with real-time features)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI GPT-4 and TTS

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account and project

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Optional: Set a default voice for TTS (alloy, echo, fable, onyx, nova, shimmer)
DEFAULT_TTS_VOICE="alloy"
```

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up your Supabase database:

- Create a new Supabase project at https://supabase.com
- Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
- Optionally seed the database:

```bash
npm run db:seed
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
- `POST /api/tts` - Generate high-quality French text-to-speech audio

## Database Schema

The Supabase database includes tables for:
- Users (with Supabase Auth integration)
- Lessons and Lesson Progress
- Vocabulary and User Vocabulary Progress
- Conversations and Messages
- Pronunciation Exercises
- Grammar Rules
- Exam Results
- Practice Sessions

See `supabase/schema.sql` for the complete schema with Row Level Security (RLS) policies.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request