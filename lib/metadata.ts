import type { Metadata } from "next";

const SITE_NAME = "ARCloud";
const SITE_TITLE = "ARCloud（あるくろーど）";
const SITE_DESCRIPTION =
  "ARCloud（あるくろーど）は、龍谷大学 瀬田キャンパスを歩いて巡るオープンキャンパス向けARガイドです。マップで施設を探し、ARマーカーを読み取って、スタンプを集められます。";

const commonOpenGraph = {
  type: "website",
  siteName: SITE_NAME,
  locale: "ja_JP",
} as const;

export const siteMetadata: Metadata = {
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_TITLE} | キャンパスARガイド`,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  appleWebApp: { title: SITE_NAME },
  openGraph: {
    ...commonOpenGraph,
    title: `${SITE_TITLE} | キャンパスARガイド`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: `${SITE_TITLE} | キャンパスARガイド`,
    description: SITE_DESCRIPTION,
  },
};

/** タブと共有プレビューで、画面名・ブランド名・説明をそろえる。 */
export function createPageMetadata(title: string, description: string): Metadata {
  const fullTitle = `${title} | ${SITE_TITLE}`;
  return {
    title,
    description,
    openGraph: { ...commonOpenGraph, title: fullTitle, description },
    twitter: { card: "summary", title: fullTitle, description },
  };
}
