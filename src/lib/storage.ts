import { sanitizeDocument } from './motion/documents';
import { getPreset } from './motion/presets';
import type { StudioDocument } from './motion/types';

const SAVES_KEY = 'movolette.saves.v1';
const LAST_KEY = 'movolette.last-document.v1';

export interface SavedDocument {
  presetId: string;
  name: string;
  savedAt: number;
  doc: StudioDocument;
}

function storage(): Storage | null {
  try {
    const test = '__movolette_test__';
    window.localStorage.setItem(test, '1');
    window.localStorage.removeItem(test);
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadSaves(): SavedDocument[] {
  const store = storage();
  if (!store) return [];
  try {
    const raw = store.getItem(SAVES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const saves: SavedDocument[] = [];
    for (const entry of parsed) {
      if (!entry || typeof entry !== 'object') continue;
      const record = entry as Record<string, unknown>;
      const doc = sanitizeDocument(record.doc);
      if (!doc) continue;
      const preset = getPreset(doc.presetId);
      if (!preset) continue;
      saves.push({
        presetId: doc.presetId,
        name: preset.name,
        savedAt: typeof record.savedAt === 'number' ? record.savedAt : Date.now(),
        doc,
      });
    }
    return saves.slice(0, 24);
  } catch {
    return [];
  }
}

export function saveDocumentLocally(doc: StudioDocument): SavedDocument | null {
  const store = storage();
  const preset = getPreset(doc.presetId);
  if (!store || !preset) return null;
  const entry: SavedDocument = {
    presetId: doc.presetId,
    name: preset.name,
    savedAt: Date.now(),
    doc,
  };
  const existing = loadSaves().filter((save) => save.presetId !== doc.presetId);
  const next = [entry, ...existing].slice(0, 24);
  try {
    store.setItem(SAVES_KEY, JSON.stringify(next));
    return entry;
  } catch {
    return null;
  }
}

export function removeSave(presetId: string): SavedDocument[] {
  const store = storage();
  const next = loadSaves().filter((save) => save.presetId !== presetId);
  try {
    store?.setItem(SAVES_KEY, JSON.stringify(next));
  } catch {
    /* Storage can be unavailable; the UI keeps working without it. */
  }
  return next;
}

export function saveLastDocument(doc: StudioDocument): void {
  try {
    storage()?.setItem(LAST_KEY, JSON.stringify(doc));
  } catch {
    /* Ignore quota and privacy-mode failures. */
  }
}

export function loadLastDocument(): StudioDocument | null {
  try {
    const raw = storage()?.getItem(LAST_KEY);
    if (!raw) return null;
    return sanitizeDocument(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function clearLastDocument(): void {
  try {
    storage()?.removeItem(LAST_KEY);
  } catch {
    /* Ignore. */
  }
}
