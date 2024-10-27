// AccountController.js
const utilities = require("../utilities/index.js")
const accountModel = require("../models/account-model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }
  
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body


  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  console.log("Rendering login page"); 
  res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
  });
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  
  // Check if account exists
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: [{ msg: "Invalid email or password" }], // Format errors as an array
      account_email,
    });
  }

  try {
    // Check password
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      // Store user info in session
      req.session.user = {
        id: accountData.id,
        username: accountData.username, // Adjust if your property is named differently
      };

      // Remove password from accountData
      delete accountData.account_password;

      // Optional: Store additional user data in session if needed
      req.session.accountData = accountData; // Store full account data if necessary

      // Generate JWT
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

      // Redirect to account page
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: [{ msg: "Invalid email or password" }], // Format errors as an array
        account_email,
      });
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Access Forbidden");
    return res.status(500).render("errors/error", {
      title: "Error",
      message: "An unexpected error occurred.",
      nav,
    });
  }
}


async function buildManagement(req, res, next) {
  try {
    let nav = await utilities.getNav();

    // Ensure accountData is available in the session
    const accountData = req.session.accountData;

    // Log the session data to ensure it exists
    console.log("Session Account Data:", accountData);

    if (!accountData) {
      console.log("No account data found in session");
      return res.redirect("/account/login");
    }

    // Extract the account_id from the session data
    const { account_id } = accountData;

    // Pass account_id and other session data to the view
    res.render("account/management", {
      title: "Your Account",
      nav,
      account_id,  // Explicitly pass this to the template
      accountData, // If you want to use the whole object
      errors: null,
    });
  } catch (error) {
    console.error("Error building management view:", error);
    next(error);
  }
}


/* ***************************
  * Build Logout View
  * ************************** */
async function buildLogout(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/logout", { 
      title: "Logged Out",
      nav,
      errors: null,
  });
};

async function buildAccountUpdateView(req, res, next) {
  const { id } = req.params; 
  try {
    const account = await accountModel.findById(id);
    if (!account) {
      req.flash('error', 'Account not found.');
      return res.redirect('/account/management');
    }

    let nav = await utilities.getNav();
  
    console.log("Account Data:", account);
    res.render('account/account-update', {
      title: 'Update Account',
      nav,
      errors: null,
      account, 
    });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).render('errors/error', {
      title: 'Error',
      message: 'An unexpected error occurred.',
    });
  }
}

// Function to handle account update
const handleAccountUpdate = async (req, res) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  try {
    // Update account information
    await Account.updateAccount(account_id, account_firstname, account_lastname, account_email);
    req.flash('success', 'Account updated successfully.');
    return res.redirect('/account/management'); // Redirect to management view
  } catch (error) {
    console.error(error);
    req.flash('error', 'There was an error updating your account.');
    return res.redirect(`/account/account-update/${account_id}`);
  }
};

// Function to handle password change
const handlePasswordChange = async (req, res) => {
  const { account_id, new_password } = req.body;

  try {
    // Hash the new password
    const hashedPassword = await hashPassword(new_password); // Implement hashPassword accordingly
    await Account.updatePassword(account_id, hashedPassword);
    req.flash('success', 'Password changed successfully.');
    return res.redirect('/account/management'); // Redirect to management view
  } catch (error) {
    console.error(error);
    req.flash('error', 'There was an error changing your password.');
    return res.redirect(`/account/account-update/${account_id}`);
  }
};

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagement,
  buildLogout,
  buildAccountUpdateView,
  handleAccountUpdate,
  handlePasswordChange
};