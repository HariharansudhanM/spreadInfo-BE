import { createHash, getUserbyEmail } from "../helper.js";
import { client } from "../index.js";
import bcrypt from "bcryptjs";

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

    const isPasswordMatch = await bcrypt.compare(
      Password,
      userFromDB.hashPassword
    );
    console.log(isPasswordMatch);
    // if (!isPasswordMatch) {
    //   res.send({ message: "Invalid Credentials" });
    //   return;
    // }
  } catch (error) {}
};

export { getAllUsers, registerUser, login };
