const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
//Create Product --Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body);
  req.body.user = req.user.id;
  // console.log(req.body);
  // issue in product model
  // console.log(product);
  res.status(201).json({
    success: true,
    product,
  });
});

//Get All Products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.user.id);
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apiFeature.query;
  res.status(200).json({ success: true, products, productCount });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product is not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//Update Product --Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product --Admin

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByIdAndRemove(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  // const deletedProduct = await Product.deleteOne({ id: req.params.id });

  res.status(200).json({
    success: true,
  });
});

//Create new Reviw orupdate the review
// exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
//   const { rating, comment, productId } = req.body;
//   const review = {
//     user_id: req.user.id,
//     name: req.user.name,
//     rating: Number(rating),
//     comment,
//   };
//   // console.log(req.user.id);
//   const product = await Product.findById(productId);
//   const isReviewed = product.reviews.find(
//     (rev) => rev.user.toString() === req.user.id.toString()
//   );
//   if (isReviewed) {
//     product.reviews.forEach((rev) => {
//       if (rev.user.toString() === req.user.id.toString())
//         (rev.rating = rating), (rev.comment = comment);
//     });
//   } else {
//     product.reviews.push(review);
//     product.numOfReviews = product.reviews.length;
//   }

//   let avg = 0;
//   product.ratings =
//     product.reviews.forEach((rev) => {
//       avg += rev.rating;
//     }) / product.reviews.length;

//   await product.save({
//     validateBeforesave: false,
//   });
//   res.status(200).json({
//     success: true,
//   });
// });

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id, // Corrected the user field
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    // Update the existing review
    isReviewed.rating = rating;
    isReviewed.comment = comment;
  } else {
    // Add a new review
    product.reviews.push(review);
  }

  product.numOfReviews = product.reviews.length;

  // Calculate the average rating
  product.ratings =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
        product.reviews.length
      : 0;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//Get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//Delete reviews of a product
exports.deleteProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg / reviews.length;

  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
  });
});
