// models/reviews.js

const reviews = {};

// Array to hold the customer reviews
let customerReviews = [];

// Get all customer reviews
reviews.getReviews = () => {
  return customerReviews;
};

// Add a customer review
reviews.addReview = (customer_name, rating, review_text, review_title) => {
  customerReviews.push({ customer_name, rating, review_text, review_title });
};

// Get a customer review by ID
reviews.getReview = (id) => {
  return customerReviews[id];
};

// Optional: Function to get a review by title if needed
reviews.getReviewByTitle = (title) => {
  return customerReviews.find(review => review.review_title === title);
};

module.exports = reviews;
