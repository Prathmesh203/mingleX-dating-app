import React, { useState } from "react";
import UseUserContext from "../hooks/UseUserContext";
import {
  updateName,
  updateInterests,
  updatePassword,
  updateProfileInfo,
} from "../services/profileServices";

function EditInfo() {
  const { user, editInfo, setEditInfo, setUser } = UseUserContext();
  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
    age: user?.age || "",
    gender: user?.gender || "",
    bio: user?.bio || "",
    birthdate: user?.birthdate || "",
    interest: "", // Single interest input
  });

  const [interests, setInterests] = useState(user?.interest || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addInterest = () => {
    const newInterest = formData.interest.trim().toLowerCase();

    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setFormData({ ...formData, interest: "" }); 
    }
  };

  const removeInterest = (index) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (editInfo === "name") {
        const response = await updateName(formData.firstname, formData.lastname);
        if (response) {
          setUser((prev) => ({
            ...prev,
            firstname: formData.firstname,
            lastname: formData.lastname,
          }));
          setMessage("Name updated successfully");
        }
      } else if (editInfo === "password") {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }

        const response = await updatePassword(
          formData.email,
          formData.password,
          formData.confirmPassword
        );

        if (response) {
          setMessage("Password updated successfully");
          setFormData({ ...formData, password: "", confirmPassword: "" });
        }
      } else if (editInfo === "profile") {
        const response = await updateProfileInfo(
          formData.age,
          formData.gender,
          formData.bio,
          formData.birthdate
        );

        if (response?.data) {
          setUser((prev) => ({
            ...prev,
            age: formData.age,
            gender: formData.gender,
            bio: formData.bio,
            birthdate: formData.birthdate,
          }));
          setMessage("Profile updated successfully");
        }
      } else if (editInfo === "interest") {
        const response = await updateInterests(interests);

        if (response?.data) {
          setUser((prev) => ({
            ...prev,
            interest: interests,
          }));
          setMessage("Interests updated successfully");
        }
      }

      setEditInfo("");
      document.getElementById("my_modal_5").close();
    } catch (error) {
      setError(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Profile</h3>

          {message && <div className="alert alert-success mb-4">{message}</div>}
          {error && <div className="alert alert-error mb-4">{error}</div>}

          {editInfo === "name" && (
            <>
              <legend className="fieldset-legend">Enter Your Firstname</legend>
              <input type="text" name="firstname" className="input w-full mb-3" placeholder="First name" value={formData.firstname} onChange={handleChange} />
              <legend className="fieldset-legend">Enter Your Lastname</legend>
              <input type="text" name="lastname" className="input w-full" placeholder="Last name" value={formData.lastname} onChange={handleChange} />
            </>
          )}

          {editInfo === "password" && (
            <>
              <legend className="fieldset-legend">Enter Your Email</legend>
              <input type="email" name="email" className="input w-full mb-3" placeholder="Email" value={formData.email} onChange={handleChange} />
              <legend className="fieldset-legend">Enter Your New Password</legend>
              <input type="password" name="password" className="input w-full mb-3" placeholder="New Password" value={formData.password} onChange={handleChange} />
              <legend className="fieldset-legend">Confirm Your New Password</legend>
              <input type="password" name="confirmPassword" className="input w-full" placeholder="Confirm New Password" value={formData.confirmPassword} onChange={handleChange} />
              <p className="text-xs mt-2 text-gray-500">Password must be strong (include uppercase, lowercase, numbers, and special characters)</p>
            </>
          )}

          {editInfo === "profile" && (
            <>
              <legend className="fieldset-legend">Enter Your Age</legend>
              <input type="number" name="age" className="input w-full mb-3" placeholder="Age" value={formData.age} onChange={handleChange} />
              <legend className="fieldset-legend">Enter Your Gender</legend>
              <select name="gender" className="select w-full mb-3" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              <legend className="fieldset-legend">Enter Your Bio</legend>
              <textarea name="bio" className="textarea w-full mb-3" placeholder="Bio" value={formData.bio} onChange={handleChange} rows="3"></textarea>
              <legend className="fieldset-legend">Enter Your Birthdate</legend>
              <input type="date" name="birthdate" className="input w-full" value={formData.birthdate} onChange={handleChange} />
            </>
          )}

          {editInfo === "interest" && (
            <>
              <legend className="fieldset-legend">Enter Your Interests</legend>
              <div className="flex gap-2 mb-2">
                <input type="text" name="interest" className="input flex-grow" placeholder="Add an interest" value={formData.interest} onChange={handleChange} />
                <button className="btn btn-primary" onClick={addInterest}>Add</button>
              </div>

              <div className="flex flex-wrap gap-2 my-3">
                {interests.map((interest, index) => (
                  <div key={index} className="badge badge-primary badge-lg gap-2">
                    {interest}
                    <button onClick={() => removeInterest(index)} className="btn btn-xs btn-circle">×</button>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="modal-action">
            <button className="btn" onClick={() => document.getElementById("my_modal_5").close()}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default EditInfo;
