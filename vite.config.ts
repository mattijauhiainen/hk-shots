import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const config = {};
  if (mode === "production") {
    return {
      ...config,
      base: "/hk-shots/",
    };
  }
  return config;
});
