const Product = require('../models/Product');

// Crear producto
const createProduct = async (productData) => {
  const newProduct = new Product(productData);
  return await newProduct.save();
};

// Obtener todos los productos
const getAllProducts = async () => {
  return await Product.find();
};

// Obtener producto por id
const getProductById = async (id) => {
  return await Product.findById(id);
};

// Actualizar producto por id
const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, { new: true });
};

// Eliminar producto por id
const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {createProduct, getAllProducts, getProductById, updateProduct, deleteProduct};
