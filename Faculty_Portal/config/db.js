const mongoose =require('mongoose')

const connectDB = async()=>{
 try{
   console.log(`db connected`)
 }
 catch(err){
    console.log(`error related to database ${err}`)
 }
}

module.exports=connectDB;