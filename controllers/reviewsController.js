// controllers/reviewsController.js

const utilities = require('../utilities/index.js');
const customerReviews = require('../models/reviews-model.js');

const reviews = {};

// Build the customer reviews page
reviews.buildCustomerReviews = async function (req, res, next) {
    let nav = await utilities.getNav(); 
    const title = 'Customer Reviews'; 
    const fetchedReviews = await customerReviews.getReviews(); 

    // Shuffle the reviews and pick 5 random items
    const shuffledReviews = fetchedReviews.sort(() => 0.5 - Math.random());
    const selectedReviews = shuffledReviews.slice(0, 5);

    // Render the reviews page with the selected random reviews
    res.render('./customer/reviews', { 
        title, 
        nav, 
        reviews: selectedReviews,  // Pass selected reviews to the view
        errors: null 
    });
};

// Post a customer review
reviews.postCustomerReview = async function (req, res, next) {
    const { customer_name, rating, review_text, review_title } = req.body;
    customerReviews.addReview(customer_name, rating, review_text, review_title); 
    res.redirect('/customer/confirmation'); 
};

// Get the customer review-confirmation page
reviews.buildCustomerReviewConfirmation = async function (req, res, next) {
    let nav = await utilities.getNav(); 
    const title = 'Review Submission Confirmation'; 

    // Render the review-confirmation page
    res.render('customer/confirmation', { 
        title, 
        nav, 
        errors: null 
    });
};

// Module export
module.exports = reviews;
