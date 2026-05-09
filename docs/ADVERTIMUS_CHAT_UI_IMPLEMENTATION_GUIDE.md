# ADVERTIMUS CHAT UI IMPLEMENTATION GUIDE
## Frontend Interactive Chat-First Agent System with n8n Integration

**Date:** April 5, 2026  
**For:** Building the Advertimus Agent Chat Interface, Credit System, and Real-time Generation

---

## 📋 TABLE OF CONTENTS
1. System Architecture Overview
2. Data Flow Diagram
3. Chat UI Component Structure
4. Interactive Multiple-Choice System
5. Generation Workflow with n8n
6. Supabase Integration
7. Real-time Updates & WebSocket
8. Credit System Implementation
9. Complete User Journeys
10. Code Component Patterns

---

## 🎯 PART 1: SYSTEM ARCHITECTURE OVERVIEW

### **3-Column Layout Structure**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ADVERTIMUS MAIN INTERFACE                          │
├──────────────┬────────────────────────────────┬──────────────────────────────┤
│              │                                │                             │
│   SIDEBAR    │      CHAT AREA (Main)         │    RESULTS PANEL (Dynamic)   │
│   (Fixed)    │      (Interactive)             │    (Appears on Generate)    │
│              │                                │                             │
│  ┌─────────┐ │  ┌──────────────────────────┐ │  ┌────────────────────────┐ │
│  │Projects │ │  │ Advertimus Agent         │ │  │ [HIDDEN until generate]│ │
│  │Assets   │ │  │ (Natural Conversation)   │ │  │                        │ │
│  │Settings │ │  │                          │ │  │ When generating:       │ │
│  │Account  │ │  │ "Hi! What would you      │ │  │ 🔄 Progress indicator │ │
│  │History  │ │  │  like to promote?"        │ │  │                        │ │
│  │Support  │ │  │                          │ │  │ When complete:         │ │
│  │         │ │  │ [User types freely...]   │ │  │ ✅ Video Player        │ │
│  │Credits: │ │  │                          │ │  │ ✅ Image Gallery       │ │
│  │[████░] │ │  │ [Live System Feed]       │ │  │ ✅ Design Templates    │ │
│  │Credits: │ │  │ ⚙️ Analyzing request...  │ │  │ ✅ Performance Score   │ │
│  │Dynamic  │ │  │ ⚙️ Generating concept... │ │  └────────────────────────┘ │
│  └─────────┘ │  │                          │ │                             │
│              │  │ [Text Input + Send]     │ │                             │
│              │  └──────────────────────────┘ │                             │
│              │                                │                             │
└──────────────┴────────────────────────────────┴──────────────────────────────┘
```

**Agent-First System Rules:**
- The central column is always the Advertimus agent chat — not a form or dashboard.
- The Result Panel on the right is strictly hidden until generation is actively running.
- All user flows (uploads, choices, execution) happen through the chat conversation.

### **Plan Features & Limits**

```
LAUNCH PLAN ($25/month) - 1,000 Credits
├─ 1 Active Project
├─ 4 Reference Images Max
├─ Max Video: 30 seconds (550 credits)
├─ Basic generation
└─ Standard processing (5-8 min)

GROWTH PLAN ($49/month) - 3,000 Credits ⭐ MOST POPULAR
├─ 3 Active Projects
├─ 12 Reference Images Max
├─ Max Video: 40 seconds (700 credits)
├─ Advanced suggestions
└─ Faster processing (3-5 min)

DOMINANCE PLAN ($199/month) - 8,000 Credits
├─ 10 Active Projects
├─ 12 Reference Images Max
├─ Max Video: 50 seconds (1,000 credits)
├─ Batch processing
└─ Priority processing (1-3 min)

ENTERPRISE PLAN - Custom
├─ Unlimited Projects
├─ Unlimited References
├─ Unlimited Video Length
├─ Custom workflows
└─ API access
```

### **Credit Consumption Table**

```
CONTENT TYPE              CREDITS     TIME
─────────────────────────────────────────────
Image Ad                  40          1-2 min
Social Post Design        60          2-3 min
Video Ad - 15 seconds     400         3-5 min
Video Ad - 20 seconds     450         4-6 min
Video Ad - 30 seconds     550         5-8 min
Video Ad - 40 seconds     700         6-10 min
Video Ad - 50 seconds     1,000       8-12 min
Ad Variation (any)        20          1-2 min
Regenerate (full)         Same        Same

