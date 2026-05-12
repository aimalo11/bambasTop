const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Accés denegat. Token no proporcionat o invàlid.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    
    // Injectar la informació del token a l'objecte request per ser usat als controladors
    req.user = decoded; // conté normalment id i role
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invàlid o expirat' });
  }
};

module.exports = authMiddleware;
