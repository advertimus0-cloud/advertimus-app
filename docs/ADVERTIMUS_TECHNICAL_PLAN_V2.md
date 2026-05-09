# ADVERTIMUS SAAS - COMPLETE TECHNICAL IMPLEMENTATION PLAN (V2.0)
## Level 1: AI Marketing Superhero (Chat-Based Marketing Console)

**Document Date:** April 5, 2026  
**Project:** Advertimus by RixLift  
**Scope:** Level 1 Implementation with NEW Features  
**Version:** 2.0 - With Design System & Build Phases

---

## 📋 TABLE OF CONTENTS
1. Design System Specifications
2. What You're Actually Building
3. Complete Updated Questionnaire Flow
4. How All The Tools Work Together
5. Build Phases (Frontend → Backend → n8n)
6. Code & Design Guidelines
7. Complete Feature List
8. System Architecture
9. Step-by-Step Build Plan
10. Budget Estimates & Timeline
11. Developer Notes Section

---

## 🎨 PART 1: DESIGN SYSTEM SPECIFICATIONS

### **Color Palette (CRITICAL - Must Match Exactly)**

```css
/* PRIMARY BACKGROUND */
--color-bg-primary: #000000      /* Pure Black - Main background */

/* GRADIENT COLORS (Used in borders, text boxes, effects) */
--color-gradient-1: #5d1a1b      /* Maroon/Dark Red */
--color-gradient-2: #161142      /* Dark Purple */

/* TEXT COLORS */
--color-text-primary: #FFFFFF    /* White - All primary text */
--color-text-secondary: #E0E0E0  /* Light Gray - Secondary text */

/* ACCENT COLORS */
--color-accent-pink: #EC4899     /* Pink - CTA buttons */
--color-accent-purple: #A855F7   /* Purple - Secondary CTAs */

/* GRADIENTS */
--gradient-border: linear-gradient(135deg, #5d1a1b 0%, #161142 100%)
--gradient-textbox: linear-gradient(135deg, rgba(93,26,27,0.3) 0%, rgba(22,17,66,0.3) 100%)

```

### **Typography System**

```
Font Stack: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif

HEADINGS:
├─ H1: 32px, weight 700, color: #FFFFFF
├─ H2: 24px, weight 700, color: #FFFFFF
├─ H3: 20px, weight 600, color: #FFFFFF
└─ H4: 16px, weight 600, color: #FFFFFF

BODY TEXT:
├─ Large: 16px, weight 400, color: #FFFFFF
├─ Normal: 14px, weight 400, color: #FFFFFF
└─ Small: 12px, weight 400, color: #E0E0E0

SPACING GRID: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
```

### **Component Style Examples**

```
BUTTONS:
├─ Background: Gradient (#EC4899 → #A855F7) or solid
├─ Text: #FFFFFF
├─ Padding: 12px 24px
├─ Border Radius: 8px
└─ Hover: Enhanced gradient + shadow

TEXT INPUTS:
├─ Background: #000000 with border gradient (#5d1a1b → #161142)
├─ Text: #FFFFFF
├─ Placeholder: #6B7280 (gray)
├─ Focus: Border glow with accent color
└─ Padding: 12px 16px

MESSAGES (User):
├─ Background: #5d1a1b
├─ Text: #FFFFFF
├─ Alignment: Right
└─ Border Radius: 16px, rounded except bottom-left

MESSAGES (AI):
├─ Background: #161142
├─ Text: #FFFFFF
├─ Alignment: Left
└─ Border Radius: 16px, rounded except top-left

BORDERS & DIVIDERS:
├─ Default: 1px solid #5d1a1b
├─ Hover/Active: Gradient (#5d1a1b → #161142)
└─ Subtle: rgba(93, 26, 27, 0.2)
```

---

## 1️⃣ WHAT YOU'RE ACTUALLY BUILDING

Think of Advertimus like a **24/7 Marketing Expert that lives in your browser**.

