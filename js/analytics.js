/**
 * Analytics Engine - Calculate attendance statistics and predictions
 */

class AnalyticsEngine {
  constructor(storageManager) {
    this.storage = storageManager;
  }

  /**
   * Get subject statistics
   */
  getSubjectStats(subjectId, startDate = null, endDate = null) {
    const subject = this.storage.getSubjects().find(s => s.id === subjectId);
    if (!subject) return null;

    const attendance = this.storage.getAttendanceForSubject(subjectId);
    const timetable = this.storage.getTimetable() || [];
    const settings = this.storage.getSettings();

    // Get date range
    const start = startDate ? new Date(startDate) : new Date(settings.semesterStartDate);
    const end = endDate ? new Date(endDate) : new Date();

    let totalClasses = 0;
    let classesAttended = 0;

    // Count classes based on timetable
    const classDates = this.getScheduledClassDates(subjectId, start, end);
    totalClasses = classDates.length;

    // Count attended classes
    classDates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      if (attendance[dateStr] === true) {
        classesAttended++;
      }
    });

    const percentage = totalClasses > 0 ? (classesAttended / totalClasses) * 100 : 0;

    return {
      subjectId,
      subjectName: subject.name,
      subjectCode: subject.code || '',
      teacher: subject.teacher || '',
      totalClasses,
      classesAttended,
      classesMissed: totalClasses - classesAttended,
      attendancePercentage: Math.round(percentage * 100) / 100,
      minRequired: settings.minAttendancePercentage,
      isWarning: percentage < settings.minAttendancePercentage,
      requiredForMaintenance: Math.ceil((settings.minAttendancePercentage / 100) * totalClasses)
    };
  }

  /**
   * Get all subjects statistics
   */
  getAllSubjectsStats(startDate = null, endDate = null) {
    const subjects = this.storage.getSubjects() || [];
    return subjects.map(subject => 
      this.getSubjectStats(subject.id, startDate, endDate)
    );
  }

  /**
   * Get scheduled class dates for a subject
   * Only counts classes that have been explicitly recorded in attendance
   */
  getScheduledClassDates(subjectId, startDate = null, endDate = null) {
    const attendance = this.storage.getAttendanceForSubject(subjectId);
    const timetable = this.storage.getTimetable() || [];
    const settings = this.storage.getSettings();
    const start = startDate ? new Date(startDate) : new Date(settings.semesterStartDate);
    const end = endDate ? new Date(endDate) : new Date();

    const classEntries = timetable.filter(e => e.subjectId === subjectId);
    const classDates = [];

    // Get all dates that have attendance entries for this subject
    const attendanceDates = Object.keys(attendance);

    // Iterate through each day from start to end
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayIndex = d.getDay();
      const hasClass = classEntries.some(e => e.dayIndex === dayIndex);
      
      // Only count if:
      // 1. It has a timetable entry AND
      // 2. It has an attendance record (attended or missed)
      if (hasClass && attendanceDates.includes(dateStr)) {
        classDates.push(new Date(d));
      }
    }

    return classDates;
  }

  /**
   * AI Prediction: Calculate how many days can be dismissed
   * while maintaining minimum attendance percentage
   */
  predictSafeDaysToRemain(subjectId, targetPercentage = null) {
    const stats = this.getSubjectStats(subjectId);
    if (!stats) return null;

    const target = targetPercentage || stats.minRequired;
    const safeDays = {
      subjectId,
      subjectName: stats.subjectName,
      currentStats: {
        totalClasses: stats.totalClasses,
        attended: stats.classesAttended,
        percentage: stats.attendancePercentage
      },
      targetPercentage: (target / stats.totalClasses) * 100,
      currentlyCanMiss: stats.totalClasses - stats.classesAttended - Math.max(0, Math.ceil(target) - stats.classesAttended),
      prediction: null
    };

    // Calculate future classes needed to maintain percentage
    const remainingClasses = this.getUpcomingClassesCount(subjectId);
    
    if (remainingClasses > 0) {
      // Calculate: (attended + x) / (total + remainingClasses) >= target/100
      // Solve for x (additional classes to attend)
      const requiredAttendance = Math.ceil((target / stats.totalClasses) * (stats.totalClasses + remainingClasses));
      const needToAttend = Math.max(0, requiredAttendance - stats.classesAttended);
      const canMiss = Math.max(0, remainingClasses - needToAttend);

      safeDays.prediction = {
        totalFutureClasses: remainingClasses,
        needToAttend: needToAttend,
        canSafelyMiss: canMiss,
        recommendations: this.generateRecommendations(stats, needToAttend, remainingClasses)
      };
    }

    return safeDays;
  }

  /**
   * Get count of upcoming classes for a subject
   */
  getUpcomingClassesCount(subjectId) {
    const timetable = this.storage.getTimetable() || [];
    const classEntries = timetable.filter(e => e.subjectId === subjectId);
    
    if (classEntries.length === 0) return 0;

    const settings = this.storage.getSettings();
    const endDate = new Date(settings.semesterEndDate);
    const today = new Date();

    let count = 0;
    for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayIndex = d.getDay();
      if (classEntries.some(e => e.dayIndex === dayIndex)) {
        count++;
      }
    }

    return count;
  }

  /**
   * Generate AI recommendations
   */
  generateRecommendations(stats, needToAttend, remainingClasses) {
    const recommendations = [];

    if (stats.attendancePercentage < stats.minRequired - 10) {
      recommendations.push({
        level: 'critical',
        message: `⚠️ CRITICAL: Your attendance is ${stats.attendancePercentage}%, you need ${stats.minRequired}%!`,
        action: 'Attend all upcoming classes to recover'
      });
    } else if (stats.attendancePercentage < stats.minRequired) {
      recommendations.push({
        level: 'warning',
        message: `⚠️ WARNING: Attendance is ${stats.attendancePercentage}%, below minimum ${stats.minRequired}%`,
        action: `You need to attend ${needToAttend} out of ${remainingClasses} upcoming classes`
      });
    } else {
      const safeMargin = Math.floor((stats.attendancePercentage - stats.minRequired) * stats.totalClasses / 100);
      recommendations.push({
        level: 'safe',
        message: `✅ Your attendance is ${stats.attendancePercentage}%, you have a safe margin`,
        action: `You can safely miss ${Math.max(0, remainingClasses - needToAttend)} classes`
      });
    }

    return recommendations;
  }

  /**
   * Get month-wise summary
   */
  getMonthlySummary(year, month) {
    const subjects = this.storage.getSubjects() || [];
    const attendance = this.storage.getAttendanceRecords() || {};
    
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    
    const summary = {
      month: new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' }),
      subjects: []
    };

    subjects.forEach(subject => {
      let total = 0;
      let attended = 0;

      Object.keys(attendance).forEach(dateStr => {
        const date = new Date(dateStr);
        if (date >= monthStart && date <= monthEnd) {
          if (attendance[dateStr][subject.id] !== undefined) {
            total++;
            if (attendance[dateStr][subject.id]) attended++;
          }
        }
      });

      if (total > 0) {
        summary.subjects.push({
          subjectId: subject.id,
          subjectName: subject.name,
          totalClasses: total,
          attended: attended,
          percentage: Math.round((attended / total) * 100 * 100) / 100
        });
      }
    });

    return summary;
  }

  /**
   * Get semester-wise summary
   */
  getSemesterSummary() {
    const subjects = this.storage.getSubjects() || [];
    const settings = this.storage.getSettings();
    
    const startDate = new Date(settings.semesterStartDate);
    const endDate = new Date(settings.semesterEndDate);
    
    const summary = {
      semesterStart: startDate.toLocaleDateString(),
      semesterEnd: endDate.toLocaleDateString(),
      subjects: this.getAllSubjectsStats(startDate, endDate),
      overallStats: {
        totalSubjects: subjects.length,
        subjectsWithWarning: 0,
        averageAttendance: 0
      }
    };

    let totalPercentage = 0;
    summary.subjects.forEach(subject => {
      if (subject.isWarning) {
        summary.overallStats.subjectsWithWarning++;
      }
      totalPercentage += subject.attendancePercentage;
    });

    summary.overallStats.averageAttendance = 
      subjects.length > 0 ? Math.round((totalPercentage / subjects.length) * 100) / 100 : 0;

    return summary;
  }
}

const analytics = new AnalyticsEngine(storage);
