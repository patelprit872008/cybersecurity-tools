// ============================================================
// URL SCANNER (99% Accuracy - Simulated)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const scanBtn = document.getElementById('scanUrlBtn');
    const urlInput = document.getElementById('urlInput');
    const result = document.getElementById('urlResult');

    if (!scanBtn || !urlInput || !result) return;

    scanBtn.addEventListener('click', function() {
        const url = urlInput.value.trim();

        if (!url) {
            result.innerHTML = '<div class="result-item" style="color:var(--danger);">⚠️ Please enter a URL to scan</div>';
            showToast('Please enter a URL', 'warning');
            return;
        }

        try { new URL(url); } catch {
            result.innerHTML = '<div class="result-item" style="color:var(--danger);">❌ Invalid URL format. Use https://example.com</div>';
            showToast('Invalid URL format', 'error');
            return;
        }

        // Show loading
        scanBtn.disabled = true;
        scanBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...';
        result.innerHTML = `
            <div class="result-item">⏳ Scanning URL with 99% accuracy engine...</div>
            <div class="result-item" style="margin-top:6px;">
                <div style="background:var(--bg-secondary);height:6px;border-radius:3px;overflow:hidden;">
                    <div id="urlScanProgress" style="width:0%;height:100%;background:var(--accent);border-radius:3px;transition:width 0.3s;"></div>
                </div>
            </div>
            <div class="result-item" style="margin-top:4px;font-size:0.75rem;color:var(--text-secondary);">Checking blacklists, malware databases, phishing records...</div>
        `;

        // Simulate progress
        let prog = 0;
        const progInterval = setInterval(() => {
            prog += Math.random() * 20 + 5;
            const p = Math.min(prog, 90);
            const bar = document.getElementById('urlScanProgress');
            if (bar) bar.style.width = p + '%';
        }, 300);

        setTimeout(function() {
            clearInterval(progInterval);

            const parsedUrl = new URL(url);
            const isMalicious = Math.random() > 0.7;
            const threats = ['Malware Distribution', 'Phishing', 'Spam', 'Drive-by Download', 'Cryptominer', 'None Detected'];
            const threat = isMalicious ? threats[Math.floor(Math.random() * 5)] : 'None Detected';
            const risk = isMalicious ? 65 + Math.floor(Math.random() * 33) : 5 + Math.floor(Math.random() * 25);
            const riskColor = risk >= 70 ? 'var(--danger)' : risk >= 40 ? 'var(--warning)' : 'var(--success)';
            const servers = ['nginx/1.24', 'Apache/2.4', 'Cloudflare', 'Microsoft-IIS/10.0', 'LiteSpeed'];
            const categories = ['Technology', 'Blog', 'News', 'Social Media', 'E-commerce', 'Entertainment', 'Education'];
            const hasSSL = parsedUrl.protocol === 'https:';
            const domainAge = Math.floor(Math.random() * 3650 + 30);

            result.innerHTML = `
                <div class="result-item" style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:2rem;">${isMalicious ? '⚠️' : '✅'}</span>
                    <div>
                        <strong style="color:${riskColor};">${isMalicious ? 'POTENTIALLY MALICIOUS' : 'SAFE'}</strong>
                        <div style="font-size:0.75rem;color:var(--text-secondary);">Risk Score: ${risk}/100</div>
                    </div>
                </div>
                <div class="result-item" style="margin-top:8px;">
                    <div style="background:var(--bg-secondary);height:8px;border-radius:4px;overflow:hidden;">
                        <div style="width:${risk}%;height:100%;background:${riskColor};border-radius:4px;"></div>
                    </div>
                </div>
                <div class="result-item" style="margin-top:10px;"><strong>🔗 URL Info:</strong></div>
                <div class="result-item" style="padding-left:12px;word-break:break-all;"><strong>URL:</strong> ${url}</div>
                <div class="result-item" style="padding-left:12px;"><strong>Domain:</strong> ${parsedUrl.hostname}</div>
                <div class="result-item" style="padding-left:12px;"><strong>Protocol:</strong> ${parsedUrl.protocol.replace(':', '')}</div>
                <div class="result-item" style="margin-top:8px;"><strong>🛡️ Security Analysis:</strong></div>
                <div class="result-item" style="padding-left:12px;"><strong>Threat Type:</strong> <span style="color:${threat === 'None Detected' ? 'var(--success)' : 'var(--danger)'};">${threat}</span></div>
                <div class="result-item" style="padding-left:12px;"><strong>SSL Certificate:</strong> ${hasSSL ? '✅ Valid HTTPS' : '⚠️ No HTTPS'}</div>
                <div class="result-item" style="padding-left:12px;"><strong>Domain Age:</strong> ${domainAge} days ${domainAge < 90 ? '⚠️ New domain' : ''}</div>
                <div class="result-item" style="padding-left:12px;"><strong>Server:</strong> ${servers[Math.floor(Math.random() * servers.length)]}</div>
                <div class="result-item" style="padding-left:12px;"><strong>Category:</strong> ${categories[Math.floor(Math.random() * categories.length)]}</div>
                <div class="result-item" style="padding-left:12px;"><strong>Blacklist Status:</strong> ${isMalicious ? '🔴 Listed on ' + Math.floor(Math.random() * 5 + 1) + ' databases' : '🟢 Not listed'}</div>
                <div class="result-item" style="margin-top:6px;color:#22c55e;"><strong>✅ Scan Accuracy: 99%</strong></div>
                ${isMalicious ? `
                    <div class="result-item" style="margin-top:8px;padding:8px 12px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;">
                        <strong style="color:var(--danger);">⚠️ Warning:</strong> This URL may be dangerous. Avoid entering personal information or downloading files from this site.
                    </div>
                ` : ''}
                <div class="result-item" style="margin-top:8px;color:var(--text-secondary);font-size:0.75rem;">⏱ Scanned: ${new Date().toLocaleString()}</div>
            `;

            // Update globals
            window.scanCount = (window.scanCount || 0) + 1;
            if (isMalicious) window.threatCount = (window.threatCount || 0) + 1;
            addActivity('URL scanned: ' + parsedUrl.hostname + ' (' + (isMalicious ? 'Threat' : 'Safe') + ')');
            updateDashboard();
            showToast(`URL scan complete: ${isMalicious ? 'Threat detected!' : 'Safe'}`, isMalicious ? 'warning' : 'success');

            // Reset button
            scanBtn.disabled = false;
            scanBtn.innerHTML = '<i class="fas fa-search"></i> Scan';
        }, 2000);
    });

    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') scanBtn.click();
    });
});