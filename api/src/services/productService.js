const Product = require('../models/Product');

// Crear producto
const createProduct = async (productData) => {
  const newProduct = new Product(productData);
  return await newProduct.save();
};

// Obtener todos los productos con filtros
const getAllProducts = async (filters = {}) => {
  const query = {};
  if (filters.name) {
    query.name = { $regex: filters.name, $options: 'i' };
  }
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }
  return await Product.find(query);
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

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