OPTIONAL TOP-UPS:
─────────────────────────────────────────────
Starter Pack              500 credits  $10
Growth Pack               2,000 credits $25
Scale Pack                6,000 credits $50
```

---

## 💫 PART 2: INTERACTIVE MULTIPLE-CHOICE SYSTEM

### **Prerequisite: Idea Approval Gate**

Before any multiple-choice questions appear, Advertimus must first understand the user's product and **propose a creative concept**. The user must explicitly approve this direction.

Ex: Advertimus says: *"Based on what you've shared, I think a Problem→Solution approach would work well here. Does this sound right to you?"*
- User clicks `[✅ Yes, let's go!]` → MCQs begin
- User clicks `[🔄 Try a different angle]` → Advertimus offers alternatives

**Generation CANNOT start, and no questions appear, until the user approves the concept direction.**

---

### **Flow: How Advertimus Guides Users Through Options**

After idea approval, questions appear one-at-a-time as **selectable buttons** in the chat stream, not all at once and never as external forms.

#### **Step 1: Ad Type Selection**

```jsx
Message from Advertimus:
"Perfect! I analyzed your products. Now let me help you create the perfect ad.

What type of ad do you want to create?"

Options Displayed as Buttons:
┌─────────────────────────────────┐
│ 1️⃣ Problem → Solution           │
│   (Show problem, then your      │
│    product as the solution)     │
├─────────────────────────────────┤
│ 2️⃣ Before / After               │
│   (Show transformation)          │
├─────────────────────────────────┤
│ 3️⃣ Storytelling                 │
│   (Tell a story about the       │
│    product or customer)         │
├─────────────────────────────────┤
│ 4️⃣ Direct Selling               │
│   (Show product features,       │
│    benefits, price)             │
├─────────────────────────────────┤
│ 5️⃣ Trend / Viral Style          │
│   (Follow trends, entertaining) │
├─────────────────────────────────┤
│ 6️⃣ Testimonial                  │
│   (Customer success story)       │
└─────────────────────────────────┘

User clicks one (e.g., "Problem → Solution")
→ Choice sent to Supabase
→ Stored in chat context
→ Next set of options appear
```

#### **Step 2: Style Selection**

```jsx
Message from Advertimus:
"Great! Problem → Solution is perfect for your brand.

What style should the ad have?"

Options Displayed:
┌─────────────────────────────────┐
│ ✨ Luxury / Cinematic           │
│    (High-end, professional)     │
├─────────────────────────────────┤
│ 👥 Casual / Real Life           │
│    (Authentic, relatable)       │
├─────────────────────────────────┤
│ 😂 Funny / Comedy               │
│    (Humorous, entertaining)     │
├─────────────────────────────────┤
│ 💔 Emotional                    │
│    (Heart-warming, inspiring)   │
├─────────────────────────────────┤
│ 📸 Studio-Based                 │
│    (Controlled, polished)       │
└─────────────────────────────────┘

User clicks one (e.g., "Luxury / Cinematic")
→ Choice stored
→ Next options appear
```

#### **Step 3: Format Selection**

```jsx
Message from Advertimus:
"Luxury cinematic - excellent choice!

What format do you want for this ad?"

Options Displayed:
┌─────────────────────────────────┐
│ 🎬 Video (Real-life shooting)   │
│    (Professional, authentic)    │
├─────────────────────────────────┤
│ 📸 Image-Based Ad               │
│    (Static, carousel style)     │
├─────────────────────────────────┤
│ 🎨 3D Product Animation         │
│    (Sleek, modern, interactive) │
├─────────────────────────────────┤
│ 🎭 Mixed (Real + 3D)            │
│    (Hybrid approach)            │
└─────────────────────────────────┘

User clicks one (e.g., "Video")
→ Choice stored
→ Next options appear
```

#### **Step 4: Video Length Selection** (If Video Chosen)

```jsx
Message from Advertimus:
"Video format - perfect! This will really showcase 
your product's transformation.

How long should the ad be?"

Available options depend on PLAN:

LAUNCH Plan ($25/month):
┌─────────────────────────────────┐
│ ⏱️ 15 seconds (400 credits)      │
├─────────────────────────────────┤
│ ⏱️ 20 seconds (450 credits)      │
├─────────────────────────────────┤
│ ⏱️ 30 seconds (550 credits) ⭐   │ ← MAX for LAUNCH
├─────────────────────────────────┤
│ ⏱️ 40 seconds (700 credits)      │
│   🔒 Upgrade needed              │
├─────────────────────────────────┤
│ ⏱️ 50 seconds (1,000 credits)    │
│   🔒 Upgrade needed              │
└─────────────────────────────────┘

GROWTH Plan ($49/month):
┌─────────────────────────────────┐
│ ⏱️ 15 seconds (400 credits)      │
├─────────────────────────────────┤
│ ⏱️ 20 seconds (450 credits)      │
├─────────────────────────────────┤
│ ⏱️ 30 seconds (550 credits)      │
├─────────────────────────────────┤
│ ⏱️ 40 seconds (700 credits) ⭐   │ ← MAX for GROWTH
├─────────────────────────────────┤
│ ⏱️ 50 seconds (1,000 credits)    │
│   🔒 Upgrade needed              │
└─────────────────────────────────┘

DOMINANCE Plan ($199/month):
┌─────────────────────────────────┐
│ ⏱️ 15 seconds (400 credits)      │
├─────────────────────────────────┤
│ ⏱️ 20 seconds (450 credits)      │
├─────────────────────────────────┤
│ ⏱️ 30 seconds (550 credits)      │
├─────────────────────────────────┤
│ ⏱️ 40 seconds (700 credits)      │
├─────────────────────────────────┤
│ ⏱️ 50 seconds (1,000 credits) ⭐ │ ← MAX for DOMINANCE
└─────────────────────────────────┘

ENTERPRISE Plan:
┌─────────────────────────────────┐
│ ⏱️ Custom duration available      │
│   (No limits)                   │
└─────────────────────────────────┘

User clicks one (e.g., "30 seconds")
→ Credits displayed: "550 credits - You have 3,200"
→ Next step appears
```

#### **Step 5: Generation Summary & Start Button**

```jsx
Message from Advertimus:
"Perfect! Here's your ad plan:

📋 YOUR AD CONFIGURATION:
├─ Type: Problem → Solution
├─ Style: Luxury / Cinematic
├─ Format: Video
├─ Duration: 30 seconds
├─ Storyboard: 8 scenes
├─ Credit Cost: 550 credits
│  (You'll have: 2,650 remaining)
└─ Est. Time: 5-8 minutes

Ready to create this ad?"

┌──────────────────────────────┐
│ 🚀 START GENERATING BUTTON   │
│   (Disables if insufficient  │
│    credits)                  │
├──────────────────────────────┤
│ ✏️ EDIT CHOICES              │
│   (Go back and change)       │
├──────────────────────────────┤
│ ❌ CANCEL                    │
│   (Start over)               │
└──────────────────────────────┘

User clicks "START GENERATING"
→ Generation process begins
→ Results Panel appears
→ Connection to n8n backend initiated
```

---

## 🔌 PART 3: DATA FLOW & INTEGRATION

### **Frontend → Supabase → n8n Flow**

```
User Flow in Frontend:
│
├─ Clicks [+] to upload reference images
│  └─ Images validated (type, size, count)
│  └─ Uploaded to Supabase Storage
│  └─ URLs saved in Supabase database
│
├─ Selects from multiple-choice options
│  └─ Each choice stored in Supabase
│  └─ Choice context sent to Claude for next question
│
├─ Clicks "START GENERATING"
│  ├─ Validate credits (check Supabase user_credits table)
│  ├─ If insufficient: Show upgrade modal
│  ├─ If sufficient: Deduct credits from Supabase
│  ├─ Send to n8n webhook
│  └─ Display Results Panel with progress
│
└─ Real-time progress via WebSocket
   ├─ n8n processes: Claude analysis → Storyboard → Images → Video
   ├─ Each phase sent back to frontend
   ├─ Results Panel updates in real-time
   └─ When complete: Display all generated content
```

### **Detailed n8n Backend Flow**

```
n8n Workflow Triggered:
│
├─ PHASE 1: Analyze Images
│  ├─ OpenAI Vision API reads uploaded images
│  ├─ Returns: Product description, colors, style
│  └─ Cost: $0.03
│
├─ PHASE 2: Generate Strategy
│  ├─ Claude Sonnet 4.5: Understand brand + create strategy
│  ├─ Returns: Marketing angle, messaging
│  └─ Cost: $0.009
│
├─ PHASE 3: Create Storyboard
│  ├─ Claude Sonnet 4.5: Create 8-scene storyboard
│  ├─ Returns: Detailed scene descriptions + image prompts
│  ├─ Send progress: "✓ Phase 1 complete" to frontend
│  └─ Cost: $0.006
│
├─ PHASE 4: Generate Storyboard Images
│  ├─ DALL-E 3: Generate 8 images from prompts
│  ├─ Images appear in Results Panel as generated
│  ├─ Send progress: "⏳ Generating video (50%)" to frontend
│  └─ Cost: $0.32 (8 × $0.04)
│
├─ PHASE 5: Generate Video
│  ├─ Runway AI: Create video from 8 storyboard images
│  ├─ Takes 2-4 minutes
│  ├─ Send progress: "⏳ Finalizing (90%)" to frontend
│  └─ Cost: $550-1000 credits worth
│
├─ PHASE 6: Generate Variations
│  ├─ DALL-E 3: Create product images (4)
│  ├─ DALL-E 3: Create social media designs (3)
│  ├─ Claude: Generate marketing copy
│  └─ Cost: $0.60 (images + text)
│
└─ PHASE 7: Performance Score
   ├─ Claude Sonnet 4.5: Rate the content
   ├─ Return to frontend as complete
   └─ Cost: $0.004

ALL PHASES: Send real-time updates via WebSocket
```

### **Supabase Tables Updated During Flow**

```
TABLE: chat_messages
├─ Add: User uploaded images
├─ Add: Each user choice (ad type, style, format, length)
├─ Add: Generation request details
└─ Add: Status updates from n8n

TABLE: generated_content
├─ Add: Video URL + metadata
├─ Add: Image URLs (storyboard + products)
├─ Add: Design template URLs
├─ Add: Marketing copy
└─ Add: Performance score

TABLE: user_credits
├─ Deduct: Initial credit amount (550 for 30-sec video)
└─ Update: credits_remaining, credits_used

TABLE: credit_transactions
├─ Log: When generation started
├─ Log: Credits deducted
├─ Log: When generation completed
└─ Log: Status (success/failed)
```

---

## 🎨 PART 4: UI COMPONENT DETAILS

### **ChatArea Component - Message Rendering**

```jsx
CHAT MESSAGE TYPES:

1. User Message
   ├─ Aligned to RIGHT
   ├─ Background: #5d1a1b (maroon, per design system)
   ├─ White text
   ├─ Shows timestamp
   └─ May include image thumbnails

2. Advertimus Agent Message (role: 'agent')
   ├─ Aligned to LEFT
   ├─ Background: #161142 (purple, per design system)
   ├─ White text
   ├─ Shows timestamp
   └─ May include MCQ options rendered below it

3. Multiple-Choice Options (role: 'interactive')
   ├─ Each option = clickable BUTTON with gradient border
   ├─ Styled as card/container
   ├─ Icon + number + title + description
   ├─ Hover effect (slight highlight + shadow)
   ├─ Click: Locks the selection, sends choice to backend
   └─ Only ONE can be selected; disabled after choosing

4. Generation Status Message
   ├─ Shows progress bar
   ├─ Shows phase indicator
   │  ├─ ✓ Phase 1 complete
   │  ├─ ✓ Phase 2 complete
   │  ├─ ⏳ Phase 3 in progress
   │  └─ ○ Phase 4 pending
   └─ Updates in real-time

5. Live System Feed (role: 'system')
   ├─ Rendered inline in the chat stream during generation
   ├─ Minimal styling: muted text + animated spinner
   ├─ NOT a user-facing reply — reflects backend operations
   └─ Examples:
      ├─ ⚙️ "Analyzing your idea..."
      ├─ ⚙️ "Generating concept..."
      ├─ ⚙️ "Storyboard created..."
      ├─ ⚙️ "Generating visuals..."
      ├─ ⚙️ "Combining scenes..."
      └─ ⚙️ "Rendering final output..."
```

### **ResultsPanel Component - Display Areas**

```
RESULTS PANEL (appears when generation starts):

1. Status Header (Always visible)
   ├─ If generating: 
   │  └─ "🔄 Creating your content (60%)"
   │     [████████░░] 60%
   │     Estimated: 3 minutes remaining
   │
   └─ If complete:
      └─ "✅ Your content is ready!"

2. Video Player (If video generated)
   ├─ Full width video player
   ├─ ▶️ Play/Pause controls
   ├─ Duration: 0:30
   ├─ Quality selector (720p, 1080p, 4K)
   ├─ Download button
   └─ Share button

3. Image Gallery (If images generated)
   ├─ Thumbnail grid (4 images)
   ├─ Click to expand full size
   ├─ "Download All as ZIP"
   └─ Individual download per image

4. Design Templates (If designs generated)
   ├─ Instagram preview
   ├─ Facebook preview
   ├─ Pinterest preview
   ├─ Edit in Canva button
   └─ Download each

5. Marketing Copy
   ├─ Strategy summary
   ├─ Ad headlines
   ├─ Social captions
   ├─ CTA suggestions
   └─ Copy to clipboard

6. Performance Score
   ├─ Overall: 89/100
   ├─ Visual Appeal: 92/100
   ├─ Message Clarity: 87/100
   ├─ Audience Alignment: 94/100
   └─ Call to Action: 85/100

7. Action Buttons
   ├─ [💾 Save Project]
   ├─ [⬇️ Download All]
   ├─ [🔗 Share]
   ├─ [🎨 Edit Style]
   └─ [↻ Regenerate]
```

### **Sidebar Component - Dynamic Updates**

```
SIDEBAR UPDATES DURING GENERATION:

Before Generation:
├─ Credit display: "3,200/8,000"
│  └─ "Plenty of credits!"
└─ [Start Generating] Button active

During Generation:
├─ Credit display: "3,200/8,000"
│  └─ Highlighted (showing current use)
├─ Results Panel expands
└─ Can browse history while waiting

After Generation:
├─ Credit display: "2,650/8,000" (updated!)
│  └─ "550 credits used"
├─ New item in chat history:
│  └─ "[Project] - 15 min ago"
└─ Can view saved assets
```

---

## 🔄 PART 5: GENERATION WORKFLOW SEQUENCE

### **Complete User Journey with Credit Validation**

```
STEP 1: User Uploads Reference Images
┌─────────────────────────────────┐
│ Frontend Validation:            │
├─ File type: JPG/PNG only       │
├─ File size: < 20MB each        │
├─ Max count:                     │
│  ├─ LAUNCH: 4 images           │
│  ├─ GROWTH: 12 images          │
│  ├─ DOMINANCE: 12 images       │
│  └─ ENTERPRISE: unlimited      │
└─────────────────────────────────┘
│
├─ Send: POST /api/chat/upload-references
├─ Supabase: Save images to storage
├─ Supabase: Update projects.reference_images
└─ Frontend: Show image previews

STEP 2: User Selects Ad Type
┌─────────────────────────────────┐
│ Multiple-Choice Options:        │
├─ Problem → Solution            │
├─ Before / After                │
├─ Storytelling                  │
├─ Direct Selling                │
├─ Trend / Viral                 │
└─ Testimonial                   │
└─────────────────────────────────┘
│
├─ User clicks one option
├─ Send: POST /api/chat/message {choice}
├─ Supabase: Store choice
├─ Claude: Process and suggest next question
└─ Frontend: Display next options

STEP 3: User Selects Style
┌─────────────────────────────────┐
│ Multiple-Choice Options:        │
├─ Luxury / Cinematic            │
├─ Casual / Real Life            │
├─ Funny / Comedy                │
├─ Emotional                     │
└─ Studio-Based                  │
└─────────────────────────────────┘
│
└─ Same flow as Step 2

STEP 4: User Selects Format
┌─────────────────────────────────┐
│ Multiple-Choice Options:        │
├─ Video (Real-life)             │
├─ Image-Based Ad                │
├─ 3D Product Animation          │
└─ Mixed (Real + 3D)             │
└─────────────────────────────────┘
│
├─ If Video selected → go to STEP 5
├─ If Image selected → Show image credit options
└─ If Design selected → Show design credit options

STEP 5: User Selects Video Length
┌─────────────────────────────────┐
│ Options based on PLAN:          │
│                                 │
│ LAUNCH (30s max):               │
│ ├─ 15s (400 credits)           │
│ ├─ 20s (450 credits)           │
│ └─ 30s (550 credits)           │
│                                 │
│ GROWTH (40s max):               │
│ ├─ 15s (400 credits)           │
│ ├─ 20s (450 credits)           │
│ ├─ 30s (550 credits)           │
│ └─ 40s (700 credits)           │
│                                 │
│ DOMINANCE (50s max):            │
│ ├─ [All options available]      │
│ └─ 50s (1,000 credits)         │
└─────────────────────────────────┘
│
├─ Show credit cost for each
├─ Show remaining credits
├─ Disable options if insufficient credits
└─ Display upgrade CTA if needed

STEP 6: Credit Validation & Confirmation
┌─────────────────────────────────┐
│ Frontend Checks:                │
├─ Get user plan from Supabase    │
├─ Get user credits_remaining     │
├─ Calculate total cost:          │
│  ├─ + 550 (for 30s video)      │
│  └─ = 550 total                │
│                                 │
│ if (credits_remaining >= 550) { │
│   Show "START GENERATING"       │
│   Enable button                 │
│ } else {                        │
│   Show upgrade modal            │
│   Disable button                │
│ }                               │
└─────────────────────────────────┘

STEP 7: User Clicks "START GENERATING"
│
├─ PRE-CONDITION: This button is only enabled after:
│  ├─ Advertimus has proposed an idea (based on uploaded assets)
│  ├─ User has explicitly approved the concept direction
│  └─ All required sequential MCQ questions are answered
│
├─ POST /api/generate/video
│  ├─ payload: {
│  │   project_id,
│  │   user_id,
│  │   ad_type,
│  │   style,
│  │   format,
│  │   video_length,
│  │   reference_images,
│  │   credits_cost: 550
│  │ }
│
├─ Backend validation:
│  ├─ Check credits_remaining >= 550
│  ├─ Check reference_count <= max_references
│  ├─ Check video_length <= plan_max_length
│  └─ Check if generating (prevent duplicate)
│
├─ Deduct credits from Supabase:
│  ├─ UPDATE user_credits
│  │  SET credits_used = 550,
│  │      credits_remaining = 2650
│  │  WHERE user_id = xxx
│  │
│  └─ INSERT credit_transactions
│     (for audit trail)
│
├─ Send to n8n webhook:
│  ├─ POST https://n8n-instance.com/webhook/advertimus
│  └─ Payload with all details
│
├─ Results Panel MOUNTS and appears dynamically (was hidden)
├─ Chat stream begins showing system feed messages (role: 'system')
├─ "🔄 Generating... (10%)"
└─ WebSocket connection established

STEP 8: n8n Processing (Real-time Updates)
│
├─ n8n PHASE 1: Analyze Images
│  ├─ OpenAI Vision reads images
│  └─ Send: {phase: 1, progress: 20, status: "Analyzing..."}
│
├─ n8n PHASE 2: Strategy
│  ├─ Claude creates strategy
│  └─ Send: {phase: 2, progress: 30, status: "Planning..."}
│
├─ n8n PHASE 3: Storyboard
│  ├─ Claude creates 8-scene storyboard
│  └─ Send: {phase: 3, progress: 40, status: "Creating storyboard..."}
│
├─ n8n PHASE 4: Generate Images
│  ├─ DALL-E 3 creates storyboard images
│  ├─ As each image completes, send preview URL
│  └─ Send: {phase: 4, progress: 60, status: "Image 3 of 8..."}
│
├─ n8n PHASE 5: Generate Video
│  ├─ Runway AI creates video (2-4 min)
│  ├─ Update every 30 seconds
│  └─ Send: {phase: 5, progress: 80, status: "Finalizing video..."}
│
├─ n8n PHASE 6: Generate Variations
│  ├─ Product images (4)
│  ├─ Social designs (3)
│  └─ Send: {phase: 6, progress: 90, status: "Final touches..."}
│
└─ n8n PHASE 7: Complete
   ├─ All URLs to Supabase
   ├─ Save to generated_content table
   └─ Send: {phase: 7, progress: 100, status: "Ready!"}

STEP 9: Frontend Displays Results
│
├─ Results Panel shows:
│  ├─ ✅ Video Player (playable)
│  ├─ 📸 Image Gallery (4 images)
│  ├─ 🎨 Design Templates (3)
│  ├─ 📝 Marketing Copy
│  └─ 📊 Performance Score
│
├─ Chat shows completion message
├─ Sidebar updates credits to 2,650
├─ Chat history shows new item
└─ User can download or regenerate
```

---

## 🔐 PART 6: CREDIT SYSTEM LOGIC

### **Credit Validation Before Generation**

```javascript
// Frontend Logic
async function validateAndGenerate() {
  // 1. Get user plan & credits
  const { plan_type, credits_remaining } = 
    await supabase
      .from('user_credits')
      .select('plan_type, credits_remaining')
      .eq('user_id', user.id)
      .single()

  // 2. Calculate cost based on choices
  const contentType = userChoices.format // 'video', 'image', 'design'
  const videoLength = userChoices.videoLength // 15, 20, 30, 40, 50
  
  let creditCost = 0
  
  if (contentType === 'video') {
    const creditMap = {
      15: 400,
      20: 450,
      30: 550,
      40: 700,
      50: 1000
    }
    creditCost = creditMap[videoLength]
  } else if (contentType === 'image') {
    creditCost = 40
  } else if (contentType === 'design') {
    creditCost = 60
  }

  // 3. Validate plan limits
  const planLimits = {
    'LAUNCH': { maxVideoLength: 30, maxReferences: 4 },
    'GROWTH': { maxVideoLength: 40, maxReferences: 12 },
    'DOMINANCE': { maxVideoLength: 50, maxReferences: 12 },
    'ENTERPRISE': { maxVideoLength: null, maxReferences: null }
  }

  const limits = planLimits[plan_type]
  
  if (contentType === 'video' && videoLength > limits.maxVideoLength) {
    // Show upgrade modal
    return showUpgradeModal(plan_type, videoLength)
  }

  // 4. Validate credits
  if (credits_remaining < creditCost) {
    // Show insufficient credits modal
    return showInsufficientCreditsModal(
      creditCost - credits_remaining
    )
  }

  // 5. All valid - proceed to generation
  return submitToGeneration(creditCost)
}
```

### **Supabase Credit Transaction Logging**

```sql
-- When generation starts:
INSERT INTO credit_transactions (
  user_id,
  project_id,
  transaction_type,
  credits_deducted,
  status,
  description,
  created_at
) VALUES (
  $1,
  $2,
  'VIDEO_GENERATION',
  550,
  'PENDING',
  'Video ad - 30 seconds, Problem→Solution style',
  NOW()
);

-- When generation completes:
UPDATE credit_transactions
SET 
  status = 'COMPLETED',
  completed_at = NOW()
WHERE user_id = $1 AND status = 'PENDING';

-- Update user credits:
UPDATE user_credits
SET
  credits_used = credits_used + 550,
  credits_remaining = credits_remaining - 550,
  updated_at = NOW()
WHERE user_id = $1;
```

---

## 🔌 PART 7: WEBSOCKET REAL-TIME UPDATES

### **Frontend WebSocket Connection**

```javascript
// Connect to WebSocket when generation starts
const connectToGenerationStream = (generationId) => {
  const ws = new WebSocket(
    `wss://your-backend.com/ws/generation/${generationId}`
  )

  ws.onopen = () => {
    console.log('Connected to generation stream')
    setResultsPanelVisible(true)
    setGenerationStatus('Analyzing images...')
  }

  ws.onmessage = (event) => {
    const update = JSON.parse(event.data)
    
    // Update Results Panel with real-time progress
    setGenerationPhase(update.phase)
    setProgress(update.progress)
    setGenerationStatus(update.status)
    
    // Add preview image if available
    if (update.preview_image_url) {
      addImageToGallery(update.preview_image_url)
    }
    
    // When complete, load all results
    if (update.phase === 7) {
      loadGeneratedContent(generationId)
      ws.close()
    }
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
    setGenerationError('Generation failed. Please try again.')
    deductCreditsReverse() // Refund credits on failure
  }

  ws.onclose = () => {
    console.log('Generation stream closed')
  }

  return ws
}
```

### **Progress Updates Flow**

```
n8n Backend sends every 5-10 seconds:
{
  "generation_id": "uuid",
  "phase": 3,
  "progress": 40,
  "status": "Creating storyboard frames...",
  "preview_image_url": "https://...",
  "estimated_remaining": "3 minutes"
}

