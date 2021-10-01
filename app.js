const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const route = require('./routes/routes');
const cookieParser = require('cookie-parser');

//App
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());


//config public or statics files
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

//routes
app.use(route);

//load database
mongoose.connect('mongodb://localhost:27017/Login-Api',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

//Server runinng on
app.listen(3080, () => {
  console.log('Server running on port 3080');
});
