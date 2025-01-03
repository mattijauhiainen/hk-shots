import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const config = {};
  if (mode === "production") {
    return {
      ...config,
      base: "/hk-shots/",
      define: {
        "process.env.URL_PATH_SUFFIX": JSON.stringify("hk-shots"),
      },
    };
  }
  return config;
});
