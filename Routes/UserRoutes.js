import express from "express";
import { client } from "../index.js";
import {
  checkEmail,
  deleteUser,
  editUser,
  getAllUsers,
  login,
  registerUser,
} from "../Controllers.js/UserController.js";
import { superAdminGuard, validate } from "../Middleware/Auth.js";
const router = express.Router();

router.get("/", validate, superAdminGuard, getAllUsers);

router.post("/register", registerUser);

router.post("/login", login);

router.post("/deleteUser", validate, superAdminGuard, deleteUser);

router.put("/editUser/:id", validate, superAdminGuard, editUser);

router.post("/checkEmail", checkEmail);

export default router;
