# French Tutor AI - Backend

This is the backend server for the French Tutor AI project, built with Node.js, Express, GraphQL, and MongoDB.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/french-lesson.git
cd french-lesson/backend
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Edit the `.env` file with your actual configuration values.

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The server will be running at http://localhost:4000 with the GraphQL endpoint at http://localhost:4000/graphql.

### Production

Start the production server:

```bash
npm start
# or
yarn start
```

## Project Structure

```
/src
  /controllers     # Route controllers
  /models          # Database models
  /resolvers       # GraphQL resolvers
  /typeDefs        # GraphQL type definitions
  /middleware      # Express middleware
  /utils           # Utility functions
  /services        # External service integrations
  /config          # Configuration files
  server.js        # Main server entry point
```

## API Features

- GraphQL API for all frontend interactions
- User authentication and authorization
- Speech-to-Text and Text-to-Speech processing
- AI-powered writing correction
- Exam practice module data management
- Progress tracking and analytics
- Lesson content delivery

## External Services Integration

- OpenAI GPT-4 / Gemini for language processing
- Google/Azure Speech services for voice input/output
- LanguageTool API for grammar checking