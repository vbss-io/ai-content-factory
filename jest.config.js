const defaultConfig = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@api/(.*)$': '<rootDir>/src/@api/$1',
    '^@cron/(.*)$': '<rootDir>/src/@cron/$1'
  }
}

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testTimeout: 50000,
  projects: [
    {
      displayName: 'Auth',
      testMatch: ['<rootDir>/src/auth/**/*.test.ts'],
      ...defaultConfig
    },
    {
      displayName: 'Batch',
      testMatch: ['<rootDir>/src/batch/**/*.test.ts'],
      ...defaultConfig
    },
    {
      displayName: 'Image',
      testMatch: ['<rootDir>/src/image/**/*.test.ts'],
      ...defaultConfig
    },
    {
      displayName: 'Prompt',
      testMatch: ['<rootDir>/src/prompt/**/*.test.ts'],
      ...defaultConfig
    },
    {
      displayName: 'User',
      testMatch: ['<rootDir>/src/user/**/*.test.ts'],
      ...defaultConfig
    },
    {
      displayName: 'Video',
      testMatch: ['<rootDir>/src/video/**/*.test.ts'],
      ...defaultConfig
    }
  ]
}
