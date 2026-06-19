import type { BinaryNode, WAMessageContent } from '@whiskeysockets/baileys';
import { InteractiveButtonName } from '../types/buttonParams.js';
import { isInteractiveButtonName } from '../mappers/buttonMapper.js';
import { ButtonMessageType } from '../types/entities.js';

const specializedNativeFlows = new Set<InteractiveButtonName>([
    InteractiveButtonName.MultiProductMessage,
    InteractiveButtonName.CtaCatalog,
    InteractiveButtonName.SendLocation,
    InteractiveButtonName.CallPermissionRequest,
    InteractiveButtonName.PaymentTransactionDetails,
    InteractiveButtonName.AutomatedGreetingCatalog,
]);

const binaryAttributeKeys = {
    nativeFlowName: 'native_flow_name',
} as const;

/**
 * Determines which interactive category a normalized WhatsApp message belongs to.
 */
export function getButtonType(
    message: WAMessageContent | undefined,
): ButtonMessageType | null {
    if (!message) {
        return null;
    }

    if (message.listMessage) {
        return ButtonMessageType.List;
    }

    if (message.buttonsMessage) {
        return ButtonMessageType.Buttons;
    }

    if (message.interactiveMessage?.nativeFlowMessage) {
        return ButtonMessageType.NativeFlow;
    }

    return null;
}

/**
 * Builds the WhatsApp binary node tree required for interactive rendering.
 */
export function getButtonArgs(message: WAMessageContent): BinaryNode {
    const nativeFlow = message.interactiveMessage?.nativeFlowMessage;
    const firstButtonName = nativeFlow?.buttons?.[0]?.name;

    if (
        firstButtonName === InteractiveButtonName.ReviewAndPay ||
        firstButtonName === InteractiveButtonName.PaymentInfo
    ) {
        return {
            tag: 'biz',
            attrs: {
                [binaryAttributeKeys.nativeFlowName]:
                    firstButtonName === InteractiveButtonName.ReviewAndPay
                        ? 'order_details'
                        : firstButtonName,
            },
        };
    }

    if (isSpecializedNativeFlowName(firstButtonName)) {
        return {
            tag: 'biz',
            attrs: {},
            content: [
                {
                    tag: 'interactive',
                    attrs: {
                        type: 'native_flow',
                        v: '1',
                    },
                    content: [
                        {
                            tag: 'native_flow',
                            attrs: {
                                v: '2',
                                name: firstButtonName,
                            },
                        },
                    ],
                },
            ],
        };
    }

    if (nativeFlow || message.buttonsMessage) {
        return {
            tag: 'biz',
            attrs: {},
            content: [
                {
                    tag: 'interactive',
                    attrs: {
                        type: 'native_flow',
                        v: '1',
                    },
                    content: [
                        {
                            tag: 'native_flow',
                            attrs: {
                                v: '9',
                                name: 'mixed',
                            },
                        },
                    ],
                },
            ],
        };
    }

    if (message.listMessage) {
        return {
            tag: 'biz',
            attrs: {},
            content: [
                {
                    tag: 'list',
                    attrs: {
                        v: '2',
                        type: 'product_list',
                    },
                },
            ],
        };
    }

    return {
        tag: 'biz',
        attrs: {},
    };
}

function isSpecializedNativeFlowName(
    name: string | null | undefined,
): name is InteractiveButtonName {
    return (
        typeof name === 'string' &&
        isInteractiveButtonName(name) &&
        specializedNativeFlows.has(name)
    );
}
