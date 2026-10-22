import { apiFetch } from "./api";

export type Building = {
  id: string;
  name: string;
  marker_count: number;
};

/** GET /api/v1/buildings: 建物ごとの登録済みARマーカー数。 */
export async function getBuildings(signal?: AbortSignal): Promise<Building[]> {
  const response = await apiFetch<{ data: Building[] }>("/api/v1/buildings", {
    signal,
  });
  return response.data;
}

/** 全角数字・空白の表記揺れを吸収し、別の館と部分一致させない。 */
export function findBuilding(buildings: Building[], name: string) {
  const normalize = (value: string) =>
    value.normalize("NFKC").replace(/\s+/g, "");
  return buildings.find((building) => normalize(building.name) === normalize(name));
}
