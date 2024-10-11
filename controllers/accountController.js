// AccountController.js
const utilities = require("../utilities/index.js")




/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    console.log("Rendering login page"); // Check if this controller function is being called
    res.render("account/login", {
        title: "Login",
        nav,
    });
}

  
  module.exports = { buildLogin }