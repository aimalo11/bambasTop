module.exports = (...roles) => {
  return (req, res, next) => {
    // Si req.user no existeix vol dir que va faltar posar authMiddleware abans
    // Si no s'inclou el rol deneguem l'accés
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accés prohibit" });
    }
    next();
  };
};
