const { Table, Area } = require("../models");
const { errorResponse } = require("../util/responseHandle");
const QRCode = require("qrcode");

class TableAreaService {
  async createTable({ name, areaName }) {
    let area;
    let table;
    area = await Area.findOne({ where: { name: areaName } });

    if (!area) {
      area = await Area.create({ name: areaName });
    }

    table = await Table.findOne({ where: { name } });
    if (table) {
      throw new errorResponse({
        message: "Table already exists",
        statusCode: 400,
      });
    }
    table = await Table.create({
      name,
      area_id: area.id,
    });
    return table;
  }

  async findTable({ id }) {
    const table = await Table.findByPk(id);

    if (!table)
      throw new errorResponse({
        message: "Table not found",
        statusCode: 404,
      });

    const area = await Area.findByPk(table.area_id);

    if (!area || area.status === "inactive")
      throw new errorResponse({
        message: "Table not found",
        statusCode: 404,
      });

    if (table.status === "busy")
      throw new errorResponse({
        message: "Table is busy",
        statusCode: 400,
      });

    return table;
  }

  async getTables({ page, limit }) {
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    const offset = page * limit - limit;
    const tables = await Table.findAndCountAll({
      limit,
      offset,
    });
    return {
      list: tables.rows,
      page: {
        maxPage: Math.max(Math.ceil(tables.count / limit), 1),
        currentPage: page,
        limit,
        hasNext: page < Math.max(Math.ceil(tables.count / limit), 1),
        hasPrevious: page > 1,
      },
    };
  }

  async createQRCode({ origin = "", ids = [] }) {
    if (!origin || ids.length === 0)
      throw new errorResponse({
        message: "Origin and ids are required",
        statusCode: 400,
      });

    const qrCodes = [];
    for (let id of ids) {
      const table = await Table.findByPk(id, {
        attributes: ["id", "name"],
        include: {
          model: Area,
          attributes: ["id", "name"],
        },
      });
      const url = `${origin}/${id}`;
      const qrCode = await QRCode.toDataURL(url);
      table.dataValues.qrCode = qrCode;
      qrCodes.push(table);
    }
    return qrCodes;
  }
}

module.exports = new TableAreaService();
