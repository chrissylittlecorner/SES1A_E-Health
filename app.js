const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');


const app = express();


const db = require('./config/keys').MongoURI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));

app.use('/', require('./routes/index'));
app.use('/patients', require('./routes/patients'));


const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));