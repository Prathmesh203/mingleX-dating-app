import axios from "axios";
const URL = import.meta.env.VITE_URL;
const fetchUserFeed = async (page = 1, limit = 10) => {
     try {
       
       const response = await axios.get(`${URL}/user/feed`, {
         params: {
           page: page,
           limit: limit
         },
        withCredentials:true
       });
       
       return response.data;
     } catch (error) {
       console.error('Error fetching user feed:', error);
       throw error;
     }
   };

   export default fetchUserFeed;