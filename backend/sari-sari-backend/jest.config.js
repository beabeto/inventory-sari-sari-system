/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: './src',               // points to your source code folder
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest'],
  },
  testMatch: ['**/*.spec.ts'],    // run all .spec.ts files
  moduleFileExtensions: ['ts', 'js', 'json'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};