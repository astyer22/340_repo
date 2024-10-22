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
    '/login',
    utilities.handleErrors(accountController.buildLogin) 
  );
// Route: GET /account/register
router.get(
    '/register',
    utilities.handleErrors(accountController.buildRegister) 
  );
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
)

// Process the login attempt
router.post(
  "/login",
  accountController.accountLogin
)

module.exports = router;
