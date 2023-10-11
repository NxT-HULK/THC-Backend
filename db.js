const { URI } = require('./env')
const mongoose = require('mongoose');

const connecToMongoose = async () => {
    await mongoose.connect(URI).then(() => {
        console.log('Database Connected');
    })
};

module.exports = connecToMongoose;