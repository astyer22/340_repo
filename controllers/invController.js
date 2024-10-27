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
  const inv_id = req.params.invId;
  const vehicle = await invModel.getInventoryById(inv_id);
  
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


/* ***************************
  *  Build inventory management view
  * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav(); // Fetch navigation data
    const classificationSelect = await utilities.buildClassificationList(); // Get the classification dropdown HTML

    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect, // Pass the generated dropdown HTML
      errors: null,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    next(error);
  }
};

/* ***************************
  *  Get vehicles by classification
  * ************************** */
invCont.getVehiclesByClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav(); // Fetch navigation data
    const classificationId = req.body.classification_id; // Get the selected classification ID
    const vehicles = await utilities.getVehiclesByClassification(classificationId); // Fetch vehicles by classification

    res.render("inventory/vehicles", {
      title: "Vehicles in Classification",
      nav,
      vehicles, // Pass the vehicles to the view
      classificationId,
      errors: null,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    next(error);
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildUpdateView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/update", {
    title: "Edit " + itemName,
    nav,
    classifications: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/update", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}





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

/* ********************
  Add a new inventory item
************************** */
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


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  // const classifications = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/delete-confirm", {
      title: `Confirm Delete ${itemName}`,
      nav,
      // classifications,
      errors: null, 
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
      classification_id: itemData.classification_id
    });
};



/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventoryData = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventory(inv_id);
  if (deleteResult) {
    req.flash("notice", "The vehicle was successfully deleted.");
    res.redirect("/inv/management");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete Confirmation",
      nav,
      errors: null,
      inv_id,
    });
  }
};





module.exports = invCont;


