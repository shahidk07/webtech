const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

module.exports=UserModel;