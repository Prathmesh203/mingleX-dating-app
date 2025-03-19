import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/AuthServices";
import { useEffect } from "react";
import { IoHome } from "react-icons/io5";
import { IoNotificationsSharp } from "react-icons/io5";
import Notification from "./Notification";
import getData from "../services/profileServices";
import UseUserContext from "../hooks/UseUserContext";
function Navbar() {
  const navigate = useNavigate();
  const { setAuth, user, setUser, requests } = UseUserContext();
  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log(response);
      navigate("/");
      setTimeout(() => {
        setAuth("");
      }, 1);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await getData();

        if (isMounted) {
          setUser(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <div className="flex">
          <a className="btn btn-ghost text-xl hidden md:block">MingleX</a>
          <img src="logo.png" width={"50vw"} />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="btn btn-xs sm:btn-sm md:btn-sm lg:btn-md  "
          onClick={() => {
            navigate("/feed");
          }}
        >
          <IoHome className="text-2xl" />
          </button>
<div className="indicator">
  {requests.length>0 && (
    <span className="indicator-item badge badge-secondary">
      { requests.length}
    </span>
  )}
  <button
    className="btn btn-xs sm:btn-sm md:btn-sm lg:btn-md"
    onClick={() => document.getElementById("my_modal_2").showModal()}
  >
    <IoNotificationsSharp className="text-2xl" />
  </button>
</div>

<dialog id="my_modal_2" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Notifications</h3>
    <div className="py-4">
      <Notification />
    </div>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img alt="Tailwind CSS Navbar component" src={user?user.profile:<span className="loading loading-spinner text-primary"></span>
} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
           <li> <NavLink to={"/ProfilePage"}>Profile</NavLink></li>
            <li>
            <NavLink to={"/settings"}>Settings</NavLink>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
