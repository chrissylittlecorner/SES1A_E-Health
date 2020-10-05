const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  practice:{
    type: String, 
    required : true
  },
  email: {
    type: String,
    required: true
  },
  mobileno:{
    type: String, 
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

module.exports = Doctor;