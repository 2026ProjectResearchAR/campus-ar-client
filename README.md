# Campus AR Client

龍谷大学 瀬田キャンパス向けのキャンパスAR案内アプリのフロントエンドです。
キャンパスマップ、ARスキャン、マイページの各画面を、スマートフォンでの利用を想定したモバイルファーストのUIで提供します。

## 技術スタック

- [Next.js](https://nextjs.org) 16 (App Router)
- React 19 / TypeScript 5
- Tailwind CSS 4
- react-icons
- AR表示: [A-Frame](https://aframe.io/) + [AR.js](https://ar-js-org.github.io/AR.js-Docs/)（`public/ArScanner.html`）

> 本リポジトリの Next.js は 16 系で、従来のバージョンから破壊的変更があります。実装前に `node_modules/next/dist/docs/` を参照してください（詳細は `AGENTS.md`）。

## セットアップ

Node.js (20 以上推奨) と npm が必要です。

```bash
npm ci
cp .env.example .env.local   # 環境変数を設定（後述）
npm run dev
```

ブラウザで <http://localhost:3000> を開きます。

その他のコマンド:

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | ビルド済みアプリの起動 |
| `npm run lint` | ESLint 実行 |
| `npx tsc --noEmit` | 型チェック |

## 環境変数

| 変数名 | 内容 | 例 |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | campus-ar-api のベースURL | `http://localhost:8787` |

`.env.example` をコピーして `.env.local` を作成し、値を設定してください。`.env.local` はコミットしないでください。
`NEXT_PUBLIC_` で始まる変数はブラウザに公開されるため、秘密情報は入れないでください。
本番ビルド（Cloudflare Workers へのデプロイ含む）では、コミット済みの `.env.production` の値がビルド時に JS へ埋め込まれます。

## バックエンド (campus-ar-api) との関係

データ取得は別リポジトリの **campus-ar-api**（[Hono](https://hono.dev/) / Cloudflare Workers）を利用します。
クライアントは `NEXT_PUBLIC_API_BASE_URL` で指定したURLに対して API を呼び出します。

ローカルで API を起動する手順（campus-ar-api リポジトリ側）:

```bash
cd ../campus-ar-api
npm install
npm run dev   # wrangler dev。既定で http://localhost:8787
```

起動後、`.env.local` の `NEXT_PUBLIC_API_BASE_URL` を `http://localhost:8787` にします。
API の詳細は campus-ar-api の README と `docs/` を参照してください。

## スマートフォン実機でカメラを使う場合

ブラウザのカメラ (`getUserMedia`) は HTTPS（または localhost）でのみ利用できます。
スマホ実機から PC の開発サーバーへ `http://<PCのIP>:3000` でアクセスするとカメラが使えないため、HTTPS で起動してください。

```bash
npx next dev --experimental-https
# または
npm run dev -- --experimental-https
```

自己署名証明書が生成され、`https://localhost:3000` で起動します。
スマホからは `https://<PCのIP>:3000` にアクセスし、証明書の警告を許可してください（PCとスマホは同一ネットワークに接続）。
`--experimental-https-key` / `--experimental-https-cert` で独自の証明書も指定できます。
ARスキャン画面は iframe に `allow="camera;"` を付けて `public/ArScanner.html` を読み込んでいます。

## ディレクトリ構成

```
.
├── app/
│   ├── layout.tsx        # ルートレイアウト（html lang, 共通 metadata, NavBar）
│   ├── page.tsx          # トップページ
│   ├── globals.css       # グローバルスタイル / Tailwind
│   └── screen/
│       ├── layout.tsx    # 各画面共通の枠（TabBar を含む）
│       ├── map/          # キャンパスマップ画面
│       ├── scan/         # ARスキャン画面（public/ArScanner.html を iframe で表示）
│       └── mypage/       # マイページ
├── componets/            # 共通コンポーネント（NavBar, TabBar）
├── public/
│   ├── ArScanner.html    # A-Frame + AR.js によるARスキャナ
│   └── *.png / *.jpg     # ロゴ・キャンパス画像など
├── AGENTS.md / CLAUDE.md # AI エージェント向けの指示
└── next.config.ts
```

注: ディレクトリ名 `componets` は現状の綴りのままです。
