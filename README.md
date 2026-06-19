# Button Helper

TypeScript helper utilities for sending WhatsApp interactive buttons and native-flow messages through [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys).

This package gives you a TypeScript-first API for WhatsApp native-flow buttons. You write camelCase objects, and the library converts them to the WhatsApp payload format expected by Baileys.

The base project is [Scratchive-Module-BaileysHelper](https://github.com/mehebub648/Scratchive-Module-BaileysHelper), from [mehebub648](https://github.com/mehebub648), thanks a lot.

> [!IMPORTANT]
> This refactor was completely made by AI using Codex.

## Installation

```bash
npm install @destroyer/button-helper @whiskeysockets/baileys
```

`@whiskeysockets/baileys` is a peer dependency. The public API accepts the official Baileys `WASocket` type directly.

## Quick Start

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;

const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Choose an option',
  interactiveButtons: [
    {
      name: InteractiveButtonName.QuickReply,
      params: {
        displayText: 'Option 1',
        id: 'option_1',
      },
    },
  ],
});
```

## Core Concepts

`sendButtons` is the convenience API for common quick replies and a small set of CTA buttons.

`sendInteractiveMessage` is the full native-flow API. Use it when you want any supported `InteractiveButtonName`.

All TypeScript-facing payloads use camelCase. WhatsApp wire payload fields such as `display_text`, `copy_code`, and `phone_number` are generated internally.

## Supported Button Types

The enum values below are exported as `InteractiveButtonName`.

### Quick Reply

Purpose: send a standard reply button.

Description: the user taps the button and WhatsApp returns the configured `id`.

TypeScript interface: `QuickReplyParams`

Generated WhatsApp payload behavior: serializes to `{"display_text":"...","id":"..."}`.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| displayText | string | Yes | Text shown on the button. |
| id | string | Yes | Identifier returned when the user selects the button. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Choose an option',
  interactiveButtons: [
    {
      name: InteractiveButtonName.QuickReply,
      params: {
        displayText: 'Option 1',
        id: 'option_1',
      },
    },
  ],
});
```

### CTA URL

Purpose: open a website or external URL.

Description: renders a call-to-action button that opens `url`.

TypeScript interface: `CtaUrlParams`

Generated WhatsApp payload behavior: serializes to `{"display_text":"...","url":"..."}`.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| displayText | string | Yes | Text shown on the button. |
| url | string | Yes | URL opened by WhatsApp. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Visit our website',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaUrl,
      params: {
        displayText: 'Open Website',
        url: 'https://example.com',
      },
    },
  ],
});
```

### CTA Copy

Purpose: let the user copy a code or short text.

Description: renders a copy-code button.

TypeScript interface: `CtaCopyParams`

Generated WhatsApp payload behavior: serializes to `{"display_text":"...","copy_code":"..."}`.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| displayText | string | Yes | Text shown on the button. |
| copyCode | string | Yes | Text copied to the user's clipboard. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Use this discount code at checkout',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaCopy,
      params: {
        displayText: 'Copy Code',
        copyCode: 'SAVE20',
      },
    },
  ],
});
```

### CTA Call

Purpose: start a phone call.

Description: renders a button that opens the phone dialer with `phoneNumber`.

TypeScript interface: `CtaCallParams`

Generated WhatsApp payload behavior: serializes to `{"display_text":"...","phone_number":"..."}`.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| displayText | string | Yes | Text shown on the button. |
| phoneNumber | string | Yes | Phone number dialed by the client. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Need help?',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaCall,
      params: {
        displayText: 'Call Support',
        phoneNumber: '+5511999999999',
      },
    },
  ],
});
```

### CTA Catalog

Purpose: open a business catalog.

Description: renders a catalog-oriented native-flow button. WhatsApp clients may require a valid business account and catalog.

TypeScript interface: `CatalogParams`

Generated WhatsApp payload behavior: serializes to `{"business_phone_number":"..."}` and uses a specialized native-flow binary node.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| businessPhoneNumber | string | Yes | Business phone number associated with the catalog. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Browse our catalog',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaCatalog,
      params: {
        businessPhoneNumber: '+5511999999999',
      },
    },
  ],
});
```

### CTA Reminder

Purpose: create or view a reminder action.

Description: renders a reminder-style native-flow button where supported by the WhatsApp client.

TypeScript interface: `SimpleDisplayActionParams`

