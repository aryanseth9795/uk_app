import { defineConfig } from "vitest/config";
import path from "path";

const src = (p: string) => path.resolve(__dirname, "src", p);

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    // Only pure logic is unit-tested here — screens need a React Native
    // renderer, which is a separate setup.
    include: ["src/utils/**/*.test.ts", "src/services/**/*.test.ts"],
  },
  // Must mirror the tsconfig/babel path aliases or every "@api/..." import fails.
  resolve: {
    alias: {
      "@nav": src("navigation"),
      "@screens": src("screens"),
      "@components": src("components"),
      "@store": src("store"),
      "@utils": src("utils"),
      "@theme": src("theme"),
      "@services": src("services"),
      "@hooks": src("hooks"),
      "@assets": src("assets"),
      "@api": src("api"),
      "@context": src("context"),
      "@": src(""),
    },
  },
});
