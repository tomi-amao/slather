# Slather - Sandwich Sharing Platform

A modern web application for sharing, discovering, and rating sandwich experiences from restaurants and homemade creations.

## 🥪 Features

- **Share Your Creations**: Upload photos and stories of restaurant finds or homemade sandwiches
- **Multi-Criteria Rating System**: Rate sandwiches on taste, presentation, and value
- **Community Interaction**: Comments, likes, and user following
- **Restaurant Integration**: Link sandwiches to restaurant locations
- **Ingredient Tracking**: List ingredients for homemade sandwiches
- **Image Uploads**: High-quality photo sharing with optimization
- **User Authentication**: Secure signup/signin with OAuth providers

## 🛠 Tech Stack

### Frontend
- **Next.js 14+** with App Router and TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form + Zod** for form validation
- **TanStack Query** for data fetching
- **Lucide React** for icons

### Backend & Database
- **PostgreSQL** with Prisma ORM
- **NextAuth.js** for authentication
- **UploadThing** for file uploads
- **bcryptjs** for password hashing

### Authentication Providers
- Google OAuth
- GitHub OAuth
- Email/Password credentials

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd slather
npm install
```

### 2. Environment Setup
Copy the `.env` file and update with your credentials:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/slather_db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# File Upload (UploadThing)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Or run migrations (recommended for production)
npm run db:migrate
```

### 4. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📚 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run type-check` - Run TypeScript type checking

## 🗃 Database Schema

The application uses a comprehensive schema with the following main entities:

- **Users**: Authentication and profile information
- **Sandwiches**: Core content with images and details
- **Restaurants**: Location and business information
- **Ratings**: Multi-criteria scoring system
- **Comments**: Threaded discussions
- **Likes**: User engagement
- **Follows**: Social connections

## 🔧 Configuration

### OAuth Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

#### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`

### UploadThing Setup
1. Sign up at [UploadThing](https://uploadthing.com/)
2. Create a new app
3. Copy your App ID and Secret to environment variables

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Railway
- Render
- AWS Amplify
- DigitalOcean App Platform

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── ...                # Application pages
├── components/            # React components
│   ├── ui.tsx            # Reusable UI components
│   ├── header.tsx        # Navigation header
│   └── providers.tsx     # Context providers
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Database client
│   ├── validations.ts    # Zod schemas
│   ├── utils.ts          # Helper functions
│   └── uploadthing.ts    # File upload components
└── prisma/
    └── schema.prisma     # Database schema
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/slather/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

Built with ❤️ for sandwich enthusiasts everywhere!
