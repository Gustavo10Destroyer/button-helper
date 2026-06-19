/**
 * Primitive JSON values supported by button parameter payloads.
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * Recursive JSON value model used at external serialization boundaries.
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

/**
 * JSON object with unknown external keys.
 */
export interface JsonObject {
    readonly [key: string]: JsonValue;
}

/**
 * Runtime validation result with non-fatal warnings and optional cleaned data.
 */
export interface ValidationResult<TCleaned = undefined> {
    /** Indicates whether the validated input can be used safely. */
    readonly valid: boolean;
    /** Blocking validation failures. */
    readonly errors: readonly string[];
    /** Non-blocking concerns that may still affect WhatsApp clients. */
    readonly warnings: readonly string[];
    /** Optional normalized value produced by validation. */
    readonly cleaned?: TCleaned;
}

/**
 * Strict record helper used after runtime narrowing.
 */
export type UnknownRecord = Record<string, unknown>;
