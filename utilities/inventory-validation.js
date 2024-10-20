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


module.exports = validate;