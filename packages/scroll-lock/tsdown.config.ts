import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.ts",
  exports: { devExports: true },
  format: ["cjs", "esm"],
});
