# Welcome to Daytrps Fullstack Development Project

## Project Overview

**Description**: A comprehensive fullstack development project for Daytrps, featuring both frontend and backend components to create a seamless travel experience platform.

## How to Work with This Codebase

There are several approaches to working with this application.

**Local Development Setup**

To work locally with your preferred IDE, follow these steps:

```sh
# Step 1: Clone the repository
git clone <DAYTRPS_REPO_URL>

# Step 2: Navigate to the project directory
cd daytrps-fullstack

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

**Backend Development**

The backend is built with:
- Node.js
- Express
- MongoDB
- Authentication middleware

To run the backend separately:

```sh
cd server
npm install
npm run dev
```

**Frontend Development**

The frontend utilizes:
- React
- TypeScript
- Redux for state management
- Tailwind CSS
- shadcn-ui components

## Technology Stack

This fullstack project combines:

- Frontend:
  - React
  - TypeScript
  - Redux
  - Tailwind CSS
  - shadcn-ui
  - Vite build system

- Backend:
  - Node.js/Express
  - MongoDB
  - RESTful API architecture
  - JWT authentication

## Deployment Process

For deployment:

1. Build the frontend: `npm run build`
2. Set up environment variables for production
3. Deploy the backend to your preferred hosting service
4. Connect to your MongoDB instance in production

## Using Custom Domains

To deploy Daytrps under your own domain:

1. Purchase a domain from a registrar like Namecheap or GoDaddy
2. Set up DNS records pointing to your hosting service
3. Configure SSL certificates for secure connections
4. Update your environment variables with the new domain information
