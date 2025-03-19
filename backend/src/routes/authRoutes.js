const express = require('express');
const authRouter = express.Router();
const { validateData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/userModels");

// api to create a user 
authRouter.post("/signup", async (req, res) => {
     try {
       const userData = req.body;
       validateData(userData);
       const { firstname, lastname, email, password } = req.body;
       const encryptedPassword = await bcrypt.hash(password, 10);
        const data = await User.create({
         firstname,
         lastname,
         email,
         password: encryptedPassword,
       });
       const token = await data.getJwt();
       if (token) {
        res.cookie("token", token,{
         expires: new Date(Date.now() + 8 * 3600000),
         httpOnly: true, 
         secure: process.env.NODE_ENV === 'production', 
         sameSite: 'strict'
        });
        const userData = data.toObject();
        delete userData.password; 
        res.json({
         message:"SignUp Successfull",
         data:userData
        });
      }
     } catch (error) {
       
       res.status(400).json({error:error.message});
     }
   });

   //api to login the user 
   authRouter.post("/login", async (req, res) => {
     try {
       const { email, password } = req.body;
       const user = await User.findOne({ email: email });
       if (!user) {
         throw new Error("Incorrect email or password ");
       }
       const validPassword = await user.validatePassword(password);
     
       if (validPassword) {
         const token = await user.getJwt();
         if (token) {
           res.cookie("token", token,{
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
           });
           const userData = user.toObject();
        delete userData.password; 
           res.json({message:"user loggend in successfully",
            data: userData
           });
         }
       } else {
         throw new Error("email or password is incorrect ");
       }
     } catch (error) {
       res.status(400).json({message:error.message});
     }
   });

   //api to logout the user 
   authRouter.post('/logout',(req,res)=>{
      try {
        res.cookie("token",null,{
          expires: new Date(Date.now())
        })
        res.json({message:"user logged out successfully"})
      } catch (error) {
        res.json({message:error.message});
      }
   })
   
   authRouter.get("/verify-auth", async (req, res) => {
    try {
      
      const token = req.cookies.token;
      
      if (!token) {
        return res.status(401).json({ authenticated: false });
      }
      
     
      const decoded = jwt.verify(token, "Prathmesh@2003");
      const user = await User.findById(decoded.id).select('password');
      
      if (!user) {
        return res.status(401).json({ authenticated: false });
      }
      
      return res.json({
        authenticated: true,
        data: user
      });
    } catch (error) {
      return res.status(401).json({ authenticated: false });
    }
  });
   

module.exports = authRouter;
