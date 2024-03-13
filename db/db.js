const mongoose = require('mongoose');

const dbConnection = async() => {
    await mongoose.connect(process.env.DB)
        .then(() => console.log("database connection succesfully".bgBlue))
        .catch((error) => console.log(`error in mongoconnection ${error}`))
}
module.exports = dbConnection;