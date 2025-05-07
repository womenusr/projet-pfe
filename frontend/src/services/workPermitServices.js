import axios from "axios";

let base_url = "http://localhost:8000/api/work-permit";
export const getAllWorkPermits = async () => {
  let res = await axios.get(base_url + "/get_all_workpermits");

  return res.data;
};