Generated WhatsApp payload behavior: serializes to `{"display_text":"..."}`.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| displayText | string | Yes | Text shown on the button. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Do you want a reminder?',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaReminder,
      params: {
        displayText: 'Set Reminder',
      },
    },
  ],
});
```

### CTA Cancel Reminder

Purpose: cancel a reminder action.

Description: renders a cancel-reminder native-flow button where supported by the WhatsApp client.

TypeScript interface: `SimpleDisplayActionParams`

Generated WhatsApp payload behavior: serializes to `{"display_text":"..."}`.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| displayText | string | Yes | Text shown on the button. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Your reminder is active',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaCancelReminder,
      params: {
        displayText: 'Cancel Reminder',
      },
    },
  ],
});
```

### Address Message

Purpose: request or display an address-related action.

Description: renders an address native-flow button where supported by the WhatsApp client.

TypeScript interface: `SimpleDisplayActionParams`

Generated WhatsApp payload behavior: serializes to `{"display_text":"..."}`.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| displayText | string | Yes | Text shown on the button. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Please confirm your delivery address',
  interactiveButtons: [
    {
      name: InteractiveButtonName.AddressMessage,
      params: {
        displayText: 'Send Address',
      },
    },
  ],
});
```

### Send Location

Purpose: request a location from the user.

Description: renders a location native-flow button and uses a specialized native-flow binary node.

TypeScript interface: `SimpleDisplayActionParams`

Generated WhatsApp payload behavior: serializes to `{"display_text":"..."}` and uses the `send_location` native-flow node.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| displayText | string | Yes | Text shown on the button. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Share your location so we can find the nearest store',
  interactiveButtons: [
    {
      name: InteractiveButtonName.SendLocation,
      params: {
        displayText: 'Send Location',
      },
    },
  ],
});
```

### Open Webview

Purpose: open a webview inside WhatsApp.

Description: renders a webview action with a title and link object.

TypeScript interface: `OpenWebviewParams`

Generated WhatsApp payload behavior: serializes to `{"title":"...","link":{"url":"..."}}`.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| title | string | Yes | Button or webview title. |
| link | WebviewLink | Yes | Link descriptor. |
| link.url | string | Yes | URL opened inside the webview. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Complete your form',
  interactiveButtons: [
    {
      name: InteractiveButtonName.OpenWebview,
      params: {
        title: 'Open Form',
        link: {
          url: 'https://example.com/form',
        },
      },
    },
  ],
});
```

### Multi Product Message

Purpose: open a product-oriented native-flow message.

Description: references a product by ID. WhatsApp clients may require a valid business catalog.

TypeScript interface: `MultiProductMessageParams`

Generated WhatsApp payload behavior: serializes to `{"product_id":"..."}` and uses the `mpm` specialized native-flow node.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| productId | string | Yes | Product identifier opened by the message. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'See today’s featured product',
  interactiveButtons: [
    {
      name: InteractiveButtonName.MultiProductMessage,
      params: {
        productId: 'product_123',
      },
    },
  ],
});
```

### Payment Transaction Details

Purpose: open payment transaction details.

Description: references a payment transaction by ID. Rendering depends on WhatsApp account and client support.

TypeScript interface: `PaymentTransactionDetailsParams`

Generated WhatsApp payload behavior: serializes to `{"transaction_id":"..."}` and uses a specialized native-flow node.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| transactionId | string | Yes | Transaction identifier rendered by WhatsApp. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Your payment was received',
  interactiveButtons: [
    {
      name: InteractiveButtonName.PaymentTransactionDetails,
      params: {
        transactionId: 'txn_987654',
      },
    },
  ],
});
```

### Automated Greeting Catalog

Purpose: open a catalog product from an automated greeting.

Description: references a business phone number and a catalog product ID. WhatsApp clients may require business catalog support.

TypeScript interface: `AutomatedGreetingCatalogParams`

Generated WhatsApp payload behavior: serializes to `{"business_phone_number":"...","catalog_product_id":"..."}` and uses a specialized native-flow node.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| businessPhoneNumber | string | Yes | Business phone number associated with the catalog. |
| catalogProductId | string | Yes | Product identifier inside the catalog. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Welcome! Start with our most popular item',
  interactiveButtons: [
    {
      name: InteractiveButtonName.AutomatedGreetingCatalog,
      params: {
        businessPhoneNumber: '+5511999999999',
        catalogProductId: 'catalog_product_123',
      },
    },
  ],
});
```

### Galaxy Message

Purpose: launch a flow-like experience.

Description: carries a flow token and flow ID used by native-flow integrations.

TypeScript interface: `GalaxyMessageParams`

