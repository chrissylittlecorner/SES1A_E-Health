const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const Patient = require('../models/patients');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      Patient.findOne({
        email: email
      }).then(patient => {
        if (!patient) {
          return done(null, false, { message: 'That email is not registered' });
        }

        bcrypt.compare(password, patient.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, patient);
          } else {
            return done(null, false, { message: 'Password is incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(patient, done) {
    done(null, patient.id);
  });

  passport.deserializeUser(function(id, done) {
    Patient.findById(id, function(err, patient) {
      done(err, patient);
    });
  });
  

};