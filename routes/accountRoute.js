const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController.js');
const utilities = require('../utilities/index.js'); // Assuming this is your utilities handler
const regValidate = require('../utilities/account-validation')


// Define the GET route for "Login" page
router.get("/login", (req, res, next) => {
    console.log("GET request to /account/login"); 
    accountController.buildLogin(req, res, next);
});

// Define the GET route for "Register" page
router.get("/register", (req, res, next) => {
    console.log("GET request to /account/register");
    accountController.buildRegister(req, res, next);
});

// Define the POST route for handling the registration form submission
router.post('/register', async (req, res, next) => {
    try {
        await accountController.registerAccount(req, res, next);
    } catch (error) {
        // Handle the error here
        console.error(error); // Log the error for debugging
        res.status(500).send('Internal Server Error'); // Send a generic error response
    }
});

module.exports = router;
