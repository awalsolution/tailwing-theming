import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/lib/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  rootDir: '.',
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['lib/**/*.ts', '!lib/main.ts', '!lib/types/*.ts', '!lib/utils/**/*.ts', '!lib/config/**/*.ts'],
  coverageDirectory: '<rootDir>/coverage',
}

export default config
