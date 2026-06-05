import { defineConfig } from "vitest/config";

export default defineConfig({
        test: {
                globals: true,
                environment: "node",
                include: ["**/*.test.ts"],
                setupFiles: ["./src/__tests__/setup.ts"],
                maxWorkers: 1,
                isolate: false,
        },
});
