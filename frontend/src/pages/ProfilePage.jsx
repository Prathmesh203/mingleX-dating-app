import React from "react";
import { useNavigate } from "react-router-dom";
import UseUserContext from "../hooks/UseUserContext";
import EditInfo from "../components/EditInfo";
function ProfilePage() {
  const { user, userForProfile, setUserForProfile, setEditInfo } =
    UseUserContext();
  const navigate = useNavigate();

  if (!user?.profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex w-52 flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
            <div className="flex flex-col gap-4">
              <div className="skeleton h-4 w-20"></div>
              <div className="skeleton h-4 w-28"></div>
            </div>
          </div>
          <div className="skeleton h-32 w-full"></div>
        </div>{" "}
      </div>
    );
  }
  const handleClose = () => {
    setUserForProfile(null);
    navigate("/feed");
  };
  const handleName = () => {
    setEditInfo("name");
    document.getElementById("my_modal_5").showModal();
  };
  const handlePassword = () => {
    document.getElementById("my_modal_5").showModal();
    setEditInfo("password");
  };
  const handleProfileInfo = () => {
    document.getElementById("my_modal_5").showModal();
    setEditInfo("profile");
  };
  const handleInterest = () => {
    document.getElementById("my_modal_5").showModal();
    setEditInfo("interest");
  };

  return (
    <div>
      {!userForProfile || !userForProfile.profile ? (
        <div className="flex flex-col w-full min-h-screen">
          <div className="flex flex-col items-center px-4 py-8 max-w-2xl mx-auto w-full">
            <div className=" rounded-lg shadow-md p-6 w-full">
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 mb-4 rounded-full overflow-hidden">
                  <img
                    src={user.profile || "/default-profile.png"}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <h1 className="text-2xl font-bold">
                  {user.firstname} {user.lastname}
                </h1>
              </div>
              <div className="space-y-4 mb-6">
                <div className="border-b pb-3">
                  <h2 className="text-lg font-semibold  mb-2">Bio</h2>
                  <p>{user.bio || "No bio added yet"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b pb-3">
                  <div>
                    <h2 className="text-lg font-semibold  mb-1">Age</h2>
                    <p>{user.age || "Not specified"}</p>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold  mb-1">Gender</h2>
                    <p>{user.gender || "Not specified"}</p>
                  </div>
                </div>
                <div className="border-b pb-3 ">
                  <h2 className="text-lg font-semibold mb-2">Your Interests</h2>
                  {user.interest && user.interest.length > 0 ? (
                    <ul className="list bg-base-100 rounded-box shadow-md">
                      {user.interest.map((keys) => {
                        return <li key={user._id}>{keys}</li>;
                      })}
                    </ul>
                  ) : (
                    <p>No interests added yet</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg "
                  onClick={handleName}
                >
                  Edit Name
                </button>
                <button
                  className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg "
                  onClick={handlePassword}
                >
                  Update Passsword
                </button>
                <button
                  className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg "
                  onClick={handleProfileInfo}
                >
                  Update Profile Info
                </button>
                <button
                  className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg   "
                  onClick={handleInterest}
                >
                  Add More Interest
                </button>
                <EditInfo />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content flex-col lg:flex-row">
            <img
              src={userForProfile.profile}
              className="max-w-sm rounded-lg shadow-2xl"
            />
            <div>
              <h1 className="text-2xl text-center font-bold">
                {userForProfile.firstname + " " + userForProfile.lastname}
              </h1>
              <div>
                <h1 className=" text-center font-medium">
                  {userForProfile.age && "Age is " + userForProfile.age}
                </h1>
                <h1 className=" text-center font-medium">
                  {userForProfile.gender &&
                    "Gender is " + userForProfile.gender}
                </h1>
                <h1 className=" text-center font-bold">
                  {userForProfile.bio !== "enter your Bio" &&
                    userForProfile.bio}
                </h1>
                <div className="w-[50vw] border h-[30vh] overflow-scroll ">
                  <ul>
                    {userForProfile.interest.length !== 0
                      ? userForProfile.interest.map((keys) => {
                          return <li key={keys}>{keys}</li>;
                        })
                      : "No Interests added"}
                  </ul>
                </div>
              </div>
              <button onClick={handleClose} className="btn btn-primary">
                CLose Profile{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
