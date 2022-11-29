const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_DB_URL

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log('connected to mongo successfully!');
    })
}

module.exports = connectToMongo;