// ============================================================
// THREATANALYZER.JS - Complete Threat Analysis Tool
// ============================================================

// Toast Notification Function
function showToast(message, type = 'info') {
    const colors = {
        'success': '#22c55e',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 14px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Activity Log Function
function addActivity(message) {
    const activityLog = document.getElementById('activityLog');
    if (activityLog) {
        const timestamp = new Date().toLocaleTimeString();
        const activityItem = document.createElement('div');
        activityItem.style.cssText = `
            padding: 8px 12px;
            margin-bottom: 8px;
            background: rgba(255,255,255,0.05);
            border-left: 3px solid var(--accent, #3b82f6);
            border-radius: 4px;
            font-size: 13px;
            color: var(--text-secondary, #9ca3af);
        `;
        activityItem.innerHTML = `<strong>${timestamp}</strong> - ${message}`;
        activityLog.insertBefore(activityItem, activityLog.firstChild);
        
        // Keep only last 20 activities
        while (activityLog.children.length > 20) {
            activityLog.removeChild(activityLog.lastChild);
        }
    }
    console.log(`[${new Date().toLocaleTimeString()}] Activity:`, message);
}

// Dashboard Update Function
function updateDashboard() {
    const scanCountEl = document.getElementById('totalScans');
    const threatCountEl = document.getElementById('threatCount');
    
    if (scanCountEl) {
        scanCountEl.textContent = window.scanCount || 0;
    }
    if (threatCountEl) {
        threatCountEl.textContent = window.threatCount || 0;
    }
    
    console.log('Dashboard updated:', {
        totalScans: window.scanCount || 0,
        threats: window.threatCount || 0
    });
}

// Main Threat Analyzer Logic
document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeThreatBtn');
    const threatInput = document.getElementById('threatInput');
    const threatResult = document.getElementById('threatResult');

    if (!analyzeBtn || !threatInput || !threatResult) {
        console.warn('Required elements not found in DOM');
        return;
    }

    // Add CSS animations if not already present
    if (!document.getElementById('scan-loading-style')) {
        const style = document.createElement('style');
        style.id = 'scan-loading-style';
        style.textContent = `
            @keyframes scanLoading {
                0% { left: -30%; width: 30%; }
                50% { left: 30%; width: 40%; }
                100% { left: 100%; width: 30%; }
            }
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    analyzeBtn.addEventListener('click', () => {
        const query = threatInput.value.trim();
        if (!query) {
            showToast('Please enter IP address, domain, or file hash to analyze.', 'warning');
            return;
        }

        // Setup loading state
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        threatResult.innerHTML = `
            <div class="result-item" style="text-align:center;padding:24px 0;">
                <i class="fas fa-circle-notch fa-spin" style="font-size:2rem;color:var(--accent);margin-bottom:12px;display:block;"></i>
                <p style="font-weight:500;">Running threat intelligence analysis on "${query}"...</p>
                <div style="width:100%;max-width:200px;background:rgba(255,255,255,0.1);height:6px;border-radius:3px;margin:12px auto 0;overflow:hidden;position:relative;">
                    <div style="background:var(--accent);height:100%;width:30%;border-radius:3px;position:absolute;left:0;top:0;animation:scanLoading 1.5s infinite ease-in-out;"></div>
                </div>
            </div>
        `;

        // Simulate API call delay
        setTimeout(() => {
            // Determine result based on input
            const lowercaseQuery = query.toLowerCase();
            let score = 15;
            let type = 'None Detected';
            let riskLevel = 'Low';
            let confidence = 98;
            let recommendations = [
                'Continue standard traffic monitoring.',
                'Ensure SSL certificates are up to date.',
                'Perform weekly scheduled network sweeps.'
            ];

            // Detection logic
            if (lowercaseQuery.includes('malware') || lowercaseQuery.includes('hack') || lowercaseQuery.length === 32 || lowercaseQuery.length === 64) {
                score = 88;
                type = 'Ransomware / Trojan Horse';
                riskLevel = 'High';
                confidence = 94;
                recommendations = [
                    'Isolate the host machine from the local network immediately.',
                    'Initiate a full endpoint quarantine process.',
                    'Perform full memory dump and filesystem scan.',
                    'Update firewall rules to block associated external destination IPs.'
                ];
            } else if (lowercaseQuery.includes('phish') || lowercaseQuery.includes('test') || lowercaseQuery.includes('danger')) {
                score = 62;
                type = 'Phishing Link / Credential Harvester';
                riskLevel = 'Medium';
                confidence = 82;
                recommendations = [
                    'Revoke all active sessions for users visiting this URL.',
                    'Inject DNS redirect sinkhole to prevent standard user navigation.',
                    'Implement stricter email gateway filtration settings.'
                ];
            } else if (lowercaseQuery.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
                // IP Address simulation - randomize
                score = Math.floor(Math.random() * 70) + 15;
                if (score > 70) {
                    type = 'IP Blacklisted (Botnet Command & Control Node)';
                    riskLevel = 'High';
                    confidence = 91;
                    recommendations = [
                        'Block target IP in system firewall/WAF immediately.',
                        'Review outgoing network connection logs to this host.',
                        'Verify endpoint compliance tools are active.'
                    ];
                } else if (score > 40) {
                    type = 'Port Scanning Activity Detected';
                    riskLevel = 'Medium';
                    confidence = 78;
                    recommendations = [
                        'Monitor incoming connections from this address.',
                        'Rate limit external requests originating from target network.'
                    ];
                }
            } else {
                // Random default simulation
                score = Math.floor(Math.random() * 50) + 5;
                if (score > 40) {
                    type = 'Suspicious Domain Registration Pattern';
                    riskLevel = 'Medium';
                    confidence = 60;
                    recommendations = [
                        'Verify ownership registry.',
                        'Keep domain on watch list for dynamic updates.'
                    ];
                }
            }

            const colors = {
                High: 'var(--danger, #ef4444)',
                Medium: 'var(--warning, #f59e0b)',
                Low: 'var(--success, #22c55e)'
            };

            const riskIcons = {
                High: '🔴',
                Medium: '🟡',
                Low: '🟢'
            };

            // Display results
            threatResult.innerHTML = `
                <div class="result-item" style="display:flex; align-items:center; gap:16px;">
                    <div style="font-size:2.8rem;background:rgba(255,255,255,0.05);padding:12px;border-radius:12px;display:flex;align-items:center;justify-content:center;">
                        ${riskIcons[riskLevel]}
                    </div>
                    <div>
                        <h4 style="font-size:1.1rem;margin-bottom:6px;color:var(--text-primary, #fff);">${type}</h4>
                        <div style="font-size:0.8rem;color:var(--text-secondary, #aaa);display:flex;flex-wrap:wrap;gap:12px;">
                            <span>Severity: <strong style="color:${colors[riskLevel]};">${riskLevel}</strong></span>
                            <span>Confidence: <strong>${confidence}%</strong></span>
                            <span>Risk Score: <strong>${score}/100</strong></span>
                        </div>
                    </div>
                </div>
                <div class="result-item" style="margin-top:14px;border-top:1px solid rgba(255,255,255,0.05);padding-top:14px;">
                    <h5 style="margin-bottom:8px;color:var(--text-primary, #fff);font-size:0.85rem;"><i class="fas fa-shield-halved" style="color:var(--accent, #3b82f6);margin-right:6px;"></i>Recommendations & Remediation:</h5>
                    <ul style="list-style:none;padding:0;margin:0;font-size:0.8rem;color:var(--text-secondary, #aaa);">
                        ${recommendations.map(rec => `<li style="padding:6px 0;display:flex;align-items:start;gap:8px;"><i class="fas fa-circle-check" style="color:var(--success, #22c55e);margin-top:2px;font-size:0.75rem;"></i><span>${rec}</span></li>`).join('')}
                    </ul>
                </div>
                <div class="result-item" style="margin-top:8px;color:var(--text-secondary, #aaa);font-size:0.7rem;text-align:right;opacity:0.8;">
                    <i class="fas fa-clock"></i> Analysis Completed: ${new Date().toLocaleString()}
                </div>
            `;

            // Reset button state
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analyze';

            // Update global stats
            window.scanCount = (window.scanCount || 0) + 1;
            if (riskLevel === 'High') {
                window.threatCount = (window.threatCount || 0) + 1;
            }

            // Call other functions
            addActivity(`Threat analyzed: ${query} (${riskLevel} Risk)`);
            updateDashboard();

            // Show completion toast
            const toastType = riskLevel === 'High' ? 'error' : riskLevel === 'Medium' ? 'warning' : 'success';
            showToast('Threat analysis complete!', toastType);

        }, 1500);
    });

    // Enter key support
    threatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            analyzeBtn.click();
        }
    });

    // Clear button functionality (optional)
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            threatInput.value = '';
            threatResult.innerHTML = '';
            threatInput.focus();
        });
    }

    // Initialize dashboard
    updateDashboard();
});

// Export functions for external use
window.showToast = showToast;
window.addActivity = addActivity;
window.updateDashboard = updateDashboard;
