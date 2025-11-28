const express=require('express');
const session=require('express-session');
const mongoose=require('mongoose');
const app=express();
const connectDB=require('./config/db.js');
const fs=require('fs');
const path=require('path');
const bcrypt=require('bcrypt');
const PORT=process.env.PORT||5000;
require('dotenv').config();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));
 connectDB();

const SESSION_SECRET = process.env.SESSION_SECRET ||'a_very_long_cryptographically_secure_string_fallback';
app.use(session({
    secret:SESSION_SECRET,
    resave:false, //when we donot want to store session data in db ,highly recomended
    saveUninitialized:false,//session cookie is sent to the database but no data is stored until you explicity tell
    //each time you visit this middleware runs and creates an uninitialized session and by using this it will not flood your d.b with tons of uninitialized sessions
     cookie:{maxAge:1000*60*60*24},
     //sameSite:lax  says: "Send the session cookie only when the user is on my site, or when they are simply clicking a link to get here. Do not send it for background requests or secret form submissions from other sites."
     secure:true//use true only when using https otherwise this middleware will refuse to send cookies on http
}));


function ensureAuthenticated(req,res,next){
    if(req.session.userId){
        next();
    }
    //401 -->> Unauthorized
    else {
        return res.status(401).json({error:"Unauthorized acces ,Please login or register "})
    }
}



const studentSchema=mongoose.Schema({
    sapid:{type:Number,unique:true,required:true},
    name:{type:String,required:true},
    marks:{type:Number}
});

const facultySchema=mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})
const studentModel=mongoose.model('students',studentSchema);



facultySchema.pre('save',async function (next) {

    // block is mainly used when updating
    if (!this.isModified('password')){
        return next()
    }
     

    //this is the main part for hashing password
    try {
        const salt =await bcrypt.genSalt(10);
        this.password= await bcrypt.hash(this.password,salt);
        next()
    }
    //catch block executes if any line in try block fails
    // next(err) this aborts the database operation
    catch(err){
        next(err);
    }
    
})
const facultyModel=mongoose.model('faculty',facultySchema);

//file locations
const homepageFile=path.join(__dirname,'frontend','homepage.html')

const registerFile=path.join(__dirname,'frontend','registrationpage.html')
const loginFile=path.join(__dirname,'frontend','loginpage.html');
const dahsboardFile=path.join(__dirname,'frontend','dashboard.html');

app.get('/',(req,res)=>{
res.sendFile(homepageFile)
})
app.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.sendFile(dahsboardFile);
});
app.get('/register',(req,res)=>{
    res.sendFile(registerFile);
});

app.get('/login',(req,res)=>{
    res.sendFile(loginFile);
});


app.post('/register',async(req,res)=>{
    const newuser=req.body;
    if(!newuser||typeof newuser !='object'||Object.keys(newuser).length===0){
    return res.status(400).json({status:400,
        error:"Bad Request, perhaps due to empty form or invalid form details"
    })

    }
    try{
        const user=await facultyModel.create({
            name:newuser.name,
            username:newuser.username,
            password:newuser.password});
          req.session.userId=user._id;

            console.log('Cookie sent to browser');
            
            console.log('user registered successfully' +user);
            return res.status(200).json({status:200,message:"okay"})
    }
    catch(error){
        console.error("Registration error:", error);
        let errorMessage = "Server error during registration.";

        // Handle MongoDB Duplicate Key Error (code 11000 for unique: true)
        if (error.code === 11000) { 
            errorMessage = "Username already exists. Please choose a different one.";
            return res.status(409).json({ status: 409, error: errorMessage }); // 409 Conflict
        } 
        // Handle Mongoose Validation Error (required field missing, although frontend should prevent this now)
        else if (error.name === 'ValidationError') {
            errorMessage = error.message;
            return res.status(400).json({ status: 400, error: errorMessage }); // 400 Bad Request
        }

        // Handle other server errors
        return res.status(500).json({ status: 500, error: errorMessage });
    }
    });


    //login route
    app.post('/login',async(req,res)=>{
        const newuser=req.body;
        if(!newuser||typeof newuser !='object'||Object.keys(newuser).length===0){
            return res.status(400).json({status:400,
                error:"Bad Request, perhaps due to empty form or invalid form details"
            })
    }

  try{
    const user=await facultyModel.findOne({username:newuser.username});
    if(!user)
    {
        return res.status(400).json({ status: 400, error: "Bad Request: Missing username or password" })
    }
    const isMatch=await bcrypt.compare(newuser.password,user.password);
    if(isMatch){
        req.session.userId=user._id;
        console.log(`Login successful for ${user.name}`);
        return res.status(200).json({message:"Login successful"});
    }
    else{
        console.log(`Invalid Credentials`)
       return res.status(401).json({error:"Invalid credentials"});
    }
  }
  catch(error){
    console.log(`internal server error 50 ${error}`)
    return res.status(500).json({error:"internal server error"})
  }

})















app.listen(PORT,()=>{
    console.log(`Server listening on 
       1. http://localhost:${PORT}/
       2. http://localhost:${PORT}/login
       3. http://localhost:${PORT}/dashboard`)

})

// write a program using D3 that updates list items in an unordered list using D3JS 