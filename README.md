# 📚 College Attendance Manager

A modern, lightweight, and intelligent attendance tracking web application for college students. Built with vanilla HTML, CSS, and JavaScript with no dependencies.

## ✨ Features

### Core Functionality
- **📊 Dashboard**: View all subjects with attendance statistics at a glance
- **📅 Timetable Management**: Add weekly class schedules day-by-day and period-wise
- **🗓️ Calendar View**: Interactive monthly calendar to mark attendance with single clicks
- **📈 Analytics**: Month-wise and semester-wise attendance summaries
- **🤖 AI Predictions**: Get smart recommendations on how many classes you can safely miss

### Smart Features
- **Real-time Updates**: Attendance changes instantly reflect in all views
- **Attendance Warnings**: Automatic alerts when attendance drops below set percentage
- **Editable Timetable**: Update your schedule anytime if classes change
- **Data Export/Import**: Backup your data and restore it anytime
- **Fully Offline**: Works completely offline using browser localStorage

## 🚀 Quick Start

### No Installation Needed!
Simply open `index.html` in your web browser and start tracking attendance.

### Or Deploy on GitHub Pages (Free Hosting)

1. Fork this repository to your GitHub account
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose `main` branch and `/root` folder
5. Click Save
6. Your app will be live at `https://your-username.github.io/repository-name`

## 📱 Interface Guide

### 1. Dashboard (📊)
- View all subjects with key statistics
- See attendance percentage with color coding
- Add new subjects
- Edit or delete subjects
- Quick access to warnings and recommendations

**Subject Card Shows:**
- Subject name and teacher
- Total classes conducted
- Classes attended
- Attendance percentage
- Warning if below minimum threshold
- Action buttons for edit/delete

### 2. Timetable (📅)
- Set up your weekly class schedule
- Organize by day and period
- Add room/location details
- Edit existing entries
- Delete classes when schedule changes

**Per Entry:**
- Select day of week
- Choose subject
- Set period number (1, 2, 3, etc.)
- Add time slot (optional)
- Add room number (optional)

### 3. Calendar (🗓️)
- Monthly view of all classes
- Click colored dots to mark attendance
- Three states: Attended (✔), Missed (✖), Not marked (•)
- Navigate between months
- View all scheduled classes per day

**Color Coding:**
- Bright color = Attended
- Faded color = Missed
- Medium opacity = Not marked

### 4. Analytics (📈)
- Month-wise attendance breakdown
- Total classes per subject per month
- Attendance percentage by month
- Track trends over the semester

### 5. AI Predictions (🤖)
- **Current Status**: Your attendance right now
- **Future Prediction**: Based on remaining classes
- **Smart Recommendations**: 
  - How many classes can you safely miss?
  - How many must you attend to maintain minimum?
  - Critical, warning, or safe status

## 🎯 How to Use

### First Time Setup
1. Open the app and click "Settings"
2. Set minimum attendance percentage (default: 75%)
3. Set semester start and end dates
4. Click "Save Settings"

### Add Subjects
1. Click "+ Add Subject"
2. Enter subject name (required)
3. Add subject code and teacher name (optional)
4. Choose a color for calendar display
5. Click "Save Subject"

### Set Up Timetable
1. Go to "Timetable" section
2. Click "+ Add Class"
3. Select day of week
4. Choose subject
5. Enter period number
6. Add time slot and room (optional)
7. Click "Save Entry"

*Repeat for all classes in your weekly schedule*

### Mark Attendance
1. Go to "Calendar" section
2. Click on colored dots representing classes
3. First click = Mark as attended (✔) - bright color
4. Second click = Mark as missed (✖) - faded color
5. Third click = Clear marking (•) - medium color

### View Analytics
1. Go to "Analytics" section
2. Use Previous/Next buttons to view different months
3. See attendance stats for each subject
4. Track your progress throughout semester

### Get AI Predictions
1. Go to "AI Predictions" section
2. For each subject, see:
   - Current attendance status
   - How many future classes you can skip
   - AI-powered recommendations
3. Plan your classes accordingly

### Export/Import Data
- **Export**: Click "📥 Export Data" - saves as JSON file
- **Import**: Click "📤 Import Data" - upload previously exported file
- Useful for backup or switching devices

## 🏗️ Project Architecture

