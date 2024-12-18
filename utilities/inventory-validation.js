// inventory-validation.js
const { body} = require("express-validator")
const validate = {}

// Server-side validation rules
validate.classificationRules = () => {
    return [
        // classification_name is required and must be string
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a classification name.")
            .isLength({ min: 1 })
            .withMessage("Classification name cannot be empty.")
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("Classification name must not contain spaces or special characters."),
    ];
};

// Server-side validation rules for adding inventory
validate.addInventoryRules = () => {
    return [
        body("classification_id")
            .notEmpty()
            .withMessage("Please select a classification."),

        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Make is required.")
            .matches(/^[a-zA-Z0-9\s-]+$/)
            .withMessage("Make must contain only letters, numbers, spaces, or dashes."),

        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Model is required.")
            .matches(/^[a-zA-Z0-9\s-]+$/)
            .withMessage("Model must contain only letters, numbers, spaces, or dashes."),

        body("inv_year")
            .notEmpty()
            .withMessage("Year is required.")
            .isNumeric()
            .withMessage("Year must be a number.")
            .isInt({ min: 1900, max: new Date().getFullYear() })
            .withMessage(`Year must be between 1900 and ${new Date().getFullYear()}.`),

        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Description is required."),
    ];
};

module.exports = validate;
