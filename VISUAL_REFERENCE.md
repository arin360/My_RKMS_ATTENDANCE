# Visual Reference - Edit Day Feature UI

## Calendar View with Edit Day Button

```
╔════════════════════════════════════════════════════════╗
║           MARCH 2025              [◄ Previous] [Next ►]║
╟────────────────────────────────────────────────────────╢
║ Mon | Tue | Wed | Thu | Fri | Sat | Sun              ║
╟────────────────────────────────────────────────────────╢
║                                                        ║
║ 27   28   29    1    2    3    4    5                 ║
║                 🟠                                      ║
║
║ 6    7    8    9    10   11   12   13                 ║
║      🔵  🟢  🟣   🟠   🟡                              ║
║           ✏️ Edit             ✏️ Edit                  ║
║      Day                  Day                          ║
║
║ 14   15   16   17   18   19   20   21                 ║
║      🔵  🟢  🟡   🟠  🟢  🟣                           ║
║           ✏️ Edit             ✏️ Edit                  ║
║      Day                  Day                          ║
║
╚════════════════════════════════════════════════════════╝
```

**Legend**:
- 🟠 🟢 🟣 🟡 🔵 = Class color indicators
- ✏️ Edit Day = Button to edit attendance for that day

---

## Edit Day Modal (Opened)

```
╔════════════════════════════════════════════════════════╗
║ Edit Attendance - Friday, March 14, 2025         ✕   ║
╟────────────────────────────────────────────────────────╢
║                                                        ║
║ 🟠 Data Structures (CS201)                            ║
║            [✔ Attended]  [✖ Missed]  [○ Clear]       ║
║                                                        ║
║ 🟢 Web Development (WD101)                            ║
║            [✔ Attended]  [✖ Missed]  [○ Clear]       ║
║                                                        ║
║ 🟣 Database Design (DB301)                            ║
║            [✔ Attended]  [✖ Missed]  [○ Clear]       ║
║                                                        ║
║ 🟡 Communication Skills                               ║
║            [✔ Attended]  [✖ Missed]  [○ Clear]       ║
║                                                        ║
╟────────────────────────────────────────────────────────╢
║                         [Close]                        ║
╚════════════════════════════════════════════════════════╝
```

---

## Button States

### State 1: Not Marked (Default)

```
┌─────────────────────────────────────┐
│ 🟠 Data Structures (CS201)          │
│        [Attended] [Missed] [Clear]  │
└─────────────────────────────────────┘

All buttons in gray (secondary color)
```

### State 2: Marked as Attended

```
┌─────────────────────────────────────┐
│ 🟠 Data Structures (CS201)          │
│        [✔ Attended] [Missed] [Clear]│
└─────────────────────────────────────┘

Attended button: GREEN/MAGENTA
Missed button: GRAY
Clear button: OUTLINE
```

### State 3: Marked as Missed

```
┌─────────────────────────────────────┐
│ 🟠 Data Structures (CS201)          │
│        [Attended] [✖ Missed] [Clear]│
└─────────────────────────────────────┘

Attended button: GRAY
Missed button: RED
Clear button: OUTLINE
```

### State 4: Cleared/Unknown

```
┌─────────────────────────────────────┐
│ 🟠 Data Structures (CS201)          │
│        [Attended] [Missed] [○ Clear]│
└─────────────────────────────────────┘

Attended button: GRAY
Missed button: GRAY
Clear button: GRAY
```

---

## Color Scheme Applied

### Light Theme

```
Button Colors:
- Attended: Magenta (#da22ff)
- Missed: Red (#ff007f)
- Clear: Purple outline (#7c3aed)
- Secondary: Gray (#95a5a6)

Background:
- Modal: White
- Items: White
- Cards: Lavender (#f0e6ff)

Text:
- Primary: Dark (#1a1a2e)
- Secondary: Light gray (#7f8c8d)
```

### Dark Theme

```
Button Colors:
- Attended: Magenta (#da22ff)
- Missed: Red (#ff007f)
- Clear: Light purple (#b8a7ff)
- Secondary: Dark gray

Background:
- Modal: Dark navy (#0a0e27)
- Items: Dark purple (#1a1a3e)
- Cards: Dark purple (#1a1a3e)

Text:
- Primary: Light lavender (#e0e0ff)
- Secondary: Light gray (#b8a7ff)
- Accents: Gold (#ffd700)
```

