const usuariService = require('../services/usuariService');

const register = async (req, res) => {
  try {
    const { user, token } = await usuariService.registerUser(req.body);
    res.status(201).json({ status: 'success', data: user, token });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await usuariService.loginUser(email, password);
    res.status(200).json({ status: 'success', data: user, token });
  } catch (err) {
    res.status(401).json({ status: 'error', message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await usuariService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ status: 'error', message: 'Usuari no trobat' });
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

module.exports = { register, login, getUser };
