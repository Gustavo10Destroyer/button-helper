import {
    type AutomatedGreetingCatalogParams,
    type ButtonParams,
    type ButtonParamsByName,
    type CatalogParams,
    type CtaCallParams,
    type CtaCopyParams,
    type CtaUrlParams,
    type GalaxyMessageParams,
    InteractiveButtonName,
    type MultiProductMessageParams,
    type NativeFlowButton,
    type OpenWebviewParams,
    type PaymentTransactionDetailsParams,
    type QuickReplyParams,
    type SerializedNativeFlowButton,
    type SimpleDisplayActionParams,
    type SingleSelectParams,
    type SingleSelectRow,
    type SingleSelectSection,
} from '../types/buttonParams.js';
import type { JsonObject } from '../types/common.js';
import {
    parseJson,
    requireRecord,
    requireStringField,
    optionalStringField,
} from '../parsers/jsonParser.js';

const fieldKeys = {
    displayText: 'display_text',
    copyCode: 'copy_code',
    phoneNumber: 'phone_number',
    businessPhoneNumber: 'business_phone_number',
    catalogProductId: 'catalog_product_id',
    productId: 'product_id',
    transactionId: 'transaction_id',
    flowToken: 'flow_token',
    flowId: 'flow_id',
} as const;

/**
 * Converts a typed native-flow button to Baileys' serialized button shape.
 */
export function serializeNativeFlowButton(
    button: NativeFlowButton,
): SerializedNativeFlowButton {
    return {
        name: button.name,
        buttonParamsJson: JSON.stringify(
            toExternalButtonParams(button.name, button.params),
        ),
    };
}

/**
 * Converts a serialized Baileys button into a typed native-flow button.
 */
export function deserializeNativeFlowButton(
    button: SerializedNativeFlowButton,
): NativeFlowButton {
    return {
        name: button.name,
        params: parseButtonParamsJson(button.name, button.buttonParamsJson),
    } as NativeFlowButton;
}

/**
 * Parses an external WhatsApp parameter JSON string into a camelCase domain model.
 */
export function parseButtonParamsJson<TName extends InteractiveButtonName>(
    name: TName,
    buttonParamsJson: string,
): ButtonParamsByName[TName] {
    const record = requireRecord(
        parseJson(buttonParamsJson, `buttonParamsJson for ${name}`),
        `buttonParamsJson for ${name}`,
    );

    switch (name) {
        case InteractiveButtonName.QuickReply:
            return {
                displayText: requireStringField(
                    record,
                    fieldKeys.displayText,
                    name,
                ),
                id: requireStringField(record, 'id', name),
            } as ButtonParamsByName[TName];
        case InteractiveButtonName.CtaUrl:
            return {
                displayText: requireStringField(
                    record,
                    fieldKeys.displayText,
                    name,
                ),
                url: requireStringField(record, 'url', name),
            } as ButtonParamsByName[TName];
        case InteractiveButtonName.CtaCopy:
            return {
                displayText: requireStringField(
                    record,
                    fieldKeys.displayText,
                    name,
                ),
                copyCode: requireStringField(record, fieldKeys.copyCode, name),
            } as ButtonParamsByName[TName];
        case InteractiveButtonName.CtaCall:
            return {
                displayText: requireStringField(
                    record,
                    fieldKeys.displayText,
                    name,
                ),
                phoneNumber: requireStringField(
                    record,
                    fieldKeys.phoneNumber,
                    name,
                ),
            } as ButtonParamsByName[TName];
        case InteractiveButtonName.CtaCatalog:
            return {
                businessPhoneNumber: requireStringField(
                    record,
                    fieldKeys.businessPhoneNumber,
                    name,
                ),
            } as ButtonParamsByName[TName];
        case InteractiveButtonName.CtaReminder:
        case InteractiveButtonName.CtaCancelReminder:
        case InteractiveButtonName.AddressMessage:
        case InteractiveButtonName.SendLocation:
            return {
                displayText: requireStringField(
                    record,
                    fieldKeys.displayText,
                    name,
                ),
            } as ButtonParamsByName[TName];
        case InteractiveButtonName.OpenWebview: {
            const link = requireRecord(record.link, `${name}.link`);
            return {
                title: requireStringField(record, 'title', name),
                link: {
                    url: requireStringField(link, 'url', `${name}.link`),
                },
            } as ButtonParamsByName[TName];
        }
        case InteractiveButtonName.MultiProductMessage:
            return {
                productId: requireStringField(
                    record,
                    fieldKeys.productId,
                    name,
                ),
            } as ButtonParamsByName[TName];
        case InteractiveButtonName.PaymentTransactionDetails:
            return {
                transactionId: requireStringField(
                    record,
                    fieldKeys.transactionId,
                    name,
                ),
            } as ButtonParamsByName[TName];
        case InteractiveButtonName.AutomatedGreetingCatalog:
            return {
                businessPhoneNumber: requireStringField(
                    record,
                    fieldKeys.businessPhoneNumber,
                    name,
                ),
                catalogProductId: requireStringField(
                    record,
                    fieldKeys.catalogProductId,
                    name,
                ),
            } as ButtonParamsByName[TName];
        case InteractiveButtonName.GalaxyMessage:
            return {
                flowToken: requireStringField(
                    record,
                    fieldKeys.flowToken,
                    name,
                ),
                flowId: requireStringField(record, fieldKeys.flowId, name),
            } as ButtonParamsByName[TName];
        case InteractiveButtonName.SingleSelect:
            return parseSingleSelectParams(
                record,
                name,
            ) as ButtonParamsByName[TName];
        case InteractiveButtonName.ReviewAndPay:
        case InteractiveButtonName.PaymentInfo:
        case InteractiveButtonName.CallPermissionRequest:
            return {} as ButtonParamsByName[TName];
        default:
            return assertNever(name);
    }
}

