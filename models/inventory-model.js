// models/inventory-model.js

const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
            JOIN public.classification AS c 
            ON i.classification_id = c.classification_id 
            WHERE i.classification_id = $1`,
            [classification_id]
        );
        return data.rows;
    } catch (error) {
        console.error("getInventoryByClassificationId error: " + error);
    }
}

/* ***************************
 *  Get a specific vehicle by its ID
 * ************************** */
async function getInventoryById(invId) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = $1`,
            [invId]
        );
        return data.rows[0]; // Return the single vehicle object
    } catch (error) {
        console.error("getInventoryById error: " + error);
    }
}

/* ***************************
 *  Add a new classification to the database
 * ************************** */
async function addNewClassification(classification_name) {
    try {
        const result = await pool.query(
            `INSERT INTO public.classification (classification_name) 
            VALUES ($1) RETURNING *`,
            [classification_name]
        );
        return result.rowCount > 0; 
    } catch (error) {
        console.error("addNewClassification error: " + error);
        throw error; 
    }
}

/* ***************************
 *  Add a new inventory item to the database
 * ************************** */
async function addInventoryItem({
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
}) {
    try {
        const sql = `
            INSERT INTO public.inventory 
            (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *;
        `;
        const result = await pool.query(sql, [
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
        ]);
        return result.rows[0]; // Return the newly added inventory item
    } catch (error) {
        console.error("addInventoryItem error: " + error);
        throw error;
    }
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
  ) {
    try {
      const sql =
        "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
      const data = await pool.query(sql, [
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
        inv_id
      ])
      return data.rows[0]
    } catch (error) {
      console.error("model error: " + error)
    }
  }

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventory(inv_id) {
    // This function carries out a deletion of the inventory item
    try {
        // SQL statement to delete an inventory item based on its inv_id
        const sql = 'DELETE FROM inventory WHERE inv_id = $1'; 
        const result = await pool.query(sql, [inv_id]); 
        return result.rowCount; 
    } catch (error) {
        console.error("Model error: " + error);
        return 0; // Return 0 for any error that occurs during the deletion process
    }
}



module.exports = { 
    getClassifications, 
    getInventoryByClassificationId, 
    getInventoryById, 
    addNewClassification,
    addInventoryItem,
    updateInventory,
    deleteInventory
};