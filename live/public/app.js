const HUB = { lat: 32.861098, lng: -91.379714, label: "805 E Main St, Oak Grove, LA" };
const IN_TOWN_MILES = 2;
const BASE = 10;
const PER_MILE = 1.5;
const EXTRA_STOP = 2;
const MARIE = "3184175750";

const SHOPS = [
  { id: "pkg", group: "Liquor", name: "Oak Grove Package Liquor", addr: "225 Industrial Blvd", phone: "318-428-4142", alcohol: true },
  { id: "smart", group: "Liquor", name: "S Mart", addr: "706 S Constitution Ave", phone: "318-490-4209", alcohol: true },
  { id: "walmart", group: "Walmart", name: "Walmart Supercenter (pickup)", addr: "705 S Constitution Ave", phone: "318-428-9631", alcohol: false, walmart: true },
  { id: "delta", group: "Coffee", name: "Delta Grounds Coffee", addr: "215 E Main St", phone: "318-417-5556", alcohol: false },
  { id: "barn", group: "Coffee", name: "Bakery Barn", addr: "105 S Constitution", phone: "318-490-2058", alcohol: false },
  { id: "grit", group: "Coffee", name: "Grit + Grind Coffee", addr: "Oak Grove, LA", phone: "318-282-6655", alcohol: false },
  { id: "deltadesigns", group: "Flowers", name: "Delta Designs", addr: "224 E Main St", phone: "318-428-4518", alcohol: false },
  { id: "corner", group: "Market", name: "Corner Market", addr: "100 W Main St", phone: "318-428-2727", alcohol: false },
  { id: "chopsticks", group: "Food", name: "Chopstick Chinese Buffet", addr: "104 E Main St", phone: "318-428-8880", alcohol: false },
  { id: "props", group: "Food", name: "Props & Pans", addr: "710 W Main St", phone: "318-428-9575", alcohol: false },
  { id: "elalamo", group: "Food", name: "El Alamo Mexican Restaurant", addr: "707 E Main St", phone: "318-428-9371", alcohol: false },
  { id: "chickenbasket", group: "Food", name: "Chicken Basket", addr: "804 E Main St", phone: "318-428-1100", alcohol: false },
  { id: "johnnys", group: "Food", name: "Johnny's Pizza", addr: "809 E Main St", phone: "318-428-9666", alcohol: false },
  { id: "freezer", group: "Food", name: "Little Freezer", addr: "102 S Horner St", phone: "318-428-2039", alcohol: false },
  { id: "mcd", group: "Food", name: "McDonald's", addr: "708 S Constitution", phone: null, alcohol: false, mcd: true },
  { id: "sonic", group: "Food", name: "Sonic", addr: "806 E Main St", phone: "318-428-8476", alcohol: false },
  { id: "buds", group: "Food", name: "Bud's Eatery", addr: "210 Marietta St", phone: "318-370-3331", alcohol: false },
];

const form = document.getElementById("job");
const quoteAmt = document.getElementById("quoteAmt");
const quoteWhy = document.getElementById("quoteWhy");
const quotePay = document.getElementById("quotePay");
const idNote = document.getElementById("idNote");
const shopList = document.getElementById("shopList");
const nameExtra = document.getElementById("nameExtra");
const mcdExtra = document.getElementById("mcdExtra");
const dropoffInput = form.elements.dropoff;
const otherStop = form.elements.otherStop;

let lastQuote = null;

function payChoice() {
  const el = form.querySelector('input[name="pay"]:checked');
  return el ? el.value : "cod";
}

function payText() {
  return payChoice() === "paid"
    ? "Already paid at the store"
    : "COD · cash to the driver";
}

function refreshPayLine() {
  if (quotePay) quotePay.textContent = payText();
}



function selectedShops() {
  const ids = [...form.querySelectorAll('input[name="shop"]:checked')].map((el) => el.value);
  const fromList = SHOPS.filter((s) => ids.includes(s.id));
  const extra = (otherStop.value || "").trim();
  return { fromList, extra };
}

