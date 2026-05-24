const jwt = require('jsonwebtoken');
const Usuari = require('../models/Usuari');

// Helper per generar tokens
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '1d' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Verificar si l'email ja existeix
    const userExists = await Usuari.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Aquest email ja està registrat' });
    }

    // El hash de la contrasenya es fa automàticament al pre-save del model Usuari
    const user = await Usuari.create({
      name,
      email,
      password,
      role: 'client' // Per defecte
    });

    if (req.log) {
      req.log.info({ userId: user._id, email: user.email }, 'User registered successfully');
    }

    res.status(201).json({ message: 'Usuari registrat correctament', userId: user._id });
  } catch (error) {
    if (req.log) req.log.error({ error: error.message }, 'Error en el registre');
    res.status(500).json({ message: 'Error en el registre', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Usuari.findOne({ email });
    if (!user) {
      if (req.log) req.log.warn({ email }, 'Invalid login attempt: user not found');
      return res.status(401).json({ message: 'Email o contrasenya incorrectes' });
    }

    // Verificar contrasenya usant el mètode del model
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      if (req.log) req.log.warn({ email }, 'Invalid login attempt: incorrect password');
      return res.status(401).json({ message: 'Email o contrasenya incorrectes' });
    }

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Guardar refresh token a la base de dades
    user.refreshToken = refreshToken;
    await user.save();

    if (req.log) {
      req.log.info({ userId: user._id, email: user.email }, 'User logged in successfully');
    }

    res.json({
      message: 'Login correcte',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    if (req.log) req.log.error({ error: error.message }, 'Error en el login');
    res.status(500).json({ message: 'Error en el login', error: error.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token requerit' });
    }

    // Verificar el refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret_key');

    // Buscar usuari i validar que el token coincideix amb el guardat
    const user = await Usuari.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Refresh token invàlid o expirat' });
    }

    // Generar nous tokens (es pot optar per rotar el refresh o només l'access)
    // Aquí només renovem l'access token per simplificar, o rotarem tots dos.
    const tokens = generateTokens(user._id, user.role);
    
    // Rotació opcional: Guardar el nou refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    res.status(403).json({ message: 'Refresh token invàlid o expirat', error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    // Buscar l'usuari amb el token i eliminar-lo
    const user = await Usuari.findOneAndUpdate(
      { refreshToken },
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    if (req.log && user) {
      req.log.info({ userId: user._id }, 'User logged out');
    }

    res.json({ message: 'Sessió tancada correctament' });
  } catch (error) {
    if (req.log) req.log.error({ error: error.message }, 'Error en el logout');
    res.status(500).json({ message: 'Error en el logout', error: error.message });
  }
};
