import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated files and vendored dependencies:
    ".open-next/**",
    ".wrangler/**",
    ".claude/worktrees/**",
    "public/jsQR.js",
    "public/model-viewer.min.js",
  ]),
]);

export default eslintConfig;