**The User Experience (Chat-First Agent):**
- User opens the platform → Logs in with email/password
- Lands in a **chat interface** where they talk naturally with the Advertimus AI agent
- The agent understands their product/goal and proposes a campaign concept
- User approves the idea, then answers a guided step-by-step multiple-choice flow inside the chat
- Results appear on the RIGHT SIDE (**only** after generation starts) — videos, images, marketing copy
- Chat also shows live backend progress (system feed: "Analyzing...", "Rendering video...") during generation
- Everything is dynamic: no hardcoded names, no static flows

**Example Flow:**
```
User describes their product in natural language and uploads reference assets.

Advertimus AI analyzes and:
1. Analyzes uploaded images (Vision API)
2. Proposes a creative campaign concept — user must APPROVE before proceeding
3. Triggers step-by-step MCQ flow inside the chat
4. Generates storyboard (Claude Sonnet)
5. Creates professional videos (DALL-E → Runway)
6. Creates product images (DALL-E 3)
7. Creates social media designs (DALL-E 3)
8. Shows predicted performance score

GUIDED QUESTIONS (Inside chat, one-at-a-time, after idea approval):
1. Concept Approval Gate: "Does this approach align with your vision?" [Yes / Revise]
2. "What type of ad?" [6 options as cards with gradient borders]
3. "What style?" [5 options as cards]
4. "What format?" [4 options as cards]
5. "Target country/market?" [5+ options as cards]
6. "Video ratio/format?" [Landscape/Portrait/Square/Both]
7. "Video length?" [15s-60s options with credit costs, plan-gated]
8. "Images & designs?" [Generate images/designs/both/skip]

Result Panel (appears ONLY when generation starts, not before):
├─ Marketing video (15-50 seconds) - playable
├─ 4 professional product photos
├─ 3 social media designs (Instagram, Facebook, Pinterest)
├─ Ad copy + marketing text
├─ Performance prediction score
└─ Download buttons with gradient styling
```

---

## 2️⃣ COMPLETE UPDATED QUESTIONNAIRE FLOW

### **Flow Sequence**

