const Product = require('../models/Product');

const createProduct = async (productData) => {
  const newProduct = new Product(productData);
  return await newProduct.save();
};

const getAllProducts = async () => {
  return await Product.find();
};

const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, { new: true });
};

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = { createProduct, getAllProducts, updateProduct, deleteProduct };
