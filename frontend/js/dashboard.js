// ============================================================
// DASHBOARD.JS - Dashboard Updates
// ============================================================

function updateDashboard() {
    const reports = JSON.parse(localStorage.getItem('cyber_reports')) || [];
    const reportCount = document.getElementById('reportCount');
    if (reportCount) reportCount.textContent = reports.length;

    const threatCountEl = document.getElementById('threatCount');
    const scanCountEl = document.getElementById('scanCount');
    const secureScoreEl = document.getElementById('secureScore');

    if (threatCountEl) threatCountEl.textContent = window.threatCount || 0;
    if (scanCountEl) scanCountEl.textContent = window.scanCount || 0;
    if (secureScoreEl) {
        const sc = window.scanCount || 0;
        const score = sc > 0 ? Math.min(95, 60 + sc * 5) : 0;
        secureScoreEl.textContent = score + '%';
    }

    // Update chart
    const bars = document.querySelectorAll('.chart-bar');
    const heights = [55 + Math.random() * 25, 35 + Math.random() * 20, 20 + Math.random() * 20, 10 + Math.random() * 15];
    bars.forEach((bar, i) => {
        const h = Math.round(heights[i]);
        bar.style.height = h + '%';
        const val = bar.querySelector('.bar-value');
        if (val) val.textContent = h + '%';
    });

    // Update activity
    const activity = JSON.parse(localStorage.getItem('cyber_activity')) || [];
    const container = document.getElementById('recentActivity');
    if (container) {
        if (activity.length === 0) {
            container.innerHTML = '<div class="activity-item"><div class="activity-avatar" style="background:rgba(59,130,246,0.2);color:var(--accent);"><i class="fas fa-shield"></i></div><div class="activity-content"><div class="desc" style="color:var(--text-secondary);">System initialized</div><div class="time">Just now</div></div></div>';
        } else {
            const iconMap = {
                'Password': 'fa-key',
                'Hash': 'fa-hashtag',
                'Port': 'fa-plug',
                'SSL': 'fa-lock',
                'URL': 'fa-link',
                'WHOIS': 'fa-globe',
                'Report': 'fa-file-alt',
                'Login': 'fa-sign-in-alt',
                'Logout': 'fa-sign-out-alt'
            };
            container.innerHTML = activity.slice(0, 8).map(a => {
                let icon = 'fa-shield';
                for (const [key, val] of Object.entries(iconMap)) {
                    if (a.desc.includes(key)) { icon = val; break; }
                }
                return `<div class="activity-item">
                    <div class="activity-avatar" style="background:rgba(59,130,246,0.2);color:var(--accent);">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="desc">${a.desc}</div>
                        <div class="time">${a.time}</div>
                    </div>
                </div>`;
            }).join('');
        }
    }
}
window.updateDashboard = updateDashboard;

// Add activity helper
function addActivity(desc) {
    const activity = JSON.parse(localStorage.getItem('cyber_activity')) || [];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    activity.unshift({ desc, time: timeStr });
    if (activity.length > 30) activity.pop();
    localStorage.setItem('cyber_activity', JSON.stringify(activity));
}
window.addActivity = addActivity;

// Update dashboard on load
document.addEventListener('DOMContentLoaded', function() {
    updateDashboard();
    // Auto-update every 30 seconds
    setInterval(updateDashboard, 30000);
});