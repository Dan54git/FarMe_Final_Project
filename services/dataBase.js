/* Imports */
var mongoose = require("mongoose");

/* Global variables */
var dataBaseURL = !process.env.PORT
    ? 'mongodb://localhost:27017/farmMe'
    : `mongodb+srv://${process.env.USER_NAME_DB}:${process.env.PASS_DB}@cluster0.prioe.mongodb.net/farMe?retryWrites=true&w=majority`;


module.exports = {
    connectionToDb,
};

function connectionToDb() {

    mongoose.connect(dataBaseURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    const dbConnection = mongoose.connection;

    dbConnection.on('error', (err) => {
        console.error("Cannot Connect to DB\n", err);
    });

    dbConnection.once('connected', () => {
        console.info("DB is connected\n");
    });
}
