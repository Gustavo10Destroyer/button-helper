import { parseButtonParamsJson } from '../mappers/buttonParamsMapper.js';
import {
  isInteractiveButtonName,
  isLegacyBaileysButton,
  isQuickReplyButton,
  isSerializedNativeFlowButton,
  isTypedNativeFlowButton,
} from '../mappers/buttonMapper.js';
import { InteractiveButtonName, type SendButtonsComplexName } from '../types/buttonParams.js';
import type { AuthoringButton, SendButtonsPayload, SendInteractiveMessagePayload } from '../types/entities.js';
import type { ValidationResult } from '../types/common.js';
import { isRecord } from '../parsers/jsonParser.js';

const softButtonCap = 25;

const sendButtonsAllowedComplexNames = new Set<SendButtonsComplexName>([
  InteractiveButtonName.CtaUrl,
  InteractiveButtonName.CtaCopy,
  InteractiveButtonName.CtaCall,
]);

const interactiveAllowedNames = new Set<InteractiveButtonName>(Object.values(InteractiveButtonName));

/**
 * Canonical examples included in structured validation errors.
 */
export const examplePayloads = {
  sendButtons: {
    text: 'Choose an option',
    buttons: [
      { id: 'opt1', text: 'Option 1' },
      { id: 'opt2', text: 'Option 2' },
      { name: InteractiveButtonName.CtaUrl, params: { displayText: 'Visit Site', url: 'https://example.com' } },
    ],
    footer: 'Footer text',
  },
  sendInteractiveMessage: {
    text: 'Pick an action',
    interactiveButtons: [
      { name: InteractiveButtonName.QuickReply, params: { displayText: 'Hello', id: 'hello' } },
      { name: InteractiveButtonName.CtaCopy, params: { displayText: 'Copy Code', copyCode: 'ABC123' } },
    ],
    footer: 'Footer',
  },
} as const;

/**
 * Validates liberal authoring buttons before mapping them to native-flow buttons.
 */
export function validateAuthoringButtons(buttons: unknown): ValidationResult<AuthoringButton[]> {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (buttons === null || buttons === undefined) {
    return { valid: true, errors, warnings, cleaned: [] };
  }

  if (!Array.isArray(buttons)) {
    return { valid: false, errors: ['buttons must be an array'], warnings, cleaned: [] };
  }

  if (buttons.length === 0) {
    warnings.push('buttons array is empty');
  } else if (buttons.length > softButtonCap) {
    warnings.push(`buttons count (${buttons.length}) exceeds soft cap of ${softButtonCap}; may be rejected by client`);
  }

  const cleaned: AuthoringButton[] = [];
  buttons.forEach((button, index) => {
    if (!isRecord(button)) {
      errors.push(`button[${index}] is not an object`);
      return;
    }

    if (isTypedNativeFlowButton(button) || isSerializedNativeFlowButton(button) || isLegacyBaileysButton(button) || isQuickReplyButton(button)) {
      cleaned.push(button);
      return;
    }

    warnings.push(`button[${index}] unrecognized shape; it cannot be converted safely`);
  });

  return { valid: errors.length === 0, errors, warnings, cleaned };
}

/**
 * Strict validator for the sendButtons convenience payload.
 */
