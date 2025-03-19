import axios from "axios"
const URL = import.meta.env.VITE_URL;
const getData = async()=>{
     try {
          const data = await axios.get(`${URL}/profile/view`,{withCredentials:true}
             );
          return data.data;
     } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to load profile';          
     }
}


const api = axios.create({
     baseURL: '/api',
     withCredentials: true,
     headers: {
       'Content-Type': 'application/json'
     }
   });
   
   export async function updateName(firstname, lastname) {
     try {
       const response = await api.patch(`${URL}/profile/edit`, { firstname:firstname, lastname:lastname });
       return response.data;
     } catch (error) {
       throw error.response?.data?.message || error.message || 'Failed to update name';
     }
   }
   
   export async function updatePassword(email, newPassword, confirmPassword) {
     try {
       
       if (newPassword !== confirmPassword) {
         throw new Error("Passwords don't match");
       }
       
       const response = await api.patch(`${URL}/profile/updatePassword`, { 
         email, 
         newPassword 
       });
       
       return response.data;
     } catch (error) {
       throw error.response?.data?.message || error.message || 'Failed to update password';
     }
   }
   
   export async function updateProfileInfo(age, gender, bio, dob) {
     try {
       const response = await api.patch(`${URL}/profile/edit`, { 
         age:age, 
         gender:gender, 
         bio:bio, 
         dob:dob
       });
       
       return response.data;
     } catch (error) {
       throw error.response?.data?.message || error.message || 'Failed to update profile info';
     }
   }
   
   export async function updateInterests(interest) {
     try {
       const response = await api.patch(`${URL}/profile/edit`, { interest:interest });
       return response.data;
     } catch (error) {
       throw error.response?.data?.message || error.message || 'Failed to update interests';
     }
   }

export default getData;