function stopCount() {
  const { fromList, extra } = selectedShops();
  return fromList.length + (extra ? 1 : 0);
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function haversineMiles(a, b) {
  const R = 3958.8;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

function roundUpHalf(n) {
  return Math.ceil(n * 2) / 2;
}

function money(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const SERVICE_MILES = 45;
const PIN_MILES = 50;
const HUB_CENTROID_MI = 0.7;
const NELA_TOWNS = [
  "oak grove", "kilbourne", "forest", "pioneer", "epps", "goodwill",
  "lake providence", "transylvania", "sondheimer", "terry",
  "delhi", "rayville", "mangham", "start", "holly ridge",
  "tallulah", "richmond", "mound", "newellton", "st joseph", "st. joseph",
  "bastrop", "mer rouge", "bonita", "collinston", "oak ridge",
  "winnsboro", "baskin", "crowville", "wisner", "gilbert",
  "monroe", "west monroe", "sterlington", "swartz", "richwood",
  "farmerville", "marion", "downsville",
];
const NEAR_TOWNS = ["Kilbourne", "Forest", "Pioneer", "Epps", "Oak Grove"];

function nelaQuery(raw) {
  let q = raw.replace(/\s+/g, " ").trim();
  q = q.replace(/,?\s*(united kingdom|\buk\b|england|great britain)\b/gi, "");
  if (/\b(louisiana|\bla\b)\b/i.test(q)) return q;
  const named = NELA_TOWNS.some((t) => new RegExp("\\b" + t.replace(/\./g, "\\.") + "\\b", "i").test(q));
  if (named) return q + ", LA";
  return q + ", LA";
}

function streetOnly(raw) {
  let s = raw.replace(/\s+/g, " ").trim();
  s = s.replace(/,?\s*(united kingdom|\buk\b|england|great britain)\b/gi, "");
  s = s.replace(/,?\s*\b(louisiana|\bla\b|usa|united states)\b/gi, "");
  s = s.replace(/\b712\d{2}\b/g, "");
  for (const t of NELA_TOWNS.slice().sort((a, b) => b.length - a.length)) {
    s = s.replace(new RegExp(",?\\s*\\b" + t.replace(/\./g, "\\.") + "\\b", "ig"), "");
  }
  return s.replace(/[,\s]+$/g, "").replace(/^[,\s]+/g, "").trim();
}

function hasHouseNumber(q) {
  return /^\d+/.test(q.trim());
}

function isNelaPin(lat, lng, props) {
  const miles = haversineMiles(HUB, { lat, lng });
  if (miles > PIN_MILES) return false;
  const country = String((props && (props.country || props.countrycode || props.country_code)) || "");
  if (/united kingdom|england|\bgb\b|^uk$/i.test(country)) return false;
  return true;
}

function typedTown(raw) {
  const q = raw.toLowerCase();
  const towns = NELA_TOWNS.slice().sort(function (a, b) { return b.length - a.length; });
  for (let i = 0; i < towns.length; i++) {
    const t = towns[i];
    if (new RegExp("\\b" + t.replace(/\./g, "\\.") + "\\b", "i").test(q)) return t;
  }
  return "";
}

function rankPin(p) {
  if (p.src === "census" || p.kind === "address") return 3;
  if (p.kind === "street") return 2;
  return 1;
}

function pickBest(pins, street, town) {
  if (!pins.length) return null;
  let pool = pins.slice();
  const solid = pool.filter(function (p) { return rankPin(p) >= 2; });
  if (solid.length) pool = solid;
  const token = (street || "")
    .replace(/^\d+\s*/, "")
    .split(/\s+/)
    .filter(function (w) { return w.length > 2; })[0] || "";
  if (token) {
    const named = pool.filter(function (p) {
      return String(p.street || "").toLowerCase().indexOf(token.toLowerCase()) !== -1;
    });
    if (named.length) pool = named;
  }
  if (town) {
    const hit = pool.filter(function (p) {
      return String(p.city || "").toLowerCase().indexOf(town.toLowerCase()) !== -1;
    });
    const hasCensus = pool.some(function (p) { return p.src === "census"; });
    if (hit.length && !hasCensus) pool = hit;
  }
  pool.sort(function (a, b) { return rankPin(b) - rankPin(a); });
  return pool[0];
}

async function fetchJson(url, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(function () { ctrl.abort(); }, ms || 4000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function photonPins(q) {
  const url =
    "https://photon.komoot.io/api/?q=" +
    encodeURIComponent(q) +
    "&limit=10&lat=" +
    HUB.lat +
    "&lon=" +
    HUB.lng;
  const data = await fetchJson(url, 4000);
  if (!data || !data.features) return [];
  const pins = [];
  for (const f of data.features) {
    if (!f.geometry || !f.geometry.coordinates) continue;
    const [lng, lat] = f.geometry.coordinates;
    if (!isNelaPin(lat, lng, f.properties || {})) continue;
    const props = f.properties || {};
    const osm = String(props.osm_value || props.type || "").toLowerCase();
    let kind = "place";
    if (props.housenumber) kind = "address";
    else if (/city|town|village|county|state/.test(osm)) kind = "city";
    else if (props.street) kind = "street";
    pins.push({
      lat,
      lng,
      miles: haversineMiles(HUB, { lat, lng }),
      src: "photon",
      kind,
      city: String(props.city || props.name || ""),
      street: String(props.street || props.name || ""),
    });
  }
  return pins;
}

async function censusPins(q) {
  const url =
    "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?" +
    new URLSearchParams({
      address: q,
      benchmark: "Public_AR_Current",
      format: "json",
    });
  const data = await fetchJson(url, 4500);
  const matches = data && data.result && data.result.addressMatches;
  if (!matches || !matches.length) return [];
  const pins = [];
  for (const m of matches) {
    const coords = m.coordinates || {};
    const lng = parseFloat(coords.x);
    const lat = parseFloat(coords.y);
    if (!lat || !lng) continue;
    if (!isNelaPin(lat, lng, { country: "USA", state: "Louisiana" })) continue;
    pins.push({
      lat,
      lng,
      miles: haversineMiles(HUB, { lat, lng }),
      src: "census",
      kind: "address",
      city: String((m.addressComponents && m.addressComponents.city) || ""),
      street: (m.matchedAddress || q),
    });
  }
  return pins;
}

const geoCache = {};

async function geocode(query) {
  const raw = query.trim();
  if (raw.length < 3) return null;
  const key = raw.toLowerCase();
  if (geoCache[key]) return geoCache[key];
  const data = await fetchJson("/api/quote?address=" + encodeURIComponent(raw), 9000);
  if (!data) return { error: "Couldn’t check miles. We’ll confirm." };
  if (!data.ok) return { error: data.message || "Couldn’t pin that address." };
  const pin = { miles: data.miles, label: data.label, approximate: !!data.approximate };
  geoCache[key] = pin;
  return pin;
}

function computeFee(dropoff, stops) {
  const extraStops = Math.max(0, stops - 1);
  const stopFee = extraStops * EXTRA_STOP;
  const dMiles = dropoff && typeof dropoff.miles === "number" ? dropoff.miles : 0;
  const rounded = dropoff ? Math.round(dMiles * 10) / 10 : 0;
  const extraMiles = dropoff ? Math.max(0, Math.round((rounded - IN_TOWN_MILES) * 10) / 10) : 0;
  const mileFee = Math.round(extraMiles * PER_MILE * 100) / 100;
  const about = dropoff && dropoff.approximate ? "about " : "";
  const pin = dropoff && dropoff.label ? `Pinned ${dropoff.label}. ` : "";
  let mileWhy = "Add a dropoff for mileage.";
  if (dropoff && extraMiles <= 0) {
    mileWhy = `${pin}${about}${rounded.toFixed(1)} driving miles from 805 E Main — inside Oak Grove.`;
  } else if (dropoff) {
    mileWhy = `${pin}${about}${rounded.toFixed(1)} driving miles from 805 E Main. ${money(BASE)} covers the first ${IN_TOWN_MILES} miles. ${extraMiles.toFixed(1)} mi × ${money(PER_MILE)} = ${money(mileFee)}.`;
  }
  const raw = BASE + (dropoff ? mileFee : 0) + stopFee;
  const fee = roundUpHalf(raw);
  const cash = dropoff && fee - raw > 0.009 ? ` Cash total ${money(fee)}.` : "";
  const stopWhy =
    extraStops === 0
      ? "One pickup."
      : `${stops} pickups · ${money(EXTRA_STOP)} × ${extraStops} extra stop${extraStops === 1 ? "" : "s"}.`;
  return {
    fee,
    why: `${mileWhy} ${stopWhy}${cash}`,
    extraStops,
    miles: dropoff ? rounded : null,
  };
}

let quoteSeq = 0;
const refreshQuote = debounce(async () => {
  const seq = ++quoteSeq;
  const stops = stopCount();
  const { fromList } = selectedShops();
  const hasAlcohol = fromList.some((s) => s.alcohol);
  idNote.hidden = !hasAlcohol;
  const needsName = fromList.some((s) => s.group === "Food" || s.group === "Coffee" || s.walmart);
  const needsMcd = fromList.some((s) => s.mcd);
  nameExtra.hidden = !needsName;
  mcdExtra.hidden = !needsMcd;
  form.elements.orderName.required = needsName;
  form.elements.mcdCode.required = needsMcd;

  if (stops < 1) {
    lastQuote = null;
    quoteAmt.textContent = "Pick a place and dropoff";
    quoteWhy.textContent = "";
    return;
  }
  const dropQ = dropoffInput.value.trim();
  if (dropQ.length < 5) {
    const q = computeFee(null, stops);
    lastQuote = { ...q, dropoff: null, failed: false };
    quoteAmt.textContent = money(q.fee);
    quoteWhy.textContent = q.why + " Add a dropoff for mileage.";
    return;
  }
  quoteAmt.textContent = "Checking miles…";
  try {
    const dropoff = await geocode(dropQ);
    if (seq !== quoteSeq) return;
    if (!dropoff || dropoff.error) {
      const q = computeFee(null, stops);
      lastQuote = { fee: q.fee, failed: true };
      quoteAmt.textContent = money(q.fee) + "+";
      quoteWhy.textContent = (dropoff && dropoff.error) || "Couldn’t read that address. Mileage TBA. Extra stops already in.";
      return;
    }
    const q = computeFee(dropoff, stops);
    lastQuote = { ...q, dropoff, failed: false };
    quoteAmt.textContent = money(q.fee);
    quoteWhy.textContent = q.why;
  } catch (err) {
    const q = computeFee(null, stops);
    lastQuote = { fee: q.fee, failed: true };
    quoteAmt.textContent = money(q.fee) + "+";
    quoteWhy.textContent = "Couldn’t check miles. Extra stops counted. We’ll confirm.";
  }
}, 300);

form.addEventListener("change", function () {
  refreshPayLine();
  refreshQuote();
});
refreshPayLine();
dropoffInput.addEventListener("input", refreshQuote);
otherStop.addEventListener("input", refreshQuote);

function smsHref(body) {
  const encoded = encodeURIComponent(body);
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  return ios ? `sms:${MARIE}&body=${encoded}` : `sms:${MARIE}?body=${encoded}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const { fromList, extra } = selectedShops();
  if (fromList.length + (extra ? 1 : 0) < 1) {
    alert("Pick at least one place.");
    return;
  }
  if (!form.reportValidity()) return;
  const name = form.elements.name.value.trim();
  const phone = form.elements.phone.value.trim();
  const dropoff = form.elements.dropoff.value.trim();
  const when = form.elements.when.value.trim();
  const notes = form.elements.notes.value.trim();
  const orderName = (form.elements.orderName.value || "").trim();
  const mcdCode = (form.elements.mcdCode.value || "").trim();
  const pickups = fromList.map((s) => s.phone ? s.name + " " + s.phone : s.name + " (no number listed)");
  if (extra) pickups.push(extra);
  const quoteLine = lastQuote && lastQuote.fee != null ? money(lastQuote.fee) : "please confirm fee";
  const body = [
    "OG Deliveries pickup request",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Pickups (${pickups.length}): ${pickups.join("; ")}`,
    orderName ? `Name on order: ${orderName}` : null,
    mcdCode ? `McDonald's drive-thru code: ${mcdCode}` : null,
    `Dropoff: ${dropoff}`,
    lastQuote && lastQuote.miles != null ? `Miles: ${lastQuote.miles.toFixed(1)} driving miles from 805 E Main` : null,
    when ? `When: ${when}` : null,
    notes ? `Notes: ${notes}` : null,
    `Pay: ${payText()}`,
    `Quote: ${quoteLine}`,
  ]
    .filter(Boolean)
    .join("\n");
  const isiPad = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || isiPad;
  if (mobile) {
    window.location.href = smsHref(body);
  } else {
    const text = "Text 318-417-5750:\n\n" + body;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        alert("Request copied. Paste it in a text to 318-417-5750, or send it from your phone.");
      }).catch(function () {
        prompt("Copy this and text it to 318-417-5750", text);
      });
    } else {
      prompt("Copy this and text it to 318-417-5750", text);
    }
  }
});
