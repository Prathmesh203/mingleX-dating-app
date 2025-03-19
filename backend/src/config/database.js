//password:- BA55KNPp9IZ3euOS
//username:- prathmeshch2003
const url = process.env.MONGODB_URL

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