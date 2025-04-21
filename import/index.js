const { Product, Category, Topping, Sku } = require("../models");
const prod = require("./product.json");
const cate = require("./category.json");

function createCategory() {
  Category.bulkCreate(cate, { ignoreDuplicates: true })
    .then(() => {
      console.log("Categories created successfully.");
    })
    .catch((error) => {
      console.error("Error creating categories:", error);
    });
}
// createCategory();
function createProduct() {
  // sau mỗi từ cách ra thì viết hoa chữ cái đầu tiên
  // ví dụ: "hello world" => "Hello World"
  const products = prod.map((item) => {
    const name = item.name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return { ...item, name };
  });

  products.forEach((item) => {
    Product.create(item)
      .then((p) => {
        if (item?.skus?.length > 0) {
          const skus = item.skus.map((sku) => {
            sku.product_id = p.id;
            return sku;
          });
          Sku.bulkCreate(skus, { ignoreDuplicates: true })
            .then(() => {
              console.log("Skus created successfully.");
            })
            .catch((error) => {
              console.error("Error creating skus:", error);
            });
        }

        console.log("Products created successfully.");
      })
      .catch((error) => {
        console.error("Error creating products:", error);
      });
  });
}

createProduct();
