module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  testMatch: ['**/*.test.tsx'], // finds your Login.test.tsx

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};