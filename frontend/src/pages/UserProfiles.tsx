import React, { useEffect, useState } from "react";
import {
  BsPerson,
  BsEnvelope,
  BsBriefcase,
  BsLock,
  BsKey,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/slices/authSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const { password, ...userWithoutPassword } = user;
    setUserData({ ...userWithoutPassword, password: null });
  }, [user]);

  const handleInputChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(userData);
    const formData = new FormData();
    formData.append("_id", userData._id);
    formData.append("username", userData.username);
    formData.append("email", userData.email);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (userData.password) {
      formData.append("password", userData.password);
    }

    try {
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const response = await dispatch(updateUser(formData));
      console.log("Profile updated successfully:", response);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-2xl">
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src={
              imageFile
                ? URL.createObjectURL(imageFile)
                : "http://localhost:8000/" + `${user.image}`
            }
            alt="Profile"
            className="w-28 h-28 rounded-full shadow-md border-4 border-primary object-cover"
          />
          {isEditing && (
            <label className="absolute -bottom-3 right-0 bg-primary text-white px-3 py-1 text-xs rounded-full cursor-pointer hover:bg-primary-dark transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              Modifier
            </label>
          )}
        </div>
        <h2 className="text-3xl font-bold mt-4 text-gray-800">
          {userData.username}
        </h2>
        <p className="text-gray-500 mt-1">
          {userData.role === "admin"
            ? "Administrateur"
            : userData.role === "hse"
            ? "hse"
            : "hse"}
        </p>
      </div>

      <form
        onSubmit={handleUpdate}
        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* First Name */}
        <div className="relative">
          <BsPerson className="absolute top-3 left-4 text-gray-400" size={20} />
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Prénom"
            className={`w-full pl-12 py-3 rounded-xl border ${
              isEditing ? "bg-gray-50" : "bg-gray-100 cursor-not-allowed"
            } focus:ring-2 focus:ring-primary-light focus:outline-none`}
          />
        </div>

        {/* Last Name */}

        {/* Email */}
        <div className="relative col-span-full">
          <BsEnvelope
            className="absolute top-3 left-4 text-gray-400"
            size={20}
          />
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Adresse e-mail"
            className={`w-full pl-12 py-3 rounded-xl border ${
              isEditing ? "bg-gray-50" : "bg-gray-100 cursor-not-allowed"
            } focus:ring-2 focus:ring-primary-light focus:outline-none`}
          />
        </div>

        {/* Password */}
        {isEditing && (
          <div className="relative col-span-full">
            <BsLock className="absolute top-3 left-4 text-gray-400" size={20} />
            <input
              type="password"
              name="password"
              value={userData.password || ""}
              onChange={handleInputChange}
              placeholder="Nouveau mot de passe (optionnel)"
              className="w-full pl-12 py-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-primary-light focus:outline-none"
            />
          </div>
        )}
      </form>

      {/* Button */}
      <div className="mt-8 text-center">
        {isEditing ? (
          <button
            onClick={handleUpdate}
            className="px-8 py-3 bg-green-500 text-white font-semibold rounded-xl shadow hover:bg-green-600 transition duration-200"
          >
            Sauvegarder les changements
          </button>
        ) : (
          <button
            onClick={toggleEditMode}
            className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow hover:bg-blue-600 transition duration-200"
          >
            Éditer le profil
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
