# Project-D-Plan-D

## Backend

### Commands:

- `npm run start`: Runs the server directly with TypeScript.
- `npm run dev`: Runs with auto-restart during development.
- `npm run build`: Compiles TypeScript to JavaScript in the dist folder. -- not important
- `npm run serve`: Runs the compiled JavaScript. -- not important

### Folder structure

```plaintext
Backend/
│── dist/                               # Compiled TypeScript output (Ignore this)
│── node_modules/                       # Dependencies (Ignore this)
│── prisma/                             # Database schema and migrations
│   ├── migrations/                     # Database migrations
│   │   ├── 0_init/
│   │   │   ├── migration.sql  
│   ├── schema.prisma                   # Prisma schema
│── src/                                # Source code
│   ├── controllers/                    # Controllers (handles request/routes logic)
│   │   ├── touchpointsController.ts
│   ├── models/                         # Database models (define Prisma schemas)
│   │   ├── touchpointsModel.ts
│   ├── routes/                         # API route definitions
│   │   ├── touchpointsRoutes.ts
│   ├── middlewares/                    # Fastify middlewares (authentication, logging, etc.)
│   ├── index.ts                        # Main entry point
│── .env                                # Environment variables
│── .env.example                        # Example env file
│── package.json                        # Dependencies and scripts
│── package-lock.json                   # Dependency lock file (Ignore this)
│── tsconfig.json                       # TypeScript configuration (Ignore this)
```

## Frontend

### Commands:

- `npm run dev`: Runs development server.
- `npm run build`: Builds the production-ready optimized and minified version of the app. -- not important
- `npm run lint`: Checks for syntax errors and enforces coding style rules. -- not important
- `npm run preview`: Runs a local preview of the production-ready build for testing before deployment. -- not important

test
