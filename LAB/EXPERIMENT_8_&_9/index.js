const express =require('express');
const app=express();
const mongoose=require('mongoose');
const session = require('express-session');
const port =3000;
const bcrypt = require('bcrypt');
const fs=require('fs');
const path=require('path');
const { message, retry } = require('statuses');

// Middleware to parse incoming JSON payloads
app.use(express.json());

// 1. ADD THIS MIDDLEWARE TO SERVE STATIC FILES
// It maps the URL path /static to the directory containing your static files.
// The browser will request files like http://localhost:3000/static/style.css
// and Express will look for them in ./TODO_LIST_JQUERY/style.css
app.use('/static', express.static(path.join(__dirname, 'TODO_LIST_JQUERY')));

// Middleware to parse incoming URL-encoded payloads (used by standard HTML forms)
app.use(express.urlencoded({ extended: true }));

//session middleware
app.use(session({   
    secret: 'a very secret key that should be long and random', // 👈 CHANGE THIS SECRET
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));




const atlasuri='mongodb+srv://shahidk07:atlasdb826826@cluster0.igo0iw3.mongodb.net/database1?retryWrites=true&w=majority&tls=true'
const loginfile=path.join(__dirname,'./login.html')
const registerfile=path.join(__dirname,'./register.html');
const todolistfile = path.join(__dirname, 'TODO_LIST_JQUERY', 'index.html');



mongoose.connect(atlasuri).then(()=>{
    console.log('atlas db connected')
}).catch(err=> console.error(`ERROR REATED TO MONGO DB FOUND`));


const taskItemSchema=new mongoose.Schema({
    tasks:{type:String,required:true},
    ischecked:{type:Boolean},
    createdAt:{type:Date,default:Date.now},
    // mongodb automatically creates an id for each task is needed to delete a specific task
})




//creating a schema with Embedded todos
const userSchema=new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true}, 
    todos:[taskItemSchema]
});

//pre is a hook that allows us to modify the document before saving it to d.b.
// 'save' refers to Mongoose save event
//next is a callback function called when middleware work is done as flow goes to next middleware or route
//whenever you use next mongoose automatically creates a callback function you just have to name it, here i named it as next
userSchema.pre('save',async function (next) {

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
//make sure to create model only after using pre-hook


const UserModel=mongoose.model('User',userSchema);





// Middleware to ensure the user is logged in
function ensureAuthenticated(req, res, next) {
    if (req.session.userId) {
        next(); // User is authenticated
    } else {
        res.status(401).json({ error: "Unauthorized: Please log in." });
    }
}

app.get('/',async(req,res)=>{
    res.send('welcome to homepage')});

app.get('/register',async(req,res)=>{
    res.sendFile(registerfile)});

 app.get('/login',async(req,res)=>{
     res.sendFile(loginfile);})



app.post('/register',async(req,res)=>{
    const formdata=req.body;
    if (!formdata || typeof formdata !== 'object' || Object.keys(formdata).length === 0) {
        return res.status(400).json({ error: "EMPTY DATA ENTERED" });
    }
    else {
        const result=await UserModel.create({
            username:formdata.username,
            password:formdata.password});

            //log user in immediately after registration
            const user = await UserModel.findOne({username:formdata.username});
            req.session.userId=user._id;
            console.log('user registered successfully' +result)
            return res.status(200).json({message:"Registration successful"});
        
    }
  
})

//login handling
app.post('/login',async(req,res)=>{
const formdata=req.body;
 if(!formdata.username||!formdata.password){
   return res.status(400).json({error:"Missing username or password"})
 }
try{
    const user=await UserModel.findOne({username:formdata.username});
    if(!user){
        return res.status(401).json({error:"invalid credentials"})
    }
//bcrypt takes two agruments to compare since we have stored hashed password so we a using bcrypt
    const isMatch=await bcrypt.compare(formdata.password,user.password);
    if(isMatch){
        req.session.userId=user._id;
        console.log(`Login successful for ${formdata.username}`)
        return res.status(200).json({message:"Login successful"})

        // When your server sends the 200 OK response, the express-session middleware automatically 
        // sends a cookie and attaches the Session ID (SID) to the response headers via the Set-Cookie command.
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

//since while login or registation a cookie is sent to the broswer the next step is using this cookie for all major work
//when user navigates to /todoist route a request is sent to the server along with the cookie stored in broswer
//now express-session middleware retrives SID from the cookie and from that retreives the UserId(variable holding object id temperorily)
// and it also checks if there is a session linked with this userId in the session data after that
//now next ensureAuthenticated middleware runs and checks if express-session middleware found a userId linked with a session

app.get('/todolist', async (req, res) => {
    // This will now serve the HTML file from the nested directory
    res.sendFile(todolistfile);
});


app.get('/api/todos',ensureAuthenticated,async(req,res)=>{
    try {
        const userId =req.session.userId;
        const user=await UserModel.findById(userId);
        if(!user){
            return res.status(404).json({error:"user data not found"})
        }
        return res.status(200).json(user.todos||[]);
    }catch(error){
        return res.status(500).json({error:"Failed to load tasks"})
    }
});


app.post('/api/todos', ensureAuthenticated, async (req, res) => {
    const { tasks, ischecked } = req.body;
    const userId = req.session.userId;
    
    if (!tasks) {
        return res.status(400).json({ error: "Task content is required." });
    }

    try {
        const newTask = { tasks, ischecked, createdAt: new Date() };

        // Use $push to add the new task object to the 'todos' array
        const result = await UserModel.findByIdAndUpdate(
            userId,
            { $push: { todos: newTask } },
            { new: true } // Return the updated document
        ); 
   //this step is not necessary
        if (!result) {
            return res.status(404).json({ error: "User not found to add task." });
        }
        
        // Return the newly added task object from the array
        return res.status(201).json(result.todos[result.todos.length - 1]);
    } catch (error) {
        return res.status(500).json({ error: "Failed to save task." });
    }
});



//  UPDATE OR DELETE A TASK
app.put(`${'/api/todos'}/task/:taskId`, ensureAuthenticated, async (req, res) => {
    const { taskId } = req.params;
    const { action, tasks, ischecked } = req.body;
    const userId = req.session.userId;

    try {
        let updateOperation;

        if (action === 'delete') {
            // Use $pull to remove the task by its embedded _id
            updateOperation = { $pull: { todos: { _id: taskId } } };
        } else {
            // Use $set with the array positional operator ($[i]) to update properties
            updateOperation = {
                $set: {
                    "todos.$[i].tasks": tasks,
                    "todos.$[i].ischecked": ischecked
                }
            };
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: userId },
            updateOperation,
            { 
                new: true,
                arrayFilters: [ { "i._id": taskId } ] // Filter to identify which item 'i' is
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User or task not found." });
        }
        
        return res.status(200).json({ message: "Task updated successfully." });
    } catch (error) {
        return res.status(500).json({ error: "Failed to process task." });
    }
});


// --- SERVER STARTUP ---
app.listen(port, () => {
    console.log(`Server started. Available endpoints are:
        1: http://localhost:${port}/
        2. http://localhost:${port}/register
        3. http://localhost:${port}/login`);
});