```
STAGE 1: INITIAL PRODUCT DESCRIPTION
┌─────────────────────────────────────────────────────────────┐
│ User types freely (natural conversation) and uploads reference assets.   │
│                                                                             │
│ Advertimus analyzes the inputs and responds conversationally.              │
│ It proposes a creative campaign direction based on the assets.              │
└─────────────────────────────────────────────────────────────┘

STAGE 2: CONCEPT AGREEMENT (NEW FIRST STEP!)
┌─────────────────────────────────────────────────────────────┐
│ "Does this approach align with your vision?"               │
│                                                             │
│ [✅ Yes, let's create!] [❌ Show other options]            │
│ (Buttons styled with gradient: #5d1a1b → #161142)         │
│                                                             │
│ User clicks: "Yes, let's create!"                          │
└─────────────────────────────────────────────────────────────┘

STAGE 3: MULTIPLE-CHOICE QUESTIONS (AFTER AGREEMENT)
┌─────────────────────────────────────────────────────────────┐

QUESTION 1: "What type of ad format?"
├─ Option 1: Problem → Solution
│  └─ Cards with gradient border #5d1a1b → #161142
├─ Option 2: Before / After
├─ Option 3: Storytelling ← User selects
├─ Option 4: Direct Selling
├─ Option 5: Trend / Viral
└─ Option 6: Testimonial

QUESTION 2: "What style/mood?"
├─ Option 1: Luxury / Cinematic
│  └─ Card styling: white text, gradient border
├─ Option 2: Casual / Real Life ← User selects
├─ Option 3: Funny / Comedy
├─ Option 4: Emotional
└─ Option 5: Studio-Based

QUESTION 3: "What delivery format?"
├─ Option 1: Video (Real-life shooting) ← User selects
├─ Option 2: Image-Based Ad
├─ Option 3: 3D Product Animation
└─ Option 4: Mixed (Real + 3D)

QUESTION 4 (✨ NEW!): "Target country/market?"
├─ Option 1: United States
│  └─ All cards responsive with gradient styling
├─ Option 2: Europe
├─ Option 3: Middle East (الشرق الأوسط) ← User selects
├─ Option 4: Asia
├─ Option 5: Global
└─ Option 6: Custom (specify)
[DESIGN NOTE: Cards with white text, gradient borders, hover effects]

QUESTION 5 (✨ NEW!): "Video format/ratio?"
├─ Option 1: Landscape 16:9 
│  └─ "YouTube, LinkedIn, Standard Web"
├─ Option 2: Portrait 9:16
│  └─ "TikTok, Instagram Reels, Stories" ← User selects
├─ Option 3: Square 1:1
│  └─ "Facebook, Instagram Feed"
└─ Option 4: All Formats (generate all 3)
[DESIGN NOTE: Show format preview thumbnail with gradient overlay]

QUESTION 6: "Video length?"
├─ Option 1: 15 seconds (400 credits)
├─ Option 2: 20 seconds (450 credits)
├─ Option 3: 30 seconds (550 credits) ← User selects
├─ Option 4: 40 seconds (700 credits)
├─ Option 5: 50 seconds (1,000 credits)
└─ Option 6: 60 seconds (1,200 credits)
[DESIGN NOTE: Show credit cost per option in accent color #EC4899]

QUESTION 7 (✨ NEW!): "Images & Graphics?"
├─ Option 1: Generate product images only (+ 40 credits)
│  └─ "4 professional product photos"
├─ Option 2: Generate designs only (+ 60 credits)
│  └─ "3 social media designs"
├─ Option 3: Both (+ 100 credits) ← User selects
│  └─ "4 images + 3 designs"
└─ Option 4: Skip this

STAGE 4: SUMMARY & CONFIRMATION
┌─────────────────────────────────────────────────────────────┐
│ CAMPAIGN CONFIGURATION SUMMARY:                             │
│ (All displayed with design styling)                        │
├─ Type: Problem → Solution                                  │
├─ Style: Casual / Real Life                                │
├─ Format: Video (Portrait 9:16)                            │
├─ Country: Middle East (الشرق الأوسط)                       │
├─ Video Length: 30 seconds                                 │
├─ Ratio: Portrait (9:16)                                   │
├─ Includes: Images + Designs                               │
├─ Total Cost: 550 + 100 = 650 credits                     │
├─ Your Balance: 3,200 - 650 = 2,550 after                │
│                                                             │
│ [🚀 START GENERATING]  [✏️ EDIT]  [❌ CANCEL]             │
│ (Buttons with gradient styling)                           │
└─────────────────────────────────────────────────────────────┘

STAGE 5: GENERATION & RESULTS
┌─────────────────────────────────────────────────────────────┐
│ Results Panel appears with design specifications:           │
│                                                             │
│ STATUS HEADER (with progress bar gradient):                │
│ "🔄 Creating your content (60%)"                          │
│ [████████░░] 60%                                          │
│ ✓ Phase 1: Image analysis                                │
│ ✓ Phase 2: Strategy created                              │
│ ⏳ Phase 3: Generating video (50%)                        │
│ ○ Phase 4: Creating images                               │
│                                                             │
│ RESULTS (as they arrive):                                 │
│ ├─ 📹 VIDEO PLAYER (when ready)                          │
│ │  └─ 30-second video, Portrait format                   │
│ ├─ 📸 IMAGE GALLERY (4 products)                         │
│ │  └─ Grid layout with gradient borders                  │
│ ├─ 🎨 DESIGN TEMPLATES (3 social media)                 │
│ │  └─ Instagram, Facebook, Pinterest                     │
│ ├─ 📝 MARKETING COPY                                     │
│ │  └─ Headlines, captions, descriptions                  │
│ └─ 📊 PERFORMANCE SCORE (92/100)                        │
│    └─ Prediction: 23% higher engagement than average    │
│                                                             │
│ DOWNLOAD AREA (with gradient buttons):                     │
│ [⬇️ Download Video] [⬇️ Download Images] [⬇️ Download All]
└─────────────────────────────────────────────────────────────┘
```

### **Design Notes for Implementation**

