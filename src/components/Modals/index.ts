/**
 * src/components/Modals/index.ts
 *
 * Purpose: Overlay dialogs triggered by user actions.
 * Modals to be placed here:
 *  - UpgradeModal     : prompt to upgrade plan when credit limit is hit
 *  - DownloadModal    : export / download options for generated content
 *  - ConfirmModal     : generic confirmation dialog (delete, cancel)
 *  - ImagePreviewModal: full-screen image preview
 *
 * SECURITY:
 *  - Modals that trigger destructive actions (delete) must confirm via a
 *    backend call that re-validates ownership — not just client state (§2).
 *  - Rendered content inside modals follows the same XSS sanitization rules
 *    as the chat area (§7).
 */
export {};
