const express =require('express');
const app=express();
const mongoose=require('mongoose');
const port =3000;
const bcrypt = require('bcrypt');
const fs=require('fs');
const path=require('path');

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Middleware to parse incoming URL-encoded payloads (used by standard HTML forms)
app.use(express.urlencoded({ extended: true }));

const atlasuri='mongodb+srv://shahidk07:atlasdb826826@cluster0.igo0iw3.mongodb.net/database1?retryWrites=true&w=majority&tls=true'


app.listen(port,()=>{
    console.log(`Server started. Available endpoints are:
        1: http://localhost:${port}/
        2. http://localhost:${port}/register`)
})


mongoose.connect(atlasuri).then(()=>{
    console.log('atlas db connected')
}).catch(err=> console.error(`ERROR REATED TO MONGO DB FOUND`));

//creating a chema
const userschema=new mongoose.Schema({
    username:{type:'String',required:true},
    password:{type:'String',required:true},
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

const htmlfile=path.join(__dirname,'./index.html');

app.get('/register',async(req,res)=>{
    res.sendFile(htmlfile)
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
        console.log(result)
        return res.status(200).json({error:"data received by the server"},result)
    }
  
})