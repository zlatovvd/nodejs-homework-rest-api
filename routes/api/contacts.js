const express = require("express");
const controller = require("../../controllers/contacts");
const {
  validateData,
  validateFavorite,
  isValidId,
  authenticate,
} = require("../../middlewares");
const { addShema, updateShema } = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, controller.getAll);

router.get("/:contactId", authenticate, isValidId, controller.getById);

router.post("/", authenticate, validateData(addShema), controller.add);

router.delete("/:contactId", authenticate, isValidId, controller.remove);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateData(updateShema),
  controller.update
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  validateFavorite(),
  controller.updateStatusContact
);

module.exports = router;
