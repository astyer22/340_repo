// routes/reviewsRoutes.js

const express = require('express');
const router = express.Router();
const customerReviewsController = require('../controllers/reviewsController');
const utilities = require('../utilities/index.js');

// GET reviews
router.get('/reviews', utilities.handleErrors(customerReviewsController.buildCustomerReviews));

// Post a customer review
router.post('/reviews', utilities.handleErrors(customerReviewsController.postCustomerReview));

// GET review-confirmation page
router.get('/reviews/review-confirmation', utilities.handleErrors(customerReviewsController.getCustomerReviewConfirmation));

module.exports = router;
