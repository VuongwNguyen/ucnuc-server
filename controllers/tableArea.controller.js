const TableAreaService = require("../services/tableArea.service");
const { successfullyResponse } = require("../util/responseHandle");

class TableAreaController {
  async createTable(req, res) {
    const { name, areaName } = req.body;
    const table = await TableAreaService.createTable({ name, areaName });
    return new successfullyResponse({
      message: "Table created successfully",
      statusCode: 201,
      meta: table,
    }).json(res);
  }

  async findTable(req, res) {
    const { id } = req.params;
    const table = await TableAreaService.findTable({ id });
    return new successfullyResponse({
      message: "Table found successfully",
      meta: table,
    }).json(res);
  }

  async getTables(req, res) {
    const { page, limit } = req.query;
    const tables = await TableAreaService.getTables({ page, limit });
    return new successfullyResponse({
      message: "Tables found successfully",
      meta: tables,
    }).json(res);
  }

  async createQRCode(req, res) {
    const { origin, ids } = req.body;
    const qrCode = await TableAreaService.createQRCode({ origin, ids });
    return new successfullyResponse({
      message: "QR Code created successfully",
      meta: qrCode,
    }).json(res);
  }
}

module.exports = new TableAreaController();