Generated WhatsApp payload behavior: serializes to `{"flow_token":"...","flow_id":"..."}`.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| flowToken | string | Yes | Flow token supplied by the business integration. |
| flowId | string | Yes | Flow identifier supplied by the business integration. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Start the onboarding flow',
  interactiveButtons: [
    {
      name: InteractiveButtonName.GalaxyMessage,
      params: {
        flowToken: 'flow_token_abc',
        flowId: 'flow_123',
      },
    },
  ],
});
```

### Single Select

Purpose: present grouped selectable rows.

Description: renders a list-like native-flow interaction with sections and rows.

TypeScript interface: `SingleSelectParams`

Generated WhatsApp payload behavior: serializes to `{"title":"...","sections":[...]}`.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| title | string | Yes | Button or list title. |
| sections | readonly SingleSelectSection[] | Yes | Non-empty section list. |
| sections[].title | string | Yes | Section title. |
| sections[].rows | readonly SingleSelectRow[] | Yes | Non-empty row list. |
| sections[].rows[].id | string | Yes | Row identifier returned on selection. |
| sections[].rows[].title | string | Yes | Row title. |
| sections[].rows[].description | string | No | Optional row description. |

Optional parameters: `description` on each row.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Choose a department',
  interactiveButtons: [
    {
      name: InteractiveButtonName.SingleSelect,
      params: {
        title: 'Departments',
        sections: [
          {
            title: 'Support',
            rows: [
              { id: 'billing', title: 'Billing', description: 'Invoices and payments' },
              { id: 'technical', title: 'Technical Support' },
            ],
          },
        ],
      },
    },
  ],
});
```

### Review And Pay

Purpose: trigger an order-details payment flow.

Description: preserved for compatibility with observed WhatsApp native-flow behavior. It has no typed parameters in this package.

TypeScript interface: `Record<string, never>`

Generated WhatsApp payload behavior: serializes to `{}` and adds a `native_flow_name` value of `order_details`.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| none | Record<string, never> | No | Pass an empty object. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Review your order and pay',
  interactiveButtons: [
    {
      name: InteractiveButtonName.ReviewAndPay,
      params: {},
    },
  ],
});
```

### Payment Info

Purpose: trigger a payment-info native flow.

Description: preserved for compatibility with observed WhatsApp native-flow behavior. It has no typed parameters in this package.

TypeScript interface: `Record<string, never>`

Generated WhatsApp payload behavior: serializes to `{}` and adds a `native_flow_name` value of `payment_info`.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| none | Record<string, never> | No | Pass an empty object. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'View payment information',
  interactiveButtons: [
    {
      name: InteractiveButtonName.PaymentInfo,
      params: {},
    },
  ],
});
```

### Call Permission Request

Purpose: request call permission through a native flow.

Description: preserved for compatibility with WhatsApp clients that support call-permission native flows.

TypeScript interface: `Record<string, never>`

Generated WhatsApp payload behavior: serializes to `{}` and uses a specialized native-flow node.

Parameters:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| none | Record<string, never> | No | Pass an empty object. |

