const TableAreaController = require("../controllers/tableArea.controller");
const asyncHandler = require("../util/asyncHandler");
const { protected, adminVerify } = require("../middlewares/protected");

const router = require("express").Router();

router.post("/create", asyncHandler(TableAreaController.createTable));
router.get("/:id", asyncHandler(TableAreaController.findTable));
router.get("/", asyncHandler(TableAreaController.getTables));

module.exports = router;
