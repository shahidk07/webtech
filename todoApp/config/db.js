const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use the connection URI from the .env file
        await mongoose.connect(process.env.atlasuri);
        console.log('atlas db connected');
    } catch (err) {
        console.error(`ERROR RELATED TO MONGO DB FOUND: ${err.message}`);
        
        // Exit process with failure code if database connection fails
        process.exit(1); 
    }
};

module.exports = connectDB;