const express = require("express");
const { validateData, authenticate } = require("../../middlewares");
const { authSchema } = require("../../models/user");
const controller = require("../../controllers/auth");

const router = express.Router();

router.patch("/", authenticate, controller.subscription);

router.post("/register", validateData(authSchema), controller.register);

router.post("/login", validateData(authSchema), controller.login);

router.get("/current", authenticate, controller.current);

router.post("/logout", authenticate, controller.logout);

module.exports = router;
