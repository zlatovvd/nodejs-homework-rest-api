const express = require("express");
const { validateData } = require("../../middlewares");
const { authSchema } = require("../../models/user");
const controller = require("../../controllers/auth");

const router = express.Router();

router.post(
  "/register",
  validateData(authSchema),
  controller.register
);

module.exports = router;
