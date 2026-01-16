const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
     },  // passportLocalMongoose will itself add username and password fields
    nationName: { 
        type: String, 
        
    },
    nationCode: { 
        type: String, 
         // E.g., ISO code for the country. Use 'UN' for unknown/global.
    }
});



userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);