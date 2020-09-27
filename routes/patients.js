const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const Patient = require('../models/patients');
// Register Route 
router.get('/register', (req, res) => res.render('Register'));
// Login Route
router.get('/login', (req, res) => res.render('Login'));
// Dashboard
router.get('/dashboard', (req, res) => res.render('dashboard'));

// Displaying All Doctors 

// New Booking (search bar button?)


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
        Patient.findOne({ email: email }).then(patient => {
        if (patient) {
          errors.push({ msg: 'Email already exists' });
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
          const newPatient = new Patient({
            name,
            mdcno,
            mobileno, 
            email,
            password  
          });
  
         //hashing password in the database
         bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newPatient.password, salt, (err, hash) => {
              if (err) throw err;
              newPatient.password = hash;
              newPatient.save()
                .then(patient => {
                  req.flash('success_msg', 'You are now registered and can log in')  
                  res.redirect('/patients/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
});
 
router.post('/login', (req,res, next) => {
  passport.authenticate('local', {
    successRedirect: '/patients/dashboard',
    failureRedirect: '/patients/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('You are logged out');
  res.redirect('/patients/login');
});