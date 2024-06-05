import { client } from "../index.js";

const createBlog = async (req, res) => {
  try {
    const blogData = req.body;

    const data = await client
      .db("Spread_Info")
      .collection("Blogs")
      .find({})
      .toArray();

    const id = data.length + 1;
    blogData["id"] = id;

    const result = await client
      .db("Spread_Info")
      .collection("Blogs")
      .insertOne(blogData);
    //   console.log(results);
    res.status(200).send({ message: `updated successfully`, result });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

const editBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const Id = Number(id);

    const blogData = req.body;

    const result = await client
      .db("Spread_Info")
      .collection("Blogs")
      .updateOne({ id: Id }, { $set: blogData });
    res.status(200).send({ message: `Blog updated successfully`, result });
  } catch (error) {
    res.status(500).send({ message: error.message || `Internal server error` });
  }
};
const getBlogs = async (req, res) => {
  try {
    const result = await client
      .db("Spread_Info")
      .collection("Blogs")
      .find({})
      .toArray();
    res.status(200).send({ message: `Blogs fetched`, result });
  } catch (error) {
    res.status(500).send({ message: error.message || `Internal server error` });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const Id = Number(id);
    console.log(typeof Id);

    const result = await client
      .db("Spread_Info")
      .collection("Blogs")
      .deleteOne({ id: Id });

    res.status(200).send({ message: `Blogs deleted`, result });
  } catch (error) {
    res.status(500).send({ message: error.message || `Internal server error` });
  }
};

export { createBlog, editBlog, getBlogs, deleteBlog };
