/**
 * Memo decoding / extraction helpers for transaction approvals.
 *
 * The memo may be represented as:
 * - UTF-8 bytes (Uint8Array)
 * - base64 string
 * - hex string (optionally 0x-prefixed)
 * - nested "protobuf-ish" wrappers like { value: ... }
 *
 * We intentionally keep this resilient: the WASM/protobuf shape may evolve.
 */

import { base16, base64, base64url } from '@scure/base';
import { Noun } from '@nockchain/rose-wasm/rose_wasm.js';
import type {
  Note as WasmNote,
  NoteDataEntry as WasmNoteDataEntry,
  RawTx as WasmRawTx,
} from '@nockchain/rose-wasm/rose_wasm.js';

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

function unwrapValue(x: unknown): unknown {
  if (!isRecord(x)) return x;
  // Common protobuf-ish wrapper: { value: ... }
  if ('value' in x && Object.keys(x).length === 1) return x.value;
  return x;
}

function hexToBytes(hex: string): Uint8Array | null {
  const normalized = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (!/^[0-9a-fA-F]*$/.test(normalized)) return null;
  if (normalized.length % 2 !== 0) return null;
  try {
    // base16 expects hex without 0x prefix and is case-sensitive (RFC 4648 alphabet is uppercase).
    // Normalize to uppercase so mixed/lowercase hex decodes correctly.
    return base16.decode(normalized.toUpperCase());
  } catch {
    return null;
  }
}
function decodeMemoJamListUx(blob: Uint8Array): string | null {
  try {
    const noun = Noun.cue(blob);
    const jsNoun = noun.toJs(); // atom => hex string, cell => [head, tail]

    const bytes: number[] = [];
    let x: unknown = jsNoun;

    while (Array.isArray(x) && x.length === 2) {
      const head = x[0];
      const tail = x[1];

      if (typeof head !== 'string') return null;
      const v = Number.parseInt(head, 16);
      if (!Number.isFinite(v) || v < 0 || v > 255) return null;

      bytes.push(v);
      x = tail;
    }

    // list terminator must be atom 0 (hex string "0")
    if (typeof x !== 'string') return null;
    if (Number.parseInt(x, 16) !== 0) return null;

    const decoded = bytesToUtf8(Uint8Array.from(bytes)).trim();
    return decoded.length ? decoded : null;
  } catch {
    return null;
  }
}
function base64ToBytes(b64: string): Uint8Array | null {
  const normalized = b64.trim();
  if (!normalized) return null;

  // Heuristics to avoid interpreting arbitrary plaintext as base64/base64url.
  // - base64: A–Z a–z 0–9 + / with optional = padding, length must be multiple of 4.
  // - base64url: A–Z a–z 0–9 - _ with optional padding; may be unpadded.
  const looksLikeB64 = /^[A-Za-z0-9+/]+={0,2}$/.test(normalized) && normalized.length % 4 === 0;
  const looksLikeB64Url = /^[A-Za-z0-9_-]+={0,2}$/.test(normalized);
  if (!looksLikeB64 && !looksLikeB64Url) return null;

  // Try strict decoders first; fall back to normalizing url-safe -> standard base64.
  try {
    if (looksLikeB64) return base64.decode(normalized);
    if (looksLikeB64Url) return base64url.decode(normalized);
  } catch {
    // continue
  }

  try {
    // Normalize base64url (unpadded) to standard base64 for maximum compatibility.
    let s = normalized.replace(/-/g, '+').replace(/_/g, '/');
    const pad = s.length % 4;
    if (pad === 2) s += '==';
    else if (pad === 3) s += '=';
    else if (pad === 1) return null; // impossible length
    return base64.decode(s);
  } catch {
    return null;
  }
}

function bytesToUtf8(bytes: Uint8Array): string {
  try {
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  } catch {
    // Fallback (very old environments)
    let s = '';
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return s;
  }
}

function looksLikeReadableText(s: string): boolean {
  if (s.includes('\uFFFD')) return false;

  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    const isAllowedWhitespace = c === 0x09 || c === 0x0a || c === 0x0d;
    const isControl = (c >= 0x00 && c <= 0x1f) || (c >= 0x7f && c <= 0x9f);
    if (isControl && !isAllowedWhitespace) return false;
  }

  return true;
}

