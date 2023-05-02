const express = require("express");
const controller = require("../../controllers/contacts");
const { validateData, isValidId } = require("../../middlewares");
const {
  addShema,
  updateShema,
  updateFavoriteShema,
} = require("../../Shems/contacts");

const router = express.Router();

router.get("/", controller.getAll);

router.get("/:contactId", isValidId, controller.getById);

router.post("/", validateData(addShema), controller.add);

router.delete("/:contactId", isValidId, controller.remove);

router.put(
  "/:contactId",
  isValidId,
  validateData(updateShema),
  controller.update
);

router.patch(
  "/:contactId/favorite",
  validateData(updateFavoriteShema),
  controller.updateFavorite
);

module.exports = router;
