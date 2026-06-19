import type { UnknownRecord } from '../types/common.js';

/**
 * Parses a JSON string into unknown data while preserving error context.
 */
export function parseJson(json: string, context: string): unknown {
  try {
    return JSON.parse(json) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown JSON parsing error';
    throw new Error(`${context} is not valid JSON: ${message}`);
  }
}

/**
 * Returns true when a value is a non-array object.
 */
export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Narrows an unknown value to a non-array object or throws with context.
 */
export function requireRecord(value: unknown, context: string): UnknownRecord {
  if (!isRecord(value)) {
    throw new Error(`${context} must be an object`);
  }

  return value;
}

/**
 * Reads a required string field from an unknown object.
 */
export function requireStringField(record: UnknownRecord, key: string, context: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${context}.${key} must be a non-empty string`);
  }

  return value;
}

/**
 * Reads an optional string field from an unknown object.
 */
export function optionalStringField(record: UnknownRecord, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}
