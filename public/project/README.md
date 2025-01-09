# AI Interview Assessment Platform

A comprehensive platform for practicing and improving interview skills using AI-powered analysis.

## Features

- Real-time facial expression and voice analysis during mock interviews
- Extensive question bank from top companies
- Detailed performance analytics and improvement tracking
- Personalized feedback and suggestions
- Progress monitoring dashboard

## Technical Stack

- **Frontend**: Next.js 13 with TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Analysis**: TensorFlow.js, Face-API.js
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS

## API Documentation

### Authentication

#### POST /api/auth/signup
Create a new user account.

```typescript
{
  email: string;
  password: string;
  name: string;
}
```

#### POST /api/auth/signin
Sign in to an existing account.

```typescript
{
  email: string;
  password: string;
}
```

### Interviews

#### GET /api/interviews
Get a list of available interviews.

Response:
```typescript
{
  interviews: Array<{
    id: string;
    title: string;
    description: string;
    company: string;
    difficulty: string;
    duration: number;
  }>;
}
```

#### GET /api/interviews/:id
Get details of a specific interview.

#### POST /api/interviews/:id/assessment
Start a new assessment for an interview.

### Assessments

#### GET /api/assessments/:id
Get details of a specific assessment.

#### POST /api/assessments/:id/questions/:questionId
Submit analysis data for a question.

```typescript
{
  emotions: Array<{
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  }>;
  voiceAnalysis: {
    confidence: number;
    clarity: number;
    pace: number;
  };
}
```

### Dashboard

#### GET /api/dashboard
Get user's dashboard data including performance metrics.

Response:
```typescript
{
  stats: {
    totalInterviews: number;
    averageScore: number;
    improvement: number;
  };
  assessments: Array<{
    id: string;
    date: string;
    score: number;
    interview: {
      title: string;
    };
    feedback: string;
    tags: string[];
  }>;
}
```

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```
   DATABASE_URL=your_postgresql_url
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=http://localhost:3000
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT