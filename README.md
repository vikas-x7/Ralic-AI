# Relic AI

> **A canvas-based AI thinking space where your ideas live as nodes, branch freely, and never get lost.**

Relic AI is a visual, node-based workspace that rethinks how we interact with AI. Instead of traditional linear chat threads, Relic AI allows your conversations and thoughts to branch out visually on an infinite canvas. Brainstorm, research deeply, and map out complex ideas without losing context.

<img src= "https://www.vikaspal.me/_next/image?url=%2Fimage%2Fprojects%2Frelicai.png&w=1080&q=75">

## Key Features

- Visual AI Workspace
- Branching Conversations
- Multi-Model Support
- Infinite Context Retention
- Rich Node Interactions
- Secure & SEO Optimized

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Canvas/Graph Engine:** [React Flow / XYFlow](https://reactflow.dev/)
- **API & Data Fetching:** [tRPC](https://trpc.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Styling:** Tailwind CSS & Vanilla CSS
- **Icons:** React Icons & SVG Assets

## Getting Started

Follow these steps to set up the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/vikas-x7/Relic-AI.git
cd "relic ai"
```

### 2. Install dependencies

This project uses `bun` as its package manager:

```bash
bun install
```

### 3. Set up Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
DATABASE_URL=

AUTH_SECRET=
NEXTAUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

NVIDIA_API_KEY=
MEM0_API_KEY=
```

### 4. Setup the Database

Generate the Prisma client and run migrations to initialize your database schema:

```bash
bunx --bun prisma migrate dev --name init
bunx --bun prisma generate
```

### 5. Run the Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The canvas workspace will be available once logged in.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/vikas-x7/Relic-AI/issues).

## License

This project is proprietary. Please check the [LICENSE](LICENSE) file for more details.
