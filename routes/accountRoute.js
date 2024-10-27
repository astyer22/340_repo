const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController.js');
const utilities = require('../utilities/index.js'); 
const regValidate = require('../utilities/account-validation')

// Route: GET /account/
router.get(
    '/',
    accountController.buildManagement,
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildManagement) 
  );

// Route: GET /account/login
router.get(
    '/login', utilities.handleErrors(accountController.buildLogin) 
  );
// Route: GET /account/register
router.get(
    '/register', utilities.handleErrors(accountController.buildRegister) 
  );
  // Route: GET /account/logout
router.get('/logout', accountController.buildLogout);
// Route: GET /account/account-update/:id
router.get('/account-update/:id', accountController.buildAccountUpdateView);

// Posts
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  );
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(), 
  regValidate.checkLoginData, 
  utilities.handleErrors(accountController.accountLogin) 
);

// Logout route
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err); // Log any error that occurs
      return res.status(500).send("Could not log out. Please try again later.")

    }
    
    // Clear the JWT cookie
    res.clearCookie("jwt");

    // Redirect to the home page or account page
    res.redirect("/"); // Change this if you want to redirect to a specific page after logout
  });
});

// Route for updating account information
router.post('/account-update', accountController.handleAccountUpdate);
// Route for changing password
router.post('/account-update/change-password', accountController. handlePasswordChange);



module.exports = router;
