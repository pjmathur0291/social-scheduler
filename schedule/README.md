# Social Scheduler

A modern social media scheduling application built with Next.js 14, TypeScript, and Prisma.

## Features

- 🔐 **Authentication** - Secure user registration and login
- 📱 **Multi-Platform Support** - Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube, Pinterest
- 📅 **Smart Scheduling** - Schedule posts with optimal timing
- 📊 **Analytics** - Track engagement and performance
- 👥 **Team Collaboration** - Multi-user support with role-based access
- 🎨 **Modern UI** - Beautiful, responsive interface with Tailwind CSS

## Tech Stack

- **Frontend & Backend**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + Shadcn/ui
- **File Storage**: Cloudinary
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd social-scheduler
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your `.env.local` file with:
   - Database URL
   - NextAuth secret
   - Social media API keys
   - Cloudinary credentials

5. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── dashboard/        # Dashboard components
│   └── providers/        # Context providers
├── lib/                  # Utility functions
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Prisma client
│   └── utils.ts         # Helper functions
└── types/               # TypeScript type definitions
```

## Database Schema

The application uses Prisma with PostgreSQL and includes models for:
- Users and authentication
- Social media accounts
- Posts and scheduling
- Teams and collaboration
- Analytics and engagement

## API Routes

- `/api/auth/[...nextauth]` - Authentication endpoints
- `/api/auth/register` - User registration
- `/api/posts` - Post management
- `/api/social-accounts` - Social media account management
- `/api/analytics` - Analytics data

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@socialscheduler.com or create an issue on GitHub.