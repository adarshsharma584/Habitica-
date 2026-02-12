# Habitica AI - Engineer Your Momentum

Habitica AI is a premium, AI-powered consistency engine designed for high performers. Unlike generic habit trackers, it uses **Neural Adaptation AI** to build routines that evolve with your performance patterns, energy levels, and schedule.


## 🚀 Core Features

- **Context-Aware AI Architect**: Analyzes your performance and builds the perfect roadmap using GPT-4o and custom neural mapping.
- **Dopamine Engineering**: Gamified streaks and visual momentum feedback to make discipline feel like a game.
- **Neural Routine Science**: Adaptive difficulty that prevents "Burnout Loops" by adjusting goals based on real-time life stressors.
- **Elite Analytics**: Military-grade data visualization to quantify your discipline and routine retention.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 19 + Vite
- **State Management**: Redux Toolkit
- **Backend-as-a-Service**: Supabase
- **Styling**: Tailwind CSS (v4)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Visualization**: Recharts & React Flow

### Backend (Server)
- **Runtime**: Node.js + Express
- **AI Orchestration**: LangChain
- **AI Engines**: Groq SDK & OpenAI
- **Search**: Tavily Core
- **Environment**: Dotenv

## 📂 Project Structure

```text
Habitica/
├── client/              # Vite + React Frontend
│   ├── src/
│   │   ├── components/  # UI & Layout components
│   │   ├── pages/       # Page views (Landing, AI Planner, Dashboard, etc.)
│   │   ├── store/       # Redux state management
│   │   └── lib/         # Supabase client & utilities
├── server/              # Node.js + Express + LangChain Backend
│   ├── index.js         # Entry point
│   ├── routes/          # API endpoints
│   └── controllers/     # AI Agent logic
└── README.md            # You are here
```

## 🚥 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/adarshsharma584/Habitica-.git
   cd Habitica
   ```

2. **Setup Server**:
   ```bash
   cd server
   npm install
   # Create a .env file with your API keys (GROQ_API_KEY, OPENAI_API_KEY, TAVILY_API_KEY)
   npm run dev
   ```

3. **Setup Client**:
   ```bash
   cd ../client
   npm install
   # Add your Supabase credentials to .env.local
   npm run dev
   ```

## 🛡️ License

© 2026 Habitica Consistency Engine. All rights reserved.