function decodeMemoValue(maybe: unknown): string | null {
  const v = unwrapValue(maybe);
  if (v == null) return null;

  if (v instanceof Uint8Array) {
    // NEW: wasm/protobuf stores memo as jam(noun), not raw UTF-8 bytes
    const jamDecoded = decodeMemoJamListUx(v);
    if (jamDecoded) return jamDecoded;

    // fallback (legacy / unexpected)
    const decoded = bytesToUtf8(v).trim();
    return decoded.length ? decoded : null;
  }

  // NEW: protobuf blobs may come through as number[]
  if (Array.isArray(v) && v.every(n => Number.isInteger(n) && n >= 0 && n <= 255)) {
    return decodeMemoValue(Uint8Array.from(v));
  }

  if (typeof v === 'string') {
    const raw = v.trim();
    if (!raw) return null;

    const asHex = hexToBytes(raw);
    if (asHex) {
      const jamDecoded = decodeMemoJamListUx(asHex);
      if (jamDecoded) return jamDecoded;

      const decoded = bytesToUtf8(asHex).trim();
      if (decoded.length && looksLikeReadableText(decoded)) return decoded;
      return raw;
    }

    const asB64 = base64ToBytes(raw);
    if (asB64) {
      const jamDecoded = decodeMemoJamListUx(asB64);
      if (jamDecoded) return jamDecoded;

      const decoded = bytesToUtf8(asB64).trim();
      if (decoded.length && looksLikeReadableText(decoded)) return decoded;
      return raw;
    }

    return raw;
  }

  if (isRecord(v)) {
    if ('blob' in v) return decodeMemoValue(v.blob);
    if ('memo' in v) return decodeMemoValue(v.memo);
  }

  return null;
}

type ProtobufNoteDataEntryLike = { key?: unknown; blob?: unknown };

function isWasmNote(note: unknown): note is WasmNote {
  return isRecord(note) && 'noteData' in note;
}

function getNoteDataEntries(
  note: WasmNote | unknown
): ReadonlyArray<WasmNoteDataEntry | ProtobufNoteDataEntryLike> {
  // WASM path (strongly typed)
  if (isWasmNote(note)) {
    const noteData: any = (note as any).noteData;
    const entries =
      typeof noteData?.entries === 'function' ? noteData.entries() : noteData?.entries;
    return Array.isArray(entries) ? entries : [];
  }

  // Protobuf-ish object path (resilient)
  if (!isRecord(note)) return [];
  const v1 = (note as any)?.note_version?.V1 ?? (note as any)?.noteVersion?.V1 ?? null;
  const noteData = v1?.note_data ?? v1?.noteData ?? null;
  const entries = noteData?.entries ?? noteData?.Entries ?? null;
  return Array.isArray(entries) ? (entries as ProtobufNoteDataEntryLike[]) : [];
}

function extractMemoFromOutputs(
  outputs: ReadonlyArray<WasmNote | unknown> | undefined
): string | null {
  if (!outputs || !Array.isArray(outputs)) return null;

  for (const output of outputs) {
    const entries = getNoteDataEntries(output);
    for (const entry of entries) {
      const keyRaw = (entry as any)?.key;
      const keyVal = typeof keyRaw === 'function' ? keyRaw.call(entry) : keyRaw;
      const key = unwrapValue(keyVal);
      const keyStr = typeof key === 'string' ? key : null;
      if (!keyStr) continue;
      if (keyStr.toLowerCase() !== 'memo') continue;

      const blobRaw = (entry as any)?.blob;
      const blobVal = typeof blobRaw === 'function' ? blobRaw.call(entry) : blobRaw;
      const memo = decodeMemoValue(blobVal);
      if (memo) return memo;
    }
  }

  return null;
}

function extractMemoFromRawTx(rawTx: WasmRawTx | unknown): string | null {
  // Fast-path: common shapes
  const maybe = isRecord(rawTx) ? rawTx : (rawTx as unknown as Record<string, unknown>);
  const direct = decodeMemoValue((maybe as any)?.memo ?? (maybe as any)?.Memo);
  if (direct) return direct;

  // Some schemas may tuck memo under tx/body/etc.
  const nested = decodeMemoValue(
    (maybe as any)?.tx?.memo ?? (maybe as any)?.body?.memo ?? (maybe as any)?.transaction?.memo
  );
  if (nested) return nested;

  // As a last resort, shallow scan for keys named "memo" (case-insensitive) up to a small depth.
  const queue: Array<{ obj: Record<string, unknown>; depth: number }> = [];
  if (isRecord(rawTx)) queue.push({ obj: rawTx, depth: 0 });
  const seen = new Set<object>();

  while (queue.length) {
    const { obj, depth } = queue.shift()!;
    if (seen.has(obj)) continue;
    seen.add(obj);

    for (const [k, val] of Object.entries(obj)) {
      if (k.toLowerCase() === 'memo') {
        const found = decodeMemoValue(val);
        if (found) return found;
      }
      if (depth < 3 && isRecord(val)) queue.push({ obj: val, depth: depth + 1 });
    }
  }

  return null;
}

/**
 * Extract a human-readable memo from a signRawTx payload.
 * Returns null if no memo exists.
 */
export function extractMemo(params: {
  rawTx: WasmRawTx | unknown;
  outputs?: ReadonlyArray<WasmNote | unknown>;
}): string | null {
  // Prefer explicit tx-level memo if present; otherwise fall back to note_data entries.
  return extractMemoFromRawTx(params.rawTx) ?? extractMemoFromOutputs(params.outputs);
}
