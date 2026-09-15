import { defineConfig } from "tsup";

export default defineConfig([
  {
    // library: esm + cjs + types
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    target: "es2022",
  },
  {
    // cli: node bundle with shebang, built after the library (no clean)
    entry: ["src/cli.ts"],
    format: ["esm"],
    platform: "node",
    target: "node18",
    sourcemap: true,
    banner: { js: "#!/usr/bin/env node" },
  },
]);
