const express =require('express');
const app=express();
const mongoose=require('mongoose');
const port =3000;
const bcrypt = require('bcrypt');
const fs=require('fs');
const path=require('path');
const { message, retry } = require('statuses');

// Middleware to parse incoming JSON payloads
app.use(express.json());



// Middleware to parse incoming URL-encoded payloads (used by standard HTML forms)
app.use(express.urlencoded({ extended: true }));


// 1. ADD THIS MIDDLEWARE TO SERVE STATIC FILES
// It maps the URL path /static to the directory containing your static files.
// The browser will request files like http://localhost:3000/static/style.css
// and Express will look for them in ./TODO_LIST_JQUERY/style.css
app.use('/static', express.static(path.join(__dirname, 'TODO_LIST_JQUERY')));
const atlasuri='mongodb+srv://shahidk07:atlasdb826826@cluster0.igo0iw3.mongodb.net/database1?retryWrites=true&w=majority&tls=true'


app.listen(port,()=>{
    console.log(`Server started. Available endpoints are:
        1: http://localhost:${port}/
        2. http://localhost:${port}/register
        3. http://localhost:${port}/login`)
})


mongoose.connect(atlasuri).then(()=>{
    console.log('atlas db connected')
}).catch(err=> console.error(`ERROR REATED TO MONGO DB FOUND`));

//creating a schema
const userschema=new mongoose.Schema({
    username:{type:'String',required:true},
    password:{type:'String',required:true},
})

const todosdchema=new mongoose.Schema({
    
})


//pre is a hook that allows us to modify the document before saving it to d.b.
// 'save' refers to Mongoose save event
//next is a callback function called when middleware work is done as flow goes to next middleware or route
//whenever you use next mongoose automatically creates a callback function you just have to name it, here i named it as next
userschema.pre('save',async function (next) {

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
//creating a model based on schema
const model=mongoose.model('exp8',userschema);

app.get('/',async(req,res)=>{
    res.send('welcome to homepage')
});

const loginfile=path.join(__dirname,'./login.html')
const registerfile=path.join(__dirname,'./register.html');
const todolistfile = path.join(__dirname, 'TODO_LIST_JQUERY', 'index.html');

app.get('/register',async(req,res)=>{
    res.sendFile(registerfile)
});
app.post('/register',async(req,res)=>{
    const formdata=req.body;
    if (!formdata || typeof formdata !== 'object' || Object.keys(formdata).length === 0) {
        return res.status(400).json({ error: "EMPTY DATA ENTERED" });
    }
    else {
        const result=await model.create({
            username:formdata.username,
            password:formdata.password
        });
        console.log('user registered successfully' +result)
        // *** CHANGE: Redirect to the /todolist route upon success ***
            return res.redirect('/todolist');
    }
  
})

//serving login page
app.get('/login',async(req,res)=>{
    res.sendFile(loginfile);
})
//login handling
app.post('/login',async(req,res)=>{
const formdata=req.body;
 if(!formdata.username||!formdata.password){
   return res.status(400).json({error:"Missing username or password"})
 }
try{
    const user=await model.findOne({username:formdata.username});
    if(!user){
        return res.status(401).json({error:"invalid credentials"})
    }
//bcrypt takes two agruments to compare since we have stored hashed password so we a using bcrypt
    const isMatch=await bcrypt.compare(formdata.password,user.password);
    if(isMatch){
        console.log(`Login successful for ${formdata.username}`)
        return res.status(200).json({message:"Login successful"})
    }
    else{
        return res.status(401).json({error:"Invalid credentials!"});
    }
}
catch(error){
    console.log(`Internal Server Error!, ${error}`);
    return res.status(500).json({error:"Internal Server Error"});

}
});

app.get('/todolist', async (req, res) => {
    // This will now serve the HTML file from the nested directory
    res.sendFile(todolistfile);
});