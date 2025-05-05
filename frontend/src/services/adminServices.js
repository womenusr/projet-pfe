import axios from "axios";
import { toast } from "react-toastify";
let api_url = "http://localhost:8000/api";

const getAllUsers = async () => {
  try {
    let result = await axios.get(api_url + "/users/get_all_users");
    return result.data;
  } catch (err) {
    throw err;
  }
};

const deleteUser = async (id) => {
  try {
    let result = await axios.delete(api_url + "/users/delete_user/" + id);
  } catch (err) {
    throw err;
  }
};

const updateUser = async (data) => {
  console.log(data._id);
  try {
    const response = await axios.put(
      `http://localhost:8000/api/auth/update_user/${data._id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export default { getAllUsers, deleteUser, updateUser };
