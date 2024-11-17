const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB 🚀');
    } catch (error) {
        console.error(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
};


module.exports = {
    dbConnection
};