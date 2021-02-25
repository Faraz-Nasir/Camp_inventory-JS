const express=require('express')
const app=express()
const mongoose=require('mongoose')
const Campground=require("./models/campground")

mongoose.connect("mongodb://localhost:27017/yelp-camp",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

const db=mongoose.connection
db.on("error",console.error.bind(console,"connection error: "))
db.once("open",()=>{
    console.log("Database connected")
})


//steps for ejs to work
const path=require('path')
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.get("/",(req,res)=>{
    res.render("home.ejs")
})
app.get("/campgrounds",async (req,res)=>{
   const campgrounds=await Campground.find({})
   res.render('campgrounds/index',{campgrounds})
})

app.get('/campgrounds/new',(req,res)=>{
    res.render("campgrounds/new.ejs")
})
//important to extract datafrom request body
app.use(express.urlencoded({extended:true}))
app.post('/campgrounds',async(req,res)=>{
    const campground=new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id',async(req,res)=>{
    const campground=await Campground.findById(req.params.id)
    res.render("campgrounds/show",{campground})
})

app.get("/campgrounds/:id/edit",async (req,res)=>{
    
    const id=req.params.id.replace(":","")
    
    const campground=await Campground.findById(id)
    
    res.render("campgrounds/edit",{campground})
})
//Browsers only have GET AND POST Methods
//That's why we require a package/module
//of method-override
const methodOverride=require('method-override')
app.use(methodOverride('_method'))


app.put('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params
    console.log(id)
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})

//order is important while adding get requests
//i could'nt put the new request after id request
//as it was treating it as an id and causing error


app.listen(3000,()=>{
    console.log("Serving on port 3000")
})