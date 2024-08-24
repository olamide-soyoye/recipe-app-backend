const fs = require('fs').promises;
const path = require('path');

const recipesFilePath = path.resolve(__dirname, '../data/recipes.json');

const readRecipesFromFile = async () => {
    try {
        const data = await fs.readFile(recipesFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading recipes from file:', err);
        throw new Error('Error reading recipes from file');
    }
};


const writeRecipesToFile = async (recipes) => {
    try {
        await fs.writeFile(recipesFilePath, JSON.stringify(recipes, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing recipes to file:', err);
        throw new Error('Error writing recipes to file');
    }
};

module.exports = { readRecipesFromFile, writeRecipesToFile };
