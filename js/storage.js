/**
 * Storage Manager - Handles all localStorage operations
 * Manages subjects, timetable, attendance records, and app settings
 */

class StorageManager {
  constructor() {
    this.prefix = 'collegeAttendance_';
    this.initializeDefaultData();
  }

  // Initialize default data structure
  initializeDefaultData() {
    if (!this.getSubjects()) {
      this.setSubjects([]);
    }
    if (!this.getTimetable()) {
      this.setTimetable([]);
    }
    if (!this.getAttendanceRecords()) {
      this.setAttendanceRecords({});
    }
    if (!this.getSettings()) {
      this.setSettings({
        minAttendancePercentage: 75,
        semesterStartDate: new Date().toISOString().split('T')[0],
        semesterEndDate: new Date(new Date().getFullYear(), new Date().getMonth() + 6, 0).toISOString().split('T')[0],
        theme: 'light',
        geminiApiKey: '',
        useGeminiPredictions: false
      });
    }
    if (!this.getPIN()) {
      this.setPIN('6598');
    }
  }

  // Apply theme
  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // Get all subjects
  getSubjects() {
    return JSON.parse(localStorage.getItem(this.prefix + 'subjects') || 'null');
  }

  // Add subject
  addSubject(subject) {
    const subjects = this.getSubjects() || [];
    subject.id = Date.now().toString();
    subject.createdAt = new Date().toISOString();
    subjects.push(subject);
    this.setSubjects(subjects);
    return subject;
  }

  // Update subject
  updateSubject(subjectId, updates) {
    const subjects = this.getSubjects() || [];
    const index = subjects.findIndex(s => s.id === subjectId);
    if (index !== -1) {
      subjects[index] = { ...subjects[index], ...updates };
      this.setSubjects(subjects);
      return subjects[index];
    }
    return null;
  }

  // Delete subject
  deleteSubject(subjectId) {
    let subjects = this.getSubjects() || [];
    subjects = subjects.filter(s => s.id !== subjectId);
    this.setSubjects(subjects);
    // Also delete all attendance records for this subject
    const records = this.getAttendanceRecords() || {};
    Object.keys(records).forEach(date => {
      if (records[date]) {
        delete records[date][subjectId];
      }
    });
    this.setAttendanceRecords(records);
  }

  setSubjects(subjects) {
    localStorage.setItem(this.prefix + 'subjects', JSON.stringify(subjects));
  }

  // Get timetable
  getTimetable() {
    return JSON.parse(localStorage.getItem(this.prefix + 'timetable') || 'null');
  }

  // Add timetable entry
  addTimetableEntry(entry) {
    const timetable = this.getTimetable() || [];
    entry.id = Date.now().toString();
    timetable.push(entry);
    this.setTimetable(timetable);
    return entry;
  }

  // Update timetable entry
  updateTimetableEntry(entryId, updates) {
    let timetable = this.getTimetable() || [];
    const index = timetable.findIndex(e => e.id === entryId);
    if (index !== -1) {
      timetable[index] = { ...timetable[index], ...updates };
      this.setTimetable(timetable);
      return timetable[index];
    }
    return null;
  }

  // Delete timetable entry
  deleteTimetableEntry(entryId) {
    let timetable = this.getTimetable() || [];
    timetable = timetable.filter(e => e.id !== entryId);
    this.setTimetable(timetable);
  }

  setTimetable(timetable) {
    localStorage.setItem(this.prefix + 'timetable', JSON.stringify(timetable));
  }

  // Get timetable for specific day
  getTimetableForDay(dayIndex) {
    const timetable = this.getTimetable() || [];
    return timetable.filter(e => e.dayIndex === dayIndex);
  }

