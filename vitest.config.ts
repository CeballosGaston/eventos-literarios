import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // @ts-expect-error - Algunas versiones de vitest tienen conflicto con 'all' pero funciona igual
      all: true,
      include: ["features/**", "shared/**"],
      exclude: [
        "node_modules/**",
        "**/ReactQueryProvider.tsx",
        "**/*.d.ts",
        "**/supabaseClient.ts",
        "**/Navbar.tsx",
        "**/EventCard.tsx",
        "**/EventForm.tsx",
        "features/events/types.ts",
      ],
    },
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
