
const validator = require('validator');
const validateData = (req)=>{
     const {firstname, lastname, email, password} = req;
     if ( !firstname || !lastname) {
          throw new Error("please enter name properly");
     }else if( !validator.isEmail(email)){
          throw new Error("enter a valid Email");    
     }else if( !validator.isStrongPassword(password)){
          throw new Error("enter a strong password");    
     }
}
const profileValidation = (req)=>{
    const data =  ["firstname","lastname","age","bio","profile","gender","dob","interest", "_id", "email", "location", "occupation"];
    const validateData = Object.keys(req.body).every((key)=>data.includes(key));
     return validateData
}



module.exports= {
     validateData,
     profileValidation
}