Optional parameters: none.

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendInteractiveMessage(sock, jid, {
  text: 'Can our support team call you?',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CallPermissionRequest,
      params: {},
    },
  ],
});
```

# Button Parameter Reference

## DisplayTextParams

| Property | Type | Description |
| --- | --- | --- |
| displayText | string | Text rendered on the button. |

## QuickReplyParams

| Property | Type | Description |
| --- | --- | --- |
| displayText | string | Text rendered on the button. |
| id | string | Identifier returned when the user selects the button. |

## CtaUrlParams

| Property | Type | Description |
| --- | --- | --- |
| displayText | string | Text rendered on the button. |
| url | string | Destination URL opened by WhatsApp. |

## CtaCopyParams

| Property | Type | Description |
| --- | --- | --- |
| displayText | string | Text rendered on the button. |
| copyCode | string | Text copied to the user's clipboard. |

## CtaCallParams

| Property | Type | Description |
| --- | --- | --- |
| displayText | string | Text rendered on the button. |
| phoneNumber | string | Phone number dialed by the client. |

## CatalogParams

| Property | Type | Description |
| --- | --- | --- |
| businessPhoneNumber | string | Business phone number associated with the catalog. |

## AutomatedGreetingCatalogParams

| Property | Type | Description |
| --- | --- | --- |
| businessPhoneNumber | string | Business phone number associated with the catalog. |
| catalogProductId | string | Product identifier inside the WhatsApp catalog. |

## SimpleDisplayActionParams

| Property | Type | Description |
| --- | --- | --- |
| displayText | string | Text rendered on the button. |

Used by `CtaReminder`, `CtaCancelReminder`, `AddressMessage`, and `SendLocation`.

## WebviewLink

| Property | Type | Description |
| --- | --- | --- |
| url | string | URL opened inside the webview. |

## OpenWebviewParams

| Property | Type | Description |
| --- | --- | --- |
| title | string | Button or webview title. |
| link | WebviewLink | Link descriptor expected by WhatsApp. |

## MultiProductMessageParams

| Property | Type | Description |
| --- | --- | --- |
| productId | string | Product identifier opened by the message. |

## PaymentTransactionDetailsParams

| Property | Type | Description |
| --- | --- | --- |
| transactionId | string | Transaction identifier rendered by WhatsApp. |

## GalaxyMessageParams

| Property | Type | Description |
| --- | --- | --- |
| flowToken | string | Flow token supplied by the business integration. |
| flowId | string | Flow identifier supplied by the business integration. |

## SingleSelectRow

| Property | Type | Description |
| --- | --- | --- |
| id | string | Row identifier returned by WhatsApp on selection. |
| title | string | Row title visible to the user. |
| description | string | Optional row description. |

## SingleSelectSection

| Property | Type | Description |
| --- | --- | --- |
| title | string | Section title. |
| rows | readonly SingleSelectRow[] | Rows available in the section. |

## SingleSelectParams

| Property | Type | Description |
| --- | --- | --- |
| title | string | Button or list title. |
| sections | readonly SingleSelectSection[] | Selectable sections. |

## NativeFlowButton

```ts
type NativeFlowButton<TName extends InteractiveButtonName = InteractiveButtonName> = {
  readonly name: TName;
  readonly params: ButtonParamsByName[TName];
};
```

Use this shape for new TypeScript code.

## SerializedNativeFlowButton

```ts
interface SerializedNativeFlowButton {
  readonly name: InteractiveButtonName;
  readonly buttonParamsJson: string;
}
```

Use this only for legacy compatibility or migration. New code should prefer `params`.

## QuickReplyButtonInput

| Property | Type | Description |
| --- | --- | --- |
| id | string | Optional reply identifier. If omitted, the mapper creates `quick_N`. |
| text | string | Optional button label. |
| displayText | string | Optional alternate button label. |

This is accepted by `sendButtons` and mapped to `QuickReplyParams`.

## LegacyBaileysButtonInput

| Property | Type | Description |
| --- | --- | --- |
| buttonId | string | Reply identifier. |
| buttonText.displayText | string | Button label from old Baileys payloads. |

This is accepted for migration from older Baileys button formats.

## SendButtonsPayload

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| text | string | Yes | Message body text. |
| footer | string | No | Footer text. |
| title | string | No | Header title. |
| subtitle | string | No | Header fallback when `title` is absent. |
| buttons | readonly AuthoringButton[] | Yes | Buttons to render. |

## SendInteractiveMessagePayload

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| text | string | Yes | Message body text. |
| footer | string | No | Footer text. |
| title | string | No | Header title. |
| subtitle | string | No | Header fallback when `title` is absent. |
| interactiveButtons | readonly AuthoringButton[] | Yes | Native-flow buttons to render. |

## InteractiveRelayOptions

`InteractiveRelayOptions` is composed from Baileys:

```ts
type InteractiveRelayOptions =
  Omit<MessageGenerationOptionsFromContent, 'userJid'> & MessageRelayOptions;
```

Use it for Baileys relay and generation options such as `messageId`, `additionalNodes`, `additionalAttributes`, `statusJidList`, and `useCachedGroupMetadata`.

# Examples

Each example assumes:

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { InteractiveButtonName, sendButtons, sendInteractiveMessage } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';
```

## Single Quick Reply

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'Confirm your choice',
  interactiveButtons: [
    {
      name: InteractiveButtonName.QuickReply,
      params: {
        displayText: 'Confirm',
        id: 'confirm',
      },
    },
  ],
});
```

## Multiple Quick Replies

```ts
await sendButtons(sock, jid, {
  text: 'Choose a delivery time',
  buttons: [
    { id: 'morning', text: 'Morning' },
    { id: 'afternoon', text: 'Afternoon' },
    { id: 'evening', text: 'Evening' },
  ],
});
```

## URL Button

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'Read the full details online',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaUrl,
      params: {
        displayText: 'Open Details',
        url: 'https://example.com/details',
      },
    },
  ],
});
```

## Copy Code Button

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'Your coupon is ready',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaCopy,
      params: {
        displayText: 'Copy Coupon',
        copyCode: 'WELCOME10',
      },
    },
  ],
});
```

## Phone Number Button

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'Talk to our team now',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaCall,
      params: {
        displayText: 'Call Now',
        phoneNumber: '+5511999999999',
      },
    },
  ],
});
```

