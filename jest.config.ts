/* eslint-disable prettier/prettier */
import type { Config } from 'jest';

const config: Config = {
  coverageThreshold: {
    global: {
      functions: 40,
      lines: 40,
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleDirectories: ['node_modules', 'src'],
  rootDir: './', // ***** CHANGE "rootDir": "src" to "rootDir": "./"
  modulePaths: ['<rootDir>'], // ***** ADD "modulePaths": ['<rootDir>'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/dist/'],
};

export default config;
