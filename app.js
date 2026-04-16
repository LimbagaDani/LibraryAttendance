// Library Attendance System

class LibraryAttendance {
    constructor() {
        this.storageKey = 'libraryAttendance';
        this.records = this.loadRecords();
        this.init();
    }

    init() {
        this.displayCurrentDate();
        this.bindEvents();
        this.renderTable();
        this.updateStats();
    }

    // Display current date
    displayCurrentDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString('en-US', options);
        document.getElementById('currentDate').textContent = today;
    }

    // Get today's date string for filtering
    getTodayString() {
        return new Date().toISOString().split('T')[0];
    }

    // Load records from localStorage
    loadRecords() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // Save records to localStorage
    saveRecords() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.records));
    }

    // Get today's records only
    getTodayRecords() {
        const today = this.getTodayString();
        return this.records.filter(record => record.date === today);
    }

    // Bind event listeners
    bindEvents() {
        document.getElementById('checkInForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.checkIn();
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.renderTable(e.target.value);
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportToCSV();
        });
    }

    // Check in a visitor
    checkIn() {
        const name = document.getElementById('visitorName').value.trim();
        const id = document.getElementById('visitorId').value.trim();
        const purpose = document.getElementById('purpose').value;

        const todayRecords = this.getTodayRecords();
        const existingRecord = todayRecords.find(
            r => r.visitorId === id && !r.checkOutTime
        );

        if (existingRecord) {
            this.showToast('This ID is already checked in today.', 'error');
            return;
        }

        const record = {
            id: Date.now(),
            visitorName: name,
            visitorId: id,
            purpose: purpose,
            date: this.getTodayString(),
            checkInTime: new Date().toISOString(),
            checkOutTime: null
        };

        this.records.push(record);
        this.saveRecords();
        this.renderTable();
        this.updateStats();
        this.resetForm();
        this.showToast(`${name} checked in successfully!`, 'success');
    }

    // Check out a visitor
    checkOut(recordId) {
        const record = this.records.find(r => r.id === recordId);
        if (record) {
            record.checkOutTime = new Date().toISOString();
            this.saveRecords();
            this.renderTable();
            this.updateStats();
            this.showToast(`${record.visitorName} checked out.`, 'success');
        }
    }

    // Calculate duration
    calculateDuration(checkIn, checkOut) {
        if (!checkOut) return '—';

        const diff = new Date(checkOut) - new Date(checkIn);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    // Format time
    formatTime(isoString) {
        if (!isoString) return '—';
        return new Date(isoString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Render table
    renderTable(searchQuery = '') {
        const tbody = document.getElementById('attendanceBody');
        const emptyMessage = document.getElementById('emptyMessage');
        let records = this.getTodayRecords();

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            records = records.filter(r =>
                r.visitorName.toLowerCase().includes(query) ||
                r.visitorId.toLowerCase().includes(query)
            );
        }

        records.sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime));

        if (records.length === 0) {
            tbody.innerHTML = '';
            emptyMessage.style.display = 'block';
            return;
        }

        emptyMessage.style.display = 'none';

        tbody.innerHTML = records.map(record => `
            <tr>
                <td><strong>${this.escapeHtml(record.visitorName)}</strong></td>
                <td>${this.escapeHtml(record.visitorId)}</td>
                <td>${this.escapeHtml(record.purpose)}</td>
                <td>${this.formatTime(record.checkInTime)}</td>
                <td class="${record.checkOutTime ? 'status-out' : 'status-in'}">
                    ${record.checkOutTime ? this.formatTime(record.checkOutTime) : 'Still in library'}
                </td>
                <td>${this.calculateDuration(record.checkInTime, record.checkOutTime)}</td>
                <td>
                    ${!record.checkOutTime 
                        ? `<button class="btn btn-success" onclick="app.checkOut(${record.id})">Check Out</button>` 
                        : '<span style="color: var(--gray-400);">—</span>'
                    }
                </td>
            </tr>
        `).join('');
    }

    // Update stats
    updateStats() {
        const todayRecords = this.getTodayRecords();
        const totalVisitors = todayRecords.length;
        const currentlyIn = todayRecords.filter(r => !r.checkOutTime).length;
        const checkedOut = todayRecords.filter(r => r.checkOutTime).length;

        document.getElementById('totalVisitors').textContent = totalVisitors;
        document.getElementById('currentlyIn').textContent = currentlyIn;
        document.getElementById('checkedOut').textContent = checkedOut;
    }

    // Reset form
    resetForm() {
        document.getElementById('checkInForm').reset();
        document.getElementById('visitorName').focus();
    }

    // Export CSV
    exportToCSV() {
        const records = this.getTodayRecords();
        if (records.length === 0) {
            this.showToast('No records to export.', 'error');
            return;
        }

        const headers = ['Name', 'ID', 'Purpose', 'Check-In', 'Check-Out', 'Duration'];
        const rows = records.map(r => [
            r.visitorName,
            r.visitorId,
            r.purpose,
            this.formatTime(r.checkInTime),
            r.checkOutTime ? this.formatTime(r.checkOutTime) : 'Still in library',
            this.calculateDuration(r.checkInTime, r.checkOutTime)
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `library-attendance-${this.getTodayString()}.csv`;
        a.click();

        URL.revokeObjectURL(url);

        this.showToast('Attendance exported successfully!', 'success');
    }

    // Toast
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app
const app = new LibraryAttendance();
