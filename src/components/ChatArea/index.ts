/**
 * src/components/ChatArea/index.ts
 *
 * Purpose: Center column — the primary user interface for the Advertimus agent chat.
 * Responsibilities:
 *  - Render conversation message list (user + agent + system messages)
 *  - Message input bar with send button and upload trigger
 *  - Interactive MCQ / step-by-step question cards (coming next step)
 *  - Real-time streaming agent responses (coming next step)
 *
 * SECURITY:
 *  - All user input is trimmed and length-validated before dispatch (§5).
 *  - LLM output must be sanitized with DOMPurify + marked before reaching
 *    MessageItem — never use dangerouslySetInnerHTML with raw strings (§7).
 *  - Uploaded files are client-validated for type/size; server validates authoritatively (§8).
 */
export { ChatArea } from './ChatArea'
export { MessageList } from './MessageList'
export { MessageItem, TypingIndicator } from './MessageItem'
export { MultiChoiceOptions, AD_TYPE_OPTIONS, STYLE_OPTIONS, FORMAT_OPTIONS, LENGTH_OPTIONS } from './MultiChoiceOptions'
export { ImageUploader } from './ImageUploader'
export type { ChatAreaProps } from './ChatArea'
export type { ChatMessage, MessageRole, MessageType, MCQOption } from './MessageItem'
export type { MultiChoiceOptionsProps } from './MultiChoiceOptions'
export type { UploadedFile, ImageUploaderHandle, ImageUploaderProps } from './ImageUploader'