```
OPTION CARDS STYLING:
├─ Background: Transparent with gradient border
├─ Border: 2px gradient from #5d1a1b to #161142
├─ Text: #FFFFFF (bold for option name)
├─ Hover: Background color opacity increase + shadow
├─ Selected: Border becomes solid, background opacity 0.2
├─ Padding: 16px
└─ Border Radius: 8px

BUTTON STYLING:
├─ Primary buttons: Solid gradient #EC4899 → #A855F7
├─ Secondary buttons: Border gradient, transparent bg
├─ Text: #FFFFFF
├─ Hover: Increased shadow + slight scale (1.02)
└─ Active: Darker shade of gradient

PROGRESS ELEMENTS:
├─ Progress bar: Gradient fill #EC4899 → #A855F7
├─ Phase icons: Check marks in accent color
├─ Inactive phases: Gray with 50% opacity
└─ Animations: Smooth 0.3s transitions

LAYOUT:
├─ Cards: Max width 100%, responsive
├─ Spacing: 16px between items (8px grid based)
├─ Mobile: Stack vertically, full width
├─ Desktop: 2 columns where applicable
└─ All text: White (#FFFFFF) with good contrast
```

---

## 3️⃣ BUILD PHASES (FRONTEND → BACKEND → n8n)

### **Phase 1: Frontend Only (Weeks 1-2)**

**GOAL:** Build complete UI with design system, no backend connection yet

```
Tasks:
├─ Setup Next.js + TypeScript + Tailwind
├─ Create design system (colors, components)
├─ Build 3-column layout (Sidebar, Chat, Results)
├─ Build all components with design specs
├─ Create multiple-choice question system
├─ Create image uploader with gradient styling
├─ Create Results Panel with mock data
├─ Add animations and interactions
├─ Test responsive design (mobile/tablet/desktop)
└─ Ensure all colors match exactly

COLOR VERIFICATION CHECKLIST:
├─ Background: #000000 (pure black, not #0F172A)
├─ Gradients: #5d1a1b → #161142 in all borders
├─ Text: #FFFFFF (bright white everywhere)
├─ Accent buttons: #EC4899 (pink for CTAs)
└─ All components reviewed for color compliance

DESIGN IMPLEMENTATION:
├─ Each component has design comments
├─ All colors from design system
├─ Spacing from 8px grid
├─ Typography matches spec
├─ Animations smooth (0.3s)
└─ Hover/active states defined

TESTING:
├─ Visual inspection (colors correct)
├─ Responsive testing (all breakpoints)
├─ Interaction testing (buttons, inputs, clicks)
├─ Performance testing (load time < 2s)
└─ No console errors
```

### **Phase 2: Backend Integration (Weeks 3-4)**

**GOAL:** Connect to Supabase, connect UI to real data

```
Tasks:
├─ Setup Supabase project & database
├─ Create database tables:
│  ├─ users (profiles, plans, credits)
│  ├─ projects (user's ad projects)
│  ├─ chat_messages (conversation history)
│  ├─ generated_content (videos, images, designs)
│  ├─ credit_transactions (usage log)
│  └─ user_credits (balance tracking)
├─ Setup Supabase authentication
├─ Connect login/signup to Supabase
├─ Connect chat to database
├─ Connect credit system
├─ Connect generation history
├─ Setup real-time subscriptions
└─ Test all connections end-to-end

GRADUAL CONNECTION:
├─ Connect sidebar project list
├─ Connect chat history loading
├─ Connect message saving
├─ Connect credit balance display
├─ Connect generation history
└─ Verify all queries return correct data

DESIGN CONSISTENCY:
├─ Colors remain: #000000, #5d1a1b, #161142, #FFFFFF
├─ Layout unchanged from Phase 1
├─ All styling maintained
└─ No design regression
```

### **Phase 3: n8n Integration (Week 5)**

**GOAL:** Connect to generation backend, enable content creation

```
Tasks:
├─ Setup n8n workflows
├─ Create webhook endpoints
├─ Connect generation API
├─ Integrate Claude Sonnet for strategy
├─ Integrate DALL-E 3 for images
├─ Integrate Runway AI for videos
├─ Setup WebSocket real-time updates
├─ Add progress tracking
├─ Add error handling & retries
└─ End-to-end generation testing

REAL-TIME FEATURES:
├─ Progress bar animation (gradient fill)
├─ Phase indicator updates
├─ Image preview as generated
├─ Video player once ready
├─ Real-time results display
└─ Email notification on completion

DESIGN IN n8n:
├─ n8n workflows call Claude API
├─ Claude receives design context
├─ Generate with design guidelines
├─ All outputs follow design system
└─ Colors/fonts specified in prompts
```

