const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController.js');

// Define the GET route for "Login" page with error handling
router.get("/login", (req, res, next) => {
    console.log("GET request to /account/login"); // Check if this route is hit
    accountController.buildLogin(req, res, next); // Call the controller function
});

module.exports = router;
