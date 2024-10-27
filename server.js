/* ****************************************** Server.js File Description ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Sessions
 *************************/
const session = require("express-session");
const pool = require('./database/');
const jwt = require("jsonwebtoken"); // Add this line

/* ***********************
 * Require Statements
 *************************/
const cookieParser = require("cookie-parser");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/index");
const accountRoute = require("./routes/accountRoute"); 
const bodyParser = require("body-parser");

/* ***********************
 * Middleware
 ************************/
app.use(cookieParser()); // Ensure this is first

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

/// JWT Token Validation Middleware
app.use((req, res, next) => {
  const token = req.cookies.jwt; // Check for the JWT token
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        req.userLoggedIn = false; // Token is invalid
      } else {
        req.userLoggedIn = true; // Token is valid
        req.accountData = decoded; // Store decoded data for later use
        
        // Store account type in locals for access control
        res.locals.account_type = decoded.account_type; // Assuming account_type is a field in your JWT
      }
      // Store the login status in res.locals for rendering in templates
      res.locals.userLoggedIn = req.userLoggedIn;
      next(); // Call next middleware or route handler
    });
  } else {
    req.userLoggedIn = false; // No token, user is not logged in
    res.locals.userLoggedIn = req.userLoggedIn; // Store login status
    next(); // Call next middleware or route handler
  }
});

// Account Type Verification Middleware
function checkAdmin(req, res, next) {
  if (req.userLoggedIn && (res.locals.account_type === 'Employee' || res.locals.account_type === 'Admin')) {
    next(); // User is authorized
  } else {
    req.flash('notice', 'You do not have permission to access this area.'); // Flash message for unauthorized access
    res.redirect('/account/login'); // Redirect to login page or any other page
  }
}

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.use(flash()); // Enable flash messages

// Middleware to make flash messages available in your views
app.use((req, res, next) => {
  res.locals.messages = req.flash('success');
  res.locals.errors = req.flash('error'); // If you are also handling errors
  next();
});

// Example route using the admin check middleware
app.use('/inventory', checkAdmin, inventoryRoute); // Apply the middleware to the inventory route

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// User Authentication Middleware
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;  // Store user info in locals
  res.locals.authenticated = !!req.session.user;  // Boolean flag for login status
  next();
});

/* ***********************
 * View Engine and Templates
 ************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));
// Inventory Route
app.use("/inv", inventoryRoute);
// Account Route
app.use("/account", accountRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Page not Found: Oops! Looks like Bigfoot took this page on a little adventure. But don’t worry, we’re on the hunt to bring it back!' });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav(); 
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