Frontend receives and updates:
├─ Results Panel progress bar: 40%
├─ Phase indicator: "Step 3 of 7"
├─ Status text: "Creating storyboard frames..."
├─ If preview available: Show in gallery
└─ Timer: "3 minutes remaining"

User sees real-time progress
without needing to refresh!
```

---

## 📱 PART 8: COMPLETE USER JOURNEY EXAMPLE

> **Note:** The user represented in this journey is a dynamic, authenticated user. Names like "Sarah" are illustrative placeholders only. The system always loads the authenticated user's real name and plan data from Supabase.

### **Example Ad Creation Journey**

```
=== EXAMPLE USER JOURNEY ===

TIME: 2:00 PM
User logs in to Advertimus
├─ Chat shows dynamic greeting from Advertimus (name pulled from auth session)
├─ Plan: Growth ($49/month) — loaded from Supabase
├─ Credits: [user.credits_remaining] displayed in sidebar
└─ Active Projects: [user.active_projects]/3

TIME: 2:02 PM
User opens a new chat session
├─ Chat Area loads — Results Panel: FULLY HIDDEN
└─ Advertimus: "Hi! I'm Advertimus. Tell me about your product and what you want to promote."

TIME: 2:03 PM
User describes their product freely and uploads reference images
├─ Clicks [+] button in chat or drags images
├─ Selects product reference photos
├─ Images upload and display as thumbnails in chat
├─ Status: "[n]/[plan_max] images uploaded"

