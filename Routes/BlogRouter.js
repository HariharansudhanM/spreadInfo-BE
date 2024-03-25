import express from "express";
import {
  createBlog,
  deleteBlog,
  editBlog,
  getBlogs,
} from "../Controllers.js/BlogController.js";

const router = express.Router();

router.post("/createBlog", createBlog);

router.put("/editBlog/:id", editBlog);

router.get("/", getBlogs);

router.delete("/:id", deleteBlog);

export default router;
