const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  dname: {
    type: String,
    required: true
  },
  dqualification: {
    type: String,
    required: true
  },
  dlocation: {
    type: String,
    required: true
  },
  dpractice:{
    type: String, 
    required : true
  },
  demail: {
    type: String,
    required: true
  },
  dmobileno:{
    type: String, 
    required: true
  },
  dpassword: {
    type: String,
    required: true
  },
  ddate: {
    type: Date,
    default: Date.now
  }
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

module.exports = Doctor;