// import Login from "./Login.jsx"
import express from "express";
import mongoose from "mongoose";
import workPermitRoutes from "./routes/workPermitRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import stocksRoutes from "./routes/stockRoutes.js";
import hotWorkPermitRoutes from "./routes/hotWorkPermitRoutes.js";
import patrolRoutes from "./routes/patrolsRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import sendLowStockEmail from "./helpers/sendLowStockEmail.js";

// rest api
// ===> representational state transfert
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let server = express();
// localhost:8000/eleves
server.use(cors());
server.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/my_database")
  .then(() => {
    console.log("database connecté");
  })
  .catch((err) => {
    console.log(err);
  });

server.use("/api/work-permit", workPermitRoutes);
server.use("/api/auth", authRoutes);
server.use("/api/users", usersRoutes);
server.use("/api/stocks", stocksRoutes);
server.use("/api/hot-work-permits", hotWorkPermitRoutes);
server.use("/api/patrols", patrolRoutes);
server.use("/uploads", express.static(path.join(__dirname, "uploads")));
//server.use('/api/emails',emailRoutes)
server.listen(8000, () => {
  sendLowStockEmail("najlaouibasmasv@gmail.com");

  console.log("serveur en marche ya basma !");
});

/*

mongodb://localhost:27017/

*/
//http:// localhost:5173
