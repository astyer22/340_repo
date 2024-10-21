// invController.js

const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);

  if (!data || data.length === 0) {
    // If no data found, handle the error gracefully
    return res.status(404).render("inventory/classification", {
      title: "No Vehicles Found",
      nav: await utilities.getNav(),
      grid: "<p>No vehicles available for this classification.</p>",
    });
  }

  const grid = await utilities.buildClassificationGrid(data);
  const nav = await utilities.getNav();
  const className = data[0].classification_name;

  res.render("inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
  });
};

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

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Vehicle Management",
    
    nav,
    errors: null,
  });
};

invCont.buildNewClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", { 
      title: "Add New Classification",
      nav,
      errors: null,
  });
};

invCont.buildNewInventoryView = async function (req, res, next) {
  try {
    const classifications = await invModel.getClassifications();
    let nav = await utilities.getNav();

    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classifications: classifications.rows,
      classification_id: null, 
      inv_make: '',  
      inv_model: '',
      inv_year: '',
      inv_description: '',
      inv_image: '',
      inv_thumbnail: '',
      inv_price: '',
      inv_miles: '',
      inv_color: '',
      errors: null,
    });
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

invCont.addNewClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  try {
      // Attempt to add the new classification
      const result = await invModel.addNewClassification(classification_name);
          if (result) {
          // If successful, redirect to the inventory management page
          req.flash('success', 'Classification added successfully!'); 
          res.redirect("/inv/management");
      } else {
          // If the result is false, there was an issue with the operation
          req.flash('error', 'Failed to add classification.'); 
          return res.render('/', {
              title: 'Add Classification',
              errors: [{ msg: 'Failed to add classification. Please try again.' }] 
          });
      }
  } catch (error) {
      // Catch any unexpected errors
      next({ status: 500, message: error.message || "Internal server error." });
  }
};

invCont.addNewInventory = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image = 'path/to/no-image.png', // Default path for no image
    inv_thumbnail = 'path/to/no-image-tn.png', // Default path for thumbnail
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  try {
    const result = await invModel.addInventoryItem({
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      });

      if (result) {
        req.flash('success', 'Vehicle added successfully!');
        res.redirect("/inv/management");
      } else {
        req.flash('error', 'Failed to add vehicle.');
        return res.render('inventory/add-inventory', {
          title: 'Add Vehicle',
          nav: await utilities.getNav(),
          classifications: await invModel.getClassifications(),
          classification_id: null,
          inv_make: '',
          inv_model: '',
          inv_year: '',
          inv_description: '',
          inv_image: '',
          inv_thumbnail: '',
          inv_price: '',
          inv_miles: '',
          inv_color: '',
          errors: [{ msg: 'Failed to add vehicle. Please try again.' }],
          });
      }
  } catch (error) {
      next({ status: 500, message: error.message || "Internal server error." });
  }
};



module.exports = invCont;


