import { parseSave, serializeGame } from './engine.js?v=0.4.1';
export const STORAGE_KEY = 'tomori-rebirth-v1';
const BACKUP_KEY = `${STORAGE_KEY}-backups`;
const ARCHIVE_KEY = `${STORAGE_KEY}-unreadable`;

// Storage format 2 wraps the game payload; raw version-one saves remain readable.
export function decodeRecord(raw) {
  if (typeof raw !== 'string' || raw.length > 110000) return null;
  try {
    const record = JSON.parse(raw);
    if (Object.hasOwn(record, 'storageVersion')) {
      if (record.storageVersion !== 2 || typeof record.payload !== 'string' || !Number.isFinite(record.savedAt)) return null;
      return parseSave(record.payload);
    }
    return parseSave(raw);
  } catch { return null; }
}
export function readBackups(storage) {
  try {
    const raw = storage.getItem(BACKUP_KEY);
    if (!raw || raw.length > 600000) return [];
    const entries = JSON.parse(raw);
    return Array.isArray(entries) ? entries.slice(0, 5).filter(entry => entry && Number.isFinite(entry.savedAt) && decodeRecord(entry.record)) : [];
  } catch { return []; }
}
export function loadStoredGame(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return { game: null, warning: '' };
  const game = decodeRecord(raw);
  if (game) return { game, warning: '' };
  const backup = readBackups(storage)[0];
  return { game: backup ? decodeRecord(backup.record) : null, warning: backup ? '保存データを読み込めなかったため、バックアップを開きました。保存メニューで確認してください。' : '保存データを読み込めませんでした。元のデータは上書きせず、仮の周回を開きました。' };
}
export function writeStoredGame(storage, game, { now = Date.now(), checkpoint = false } = {}) {
  const payload = serializeGame(game);
  if (!parseSave(payload)) throw new Error('Invalid game');
  const previous = storage.getItem(STORAGE_KEY);
  const backups = readBackups(storage);
  if (checkpoint || (previous && decodeRecord(previous) && (!backups.length || now - backups[0].savedAt >= 60000))) {
    const snapshot = checkpoint ? JSON.stringify({ storageVersion: 2, savedAt: now, payload }) : previous;
    backups.unshift({ savedAt: now, record: snapshot });
    storage.setItem(BACKUP_KEY, JSON.stringify(backups.slice(0, 5)));
  }
  // Explicit replacement preserves an unreadable original separately.
  if (previous && !decodeRecord(previous)) storage.setItem(ARCHIVE_KEY, previous);
  storage.setItem(STORAGE_KEY, JSON.stringify({ storageVersion: 2, savedAt: now, payload }));
}
export function unreadableRecord(storage) { try { return storage.getItem(ARCHIVE_KEY); } catch { return null; } }