### **Phase 4: Testing & Deployment (Week 6)**

```
Tasks:
├─ Security testing
├─ Load testing
├─ UI/UX testing
├─ Cross-browser testing
├─ Mobile testing
├─ Payment flow testing
├─ Deploy to Vercel
├─ Setup monitoring
├─ Create documentation
└─ Launch!
```

---

## 4️⃣ CODE & DESIGN GUIDELINES

### **Every Component Must Include**

```typescript
/**
 * Component: MessageBubble
 * Purpose: Display chat message with design styling
 * 
 * DESIGN SPECIFICATIONS:
 * - User Message:
 *   ├─ Background: #5d1a1b (maroon)
 *   ├─ Text Color: #FFFFFF (white)
 *   ├─ Alignment: Right
 *   ├─ Border Radius: 16px (bottom-left sharp)
 *   ├─ Padding: 12px 16px
 *   └─ Max Width: 70%
 * 
 * - AI Message:
 *   ├─ Background: #161142 (purple)
 *   ├─ Border: 1px gradient (#5d1a1b → #161142)
 *   ├─ Text Color: #FFFFFF
 *   ├─ Alignment: Left
 *   ├─ Border Radius: 16px (top-left sharp)
 *   └─ Padding: 12px 16px
 * 
 * ANIMATIONS:
 * - Entrance: slideUp 0.3s ease-in-out
 * - Hover: shadow increase 0.15s
 * - Typing: dot animation 0.6s infinite
 * 
 * RESPONSIVE:
 * - Desktop: 70% width max
 * - Tablet: 75% width max
 * - Mobile: 85% width max
 * 
 * STATES:
 * - Default: As specified above
 * - Loading: Show typing animation
 * - Error: Red border accent
 * - Selected: Slight opacity increase + shadow
 */

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
  isLoading?: boolean
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  role,
  content,
  timestamp,
  isLoading,
}) => {
  const isUser = role === 'user'

  return (
    <div
      className={`
        flex gap-3 mb-4 animate-slideUp
        ${isUser ? 'justify-end' : 'justify-start'}
      `}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="
          w-8 h-8 rounded-full
          bg-gradient-to-br from-accent-pink to-accent-purple
          flex items-center justify-center flex-shrink-0 mt-1
        ">
          <span className="text-sm font-bold text-white">A</span>
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`
          px-4 py-3 rounded-2xl max-w-[70%]
          backdrop-blur-sm transition-all duration-300
          hover:shadow-lg
          ${
            isUser
              ? 'bg-gradient-to-r from-gradient-1 to-gradient-2 text-white rounded-bl-none'
              : 'bg-gradient-2 border border-gradient-1/30 text-white rounded-tl-none'
          }
        `}
      >
        {isLoading ? (
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{content}</p>
        )}

        {timestamp && !isLoading && (
          <p className="text-xs opacity-60 mt-1">
            {timestamp.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  )
}

// DESIGN TOKENS USED:
// - Colors: --color-gradient-1, --color-gradient-2, --color-text-primary
// - Spacing: 12px (padding), 16px (max width %), 8px (gap)
// - Border Radius: 16px (rounded), 2px (subtle)
// - Animations: slideUp (0.3s), bounce (0.6s)
```

### **Code Quality Standards**

```
✅ ALWAYS:
├─ Use TypeScript (strong typing)
├─ Include design specifications in comments
├─ Validate all inputs
├─ Handle errors gracefully
├─ Use environment variables for secrets
├─ Follow the design system colors
├─ Test responsive design
├─ Include loading states
├─ Add accessibility (alt text, ARIA)
└─ Write clean, readable code

❌ NEVER:
├─ Hardcode colors (use CSS variables)
├─ Skip TypeScript annotations
├─ Ignore error handling
├─ Mix design concerns
├─ Use arbitrary spacing values
├─ Expose API keys in code
├─ Skip testing
├─ Make assumptions about data
└─ Write uncommented complex logic

COLOR USAGE IN CODE:
// ✅ CORRECT
className="bg-gradient-1 text-text-primary border-gradient-accent"

// ❌ WRONG
className="bg-[#5d1a1b] text-[#fff]"

// Use Tailwind config with design tokens, never hardcode hex values
```

