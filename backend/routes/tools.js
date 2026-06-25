const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');

router.post('/threat-analyze', toolController.analyzeThreat);
router.post('/check-password', toolController.checkPassword);
router.post('/scan-url', toolController.scanUrl);
router.post('/hash-generate', toolController.generateHash);
router.post('/port-scan', toolController.scanPorts);
router.post('/ssl-check', toolController.checkSSL);
router.post('/whois-lookup', toolController.whoisLookup);

module.exports = router;