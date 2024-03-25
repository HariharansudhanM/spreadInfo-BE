import jwt from "jsonwebtoken";
import { client } from "../index.js";

const validate = async (req, res, next) => {
  try {
    let token = req?.headers?.authorization?.split(" ")[1];

    if (token) {
      let data = jwt.verify(token, process.env.SECRET_KEY);
      //   console.log(data);
      let user = await client
        .db("Spread_Info")
        .collection("Users")
        .findOne({ id: data.id });

      console.log(user);
      if (user) {
        if (Math.floor(+new Date() / 1000) <= data.exp) {
          req.headers.user = user;
          console.log("Validate done");
          next();
        } else {
          res.status(401).send({
            message: "Session Expired",
          });
        }
      } else {
        res.status(401).send({
          message: "Unauthorised Access",
        });
      }
    } else {
      res.status(401).send({
        message: "Unauthorised Access",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

const superAdminGuard = async (req, res, next) => {
  try {
    let token = req?.headers?.authorization?.split(" ")[1];

    if (token) {
      let data = jwt.verify(token, process.env.SECRET_KEY);
      let user = req.headers.user;

      console.log(user);
      if (user.Role === "Admin" && data.Role === "Admin") {
        next();
      } else {
        res.status(401).send({
          message: "Unauthorised Access",
        });
      }
    } else {
      res.status(401).send({
        message: "Unauthorised Access",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

export { validate, superAdminGuard };
