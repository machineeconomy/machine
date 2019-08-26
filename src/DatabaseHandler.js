//Import the mongoose module
var mongoose = require('mongoose');

const NAME = process.env.NAME


//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/machine-' + NAME.replace(/ /g, "");
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = {
    database: db
}