TIME: 2:04 PM
Advertimus analyzes the uploaded assets and the user's description
└─ Advertimus proposes a concept: "Based on what you've shared,
   a Storytelling approach could work really well here.
   Does this direction feel right to you?"

User sees approval buttons:
[✅ Yes, let's go!]   [🔄 Try a different angle]

User clicks: "✅ Yes, let's go!"
├─ Idea locked as approved
└─ MCQ sequence begins

Advertimus: "Perfect! Let me ask a few quick questions."

"What type of ad format?"
User sees options:
1. Problem → Solution
2. Before / After
3. Storytelling
4. Direct Selling
5. Trend / Viral Style
6. Testimonial

User clicks: "3. Storytelling"
├─ Choice saved to Supabase
└─ Next question appears

TIME: 2:05 PM
Advertimus: "Great choice! What style should the ad have?"

User sees options:
1. Luxury / Cinematic
2. Casual / Real Life
3. Funny / Comedy
4. Emotional
5. Studio-Based

User clicks: "1. Luxury / Cinematic"
└─ Next question appears

TIME: 2:06 PM
Advertimus: "Luxury cinematic — excellent. What format?"

User sees options:
1. Video (Real-life shooting)
2. Image-Based Ad
3. 3D Product Animation
4. Mixed (Real + 3D)

User clicks: "1. Video (Real-life shooting)"
└─ Next question appears (video-specific branch)

TIME: 2:07 PM
Advertimus: "Perfect! How long should the ad be?"

User sees (Growth plan limits loaded dynamically):
1. 15 seconds (400 credits)
2. 20 seconds (450 credits)
3. 30 seconds (550 credits)
4. 40 seconds (700 credits) ← MAX for GROWTH
5. 50 seconds (1,000 credits) 🔒 Upgrade needed

User clicks: "3. 30 seconds (550 credits)"

Advertimus shows summary:
"📋 YOUR AD CONFIGURATION:
├─ Type: Storytelling
├─ Style: Luxury / Cinematic
├─ Format: Video
├─ Duration: 30 seconds
├─ Storyboard: 8 scenes
├─ Credit Cost: 550 credits
│  You'll have: 2,650 remaining
└─ Est. Time: 5-8 minutes

Ready to create this ad?"

TIME: 2:08 PM
Sarah clicks: "🚀 START GENERATING"

Frontend validates:
✓ Plan allows 30-second videos
✓ Credits sufficient (3,200 ≥ 550)
✓ References uploaded (3/12 ✓)

Credits deducted: 3,200 → 2,650

TIME: 2:08 PM
Results Panel APPEARS!

"🔄 Creating your content (10%)"
├─ Phase 1: Image analysis
├─ Progress: [██░░░░░░░░] 10%
└─ Est. time: 6 minutes remaining

TIME: 2:09 PM
Results Panel updates:
"🔄 Creating your content (20%)"
├─ ✓ Image analysis complete
├─ Phase 2: Brand strategy
├─ Progress: [████░░░░░░] 20%

TIME: 2:10 PM
"🔄 Creating your content (35%)"
├─ ✓ Image analysis
├─ ✓ Brand strategy
├─ Phase 3: Storyboard creation
├─ Progress: [███████░░░] 35%

TIME: 2:11 PM
"🔄 Creating your content (45%)"
├─ ✓ Image analysis
├─ ✓ Brand strategy  
├─ ✓ Storyboard frames
│  └─ [Thumbnail 1] [Thumbnail 2] [Thumbnail 3]...
├─ Phase 4: Generating video
├─ Progress: [█████████░░] 45%

TIME: 2:13 PM
"🔄 Creating your content (70%)"
├─ ✓ Previous phases
├─ Phase 5: Finalizing video
├─ Progress: [█████████████░░] 70%
└─ Est. time: 2 minutes remaining

TIME: 2:15 PM
"✅ YOUR CONTENT IS READY!"

Results Panel shows:
├─ 🎬 VIDEO PLAYER
│  ├─ ▶️ [0:00 ━━━━━━━━━━ 0:30] 🔊
│  ├─ Quality: 4K
│  ├─ Format: 1920x1080 Landscape
│  ├─ [⬇️ Download] [🔗 Share]
│
├─ 📸 PRODUCT IMAGES (4)
│  ├─ [Img 1] [Img 2] [Img 3] [Img 4]
│  ├─ [⬇️ Download All]
│
├─ 🎨 DESIGN TEMPLATES (3)
│  ├─ Instagram (shown)
│  ├─ Facebook (shown)
│  ├─ Pinterest (shown)
│  └─ [🎨 Edit in Canva]
│
├─ 📝 MARKETING COPY
│  ├─ "Timeless craftsmanship in every stitch"
│  ├─ [📋 Copy]
│
├─ 📊 PERFORMANCE SCORE: 92/100 ⭐
│  ├─ Visual Appeal: 95/100
│  ├─ Message Clarity: 90/100
│  ├─ Audience Alignment: 92/100
│  └─ Call to Action: 88/100
│
└─ Action Buttons:
   ├─ [💾 Save Project]
   ├─ [⬇️ Download All]
   ├─ [🔗 Share]
   ├─ [🎨 Edit Style]
   └─ [↻ Regenerate] (20 credits)

Chat Area shows:
"Your storytelling luxury video ad is complete! 
Ready to use across all platforms.

Next steps:
→ Download and post to Instagram/TikTok/YouTube
→ Get performance score of 92/100 (excellent!)
→ Need another version? Create variations for just 20 credits!"

TIME: 2:16 PM
Sidebar updates:
├─ Credits: [████████░░] 2,650/3,000
├─ Text: "550 credits used"
└─ New chat in history: "Leather Wallets Storytelling - just now"

TIME: 2:20 PM
Sarah clicks "⬇️ Download All"
├─ ZIP file downloaded with:
│  ├─ 30-second video (MP4, 4K)
│  ├─ 4 product images (PNG, high-res)
│  ├─ 3 design templates (PNG, web-ready)
│  └─ Marketing copy (TXT)

Sarah shares video on Instagram
Result: Her followers love it!

TIME: 2:30 PM
Sarah returns to Advertimus
Advertismus offers:
"Ready for a variation? I can create:
├─ Different style (20 credits)
├─ Shorter version (15-20 sec)
├─ Different target audience

You have 2,650 credits. What would you like?"

Sarah clicks: "Different style - Casual/Real Life"
└─ Back to multiple-choice flow for new video

=== END OF JOURNEY ===

SUMMARY:
✓ Generated 1 video ad (30 sec)
✓ 4 product images
✓ 3 social media designs
✓ Marketing copy + performance score
✓ Used 550 credits
✓ Remaining: 2,650 credits
✓ Next month: 3,000 credits reset
✓ Total time: ~12 minutes
✓ Can generate 6 more videos this month
```

---

## ✅ IMPLEMENTATION CHECKLIST

### **Components to Build**

- [ ] MainLayout (3-column layout wrapper)
- [ ] Header (navigation + profile)
- [ ] Sidebar (navigation + credit meter)
- [ ] ChatArea (messages + input)
- [ ] MessageItem (individual message render)
- [ ] MultiChoiceOptions (multiple-choice buttons)
- [ ] ImageUploader (drag-drop + validation)
- [ ] ResultsPanel (hidden until generation)
- [ ] VideoPlayer (HLS streaming)
- [ ] ImageGallery (thumbnail grid)
- [ ] DesignTemplates (responsive display)
- [ ] ProgressBar (real-time updates)
- [ ] PerformanceScore (rating display)
- [ ] DownloadModal (ZIP file options)
- [ ] UpgradeModal (insufficient credits)

### **Services to Implement**

- [ ] chatService (send messages, uploads)
- [ ] generationService (trigger n8n)
- [ ] creditService (check, deduct, track)
- [ ] supabaseClient (database operations)
- [ ] websocketService (real-time updates)
- [ ] fileDownloadService (ZIP generation)
- [ ] shareService (generate share links)

### **Hooks to Create**

- [ ] useChat (chat state management)
- [ ] useCredits (credit tracking)
- [ ] useGeneration (generation state)
- [ ] useWebSocket (real-time connection)
- [ ] useLocalStorage (persist choices)
- [ ] useAuth (user authentication)

### **API Endpoints Needed**

- [ ] POST /api/chat/message
- [ ] POST /api/chat/upload-references
- [ ] POST /api/generate/video
- [ ] POST /api/generate/image
- [ ] POST /api/generate/design
- [ ] GET /api/generate/:id/status
- [ ] GET /api/credits/balance
- [ ] POST /api/credits/deduct
- [ ] GET /api/content/:id/download
- [ ] POST /api/content/:id/share

---

## 🎯 SUMMARY

This implementation guide covers:

✅ **3-Column Interactive UI** with real-time updates  
✅ **Multiple-choice dialogue system** for guided creation  
✅ **Credit validation** before generation  
✅ **Real-time progress** via WebSocket  
✅ **Plan-based limits** (video length, references)  
✅ **Complete data flow** (Frontend → Supabase → n8n → Frontend)  
✅ **Full user journey** with examples  
✅ **Component specifications** for all parts  

Use this as your blueprint for building with your AI code assistant! 🚀
