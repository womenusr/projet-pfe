import React, { useEffect, useState } from "react";
import { FaEnvelope, FaTrash, FaStar } from "react-icons/fa";
import adminServices from "../../../services/adminServices.js";
import { toast, ToastContainer } from "react-toastify";
import { Navigate, useNavigate } from "react-router";
import { updateUser } from "../../../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
interface User {
  _id: string;
  username: string;
  image: string;
  friends: string[];
  email: string;
  phone: string;
  role: string;
  city: string;
}

const itemsPerPage = 3;

const UsersManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<
    "admin" | "operationC" | "DepartR" | "HSER" | "HSEA" | "tous"
  >("tous");
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers =
    filterBy != "tous"
      ? users
          .filter((user) =>
            user[filterBy]
              ?.toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
          .slice(startIndex, startIndex + itemsPerPage)
      : users;

  const handleGetUsers = async () => {
    let result: any = await adminServices.getAllUsers();
    console.log(result);
    setUsers(result);
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    await adminServices
      .deleteUser(id)
      .then(() => {
        toast.error("utilisateur supprimé !");
      })
      .then(() => {
        handleGetUsers();
      });
  };
  const navigate = useNavigate();
  const handleChangeUserRole = async (e, id) => {
    let newRole = e.target.value;
    await adminServices.updateUser({ _id: id, role: newRole });
  };

  const handleChangeAccountStatus = async (e, id, email) => {
    let newStatus = e.target.value;
    await adminServices.updateUser({ _id: id, account_status: newStatus });
    await adminServices.sendAccountStatusEmail({ userEmail: email });
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <ToastContainer />
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/create_user")}
          className="px-4 py-2 mb-4 text-white bg-green-600 border border-gray-300 rounded-lg"
        >
          Ajouter un utilisateur
        </button>
      </div>
      <div className="mb-4 flex space-x-2">
        <select
          value={filterBy}
          onChange={(e) =>
            setFilterBy(
              e.target.value as
                | "admin"
                | "OC"
                | "RDEP"
                | "RHSE"
                | "AHSE"
                | "tous"
            )
          }
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous</option>

          <option value="role">Role</option>
          <option value="email">Email</option>
          <option value="address">Addresse</option>
          <option value="name">Nom</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${filterBy}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-center whitespace-no-wrap">
          <tr className="text-center">
            <th></th>
            <th>Image</th>
            <th>Nom</th>

            <th>Role</th>
            <th>status du compte </th>
            <th>Actions</th>
          </tr>
          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b text-center border-gray-200  h-15"
              >
                <td className="text-center">
                  <FaStar color="orange" />
                </td>
                <td className="flex justify-center">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={
                      user.image.includes("static")
                        ? user.image
                        : "http://localhost:8000/" + user.image
                    }
                    alt="Avatar"
                  />
                </td>
                <td className="text-gray-900">{user.username}</td>
                <td className="text-gray-900">
                  <select onChange={(e) => handleChangeUserRole(e, user._id)}>
                    <option defaultChecked value={user.role}>
                      {user.role}
                    </option>
                    {["admin", "RHSE", "AHSE", "RDEP", "OC"]
                      .filter((el) => el != user.role)
                      .map((el) => {
                        return <option value={el}>{el}</option>;
                      })}
                  </select>
                </td>
                <td className=" text-gray-900">
                  <select
                    onChange={(e) =>
                      handleChangeAccountStatus(e, user._id, user.email)
                    }
                    className={
                      user.account_status === "pending"
                        ? "px-2 py-4 rounded bg-orange-500"
                        : user.account_status === "rejected"
                        ? "px-2 py-4 rounded  bg-red-600"
                        : "px-2 py-4 rounded  bg-green-600"
                    }
                  >
                    <option
                      className={
                        user.account_status === "pending"
                          ? "px-2 py-4 rounded  bg-orange-500"
                          : user.account_status === "rejected"
                          ? "px-2 py-4 rounded  bg-red-600"
                          : "px-2 py-4 rounded  bg-green-600"
                      }
                      defaultChecked
                      value={user.account_status}
                    >
                      {user.account_status}
                    </option>
                    {["rejected", "pending", "approved"]
                      .filter((el) => el != user.account_status)
                      .map((el) => {
                        return (
                          <option
                            className={
                              el === "pending"
                                ? "px-2 py-4 rounded  bg-orange-500"
                                : el === "rejected"
                                ? "px-2 py-4 rounded  bg-red-600"
                                : "px-2 py-4 rounded  bg-green-600"
                            }
                            value={el}
                          >
                            {el}
                          </option>
                        );
                      })}
                  </select>
                </td>
                <td className=" text-gray-900">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg"
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <div className="text-gray-600">
          <span>{currentPage}</span>
          <span className="mx-1">/</span>
          <span>{totalPages}</span>
        </div>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg"
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default UsersManagement;