## Location Request Button

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'Share your current location',
  interactiveButtons: [
    {
      name: InteractiveButtonName.SendLocation,
      params: {
        displayText: 'Send Location',
      },
    },
  ],
});
```

## Mixed Button Types

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'What would you like to do?',
  interactiveButtons: [
    {
      name: InteractiveButtonName.QuickReply,
      params: {
        displayText: 'Talk to Sales',
        id: 'sales',
      },
    },
    {
      name: InteractiveButtonName.CtaUrl,
      params: {
        displayText: 'View Pricing',
        url: 'https://example.com/pricing',
      },
    },
    {
      name: InteractiveButtonName.CtaCall,
      params: {
        displayText: 'Call Us',
        phoneNumber: '+5511999999999',
      },
    },
  ],
});
```

## Buttons With Footer

```ts
await sendButtons(sock, jid, {
  text: 'Choose a plan',
  footer: 'You can change plans later.',
  buttons: [
    { id: 'basic', text: 'Basic' },
    { id: 'pro', text: 'Pro' },
  ],
});
```

## Buttons With Header

```ts
await sendInteractiveMessage(sock, jid, {
  title: 'Account Setup',
  text: 'Choose the next step',
  interactiveButtons: [
    {
      name: InteractiveButtonName.QuickReply,
      params: {
        displayText: 'Start',
        id: 'start_setup',
      },
    },
  ],
});
```

## Buttons With Body And Footer

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'Your order is ready for pickup',
  footer: 'Store hours: 09:00 to 18:00',
  interactiveButtons: [
    {
      name: InteractiveButtonName.QuickReply,
      params: {
        displayText: 'I am on my way',
        id: 'pickup_on_way',
      },
    },
  ],
});
```

## Native-Flow Messages

```ts
await sendInteractiveMessage(sock, jid, {
  title: 'Service Request',
  text: 'Select a request type',
  footer: 'Our team usually replies within 5 minutes.',
  interactiveButtons: [
    {
      name: InteractiveButtonName.SingleSelect,
      params: {
        title: 'Request Types',
        sections: [
          {
            title: 'Support',
            rows: [
              { id: 'billing', title: 'Billing' },
              { id: 'technical', title: 'Technical Support' },
            ],
          },
        ],
      },
    },
  ],
});
```

## Legacy Compatibility Examples

```ts
await sendButtons(sock, jid, {
  text: 'Legacy shape still works',
  buttons: [
    { id: 'legacy_1', text: 'Simple Legacy' },
    { buttonId: 'legacy_2', buttonText: { displayText: 'Old Baileys' } },
  ],
});
```

## Migrating From Raw buttonParamsJson

Before:

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'Visit us',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaUrl,
      buttonParamsJson: '{"display_text":"Open Website","url":"https://example.com"}',
    },
  ],
});
```

After:

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'Visit us',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaUrl,
      params: {
        displayText: 'Open Website',
        url: 'https://example.com',
      },
    },
  ],
});
```

## Migrating From JavaScript

Before:

```js
await sendButtons(sock, jid, {
  text: 'Choose',
  buttons: [{ id: 'a', text: 'A' }],
});
```

After:

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { sendButtons } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendButtons(sock, jid, {
  text: 'Choose',
  buttons: [{ id: 'a', text: 'A' }],
});
```

## TypeScript-First Examples

```ts
import type { NativeFlowButton } from '@destroyer/button-helper';
import { InteractiveButtonName, sendInteractiveMessage } from '@destroyer/button-helper';

const buttons: NativeFlowButton[] = [
  {
    name: InteractiveButtonName.QuickReply,
    params: {
      displayText: 'Yes',
      id: 'yes',
    },
  },
  {
    name: InteractiveButtonName.CtaCopy,
    params: {
      displayText: 'Copy Invite',
      copyCode: 'INVITE-2026',
    },
  },
];

await sendInteractiveMessage(sock, jid, {
  text: 'Choose an action',
  interactiveButtons: buttons,
});
```

# Recipes

Each recipe assumes the same imports and `sock`/`jid` setup shown in the Examples section.

## Menu Selection

```ts
await sendInteractiveMessage(sock, jid, {
  title: 'Main Menu',
  text: 'How can we help today?',
  interactiveButtons: [
    {
      name: InteractiveButtonName.SingleSelect,
      params: {
        title: 'Open Menu',
        sections: [
          {
            title: 'Departments',
            rows: [
              { id: 'sales', title: 'Sales', description: 'Plans and pricing' },
              { id: 'support', title: 'Support', description: 'Help with your account' },
              { id: 'billing', title: 'Billing', description: 'Invoices and payments' },
            ],
          },
        ],
      },
    },
  ],
});
```

