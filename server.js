require('dotenv').config();
const expressSession = require("express-session");
const path = require("path");
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const flash = require('connect-flash');
const hbs = require("hbs");



const mongoDBSession = require("connect-mongodb-session")(expressSession);
const dotenv = require("dotenv").config();

const testRoutes = require('./routes/userRoutes/testRoutes')
const adminAuthRouts = require('./routes/adminRoutes/adminAuthRoutes')
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());

const store = new mongoDBSession({
  uri: process.env.MONGO_URI,
  collection: "userSessions",
});

//MIDDLEWARES.
// app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload());
app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(expressSession({
  secret: "thisSecretKey!",
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2
  },
  resave: false,
  saveUninitialized: false,
  store: store,
}));

// app.use(express.static(path.join(__dirname, "public")));

// app.get("/", async (req, res) => {
//   return res.render("index");
//   // const filePath = path.join(__dirname, "public", "index.html");
//   // return res.sendFile(filePath);
// });

//TEMPLATE ENGINE
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine("html", hbs.__express);
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));
hbs.registerPartials(path.join(__dirname, "views", "partials"));

//register helper for increment
hbs.registerHelper('inc', function (value, options) {
  return parseInt(value) + 1;
});
hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('ifUserExists', function (user, options) {
  return user ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper("DateTime", function (value) {
  return value.toLocaleString();
});

hbs.registerHelper('eq', function(a, b) {
  return a === b;
});

hbs.registerHelper("DateTime2", function (value) {
  if (!value) return '';
  let year = value.getFullYear().toString();
  let month = (value.getMonth() + 1).toString().padStart(2, '0');
  let day = value.getDate().toString().padStart(2, '0');
  let hours = value.getHours().toString().padStart(2, '0');
  let minutes = value.getMinutes().toString().padStart(2, '0');

  let formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
  return formattedDateTime;
});
hbs.registerHelper('eq', function (arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('eql', function (a, b) {
  return a === b;
});


// Register the json helper for Handlebars
hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

app.get("/", async (req, res) => {
  return res.redirect("/auth/login");
});





app.use('/api', testRoutes);

app.use('/auth', adminAuthRouts);





// Connect to MongoDB
const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI)
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((error) => console.error('MongoDB connection error:', error));
  }
  
  connectDB();
  
  app.listen(process.env.PORT || 5002, () => {
    console.log(`Server running on port ${process.env.PORT || 5002}`);
  });