```
college_attendance/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styles (responsive, modern)
├── js/
│   ├── storage.js         # localStorage management
│   ├── analytics.js       # Attendance calculations & AI
│   └── ui.js              # UI rendering & interactions
└── README.md              # This file
```

## 💾 Data Structure

All data is stored in browser's localStorage with these keys:

```javascript
{
  "collegeAttendance_subjects": [
    {
      "id": "timestamp",
      "name": "Subject Name",
      "code": "CS201",
      "teacher": "Dr. Name",
      "color": "#3498db",
      "createdAt": "ISO-8601-date"
    }
  ],
  
  "collegeAttendance_timetable": [
    {
      "id": "timestamp",
      "dayIndex": 0-6,  // 0=Sunday, 6=Saturday
      "subjectId": "...",
      "period": 1-12,
      "timeSlot": "9:00 AM - 10:30 AM",
      "room": "Room-201"
    }
  ],
  
  "collegeAttendance_attendance": {
    "YYYY-MM-DD": {
      "subjectId": true/false  // true = attended, false = missed
    }
  },
  
  "collegeAttendance_settings": {
    "minAttendancePercentage": 75,
    "semesterStartDate": "YYYY-MM-DD",
    "semesterEndDate": "YYYY-MM-DD"
  }
}
```

## 🧠 AI Prediction Algorithm

The AI system works by:

1. **Analyzing Current Status**: Counts total classes and attended classes
2. **Predicting Future Classes**: Calculates remaining classes based on timetable
3. **Calculating Safe Days**: Uses formula:
   ```
   (attended + x) / (total + remaining) >= minPercentage / 100
   ```
4. **Generating Recommendations**: Based on urgency level:
   - 🟢 **Safe**: You can safely miss classes
   - 🟡 **Warning**: Attend more classes to maintain minimum
   - 🔴 **Critical**: Must attend all remaining classes

## 🎨 Customization

### Change Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
  --primary-color: #3498db;      /* Main blue */
  --secondary-color: #2ecc71;    /* Green */
  --danger-color: #e74c3c;       /* Red */
  --warning-color: #f39c12;      /* Orange */
  /* ... and more */
}
```

### Change Minimum Attendance
Settings button in dashboard → Change percentage → Save

### Add More Features
The app is fully modular. All JS classes are documented and easy to extend.

## 📊 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Privacy & Data

- ✅ All data stored locally in your browser
- ✅ No data sent to any server
- ✅ No tracking or analytics
- ✅ Works completely offline
- ✅ Export data anytime

## 📱 Mobile Optimizations

- Responsive design that adapts to all screen sizes
- Touch-friendly buttons and indicators
- Optimized layouts for small screens
- Fast performance on mobile devices
- Works on tablets and phones

## 🐛 Troubleshooting

### Data Not Saving?
- Check if localStorage is enabled in your browser
- Try clearing cache and reloading
- Check browser developer console for errors

### Data Lost After Closing Browser?
- This shouldn't happen - data is in localStorage
- Check browser settings - some privacy modes clear localStorage
- Try exporting data regularly for backup

### Prediction Not Showing?
- Make sure you have added subjects AND timetable entries
- The app needs both to predict future classes
- Set semester dates in settings

### Calendar Not Showing Classes?
- Ensure timetable entries are added for those days
- Check that you selected the correct subject in timetable

## 🚀 Deployment

### Local Machine
```bash
# Simply open in browser
open index.html
# or
start index.html
```

### GitHub Pages (Recommended - Free & Fast)
1. Push code to GitHub
2. Go to repository Settings → Pages
3. Select main branch → Save
4. Live at: `https://username.github.io/repo-name`

### Other Hosting Options
- Netlify (free static hosting)
- Vercel (free static hosting)
- GitHub Pages (what we recommend)
- Firebase Hosting
- AWS S3

## 📝 Notes

- Each subject should have at least one timetable entry per week for accurate calculations
- Attendance percentage is calculated from scheduled classes only
- Past dates can't be changed unless you manually edit localStorage
- Predictions assume regular class schedule continues

## 🤝 Contributing

Feel free to fork and improve! Some ideas:
- Dark mode
- Multiple semesters
- Detailed analytics charts
- Export to PDF
- GPA integration
- Class notes feature

## 📜 License

MIT License - Free to use and modify

## 📧 Feedback

Found a bug? Have a feature request?
- Create an issue on GitHub
- Suggest improvements
- Share your feedback

---

**Made with ❤️ for college students**

*Happy tracking! 📚✨*
