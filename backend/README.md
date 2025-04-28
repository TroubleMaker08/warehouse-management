# Backend - Task Management Application

The backend API server for the task management application built with Node.js and Express.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB/PostgreSQL installed locally or a cloud instance

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Start the server:
```bash
npm start
# or
yarn start
```

The API will be available at `http://localhost:5000`

## Available Scripts

- `npm start` - Starts the server in production mode
- `npm run dev` - Starts the server in development mode with nodemon
- `npm test` - Runs the test suite
- `npm run lint` - Runs the linter
- `npm run build` - Transpiles TypeScript to JavaScript

## Project Structure

```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.ts
├── tests/
├── package.json
└── tsconfig.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Database

We use MongoDB/PostgreSQL as our database. The connection is managed through Mongoose/Sequelize ORM.

### Models

- User
- Task
- Category
- Tag

## Authentication

- JWT-based authentication
- Password hashing with bcrypt
- Token refresh mechanism
- Role-based access control

## Error Handling

We use a centralized error handling mechanism:
- Custom error classes
- Error middleware
- Structured error responses

## Validation

- Request validation using Joi/express-validator
- Data sanitization
- Input validation middleware

## Testing

- Jest for unit testing
- Supertest for integration testing
- Test coverage reports

## Security Features

- CORS configuration
- Rate limiting
- Helmet security headers
- XSS protection
- SQL/NoSQL injection prevention

## Logging

- Winston logger implementation
- Request logging
- Error logging
- Performance monitoring

## Contributing

Please read the main README.md file in the root directory for contribution guidelines.

## API Documentation

API documentation is available at `/api-docs` when running the server (Swagger/OpenAPI). 