const mongoose = require('mongoose'); //we import the mongose so it lets us talk to the mongodb database

const connectDB = async ()=>{
    //creating the connectDB function and using async function so it will do the thing that takes time like connecting to the internet
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    }
    catch(err){
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB; //we export the connectDB function so we can use it in other files like index.js