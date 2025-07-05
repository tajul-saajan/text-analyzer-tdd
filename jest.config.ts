import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',  // Use ts-jest to handle TypeScript files
  testEnvironment: 'node',  // Set test environment to Node.js
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',  // Use your existing tsconfig
    },
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',  // Transform TypeScript files using ts-jest
  },
  moduleNameMapper: {
    // Map the paths in your tsconfig.json to Jest module paths
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@config$': '<rootDir>/src/config/index.ts',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@dtos/(.*)$': '<rootDir>/src/dtos/$1',
    '^@exceptions/(.*)$': '<rootDir>/src/exceptions/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],  // Ignore node_modules and dist
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],  // Optional setup file
  collectCoverage: true,  // Enable test coverage collection (optional)
};

export default config;
