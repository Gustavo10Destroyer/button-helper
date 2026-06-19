import type { NativeFlowButton, SerializedNativeFlowButton } from './buttonParams.js';
import type { MessageGenerationOptionsFromContent, MessageRelayOptions } from '@whiskeysockets/baileys';

/**
 * Supported normalized interactive message categories.
 */
export enum ButtonMessageType {
  List = 'list',
  Buttons = 'buttons',
  NativeFlow = 'native_flow',
}

/**
 * Public quick-reply authoring button.
 */
export interface QuickReplyButtonInput {
  /** Stable reply identifier returned by WhatsApp. */
  readonly id?: string;
  /** Button label. */
  readonly text?: string;
  /** Alternate button label accepted for compatibility. */
  readonly displayText?: string;
}

/**
 * Old Baileys button text wrapper accepted at the compatibility boundary.
 */
export interface LegacyBaileysButtonText {
  /** Button label from old Baileys payloads. */
  readonly displayText: string;
}

/**
 * Old Baileys button shape accepted at the compatibility boundary.
 */
export interface LegacyBaileysButtonInput {
  /** Stable reply identifier returned by WhatsApp. */
  readonly buttonId: string;
  /** Button label wrapper from old Baileys payloads. */
  readonly buttonText: LegacyBaileysButtonText;
}

/**
 * Authoring button accepted by the high-level APIs after legacy mapping.
 */
export type AuthoringButton =
  | QuickReplyButtonInput
  | LegacyBaileysButtonInput
  | NativeFlowButton
  | SerializedNativeFlowButton;

/**
 * Public payload accepted by sendButtons.
 */
export interface SendButtonsPayload {
  /** Message body text. */
  readonly text: string;
  /** Optional footer text. */
  readonly footer?: string;
  /** Optional header title. */
  readonly title?: string;
  /** Optional fallback header title when title is absent. */
  readonly subtitle?: string;
  /** Buttons rendered in the native-flow message. */
  readonly buttons: readonly AuthoringButton[];
}

/**
 * Public payload accepted by sendInteractiveMessage.
 */
export interface SendInteractiveMessagePayload {
  /** Message body text. */
  readonly text: string;
  /** Optional footer text. */
  readonly footer?: string;
  /** Optional header title. */
  readonly title?: string;
  /** Optional fallback header title when title is absent. */
  readonly subtitle?: string;
  /** Native-flow buttons rendered by WhatsApp. */
  readonly interactiveButtons: readonly AuthoringButton[];
}

/**
 * Send options consumed by the interactive message service.
 *
 * This type is composed from official Baileys generation and relay options.
 */
export type InteractiveRelayOptions = Omit<MessageGenerationOptionsFromContent, 'userJid'> & MessageRelayOptions;