## Customer Support

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'A support specialist can help you now.',
  footer: 'Choose the best option for you.',
  interactiveButtons: [
    {
      name: InteractiveButtonName.QuickReply,
      params: {
        displayText: 'Open Ticket',
        id: 'open_ticket',
      },
    },
    {
      name: InteractiveButtonName.CtaCall,
      params: {
        displayText: 'Call Support',
        phoneNumber: '+5511999999999',
      },
    },
  ],
});
```

## Authentication Code

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'Your authentication code is 482913.',
  footer: 'Do not share this code with anyone.',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaCopy,
      params: {
        displayText: 'Copy Code',
        copyCode: '482913',
      },
    },
  ],
});
```

## Product Catalog

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'Browse our latest products',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaCatalog,
      params: {
        businessPhoneNumber: '+5511999999999',
      },
    },
  ],
});
```

## Contact Request

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'How should we contact you?',
  interactiveButtons: [
    {
      name: InteractiveButtonName.QuickReply,
      params: {
        displayText: 'WhatsApp',
        id: 'contact_whatsapp',
      },
    },
    {
      name: InteractiveButtonName.CallPermissionRequest,
      params: {},
    },
  ],
});
```

## Website Redirect

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'Continue your application online',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaUrl,
      params: {
        displayText: 'Continue Online',
        url: 'https://example.com/apply',
      },
    },
  ],
});
```

## Promotional Campaign

```ts
await sendInteractiveMessage(sock, jid, {
  title: 'Weekend Sale',
  text: 'Save 20% on selected products this weekend.',
  footer: 'Offer valid until Sunday.',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaCopy,
      params: {
        displayText: 'Copy Coupon',
        copyCode: 'WEEKEND20',
      },
    },
    {
      name: InteractiveButtonName.CtaUrl,
      params: {
        displayText: 'Shop Now',
        url: 'https://example.com/sale',
      },
    },
  ],
});
```

# API Reference

## sendButtons

```ts
sendButtons(
  socket: WASocket,
  jid: string,
  payload: SendButtonsPayload,
  options?: InteractiveRelayOptions
): Promise<WAMessage>
```

Sends a quick-reply-oriented interactive message. This is the simplest API for normal buttons.

Parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| socket | WASocket | Active Baileys socket. |
| jid | string | Destination chat JID. |
| payload | SendButtonsPayload | Message body, optional header/footer, and buttons. |
| options | InteractiveRelayOptions | Optional Baileys send and relay options. |

Return type: `Promise<WAMessage>`

```ts
await sendButtons(sock, jid, {
  text: 'Choose',
  buttons: [{ id: 'yes', text: 'Yes' }],
});
```

## sendInteractiveButtonsBasic

```ts
sendInteractiveButtonsBasic(
  socket: WASocket,
  jid: string,
  payload: SendButtonsPayload,
  options?: InteractiveRelayOptions
): Promise<WAMessage>
```

Canonical name behind the `sendButtons` alias.

```ts
await sendInteractiveButtonsBasic(sock, jid, {
  text: 'Choose',
  buttons: [{ id: 'yes', text: 'Yes' }],
});
```

## sendInteractiveMessage

```ts
sendInteractiveMessage(
  socket: WASocket,
  jid: string,
  payload: SendInteractiveMessagePayload,
  options?: InteractiveRelayOptions
): Promise<WAMessage>
```

Sends a native-flow interactive message with any supported `InteractiveButtonName`.

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'Open website?',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaUrl,
      params: {
        displayText: 'Open',
        url: 'https://example.com',
      },
    },
  ],
});
```

## getButtonType

```ts
getButtonType(message: WAMessageContent | undefined): ButtonMessageType | null
```

Detects whether normalized message content is a list, legacy buttons message, native-flow message, or non-interactive message.

```ts
const type = getButtonType(messageContent);
```

## getButtonArgs

```ts
getButtonArgs(message: WAMessageContent): BinaryNode
```

Builds the Baileys binary node required for the detected interactive content.

```ts
const node = getButtonArgs(messageContent);
```

## convertToInteractiveMessage

```ts
convertToInteractiveMessage(payload: SendInteractiveMessagePayload): WAMessageContent
```

Converts authoring content into `interactiveMessage.nativeFlowMessage` content for Baileys.

```ts
const content = convertToInteractiveMessage({
  text: 'Choose',
  interactiveButtons: [
    {
      name: InteractiveButtonName.QuickReply,
      params: { displayText: 'Yes', id: 'yes' },
    },
  ],
});
```

## buildInteractiveButtons

```ts
buildInteractiveButtons(buttons?: readonly AuthoringButton[]): SerializedNativeFlowButton[]
```

Maps typed, legacy, or serialized authoring buttons into serialized Baileys native-flow buttons.

```ts
const buttons = buildInteractiveButtons([{ id: 'yes', text: 'Yes' }]);
```

## mapAuthoringButton

```ts
mapAuthoringButton(button: AuthoringButton, index: number): NativeFlowButton
```

