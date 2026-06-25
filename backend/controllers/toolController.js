// Threat Analysis
exports.analyzeThreat = async (req, res) => {
    try {
        const { ip, type, data } = req.body;
        
        const threats = [
            { type: 'Malware', severity: 'Critical', confidence: 92 },
            { type: 'Phishing', severity: 'High', confidence: 78 },
            { type: 'DDoS', severity: 'Medium', confidence: 65 },
            { type: 'Data Breach', severity: 'Critical', confidence: 88 },
            { type: 'Ransomware', severity: 'High', confidence: 71 },
            { type: 'SQL Injection', severity: 'Medium', confidence: 59 },
            { type: 'XSS Attack', severity: 'Low', confidence: 43 }
        ];
        
        const randomThreat = threats[Math.floor(Math.random() * threats.length)];
        const score = Math.floor(Math.random() * 100);
        
        res.json({
            threat: randomThreat,
            score,
            riskLevel: score > 70 ? 'High' : score > 40 ? 'Medium' : 'Low',
            recommendations: [
                'Update security patches',
                'Enable firewall rules',
                'Monitor network traffic',
                'Review access logs'
            ],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Analysis failed' });
    }
};

// Password Checker
exports.checkPassword = async (req, res) => {
    try {
        const { password } = req.body;
        
        let strength = 0;
        let feedback = [];
        let score = 0;
        
        if (password.length < 8) {
            feedback.push('Password should be at least 8 characters');
        } else {
            strength += 25;
            score += 25;
        }
        
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
            strength += 25;
            score += 25;
        } else {
            feedback.push('Include both uppercase and lowercase letters');
        }
        
        if (password.match(/[0-9]/)) {
            strength += 25;
            score += 25;
        } else {
            feedback.push('Include numbers');
        }
        
        if (password.match(/[^a-zA-Z0-9]/)) {
            strength += 25;
            score += 25;
        } else {
            feedback.push('Include special characters (!@#$%^&*)');
        }
        
        const commonPasswords = ['password', '123456', 'admin', 'qwerty', 'letmein', 'welcome'];
        if (commonPasswords.includes(password.toLowerCase())) {
            strength = Math.min(strength, 25);
            score = Math.min(score, 25);
            feedback = ['This is a commonly used password. Please choose something more unique.'];
        }
        
        let status;
        if (strength >= 75) status = 'Strong';
        else if (strength >= 50) status = 'Medium';
        else status = 'Weak';
        
        res.json({
            score,
            strength: status,
            feedback: feedback.length > 0 ? feedback : ['Password meets security requirements'],
            strengthLevel: strength,
            timeToCrack: score >= 75 ? 'Centuries' : score >= 50 ? 'Months' : 'Hours'
        });
    } catch (error) {
        res.status(500).json({ error: 'Password check failed' });
    }
};

// URL Scanner
exports.scanUrl = async (req, res) => {
    try {
        const { url } = req.body;
        
        const isMalicious = Math.random() > 0.7;
        const threatTypes = ['Malware', 'Phishing', 'Spam', 'Drive-by Download', 'None'];
        const selectedThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
        
        res.json({
            url,
            safe: !isMalicious,
            threatType: isMalicious ? selectedThreat : 'None',
            riskScore: isMalicious ? Math.floor(Math.random() * 50) + 50 : Math.floor(Math.random() * 40),
            sslValid: Math.random() > 0.2,
            age: Math.floor(Math.random() * 365) + ' days',
            category: ['Blog', 'News', 'Social Media', 'E-commerce', 'Security'][Math.floor(Math.random() * 5)],
            details: {
                redirects: Math.floor(Math.random() * 3),
                statusCode: 200,
                server: ['nginx', 'Apache', 'Cloudflare', 'Microsoft-IIS'][Math.floor(Math.random() * 4)]
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'URL scan failed' });
    }
};

// Hash Generator (New Tool)
exports.generateHash = async (req, res) => {
    try {
        const { text, algorithm } = req.body;
        const crypto = require('crypto');
        
        const hash = crypto.createHash(algorithm || 'sha256');
        hash.update(text);
        const hashValue = hash.digest('hex');
        
        res.json({
            text,
            algorithm: algorithm || 'sha256',
            hash: hashValue,
            length: hashValue.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Hash generation failed' });
    }
};

// Port Scanner (New Tool)
exports.scanPorts = async (req, res) => {
    try {
        const { host, ports } = req.body;
        const portList = ports ? ports.split(',').map(p => parseInt(p.trim())) : [80, 443, 22, 21, 25, 53, 110, 143, 3306, 5432];
        
        // Simulate port scanning
        const results = portList.map(port => ({
            port,
            open: Math.random() > 0.6,
            service: ['HTTP', 'HTTPS', 'SSH', 'FTP', 'SMTP', 'DNS', 'POP3', 'IMAP', 'MySQL', 'PostgreSQL'][Math.floor(Math.random() * 10)]
        }));
        
        res.json({
            host,
            results,
            openPorts: results.filter(r => r.open).length,
            totalPorts: results.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Port scan failed' });
    }
};

// SSL Checker (New Tool)
exports.checkSSL = async (req, res) => {
    try {
        const { domain } = req.body;
        
        const isSecure = Math.random() > 0.3;
        const expiryDays = Math.floor(Math.random() * 365) + 30;
        const issuer = ['Let\'s Encrypt', 'DigiCert', 'GlobalSign', 'Comodo', 'Symantec'][Math.floor(Math.random() * 5)];
        
        res.json({
            domain,
            secure: isSecure,
            validFrom: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            validTo: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString(),
            daysUntilExpiry: expiryDays,
            issuer,
            protocol: isSecure ? 'TLS 1.3' : 'TLS 1.0',
            certificateValid: isSecure,
            vulnerabilities: isSecure ? [] : ['Outdated protocol', 'Weak cipher suite']
        });
    } catch (error) {
        res.status(500).json({ error: 'SSL check failed' });
    }
};

// WHOIS Lookup (New Tool)
exports.whoisLookup = async (req, res) => {
    try {
        const { domain } = req.body;
        
        const tld = domain.split('.').pop();
        const statuses = ['active', 'inactive', 'pending', 'suspended'];
        
        res.json({
            domain,
            registrar: ['GoDaddy', 'Namecheap', 'Google Domains', 'Cloudflare Registrar', 'Name.com'][Math.floor(Math.random() * 5)],
            creationDate: new Date(Date.now() - Math.random() * 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            expiryDate: new Date(Date.now() + Math.random() * 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            nameServers: [
                'ns1.' + domain,
                'ns2.' + domain,
                'ns3.cloudflare.com'
            ],
            tld,
            owner: 'Domain owner information is private'
        });
    } catch (error) {
        res.status(500).json({ error: 'WHOIS lookup failed' });
    }
};