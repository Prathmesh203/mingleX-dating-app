import React from 'react'
import UseAuth from '../hooks/UseUserContext'
import { useLocation, Navigate, Outlet } from 'react-router-dom';
function Auth() {
  const {auth} = UseAuth();
  const location = useLocation();
  return (
    
      auth?<Outlet/>:<Navigate to={"/login"} state={{from: location}} replace/>
    
  )
}

export default Auth