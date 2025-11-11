const express =require('express');
const app=express();
const mongoose=require('mongoose');
const port =3000;
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