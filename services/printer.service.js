const ThermalPrinter = require("node-thermal-printer").printer;
const Types = require("node-thermal-printer").types;
const { errorResponse } = require("../util/responseHandle");

// Khởi tạo máy in
async function printBill() {
  let printer = new ThermalPrinter({
    type: Types.EPSON, // Loại máy in (EPSON hoặc STAR, tùy model)
    interface: `tcp://192.168.1.250:9100`, // Địa chỉ IP và cổng
    characterSet: "SLOVENIA", // Bộ ký tự (có thể cần điều chỉnh nếu in tiếng Việt)
    removeSpecialCharacters: false, // Giữ ký tự đặc biệt
    lineCharacter: "=", // Ký tự đường kẻ
  });

  try {
    // Kiểm tra máy in có sẵn sàng không
    let isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      throw new e();
    }

    // Thiết kế nội dung bill
    printer.alignCenter();
    printer.println("*** CỬA HÀNG ABC ***");
    printer.println("Địa chỉ: 123 Đường Láng, Hà Nội");
    printer.println("Hotline: 0123 456 789");
    printer.drawLine();

    printer.alignLeft();
    printer.println("Hóa đơn bán hàng");
    printer.println("Ngày: " + new Date().toLocaleString());
    printer.drawLine();

    // Bảng danh sách sản phẩm
    printer.tableCustom([
      { text: "Sản phẩm", align: "LEFT", width: 0.5 },
      { text: "SL", align: "CENTER", width: 0.2 },
      { text: "Giá", align: "RIGHT", width: 0.3 },
    ]);
    printer.tableCustom([
      { text: "Cà phê sữa", align: "LEFT", width: 0.5 },
      { text: "2", align: "CENTER", width: 0.2 },
      { text: "30,000", align: "RIGHT", width: 0.3 },
    ]);
    printer.tableCustom([
      { text: "Trà đào", align: "LEFT", width: 0.5 },
      { text: "1", align: "CENTER", width: 0.2 },
      { text: "25,000", align: "RIGHT", width: 0.3 },
    ]);
    printer.drawLine();

    // Tổng tiền
    printer.alignRight();
    printer.println("Tổng cộng: 55,000 VND");
    printer.drawLine();

    // Lời cảm ơn
    printer.alignCenter();
    printer.println("Cảm ơn quý khách!");
    printer.println("Hẹn gặp lại!");
    printer.newLine();

    // Cắt giấy (nếu máy in hỗ trợ)
    printer.cut();

    // Gửi lệnh in
    await printer.execute();
    console.log("In hóa đơn thành công!");
  } catch (error) {
    console.error("Lỗi khi in:", error);
  }
}

class PrinterService {
  async printBill({}) {
    try {
      await printBill();
      return {
        message: "Đã gửi yêu cầu đến máy in",
        statusCode: 200,
      };
    } catch (error) {
      throw new errorResponse({
        message: "Lỗi khi gửi yêu cầu đến máy in",
        statusCode: 500,
      });
    }
  }
}

module.exports = new PrinterService();
