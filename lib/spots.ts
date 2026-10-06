/** お気に入り・メモで参照するスポットの基本情報 (マップのピンと id を揃える) */
export type SpotInfo = {
  id: number;
  name: string;
  category: string;
};

export const SPOTS: readonly SpotInfo[] = [
  { id: 1, name: "7号館", category: "研究室" },
  { id: 2, name: "図書館", category: "自習室" },
  { id: 3, name: "メインWC", category: "トイレ" },
];
