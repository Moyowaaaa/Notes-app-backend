const mongoose = require('mongoose');



const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    console.log(`MongoDB Connected: ${conn.connection.host}`.blue.underline.bold);        
    }
    catch (err){
        console.log(err)
    }
}


module.exports = connectDB;
