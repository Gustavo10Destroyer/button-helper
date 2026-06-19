import {
    serializeNativeFlowButton,
    deserializeNativeFlowButton,
} from './buttonParamsMapper.js';
import {
    InteractiveButtonName,
    type NativeFlowButton,
    type SerializedNativeFlowButton,
} from '../types/buttonParams.js';
import type {
    AuthoringButton,
    LegacyBaileysButtonInput,
    QuickReplyButtonInput,
} from '../types/entities.js';
import { isRecord } from '../parsers/jsonParser.js';

/**
 * Converts any supported authoring button shape to a typed native-flow button.
 */
export function mapAuthoringButton(
    button: AuthoringButton,
    index: number,
): NativeFlowButton {
    if (isTypedNativeFlowButton(button)) {
        return button;
    }

    if (isSerializedNativeFlowButton(button)) {
        return deserializeNativeFlowButton(button);
    }

    if (isLegacyBaileysButton(button)) {
        return {
            name: InteractiveButtonName.QuickReply,
            params: {
                displayText: button.buttonText.displayText,
                id: button.buttonId,
            },
        };
    }

    if (isQuickReplyButton(button)) {
        return {
            name: InteractiveButtonName.QuickReply,
            params: {
                displayText:
                    button.text ?? button.displayText ?? `Button ${index + 1}`,
                id: button.id ?? `quick_${index + 1}`,
            },
        };
    }

    throw new Error(`button[${index}] has an unsupported authoring shape`);
}

/**
 * Converts supported authoring button shapes to serialized Baileys buttons.
 */
export function buildInteractiveButtons(
    buttons: readonly AuthoringButton[] = [],
): SerializedNativeFlowButton[] {
    return buttons.map((button, index) =>
        serializeNativeFlowButton(mapAuthoringButton(button, index)),
    );
}

/**
 * Runtime guard for typed native-flow buttons.
 */
export function isTypedNativeFlowButton(
    value: unknown,
): value is NativeFlowButton {
    return (
        isRecord(value) &&
        typeof value.name === 'string' &&
        isInteractiveButtonName(value.name) &&
        isRecord(value.params)
    );
}

/**
 * Runtime guard for serialized native-flow buttons.
 */
export function isSerializedNativeFlowButton(
    value: unknown,
): value is SerializedNativeFlowButton {
    return (
        isRecord(value) &&
        typeof value.name === 'string' &&
        isInteractiveButtonName(value.name) &&
        typeof value.buttonParamsJson === 'string'
    );
}

/**
 * Runtime guard for old Baileys button payloads.
 */
export function isLegacyBaileysButton(
    value: unknown,
): value is LegacyBaileysButtonInput {
    return (
        isRecord(value) &&
        typeof value.buttonId === 'string' &&
        isRecord(value.buttonText) &&
        typeof value.buttonText.displayText === 'string'
    );
}

/**
 * Runtime guard for simplified quick-reply payloads.
 */
export function isQuickReplyButton(
    value: unknown,
): value is QuickReplyButtonInput {
    return (
        isRecord(value) &&
        (typeof value.id === 'string' ||
            typeof value.text === 'string' ||
            typeof value.displayText === 'string')
    );
}

/**
 * Runtime guard for supported native-flow button names.
 */
export function isInteractiveButtonName(
    value: string,
): value is InteractiveButtonName {
    return Object.values(InteractiveButtonName).includes(
        value as InteractiveButtonName,
    );
}
