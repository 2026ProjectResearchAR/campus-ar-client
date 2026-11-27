// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// 全ページ静的生成で ISR を使っていないため、R2 のインクリメンタルキャッシュは使わない
export default defineCloudflareConfig({});
