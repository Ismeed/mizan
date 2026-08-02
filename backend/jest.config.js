/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/__tests__'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@mizan/shared$': '<rootDir>/../packages/shared/src/index.ts',
    '^@mizan/shared/(.*)$': '<rootDir>/../packages/shared/src/$1',
  },
  testMatch: ['**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
