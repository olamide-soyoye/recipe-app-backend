const { body } = require('express-validator');

exports.validateRecipe = [
    body('title').isString().notEmpty(),
    body('instructions').isString().notEmpty(),
    body('ingredients').isArray().notEmpty(),
    body('image').optional().custom(value => {
        if (value === null || typeof value === 'string') {
            return true;
        }
        throw new Error('Image must be a string or null');
    }),
];
