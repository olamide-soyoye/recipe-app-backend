const multer = require('multer');
const { readRecipesFromFile, writeRecipesToFile, recipes } = require('../utils/fileUtils');

// Image upload setup
const upload = multer({ dest: 'images/' });

// Upload an image
exports.uploadImage = (req, res) => {
    const recipeId = parseInt(req.params.id);
    const recipe = recipes.find(r => r.id === recipeId);

    if (recipe) {
        const imageFile = req.file;
        if (imageFile) {
            recipe.image = `/images/${imageFile.filename}`;
            writeRecipesToFile();
            res.json(recipe);
        } else {
            res.status(400).json({ message: 'No image file uploaded' });
        }
    } else {
        res.status(404).json({ message: 'Recipe not found' });
    }
};
