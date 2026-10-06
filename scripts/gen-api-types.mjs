// campus-ar-api の OpenAPI スキーマから lib/api-schema.d.ts を生成する。
//
// 使い方:
//   npm run gen:api-types                      # ${NEXT_PUBLIC_API_BASE_URL}/openapi.json から生成
//   npm run gen:api-types -- <URL またはファイルパス>  # 入力を明示的に指定
//
// NEXT_PUBLIC_API_BASE_URL は環境変数、なければ .env.local / .env から読む。
// どちらも無ければ http://localhost:8787 (wrangler dev の既定) を使う。
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function readEnvFile(file) {
  if (!existsSync(file)) return {};
  const env = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    if (line.trimStart().startsWith("#")) continue;
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^(["'])(.*)\1$/, "$2");
  }
  return env;
}

const base =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  readEnvFile(".env.local").NEXT_PUBLIC_API_BASE_URL ??
  readEnvFile(".env").NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8787";

const input = process.argv[2] ?? `${base.replace(/\/+$/, "")}/openapi.json`;
const output = "lib/api-schema.d.ts";

console.log(`OpenAPI: ${input} -> ${output}`);
const r = spawnSync("npx", ["openapi-typescript", input, "-o", output], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(r.status ?? 1);
