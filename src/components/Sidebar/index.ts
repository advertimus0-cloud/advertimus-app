/**
 * src/components/Sidebar/index.ts
 *
 * Purpose: Left-side panel listing the user's chat sessions / projects.
 * Responsibilities:
 *  - Render list of past conversations (from ChatContext)
 *  - "New Chat" button
 *  - Active session highlight
 *  - Collapsible on mobile
 *
 * SECURITY: Renders only data from context (no direct DB calls). All data
 * is pre-filtered server-side per the authenticated user's workspace (§3).
 */
export { Sidebar } from './Sidebar';
export type { SidebarProps, SidebarChat, SidebarUser, NavItem } from './Sidebar';
