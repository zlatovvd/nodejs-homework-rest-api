/*
Не получается!!!  Status = 500
*/

const express = require("express");
const request = require("supertest");
const mongoose = require("mongoose");
const controller = require("./auth");

require("dotenv").config();

const { DB_HOST } = process.env;

mongoose.set("strictQuery", true);

const app = express();

app.use(express.json());
app.post("/users/login", controller.login);

describe("test login", () => {
  beforeAll(() => {
    mongoose
      .connect(DB_HOST)
      .then(() => {
        app.listen(3000);
      })
      .catch((error) => {
        console.log("ERROR", error.message);
        process.exit(1);
      });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("get token", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({ email: "nulla.ante@vestibul.co.uk", password: "111111" });

    console.log("response STATUS", response.status);
  });
});