---

## Mobile Layout (320px width)

```
╔════════════════════════════════════╗
║ Edit Attendance - Friday,          ║
║ March 14, 2025              ✕      ║
╟────────────────────────────────────╢
║                                    ║
║ 🟠 Data Structures                 ║
║ CS201                              ║
║ [Attended]                         ║
║ [Missed]                           ║
║ [Clear]                            ║
║                                    ║
║ 🟢 Web Development                 ║
║ WD101                              ║
║ [Attended]                         ║
║ [Missed]                           ║
║ [Clear]                            ║
║                                    ║
╟────────────────────────────────────╢
║      [Close]                       ║
╚════════════════════════════════════╝
```

**Mobile Changes**:
- Buttons stack vertically
- Full width buttons
- Buttons flush left
- Text remains readable
- No horizontal scroll

---

## Workflow Diagram

```
User Views Calendar
        ↓
Finds Day with Classes
        ↓
Clicks "✏️ Edit Day" Button
        ↓
Modal Opens with Classes
        ↓
Selects Attendance for Each Class
    /           |         \
Attended    Missed      Clear
    |           |         |
    ✔️          ✖️         ○
    |           |         |
    └─────┬─────┴─────┬──┘
          ↓
      Auto-Save
          ↓
    Calendar Updates
          ↓
   Dashboard Updates
          ↓
    Close Modal
          ↓
    Changes Persisted
```

---

## Feature Integration Map

```
┌──────────────────────────┐
│     EDIT DAY FEATURE     │
└────────┬─────────────────┘
         │
    ┌────┴────────────────────────────┐
    │                                  │
    ↓                                  ↓
┌─────────────┐            ┌──────────────────┐
│   CALENDAR  │            │  STORAGE SYSTEM  │
│             │            │                  │
│ - Displays  │            │ - Save data      │
│   classes   │            │ - Load data      │
│ - Shows     │            │ - Manage dates   │
│   Edit Day  │            │                  │
│   button    │            │  markAttendance()│
└────┬────────┘            └────────┬─────────┘
     │                              │
     └──────────────────┬───────────┘
                        ↓
           ┌────────────────────────┐
           │   ATTENDANCE DATA      │
           │                        │
           │ {"2025-03-14": {       │
           │   "subject-1": true    │
           │   "subject-2": false   │
           │   "subject-3": null    │
           │ }}                     │
           └────────────────────────┘
                        │
          ┌─────────────┼──────────────┐
          ↓             ↓              ↓
      ┌────────┐  ┌─────────┐  ┌────────────┐
      │DASHBOARD│ │ANALYTICS│  │PREDICTIONS │
      │         │ │         │  │            │
      │ Updates │ │Refreshes│  │ Recalcs    │
      │ stats   │ │ counts  │  │ skips OK   │
      └────────┘  └─────────┘  └────────────┘
```

---

## Data Flow Diagram

```
User Clicks Button
        ↓
openEditDayModal(dateStr)
        ├─ Get classes for date
        ├─ Get attendance for date
        ├─ Format date string
        ├─ Render class list
        └─ Show modal
        ↓
User Clicks Attendance Button
        ↓
setDayAttendance(dateStr, subjectId, status)
        ├─ Call storage.markAttendance()
        ├─ OR delete attendance record
        ├─ Refresh modal display
        ├─ renderCalendar()
        └─ renderDashboard()
        ↓
Data Saved to localStorage
        ↓
UI Updated Immediately
        ↓
User Closes Modal
        ↓
Changes Persist Forever
```

---

## UI Element Breakdown

### Modal Header
```
┌──────────────────────────────────┐
│ Edit Attendance - Friday, Mar 14 │ X
└──────────────────────────────────┘
   └─ Dynamic date based on selected day
   └─ X button closes modal
```

### Class Item Structure
```
┌──────────────────────────────────────────┐
│ 🔶 Data Structures           │ [▼] [✖] [•]│
│    CS201                     │           │
└──────────────────────────────────────────┘
  └─ Color box (16x16px)
  └─ Subject name
  └─ Subject code (if available)
  └─ Button group (responsive)
```

### Button Layout (Desktop)
```
Inline: [Attended] [Missed] [Clear]
- 0.5rem gap between
- Flex wrap enabled
- Justify-end (right aligned)
```

