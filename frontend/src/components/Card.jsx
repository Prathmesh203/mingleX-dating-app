// Card.jsx
import React from "react";
import UseAuth from "../hooks/UseUserContext";
import { useNavigate } from "react-router-dom";
function Card({ data }) {
  const navigate = useNavigate();
  const {setUserForProfile} = UseAuth();
  const {
    image = data.profile,
    title = data.firstname + " "+ data.lastname ,
    description = data.age && data.age,
    buttonText = "View Profile"
  } = data || {};
  const handleProfile = ()=>{
    setUserForProfile(data);
    navigate('/ProfilePage')
  }
  return (
    <div className="tooltip">
      <div className="tooltip-content">
    <div className="animate-bounce text-orange-400 -rotate-10 text-2xl font-black">swipe</div>
  </div>
    <div className="card bg-base-100 w-96 shadow-2xl shadow-base-300 z-10 hover:border">
      <figure className="px-10 pt-10">
        <img
          src={image}
          alt={title}
          className="rounded-xl"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div className="card-actions">
          <button onClick={handleProfile} className="btn btn-primary">{buttonText}</button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Card;