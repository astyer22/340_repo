const pool = require('../database/index.js');

// Function to get all customer reviews from the database
async function getReviews() {
  try {
    const result = await pool.query("SELECT customer_name, rating, review_text, review_title FROM customer_reviews");
    return result.rows;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

// Optional: Function to add a review to the database
async function addReview(customer_name, rating, review_text, review_title) {
  const sql = `INSERT INTO customer_reviews (customer_name, rating, review_text, review_title) VALUES ($1, $2, $3, $4) RETURNING *`;
  try {
    const result = await pool.query(sql, [customer_name, rating, review_text, review_title]);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}

module.exports = {
  getReviews,
  addReview,
};
