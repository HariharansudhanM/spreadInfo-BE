import express from "express";
import userRouter from "./UserRoutes.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send(`<h1>Welcome to WebService</h1>`);
});

router.use("/users", userRouter);

export default router;
