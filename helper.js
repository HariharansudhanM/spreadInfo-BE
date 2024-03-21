import { client } from "./index.js";
import bcrypt from "bcryptjs";

async function getUserbyEmail(email) {
  return await client
    .db("Spread_Info")
    .collection("Users")
    .findOne({ Email: email });
}

const createHash = async (Password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(Password, salt);
  return hashPassword;
};

export { getUserbyEmail, createHash };
