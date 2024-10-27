const pool = require("../database/index.js");

/* *****************************
 *   Register new account
 ***************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES ($1, $2, $3, $4, 'Client') 
      RETURNING *`;
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    return result.rows[0]; // Return the inserted account data
  } catch (error) {
    throw new Error(error.message);
  }
}

/* ************************
 *   Check for existing email
 ************************ */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    throw new Error(error.message);
  }
}

/* *****************************
 *   Return account data using email address
 ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password 
      FROM account 
      WHERE account_email = $1`;
    const result = await pool.query(sql, [account_email]);
    return result.rows[0];
  } catch (error) {
    throw new Error("No matching email found");
  }
}



/* *****************************
 *   Find account by ID
 ***************************** */
async function findById(id) {
  const query = 'SELECT * FROM account WHERE account_id = $1';
  const result = await pool.query(query, [id]);

  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return null;
  }
}

/* *****************************
 *   Find account by email
 ***************************** */
async function findByEmail(email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [email]);
    return result.rows[0]; // Return the first row of the result
  } catch (error) {
    throw new Error("Email not found");
  }
}

/* *****************************
 *   Update account information
 ***************************** */
// Assuming you have a pool set up for database access
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  const query = `
    UPDATE account 
    SET account_firstname = $1, account_lastname = $2, account_email = $3 
    WHERE account_id = $4
  `;
  const values = [account_firstname, account_lastname, account_email, account_id];
  await pool.query(query, values);
}

/* *****************************
 *   Update password
 ***************************** */
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2";
    await pool.query(sql, [hashedPassword, account_id]);
  } catch (error) {
    throw new Error("Failed to update password");
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  findById,
  findByEmail,
  updateAccount,
  updatePassword,
};
