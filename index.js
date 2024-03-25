import express from "express";
import * as dotenv from "dotenv";
import routerhub from "./Routes/RouteHub.js";
import { MongoClient } from "mongodb";

dotenv.config();
const app = express();
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Hello Everyone");
// });

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;
// console.log(MONGO_URL);
// "mongodb://127.0.0.1:27017"
// "mongodb://localhost:27017"

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongodb is connected");
  return client;
}
export const client = await createConnection();

app.use(routerhub);

app.listen(PORT, () => {
  console.log("WebService kickstarted");
});
