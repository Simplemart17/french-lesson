# French Tutor AI

A full-stack web application designed to help users learn French from beginner to advanced levels using AI-powered features.

## Technical Architecture

### Frontend
- **Framework:** React.js with Next.js
- **State Management:** Context API (AuthContext implemented)
- **Styling:** Tailwind CSS with custom components
- **Responsive Design:** Mobile-first approach

### Backend
- **Language:** Next.js API routes
- **API:** RESTful
- **Authentication:** Supabase Auth with Row Level Security
- **Database:** Supabase (PostgreSQL with real-time features)

## Core Functional Requirements

### 1. Speech Technology Module
- **Current Implementation:**
  - Basic text-to-speech using OpenAI's TTS API
  - PronunciationPlayer component for audio playback
  - PronunciationExercise component with simulated feedback
- **Gaps to Address:**
  - Implement real speech recognition (currently simulated)
  - Add multi-dialect support for French accent variations
  - Implement real-time pronunciation scoring
  - Add noise reduction algorithms
  - Implement accent detection and correction
  - Add support for audio file upload

### 2. AI Language Learning Engine
- **Current Implementation:**
  - OpenAI GPT-4 integration via aiService
  - Grammar correction functionality
  - Conversation generation
- **Gaps to Address:**
  - Implement vocabulary recommendation system
  - Develop adaptive learning algorithms & personalized paths
  - Add CEFR level assessment and tracking
  - Integrate Hugging Face Transformers for specialized tasks

### 3. TCF/TEF Exam Preparation Module
- **Current Implementation:**
  - Basic exam practice pages exist but functionality is limited
- **Gaps to Address:**
  - Implement practice test generator
  - Add timed assessments
  - Develop performance analytics
  - Create adaptive difficulty system
  - Implement all assessment categories: Compréhension écrite/orale, Expression écrite/orale, Grammaire et vocabulaire

### 4. Personalization Engine
- **Current Implementation:**
  - Basic user profiles with level selection
  - Simple authentication system with Supabase
- **Gaps to Address:**
  - Implement learning style assessment
  - Develop goal-based curriculum generation
  - Add adaptive difficulty scaling
  - Create weak point targeted learning system

## Current Technology Stack

- **Frontend:** React + TypeScript, Next.js, Context API, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** Supabase (PostgreSQL with real-time features and Row Level Security)
- **Authentication:** Supabase Auth with automatic user profile creation
- **AI Services:** OpenAI GPT-4 for text generation and TTS

## Recommended Technology Additions

- **State Management:** Consider adding Redux for more complex state management
- **API Layer:** Consider GraphQL for more efficient data fetching
- **Real-time Features:** Add WebSocket support for real-time interactions
- **Additional AI Services:** Integrate Hugging Face Transformers, Google Web Speech or Azure Cognitive Services for speech recognition
- **Infrastructure:** Consider AWS/Google Cloud, Docker, and Kubernetes for production deployment

## Infrastructure Requirements

### Current Infrastructure
- **Deployment:** Local development environment
- **Authentication:** Supabase Auth with automatic session management
- **Database:** Supabase with Row Level Security policies

### Future Infrastructure Needs
- **Cloud Deployment:** AWS/Google Cloud
- **Containerization:** Docker
- **Orchestration:** Kubernetes for scaling
- **Architecture:** Consider microservices for scaling

### Security Implementation
- **Current:** Basic JWT token management via Supabase
- **Needed:** 
  - Enhanced OAuth 2.0 authentication
  - GDPR compliance measures
  - End-to-end encryption for sensitive data

## Machine Learning Components

### Current Implementation
- Basic OpenAI GPT-4 integration for text generation
- OpenAI TTS API for pronunciation

### Future ML Enhancements
- Transfer learning implementation for French-specific models
- Continuous model improvement via user feedback loop
- Multi-language support expansion planning
- Custom speech recognition models for French dialects

## Monetization Model

### Proposed Strategy
- Freemium tier with basic features
- Subscription-based premium features (advanced AI tools, unlimited practice)
- Enterprise training packages for schools and businesses

## Development Phases

### Phase 1: MVP (Current Status - Partially Implemented)
- ✅ Basic user authentication
- ✅ Simple lesson structure
- ✅ Basic AI text generation
- ✅ Text-to-speech functionality
- ⏳ Complete core language learning features
- ⏳ Implement real speech recognition
- ⏳ Enhance exam preparation module

### Phase 2: Advanced Features
- Enhanced AI capabilities with specialized models
- Comprehensive exam simulations with real-time feedback
- Advanced personalization based on learning patterns
- Expanded vocabulary and grammar exercises

### Phase 3: Scaling & Integration
- Multi-platform support (mobile apps)
- Enterprise solution development
- Global language expansion beyond French

## Technical Challenges

### Current Challenges
- Implementing accurate speech recognition for French pronunciation
- Creating a robust scoring system for pronunciation accuracy
- Developing adaptive learning algorithms that respond to user progress
- Scaling AI capabilities while managing API costs
- Ensuring low-latency audio processing for real-time feedback

## Implementation Priorities

### Immediate (Next Sprint)
1. **Complete Speech Recognition Integration**
   - Implement real speech recognition using Web Speech API or a third-party service
   - Add audio recording capabilities to pronunciation exercises
   - Develop basic pronunciation scoring algorithm

