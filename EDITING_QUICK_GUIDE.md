# Attendance Entry Editing - Quick Guide

## Feature Overview

The **Edit Day** feature allows you to modify attendance for all classes on a specific date at once.

## Step-by-Step Guide

### Step 1: Open Calendar View
```
📊 Dashboard → 🗓️ Calendar
```
Navigate to the Calendar view to see your monthly attendance tracker.

### Step 2: Find Your Day
Look at the calendar grid. Days with scheduled classes show:
- Colored dots (indicators for your classes)
- An **"✏️ Edit Day"** button at the bottom

### Step 3: Click Edit Day Button
```
┌─────────────────────────┐
│  Day 15 (Friday)        │
│  ● ● ●   (Class dots)  │
│  ✏️ Edit Day            │ ← Click here
└─────────────────────────┘
```

### Step 4: Edit in Modal
The modal opens showing all classes for that day:

```
╔════════════════════════════════════════╗
║ Edit Attendance - Friday, March 15     ║ (Header)
╟────────────────────────────────────────╢
║ 📘 Data Structures                     ║
║ (CS201)                                ║
║             [Attended] [Missed] [Clear]║ (Buttons)
╟────────────────────────────────────────╢
║ 📗 Web Development                     ║
║ (WD101)                                ║
║             [Attended] [Missed] [Clear]║
╟────────────────────────────────────────╢
║ 📙 Database Design                     ║
║ (DB301)                                ║
║             [Attended] [Missed] [Clear]║
╟────────────────────────────────────────╢
║              [Close]                   ║ (Footer)
╚════════════════════════════════════════╝
```

### Step 5: Mark Attendance
Click the appropriate button for each class:

- **Green/Magenta Attended**: Class attended ✔️
- **Red Missed**: Class missed ✖️
- **Gray Clear**: Not marked/Unknown ○

### Step 6: Changes Auto-Save
- No save button needed
- Changes appear immediately
- Calendar updates automatically
- Dashboard stats update

### Step 7: Close Modal
Click the **Close** button or the **X** in the header to exit.

---

## Button States

### Attended (Selected)
```
Green/Magenta Button | Bright Color
```
Shows you marked this class as attended.

### Missed (Selected)
```
Red Button | Bright Color
```
Shows you marked this class as missed.

### Clear (Selected)
```
Outline Button | Bordered
```
Removes the attendance mark (returns to unknown state).

---

## Usage Examples

### Example 1: Correct a Mistake
**Situation**: You marked yourself absent but actually attended.

```
1. Open Calendar
2. Find the day
3. Click "✏️ Edit Day"
4. Click "Attended" for the class
5. Close modal (auto-saved)
```

### Example 2: Update Multiple Classes
**Situation**: You attended three classes yesterday but haven't marked them yet.

```
1. Open Calendar
2. Click "✏️ Edit Day" on yesterday
3. Click "Attended" for each class
4. Close modal (all saved)
```

### Example 3: Clear a Mark
**Situation**: You're not sure if you attended a class.

```
1. Open Calendar
2. Click "✏️ Edit Day"
3. Click "Clear" to remove the mark
4. Close modal
```

---

## Tips & Tricks

✅ **Quick Edits**: Use Edit Day to bulk-update classes instead of clicking each indicator

✅ **Correction**: Easily fix mistakes without losing other data

✅ **Organization**: Edit by date makes it easier to remember which classes you attended

✅ **Dark Mode**: Feature works perfectly in both light and dark themes

✅ **Mobile Friendly**: Full functionality on phones and tablets

---

## Features Explained

| Feature | Description |
|---------|-------------|
| **Edit Day Button** | Opens modal for specific date |
| **Subject Color** | Color indicator matches your calendar |
| **Subject Code** | Shows course code for reference |
| **Auto-Save** | No save button - changes apply immediately |
| **Real-Time Update** | Calendar and stats update as you change attendance |
| **Three States** | Attended / Missed / Not Marked |

---

## Integration with Other Features

- ✅ Works with **Calendar View** (date-based editing)
- ✅ Updates **Dashboard** statistics automatically
- ✅ Affects **Analytics** calculations
- ✅ Impacts **AI Predictions** (class skipping recommendations)
- ✅ Compatible with **E3 Schedule Import**
- ✅ Works with **Light/Dark Theme**

---

## Troubleshooting

**Q: Edit button not showing?**
A: Only days with scheduled classes show the Edit button.

**Q: Changes not saving?**
A: Changes auto-save. Check that you see the attendance update in the modal.

**Q: Need to undo?**
A: Use Edit Day again to correct any mistakes.

**Q: Missing a class option?**
A: Make sure that class is added to your timetable for that day.

---

## Keyboard Shortcuts (Future)

Currently, you must click buttons. Future versions may support:
- `A` for Attended
- `M` for Missed  
- `C` for Clear
- `Esc` to close modal

---

**Last Updated**: 2025
**Status**: ✅ Feature Complete
