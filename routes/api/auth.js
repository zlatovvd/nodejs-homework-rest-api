const express = require("express");
const { validateData, authenticate, upload } = require("../../middlewares");
const { authSchema } = require("../../models/user");
const controller = require("../../controllers/auth");

const router = express.Router();

router.patch("/", authenticate, controller.subscription);

router.post("/register", validateData(authSchema), controller.register);

router.post("/login", validateData(authSchema), controller.login);

router.get("/current", authenticate, controller.current);

router.post("/logout", authenticate, controller.logout);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  controller.updateAvatar
);

module.exports = router;
