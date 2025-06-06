# Supabase Database Setup

This directory contains the Supabase configuration and database migrations for the French Tutor AI application.

## Prerequisites

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Make sure you have a Supabase project created at [supabase.com](https://supabase.com)

## Setup Instructions

### 1. Initialize Supabase (if not already done)

If you haven't initialized Supabase in this project yet:

```bash
supabase init
```

### 2. Link to your Supabase project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your actual Supabase project reference ID.

### 3. Run the initial migration

To apply the initial schema to your database:

```bash
supabase db push
```

Or if you want to run migrations individually:

```bash
supabase migration up
```

### 4. Seed the database (optional)

To populate the database with sample data for development:

```bash
supabase db reset --seed
```

## Migration Files

- `migrations/20241220000000_initial_schema.sql` - Initial database schema with all tables, indexes, RLS policies, and functions
- `seed.sql` - Sample data for development and testing
- `config.toml` - Supabase project configuration

## Database Schema Overview

The database includes the following main tables:

### Core Tables
- `users` - User profiles (extends Supabase auth.users)
- `lessons` - French lessons content
- `lesson_sections` - Individual sections within lessons
- `lesson_progress` - User progress tracking
- `vocabulary` - French vocabulary words
- `user_vocabulary` - User vocabulary learning progress

### Communication Tables
- `conversations` - AI conversation sessions
- `messages` - Individual messages in conversations
- `conversation_templates` - Predefined conversation scenarios

### Exercise Tables
- `lesson_exercises` - Exercises within lesson sections
- `practice_items` - Individual practice items
- `practice_sessions` - Practice session tracking
- `pronunciation_exercises` - Pronunciation practice content
- `pronunciation_practice_items` - User pronunciation attempts

### Reference Tables
- `grammar_rules` - French grammar explanations
- `exam_results` - Standardized test results (TCF, TEF, etc.)

## Key Features

### Row Level Security (RLS)
- All user-specific data is protected with RLS policies
- Users can only access their own data
- Public tables (lessons, vocabulary, etc.) are readable by all authenticated users

### Foreign Key Relationships
- `lesson_exercises.session_id` references `lesson_sections.id`
- `lesson_sections.lesson_id` references `lessons.id`
- All user-related tables reference `users.id`

### Automatic Timestamps
- All tables have `created_at` and `updated_at` timestamps
- `updated_at` is automatically updated via triggers

### Indexes
- Performance indexes on frequently queried columns
- User-specific indexes for efficient data retrieval

## Environment Variables

Make sure to set these environment variables in your application:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Development Workflow

1. Make schema changes by creating new migration files:
   ```bash
   supabase migration new your_migration_name
   ```

2. Test migrations locally:
   ```bash
   supabase start
   supabase db reset
   ```

3. Apply to remote database:
   ```bash
   supabase db push
   ```

## Troubleshooting

### Migration Issues
- If migrations fail, check the error logs and fix any SQL syntax issues
- Use `supabase db reset` to start fresh in development
- Always backup production data before running migrations

### RLS Issues
- If you can't access data, check RLS policies
- Use the service role key for admin operations
- Test policies with different user contexts

### Performance Issues
- Check if appropriate indexes exist
- Monitor query performance in Supabase dashboard
- Consider adding indexes for frequently queried columns

## Support

For Supabase-specific issues, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
