// controllers/reviewsController.js
const utilities = require('../utilities/index.js');
const customerReviews = require('../models/reviews.js');

const reviews = {};

// Build the customer reviews page
reviews.buildCustomerReviews = async function (req, res, next) {
    let nav = await utilities.getNav(); 
    const title = 'Customer Reviews'; 
    const fetchedReviews = await customerReviews.getReviews(); 

    // Render the reviews page with the relevant data
    res.render('customer/reviews', { 
        title, 
        nav, 
        reviews: fetchedReviews, 
        errors: null 
    });
};

// Post a customer review
reviews.postCustomerReview = async function (req, res, next) {
    const { customer_name, rating, review_text, review_title } = req.body;
    customerReviews.addReview(customer_name, rating, review_text, review_title); 
    res.redirect('customer/review-confirmation'); 
};

// Get the customer  review-confirmation page
reviews.getCustomerReviewConfirmation = async function (req, res, next) {
    let nav = await utilities.getNav(); 
    const title = 'Review Submission review-confirmation'; 

    // Render the review-confirmation page
    res.render('customer/review-confirmation', { 
        title, 
        nav, 
        errors: null 
    });
};

// Module export
module.exports = reviews;
