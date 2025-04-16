const TableAreaController = require("../controllers/tableArea.controller");
const asyncHandler = require("../util/asyncHandler");
const { protected, adminVerify } = require("../middlewares/protected");

const router = require("express").Router();


router.get("/findTable", asyncHandler(TableAreaController.findTable));
router.use(protected);
router.use(adminVerify);
router.get("/tables", asyncHandler(TableAreaController.getTables));
router.get("/areas", asyncHandler(TableAreaController.getAreas));
router.post("/createQRCode", asyncHandler(TableAreaController.createQRCode));
router.post("/createTable", asyncHandler(TableAreaController.createTable));
router.post("/createArea", asyncHandler(TableAreaController.createArea));
router.put("/updateTable", asyncHandler(TableAreaController.updateTable));
router.put("/updateArea", asyncHandler(TableAreaController.updateArea));

module.exports = router;