---

## 5️⃣ DEVELOPER NOTES SECTION

### **For Your Development Team / AI Code Assistant**

Use this section to document decisions and modifications:

```
═════════════════════════════════════════════════════════════════════════════════
📝 DEVELOPMENT NOTES (Update as you build - CRITICAL FOR TEAM!)
═════════════════════════════════════════════════════════════════════════════════

DESIGN DECISIONS & MODIFICATIONS:
┌─────────────────────────────────────────────────────────────────────────────┐
│ Any color changes? (Must stay #000000, #5d1a1b, #161142, #FFFFFF)         │
│ Any spacing adjustments?                                                    │
│ Any typography changes?                                                     │
│ Any new gradients or effects needed?                                       │
│ Any responsive behavior changes?                                            │
│                                                                             │
│ Document here with DATE and REASON:                                        │
│ _________________________________________________________________________   │
│ _________________________________________________________________________   │
│ _________________________________________________________________________   │
│ _________________________________________________________________________   │
└─────────────────────────────────────────────────────────────────────────────┘

FEATURE & QUESTIONNAIRE UPDATES:
┌─────────────────────────────────────────────────────────────────────────────┐
│ New question types to add?                                                  │
│ Changes to the 7-question flow?                                            │
│ New countries to include?                                                  │
│ New video ratios?                                                          │
│ New image/design options?                                                  │
│                                                                             │
│ Document here:                                                             │
│ _________________________________________________________________________   │
│ _________________________________________________________________________   │
│ _________________________________________________________________________   │
└─────────────────────────────────────────────────────────────────────────────┘

TECHNICAL DECISIONS:
┌─────────────────────────────────────────────────────────────────────────────┐
│ Libraries to add/remove?                                                   │
│ API changes?                                                               │
│ Database schema updates?                                                   │
│ Security considerations discovered?                                        │
│ Performance optimizations needed?                                          │
│                                                                             │
│ Document here with DATE:                                                   │
│ _________________________________________________________________________   │
│ _________________________________________________________________________   │
│ _________________________________________________________________________   │
└─────────────────────────────────────────────────────────────────────────────┘

BUGS & ISSUES ENCOUNTERED:
┌─────────────────────────────────────────────────────────────────────────────┐
│ Issue 1:                                                                    │
│ ├─ Description:                                                            │
│ ├─ Date Found:                                                             │
│ ├─ Root Cause:                                                             │
│ ├─ Solution:                                                               │
│ └─ Resolution Date:                                                        │
│                                                                             │
│ _________________________________________________________________________   │
│ _________________________________________________________________________   │
│                                                                             │
│ Issue 2:                                                                   │
│ ├─ Description:                                                            │
│ └─ Status: [In Progress / Resolved]                                        │
│ _________________________________________________________________________   │
│ _________________________________________________________________________   │
│                                                                             │
│ Issue 3:                                                                   │
│ _________________________________________________________________________   │
│ _________________________________________________________________________   │
└─────────────────────────────────────────────────────────────────────────────┘

PERFORMANCE METRICS:
┌─────────────────────────────────────────────────────────────────────────────┐
│ Current Page Load Time: ___________ ms                                     │
│ Target: < 2000 ms                                                          │
│ Current Bundle Size: _____________ KB                                      │
│ Target: < 500 KB                                                           │
│ API Response Time: ___________ ms                                          │
│ Target: < 500 ms                                                           │
│                                                                             │
│ Browser Compatibility Issues:                                              │
│ _________________________________________________________________________   │
│ _________________________________________________________________________   │
│                                                                             │
│ Mobile Performance Notes:                                                  │
│ _________________________________________________________________________   │
│ _________________________________________________________________________   │
└─────────────────────────────────────────────────────────────────────────────┘

TESTING CHECKLIST:
┌─────────────────────────────────────────────────────────────────────────────┐
│ VISUAL DESIGN:                                                             │
│ ☐ Background is #000000 (pure black)                                      │
│ ☐ Gradient colors correct (#5d1a1b + #161142)                            │
│ ☐ All text is #FFFFFF (white)                                            │
│ ☐ All buttons have proper styling                                         │
│ ☐ All components match design specifications                              │
│ ☐ Animations are smooth (0.3s transitions)                               │
│ ☐ Hover states work correctly                                            │
│                                                                             │
│ RESPONSIVENESS:                                                            │
│ ☐ Desktop (1920px+): Layout correct                                       │
│ ☐ Tablet (768-1024px): Responsive                                        │
│ ☐ Mobile (< 768px): Single column                                        │
│ ☐ Touch targets 44px+ on mobile                                          │
│                                                                             │
│ FUNCTIONALITY:                                                              │
│ ☐ All buttons clickable                                                   │
│ ☐ All inputs functional                                                   │
│ ☐ All form validation working                                            │
│ ☐ Image upload working                                                    │
│ ☐ Multiple-choice questions functional                                   │
│ ☐ Results panel displays correctly                                        │
│                                                                             │
│ CODE QUALITY:                                                               │
│ ☐ No TypeScript errors                                                    │
│ ☐ No console errors                                                       │
│ ☐ All design comments present                                            │
│ ☐ Code formatted consistently                                            │
│ ☐ No hardcoded colors                                                     │
│ ☐ No hardcoded spacing values                                            │
│                                                                             │
│ SECURITY:                                                                   │
│ ☐ No API keys in code                                                     │
│ ☐ All inputs validated                                                    │
│ ☐ All errors handled                                                      │
│ ☐ Environment variables used                                              │
│                                                                             │
│ INTEGRATION:                                                                │
│ ☐ Ready to connect to Supabase                                            │
│ ☐ Ready to connect to n8n                                                │
│ ☐ Ready to add payment system                                            │
│ ☐ All APIs documented                                                     │
└─────────────────────────────────────────────────────────────────────────────┘

NEXT STEPS / BLOCKERS:
┌─────────────────────────────────────────────────────────────────────────────┐
│ What's blocking progress?                                                  │
│ _________________________________________________________________________   │
│ _________________________________________________________________________   │
│                                                                             │
│ What's needed before Phase 2?                                              │
│ _________________________________________________________________________   │
│ _________________________________________________________________________   │
│                                                                             │
│ Questions for team:                                                        │
│ _________________________________________________________________________   │
│ _________________________________________________________________________   │
└─────────────────────────────────────────────────────────────────────────────┘

TEAM COMMUNICATION LOG:
┌─────────────────────────────────────────────────────────────────────────────┐
│ Date: __________ | Developer: __________ | Status: ________________________ │
│ Notes: ________________________________________________________________   │
│                                                                             │
│ Date: __________ | Developer: __________ | Status: ________________________ │
│ Notes: ________________________________________________________________   │
│                                                                             │
│ Date: __________ | Developer: __________ | Status: ________________________ │
│ Notes: ________________________________________________________________   │
│                                                                             │
│ Date: __________ | Developer: __________ | Status: ________________________ │
│ Notes: ________________________________________________________________   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6️⃣ HOW ALL YOUR TOOLS WORK TOGETHER

### **THE BIG PICTURE:**

```
┌─────────────────────────────────────────────────────┐
│ LAYER 1: WHAT USERS SEE (Frontend)                  │
│ → Next.js + React creates chat interface           │
│ → Design system: Black bg + gradient borders       │
│ → Users upload images with styled borders          │
│ → Shows guided questions as styled cards           │
│ → Shows results in real-time (styled)              │
│ → All colors: #000000, #5d1a1b, #161142, #FFF     │
│ → All text: White (#FFFFFF)                        │
└─────────────────────────────────────────────────────┘
         ↓↓↓ Data flows down ↓↓↓
┌─────────────────────────────────────────────────────┐
│ LAYER 2: THE SMART BRAIN (AI Processing)            │
│ → n8n orchestrates all the AI work                  │
│ → Receives image → Calls Claude Sonnet 4.5         │
│ → Claude creates strategy & storyboard             │
│ → DALL-E 3 generates images                        │
│ → Runway AI generates videos                       │
│ → Returns results with design context              │
└─────────────────────────────────────────────────────┘
         ↓↓↓ Data flows down ↓↓↓
┌─────────────────────────────────────────────────────┐
│ LAYER 3: DATA STORAGE (Supabase Backend)            │
│ → PostgreSQL stores user accounts                   │
│ → Saves uploaded reference images                  │
│ → Stores generated videos/images/designs           │
│ → Tracks credit usage                              │
│ → Manages projects and chat history                │
└─────────────────────────────────────────────────────┘
         ↓↓↓ Money flows down ↓↓↓
┌─────────────────────────────────────────────────────┐
│ LAYER 4: PAYMENTS                                   │
│ → Stripe charges customers monthly                 │
│ → Resend sends receipts & notifications            │
│ → Tracks subscription plans                        │
└─────────────────────────────────────────────────────┘
```

---

## 7️⃣ COMPLETE FEATURE LIST

### **Frontend Features**

```
AUTHENTICATION:
├─ Email/password signup
├─ Email verification
├─ Password reset
├─ Login/logout
└─ Session management

CHAT INTERFACE:
├─ Real-time messaging
├─ Chat history
├─ User messages (right-aligned, #5d1a1b bg)
├─ AI responses (left-aligned, #161142 bg)
├─ Typing indicator animation
├─ Message timestamps
└─ Chat scrolling

IMAGE UPLOAD:
├─ Drag-and-drop upload
├─ File picker
├─ Image preview
├─ Progress bar
├─ Validation (JPG/PNG only)
├─ Size validation (< 20MB)
├─ Max images per plan (4-12)
└─ Gradient styled borders

QUESTIONNAIRE (7 QUESTIONS):
├─ Question 1: Ad type (6 options)
├─ Question 2: Style (5 options)
├─ Question 3: Format (4 options)
├─ Question 4: Target country (6+ options) ✨ NEW
├─ Question 5: Video ratio (Landscape/Portrait/Square) ✨ NEW
├─ Question 6: Video length (6 options with credit costs)
├─ Question 7: Images + Graphics (4 options) ✨ NEW
├─ Options as cards with gradient borders
├─ Selection highlighting
└─ Progress through questions

RESULTS PANEL:
├─ Progress indicator
├─ Phase checklist
├─ Video player (when ready)
├─ Image gallery (4 images)
├─ Design templates (3 designs)
├─ Marketing copy
├─ Performance score
├─ Download buttons
├─ Share functionality
└─ Save to projects

SIDEBAR:
├─ Navigation menu
├─ Projects list
├─ Chat history
├─ Credit meter
├─ User profile
└─ Settings access

RESPONSIVE DESIGN:
├─ Desktop: 3-column layout
├─ Tablet: 2-column layout
├─ Mobile: Single column
├─ All with gradient styling
├─ Touch-friendly buttons
└─ Smooth transitions
```

### **Backend Features**

```
AUTHENTICATION:
├─ Supabase Auth
├─ JWT tokens
├─ Session management
├─ Password hashing
└─ Email verification

DATABASE:
├─ User profiles
├─ Project management
├─ Chat history
├─ Generated content storage
├─ Credit transactions
├─ Subscription tracking
└─ Real-time subscriptions

API ENDPOINTS:
├─ Chat message submission
├─ Image upload & storage
├─ Generation requests
├─ Results retrieval
├─ Credit balance check
├─ Project CRUD
└─ History retrieval

CREDIT SYSTEM:
├─ Plan management
├─ Credit allocation
├─ Usage tracking
├─ Payment processing
├─ Transaction logging
└─ Refund handling
```

---

## 8️⃣ TIMELINE & BUDGET

### **Development Timeline**

```
WEEK 1-2: FRONTEND BUILD
├─ Project setup
├─ Design system implementation
├─ Component building
├─ Multiple-choice system
├─ Results panel
├─ Testing & polish
└─ Color verification

WEEK 3-4: BACKEND INTEGRATION
├─ Supabase setup
├─ Database creation
├─ Authentication
├─ Chat integration
├─ Credit system
└─ Testing

WEEK 5: n8N INTEGRATION
├─ Workflow setup
├─ API integration
├─ Real-time updates
├─ Error handling
└─ Testing

WEEK 6: TESTING & DEPLOYMENT
├─ Security review
├─ Performance testing
├─ UI/UX review
├─ Deployment
└─ Monitoring

TOTAL: 6 weeks
```
