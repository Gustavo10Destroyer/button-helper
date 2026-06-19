/**
 * Supported WhatsApp native-flow button names.
 */
export enum InteractiveButtonName {
  QuickReply = 'quick_reply',
  CtaUrl = 'cta_url',
  CtaCopy = 'cta_copy',
  CtaCall = 'cta_call',
  CtaCatalog = 'cta_catalog',
  CtaReminder = 'cta_reminder',
  CtaCancelReminder = 'cta_cancel_reminder',
  AddressMessage = 'address_message',
  SendLocation = 'send_location',
  OpenWebview = 'open_webview',
  MultiProductMessage = 'mpm',
  PaymentTransactionDetails = 'wa_payment_transaction_details',
  AutomatedGreetingCatalog = 'automated_greeting_message_view_catalog',
  GalaxyMessage = 'galaxy_message',
  SingleSelect = 'single_select',
  ReviewAndPay = 'review_and_pay',
  PaymentInfo = 'payment_info',
  CallPermissionRequest = 'call_permission_request',
}

/**
 * Legacy helper button names allowed by the sendButtons convenience API.
 */
export type SendButtonsComplexName =
  | InteractiveButtonName.CtaUrl
  | InteractiveButtonName.CtaCopy
  | InteractiveButtonName.CtaCall;

/**
 * Common display text carried by most native-flow button parameter payloads.
 */
export interface DisplayTextParams {
  /** Text rendered on the button. */
  readonly displayText: string;
}

/**
 * Quick-reply button parameters.
 */
export interface QuickReplyParams extends DisplayTextParams {
  /** Stable reply identifier returned by WhatsApp when the user taps the button. */
  readonly id: string;
}

/**
 * URL call-to-action parameters.
 */
export interface CtaUrlParams extends DisplayTextParams {
  /** Destination URL opened by WhatsApp. */
  readonly url: string;
}

/**
 * Copy-code call-to-action parameters.
 */
export interface CtaCopyParams extends DisplayTextParams {
  /** Text copied to the user's clipboard. */
  readonly copyCode: string;
}

/**
 * Phone call call-to-action parameters.
 */
export interface CtaCallParams extends DisplayTextParams {
  /** Phone number dialed by the client. */
  readonly phoneNumber: string;
}

/**
 * Catalog-opening button parameters.
 */
export interface CatalogParams {
  /** Business phone number associated with the catalog. */
  readonly businessPhoneNumber: string;
}

/**
 * Product-specific catalog-opening parameters.
 */
export interface AutomatedGreetingCatalogParams extends CatalogParams {
  /** Product identifier inside the WhatsApp catalog. */
  readonly catalogProductId: string;
}

/**
 * Simple display-only action parameters.
 */
export interface SimpleDisplayActionParams extends DisplayTextParams {}

/**
 * Webview link descriptor.
 */
export interface WebviewLink {
  /** URL opened inside the webview. */
  readonly url: string;
}

/**
 * Webview button parameters.
 */
export interface OpenWebviewParams {
  /** Button title. */
  readonly title: string;
  /** Link descriptor expected by WhatsApp. */
  readonly link: WebviewLink;
}

/**
 * Multi-product message parameters.
 */
export interface MultiProductMessageParams {
  /** Product identifier opened by the message. */
  readonly productId: string;
}

/**
 * Payment transaction detail parameters.
 */
export interface PaymentTransactionDetailsParams {
  /** Transaction identifier rendered by WhatsApp. */
  readonly transactionId: string;
}

/**
 * Galaxy/flow message parameters.
 */
export interface GalaxyMessageParams {
  /** Flow token supplied by the business integration. */
  readonly flowToken: string;
  /** Flow identifier supplied by the business integration. */
  readonly flowId: string;
}

/**
 * Row shown inside a single-select section.
 */
export interface SingleSelectRow {
  /** Row identifier returned by WhatsApp on selection. */
  readonly id: string;
  /** Row title visible to the user. */
  readonly title: string;
  /** Optional row description. */
  readonly description?: string;
}

/**
 * Section grouping rows in a single-select list.
 */
export interface SingleSelectSection {
  /** Section title. */
  readonly title: string;
  /** Rows available in the section. */
  readonly rows: readonly SingleSelectRow[];
}

/**
 * Single-select native-flow parameters.
 */
export interface SingleSelectParams {
  /** Button/list title. */
  readonly title: string;
  /** Selectable sections. */
  readonly sections: readonly SingleSelectSection[];
}

/**
 * Native-flow parameter payloads keyed by supported button name.
 */
export interface ButtonParamsByName {
  readonly [InteractiveButtonName.QuickReply]: QuickReplyParams;
  readonly [InteractiveButtonName.CtaUrl]: CtaUrlParams;
  readonly [InteractiveButtonName.CtaCopy]: CtaCopyParams;
  readonly [InteractiveButtonName.CtaCall]: CtaCallParams;
  readonly [InteractiveButtonName.CtaCatalog]: CatalogParams;
  readonly [InteractiveButtonName.CtaReminder]: SimpleDisplayActionParams;
  readonly [InteractiveButtonName.CtaCancelReminder]: SimpleDisplayActionParams;
  readonly [InteractiveButtonName.AddressMessage]: SimpleDisplayActionParams;
  readonly [InteractiveButtonName.SendLocation]: SimpleDisplayActionParams;
  readonly [InteractiveButtonName.OpenWebview]: OpenWebviewParams;
  readonly [InteractiveButtonName.MultiProductMessage]: MultiProductMessageParams;
  readonly [InteractiveButtonName.PaymentTransactionDetails]: PaymentTransactionDetailsParams;
  readonly [InteractiveButtonName.AutomatedGreetingCatalog]: AutomatedGreetingCatalogParams;
  readonly [InteractiveButtonName.GalaxyMessage]: GalaxyMessageParams;
  readonly [InteractiveButtonName.SingleSelect]: SingleSelectParams;
  readonly [InteractiveButtonName.ReviewAndPay]: Record<string, never>;
  readonly [InteractiveButtonName.PaymentInfo]: Record<string, never>;
  readonly [InteractiveButtonName.CallPermissionRequest]: Record<string, never>;
}

/**
 * Button parameter payload accepted by any supported native-flow button.
 */
export type ButtonParams = ButtonParamsByName[InteractiveButtonName];

/**
 * Strongly typed native-flow authoring button.
 */
export type NativeFlowButton<TName extends InteractiveButtonName = InteractiveButtonName> = {
  /** Native-flow button name. */
  readonly name: TName;
  /** CamelCase parameter payload associated with the button name. */
  readonly params: ButtonParamsByName[TName];
};

/**
 * Serialized button shape required by Baileys protobuf generation.
 */
export interface SerializedNativeFlowButton {
  /** Native-flow button name. */
  readonly name: InteractiveButtonName;
  /** JSON string containing WhatsApp's external parameter schema. */
  readonly buttonParamsJson: string;
}
