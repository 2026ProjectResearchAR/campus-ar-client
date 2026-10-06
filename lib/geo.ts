/**
 * 緯度経度 -> マップ画像 (public/seta_b_l_2026.jpg, 1200x900) 上の % 座標への変換。
 *
 * 基準点 (緯度経度と画像上の % 位置の対応) から 2D アフィン変換を求める。
 * キャリブレーションは MAP_CONTROL_POINTS の値を実測値に書き換えるだけでよい。
 * 画像は北が上であることを前提とする。基準点は互いに一直線上にならない 3 点を指定する。
 */

export type LatLng = { lat: number; lng: number };
/** 画像左上を (0, 0)、右下を (100, 100) とした % 座標 */
export type MapPercent = { x: number; y: number };
export type ControlPoint = { geo: LatLng; map: MapPercent };

// TODO: 実測値で要キャリブレーション
// 現状は瀬田キャンパス (約 34.964N, 135.940E) 付近を、東西約 820m x 南北約 615m と
// 仮定した暫定値。現地で GPS 値と画像上の位置を測って差し替えること。
export const MAP_CONTROL_POINTS: [ControlPoint, ControlPoint, ControlPoint] = [
  { geo: { lat: 34.96625, lng: 135.9364 }, map: { x: 10, y: 10 } },
  { geo: { lat: 34.96625, lng: 135.9436 }, map: { x: 90, y: 10 } },
  { geo: { lat: 34.96185, lng: 135.9364 }, map: { x: 10, y: 90 } },
];

type Affine = { a: number; b: number; c: number; d: number; e: number; f: number };

function det3(m: number[][]): number {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}

/** x = a*lng + b*lat + c, y = d*lng + e*lat + f を 3 点から解く (クラメルの公式) */
export function solveAffine(points: readonly ControlPoint[]): Affine {
  const rows = points.map((p) => [p.geo.lng, p.geo.lat, 1]);
  const D = det3(rows);
  if (Math.abs(D) < 1e-18) {
    throw new Error("基準点が一直線上にあるため変換を求められません");
  }
  const solve = (values: number[]) => {
    const col = (i: number) =>
      det3(rows.map((r, k) => r.map((v, j) => (j === i ? values[k] : v)))) / D;
    return [col(0), col(1), col(2)] as const;
  };
  const [a, b, c] = solve(points.map((p) => p.map.x));
  const [d, e, f] = solve(points.map((p) => p.map.y));
  return { a, b, c, d, e, f };
}

const AFFINE = solveAffine(MAP_CONTROL_POINTS);

/** 緯度経度をマップ画像上の % 座標へ変換する (範囲外でもクランプしない) */
export function latLngToMapPercent(
  { lat, lng }: LatLng,
  affine: Affine = AFFINE,
): MapPercent {
  return {
    x: affine.a * lng + affine.b * lat + affine.c,
    y: affine.d * lng + affine.e * lat + affine.f,
  };
}

/** % 座標がマップ画像内に収まっているか */
export function isInsideMap({ x, y }: MapPercent): boolean {
  return x >= 0 && x <= 100 && y >= 0 && y <= 100;
}

/** メートルが画像の横幅の何 % に当たるか (精度円の半径換算用) */
export function metersToMapPercentX(meters: number): number {
  const [p1, p2] = MAP_CONTROL_POINTS;
  const metersPerDegLng = 111320 * Math.cos((p1.geo.lat * Math.PI) / 180);
  const dxMeters = Math.abs(p2.geo.lng - p1.geo.lng) * metersPerDegLng;
  const dxPercent = Math.abs(p2.map.x - p1.map.x);
  return (meters / dxMeters) * dxPercent;
}