/**
 * Converts a camelCase domain parameter object to WhatsApp's external JSON schema.
 */
export function toExternalButtonParams(
    name: InteractiveButtonName,
    params: ButtonParams,
): JsonObject {
    switch (name) {
        case InteractiveButtonName.QuickReply: {
            const typed = params as QuickReplyParams;
            return { [fieldKeys.displayText]: typed.displayText, id: typed.id };
        }
        case InteractiveButtonName.CtaUrl: {
            const typed = params as CtaUrlParams;
            return {
                [fieldKeys.displayText]: typed.displayText,
                url: typed.url,
            };
        }
        case InteractiveButtonName.CtaCopy: {
            const typed = params as CtaCopyParams;
            return {
                [fieldKeys.displayText]: typed.displayText,
                [fieldKeys.copyCode]: typed.copyCode,
            };
        }
        case InteractiveButtonName.CtaCall: {
            const typed = params as CtaCallParams;
            return {
                [fieldKeys.displayText]: typed.displayText,
                [fieldKeys.phoneNumber]: typed.phoneNumber,
            };
        }
        case InteractiveButtonName.CtaCatalog: {
            const typed = params as CatalogParams;
            return {
                [fieldKeys.businessPhoneNumber]: typed.businessPhoneNumber,
            };
        }
        case InteractiveButtonName.CtaReminder:
        case InteractiveButtonName.CtaCancelReminder:
        case InteractiveButtonName.AddressMessage:
        case InteractiveButtonName.SendLocation: {
            const typed = params as SimpleDisplayActionParams;
            return { [fieldKeys.displayText]: typed.displayText };
        }
        case InteractiveButtonName.OpenWebview: {
            const typed = params as OpenWebviewParams;
            return { title: typed.title, link: { url: typed.link.url } };
        }
        case InteractiveButtonName.MultiProductMessage: {
            const typed = params as MultiProductMessageParams;
            return { [fieldKeys.productId]: typed.productId };
        }
        case InteractiveButtonName.PaymentTransactionDetails: {
            const typed = params as PaymentTransactionDetailsParams;
            return { [fieldKeys.transactionId]: typed.transactionId };
        }
        case InteractiveButtonName.AutomatedGreetingCatalog: {
            const typed = params as AutomatedGreetingCatalogParams;
            return {
                [fieldKeys.businessPhoneNumber]: typed.businessPhoneNumber,
                [fieldKeys.catalogProductId]: typed.catalogProductId,
            };
        }
        case InteractiveButtonName.GalaxyMessage: {
            const typed = params as GalaxyMessageParams;
            return {
                [fieldKeys.flowToken]: typed.flowToken,
                [fieldKeys.flowId]: typed.flowId,
            };
        }
        case InteractiveButtonName.SingleSelect:
            return toExternalSingleSelectParams(params as SingleSelectParams);
        case InteractiveButtonName.ReviewAndPay:
        case InteractiveButtonName.PaymentInfo:
        case InteractiveButtonName.CallPermissionRequest:
            return {};
        default:
            return assertNever(name);
    }
}

function parseSingleSelectParams(
    record: Record<string, unknown>,
    context: string,
): SingleSelectParams {
    const sectionsValue = record.sections;
    if (!Array.isArray(sectionsValue) || sectionsValue.length === 0) {
        throw new Error(`${context}.sections must be a non-empty array`);
    }

    return {
        title: requireStringField(record, 'title', context),
        sections: sectionsValue.map((section, sectionIndex) =>
            parseSingleSelectSection(
                section,
                `${context}.sections[${sectionIndex}]`,
            ),
        ),
    };
}

function parseSingleSelectSection(
    value: unknown,
    context: string,
): SingleSelectSection {
    const record = requireRecord(value, context);
    const rowsValue = record.rows;
    if (!Array.isArray(rowsValue) || rowsValue.length === 0) {
        throw new Error(`${context}.rows must be a non-empty array`);
    }

    return {
        title: requireStringField(record, 'title', context),
        rows: rowsValue.map((row, rowIndex) =>
            parseSingleSelectRow(row, `${context}.rows[${rowIndex}]`),
        ),
    };
}

function parseSingleSelectRow(
    value: unknown,
    context: string,
): SingleSelectRow {
    const record = requireRecord(value, context);
    const description = optionalStringField(record, 'description');

    return {
        id: requireStringField(record, 'id', context),
        title: requireStringField(record, 'title', context),
        ...(description ? { description } : {}),
    };
}

function toExternalSingleSelectParams(params: SingleSelectParams): JsonObject {
    return {
        title: params.title,
        sections: params.sections.map((section) => ({
            title: section.title,
            rows: section.rows.map((row) => ({
                id: row.id,
                title: row.title,
                ...(row.description ? { description: row.description } : {}),
            })),
        })),
    };
}

function assertNever(value: never): never {
    throw new Error(`Unsupported button name: ${String(value)}`);
}
