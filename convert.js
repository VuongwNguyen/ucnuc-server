// Backend (Node.js)
const ipp = require('ipp');
const printer = ipp.Printer("http://printer-ip:631/ipp/print");
printer.execute("Get-Printer-Attributes", null, (err, res) => {
    console.log(res); // Danh sách thông tin máy in
   console.log(err)

    
});
