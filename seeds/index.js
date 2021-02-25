const mongoose=require('mongoose')
const Campground=require("../models/campground")
const citites=require('./citites')
const {places,descriptors}=require("./seedHelpers")




mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

const db=mongoose.connection
db.on("error",console.error.bind(console,"connection error: "))
db.once("open",()=>{
    console.log("Database Connected")
})

const sample=array=>array[Math.floor(Math.random()*array.length)]

const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const camp=new Campground({
            location:`${citites[random1000].city}, ${citites[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`
            
        })
        await camp.save(); 
        
    }
    console.log("Saved New Information")
}
seedDB().then(()=>{
    mongoose.connection.close();
    console.log("Database Closed")
});//returns a promise because it's defined as an async function