const mongoose = require('mongoose');

const dbConnection = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_CNN, {});
        console.log('Database connected successfully');
    }catch(e){
        throw new Error('Error trying to connect to the database', e);
    }
};

module.exports = {
    dbConnection
}