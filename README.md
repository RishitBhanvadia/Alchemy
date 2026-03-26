# 🧪 Alchemistry - Virtual Chemistry Laboratory

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A cutting-edge web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments in a 3D environment.

## ✨ Features

- 🔬 **Interactive 3D Lab**: Realistic chemistry simulations using Three.js
- 🧪 **Multiple Experiment Types**: Organic, Inorganic, and Titration modules
- 📊 **Real-time Results**: Instant feedback on chemical reactions
- 📈 **Experiment History**: Track and review past experiments
- 🎨 **Modern UI**: Glassmorphism design with smooth animations
- 🔐 **Secure Authentication**: Supabase-powered user management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/alchemistry.git
cd alchemistry
```

2. **Install dependencies**
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Configure environment variables**

Create `client/.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Create `server/.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
PORT=5000
```

4. **Run the application**
```bash
# Terminal 1 - Start server
cd server
npm start

# Terminal 2 - Start client
cd client
npm start
```

Visit `http://localhost:3000`

## 🧪 Available Scripts

### Client

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

### Server

- `npm start` - Start Express server

## 🏗️ Tech Stack

**Frontend**: React 18, Vite, Three.js, React Three Fiber, Framer Motion, GSAP  
**Backend**: Node.js, Express, Supabase  
**Testing**: Playwright  
**Deployment**: Vercel (client), Render (server)

## 📁 Project Structure

```
Alchemistry-master/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route pages
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Images and static files
│   ├── public/            # Public assets
│   └── vite.config.js     # Vite configuration
├── server/                # Express backend
│   ├── controllers/       # Business logic
│   ├── routes/            # API routes
│   └── server.js          # Entry point
└── README.md
```

## 🔐 Security

- Environment variables for sensitive data
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Input validation on all API endpoints
- Supabase Row Level Security (RLS)

## 🛠️ Environment Setup

To automate environment variable management and deployment checks:

1. **Install CLIs** (if you haven't already):
   - **Vercel CLI**: `npm i -g vercel`
   - **GitHub CLI**: `winget install --id GitHub.cli` (Windows) or `brew install gh` (Mac)

2. **Sync Environment Variables**:
   After cloning the repo and creating your `.env.local` file, run:
   ```bash
   npm run env:push
   ```
   This will automatically push all variables to **Vercel** (Production, Preview, Development) and **GitHub Secrets** in one command.

3. **Verify Sync Status**:
   Run the following anytime to confirm everything is in sync:
   ```bash
   npm run env:check
   ```

4. **Rules of Engagement**:
   - Whenever you add a new variable to `.env.local`, just run `npm run env:push`.
   - Before pushing major changes, run `npm run env:verify` to check sync and build locally.

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 👨‍💻 Author

**Rishit Bhanvadia**  
Diploma Major Project - Parul University

## 🙏 Acknowledgments

- Three.js community for 3D rendering resources
- Supabase for backend infrastructure
- React Three Fiber for React-Three.js integration

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.
