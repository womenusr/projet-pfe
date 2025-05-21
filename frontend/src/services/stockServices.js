import axios from "axios";

let base_url = "http://localhost:8000/api/stocks";

const fetchStocks = async () => {
  const response = await axios.get(base_url + "/get_all_stocks");
  return response.data;
};

const addStock = async (data) => {
  const response = await axios.post(base_url + "/create_stock", data);
  return response.data;
};

export const updateStock = async (id, data) => {
  const response = await axios.put(base_url + "/update_stock/" + id, data);
  return response.data;
};

export default { fetchStocks, addStock };
