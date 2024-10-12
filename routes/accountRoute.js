const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController.js');
const utilities = require('../utilities/index.js'); 
const regValidate = require('../utilities/account-validation')


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
  )

module.exports = router;