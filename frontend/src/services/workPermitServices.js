import axios from "axios";

let base_url = "http://localhost:8000/api/work-permit";
export const getAllWorkPermits = async () => {
  let res = await axios.get(base_url + "/get_all_workpermits");

  return res.data;
};

export const getWorkPermitById = async (id) => {
  let res = await axios.get(base_url + "/get_workpermit_by_id/" + id);
  return res.data;
};
