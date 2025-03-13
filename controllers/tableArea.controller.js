const TableAreaService = require("../services/tableArea.service");
const { successfullyResponse } = require("../util/responseHandle");

class TableAreaController {
  async createTable(req, res) {
    const { name, area_id } = req.body;
    const table = await TableAreaService.createTable({ name, area_id });
    return new successfullyResponse({
      message: table.message,
      statusCode: 201,
      meta: table.data,
    }).json(res);
  }

  async createArea(req, res) {
    const { name } = req.body;
    const area = await TableAreaService.createArea({ name });
    return new successfullyResponse({
      message: area.message,
      statusCode: 201,
      meta: area.data,
    }).json(res);
  }

  async findTable(req, res) {
    const { id } = req.query;
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

  async getAreas(req, res) {
    const { page, limit } = req.query;
    const areas = await TableAreaService.getAreas({ page, limit });
    return new successfullyResponse({
      message: "Areas found successfully",
      meta: areas,
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

  async updateTable(req, res) {
    const { id, name, area_id } = req.body;
    const table = await TableAreaService.updateTable({ id, name, area_id });

    return new successfullyResponse({
      message: "Table updated successfully",
      meta: table,
    }).json(res);
  }
}

module.exports = new TableAreaController();
