import { apiFetch } from "./api";

export type EnvironmentReading = {
  id: string;
  location_id: string;
  co2_ppm: number;
  occupancy: number;
  status: "crowded" | "moderate" | "vacant";
  recorded_at: string;
  created_at: string;
};

export async function getLatestReading(locationId: string, signal?: AbortSignal) {
  const query = new URLSearchParams({ location_id: locationId });
  const { data } = await apiFetch<{ data: EnvironmentReading | null }>(
    `/api/v1/sensors/readings/latest?${query}`,
    { signal, cache: "no-store" },
  );
  return data;
}

/** マップの表示用連番ではなく、建物APIのIDをセンサのlocation_idとして使う。 */
export async function findSensorLocation(buildingName: string, signal?: AbortSignal) {
  const { data } = await apiFetch<{ data: { id: string; name: string }[] }>(
    "/api/v1/buildings", { signal },
  );
  return data.find((building) => building.name === buildingName)?.id ?? null;
}
