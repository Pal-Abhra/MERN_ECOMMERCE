const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controllers/productController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/products")
  .get(isAuthenticated, authorizeRoles("admin"), getAllProducts);
//here in authorize roles has a issue
router.route("/product/new").post(isAuthenticated, createProduct);
router
  .route("/product/:id")
  .put(isAuthenticated, updateProduct)
  .delete(isAuthenticated, deleteProduct)
  .get(getProductDetails);

module.exports = router;
