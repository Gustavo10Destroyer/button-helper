import {
    generateMessageIDV2,
    generateWAMessageFromContent,
    isJidGroup,
    normalizeMessageContent,
    type BinaryNode,
    type WAMessage,
    type WAMessageContent,
    type WASocket,
} from '@whiskeysockets/baileys';
import { InteractiveValidationError } from '../errors/InteractiveValidationError.js';
import { convertToInteractiveMessage } from './messageContentService.js';
import { getButtonArgs, getButtonType } from './buttonNodeService.js';
import {
    examplePayloads,
    validateAuthoringButtons,
    validateInteractiveMessageContent,
    validateSendButtonsPayload,
    validateSendInteractiveMessagePayload,
} from '../validators/buttonValidators.js';
import type {
    AuthoringButton,
    InteractiveRelayOptions,
    SendButtonsPayload,
    SendInteractiveMessagePayload,
} from '../types/entities.js';

const binaryAttributeKeys = {
    businessBot: 'biz_bot',
} as const;

/**
 * Sends a fully controlled WhatsApp interactive native-flow message.
 */
export async function sendInteractiveMessage(
    sock: WASocket,
    jid: string,
    content: SendInteractiveMessagePayload,
    options: InteractiveRelayOptions = {},
): Promise<WAMessage> {
    if (!sock) {
        throw new InteractiveValidationError('Socket is required', {
            context: 'sendInteractiveMessage',
        });
    }

    const strict = validateSendInteractiveMessagePayload(content);
    if (!strict.valid) {
        throw new InteractiveValidationError(
            'Interactive authoring payload invalid',
            {
                context:
                    'sendInteractiveMessage.validateSendInteractiveMessagePayload',
                errors: strict.errors,
                warnings: strict.warnings,
                example: examplePayloads.sendInteractiveMessage,
            },
        );
    }

    warnIfNeeded('sendInteractiveMessage warnings:', strict.warnings);

    const convertedContent = convertToInteractiveMessage(content);
    const contentValidation =
        validateInteractiveMessageContent(convertedContent);
    if (!contentValidation.valid) {
        throw new InteractiveValidationError(
            'Converted interactive content invalid',
            {
                context:
                    'sendInteractiveMessage.validateInteractiveMessageContent',
                errors: contentValidation.errors,
                warnings: contentValidation.warnings,
                example: convertToInteractiveMessage(
                    examplePayloads.sendInteractiveMessage,
                ),
            },
        );
    }

    warnIfNeeded('Interactive content warnings:', contentValidation.warnings);

    const userJid = resolveUserJid(sock);
    const fullMessage = generateWAMessageFromContent(jid, convertedContent, {
        userJid,
        messageId: generateMessageIDV2(userJid),
        timestamp: new Date(),
        ...toGenerationOptions(options),
    });

    if (!fullMessage.message) {
        throw new InteractiveValidationError(
            'Generated WhatsApp message is empty',
            {
                context: 'sendInteractiveMessage.generateWAMessageFromContent',
            },
        );
    }

    if (!fullMessage.key.id) {
        throw new InteractiveValidationError(
            'Generated WhatsApp message is missing an id',
            {
                context: 'sendInteractiveMessage.generateWAMessageFromContent',
            },
        );
    }

    const normalizedContent = normalizeMessageContent(fullMessage.message);
    const additionalNodes = buildAdditionalNodes(
        jid,
        normalizedContent,
        options,
    );

    await sock.relayMessage(jid, fullMessage.message, {
        messageId: fullMessage.key.id,
        ...(options.useCachedGroupMetadata === undefined
            ? {}
            : { useCachedGroupMetadata: options.useCachedGroupMetadata }),
        additionalAttributes: options.additionalAttributes ?? {},
        ...(options.statusJidList === undefined
            ? {}
            : { statusJidList: options.statusJidList }),
        additionalNodes,
    });

    return fullMessage;
}

/**
 * Sends a convenient quick-reply-oriented interactive message.
 */
export async function sendInteractiveButtonsBasic(
    sock: WASocket,
    jid: string,
    data: SendButtonsPayload,
    options: InteractiveRelayOptions = {},
): Promise<WAMessage> {
    if (!sock) {
        throw new InteractiveValidationError('Socket is required', {
            context: 'sendButtons',
        });
    }

    const strict = validateSendButtonsPayload(data);
    if (!strict.valid) {
        throw new InteractiveValidationError('Buttons payload invalid', {
            context: 'sendButtons.validateSendButtonsPayload',
            errors: strict.errors,
            warnings: strict.warnings,
            example: examplePayloads.sendButtons,
        });
    }

    warnIfNeeded('sendButtons warnings:', strict.warnings);

    const authoringValidation = validateAuthoringButtons(data.buttons);
    if (!authoringValidation.valid) {
        throw new InteractiveValidationError(
            'Authoring button objects invalid',
            {
                context: 'sendButtons.validateAuthoringButtons',
                errors: authoringValidation.errors,
                warnings: authoringValidation.warnings,
                example: examplePayloads.sendButtons.buttons,
            },
        );
    }

    warnIfNeeded('Button validation warnings:', authoringValidation.warnings);

    const payload: SendInteractiveMessagePayload = {
        text: data.text,
        ...(data.footer ? { footer: data.footer } : {}),
        ...(data.title ? { title: data.title } : {}),
        ...(data.subtitle ? { subtitle: data.subtitle } : {}),
        interactiveButtons: (authoringValidation.cleaned ??
            []) as readonly AuthoringButton[],
    };

    return sendInteractiveMessage(sock, jid, payload, options);
}

function buildAdditionalNodes(
    jid: string,
    normalizedContent: WAMessageContent | undefined,
    options: InteractiveRelayOptions,
): BinaryNode[] {
    const buttonType = getButtonType(normalizedContent);
    const additionalNodes = [...(options.additionalNodes ?? [])];

    if (!buttonType || !normalizedContent) {
        return additionalNodes;
    }

    const buttonsNode = getButtonArgs(normalizedContent);
    const privateChat = !isJidGroup(jid);
    additionalNodes.push(buttonsNode);

    if (privateChat) {
        additionalNodes.push({
            tag: 'bot',
            attrs: { [binaryAttributeKeys.businessBot]: '1' },
        });
    }

    console.log('Interactive send:', {
        type: buttonType,
        nodes: additionalNodes.map((node) => ({
            tag: node.tag,
            attrs: node.attrs,
        })),
        private: privateChat,
    });

    return additionalNodes;
}

function resolveUserJid(sock: WASocket): string {
    return sock.authState?.creds?.me?.id ?? sock.user?.id ?? '';
}

function warnIfNeeded(label: string, warnings: readonly string[]): void {
    if (warnings.length > 0) {
        console.warn(label, warnings);
    }
}

function toGenerationOptions(
    options: InteractiveRelayOptions,
): Record<string, unknown> {
    const {
        additionalAttributes,
        additionalNodes,
        statusJidList,
        useCachedGroupMetadata,
        ...generationOptions
    } = options;
    return generationOptions;
}
