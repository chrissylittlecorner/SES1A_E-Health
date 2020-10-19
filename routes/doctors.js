const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const Doctor = require('../models/doctors');

router.get('/doctorregister', (req, res) => res.render('Doctorregister'));

router.get('/doctorlogin', (req, res) => res.render('Doctorlogin'));

module.exports = router;


router.post('/doctorregister', (req, res) => {
    const { dname, dqualification, dlocation, dpractice, demail, dmobileno, dpassword, dpassword2 } = req.body;
    let errors = [];
  
    if (!dname|| !dqualification || !dlocation || !dpractice || !demail || !dmobileno  || !dpassword || !dpassword2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (dpassword != dpassword2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (dpassword.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('doctorregister', {
        errors,
        dname, 
        dqualification, 
        dlocation, 
        dpractice,
        demail, 
        dmobileno, 
        dpassword, 
        dpassword2
      });
    } else {
        Doctor.findOne({ demail: demail }).then(doctor => {
        if (doctor) {
          errors.push({ msg: 'Email already exists' });
          res.render('register', {
            errors,
            dname, 
            dqualification, 
            dlocation, 
            dpractice,
            demail, 
            dmobileno, 
            dpassword, 
            dpassword2
          });
        } else {
          const newDoctor = new Doctor({
            dname, 
            dqualification, 
            dlocation, 
            dpractice,
            demail, 
            dmobileno, 
            dpassword,
          });
  
         //hashing password in the database
         bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newDoctor.dpassword, salt, (err, hash) => {
              if (err) throw err;
              newDoctor.dpassword = hash;
              newDoctor.save()
                .then(doctor => {
                  req.flash('success_msg', 'You are now registered and can log in')  
                  res.redirect('/doctors/doctorlogin');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
});
 
router.post('/doctorlogin', (req,res, next) => {
  passport.authenticate('local', {
    successRedirect: '/doctordashboard',
    failureRedirect: '/doctors/doctorlogin',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('You are logged out');
  res.redirect('/doctors/doctorlogin');
});