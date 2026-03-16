const mongoose = require("mongoose");
const { listingSchema } = require("../schema.js");
const Schema = mongoose.Schema;


const ListingSchema = new Schema({
    title : String,
    description: String,
    image : { 
        url: String,  
        filename: String, 
    }, 
    price : Number,
    location : String,
    country : String,
    reviews : [{
        type: Schema.Types.ObjectId,
        ref:"Review"
      },
    ],
   owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
   geometry:{
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: {
        type: String,
        enum: ["Trending", "Mountain", "Iconic Cities", "Rooms", "Castles", "Beach", "Farms", "Camping", "Family house", "Artic", "Amusement parks", "Historical", "Other"] // Match your tag names exactly!
    }
  
});

ListingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        const Review = require("./review.js");
        await Review.deleteMany({
            _id:{ $in: listing.reviews}
        })
    }
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing; 