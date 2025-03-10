// const xlsx = require("xlsx");
// const fs = require("fs");
// const workbook = xlsx.readFile("Book1.xlsx");

// const sheet_name_list = workbook.SheetNames[1];
// const data = workbook.Sheets[sheet_name_list];

// const json = xlsx.utils.sheet_to_json(data);

// fs.writeFileSync("output.json", JSON.stringify(json, null, 2));

// console.log(json);

const rootArr = [1, 2, 3, 4, 5];
const arr = [1, 2, 3];
const newArr = rootArr.filter((item) => !arr.includes(item));

console.log(newArr);