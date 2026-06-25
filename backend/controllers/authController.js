const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory user store (in production, use a database)
const users = [];

const JWT_SECRET = 'cybersecurity-secret-key-2024';

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            id: users.length + 1,
            username,
            password: hashedPassword
        };
        users.push(user);
        
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.verify = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ user: decoded });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};