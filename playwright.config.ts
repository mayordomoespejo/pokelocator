import { defineConfig, devices } from "@playwright/test";

// All app routes are under [locale]; e2e use one locale so paths like /pokemon/25 resolve to /es/pokemon/25
const E2E_BASE_URL = "http://localhost:3000/es";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: E2E_BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 14"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: E2E_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