  // Bulk import classes and timetable
  bulkImportClasses(classesData) {
    const subjects = this.getSubjects() || [];
    const timetable = this.getTimetable() || [];
    const subjectMap = new Map();

    // Define colors for different subjects
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    let colorIndex = 0;

    // Add subjects if they don't exist
    classesData.forEach(dayData => {
      dayData.classes.forEach(classItem => {
        const subjectName = classItem.name;
        if (!subjectMap.has(subjectName) && !subjects.find(s => s.name === subjectName)) {
          const newSubject = {
            id: 'subj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: subjectName,
            code: classItem.code || '',
            teacher: classItem.teacher || '',
            color: colors[colorIndex % colors.length]
          };
          subjects.push(newSubject);
          subjectMap.set(subjectName, newSubject.id);
          colorIndex++;
        } else if (subjectMap.has(subjectName)) {
          // Already added in this import
        } else {
          // Find existing subject
          const existing = subjects.find(s => s.name === subjectName);
          subjectMap.set(subjectName, existing.id);
        }
      });
    });

    // Add timetable entries if they don't exist
    classesData.forEach(dayData => {
      dayData.classes.forEach(classItem => {
        const subjectId = subjectMap.get(classItem.name) || subjects.find(s => s.name === classItem.name)?.id;
        // Convert display index (0=Monday) to storage index (1=Monday, 0=Sunday)
        const storageIndex = dayData.day === 6 ? 0 : dayData.day + 1;
        const exists = timetable.some(e => e.dayIndex === storageIndex && e.subjectId === subjectId);
        
        if (!exists && subjectId) {
          timetable.push({
            id: 'time_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            dayIndex: storageIndex,
            subjectId: subjectId,
            period: dayData.classes.indexOf(classItem) + 1
          });
        }
      });
    });

    this.setSubjects(subjects);
    this.setTimetable(timetable);
  }

  // Get attendance records
  getAttendanceRecords() {
    return JSON.parse(localStorage.getItem(this.prefix + 'attendance') || 'null');
  }

  // Mark attendance
  markAttendance(date, subjectId, attended) {
    let records = this.getAttendanceRecords() || {};
    if (!records[date]) {
      records[date] = {};
    }
    records[date][subjectId] = attended;
    this.setAttendanceRecords(records);
  }

  // Get attendance for specific date
  getAttendanceForDate(date) {
    const records = this.getAttendanceRecords() || {};
    return records[date] || {};
  }

  // Get attendance for specific subject
  getAttendanceForSubject(subjectId) {
    const records = this.getAttendanceRecords() || {};
    const attendance = {};
    Object.keys(records).forEach(date => {
      if (records[date][subjectId] !== undefined) {
        attendance[date] = records[date][subjectId];
      }
    });
    return attendance;
  }

  setAttendanceRecords(records) {
    localStorage.setItem(this.prefix + 'attendance', JSON.stringify(records));
  }

  // Get settings
  getSettings() {
    return JSON.parse(localStorage.getItem(this.prefix + 'settings') || 'null');
  }

  // Update settings
  updateSettings(updates) {
    const settings = this.getSettings() || {};
    const updatedSettings = { ...settings, ...updates };
    this.setSettings(updatedSettings);
    return updatedSettings;
  }

  setSettings(settings) {
    localStorage.setItem(this.prefix + 'settings', JSON.stringify(settings));
  }

  // Clear all data
  clearAllData() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
    this.initializeDefaultData();
  }

  // Export data as JSON
  exportData() {
    return {
      subjects: this.getSubjects(),
      timetable: this.getTimetable(),
      attendance: this.getAttendanceRecords(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    };
  }

  // Import data from JSON
  importData(data) {
    if (data.subjects) this.setSubjects(data.subjects);
    if (data.timetable) this.setTimetable(data.timetable);
    if (data.attendance) this.setAttendanceRecords(data.attendance);
    if (data.settings) this.setSettings(data.settings);
  }

  // Get PIN
  getPIN() {
    return localStorage.getItem(this.prefix + 'pin');
  }

  // Set PIN
  setPIN(pin) {
    localStorage.setItem(this.prefix + 'pin', pin);
  }

  // Verify PIN
  verifyPIN(enteredPin) {
    const correctPin = this.getPIN();
    return enteredPin === correctPin;
  }
}
// Create global instance
const storage = new StorageManager();
