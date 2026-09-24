import type { Db } from "./types";

const STORAGE_KEY = "vendli-mock-db";
const SCHEMA_VERSION = 1;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

let db: Db | null = null;
let loading: Promise<Db> | null = null;

/** Moves every ISO timestamp forward so the seed always looks like it was captured today. */
function shiftDates<T>(value: T, offsetMs: number): T {
  if (Array.isArray(value)) return value.map((v) => shiftDates(v, offsetMs)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, shiftDates(v, offsetMs)])
    ) as T;
  }
  if (typeof value === "string" && ISO_DATE.test(value)) {
    return new Date(new Date(value).getTime() + offsetMs).toISOString() as T;
  }
  return value;
}

function readPersisted(): Db | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.version === SCHEMA_VERSION ? parsed.db : null;
  } catch {
    return null;
  }
}

export function persist() {
  if (!db) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION, db }));
  } catch {
    // Quota exceeded or storage blocked: the demo keeps working in memory.
  }
}

async function seed(): Promise<Db> {
  const { default: raw } = await import("./db.json");
  const offset = Date.now() - new Date(raw.generatedAt).getTime();
  return { ...shiftDates(raw as unknown as Db, offset), sessions: [] };
}

export async function getDb(): Promise<Db> {
  if (db) return db;
  loading ??= (async () => {
    db = readPersisted() ?? (await seed());
    persist();
    return db;
  })();
  return loading;
}

export function resetDb() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  db = null;
  loading = null;
}

export const nextId = <T,>(rows: T[], key: keyof T) =>
  rows.reduce((max, r) => Math.max(max, Number(r[key]) || 0), 0) + 1;
