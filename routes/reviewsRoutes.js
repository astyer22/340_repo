// routes/reviewsRoutes.js

const express = require('express');
const router = express.Router();
const customerReviewsController = require('../controllers/reviewsController');
const utilities = require('../utilities/index.js');

// GET reviews
router.get('/reviews', utilities.handleErrors(customerReviewsController.buildCustomerReviews));

// POST to submit a customer review and redirect to confirmation
router.post('/confirmation', utilities.handleErrors(customerReviewsController.postCustomerReview));

// GET confirmation page
router.get('/confirmation', utilities.handleErrors(customerReviewsController.buildCustomerReviewConfirmation));

module.exports = router;
