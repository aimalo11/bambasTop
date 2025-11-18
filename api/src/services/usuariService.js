const Usuari = require('../models/Usuari');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

const registerUser = async (userData) => {
  const exists = await Usuari.findOne({ email: userData.email });
  if (exists) throw new Error('Email ja registrat');

  const user = new Usuari(userData);
  await user.save();

  const token = generateToken(user);

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

const loginUser = async (email, password) => {
  const user = await Usuari.findOne({ email });
  if (!user) throw new Error('Credencials inválides');

  const valid = await user.matchPassword(password);
  if (!valid) throw new Error('Credencials inválides');

  const token = generateToken(user);

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

const getUserById = async (id) => {
  return await Usuari.findById(id).select('-password');
};

module.exports = { registerUser, loginUser, getUserById };
