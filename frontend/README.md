# Frontend - Task Management Application

The frontend of our task management application built with React and TypeScript.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run lint` - Runs the linter
- `npm run format` - Formats code using Prettier

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   ├── assets/
│   ├── styles/
│   └── App.tsx
├── package.json
└── tsconfig.json
```

## Key Features

- Modern React with Hooks and Functional Components
- TypeScript for type safety
- State Management with Redux/Context
- Material-UI/Tailwind CSS for styling
- Responsive design
- Form handling with React Hook Form
- API integration with Axios
- Unit testing with Jest and React Testing Library

## Code Style

- We use ESLint for linting
- Prettier for code formatting
- TypeScript strict mode enabled
- Component-based architecture
- Custom hooks for reusable logic

## Best Practices

- Use functional components with hooks
- Implement proper TypeScript types
- Follow component composition patterns
- Maintain proper file and folder structure
- Write unit tests for components
- Use proper error handling
- Implement loading states
- Follow accessibility guidelines

## Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## Contributing

Please read the main README.md file in the root directory for contribution guidelines.

## Learn More

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Material-UI Documentation](https://material-ui.com/)
- [Redux Documentation](https://redux.js.org/)
