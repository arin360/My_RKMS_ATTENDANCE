/**
 * UI Manager - Handles all DOM manipulations and interactions
 */

class UIManager {
  constructor() {
    this.currentView = 'dashboard';
    this.currentMonth = new Date();
    this.pinEntered = false;
    this.currentPinInput = '';
    
    // Initialize theme
    const settings = storage.getSettings();
    if (settings.theme) {
      storage.applyTheme(settings.theme);
    }
    
    this.initializePINProtection();
    this.initializeEventListeners();
  }

  // Initialize PIN protection
  initializePINProtection() {
    const pinScreen = document.getElementById('pinProtectionScreen');
    const pinButtons = document.querySelectorAll('.pin-btn');
    const pinDelete = document.getElementById('pinDelete');
    const pinDisplay = document.getElementById('pinDisplay');

    pinButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const digit = btn.dataset.pin;
        if (digit !== undefined) {
          if (this.currentPinInput.length < 4) {
            this.currentPinInput += digit;
            this.updatePINDisplay();
            
            if (this.currentPinInput.length === 4) {
              setTimeout(() => {
                if (storage.verifyPIN(this.currentPinInput)) {
                  this.pinEntered = true;
                  pinScreen.style.display = 'none';
                  document.getElementById('mainHeader').style.display = 'block';
                  document.getElementById('mainContainer').style.display = 'block';
                  this.renderDashboard();
                } else {
                  document.getElementById('pinError').style.display = 'block';
                  this.currentPinInput = '';
                  this.updatePINDisplay();
                  setTimeout(() => {
                    document.getElementById('pinError').style.display = 'none';
                  }, 2000);
                }
              }, 300);
            }
          }
        }
      });
    });

    pinDelete.addEventListener('click', () => {
      this.currentPinInput = this.currentPinInput.slice(0, -1);
      this.updatePINDisplay();
    });
  }

  // Update PIN display (show dots for entered digits)
  updatePINDisplay() {
    const pinDisplay = document.getElementById('pinDisplay');
    const spans = pinDisplay.querySelectorAll('span');
    spans.forEach((span, index) => {
      if (index < this.currentPinInput.length) {
        span.textContent = '●';
      } else {
        span.textContent = '';
      }
    });
  }

  // Initialize all event listeners
  initializeEventListeners() {
    // Navigation
    document.querySelectorAll('[data-nav]').forEach(link => {
      link.addEventListener('click', (e) => this.switchView(e));
    });

    // Dashboard
    document.getElementById('addSubjectBtn')?.addEventListener('click', () => this.openAddSubjectModal());
    document.getElementById('settingsBtn')?.addEventListener('click', () => this.openSettingsModal());

    // Timetable
    document.getElementById('addTimetableBtn')?.addEventListener('click', () => this.openAddTimetableModal());
    document.getElementById('importTimetableBtn')?.addEventListener('click', () => this.importE3Schedule());

    // Calendar
    document.getElementById('prevMonthBtn')?.addEventListener('click', () => this.previousMonth());
    document.getElementById('nextMonthBtn')?.addEventListener('click', () => this.nextMonth());
    document.getElementById('resetCalendarBtn')?.addEventListener('click', () => this.resetAllCalendarEntries());

    // Analytics
    document.getElementById('exportDataBtn')?.addEventListener('click', () => this.exportData());
    document.getElementById('importDataBtn')?.addEventListener('click', () => this.importData());

    // Modals
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => this.closeModal(e));
    });
  }

  // Switch between views
  switchView(e) {
    e.preventDefault();
    const view = e.target.dataset.nav;
    this.currentView = view;

    // Update active navigation
    document.querySelectorAll('[data-nav]').forEach(link => {
      link.classList.remove('active');
    });
    e.target.classList.add('active');

    // Hide all views
    document.querySelectorAll('[data-view]').forEach(section => {
      section.style.display = 'none';
    });

    // Show selected view
    const viewElement = document.querySelector(`[data-view="${view}"]`);
    if (viewElement) {
      viewElement.style.display = 'block';
      
      // Load view-specific content
      if (view === 'dashboard') {
        this.renderDashboard();
      } else if (view === 'calendar') {
        this.renderCalendar();
      } else if (view === 'timetable') {
        this.renderTimetable();
      } else if (view === 'analytics') {
        this.renderAnalytics();
      } else if (view === 'predictions') {
        this.renderPredictions();
      }
    }
  }

  // ============ DASHBOARD ============
  renderDashboard() {
    const stats = analytics.getAllSubjectsStats();
    const container = document.getElementById('dashboardContent');
    
    if (!container) return;

    if (stats.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>📚 No Subjects Added</h3>
          <p>Start by adding your subjects and setting up your weekly timetable.</p>
          <button class="btn btn-primary" onclick="ui.openAddSubjectModal()">Add Your First Subject</button>
        </div>
      `;
      return;
    }

    let html = '<div class="subjects-grid">';
    
    stats.forEach(stat => {
      const statusColor = stat.isWarning ? '#ff6b6b' : '#51cf66';
      const statusIcon = stat.isWarning ? '⚠️' : '✅';
      
      html += `
        <div class="subject-card ${stat.isWarning ? 'warning' : ''}">
          <div class="card-header">
            <h3>${stat.subjectName}</h3>
            <span class="status-icon" style="color: ${statusColor}">${statusIcon}</span>
          </div>
          <div class="card-meta">
            <p><strong>Code:</strong> ${stat.subjectCode || 'N/A'}</p>
            <p><strong>Teacher:</strong> ${stat.teacher || 'N/A'}</p>
          </div>
          <div class="card-stats">
            <div class="stat-item">
              <span class="label">Total Classes</span>
              <span class="value">${stat.totalClasses}</span>
            </div>
            <div class="stat-item">
              <span class="label">Attended</span>
              <span class="value">${stat.classesAttended}</span>
            </div>
            <div class="stat-item">
              <span class="label">Missed</span>
              <span class="value">${stat.classesMissed}</span>
            </div>
          </div>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${stat.attendancePercentage}%"></div>
            </div>
            <p class="percentage ${stat.isWarning ? 'warning' : 'success'}">
              ${stat.attendancePercentage}% (Min: ${stat.minRequired}%)
            </p>
          </div>
          ${stat.isWarning ? `
            <div class="warning-message">
              ⚠️ Need ${stat.requiredForMaintenance - stat.classesAttended} more classes to reach ${stat.minRequired}%
            </div>
          ` : ''}
          <div class="card-actions">
            <button class="btn btn-sm btn-secondary" onclick="ui.editSubject('${stat.subjectId}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="ui.deleteSubject('${stat.subjectId}')">Delete</button>
          </div>
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;
  }

  // Open add subject modal
  openAddSubjectModal() {
    const modal = document.getElementById('addSubjectModal');
    if (!modal) {
      this.createAddSubjectModal();
      return;
    }

    document.getElementById('subjectForm').reset();
    document.getElementById('subjectForm').dataset.mode = 'add';
    document.getElementById('subjectForm').dataset.subjectId = '';
    modal.style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Add New Subject';
  }

  // Create add subject modal
  createAddSubjectModal() {
    const modal = document.createElement('div');
    modal.id = 'addSubjectModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="modalTitle">Add New Subject</h2>
          <button class="close-btn" data-close-modal>&times;</button>
        </div>
        <form id="subjectForm" onsubmit="ui.handleSubjectSubmit(event)">
          <div class="form-group">
            <label for="subjectName">Subject Name *</label>
            <input type="text" id="subjectName" name="name" required placeholder="e.g., Data Structures">
          </div>
          <div class="form-group">
            <label for="subjectCode">Subject Code</label>
            <input type="text" id="subjectCode" name="code" placeholder="e.g., CS201">
          </div>
          <div class="form-group">
            <label for="subjectTeacher">Teacher Name</label>
            <input type="text" id="subjectTeacher" name="teacher" placeholder="e.g., Dr. John Doe">
          </div>
          <div class="form-group">
            <label for="subjectColor">Color (for calendar)</label>
            <input type="color" id="subjectColor" name="color" value="#3498db">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-close-modal>Cancel</button>
            <button type="submit" class="btn btn-primary">Save Subject</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('[data-close-modal]').addEventListener('click', () => this.closeModal());
  }

  // Handle subject form submission
  handleSubjectSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const mode = form.dataset.mode || 'add';
    
    const formData = {
      name: document.getElementById('subjectName').value,
      code: document.getElementById('subjectCode').value,
      teacher: document.getElementById('subjectTeacher').value,
      color: document.getElementById('subjectColor').value
    };

    if (mode === 'add') {
      storage.addSubject(formData);
    } else {
      const subjectId = form.dataset.subjectId;
      storage.updateSubject(subjectId, formData);
    }

    this.closeModal();
    this.renderDashboard();
    this.showNotification('Subject saved successfully!');
  }

  // Edit subject
  editSubject(subjectId) {
    const subjects = storage.getSubjects();
    const subject = subjects.find(s => s.id === subjectId);
    
    if (!subject) return;

    document.getElementById('subjectName').value = subject.name;
    document.getElementById('subjectCode').value = subject.code || '';
    document.getElementById('subjectTeacher').value = subject.teacher || '';
    document.getElementById('subjectColor').value = subject.color || '#3498db';

    const form = document.getElementById('subjectForm');
    form.dataset.mode = 'edit';
    form.dataset.subjectId = subjectId;

    document.getElementById('modalTitle').textContent = 'Edit Subject';
    document.getElementById('addSubjectModal').style.display = 'block';
  }

  // Delete subject
  deleteSubject(subjectId) {
    if (confirm('Are you sure you want to delete this subject and all its attendance records?')) {
      storage.deleteSubject(subjectId);
      this.renderDashboard();
      this.showNotification('Subject deleted!');
    }
  }

  // Open settings modal
  openSettingsModal() {
    const settings = storage.getSettings();
    const modal = document.getElementById('settingsModal');
    
    if (!modal) {
      this.createSettingsModal();
      return;
    }

    document.getElementById('minAttendance').value = settings.minAttendancePercentage;
    document.getElementById('semesterStart').value = settings.semesterStartDate;
    document.getElementById('semesterEnd').value = settings.semesterEndDate;
    document.getElementById('themeSelect').value = settings.theme || 'light';
    document.getElementById('geminiApiKey').value = settings.geminiApiKey || '';
    document.getElementById('useGeminiPredictions').checked = settings.useGeminiPredictions || false;

    modal.style.display = 'block';
  }

  // Create settings modal
  createSettingsModal() {
    const modal = document.createElement('div');
    modal.id = 'settingsModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Settings</h2>
          <button class="close-btn" data-close-modal>&times;</button>
        </div>
        <form id="settingsForm" onsubmit="ui.handleSettingsSubmit(event)">
          
          <!-- Appearance Settings -->
          <div class="settings-section">
            <h3>🎨 Appearance</h3>
            <div class="form-group">
              <label for="themeSelect">Theme</label>
              <select id="themeSelect" name="theme" required>
                <option value="light">☀️ Light Mode</option>
                <option value="dark">🌙 Dark Mode</option>
              </select>
            </div>
          </div>

          <!-- Security Settings -->
          <div class="settings-section">
            <h3>🔐 Security</h3>
            <div class="form-group">
              <label>Current PIN Protection</label>
              <button type="button" class="btn btn-secondary" id="changePinBtn" onclick="ui.openChangePINModal()">Change PIN</button>
              <small>Your attendance data is protected with a 4-digit PIN</small>
            </div>
          </div>

          <!-- Attendance Settings -->
          <div class="settings-section">
            <h3>📊 Attendance Settings</h3>
            <div class="form-group">
              <label for="minAttendance">Minimum Attendance Percentage *</label>
              <input type="number" id="minAttendance" name="minAttendancePercentage" min="0" max="100" required>
              <small>Set the minimum attendance threshold (e.g., 75%)</small>
            </div>
            <div class="form-group">
              <label for="semesterStart">Semester Start Date *</label>
              <input type="date" id="semesterStart" name="semesterStartDate" required>
            </div>
            <div class="form-group">
              <label for="semesterEnd">Semester End Date *</label>
              <input type="date" id="semesterEnd" name="semesterEndDate" required>
            </div>
          </div>

          <!-- AI Settings -->
          <div class="settings-section">
            <h3>🤖 AI Predictions (Advanced)</h3>
            <div class="form-group">
              <label>
                <input type="checkbox" id="useGeminiPredictions" name="useGeminiPredictions">
                Enable Google Gemini AI for Enhanced Predictions
              </label>
              <small>Uses AI to predict optimal class attendance dates</small>
            </div>
            <div class="form-group">
              <label for="geminiApiKey">Google Gemini API Key</label>
              <input type="password" id="geminiApiKey" name="geminiApiKey" placeholder="Enter your Gemini API key (optional)">
              <small>Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a></small>
            </div>
            <div class="ai-info">
              <p><strong>💡 Note:</strong> Gemini AI provides advanced analysis of your attendance patterns and predicts the best dates to attend classes for optimal results.</p>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-close-modal>Cancel</button>
            <button type="submit" class="btn btn-primary">Save Settings</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('[data-close-modal]').addEventListener('click', () => this.closeModal());
  }

  // Handle settings submission
  handleSettingsSubmit(event) {
    event.preventDefault();
    const settings = {
      minAttendancePercentage: parseInt(document.getElementById('minAttendance').value),
      semesterStartDate: document.getElementById('semesterStart').value,
      semesterEndDate: document.getElementById('semesterEnd').value,
      theme: document.getElementById('themeSelect').value,
      geminiApiKey: document.getElementById('geminiApiKey').value,
      useGeminiPredictions: document.getElementById('useGeminiPredictions').checked
    };

    storage.updateSettings(settings);
    storage.applyTheme(settings.theme);
    this.closeModal();
    this.renderDashboard();
    this.showNotification('Settings updated!');
  }

  // Open change PIN modal
  openChangePINModal() {
    const modal = document.createElement('div');
    modal.id = 'changePinModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 400px;">
        <div class="modal-header">
          <h2>Change PIN</h2>
          <button class="close-btn" data-close-modal>&times;</button>
        </div>
        <div style="padding: 1.5rem;">
          <div class="form-group">
            <label for="currentPin">Current PIN</label>
            <input type="password" id="currentPin" placeholder="Enter current PIN" maxlength="4" inputmode="numeric">
          </div>
          <div class="form-group">
            <label for="newPin">New PIN (4 digits)</label>
            <input type="password" id="newPin" placeholder="Enter new PIN" maxlength="4" inputmode="numeric">
          </div>
          <div class="form-group">
            <label for="confirmPin">Confirm PIN</label>
            <input type="password" id="confirmPin" placeholder="Confirm new PIN" maxlength="4" inputmode="numeric">
          </div>
          <div id="pinChangeError" style="color: #e74c3c; display: none; margin: 1rem 0;"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-close-modal>Cancel</button>
            <button type="button" class="btn btn-primary" id="changePinSubmitBtn">Change PIN</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('[data-close-modal]').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('#changePinSubmitBtn').addEventListener('click', () => {
      const currentPin = modal.querySelector('#currentPin').value;
      const newPin = modal.querySelector('#newPin').value;
      const confirmPin = modal.querySelector('#confirmPin').value;
      const errorDiv = modal.querySelector('#pinChangeError');

      if (!currentPin || !newPin || !confirmPin) {
        errorDiv.textContent = 'All fields are required';
        errorDiv.style.display = 'block';
        return;
      }

      if (currentPin.length !== 4 || newPin.length !== 4) {
        errorDiv.textContent = 'PIN must be 4 digits';
        errorDiv.style.display = 'block';
        return;
      }

      if (!storage.verifyPIN(currentPin)) {
        errorDiv.textContent = 'Current PIN is incorrect';
        errorDiv.style.display = 'block';
        return;
      }

      if (newPin !== confirmPin) {
        errorDiv.textContent = 'New PIN and confirmation do not match';
        errorDiv.style.display = 'block';
        return;
      }

      if (newPin === currentPin) {
        errorDiv.textContent = 'New PIN must be different from current PIN';
        errorDiv.style.display = 'block';
        return;
      }

      storage.setPIN(newPin);
      this.showNotification('PIN changed successfully!');
      modal.remove();
    });

    modal.style.display = 'block';
  }

  // ============ TIMETABLE ============
  renderTimetable() {
    const container = document.getElementById('timetableContent');
    if (!container) return;

    const timetable = storage.getTimetable() || [];
    const subjects = storage.getSubjects() || [];
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Group timetable by day (Monday to Saturday only)
    const timetableByDay = {};
    for (let i = 0; i < 6; i++) {
      // Map display index to storage index (0=Monday in display, 1=Monday in storage, ..., 5=Saturday)
      const storageIndex = i + 1;
      timetableByDay[i] = timetable.filter(e => e.dayIndex === storageIndex);
    }

    let html = '<div class="timetable-container">';

    daysOfWeek.forEach((day, displayIndex) => {
      const dayClasses = timetableByDay[displayIndex];
      
      html += `
        <div class="day-schedule">
          <h3>${day}</h3>
          ${dayClasses.length > 0 ? `
            <div class="classes-list">
              ${dayClasses.map(entry => {
                const subject = subjects.find(s => s.id === entry.subjectId);
                return `
                  <div class="class-item" style="border-left: 4px solid ${subject?.color || '#3498db'}">
                    <div class="class-info">
                      <strong>${subject?.name || 'Unknown Subject'}</strong>
                      <span class="period">Period ${entry.period}</span>
                      <span class="time">${entry.timeSlot || 'N/A'}</span>
                      <p class="room">${entry.room || 'N/A'}</p>
                    </div>
                    <div class="class-actions">
                      <button class="btn btn-sm btn-secondary" onclick="ui.editTimetableEntry('${entry.id}')">Edit</button>
                      <button class="btn btn-sm btn-danger" onclick="ui.deleteTimetableEntry('${entry.id}')">Delete</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `<p class="empty-day">No classes scheduled</p>`}
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;
  }

  // Open add timetable modal
  openAddTimetableModal() {
    const modal = document.getElementById('addTimetableModal');
    if (!modal) {
      this.createAddTimetableModal();
      return;
    }

    document.getElementById('timetableForm').reset();
    document.getElementById('timetableForm').dataset.mode = 'add';
    document.getElementById('timetableForm').dataset.entryId = '';
    modal.style.display = 'block';
    document.getElementById('timetableModalTitle').textContent = 'Add Timetable Entry';
  }

  // Create add timetable modal
  createAddTimetableModal() {
    const subjects = storage.getSubjects() || [];
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const modal = document.createElement('div');
    modal.id = 'addTimetableModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="timetableModalTitle">Add Timetable Entry</h2>
          <button class="close-btn" data-close-modal>&times;</button>
        </div>
        <form id="timetableForm" onsubmit="ui.handleTimetableSubmit(event)">
          <div class="form-group">
            <label for="timetableDay">Day of Week *</label>
            <select id="timetableDay" name="dayIndex" required>
              <option value="">Select Day</option>
              ${daysOfWeek.map((day, index) => `<option value="${index}">${day}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="timetableSubject">Subject *</label>
            <select id="timetableSubject" name="subjectId" required>
              <option value="">Select Subject</option>
              ${subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="timetablePeriod">Period *</label>
            <input type="number" id="timetablePeriod" name="period" min="1" max="12" required placeholder="e.g., 1, 2, 3...">
          </div>
          <div class="form-group">
            <label for="timetableTime">Time Slot</label>
            <input type="text" id="timetableTime" name="timeSlot" placeholder="e.g., 9:00 AM - 10:30 AM">
          </div>
          <div class="form-group">
            <label for="timetableRoom">Room/Building</label>
            <input type="text" id="timetableRoom" name="room" placeholder="e.g., Lab-201, Room A-5">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-close-modal>Cancel</button>
            <button type="submit" class="btn btn-primary">Save Entry</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('[data-close-modal]').addEventListener('click', () => this.closeModal());
  }

  // Handle timetable form submission
  handleTimetableSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const mode = form.dataset.mode || 'add';
    
    const displayDayIndex = parseInt(document.getElementById('timetableDay').value);
    // Convert display index to storage index (0=Monday display -> 1=Monday storage, 5=Saturday display -> 6=Saturday storage)
    const storageIndex = displayDayIndex + 1;
    
    const formData = {
      dayIndex: storageIndex,
      subjectId: document.getElementById('timetableSubject').value,
      period: parseInt(document.getElementById('timetablePeriod').value),
      timeSlot: document.getElementById('timetableTime').value,
      room: document.getElementById('timetableRoom').value
    };

    if (mode === 'add') {
      storage.addTimetableEntry(formData);
    } else {
      const entryId = form.dataset.entryId;
      storage.updateTimetableEntry(entryId, formData);
    }

    this.closeModal();
    this.renderTimetable();
    this.showNotification('Timetable entry saved!');
  }

  // Edit timetable entry
  editTimetableEntry(entryId) {
    const timetable = storage.getTimetable() || [];
    const entry = timetable.find(e => e.id === entryId);
    
    if (!entry) return;

    // Convert storage day index to display index (1=Monday storage -> 0=Monday display, 6=Saturday storage -> 5=Saturday display)
    const displayDayIndex = entry.dayIndex - 1;
    
    document.getElementById('timetableDay').value = displayDayIndex;
    document.getElementById('timetableSubject').value = entry.subjectId;
    document.getElementById('timetablePeriod').value = entry.period;
    document.getElementById('timetableTime').value = entry.timeSlot || '';
    document.getElementById('timetableRoom').value = entry.room || '';

    const form = document.getElementById('timetableForm');
    form.dataset.mode = 'edit';
    form.dataset.entryId = entryId;

    document.getElementById('timetableModalTitle').textContent = 'Edit Timetable Entry';
    document.getElementById('addTimetableModal').style.display = 'block';
  }

  // Delete timetable entry
  deleteTimetableEntry(entryId) {
    if (confirm('Are you sure you want to delete this timetable entry?')) {
      storage.deleteTimetableEntry(entryId);
      this.renderTimetable();
      this.showNotification('Entry deleted!');
    }
  }

  // Import E3 schedule (clear old classes and import fresh)
  importE3Schedule() {
    const confirmed = confirm('⚠️  RESET SCHEDULE\n\nThis will:\n✓ Delete ALL existing classes\n✓ Delete ALL timetable entries\n✓ Keep your attendance records\n\nDo you want to continue?');
    
    if (!confirmed) {
      return;
    }

    try {
      // Clear old data
      storage.setSubjects([]);
      storage.setTimetable([]);

      const classesData = [
        {
          day: 0, // Monday
          classes: [
            { name: 'Entrepreneurship & Start-up', code: 'E3-01', teacher: 'SS' },
            { name: 'Industrial Instrumentation & Control', code: 'E3-02', teacher: 'SRC' },
            { name: 'Equipment & Condition Monitoring', code: 'E3-03', teacher: 'SGN MJ' },
            { name: 'Engineering Economics', code: 'E3-04', teacher: 'SNB' }
          ]
        },
        {
          day: 1, // Tuesday
          classes: [
            { name: 'Mechatronics', code: 'E3-05', teacher: 'SJD' },
            { name: 'Industrial Instrumentation & Control', code: 'E3-02', teacher: 'SGN MJ' },
            { name: 'Equipment & Condition Monitoring', code: 'E3-03', teacher: 'SGN MJ' },
            { name: 'FCA', code: 'E3-06', teacher: 'SRC' },
            { name: 'Energy Utilization & Conservation (Lab)', code: 'E3-07', teacher: '' }
          ]
        },
        {
          day: 2, // Wednesday
          classes: [
            { name: 'Engineering Economics', code: 'E3-04', teacher: 'SNB' },
            { name: 'Mechatronics', code: 'E3-05', teacher: 'SJD' },
            { name: 'ECA', code: 'E3-08', teacher: 'SRC' },
            { name: 'AC Machines', code: 'E3-09', teacher: 'SJD' },
            { name: 'Project Management', code: 'E3-10', teacher: 'SMD' }
          ]
        },
        {
          day: 3, // Thursday
          classes: [
            { name: 'ECA', code: 'E3-08', teacher: 'SBM' },
            { name: 'Industrial Instrumentation & Control', code: 'E3-02', teacher: 'SS' },
            { name: 'Mechatronics', code: 'E3-05', teacher: 'SJD' },
            { name: 'Project Management', code: 'E3-10', teacher: 'SHB' }
          ]
        },
        {
          day: 4, // Friday
          classes: [
            { name: 'ECA', code: 'E3-08', teacher: 'SBM' },
            { name: 'Industrial Instrumentation & Control', code: 'E3-02', teacher: 'SS' },
            { name: 'Mechatronics', code: 'E3-05', teacher: 'SJD' },
            { name: 'Entrepreneurship & Start-up', code: 'E3-01', teacher: 'SS' }
          ]
        },
        {
          day: 5, // Saturday
          classes: [
            { name: 'Environmental Science & Engineering', code: 'E3-11', teacher: 'SBM' },
            { name: 'EE Project', code: 'E3-12', teacher: '' }
          ]
        }
      ];

      // Import classes
      storage.bulkImportClasses(classesData);
      
      // Refresh views
      this.renderTimetable();
      this.renderDashboard();
      
      const totalClasses = classesData.reduce((sum, day) => sum + day.classes.length, 0);
      this.showNotification(`✓ E3 Schedule Loaded!\n${totalClasses} classes imported`);
    } catch (error) {
      console.error('Import error:', error);
      this.showNotification('❌ Error loading schedule: ' + error.message);
    }
  }

  // ============ CALENDAR ============
  renderCalendar() {
    const container = document.getElementById('calendarContent');
    if (!container) return;

    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startingDayOfWeek = firstDay.getDay();
    // Convert Sunday (0) to Saturday (6), and shift all others by -1 for Monday start
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const monthName = this.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    const timetable = storage.getTimetable() || [];
    const attendance = storage.getAttendanceRecords() || {};
    const subjects = storage.getSubjects() || [];

    let html = `
      <div class="calendar-header">
        <button id="prevMonthBtn" class="btn btn-sm">← Previous</button>
        <h2>${monthName}</h2>
        <button id="nextMonthBtn" class="btn btn-sm">Next →</button>
      </div>

      <div class="calendar-grid">
        <div class="weekdays">
          <div class="weekday">Mon</div>
          <div class="weekday">Tue</div>
          <div class="weekday">Wed</div>
          <div class="weekday">Thu</div>
          <div class="weekday">Fri</div>
          <div class="weekday">Sat</div>
        </div>
        <div class="days">
    `;

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      html += '<div class="day empty"></div>';
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      let dayOfWeek = date.getDay();
      // Convert to storage format: 1=Monday, 2=Tuesday, ..., 6=Saturday, 0=Sunday
      // But we only show Mon-Sat (1-6), skip Sunday (0)
      const storageIndex = dayOfWeek === 0 ? 0 : dayOfWeek;
      
      // Only show and allow classes for Monday-Saturday (1-6), not Sunday (0)
      let dayClasses = [];
      if (storageIndex !== 0) {
        dayClasses = timetable.filter(e => e.dayIndex === storageIndex);
      }
      const dayAttendance = attendance[dateStr] || {};

      let dayHtml = `<div class="day" data-date="${dateStr}">
        <div class="day-number">${day}</div>
        <div class="classes-in-day">
      `;

      if (dayClasses.length > 0) {
        dayClasses.forEach(entry => {
          const subject = subjects.find(s => s.id === entry.subjectId);
          const isAttended = dayAttendance[entry.subjectId];
          const attended = isAttended === true;
          const marked = isAttended !== undefined;

          dayHtml += `
            <div class="class-indicator" 
                 style="background-color: ${subject?.color || '#3498db'}; opacity: ${attended ? '1' : marked ? '0.3' : '0.5'}"
                 title="${subject?.name || 'Unknown'}"
                 onclick="ui.toggleAttendance('${dateStr}', '${entry.subjectId}')">
              <span class="indicator-status">${marked ? (attended ? '✔' : '✖') : '•'}</span>
            </div>
          `;
        });
        dayHtml += `<button class="btn btn-sm" style="margin-top: 0.5rem; width: 100%; font-size: 0.75rem;" onclick="ui.openEditDayModal('${dateStr}')">✏️ Edit Day</button>`;
      }

      dayHtml += '</div></div>';
      html += dayHtml;
    }

    html += `
        </div>
      </div>
      <div class="calendar-legend">
        <p><strong>Legend:</strong> Click colored dots to mark attendance</p>
        <div class="legend-items">
          <div class="legend-item"><span class="legend-color" style="opacity: 1">●</span> Attended</div>
          <div class="legend-item"><span class="legend-color" style="opacity: 0.3">●</span> Missed</div>
          <div class="legend-item"><span class="legend-color" style="opacity: 0.5">●</span> Not marked</div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    
    // Re-attach event listeners
    document.getElementById('prevMonthBtn')?.addEventListener('click', () => this.previousMonth());
    document.getElementById('nextMonthBtn')?.addEventListener('click', () => this.nextMonth());
  }

  // Toggle attendance
  toggleAttendance(dateStr, subjectId) {
    const attendance = storage.getAttendanceRecords() || {};
    const currentStatus = attendance[dateStr]?.[subjectId];
    
    // Toggle: undefined -> true -> false -> undefined
    let newStatus;
    if (currentStatus === undefined) {
      newStatus = true; // Mark as attended
    } else if (currentStatus === true) {
      newStatus = false; // Mark as missed
    } else {
      newStatus = undefined; // Mark as not marked
    }

    if (newStatus === undefined) {
      // Remove the attendance record
      if (attendance[dateStr]) {
        delete attendance[dateStr][subjectId];
      }
    } else {
      storage.markAttendance(dateStr, subjectId, newStatus);
    }

    this.renderCalendar();
    this.renderDashboard();
  }

  // Open edit day modal
  openEditDayModal(dateStr) {
    const modal = document.getElementById('editDayModal');
    if (!modal) {
      this.createEditDayModal();
    }
    
    const editDayModal = document.getElementById('editDayModal');
    editDayModal.style.display = 'block';
    
    // Get all data for this date
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    // Convert to storage format: 1=Monday, 2=Tuesday, ..., 6=Saturday, 0=Sunday
    const storageIndex = dayOfWeek === 0 ? 0 : dayOfWeek;
    
    const timetable = storage.getTimetable() || [];
    const attendance = storage.getAttendanceRecords() || {};
    const subjects = storage.getSubjects() || [];
    
    // Get classes for this day of week (skip Sunday)
    const dayClasses = storageIndex === 0 ? [] : timetable.filter(e => e.dayIndex === storageIndex);
    const dayAttendance = attendance[dateStr] || {};
    
    // Format date for display
    const dateObj = new Date(dateStr);
    const dateDisplay = dateObj.toLocaleString('default', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    document.getElementById('editDayTitle').textContent = `Edit Attendance - ${dateDisplay}`;
    
    // Populate classes
    const editDayContent = document.getElementById('editDayContent');
    editDayContent.innerHTML = '';
    
    if (dayClasses.length === 0) {
      editDayContent.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No classes scheduled for this day</p>';
      return;
    }
    
    dayClasses.forEach(entry => {
      const subject = subjects.find(s => s.id === entry.subjectId);
      const isAttended = dayAttendance[entry.subjectId];
      const attended = isAttended === true;
      const marked = isAttended !== undefined;
      
      const statusText = marked ? (attended ? '✔️ Attended' : '✖️ Missed') : '• Not Marked';
      const statusClass = marked ? (attended ? 'attended' : 'missed') : 'not-marked';
      
      const classItem = document.createElement('div');
      classItem.className = 'edit-day-item';
      classItem.innerHTML = `
        <div class="edit-day-subject">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 16px; height: 16px; background-color: ${subject?.color || '#3498db'}; border-radius: 3px;"></div>
            <div>
              <strong>${subject?.name || 'Unknown Subject'}</strong>
              ${subject?.code ? `<br><small style="opacity: 0.7;">${subject.code}</small>` : ''}
            </div>
          </div>
          <div class="edit-day-buttons">
            <button class="btn btn-sm ${attended ? 'btn-success' : 'btn-secondary'}" onclick="ui.setDayAttendance('${dateStr}', '${entry.subjectId}', true)">Attended</button>
            <button class="btn btn-sm ${marked && !attended ? 'btn-danger' : 'btn-secondary'}" onclick="ui.setDayAttendance('${dateStr}', '${entry.subjectId}', false)">Missed</button>
            <button class="btn btn-sm ${!marked ? 'btn-secondary' : 'btn-outline'}" onclick="ui.setDayAttendance('${dateStr}', '${entry.subjectId}', null)">Clear</button>
          </div>
        </div>
      `;
      editDayContent.appendChild(classItem);
    });
  }

  // Set attendance for a specific class on a specific date
  setDayAttendance(dateStr, subjectId, status) {
    const attendance = storage.getAttendanceRecords() || {};
    
    if (status === null) {
      // Clear the attendance record
      if (attendance[dateStr]) {
        delete attendance[dateStr][subjectId];
        if (Object.keys(attendance[dateStr]).length === 0) {
          delete attendance[dateStr];
        }
      }
    } else {
      // Mark attendance
      storage.markAttendance(dateStr, subjectId, status);
    }
    
    // Refresh the modal display
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    // Convert to storage format: 1=Monday, 2=Tuesday, ..., 6=Saturday, 0=Sunday
    const storageIndex = dayOfWeek === 0 ? 0 : dayOfWeek;
    
    const timetable = storage.getTimetable() || [];
    const newAttendance = storage.getAttendanceRecords() || {};
    const subjects = storage.getSubjects() || [];
    
    const dayClasses = storageIndex === 0 ? [] : timetable.filter(e => e.dayIndex === storageIndex);
    const dayAttendance = newAttendance[dateStr] || {};
    
    const editDayContent = document.getElementById('editDayContent');
    editDayContent.innerHTML = '';
    
    dayClasses.forEach(entry => {
      const subject = subjects.find(s => s.id === entry.subjectId);
      const isAttended = dayAttendance[entry.subjectId];
      const attended = isAttended === true;
      const marked = isAttended !== undefined;
      
      const classItem = document.createElement('div');
      classItem.className = 'edit-day-item';
      classItem.innerHTML = `
        <div class="edit-day-subject">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 16px; height: 16px; background-color: ${subject?.color || '#3498db'}; border-radius: 3px;"></div>
            <div>
              <strong>${subject?.name || 'Unknown Subject'}</strong>
              ${subject?.code ? `<br><small style="opacity: 0.7;">${subject.code}</small>` : ''}
            </div>
          </div>
          <div class="edit-day-buttons">
            <button class="btn btn-sm ${attended ? 'btn-success' : 'btn-secondary'}" onclick="ui.setDayAttendance('${dateStr}', '${entry.subjectId}', true)">Attended</button>
            <button class="btn btn-sm ${marked && !attended ? 'btn-danger' : 'btn-secondary'}" onclick="ui.setDayAttendance('${dateStr}', '${entry.subjectId}', false)">Missed</button>
            <button class="btn btn-sm ${!marked ? 'btn-secondary' : 'btn-outline'}" onclick="ui.setDayAttendance('${dateStr}', '${entry.subjectId}', null)">Clear</button>
          </div>
        </div>
      `;
      editDayContent.appendChild(classItem);
    });
    
    // Refresh calendar and dashboard
    this.renderCalendar();
    this.renderDashboard();
  }

  // Create edit day modal
  createEditDayModal() {
    const modal = document.createElement('div');
    modal.id = 'editDayModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="editDayTitle">Edit Attendance</h2>
          <button class="close-btn" data-close-modal>&times;</button>
        </div>
        <div id="editDayContent" style="padding: 1rem 0;">
          <!-- Content will be populated dynamically -->
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-close-modal>Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('[data-close-modal]').addEventListener('click', () => this.closeModal());
  }

  // Previous month
  previousMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.renderCalendar();
  }

  // Next month
  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.renderCalendar();
  }

  // Reset all calendar entries
  resetAllCalendarEntries() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const monthName = this.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    if (confirm(`⚠️ Are you sure you want to reset all attendance entries for ${monthName}?\n\nThis action cannot be undone.`)) {
      const attendance = storage.getAttendanceRecords() || {};
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      
      // Delete all attendance records for this month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        delete attendance[dateStr];
      }
      
      storage.setAttendanceRecords(attendance);
      this.renderCalendar();
      this.renderDashboard();
      this.showNotification(`✓ All entries for ${monthName} have been reset!`);
    }
  }

  // ============ ANALYTICS ============
  renderAnalytics() {
    const container = document.getElementById('analyticsContent');
    if (!container) return;

    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const summary = analytics.getMonthlySummary(year, month);

    let html = `
      <div class="analytics-header">
        <h2>${summary.month}</h2>
        <div class="month-nav">
          <button class="btn btn-sm" onclick="ui.previousAnalyticsMonth()">← Previous</button>
          <button class="btn btn-sm" onclick="ui.nextAnalyticsMonth()">Next →</button>
        </div>
      </div>

      <div class="analytics-summary">
    `;

    if (summary.subjects.length === 0) {
      html += '<p class="empty-state">No attendance data for this month</p>';
    } else {
      summary.subjects.forEach(subject => {
        const statusColor = subject.percentage < 75 ? '#ff6b6b' : '#51cf66';
        html += `
          <div class="analytics-card">
            <h3>${subject.subjectName}</h3>
            <div class="analytics-stats">
              <div class="stat">
                <span class="label">Total Classes</span>
                <span class="value">${subject.totalClasses}</span>
              </div>
              <div class="stat">
                <span class="label">Attended</span>
                <span class="value">${subject.attended}</span>
              </div>
              <div class="stat">
                <span class="label">Missed</span>
                <span class="value">${subject.totalClasses - subject.attended}</span>
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${subject.percentage}%; background-color: ${statusColor}"></div>
            </div>
            <p class="percentage" style="color: ${statusColor}">${subject.percentage}%</p>
          </div>
        `;
      });
    }

    html += '</div>';
    container.innerHTML = html;
  }

  previousAnalyticsMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.renderAnalytics();
  }

  nextAnalyticsMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.renderAnalytics();
  }

  // ============ PREDICTIONS ============
  renderPredictions() {
    const container = document.getElementById('predictionsContent');
    if (!container) return;

    const subjects = storage.getSubjects() || [];
    
    if (subjects.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>📊 No Subjects to Analyze</h3>
          <p>Add subjects first to see attendance predictions.</p>
        </div>
      `;
      return;
    }

    let html = '<div class="predictions-grid">';

    subjects.forEach(subject => {
      const prediction = analytics.predictSafeDaysToRemain(subject.id);
      
      if (!prediction) return;

      const currentStat = prediction.currentStats;
      const pred = prediction.prediction;

      html += `
        <div class="prediction-card">
          <h3>${prediction.subjectName}</h3>
          
          <div class="current-status">
            <h4>Current Status</h4>
            <div class="status-grid">
              <div><span class="label">Total Classes:</span> <span class="value">${currentStat.totalClasses}</span></div>
              <div><span class="label">Attended:</span> <span class="value">${currentStat.attended}</span></div>
              <div><span class="label">Current %:</span> <span class="value">${currentStat.percentage}%</span></div>
            </div>
          </div>

          ${pred ? `
            <div class="future-prediction">
              <h4>Upcoming Classes Prediction</h4>
              <div class="prediction-stats">
                <div><span class="label">Future Classes:</span> <span class="value">${pred.totalFutureClasses}</span></div>
                <div><span class="label">Need to Attend:</span> <span class="value">${pred.needToAttend}</span></div>
                <div><span class="label">Can Safely Miss:</span> <span class="value highlight">${pred.canSafelyMiss}</span></div>
              </div>
            </div>

            <div class="recommendations">
              <h4>📋 AI Recommendations</h4>
              ${prediction.recommendation ? `
                <div class="recommendation-item ${prediction.recommendation.level}">
                  <p>${prediction.recommendation.message}</p>
                  <p class="action">→ ${prediction.recommendation.action}</p>
                </div>
              ` : ''}
              ${pred.recommendations ? pred.recommendations.map(rec => `
                <div class="recommendation-item ${rec.level}">
                  <p>${rec.message}</p>
                  <p class="action">→ ${rec.action}</p>
                </div>
              `).join('') : ''}
            </div>
          ` : `<p class="empty-prediction">Complete your timetable to see predictions</p>`}
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;
  }

  // ============ UTILITIES ============
  closeModal(e) {
    if (e) e.stopPropagation();
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
  }

  showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  exportData() {
    const data = storage.exportData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    this.showNotification('Data exported successfully!');
  }

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          storage.importData(data);
          this.showNotification('Data imported successfully!');
          this.renderDashboard();
        } catch (error) {
          this.showNotification('Invalid file format!', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }
}

const ui = new UIManager();
