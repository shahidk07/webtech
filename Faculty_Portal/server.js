const express=require('express');
const session=require('express-session');
const mongoose=require('mongoose');
const app=express();
const connectDB=require('./config/db.js');
const fs=require('fs');
const path=require('path');
const { stringify } = require('postcss');
const atlasuri='mongodb+srv://shahidk07:atlasdb826826@cluster0.igo0iw3.mongodb.net/awt?retryWrites=true&w=majority&tls=true'
const PORT =4000;
app.use(express.json());

connectDB();

const SESSION_SECRET = 'a_very_long_cryptographically_secure_string_fallback';
app.use(session({
    secret:SESSION_SECRET,
    resave:false, //when we donot want to store session data in db ,highly recomended
    saveUninitialized:false,//session cookie is sent to the database but no data is stored until you explicity tell
    //each time you visit this middleware runs and creates an uninitialized session and by using this it will not flood your d.b with tons of uninitialized sessions
     cookie:{maxAge:1000*60*60*24},
     //sameSite:lax  says: "Send the session cookie only when the user is on my site, or when they are simply clicking a link to get here. Do not send it for background requests or secret form submissions from other sites."
     secure:false//use true only when using https otherwise this middleware will refuse to send cookies on http
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
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})
const studentModel=mongoose.model('students',studentSchema);
 



facultySchem.pre('save',async function(next){
    if(!this.isModified('password')){
return next()
    }
    try{
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
        next()
    }
    //catch block only executes if the if block has some errors
    //next(err) terminates the db operation
    catch(err){
        next(err)
    }
})
//make sure to create model only after using pre-hook


const facultyModel=mongoose.model('faculty',facultySchema);

//file locations
const homepageFile=path.join(__dirname,'frontend','homepage.html')

const registerFile=path.join(__dirname,'frontend','registrationpage.html')
const loginFile=path.join(__dirname,'frontend','loginpage.html');
const dahsboardFile=path.join(__dirname,'frontend','dashboard.html');

app.get('/',(req,res)=>{
res.sendFile(homepageFile)
})
app.get('/dashboard',(req,res)=>{
    res.sendFile(dahsboardFile);
});
app.get('/register',(req,res)=>{
    res.sendFile(dahsboardFile);
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
    const add=await facultyModel.create({
        name:newuser.name,
        username:newuser.username,
        password:newuser.password
    }
    )
})

app.listen(PORT,()=>{
    console.log(`Server listening on 1. http://localhost:${PORT}/register
        http://localhost:${PORT}/dashboard`)

})


// write a program using D3 that updates list items in an unordered list using D3JS 