import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import adminServices from "../../../services/AdminServices";

const AddUser: React.FC = () => {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("eleve"); // Default role
  const [city, setCity] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("login", login);
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("role", role);
    formData.append("city", city);
    if (image) {
      formData.append("image", image);
    }

    try {
      await adminServices.createUser(formData);
      toast.success("Utilisateur ajouté avec succès !");
      navigate("/admin_dashboard/users");
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'ajout de l'utilisateur.");
      console.error(error);
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Ajouter un utilisateur</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* First Row - Three inputs: Nom, Login, Téléphone */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Login</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Login"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Téléphone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Téléphone"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Second Row - Three inputs: Rôle, Ville, Image */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Rôle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="enseignant">Enseignant</option>
              <option value="eleve">Elève</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Ville</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ville"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Image</label>
            <input
              type="file"
              onChange={(e) =>
                setImage(e.target.files ? e.target.files[0] : null)
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-row justify-center items-center">
          <button
            type="submit"
            className="w-1/4 px-4 py-2 text-white bg-green-600 border border-gray-300 rounded-lg"
          >
            Ajouter utilisateur
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
