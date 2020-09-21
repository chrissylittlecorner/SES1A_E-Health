const express = require('express');
const router = express.Router();

const Patient = require('../models/patient');

router.get('/register', (req, res) => res.render('Register'));

router.get('/login', (req, res) => res.render('Login'));

module.exports = router;


router.post('/register', (req, res) => {
    const { name, mdcno, mobileno, email,  password, password2 } = req.body;
    let errors = [];
  
    if (!name|| !mdcno || !mobileno || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        mdcno,
        mobileno, 
        email,
        password,
        password2
      });
    } else {
        res.send('pass');
    }
    });