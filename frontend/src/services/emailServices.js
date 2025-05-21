import axios from "axios";

const sendAccountStatusEmail = async (data) => {
  console.log(data);
  let res = await axios.post(
    "http://localhost:8000/api/auth/send-account-status-email",
    data
  );
  return res.data;
};
export default sendAccountStatusEmail;
