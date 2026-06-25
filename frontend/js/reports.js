// ============================================================
// REPORTS.JS - Incident Reports Management
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const newReportBtn = document.getElementById('newReportBtn');
    const reportForm = document.getElementById('reportForm');
    const cancelReportBtn = document.getElementById('cancelReportBtn');
    const reportFormElement = document.getElementById('reportFormElement');
    const reportsList = document.getElementById('reportsList');

    if (!newReportBtn || !reportForm || !reportFormElement || !reportsList) return;

    // Toggle form
    newReportBtn.addEventListener('click', function() {
        reportForm.classList.toggle('hidden');
        if (!reportForm.classList.contains('hidden')) {
            document.getElementById('reportTitle').focus();
            newReportBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
            newReportBtn.className = 'btn btn-secondary';
        } else {
            newReportBtn.innerHTML = '<i class="fas fa-plus"></i> New Report';
            newReportBtn.className = 'btn btn-primary';
        }
    });

    // Cancel
    cancelReportBtn.addEventListener('click', function() {
        reportForm.classList.add('hidden');
        reportFormElement.reset();
        newReportBtn.innerHTML = '<i class="fas fa-plus"></i> New Report';
        newReportBtn.className = 'btn btn-primary';
    });

    // Create Report
    reportFormElement.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('reportTitle').value.trim();
        const description = document.getElementById('reportDescription').value.trim();

        if (!title || !description) {
            showToast('Please fill in all required fields', 'warning');
            return;
        }

        const report = {
            id: Date.now(),
            title: title,
            type: document.getElementById('reportType').value,
            severity: document.getElementById('reportSeverity').value,
            description: description,
            status: 'Open',
            createdAt: new Date().toISOString()
        };

        const reports = JSON.parse(localStorage.getItem('cyber_reports')) || [];
        reports.unshift(report);
        localStorage.setItem('cyber_reports', JSON.stringify(reports));

        showToast('Report created successfully!', 'success');
        reportForm.classList.add('hidden');
        reportFormElement.reset();
        newReportBtn.innerHTML = '<i class="fas fa-plus"></i> New Report';
        newReportBtn.className = 'btn btn-primary';
        loadReports();
        addActivity('Report created: ' + report.title);
        updateDashboard();
    });

    // Load Reports
    function loadReports() {
        const reports = JSON.parse(localStorage.getItem('cyber_reports')) || [];

        if (reports.length === 0) {
            reportsList.innerHTML = `
                <div style="text-align:center;padding:40px 0;color:var(--text-secondary);">
                    <i class="fas fa-file-alt" style="font-size:2.5rem;display:block;margin-bottom:12px;opacity:0.5;"></i>
                    <p style="font-size:0.9rem;">No reports yet. Create your first incident report!</p>
                    <p style="font-size:0.75rem;margin-top:4px;">Click "New Report" to get started</p>
                </div>
            `;
            return;
        }

        reportsList.innerHTML = reports.map(r => {
            const severityColors = {
                'Critical': 'badge-critical',
                'High': 'badge-high', 
                'Medium': 'badge-medium',
                'Low': 'badge-low'
            };
            const statusColors = {
                'Open': 'badge-open',
                'InProgress': 'badge-inprogress',
                'Resolved': 'badge-resolved',
                'Closed': 'badge-closed'
            };
            const typeIcons = {
                'Malware': 'fa-bug',
                'Phishing': 'fa-fish',
                'DDoS': 'fa-network-wired',
                'Data Breach': 'fa-database',
                'Vulnerability': 'fa-shield-virus',
                'Other': 'fa-exclamation-triangle'
            };

            return `<div class="report-item">
                <div class="report-info">
                    <div class="report-title"><i class="fas ${typeIcons[r.type] || 'fa-file'}" style="color:var(--accent);margin-right:6px;"></i>${r.title}</div>
                    <div class="report-meta">
                        <span class="badge ${severityColors[r.severity] || 'badge-medium'}">${r.severity}</span>
                        <span class="badge ${statusColors[r.status] || 'badge-open'}">${r.status}</span>
                        <span>${r.type}</span>
                        <span>${new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style="color:var(--text-secondary);font-size:0.75rem;margin-top:4px;">${r.description.substring(0,100)}${r.description.length>100?'...':''}</div>
                </div>
                <div class="report-actions">
                    <button class="btn btn-secondary" onclick="editReport(${r.id})" style="padding:4px 10px;font-size:0.7rem;" title="Update Status">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteReport(${r.id})" style="padding:4px 10px;font-size:0.7rem;" title="Delete Report">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`;
        }).join('');
    }

    // Delete Report
    window.deleteReport = function(id) {
        if (!confirm('Are you sure you want to delete this report?')) return;
        let reports = JSON.parse(localStorage.getItem('cyber_reports')) || [];
        reports = reports.filter(r => r.id !== id);
        localStorage.setItem('cyber_reports', JSON.stringify(reports));
        loadReports();
        addActivity('Report deleted');
        updateDashboard();
        showToast('Report deleted', 'info');
    };

    // Edit Report
    window.editReport = function(id) {
        const validStatuses = ['Open', 'InProgress', 'Resolved', 'Closed'];
        const status = prompt('Update status:\n\n1. Open\n2. InProgress\n3. Resolved\n4. Closed\n\nEnter status:');
        if (status) {
            const normalizedStatus = validStatuses.find(s => s.toLowerCase() === status.trim().toLowerCase());
            if (!normalizedStatus) {
                showToast('Invalid status. Use: Open, InProgress, Resolved, or Closed', 'error');
                return;
            }
            const reports = JSON.parse(localStorage.getItem('cyber_reports')) || [];
            const idx = reports.findIndex(r => r.id === id);
            if (idx !== -1) {
                reports[idx].status = normalizedStatus;
                localStorage.setItem('cyber_reports', JSON.stringify(reports));
                loadReports();
                addActivity('Report status updated to ' + normalizedStatus);
                updateDashboard();
                showToast('Report status updated to ' + normalizedStatus, 'success');
            }
        }
    };

    // Initial load
    loadReports();
});