import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      reporter: ["text", "lcov"],
      exclude: [
        "**/.sst/**",
        "**/test/**",
        "**/eslint.config.js",
        "**/sst.config.ts",
        "**/vitest.config.ts",
        "**/sst-env.d.ts",
      ],
    },
  },
});
