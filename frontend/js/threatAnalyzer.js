document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeThreatBtn');
    const threatInput = document.getElementById('threatInput');
    const threatResult = document.getElementById('threatResult');

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async () => {
            const data = threatInput.value.trim();
            if (!data) {
                threatResult.innerHTML = `
                    <div class="result-item" style="color:var(--text-secondary);">
                        <i class="fas fa-exclamation-circle"></i> Please enter threat data to analyze.
                    </div>`;
                return;
            }

            threatResult.innerHTML = `
                <div class="result-item">
                    <i class="fas fa-spinner fa-spin"></i> Analyzing threat...
                </div>`;

            try {
                const result = await apiCall('/api/tools/threat-analyze', {
                    method: 'POST',
                    body: JSON.stringify({ data, ip: data, type: 'general' })
                });

                const colors = {
                    High: 'var(--danger)',
                    Medium: 'var(--warning)',
                    Low: 'var(--success)'
                };

                threatResult.innerHTML = `
                    <div class="result-item" style="display:flex; align-items:center; gap:12px;">
                        <div style="font-size:2rem;">
                            ${result.riskLevel === 'High' ? '🔴' : result.riskLevel === 'Medium' ? '🟡' : '🟢'}
                        </div>
                        <div>
                            <strong>Threat:</strong> ${result.threat.type}
                            <br />
                            <strong>Severity:</strong> 
                            <span style="color:${colors[result.riskLevel]}; font-weight:700;">${result.riskLevel}</span>
                            <br />
                            <strong>Confidence:</strong> ${result.threat.confidence}%
                            <br />
                            <strong>Risk Score:</strong> ${result.score}/100
                        </div>
                    </div>
                    <div class="result-item" style="margin-top:12px;">
                        <strong>📋 Recommendations:</strong>
                        <ul style="margin-top:6px; list-style:none; padding:0;">
                            ${result.recommendations.map(rec => `<li style="padding:4px 0;">• ${rec}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="result-item" style="margin-top:8px; color:var(--text-secondary); font-size:0.75rem;">
                        ⏱ ${new Date(result.timestamp).toLocaleString()}
                    </div>
                `;

            } catch (error) {
                threatResult.innerHTML = `
                    <div class="result-item" style="color:var(--danger);">
                        ❌ Error: ${error.message}
                    </div>`;
            }
        });

        threatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') analyzeBtn.click();
        });
    }
});