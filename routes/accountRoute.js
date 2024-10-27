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
  // / Logout route
  router.get("/logout", (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error(err); // Log any error that occurs
        return res.status(500).send("Could not log out. Please try again later.");
      }
  
      // Clear the JWT cookie
      res.clearCookie("jwt");
  
      // Set a flash message using connect-flash
      req.flash('success', 'You have been logged out successfully.');
  
      // Redirect to the logout confirmation page
      res.redirect("/logout-confirmation");
    });
  });
  
  // Route for logout confirmation
  router.get('/logout-confirmation', (req, res) => {
    const title = 'Logout Confirmation';
    const messages = req.flash('success'); // Retrieve flash messages
    const errors = []; // You can adjust this if you have validation errors
    res.render('logout', { title, messages, errors }); // Render your logout page
  });

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




// Route for updating account information
router.post('/account-update', accountController.handleAccountUpdate);
// Route for changing password
router.post('/account-update/change-password', accountController. handlePasswordChange);



module.exports = router;