Maps one authoring button to the typed `NativeFlowButton` model.

```ts
const button = mapAuthoringButton({ id: 'yes', text: 'Yes' }, 0);
```

## serializeNativeFlowButton

```ts
serializeNativeFlowButton(button: NativeFlowButton): SerializedNativeFlowButton
```

Serializes camelCase params into WhatsApp-compatible `buttonParamsJson`.

```ts
const serialized = serializeNativeFlowButton({
  name: InteractiveButtonName.CtaCopy,
  params: { displayText: 'Copy', copyCode: 'ABC123' },
});
```

## deserializeNativeFlowButton

```ts
deserializeNativeFlowButton(button: SerializedNativeFlowButton): NativeFlowButton
```

Parses a serialized WhatsApp button into the typed camelCase model.

```ts
const typed = deserializeNativeFlowButton({
  name: InteractiveButtonName.CtaCopy,
  buttonParamsJson: '{"display_text":"Copy","copy_code":"ABC123"}',
});
```

## parseButtonParamsJson

```ts
parseButtonParamsJson<TName extends InteractiveButtonName>(
  name: TName,
  buttonParamsJson: string
): ButtonParamsByName[TName]
```

Parses WhatsApp parameter JSON into the correct camelCase interface.

```ts
const params = parseButtonParamsJson(
  InteractiveButtonName.CtaUrl,
  '{"display_text":"Open","url":"https://example.com"}',
);
```

## toExternalButtonParams

```ts
toExternalButtonParams(name: InteractiveButtonName, params: ButtonParams): JsonObject
```

Converts camelCase params into the external WhatsApp object before JSON serialization.

```ts
const external = toExternalButtonParams(InteractiveButtonName.CtaCall, {
  displayText: 'Call',
  phoneNumber: '+5511999999999',
});
```

## validateAuthoringButtons

```ts
validateAuthoringButtons(buttons: unknown): ValidationResult<AuthoringButton[]>
```

Validates a list of typed, serialized, or legacy authoring buttons.

```ts
const result = validateAuthoringButtons([{ id: 'yes', text: 'Yes' }]);
```

## validateSendButtonsPayload

```ts
validateSendButtonsPayload(payload: unknown): ValidationResult
```

Validates the `sendButtons` payload shape.

```ts
const result = validateSendButtonsPayload({
  text: 'Choose',
  buttons: [{ id: 'yes', text: 'Yes' }],
});
```

## validateSendInteractiveMessagePayload

```ts
validateSendInteractiveMessagePayload(payload: unknown): ValidationResult
```

Validates the `sendInteractiveMessage` authoring payload shape.

```ts
const result = validateSendInteractiveMessagePayload({
  text: 'Choose',
  interactiveButtons: [
    {
      name: InteractiveButtonName.QuickReply,
      params: { displayText: 'Yes', id: 'yes' },
    },
  ],
});
```

## validateInteractiveMessageContent

```ts
validateInteractiveMessageContent(content: unknown): ValidationResult
```

Validates converted Baileys interactive message content.

```ts
const content = convertToInteractiveMessage({
  text: 'Choose',
  interactiveButtons: [
    {
      name: InteractiveButtonName.QuickReply,
      params: { displayText: 'Yes', id: 'yes' },
    },
  ],
});

const result = validateInteractiveMessageContent(content);
```

## InteractiveValidationError

```ts
class InteractiveValidationError extends Error {
  readonly context: string | undefined;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly example: unknown;
  toJSON(): Readonly<Record<string, unknown>>;
  formatDetailed(): string;
}
```

Thrown when a public send helper receives invalid input or cannot generate a valid WhatsApp message.

```ts
try {
  await sendButtons(sock, jid, {
    text: '',
    buttons: [],
  });
} catch (error) {
  if (error instanceof InteractiveValidationError) {
    console.error(error.formatDetailed());
  }
}
```

## examplePayloads

```ts
const examplePayloads: {
  sendButtons: SendButtonsPayload;
  sendInteractiveMessage: SendInteractiveMessagePayload;
}
```

Reusable examples used in validation errors.

```ts
console.log(examplePayloads.sendButtons);
```

## Types And Enums

Exported types include:

