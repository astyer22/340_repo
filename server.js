/* ****************************************** Server.js File Description ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Sessions
 *************************/
const session = require("express-session")
const pool = require('./database/')

/* ***********************
 * Require Statements
 *************************/
const cookieParser = require("cookie-parser")
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/index");
const accountRoute = require("./routes/accountRoute"); 
const bodyParser = require("body-parser")

/* ***********************
 * Middleware
 * ************************/
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

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
res.locals.messages = require('express-messages')(req, res)
  next()
})

// Body Parser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 
  
// Cookie Parser Middleware
app.use(cookieParser());

// JWT Token Validation Middleware
app.use(utilities.checkJWTToken);  // Added JWT middleware here






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
  next({status: 404, message: 'Page not Found: Oops! Looks like Bigfoot took this page on a little adventure. But don’t worry, we’re on the hunt to bring it back!'})
})

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
