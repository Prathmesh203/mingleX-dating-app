import {io} from "socket.io-client";
export const createConnection = ()=>{
     return io("http://localhost:3000");
}