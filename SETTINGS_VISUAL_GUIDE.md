# Settings Modal Visual Guide

## 📐 Settings Modal Layout

```
╔════════════════════════════════════════════════════════════════╗
║                        ⚙️ Settings                             ║
╚════════════════════════════════════════════════════════════════╝

┌────────────────────────────────────────────────────────────────┐
│  🎨 APPEARANCE                                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Label: Theme                                                 │
│  Type:  Dropdown Select                                       │
│  ┌──────────────────────────────────────┐                    │
│  │ ☀️ Light Mode  ▼                    │                    │
│  └──────────────────────────────────────┘                    │
│  
│  Options:
│    • ☀️ Light Mode (Default)
│    • 🌙 Dark Mode
│                                                                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  📋 ATTENDANCE SETTINGS                                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Label: Min Attendance                                        │
│  Type:  Number Input (0-100)                                 │
│  ┌──────────────────────────────────────┐                    │
│  │ 75                                    │ %                │
│  └──────────────────────────────────────┘                    │
│  Description: Minimum safe attendance percentage              │
│                                                                │
│  Label: Semester Start                                        │
│  Type:  Date Input (MM/DD/YYYY)                              │
│  ┌──────────────────────────────────────┐                    │
│  │ 01/15/2024                           │                    │
│  └──────────────────────────────────────┘                    │
│                                                                │
│  Label: Semester End                                          │
│  Type:  Date Input (MM/DD/YYYY)                              │
│  ┌──────────────────────────────────────┐                    │
│  │ 06/30/2024                           │                    │
│  └──────────────────────────────────────┘                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  🤖 AI PREDICTIONS                                             │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Label: Enable Gemini Predictions                             │
│  Type:  Checkbox                                              │
│  ☑ Enable Gemini Predictions                                 │
│                                                                │
│  Label: Google Gemini API Key                                 │
│  Type:  Password Input (Hidden)                              │
│  ┌──────────────────────────────────────┐                    │
│  │ •••••••••••••••••••••••••••••••••   │                    │
│  └──────────────────────────────────────┘                    │
│  
│  📌 Get your free API key:                                   │
│  🔗 https://aistudio.google.com/app/apikey                   │
│                                                                │
│  Info: API key used for attendance prediction                │
│        and class absence date guessing                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  [Save Settings]  [Cancel]                                    │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Form Field Details

### Section 1: 🎨 Appearance
**Purpose**: Customize visual appearance of the app

| Field | Type | Default | Options |
|-------|------|---------|---------|
| Theme | Select | "light" | Light ☀️, Dark 🌙 |

**Instant Effects**: 
- Text color inverts
- Background changes
- All UI elements update
- No page reload needed

---

### Section 2: 📋 Attendance Settings
**Purpose**: Configure attendance tracking parameters

| Field | Type | Default | Format |
|-------|------|---------|---------|
| Min Attendance | Number | 75 | 0-100 (%) |
| Semester Start | Date | Today | MM/DD/YYYY |
| Semester End | Date | Today + 6mo | MM/DD/YYYY |

**Used For**:
- Warning system activation
- Analytics calculations
- Prediction recommendations
- Calendar highlighting

---

### Section 3: 🤖 AI Predictions
**Purpose**: Enable AI-powered class attendance predictions

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| Enable Gemini | Checkbox | false | Toggle Gemini features |
| API Key | Password | empty | Hidden input for security |

**Security**: 
- Never sent to external servers
- Stored only in browser's localStorage
- Can be removed anytime

---

## 🔄 Settings Flow

```
User clicks ⚙️ Settings
           ↓
Settings modal opens
           ↓
Modal loads from localStorage
           ↓
Form fields populate with current values
           ↓
User modifies settings
           ↓
User clicks "Save Settings"
           ↓
Form validation runs
           ↓
Settings saved to localStorage
           ↓
Theme applied (if changed)
           ↓
Page updates immediately
           ↓
