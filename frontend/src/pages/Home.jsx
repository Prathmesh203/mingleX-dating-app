import React  from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import UseUserContext from "../hooks/UseUserContext";
function Home() {
  const navigate = useNavigate();
  function handleLogin() {
    navigate("/login");
  }
  function handleSignup() {
    navigate("/signup");
  }
  const {auth,setAuth} = UseUserContext();
  useEffect(() => {
   
    const cookies = document.cookie.split(';').reduce((cookiesObj, cookie) => {
      const [name, value] = cookie.trim().split('=');
      cookiesObj[name] = value;
      return cookiesObj;
    }, {});
    
    
    const hasAuthCookie = cookies['authToken'] !== undefined;
    
   
    const hasAuthLocal = localStorage.getItem('auth') !== null;
    
    if (!hasAuthCookie && !hasAuthLocal) {
     
      setAuth({});  
    } 
     if (auth.token) {
    
      navigate('/feed');
    }
  }, []);


  return (
    <div className="w-full h-screen bg-[#FF6F61] overflow-hidden">
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-around p-8 md:p-16">
        <div className="text-white w-[30vw]  text-center  mb-8 md:mb-0 flex flex-col gap-[10px] md:items-center  ">
          <div className="w-full flex">
            <img src="logo.png" alt="" width={"100px"} />
            <h1 className="text-5xl md:text-7xl font-serif relative right-[15px] top-[5px] ">
              {" "}
              ingleX
            </h1>
          </div>
          <div className=" flex gap-[20px]">
            <button
              className="btn btn-sm sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
              onClick={handleLogin}
            >
              
              Login
            </button>
            <button
              className="btn btn-sm sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
              onClick={handleSignup}
            >
              Signup
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <img
            src={"LandingPage.png"}
            alt="Dating App Interface"
            className="max-h-full  object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
