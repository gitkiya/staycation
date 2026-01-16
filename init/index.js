const mongoose = require("mongoose");
const initdb = require("./data.js"); // bcz the file is in the same folder that's why single dot
const listing = require("../model/listing.js"); // file in another folder

const Mongodb = "mongodb://127.0.0.1:27017/staycation";

main()
    .then(()=> {
        console.log("connected to db");
        
    })
    .catch((err) => console.log(err));
   
async function main(){
    await mongoose.connect(Mongodb);
}

const initd = async () =>{
    await listing.deleteMany({});
    initdb.data = initdb.data.map((obj)=>({...obj,owner:"6900cb2423c70252cf840dac"}));
    await listing.insertMany(initdb.data);
    console.log("data inserted");
}
initd();

