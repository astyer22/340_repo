// invController.js

const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("inventory/classification", { // Updated here
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view by ID
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const invId = req.params.invId;
  const vehicle = await invModel.getInventoryById(invId);
  
  if (vehicle) {
    const nav = await utilities.getNav();
    const vehicleHTML = utilities.buildVehicleDetailHTML(vehicle);
    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHTML,
    });
  } else {
    next({ status: 404, message: "Vehicle not found." });
  }
};

// Function to trigger a server error
invCont.triggerError = function (req, res, next) {
  // Intentionally throwing an error to trigger the error handling middleware
  throw new Error("This is a deliberate server error for testing purposes.");
};


module.exports = invCont;
