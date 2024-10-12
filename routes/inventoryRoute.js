// routes/inventoryRoute.js

// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Add the new route for vehicle detail view
router.get("/detail/:invId", invController.buildByInventoryId);
// Route to trigger an intentional error
router.get("/error/trigger-error", invController.triggerError);


module.exports = router;