const mongoose = require('mongoose');
require('dotenv').config();

exports.dbConnect = async function() {
    const DATABASE_URL = process.env.DATABASE_URL;

    try {
        await mongoose.connect(DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // eslint-disable-next-line no-console
        console.log('MongoDB connected...');
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};
