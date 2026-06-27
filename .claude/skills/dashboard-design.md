---
name: dashboard-design
description: Design and build production-grade dashboards and UI systems for the Advertimus app. Use this skill when the user asks to create, redesign, or improve any dashboard view, data panel, analytics screen, settings page, admin interface, or UI component system. Generates cohesive, data-dense, visually polished interfaces that feel purpose-built — not generic.
---

This skill guides the design and implementation of dashboard and UI systems for the Advertimus app — a dark-themed AI ad-generation platform with a 3-column shell (Sidebar 280px | Chat flex-1 | Results 400px), built with Next.js + Tailwind CSS.

## Design Tokens (Advertimus Brand)

Always use these established tokens to stay on-brand:

```
bg-background   → #000000   (root shell, panels)
bg-accent1      → #5d1a1b   (primary accent — dark crimson)
bg-accent2      → #161142   (secondary accent — deep indigo)
border-accent1  → #5d1a1b   (dividers, borders)
text-white      → #FFFFFF   (primary text)
```

For new surfaces, extend tastefully:
- `bg-white/5` — subtle card fills
- `border-white/10` — quiet dividers
- `text-white/60` — secondary labels
- `text-white/30` — tertiary / placeholder
- Accent highlights: `#c0392b` (bright crimson), `#3d2f9e` (bright indigo)

## Dashboard Design Principles

### 1. Information Architecture First
Before writing any JSX, sketch the layout mentally:
- **What is the primary action or metric?** Give it 60%+ visual weight.
- **What is secondary?** Support panels, filters, status indicators.
- **What is tertiary?** Timestamps, IDs, metadata — muted.
- Establish a clear reading order: Z-pattern for scan-heavy views, F-pattern for list-heavy views.

### 2. Data Density Done Right
Dashboards must balance density with clarity:
- Use **tight spacing** inside cards (`p-3`, `gap-2`) but **generous breathing room** between sections (`gap-6`, `mt-8`).
- Numbers and metrics: large, bold, monospace (`font-mono`) — they are the hero.
- Labels: uppercase, tracked, small (`text-xs uppercase tracking-widest text-white/50`).
- Status badges: compact pill (`rounded-full px-2 py-0.5 text-xs`), color-coded with subtle background.

### 3. Dark Theme Excellence
This app is full black. Every surface must respect the depth hierarchy:
```
Level 0: #000000         → root background
Level 1: rgba(255,255,255,0.03)  → page regions
Level 2: rgba(255,255,255,0.06)  → cards, panels
Level 3: rgba(255,255,255,0.09)  → hover states, active rows
Level 4: rgba(255,255,255,0.14)  → focused/selected
```
Borders at `rgba(255,255,255,0.08)` — barely-there dividers that add structure without noise.

### 4. Component Patterns

**Stat Card**
```tsx
<div className="rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col gap-1">
  <span className="text-xs uppercase tracking-widest text-white/40">Label</span>
  <span className="text-3xl font-bold font-mono text-white">42</span>
  <span className="text-xs text-emerald-400">↑ 12% this week</span>
</div>
```

**Data Table Row**
```tsx
<tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
  <td className="px-4 py-3 text-sm text-white">...</td>
  <td className="px-4 py-3 text-sm text-white/50">...</td>
</tr>
```

**Section Header**
```tsx
<div className="flex items-center justify-between mb-4">
  <h2 className="text-sm font-semibold uppercase tracking-widest text-white/40">Section</h2>
  <button className="text-xs text-accent1 hover:text-white transition-colors">View all →</button>
</div>
```

**Status Badge**
```tsx
// active
<span className="rounded-full px-2 py-0.5 text-xs bg-emerald-500/15 text-emerald-400">Active</span>
// pending
<span className="rounded-full px-2 py-0.5 text-xs bg-amber-500/15 text-amber-400">Pending</span>
// error
<span className="rounded-full px-2 py-0.5 text-xs bg-red-500/15 text-red-400">Failed</span>
```

**Filter / Tab Bar**
```tsx
<div className="flex gap-1 bg-white/5 rounded-lg p-1">
  {tabs.map(tab => (
    <button key={tab} className={`px-3 py-1.5 text-xs rounded-md transition-all ${
      active === tab
        ? 'bg-accent1 text-white shadow'
        : 'text-white/40 hover:text-white'
    }`}>{tab}</button>
  ))}
</div>
```

### 5. Layout Patterns for Common Views

**Analytics Dashboard** — use CSS Grid:
```
grid-cols-4 gap-4   → stat cards row
grid-cols-3 gap-4   → chart | chart | feed
col-span-2          → wide chart, narrow sidebar
```

**Settings / Form Page** — two-column or single column max-width:
```
max-w-2xl mx-auto   → centered form
grid grid-cols-[200px_1fr]  → label | input pairs
```

**List / Table View** — full-width table with sticky header:
```
overflow-hidden rounded-xl border border-white/10
sticky top-0 bg-background  → thead
```

**Detail / Drill-down** — master-detail within the Results Panel (400px):
```
flex flex-col h-full
sticky header with back arrow + title
scrollable body
```

### 6. Motion & Interaction

Keep animations purposeful and subtle in a dashboard context:
- **Skeleton loaders** for data fetching: animate-pulse with `bg-white/5` shapes matching the final content dimensions.
- **Number transitions**: use `tabular-nums` and CSS counter animations for live metric updates.
- **Row hover**: `transition-colors duration-100` — instant enough to feel responsive.
- **Panel slide-in**: `transition-all duration-300 ease-out` for the Results Panel.
- Avoid decorative animations on data — they distract from reading.

### 7. Responsive Behavior (Advertimus Breakpoints)

- `md:` (≥768px) is the desktop breakpoint for the 3-column shell.
- Mobile collapses to: Sidebar as overlay, Chat full-width, Results as bottom sheet (50vh).
- Dashboard panels inside the chat or results area should be responsive within their container — don't assume the parent is full-viewport.

### 8. Accessibility Non-negotiables

- All interactive elements: `focus-visible:ring-2 focus-visible:ring-accent1/70 focus-visible:outline-none`
- Color contrast: labels and data must meet 4.5:1 against their backgrounds
- Tables: use `<thead>`, `<th scope="col">`, `aria-label` on icon buttons
- Loading states: `aria-busy="true"` on the container, `aria-live="polite"` for async updates

## Workflow

1. **Understand the data** — what is being displayed, what actions are needed?
2. **Choose a layout** from the patterns above, adapted to the data shape.
3. **Apply tokens** — stay on-brand, extend only where necessary.
4. **Build in layers** — structure → spacing → color → typography → micro-interactions.
5. **Check density** — too sparse feels unfinished; too dense feels unusable. Aim for purposeful density.
6. **Test in context** — the component will live inside the Advertimus shell (dark, narrow containers). Size and color accordingly.
