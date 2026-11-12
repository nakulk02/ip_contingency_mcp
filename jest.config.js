export default {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    // Tests run as CommonJS and are transpiled without type-checking
    // (`npm run type-check` covers types). This keeps ESM-only syntax in the
    // runtime sources, and package `exports` maps, from tripping ts-jest.
    "^.+\\.ts$": [
      "ts-jest",
      { tsconfig: { module: "commonjs", moduleResolution: "node", isolatedModules: true } },
    ],
  },
  moduleNameMapper: {
    // logger.ts uses import.meta, which CommonJS can't parse; tests use a silent stub.
    "^(\\.{1,2}/.*)?logger\\.js$": "<rootDir>/src/utils/__test-helpers__/logger.ts",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/index.ts",
    "!src/server.ts",
    "!src/utils/logger.ts",
    "!src/**/__tests__/**",
    "!src/**/__test-helpers__/**",
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
