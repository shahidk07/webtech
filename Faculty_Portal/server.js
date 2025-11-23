const express=require('express');
const session=require('express-session');
const mongoose=require('mongoose');
const connectDB=require('./config/db.js');
const { stringify } = require('postcss');
const atlasuri='mongodb+srv://shahidk07:atlasdb826826@cluster0.igo0iw3.mongodb.net/awt?retryWrites=true&w=majority&tls=true'
const PORT =4000;

connectDB();

const studentSchema=mongoose.Schema({
    sapid:{type:Number,unique:true,required:true},
    name:{type:String,required:true},
    marks:{type:Number}
});

const facultySchema=mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true}
})

const studentModel=mongoose.model('students',studentSchema);
const facultyModel=mongoose.model('faculty',facultySchema);