2. **Enhance Authentication System**
   - Complete Supabase integration with proper error handling
   - Add social login options
   - Implement proper profile management

3. **Improve Lesson Structure**
   - Create a more comprehensive lesson progression system
   - Implement proper tracking of user progress
   - Add more interactive exercise types

### Medium-term (1-3 Months)
1. **Advanced AI Features**
   - Implement more sophisticated grammar correction
   - Add contextual vocabulary recommendations
   - Develop personalized learning paths

2. **Exam Preparation Module**
   - Build comprehensive TCF/TEF practice tests
   - Implement scoring and feedback systems
   - Create study plans based on test results

3. **User Experience Improvements**
   - Enhance mobile responsiveness
   - Add offline capabilities for basic features
   - Implement gamification elements

### Long-term (3-6 Months)
1. **Advanced Speech Technology**
   - Implement dialect-specific recognition
   - Add detailed phonetic feedback
   - Create conversation practice with AI

2. **Scaling Infrastructure**
   - Move to cloud deployment
   - Implement proper caching and optimization
   - Set up monitoring and analytics
- Context-aware language processing
- Low-latency real-time interactions
- Seamless user experience

## Performance Metrics

- Speech recognition accuracy: 95%+
- Language comprehension: 90%+
- User engagement: 30+ min/day
- Exam prep success rate: 85%+

## Compliance and Accessibility

- WCAG 2.1 standards
- Multi-device compatibility
- Internationalization support

## Deliverables

1.  Fully functional web application
2.  Comprehensive documentation
3.  Scalable, modular codebase
4.  CI/CD pipeline
5.  Comprehensive test coverage

## Bonus Features (Potential)

- Gamification elements
- Social learning communities
- Offline mode support
- Machine translation integration

## Project Structure

```
/french-lesson
├── /backend         # Node.js (Express) backend code with GraphQL
│   ├── /src
│   │   └── server.js  # Main server entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── /frontend        # React.js (Next.js) frontend code
│   ├── /src
│   │   ├── /pages
│   │   │   ├── index.tsx  # Home page
│   │   │   └── _app.tsx   # App configuration
│   │   └── /styles
│   │       └── globals.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── README.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Installation

#### Backend Setup

1. Navigate to the backend directory:

```bash
cd french-lesson/backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual configuration values.

4. Start the development server:

```bash
npm run dev
```

The server will be running at http://localhost:4000 with the GraphQL endpoint at http://localhost:4000/graphql.

#### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd french-lesson/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

### Backend Deployment

1. Build the backend:

```bash
cd backend
npm run build
```

2. Start the production server:

```bash
npm start
```

### Frontend Deployment

1. Build the frontend:

```bash
cd frontend
npm run build
```

2. Start the production server:

```bash
npm start
```

Alternatively, deploy the frontend to Vercel or Netlify for automatic CI/CD.

## Contributing

(Contribution guidelines can be added here.)

## Areas for Improvement & Future Features

### Immediate Improvements Needed

1. **Complete Speech Recognition Implementation**
   - Currently using simulated speech recognition
   - Need to integrate Web Speech API or third-party service
   - Add real-time pronunciation scoring

2. **Enhanced Error Handling**
   - Add comprehensive error boundaries
   - Implement retry mechanisms for API calls
   - Better user feedback for errors

3. **Performance Optimization**
   - Implement proper caching strategies
   - Optimize bundle size
   - Add loading states and skeleton screens

4. **Testing Coverage**
   - Add unit tests for components
   - Integration tests for API endpoints
   - End-to-end testing with Cypress

### Medium-term Features

1. **Advanced AI Features**
   - Contextual vocabulary recommendations
   - Adaptive learning paths based on user performance
   - Conversation practice with AI tutors

2. **Gamification**
   - Achievement system
   - Learning streaks and rewards
   - Leaderboards and social features

3. **Offline Support**
   - Service worker implementation
   - Offline lesson caching
   - Sync when back online

4. **Mobile App**
   - React Native implementation
   - Push notifications for practice reminders
   - Mobile-specific features

### Long-term Vision

1. **Multi-language Support**
   - Expand beyond French to other languages
   - Shared learning infrastructure
   - Cross-language learning paths

2. **Enterprise Features**
   - Classroom management tools
   - Progress tracking for educators
   - Bulk user management

3. **Advanced Analytics**
   - Learning pattern analysis
   - Predictive modeling for success
   - Personalized recommendations

4. **Integration Ecosystem**
   - LMS integrations
   - Third-party app connections
   - API for external developers

## Current Implementation Status

### ✅ Completed Features
- Supabase authentication and database integration
- Basic lesson structure and progress tracking
- OpenAI integration for AI features
- Text-to-speech functionality
- User profile management
- Vocabulary practice system
- Basic conversation features

### 🚧 In Progress
- Speech recognition implementation
- Enhanced pronunciation practice
- Exam preparation modules
- Advanced AI tutoring features

### 📋 Planned Features
- Real-time collaboration
- Advanced analytics dashboard
- Mobile application
- Offline functionality
- Multi-language support

## License

MIT License - See LICENSE file for details.