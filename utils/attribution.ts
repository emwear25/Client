/**
 * Campaign attribution: remembers the UTM tags of the visitor's first and
 * last campaign visit (e.g. a link posted in a Facebook group) and sends
 * them with the order, so the shop can tell which channels bring sales.
 *
 * Stored in localStorage ONLY with analytics consent. Tags seen before the
 * visitor decides are held in memory and saved once consent is given.
 * Campaign data only - nothing personal.
 */
const STORAGE_KEY = "emwear-attribution";
const MAX_AGE_MS = 30 * 24 * 3_600_000; // a campaign visit counts for 30 days
const FIELDS = ["source", "medium", "campaign", "content", "term"] as const;

export interface AttributionTouch {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  landingPath?: string;
  at: string;
}
export interface Attribution {
  first: AttributionTouch | null;
  last: AttributionTouch | null;
}

let pending: AttributionTouch | null = null;

/** UTM tags of the current URL, or null when there are none. */
export function touchFromUrl(url: URL): AttributionTouch | null {
  const touch: AttributionTouch = { at: new Date().toISOString(), landingPath: url.pathname.slice(0, 300) };
  let found = false;
  for (const f of FIELDS) {
    const v = url.searchParams.get(`utm_${f}`);
    if (v) {
      touch[f] = v.slice(0, 120);
      found = true;
    }
  }
  return found ? touch : null;
}

function read(): Attribution | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Attribution;
    const fresh = (t: AttributionTouch | null) => (t && Date.now() - Date.parse(t.at) < MAX_AGE_MS ? t : null);
    const out = { first: fresh(data.first), last: fresh(data.last) };
    return out.first || out.last ? out : null;
  } catch {
    return null;
  }
}

function save(touch: AttributionTouch) {
  try {
    const current = read();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ first: current?.first ?? touch, last: touch }));
  } catch {
    /* storage blocked - attribution is a nice-to-have */
  }
}

/** Record a campaign visit (saved now with consent, otherwise held until consent). */
export function recordTouch(touch: AttributionTouch | null, hasConsent: boolean) {
  if (!touch) return;
  if (hasConsent) save(touch);
  else pending = touch;
}

/** Called when analytics consent is granted or revoked. */
export function onAttributionConsent(granted: boolean) {
  if (granted && pending) {
    save(pending);
    pending = null;
  }
  if (!granted) {
    pending = null;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}

/** Attribution to send with an order, or undefined. */
export function getAttribution(): Attribution | undefined {
  if (typeof window === "undefined") return undefined;
  return read() ?? undefined;
}
