/**
 * Structured details attached to interactive validation failures.
 */
export interface InteractiveValidationErrorMetadata {
    /** Operation or validation step that failed. */
    readonly context?: string;
    /** Blocking validation failures. */
    readonly errors?: readonly string[];
    /** Non-blocking warnings collected before failure. */
    readonly warnings?: readonly string[];
    /** Example payload suitable for logs and developer feedback. */
    readonly example?: unknown;
}

/**
 * Serializable validation error for interactive messaging helpers.
 */
export class InteractiveValidationError extends Error {
    /** Operation or validation step that failed. */
    public readonly context: string | undefined;

    /** Blocking validation failures. */
    public readonly errors: readonly string[];

    /** Non-blocking warnings collected before failure. */
    public readonly warnings: readonly string[];

    /** Example payload suitable for logs and developer feedback. */
    public readonly example: unknown;

    /**
     * Creates a structured validation error.
     */
    public constructor(
        message: string,
        metadata: InteractiveValidationErrorMetadata = {},
    ) {
        super(message);
        this.name = 'InteractiveValidationError';
        this.context = metadata.context;
        this.errors = metadata.errors ?? [];
        this.warnings = metadata.warnings ?? [];
        this.example = metadata.example;
    }

    /**
     * Returns a JSON-serializable error representation.
     */
    public toJSON(): Readonly<Record<string, unknown>> {
        return {
            name: this.name,
            message: this.message,
            context: this.context,
            errors: this.errors,
            warnings: this.warnings,
            example: this.example,
        };
    }

    /**
     * Formats the validation error for console output.
     */
    public formatDetailed(): string {
        const lines = [
            `[${this.name}] ${this.message}${this.context ? ` (${this.context})` : ''}`,
        ];

        if (this.errors.length > 0) {
            lines.push('Errors:');
            this.errors.forEach((error) => lines.push(`  - ${error}`));
        }

        if (this.warnings.length > 0) {
            lines.push('Warnings:');
            this.warnings.forEach((warning) => lines.push(`  - ${warning}`));
        }

        if (this.example !== undefined) {
            lines.push(
                'Example payload:',
                JSON.stringify(this.example, null, 2),
            );
        }

        return lines.join('\n');
    }
}
