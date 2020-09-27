const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('Welcome'));
//Patient Dashboard
router.get('/dashboard', (req, res) => res.render('dashboard'));

router.get('/doctordashboard', (req, res) => res.render('doctordashboard'));

module.exports = router;