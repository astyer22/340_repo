// routes/inventoryRoute.js

// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const regValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities/index.js");

// GETS
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Add the new route for vehicle detail view
router.get("/detail/:invId", invController.buildByInventoryId);
// Route to trigger an intentional error
router.get("/error/trigger-error", invController.triggerError);
// Route to build inventory management view
router.get("/management", invController.buildManagement);
// Route to render add new classification view
router.get("/add-classification", invController.buildNewClassificationView);

// POSTS
// POST route to handle new classification form submission
router.post(
    "/add-classification",
    regValidate.classificationRules(), // Server-side validation middleware
    utilities.handleErrors(invController.addNewClassification) // Ensure this calls the correct controller
);

module.exports = router;