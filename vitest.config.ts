import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts", "skills/*/tests/**/*.test.ts"],
    exclude: ["**/node_modules/**", "skills/*-workspace/**"],
  },
});
