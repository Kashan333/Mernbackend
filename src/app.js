require('dotenv').config();
const express = require("express");
require("./db/conn")
const Register= require("./models/registers");
 const app = express();
 const port= process.env.PORT || 3000;
 const path =require("path");
 const bcrypt=require("bcryptjs");
 const jwt=require("jsonwebtoken");
 const hbs = require("hbs");
 const {json} = require("express");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const static_path= path.join(__dirname,"../public");
const template_path= path.join(__dirname,"../templates/views");
const partial_path= path.join(__dirname,"../templates/partials");
 //console.log( path.join(__dirname,"../public"));
 hbs.registerPartials(partial_path);
 app.use(express.static(static_path));
 app.set("view engine","hbs");
 app.set("views",template_path);
 app.get("/",(req,res)=>
 {
    res.render("index");
 })
 app.get("/register",(req,res)=>
 {
   res.render("register");
 })
 app.post("/register",async(req,res)=>
 {
   try {
     const password =req.body.password;
     const Cpassword=req.body.confirmpassword;
     if(password===Cpassword){
      const registerEmployee=new Register({
         firstname: req.body.firstname,
         lastname:req.body.lastname,
         email:req.body.email,
         gender:req.body.gender,
         phone:req.body.phone,
         password:req.body.password,
         confirmpassword:req.body.confirmpassword
      })

      const token =await registerEmployee.generateAuthToken();
      const registered=await registerEmployee.save();
      console.log("the page part"+registered);
      res.status(201).render("index"); 
      

     }
     else{

     }


      
   } catch (error) {
      res.status(400).send(error);
   }
 })

 app.get("/login",(req,res)=>
 {
   res.render("login");
 })
 app.post("/login", async (req,res)=>
 {
   try {
      const email=req.body.email;
      const password=req.body.password;
      const useremail=await Register.findOne({email:email});
     // console.log(useremail.password);
     // console.log(password);
      const isMatch= await bcrypt.compare(password,useremail.password);
      const token =await useremail.generateAuthToken();
      console.log("the token part"+token);

      if(isMatch)
      {
         res.status(200).render("index ");

      }else{
         res.send("invalid login details")
      }
    
      
      
   } catch (error) {
      res.status(400).send("invalid email")
   }
 });
 app.listen(port,()=>
 {
    console.log(`server is running on ${port}`)
 })