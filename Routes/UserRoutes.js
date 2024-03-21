import express from "express";
import { client } from "../index.js";
import {
  getAllUsers,
  login,
  registerUser,
} from "../Controllers.js/UserController.js";
const router = express.Router();

router.get("/", getAllUsers);

router.post("/register", registerUser);

router.use("/login", login);

export default router;
