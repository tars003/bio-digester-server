const mongoose = require('mongoose');

const connectDB = () => {
    let dbUrl = process.env.DB_URL;
    console.log('dbUrl : ', dbUrl);
    mongoose
        .connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("db connected"))
        .catch((err) => console.log(err));
}

module.exports = connectDB;