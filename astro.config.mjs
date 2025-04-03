// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@tailwindcss/vite";
import solid from "@astrojs/solid-js";

export default defineConfig({
  site: "https://c0reme.github.io",
  base: "blu-e12s-quiz",
  vite: { plugins: [tailwind()] },
  integrations: [solid()],
});
