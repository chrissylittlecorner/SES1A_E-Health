const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  doctor: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  emergency: {
    type: Boolean,
    required: true
  }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;