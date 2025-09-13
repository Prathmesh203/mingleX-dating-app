const express = require('express');
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModels");

// api to create a user 
authRouter.post("/signup", async (req, res) => {
     try {
       const { firstname, lastname, email, password } = req.body;
       console.log(req.body);
       
       const encryptedPassword = await bcrypt.hash(password, 10);
       const data = await User.create({
         firstname,
         lastname,
         email,
         password: encryptedPassword,
       });
       const token = await data.getJwt();
       const userData = data.toObject();
       delete userData.password; 
       res.json({
         message: "SignUp Successful",
         data: userData,
         token: token
       });
     } catch (error) {
       res.status(400).json({error: error.message});
     }
   });

// api to login the user 
authRouter.post("/login", async (req, res) => {
     try {
       const { email, password } = req.body;
       const user = await User.findOne({ email: email });
       if (!user) {
         throw new Error("Incorrect email or password");
       }
       const validPassword = await user.validatePassword(password);
     
       if (validPassword) {
         const token = await user.getJwt();
         const userData = user.toObject();
         delete userData.password; 
         res.json({
           message: "User logged in successfully",
           data: userData,
           token: token
         });
       } else {
         throw new Error("Email or password is incorrect");
       }
     } catch (error) {
       res.status(400).json({message: error.message});
     }
   });

// api to logout the user 
authRouter.post('/logout', (req, res) => {
     try {
       res.json({message: "User logged out successfully"});
     } catch (error) {
       res.status(400).json({message: error.message});
     }
   });


module.exports = authRouter;