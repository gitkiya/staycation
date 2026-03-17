const Listing = require("../model/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res)=>{
    if(req.query.category){
        const category = req.query.category;
        const allListing = await Listing.find({category});
        res.render("listing/index.ejs",{allListing})
    }
    else{
        const allListing =  await Listing.find({});
        res.render("listing/index.ejs",{allListing})
    }
}

module.exports.searchListing = async(req,res)=>{
    console.log("Search query:", req.query.q);
    const searchQuery = (req.query.q || "").trim();
    if (!searchQuery) {
        const allListing = await Listing.find({});
        return res.render("listing/index.ejs", { allListing });
    }
    const allListing = await Listing.find({
        $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { location: { $regex: searchQuery, $options: 'i' } },
            { country: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } }
        ]
    });
    res.render("listing/index.ejs", { allListing });
}

module.exports.newListingForm = (req,res)=>{
   res.render("listing/new.ejs");
}

module.exports.createListing = async(req,res,next)=>{   
   
        let responce = await geocodingClient.forwardGeocode({
            query: req.body.location,
            limit: 1
        }).send();
       
        let { title, price, description, location, country } = req.body;
        const list = new Listing({ title, price, description, location, country , category: req.body.category});
        list.owner = req.user._id;
        if(req.file){
            list.image = {
                url: req.file.path,
                filename: req.file.filename
            }
        }
        list.geometry = responce.body.features[0].geometry;
        await list.save();
        console.log("[createListing] Listing saved",list);
        req.flash("success","Successfully made a new listing !");
        return res.redirect("/listings");
    
    
};

module.exports.showListing = async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews" , populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing Doesn't Exist !");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs",{listing});
}

module.exports.editListingForm = async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Doesn't Exist !");
        return res.redirect("/listings");
    }
    console.log("listingObject:",listing);
    console.log("listing.image.url:",listing.image.url);
    let originalImage = listing.image.url;
    console.log("originalImageurl before:",originalImage);
    originalImage = originalImage.replace("/upload", "/upload/w_200,q_auto:low");
    console.log("originalImage url after:",originalImage);
    res.render("listing/edit.ejs",{listing,originalImage});
}

module.exports.updateListing = async(req,res)=>{
    
    const {id} = req.params;
    let { title, price, description, location,category, country } = req.body; 
    const updateField =  {
        title,
        price,
        description,
        location,
        category,
        country,
    };
  
    const updateListing = await Listing.findByIdAndUpdate(id,updateField,{new:true, runValidators:true});
    if(typeof req.file !== 'undefined'){
        updateListing.image = {
            url: req.file.path,
            filename: req.file.filename
        }
        await updateListing.save();
        
        
    }
    req.flash("success","Successfully updated the listing !");
    res.redirect(`/listings/${id}`);

}

module.exports.deleteListing = async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted the listing !");
    res.redirect("/listings");
}