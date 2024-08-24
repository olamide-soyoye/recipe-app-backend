const { body, validationResult } = require('express-validator');

exports.checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

exports.validateRecipe = [
    body('title')
        .isString().withMessage('Title must be a string')
        .bail()
        .notEmpty().withMessage('Title is required'),
    body('instructions')
        .isString().withMessage('Instructions must be a string')
        .bail()
        .notEmpty().withMessage('Instructions are required'),
    body('instructions').isString().withMessage('Instructions must be a string').notEmpty().withMessage('Instructions are required'),
    body('ingredients').custom(value => {
        if (typeof value === 'string') {
            try {
                const parsedValue = JSON.parse(value);
                if (Array.isArray(parsedValue) && parsedValue.length > 0) {
                    return true;
                }
                throw new Error('Ingredients must be a non-empty array');
            } catch (e) {
                throw new Error('Ingredients must be a valid JSON array');
            }
        }
        throw new Error('Ingredients must be a string');
    }),
    body('image').optional().custom(value => {
        if (value === 'null' || typeof value === 'string') {
            return true;
        }
        throw new Error('Image must be a string or null');
    }),
];