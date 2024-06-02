import { createHash, getUserbyEmail } from "../helper.js";
import { client } from "../index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getAllUsers = async (req, res) => {
  const results = await client
    .db("Spread_Info")
    .collection("Users")
    .find({})
    .toArray();

  console.log(results);
  res.send(results);
};

const registerUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    console.log(Email, Password);
    const isUserExist = await getUserbyEmail(Email);
    console.log(isUserExist);
    if (isUserExist) {
      res.status(400).send({ message: "Username already exists" });
      return;
    }

    if (
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#$_&%]).{8,}$/g.test(Password)
    ) {
      res.status(400).send({ message: "Password pattern doesn't match" });
      return;
    }
    const hashPassword = await createHash(Password);
    console.log(hashPassword);
    const uploadData = req.body;
    uploadData["hashPassword"] = hashPassword;

    const totalAccounts = await client
      .db("Spread_Info")
      .collection("Users")
      .find({})
      .toArray();
    const id = totalAccounts.length + 1;
    // console.log("" + id);
    uploadData["id"] = "" + id;

    const result = await client
      .db("Spread_Info")
      .collection("Users")
      .insertOne(uploadData, { Password: hashPassword });

    res.status(200).send({
      message: "User Created Successfully" || result,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const userFromDB = await getUserbyEmail(Email);
    if (!userFromDB) {
      res.send({ message: "Invalid Credentials" });
      return;
    }
    // console.log(userFromDB);
    const isPasswordMatch = await bcrypt.compare(
      Password,
      userFromDB.hashPassword
    );
    // console.log(isPasswordMatch);
    if (!isPasswordMatch) {
      res.status(401).send({ message: "Invalid Credentials" });
      return;
    }

    const token = jwt.sign(
      {
        _id: userFromDB._id,
        id: userFromDB.id,
        Name: userFromDB.Name,
        Email: Email,
        Role: userFromDB.Role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "10m" }
    );
    res.status(200).send({
      message: "Successfully Logged In",
      token: token,
      Role: userFromDB.Role,
      Name: userFromDB.Name,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { Email } = req.body;
    console.log(Email);
    const isUserExist = await getUserbyEmail(Email);
    // console.log(`test`);
    if (!isUserExist) {
      res.status(404).send({ message: `user doesn't exist` });
      return;
    }

    const results = await client
      .db("Spread_Info")
      .collection("Users")
      .deleteOne({ Email: Email });

    res.status(200).send({ message: `User deleted successfully`, results });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;

    const result = await client
      .db("Spread_Info")
      .collection("Users")
      .updateOne({ id: id }, { $set: userData });
    res.status(200).send({ message: `user updated successfully`, result });
  } catch (error) {
    res.status(500).send({ message: error.message || `Internal server error` });
  }
};
export { getAllUsers, registerUser, login, deleteUser, editUser };
