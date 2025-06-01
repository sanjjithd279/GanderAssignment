# Empty Leg Optimizer

## Overview

The Empty Leg Optimizer is a Next.js application designed to help users optimize aircraft routes by identifying potential detour opportunities. It allows users to register aircraft, view current routes, and discover efficient flight paths to reduce empty leg flights.

## Features

- **User Authentication**: Secure sign-in and sign-up functionality.
- **Aircraft Management**: Register and manage aircraft with their routes.
- **Route Visualization**: View current routes and potential detour opportunities.
- **Responsive Design**: Modern UI with a responsive layout for various devices.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (for authentication and database)
- **Deployment**: Vercel

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account for backend services

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/empty-leg-optimizer.git
cd empty-leg-optimizer
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

### Deploying to Vercel

1. **Push to GitHub**: Ensure your code is pushed to a GitHub repository.
2. **Connect to Vercel**: Log in to [Vercel](https://vercel.com) and import your GitHub repository.
3. **Configure Environment Variables**: Add your Supabase URL and anon key in the Vercel project settings.
4. **Deploy**: Vercel will automatically deploy your application. You can also trigger a manual deployment using:
   ```bash
   vercel --prod
   ```

## Live Demo

The application is currently deployed and can be accessed at: [Empty Leg Optimizer](https://empty-leg-optimizer-dbn8uoyqz-sanjjith-dineshkumars-projects.vercel.app/)
