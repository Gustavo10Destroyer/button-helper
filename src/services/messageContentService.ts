import type { WAMessageContent } from '@whiskeysockets/baileys';
import { buildInteractiveButtons } from '../mappers/buttonMapper.js';
import type { AuthoringButton, SendInteractiveMessagePayload } from '../types/entities.js';

/**
 * Converts high-level interactive authoring content to Baileys protobuf-compatible content.
 */
export function convertToInteractiveMessage(content: SendInteractiveMessagePayload): WAMessageContent {
  const interactiveButtons = buildInteractiveButtons(content.interactiveButtons as readonly AuthoringButton[]);
  const title = content.title ?? content.subtitle;

  return {
    interactiveMessage: {
      nativeFlowMessage: {
        buttons: interactiveButtons,
      },
      ...(title ? { header: { title } } : {}),
      ...(content.text ? { body: { text: content.text } } : {}),
      ...(content.footer ? { footer: { text: content.footer } } : {}),
    },
  };
}