export function validateSendButtonsPayload(data: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(data)) {
    return { valid: false, errors: ['payload must be an object'], warnings };
  }

  if (typeof data.text !== 'string' || data.text.length === 0) {
    errors.push('text is mandatory and must be a string');
  }

  if (!Array.isArray(data.buttons) || data.buttons.length === 0) {
    errors.push('buttons is mandatory and must be a non-empty array');
  } else {
    data.buttons.forEach((button, index) => validateSendButtonsButton(button, index, errors));
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Strict validator for the sendInteractiveMessage authoring payload.
 */
export function validateSendInteractiveMessagePayload(data: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(data)) {
    return { valid: false, errors: ['payload must be an object'], warnings };
  }

  if (typeof data.text !== 'string' || data.text.length === 0) {
    errors.push('text is mandatory and must be a string');
  }

  if (!Array.isArray(data.interactiveButtons) || data.interactiveButtons.length === 0) {
    errors.push('interactiveButtons is mandatory and must be a non-empty array');
  } else {
    data.interactiveButtons.forEach((button, index) => validateInteractiveAuthoringButton(button, index, errors));
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validates converted interactive message content before Baileys generation.
 */
export function validateInteractiveMessageContent(content: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(content)) {
    return { valid: false, errors: ['content must be an object'], warnings };
  }

  const interactive = content.interactiveMessage;
  if (interactive === undefined) {
    return { valid: true, errors, warnings };
  }

  if (!isRecord(interactive)) {
    return { valid: false, errors: ['interactiveMessage must be an object'], warnings };
  }

  const nativeFlow = interactive.nativeFlowMessage;
  if (!isRecord(nativeFlow)) {
    return { valid: false, errors: ['interactiveMessage.nativeFlowMessage missing'], warnings };
  }

  if (!Array.isArray(nativeFlow.buttons)) {
    return { valid: false, errors: ['nativeFlowMessage.buttons must be an array'], warnings };
  }

  if (nativeFlow.buttons.length === 0) {
    warnings.push('nativeFlowMessage.buttons is empty');
  }

  nativeFlow.buttons.forEach((button, index) => {
    if (!isSerializedNativeFlowButton(button)) {
      errors.push(`buttons[${index}] must include a supported name and string buttonParamsJson`);
      return;
    }

    try {
      parseButtonParamsJson(button.name, button.buttonParamsJson);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown buttonParamsJson validation error';
      warnings.push(`buttons[${index}] ${message}`);
    }
  });

  return { valid: errors.length === 0, errors, warnings };
}

function validateSendButtonsButton(button: unknown, index: number, errors: string[]): void {
  if (!isRecord(button)) {
    errors.push(`button[${index}] must be an object`);
    return;
  }

  if (typeof button.id === 'string' && typeof button.text === 'string') {
    return;
  }

  if (isTypedNativeFlowButton(button)) {
    if (!sendButtonsAllowedComplexNames.has(button.name as SendButtonsComplexName)) {
      errors.push(`button[${index}] name '${button.name}' not allowed in sendButtons`);
    }
    return;
  }

  if (isSerializedNativeFlowButton(button)) {
    if (!sendButtonsAllowedComplexNames.has(button.name as SendButtonsComplexName)) {
      errors.push(`button[${index}] name '${button.name}' not allowed in sendButtons`);
      return;
    }
    validateSerializedButtonParams(button.name, button.buttonParamsJson, index, errors);
    return;
  }

  errors.push(
    `button[${index}] invalid shape (must be legacy quick reply or named ${Array.from(sendButtonsAllowedComplexNames).join(', ')})`,
  );
}

function validateInteractiveAuthoringButton(button: unknown, index: number, errors: string[]): void {
  if (!isRecord(button)) {
    errors.push(`interactiveButtons[${index}] must be an object`);
    return;
  }

  const name = button.name;
  if (typeof name !== 'string' || !isInteractiveButtonName(name)) {
    errors.push(`interactiveButtons[${index}] missing or unsupported name`);
    return;
  }

  if (!interactiveAllowedNames.has(name)) {
    errors.push(`interactiveButtons[${index}] name '${name}' not allowed`);
    return;
  }

  if (isTypedNativeFlowButton(button)) {
    return;
  }

  if (typeof button.buttonParamsJson !== 'string') {
    errors.push(`interactiveButtons[${index}] buttonParamsJson must be string when params are not provided`);
    return;
  }

  validateSerializedButtonParams(name, button.buttonParamsJson, index, errors);
}

function validateSerializedButtonParams(name: InteractiveButtonName, buttonParamsJson: string, index: number, errors: string[]): void {
  try {
    parseButtonParamsJson(name, buttonParamsJson);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown button parameter validation error';
    errors.push(`button[${index}] (${name}) ${message}`);
  }
}
