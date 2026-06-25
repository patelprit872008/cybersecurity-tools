const fs = require('fs');
const path = require('path');

const reportsFile = path.join(__dirname, '../data/reports.json');

const readReports = () => {
    try {
        const data = fs.readFileSync(reportsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeReports = (reports) => {
    fs.writeFileSync(reportsFile, JSON.stringify(reports, null, 2));
};

exports.getReports = async (req, res) => {
    try {
        const reports = readReports();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};

exports.createReport = async (req, res) => {
    try {
        const { title, type, severity, description, status } = req.body;
        const reports = readReports();
        
        const newReport = {
            id: Date.now(),
            title,
            type,
            severity: severity || 'Medium',
            description,
            status: status || 'Open',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        reports.push(newReport);
        writeReports(reports);
        
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create report' });
    }
};

exports.updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, severity, description, status } = req.body;
        const reports = readReports();
        
        const index = reports.findIndex(r => r.id == id);
        if (index === -1) {
            return res.status(404).json({ error: 'Report not found' });
        }
        
        reports[index] = {
            ...reports[index],
            title: title || reports[index].title,
            type: type || reports[index].type,
            severity: severity || reports[index].severity,
            description: description || reports[index].description,
            status: status || reports[index].status,
            updatedAt: new Date().toISOString()
        };
        
        writeReports(reports);
        res.json(reports[index]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update report' });
    }
};

exports.deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const reports = readReports();
        
        const filtered = reports.filter(r => r.id != id);
        if (filtered.length === reports.length) {
            return res.status(404).json({ error: 'Report not found' });
        }
        
        writeReports(filtered);
        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete report' });
    }
};