Success notification shown
```

---

## 🎨 Light Mode Display

```
┌─────────────────────────────────┐
│ Light Background: #FFFFFF       │
│ Card Background: #F0E6FF        │
│ Text Color: #1A1A2E             │
│ Borders: #A855F7                │
│ Buttons: Purple gradient        │
│ Accents: Purple/Magenta         │
│                                 │
│ ☀️ Bright, clear, daytime      │
│ 👁️ Easy to read in daylight    │
│ 📝 High contrast text           │
└─────────────────────────────────┘
```

---

## 🎨 Dark Mode Display

```
┌─────────────────────────────────┐
│ Background: #0A0E27 (Navy)      │
│ Card: #1A1A3E (Dark Purple)     │
│ Text: #E0E0FF (Light Lavender)  │
│ Borders: #5A2D82 (Med Purple)   │
│ Buttons: Dark purple gradient   │
│ Accents: Gold (#FFD700)         │
│                                 │
│ 🌙 Dark, easy on eyes           │
│ 👁️ Less strain at night         │
│ ✨ Modern appearance            │
└─────────────────────────────────┘
```

---

## ✨ Responsive Behavior

### Desktop (1024px+)
- Full width settings modal
- All 3 sections visible
- Comfortable spacing
- Large input fields

### Tablet (768px - 1023px)
- 90% width modal
- Sections stacked
- Touch-friendly buttons
- Readable labels

### Mobile (320px - 767px)
- Full width minus margins
- Single column layout
- Large tap targets (48px+)
- Stacked sections
- Optimized text size

---

## 🎬 Interaction Examples

### Example 1: Switch to Dark Mode
```
1. User sees "☀️ Light Mode" selected
2. User clicks dropdown menu
3. Options appear: ☀️ Light, 🌙 Dark
4. User selects 🌙 Dark Mode
5. User clicks "Save Settings"
6. App instantly changes to dark theme
7. Message: "Settings updated! ✓"
```

### Example 2: Update Attendance Threshold
```
1. User sees Min Attendance: 75
2. User changes to 80
3. Semester dates auto-fill if empty
4. User clicks "Save Settings"
5. Dashboard warnings update
6. Analytics recalculates
7. Message: "Settings updated! ✓"
```

### Example 3: Add Gemini API Key
```
1. User visits https://aistudio.google.com/app/apikey
2. Creates an API key (copy button)
3. Returns to app, opens Settings
4. Checks "☑ Enable Gemini Predictions"
5. Pastes API key in password field
6. Clicks "Save Settings"
7. System ready for predictions
8. Message: "Settings updated! ✓"
```

---

## 📱 Mobile Settings Screenshot

```
Mobile Vertical Layout
┌──────────────────────────┐
│ ⚙️ Settings             │
├──────────────────────────┤
│ 🎨 APPEARANCE           │
│ Theme:                   │
│ [☀️ Light ▼]            │
│                          │
│ 📋 ATTENDANCE          │
│ Min Attendance:          │
│ [75__________] %        │
│                          │
│ Semester Start:          │
│ [01/15/2024_]           │
│                          │
│ Semester End:            │
│ [06/30/2024_]           │
│                          │
│ 🤖 AI PREDICTIONS      │
│ ☑ Enable Gemini         │
│                          │
│ API Key:                 │
│ [•••••••••••__]         │
│                          │
│ 🔗 Get API Key          │
│                          │
│ [Save]  [Cancel]        │
└──────────────────────────┘
```

---

## 🔐 Data Storage Visualization

```
Browser localStorage
│
├─ attendanceSettings (JSON)
│  ├─ minAttendancePercentage: 75
│  ├─ semesterStartDate: "01/15/2024"
│  ├─ semesterEndDate: "06/30/2024"
│  ├─ theme: "light"
│  ├─ geminiApiKey: "[encrypted in view only]"
│  └─ useGeminiPredictions: false
│
├─ subjects
├─ attendance
├─ timetable
└─ [other app data]

✅ All data stays on user's device
❌ No data sent to external servers
🔒 Secure and private
```

---

**This visual guide helps users understand the settings structure and layout at a glance!**
