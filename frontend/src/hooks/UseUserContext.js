import { useContext } from "react";
import AuthContext from "../context/userContext";

const UseUserContext = ()=>{
     return useContext(AuthContext);
}
export default UseUserContext;