- `InteractiveButtonName`
- `ButtonMessageType`
- `SendButtonsComplexName`
- `DisplayTextParams`
- `QuickReplyParams`
- `CtaUrlParams`
- `CtaCopyParams`
- `CtaCallParams`
- `CatalogParams`
- `AutomatedGreetingCatalogParams`
- `SimpleDisplayActionParams`
- `WebviewLink`
- `OpenWebviewParams`
- `MultiProductMessageParams`
- `PaymentTransactionDetailsParams`
- `GalaxyMessageParams`
- `SingleSelectRow`
- `SingleSelectSection`
- `SingleSelectParams`
- `ButtonParamsByName`
- `ButtonParams`
- `NativeFlowButton`
- `SerializedNativeFlowButton`
- `QuickReplyButtonInput`
- `LegacyBaileysButtonText`
- `LegacyBaileysButtonInput`
- `AuthoringButton`
- `SendButtonsPayload`
- `SendInteractiveMessagePayload`
- `InteractiveRelayOptions`
- `JsonPrimitive`
- `JsonValue`
- `JsonObject`
- `ValidationResult`
- `UnknownRecord`

# Migration Guide

## From Raw JSON Strings To Typed Params

Before:

```js
await sendInteractiveMessage(sock, jid, {
  text: 'Copy your coupon',
  interactiveButtons: [
    {
      name: 'cta_copy',
      buttonParamsJson: JSON.stringify({
        display_text: 'Copy Code',
        copy_code: 'SAVE20',
      }),
    },
  ],
});
```

After:

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'Copy your coupon',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaCopy,
      params: {
        displayText: 'Copy Code',
        copyCode: 'SAVE20',
      },
    },
  ],
});
```

## From Old Baileys Buttons To sendButtons

Before:

```js
await sendButtons(sock, jid, {
  text: 'Choose',
  buttons: [
    {
      buttonId: 'yes',
      buttonText: { displayText: 'Yes' },
    },
  ],
});
```

After:

```ts
await sendButtons(sock, jid, {
  text: 'Choose',
  buttons: [{ id: 'yes', text: 'Yes' }],
});
```

## From String Button Names To Enum Values

Before:

```js
await sendInteractiveMessage(sock, jid, {
  text: 'Open our website',
  interactiveButtons: [
    {
      name: 'cta_url',
      buttonParamsJson: '{"display_text":"Open","url":"https://example.com"}',
    },
  ],
});
```

After:

```ts
await sendInteractiveMessage(sock, jid, {
  text: 'Open our website',
  interactiveButtons: [
    {
      name: InteractiveButtonName.CtaUrl,
      params: {
        displayText: 'Open',
        url: 'https://example.com',
      },
    },
  ],
});
```

## From CommonJS To ESM TypeScript

Before:

```js
const { sendButtons } = require('@destroyer/button-helper');

await sendButtons(sock, jid, {
  text: 'Choose',
  buttons: [{ id: 'yes', text: 'Yes' }],
});
```

After:

```ts
import type { WASocket } from '@whiskeysockets/baileys';
import { sendButtons } from '@destroyer/button-helper';

declare const sock: WASocket;
const jid = '5511999999999@s.whatsapp.net';

await sendButtons(sock, jid, {
  text: 'Choose',
  buttons: [{ id: 'yes', text: 'Yes' }],
});
```

# Architecture

```text
src/
├── errors/
│   └── InteractiveValidationError.ts
├── mappers/
│   ├── buttonMapper.ts
│   └── buttonParamsMapper.ts
├── parsers/
│   └── jsonParser.ts
├── services/
│   ├── buttonNodeService.ts
│   ├── interactiveMessageService.ts
│   └── messageContentService.ts
├── types/
│   ├── buttonParams.ts
│   ├── common.ts
│   └── entities.ts
├── validators/
│   └── buttonValidators.ts
└── index.ts
```

## Data Flow

1. A caller sends `SendButtonsPayload` or `SendInteractiveMessagePayload`.
2. Validators check the payload and return structured errors and warnings.
3. Mappers convert legacy, serialized, or typed buttons into `NativeFlowButton`.
4. Button parameters are serialized to WhatsApp's external JSON schema.
5. `messageContentService` creates `interactiveMessage.nativeFlowMessage`.
6. Baileys generates a `WAMessage`.
7. `buttonNodeService` creates the required binary nodes.
8. `interactiveMessageService` relays the message through the socket.

## Development

```bash
npm run build
```

The project is compiled with strict TypeScript settings, including `strict`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`.

## Refactoring Notes

- The original monolithic CommonJS `base.js` implementation was replaced by strict TypeScript modules.
- Public send helpers accept the official Baileys `WASocket` type directly.
- New code should prefer typed `params` objects instead of raw `buttonParamsJson`.
- Raw serialized buttons remain supported for migration.
- Unknown authoring shapes are rejected so malformed buttons fail early with actionable validation errors.

## Assumptions

- WhatsApp native-flow schemas were inferred from the original implementation and observed Baileys behavior.
- Some native flows require WhatsApp Business capabilities, catalog configuration, payment support, or client-side feature support.
- Button rendering can vary by WhatsApp client version and account type.
