const mongoose = require('mongoose');
console.log("mongo url",process.env.MONGO_URL);
const connectDB = async (dbname) => {
    try {
        let conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.table({
            mongoDB: 'connected',
            host: conn.connection.host,
            name: conn.connection.name,
        });
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = connectDB;

// ${process.env.MONGO_URL}/${dbname}