# Express Server

A clean, production-ready Express.js REST API server with a built-in live dashboard.

## Folder Structure

```
Express Server/
├── controllers/
│   └── apiController.js      # Route handlers
├── middleware/
│   ├── errorMiddleware.js     # Global error handler
│   └── loggerMiddleware.js    # Request logger (colored, with duration)
├── routes/
│   └── apiRoutes.js           # API route definitions
├── utils/
│   └── responseHandler.js     # Unified JSON response helper
├── public/
│   ├── index.html             # Live dashboard (served at /)
│   └── 404.html               # Beautiful 404 page
├── .env.example
├── package.json
└── server.js                  # Entry point
```

## Setup

```bash
npm install
cp .env.example .env
npm run dev     # development (nodemon)
npm start       # production
```

## API Endpoints

| Method | Route          | Description              |
|--------|----------------|--------------------------|
| GET    | /              | Dashboard UI             |
| GET    | /api/health    | Health check + uptime    |
| GET    | /api/info      | Server info + env        |
| GET    | /api/users     | All mock users           |
| GET    | /api/users/:id | Single user by ID        |

Any unknown route → beautiful 404 HTML page (or JSON if API/browser requests JSON).