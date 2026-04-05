import { getBuildings } from '@/features/buildings/api/getBuildings';

export async function getMapPoints() {
  const buildings = await getBuildings();
  return buildings.map((building) => ({
    id: building.id,
    name: building.name,
    latitude: building.latitude,
    longitude: building.longitude
  }));
}
