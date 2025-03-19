//password:- BA55KNPp9IZ3euOS
//username:- prathmeshch2003
const url = "mongodb+srv://prathmeshch2003:BA55KNPp9IZ3euOS@cluster0.i4ysu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const mongoose = require('mongoose');
 
async function dbConnection(){
     try{
          await mongoose.connect(url);
     }
     catch(err){
          console.log(err);
     }
     }

module.exports = dbConnection;