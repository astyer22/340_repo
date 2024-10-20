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

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, addNewClassification 
};
