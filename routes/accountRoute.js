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
  router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.redirect('/account/login'); // Redirect to login if there's an error
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.redirect('/account/login'); // Redirect to the login page
    });
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
