const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');

// mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log(`Connected to MongoDB: ${mongoose.connection.host}`))
// .catch((err) => console.error('MongoDB connection error:', err));
module.exports = mongoose.connection;
