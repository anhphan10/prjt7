const mongoose = require("mongoose");
module.exports.connect = async ()=>{
    try{
       console.log("MongoDB Connecting...");
       await mongoose.connect(process.env.MONGO_ULR);
       console.log("MongoDB Connect succsess");
    }
    catch(error){
        console.log("MongoDB Connect Error", error);
        // TODO retry connect several times
    }
}


