const URL = import.meta.env.VITE_URL;
import axios from "axios";
const sendRequest = async (status, userId) => {
  try {
    const response = await axios.post(
      `${URL}/request/${status}/${userId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw new Error("Send request Failed, something went wrong");
    ;
  }
};

export const getRequests = async () => {
  try {
    const response = await axios.get(`${URL}/user/connections`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw new Error("Unable to show Notifications");
  }
};
export const respondRequest = async (status, requestId) => {
     try {
          
          const response = await axios.post(
            `${URL}/request/user/${status}/${requestId}`,
            {},
            {
              withCredentials: true,
            }
          );
          return response.data;
        } catch (error) {
          console.error("Error updating user status:", error);
          throw new Error("Unable to show Notifications");
        }
};

 export const getUserConnections = async()=>{
  try {
    const response = await axios.get(`${URL}/user/request`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw new Error("Unable to show Notifications");
    
  }
}
export default sendRequest;
