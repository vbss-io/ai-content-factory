/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testMatch: ['**/*.test.ts'],
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@api/(.*)$': '<rootDir>/src/@api/$1'
    },
    testTimeout: 50000
  }