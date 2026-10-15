import type { Request, Response } from 'express';

const OVERPASS_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];
const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { expiresAt: number; cinemas: Cinema[] }>();

interface Cinema {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const deltaLat = radians(lat2 - lat1);
  const deltaLon = radians(lon2 - lon1);
  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(deltaLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function cinemaAddress(tags: Record<string, string>) {
  if (tags['addr:full']) return tags['addr:full'];
  return [
    [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(', '),
    tags['addr:suburb'],
    tags['addr:city'] ?? tags['addr:town'] ?? tags['addr:village'],
  ].filter(Boolean).join(' · ') || 'Endereço não informado no OpenStreetMap';
}

export async function getNearbyCinemas(req: Request, res: Response) {
  const latitude = Number(req.query.lat);
  const longitude = Number(req.query.lng);
  const radius = req.query.radius === undefined ? 10000 : Number(req.query.radius);

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90
    || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return res.status(400).json({ error: 'Informe latitude e longitude válidas.' });
  }
  if (!Number.isInteger(radius) || radius < 1000 || radius > 25000) {
    return res.status(400).json({ error: 'O raio deve estar entre 1 e 25 km.' });
  }

  const cacheKey = `${latitude.toFixed(3)}:${longitude.toFixed(3)}:${radius}`;
  const forceRefresh = req.query.refresh === 'true';
  const cached = cache.get(cacheKey);
  if (!forceRefresh && cached && cached.expiresAt > Date.now()) return res.json({ results: cached.cinemas, source: 'OpenStreetMap' });

  const query = `[out:json][timeout:20];(node[amenity=cinema](around:${radius},${latitude},${longitude});way[amenity=cinema](around:${radius},${latitude},${longitude});relation[amenity=cinema](around:${radius},${latitude},${longitude}););out center tags;`;

  try {
    let data: { elements?: OverpassElement[] } | null = null;
    let lastError: unknown;
    for (const endpoint of OVERPASS_URLS) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'User-Agent': 'MovieHub/1.0 (https://github.com/Flavio721/projeto_mobile)',
          },
          body: new URLSearchParams({ data: query }),
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) throw new Error(`Overpass respondeu ${response.status}`);
        data = await response.json() as { elements?: OverpassElement[] };
        break;
      } catch (error) {
        lastError = error;
        console.warn(`Instância Overpass indisponível (${new URL(endpoint).host}):`, error);
      }
    }
    if (!data) throw lastError ?? new Error('Nenhuma instância Overpass respondeu.');

    const cinemas = (data.elements ?? []).flatMap((element): Cinema[] => {
      const tags = element.tags ?? {};
      const name = tags.name?.trim();
      const point = element.lat !== undefined && element.lon !== undefined
        ? { latitude: element.lat, longitude: element.lon }
        : element.center
          ? { latitude: element.center.lat, longitude: element.center.lon }
          : null;
      if (!name || !point) return [];
      return [{
        id: `${element.type}/${element.id}`,
        name,
        address: cinemaAddress(tags),
        ...point,
        distanceKm: distanceKm(latitude, longitude, point.latitude, point.longitude),
      }];
    }).sort((a, b) => a.distanceKm - b.distanceKm);

    for (const [key, entry] of cache) {
      if (entry.expiresAt <= Date.now()) cache.delete(key);
    }
    if (cache.size >= 300) cache.delete(cache.keys().next().value!);
    cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, cinemas });
    return res.json({ results: cinemas, source: 'OpenStreetMap' });
  } catch (error) {
    console.error('Falha ao consultar cinemas no OpenStreetMap:', error);
    return res.status(502).json({ error: 'Não foi possível consultar cinemas agora. Tente novamente em instantes.' });
  }
}
