module.exports = {
  preset: 'ts-jest',
  // testEnvironment: 'node',
  transform: {
    // '^.+\\.ts?$': 'ts-jest'
    // '^.+\\.[tj]sx?$' to process ts,js,tsx,jsx with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process ts,js,tsx,jsx,mts,mjs,mtsx,mjsx with `ts-jest`
    '^.+\\.ts?$': [
      'ts-jest',
      {
        // tsconfig: 'tsconfig.test.json'
      }
    ]
  }
  // transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$']
};
