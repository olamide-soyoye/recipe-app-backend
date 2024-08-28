const fetchRecipes = jest.fn();

fetchRecipes.mockImplementation(async (page = 1, limit = 10) => {
    return {
        data: [
            {
                _id: '66cf0e9469b73096feaf5766',
                title: 'Grilled Basil Chicken',
                ingredients: [
                    '2 tbsp olive oil',
                    '1 garlic clove, minced'
                ],
                instructions: 'Place chicken breasts in a shallow dish; orange quote icon do not rinse raw poultry. Cover with marinade. Cover dish. Refrigerate about 1 hour, turning occasionally. orange quote icon Wash dish after touching raw poultry.',
                image: 'https://res.cloudinary.com/tamss/image/upload/v1724742638/txq5xvyaazbhqlrg1esd.jpg'
            }
        ],
        pagination: {
            page,
            limit,
            total: 1,
            totalPages: 1
        }
    };
});

module.exports = fetchRecipes;
