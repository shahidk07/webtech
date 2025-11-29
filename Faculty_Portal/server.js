//server.js
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

 // Add cookie-parser import at the top
const cookieParser = require('cookie-parser');
// ... other imports ...

// ... inside the app setup (after connectDB()) ...

// Use cookie-parser
app.use(cookieParser());

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



// server.js (Get All Students Route)

app.get('/students', ensureAuthenticated, async (req, res) => {
    try {
        const students = await studentModel.find().select('sapid name marks -_id').sort({ sapid: 1 });
        return res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        return res.status(500).json({ status: 500, error: "Internal server error fetching student list." });
    }
});



// server.js (Add/Update Student Marks Route)

// Route to add or update student marks. Protected by ensureAuthenticated.
app.post('/students', ensureAuthenticated, async (req, res) => {
    const { sapid, name, marks } = req.body;

    // 400 Bad Request check for missing data
    if (!sapid || !name || marks === undefined || marks < 0 || marks > 100) {
        return res.status(400).json({ status: 400, error: "Invalid student details: SAPID, Name, and Marks (0-100) are required." });
    }

    try {
        // Use findOneAndUpdate with upsert:true to handle both creation and update.
        // If a document with the sapid exists, update it. If not, create a new one.
        const updatedStudent = await studentModel.findOneAndUpdate(
            { sapid: sapid }, // Search criteria
            { name: name, marks: marks }, // Data to set
            { new: true, upsert: true, runValidators: true } // Options: return new doc, create if not found, run schema validators
        );

        console.log(`Student data saved/updated: ${updatedStudent.sapid}`);
        return res.status(200).json({ status: 200, message: "Student marks saved successfully.", student: updatedStudent });

    } catch (error) {
        console.error("Error saving student data:", error);
        // Handle potential validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: 400, error: error.message });
        }
        return res.status(500).json({ status: 500, error: "Internal server error saving student data." });
    }
});



// server.js (Statistics API Route)

app.get('/api/stats', ensureAuthenticated, async (req, res) => {
    try {
        // Use MongoDB aggregation to count students in each range
        const stats = await studentModel.aggregate([
            {
                $group: {
                    _id: null, // Group all documents together
                    // 0-45%
                    range_0_45: { $sum: { $cond: [{ $lte: ["$marks", 45] }, 1, 0] } },
                    // 46-65%
                    range_46_65: { $sum: { $cond: [{ $and: [{ $gt: ["$marks", 45] }, { $lte: ["$marks", 65] }] }, 1, 0] } },
                    // 66-75%
                    range_66_75: { $sum: { $cond: [{ $and: [{ $gt: ["$marks", 65] }, { $lte: ["$marks", 75] }] }, 1, 0] } },
                    // 76-85%
                    range_76_85: { $sum: { $cond: [{ $and: [{ $gt: ["$marks", 75] }, { $lte: ["$marks", 85] }] }, 1, 0] } },
                    // 86-100%
                    range_86_100: { $sum: { $cond: [{ $gt: ["$marks", 85] }, 1, 0] } }
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field
                    range_0_45: 1,
                    range_46_65: 1,
                    range_66_75: 1,
                    range_76_85: 1,
                    range_86_100: 1,
                }
            }
        ]);

        // stats[0] will contain the single object with all the counts
        if (stats.length > 0) {
            return res.status(200).json(stats[0]);
        } else {
            // Return zeros if no students are found
            return res.status(200).json({
                range_0_45: 0,
                range_46_65: 0,
                range_66_75: 0,
                range_76_85: 0,
                range_86_100: 0
            });
        }
    } catch (error) {
        console.error("Error generating stats:", error);
        return res.status(500).json({ status: 500, error: "Internal server error calculating statistics." });
    }
});



// server.js (Logout Route)

app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Could not log out.' });
        }
        // Redirect to login page after successful logout
        res.clearCookie('connect.sid'); // Clear the session cookie (if using default name)
        res.redirect('/');
    });
});






app.listen(PORT,()=>{
    console.log(`Server listening on 
       1. http://localhost:${PORT}/
       2. http://localhost:${PORT}/login
       3. http://localhost:${PORT}/dashboard`)

})

// write a program using D3 that updates list items in an unordered list using D3JS 