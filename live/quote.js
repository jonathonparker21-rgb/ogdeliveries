const HUB = { lat: 32.861098, lng: -91.379714 };
const MAX_MILES = 80;
const UA = "OGDeliveries/1.0 (pickup quote; https://og-deliveries.com)";
const TOWNS = [
  "oak grove", "kilbourne", "forest", "pioneer", "epps", "goodwill",
  "lake providence", "transylvania", "sondheimer", "delhi", "rayville",
  "mangham", "start", "holly ridge", "tallulah", "richmond", "mound",
  "newellton", "st joseph", "st. joseph", "bastrop", "mer rouge", "bonita",
  "collinston", "oak ridge", "winnsboro", "baskin", "crowville", "wisner",
  "gilbert", "monroe", "west monroe", "sterlington", "swartz", "richwood",
  "farmerville", "marion", "downsville",
];

const cache = new Map();

function haversineMiles(a, b) {
  const R = 3958.8;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

function typedTown(raw) {
  const q = raw.toLowerCase();
  const towns = TOWNS.slice().sort((a, b) => b.length - a.length);
  for (const town of towns) {
    if (new RegExp("\\b" + town.replace(/\./g, "\\.") + "\\b", "i").test(q)) return town;
  }
  return "";
}

function hasHouseNumber(raw) {
  return /^\s*\d+/.test(raw);
}

function streetToken(raw) {
  return raw.replace(/^\s*\d+\s*/, "").split(/[\s,]+/).find((w) => w.length > 2 && !/^(la|louisiana|usa|street|st|road|rd|ave|avenue|drive|dr|lane|ln|hwy|highway)$/i.test(w)) || "";
}

function buildQueries(raw) {
  const q = raw.replace(/\s+/g, " ").trim();
  const out = [];
  const add = (s) => {
    const t = s.replace(/\s+/g, " ").replace(/,\s*,/g, ",").trim();
    if (t && !out.some((x) => x.toLowerCase() === t.toLowerCase())) out.push(t);
  };
  const hasState = /\b(louisiana|\bla\b)\b/i.test(q);
  add(hasState ? q : `${q}, Louisiana`);
  const hwy = q.match(/\b(?:highway|hwy|la)[-\s]*(\d+)\b/i);
  if (hwy) {
    const town = typedTown(q) || "oak grove";
    const pretty = town.replace(/\b\w/g, (c) => c.toUpperCase());
    add(`${q.replace(/\b(?:highway|hwy)\b/i, "LA")}${hasState ? "" : ", Louisiana"}`);
    add(`Louisiana Highway ${hwy[1]}, ${pretty}, Louisiana`);
  }
  return out.slice(0, 3);
}

async function fetchJson(url, ms) {
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": UA },
    signal: AbortSignal.timeout(ms),
  });
  if (!res.ok) return null;
  return res.json();
}

async function nominatimPins(q) {
  const url = "https://nominatim.openstreetmap.org/search?" + new URLSearchParams({
    q, format: "jsonv2", addressdetails: "1", limit: "5", countrycodes: "us",
    viewbox: "-92.6,33.7,-90.4,32.0", bounded: "0",
  });
  const data = await fetchJson(url, 8000);
  if (!Array.isArray(data)) return [];
  const pins = [];
  for (const item of data) {
    const lat = Number(item.lat);
    const lng = Number(item.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    if (haversineMiles(HUB, { lat, lng }) > MAX_MILES) continue;
    const addr = item.address || {};
    const town = addr.city || addr.town || addr.village || addr.hamlet || addr.county || "";
    const road = addr.road || "";
    const house = addr.house_number || "";
    const state = /louisiana/i.test(addr.state || "") ? "LA" : (addr.state || "");
    const kind = house ? "house" : /city|town|village|administrative|county|hamlet/.test(item.type || "") || !road ? "place" : "street";
    pins.push({
      lat, lng, kind, town, road,
      label: [house, road, town, state].map((part) => String(part).trim()).filter(Boolean).join(", ") || item.display_name || q,
    });
  }
  return pins;
}

function scorePin(pin, raw) {
  const town = typedTown(raw);
  const house = hasHouseNumber(raw);
  const token = streetToken(raw).toLowerCase();
  let score = pin.kind === "house" ? 40 : pin.kind === "street" ? 18 : 6;
  const blob = `${pin.label} ${pin.town} ${pin.road}`.toLowerCase();
  if (town && blob.includes(town)) score += 30;
  if (town && !blob.includes(town)) score -= 28;
  if (house && pin.kind === "place") score -= 35;
  if (token && blob.includes(token)) score += 16;
  if (token && pin.kind !== "place" && !blob.includes(token)) score -= 12;
  return score;
}

function pickBest(pins, raw) {
  if (!pins.length) return null;
  return pins.slice().sort((a, b) => scorePin(b, raw) - scorePin(a, raw))[0];
}

async function drivingMiles(lat, lng) {
  const url = `https://router.project-osrm.org/route/v1/driving/${HUB.lng},${HUB.lat};${lng},${lat}?overview=false`;
  try {
    const data = await fetchJson(url, 8000);
    const meters = data && data.routes && data.routes[0] && data.routes[0].distance;
    if (typeof meters === "number" && meters >= 0) return { miles: meters / 1609.344, approximate: false };
  } catch { /* estimated below */ }
  return { miles: haversineMiles(HUB, { lat, lng }) * 1.15, approximate: true };
}

export async function locateAddress(raw) {
  const query = String(raw || "").replace(/\s+/g, " ").trim();
  if (query.length < 3) return { ok: false, message: "Type a street and town." };
  const key = query.toLowerCase();
  if (cache.has(key)) return cache.get(key);
  const pins = [];
  try {
    for (const q of buildQueries(query)) {
      pins.push(...await nominatimPins(q));
      const bestSoFar = pickBest(pins, query);
      const townOnly = !hasHouseNumber(query) && !!typedTown(query);
      if (bestSoFar && (bestSoFar.kind !== "place" || townOnly) && scorePin(bestSoFar, query) >= 20) break;
    }
  } catch {
    return { ok: false, message: "Couldn’t look up that address. We’ll confirm the miles." };
  }
  const best = pickBest(pins, query);
  if (!best || scorePin(best, query) < 6) {
    return { ok: false, message: "Couldn’t pin that address in the parish. Add the street and town, or call and we’ll price it." };
  }
  const hwy = query.match(/\b(?:highway|hwy|la)[-\s]*(\d+)\b/i);
  if (hwy && !hasHouseNumber(query)) {
    return { ok: false, message: `Add the house number on Highway ${hwy[1]}. A highway runs the length of the parish, so the miles need the driveway.` };
  }
  const drive = await drivingMiles(best.lat, best.lng);
  const fuzzy = best.kind === "place" && (hasHouseNumber(query) || !typedTown(query));
  const located = { ok: true, label: best.label, miles: drive.miles, approximate: drive.approximate || fuzzy };
  cache.set(key, located);
  return located;
}
