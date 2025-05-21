import axios from "axios";

const API_URL = "http://localhost:8000/api/patrols";

const getAllPatrols = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getPatrolById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createPatrol = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const updatePatrol = async (id, formData) => {
  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const updatePatrolStatus = async (id, data) => {
  const response = await axios.put(
    `${API_URL}/update_patrol_status/${id}`,
    data
  );
  return response.data;
};

const deletePatrol = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export default {
  getAllPatrols,
  getPatrolById,
  createPatrol,
  updatePatrol,
  deletePatrol,
  updatePatrolStatus,
};
