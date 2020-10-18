const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const Doctor = require('../models/doctors')
const Patient = require('../models/patients');
const Appointment = require('../models/appointment');
const { render } = require('ejs');

// Register Route 
router.get('/register', (req,res) => res.render('Register'))
// Login Route
router.get('/login', (req, res) => res.render('Login'));
// Dashboard - Displaying All Doctors Route
router.get('/dashboard', async (req, res) =>{
  let searchOptions = {}
  if (req.query.dname != null && req.query.dname !== '') {
    searchOptions.dname = new RegExp(req.query.dname, 'i')
  }
  try{
    const doctors = await Doctor.find(searchOptions)
    res.render('Dashboard', {
      doctors: doctors,
    searchOptions: req.query})
  } catch {
    res.redirect('/dashboard')
  }
 })
//New Appointment Route 
// router.get('/newappointment', (req, res) => res.render('newappointment'));

// New Appointment Route
// router.get('/newappointment', async(req, res) => {
  // let searchOptions = {}
  // if (req.query.dname != null && req.query.dname !== '') {
    // searchOptions.dname = new RegExp(req.query.dname, 'i')
  // }
  // try{
    // const doctors = await Doctor.find(searchOptions)
    // res.render('newappointment', {
      // doctors: doctors,
    // searchOptions: req.query})
  // } catch {
    // res.redirect('/newappointment')
  // }
//  })
  // res.render('newappointment', { appointment: new Appointment() })
// })

router.get('/newappointment', async (req, res) =>{
  let searchOptions = {}
  if (req.query.dname != null && req.query.dname !== '') {
    searchOptions.dname = new RegExp(req.query.dname, 'i')
  }
  try{
    const doctors = await Doctor.find(searchOptions)
    res.render('newappointment', {
      doctors: doctors,
      appointment: appointment,
    searchOptions: req.query})
  } catch {
    res.redirect('/newappointment')
  }
 })

// Create Appointment Route
router.post('/allappointment', async (req, res) => {
  const appointment = new Appointment({
    date: req.body.date
  })
  try {
    const newAppointment = await appointment.save()
    // res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`dashboard`)
  } catch {
    res.render('newappointment', {
      appointment: appointment,
      doctors:doctors,
      errorMessage: 'Error creating Appointment'
    })
  }
})


//My Appointments Route 
// Displaying all appointments
router.get('/allappointment', async (req, res) =>{
  let searchOptions = {}
  if (req.query.date != null && req.query.date !== '') {
    searchOptions.date = new RegExp(req.query.date, 'i')
  }
  try{
    const appointment = await Appointment.find({})
    res.render('AllAppointment', {appointment: appointment})
  } catch {
    res.redirect('/allappointment')
  }
 })

//  get?
router.get('/:id', (req, res) => {
  res.send('View Booking' + req.params.id)
})
// delete booking
router.delete('/:id', (req, res) => {
  res.send('Delete Booking' + req.params.id)
})
// edit booking
router.get('/:id/edit', async(req, res) => {
  try{ 
    const appointment = await Appointment.findById(req.params.id)
    res.render('edit', {appointment: appointment})
  }
  catch {
    res.redirect('/dashboard')
  }
})
// update booking 
router.put('/:id', async(req, res) =>{
  let appointment
  try {
    appointment = await Appointment.findById(req.params.id)
    appointment.date =
    await appointment.save()
    res.redirect('dashboard')
  }
  catch{
    res/render('edit',{
      appointment: appointment,
    })
  }
})
  // res.send('Update Booking' + req.params.id)
// } )


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

// storing data on appointments 

router.post('/newappointment', (req, res) => {
  const { date, time, reason, emergency} = req.body;
  let errors = [];

  if (!date|| !time || !reason || !emergency) {
    errors.push({ msg: 'Please enter all fields' });
      } else {
        const newAppointment = new Appointment({
          date,
          time,
          reason,
          emergency 
        });
        newAppointment.save()
        .then (appointment => {
          req.flash('success_msg', 'You have made an appointment')  
                  res.redirect('/patients/dashboard');
                })
                .catch(err => console.log(err));
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

