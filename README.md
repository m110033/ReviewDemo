# Local Development Guide

## Prerequisites
- Node.js >= 20.x
- NPM >= 9.x
- MongoDB >= 6.x

## Environment Setup
1. Clone the repository
    ```bash
    git clone https://github.com/m110033/cirrusAssignment.git
    cd cirrusAssignment
    ```

2. Create `.env` file in root directory with following content:
    ```env
    # Frontend
    PORT="3000"
    NEXT_PUBLIC_API_URL="http://localhost:4000"

    # Backend
    BACKEND_PORT="4000"
    FRONTEND_URL="http://localhost:3000"
    MONGODB_URI="mongodb://127.0.0.1:27017/performance-review"
    JWT_SECRET="abcd1234"
    NODE_OPTIONS="--max-old-space-size=8192"
    ```

## Backend Setup (/apps/api)
1. Navigate to API directory
    ```bash
    cd apps/api
    ```

2. Install dependencies
    ```bash
    npm install
    ```

3. Start MongoDB service
    - macOS (Homebrew):
        ```bash
        brew services start mongodb-community
        ```
    - Windows:
        ```bash
        net start MongoDB
        ```
    - Linux:
        ```bash
        sudo systemctl start mongod
        ```

4. Start development server
    ```bash
    npm run dev
    ```

The API server will be running at `http://localhost:4000`

## Frontend Setup (/apps/web)
1. Navigate to web directory
    ```bash
    cd apps/web
    ```

2. Install dependencies
    ```bash
    npm install
    ```

3. Start development server
    ```bash
    npm run dev
    ```

The web application will be running at `http://localhost:3000`

## Running Full Stack (Recommended)
From the root directory:

1. Install all dependencies
    ```bash
    npm install
    ```

2. Start all services
    ```bash
    npm run dev
    ```

This will start both frontend and backend services using Turborepo.

## Tech Stack
- Frontend: Next.js, TypeScript
- Backend: NestJS, TypeScript
- Database: MongoDB
- Build Tool: npm, turborepo

## Project Structure
    cirrusAssignment/
    ├── apps/
    │   ├── api/         # NestJS backend
    │   └── web/         # Next.js frontend
    ├── package.json
    └── turbo.json