### Button Layout (Mobile)
```
Stacked:
[Attended]
[Missed]
[Clear]
- Full width
- Justify-start (left aligned)
```

---

## Color Palette Reference

### Primary Colors
```
🟣 Purple     #7c3aed  (Primary)
🌸 Magenta    #da22ff  (Secondary, Success)
🔴 Red        #ff007f  (Danger)
⭐ Gold       #ffd700  (Warning, Accents)
⚫ Dark Navy  #0a0e27  (Background)
```

### Secondary Colors
```
🟦 Light      #f0e6ff  (Light cards)
🟪 Dark       #1a1a3e  (Dark mode cards)
🟩 Border     #5a2d82  (Dark borders)
🟧 Border     #a855f7  (Light borders)
```

### Text Colors
```
Light Mode:
- Primary:    #1a1a2e  (Dark text)
- Secondary:  #7f8c8d  (Gray text)

Dark Mode:
- Primary:    #e0e0ff  (Light lavender)
- Secondary:  #b8a7ff  (Light purple)
- Accents:    #ffd700  (Gold)
```

---

## Responsive Breakpoints

### Desktop (1024px+)
```
┌────────────────────────────────────┐
│ Class Name (Code) │ [Btn] [Btn] [Btn]│
└────────────────────────────────────┘
Buttons: Inline, right-aligned
Gap: 1rem between elements
```

### Tablet (768px - 1023px)
```
┌──────────────────────────────────┐
│ Class Name (Code)                │
│ [Btn] [Btn] [Btn]               │
└──────────────────────────────────┘
Buttons: Inline, adjusting
Gap: Responsive
```

### Mobile (320px - 767px)
```
┌──────────────┐
│Class Name    │
│(Code)        │
│[Full Button] │
│[Full Button] │
│[Full Button] │
└──────────────┘
Buttons: Stacked, full width
```

---

## State Transition Diagram

```
┌───────────────────────────────────┐
│  NOT MARKED (default state)       │
│  Buttons all GRAY                 │
└───────────┬───────────────────────┘
            │
    ┌───────┴────────────────┐
    │                        │
    ↓ Click Attended        ↓ Click Missed
    │                        │
┌──────────────────┐    ┌──────────────────┐
│ATTENDED ✔        │    │ MISSED ✖          │
│Attended: GREEN   │    │ Missed: RED       │
│Clear: OUTLINE    │    │ Clear: OUTLINE    │
└────────┬─────────┘    └────────┬─────────┘
         │                       │
         │ Click Clear          │ Click Clear
         │                      │
         └──────────┬───────────┘
                    ↓
           ┌─────────────────┐
           │ NOT MARKED      │
           │ All buttons GRAY│
           └─────────────────┘
```

---

## Performance Timeline

```
User clicks "Edit Day"
        │
        ├─ 0ms     : Event fired
        ├─ 5ms     : Modal created (if first time)
        ├─ 20ms    : Data fetched from storage
        ├─ 40ms    : Classes rendered
        ├─ 50ms    : Modal displayed
        │
        └─> Modal visible to user
        
User clicks "Attended"
        │
        ├─ 0ms     : Button clicked
        ├─ 5ms     : Data updated
        ├─ 10ms    : Storage saved
        ├─ 50ms    : Modal refreshed
        ├─ 100ms   : Calendar re-rendered
        ├─ 150ms   : Dashboard updated
        │
        └─> Changes visible to user
        
User closes modal
        │
        ├─ 0ms     : Close clicked
        ├─ 20ms    : Modal hidden
        │
        └─> Modal closed, data saved
```

---

## Error Handling States

### State: No Classes Scheduled

```
╔════════════════════════════════════╗
║ Edit Attendance - Friday, Mar 14   ║
╟────────────────────────────────────╢
║                                    ║
║  No classes scheduled for this day ║
║                                    ║
╟────────────────────────────────────╢
║              [Close]               ║
╚════════════════════════════════════╝
```

### State: Data Loaded

```
┌─────────────────────────────────┐
│ ✓ Data from storage loaded      │
│ ✓ Classes retrieved             │
│ ✓ Attendance status ready       │
│ ✓ Modal populated               │
└─────────────────────────────────┘
```

---

**Last Updated**: 2025
**Status**: Visual Reference Complete
