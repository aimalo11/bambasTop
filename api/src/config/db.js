const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connectat correctament');
  } catch (err) {
    console.error('❌ Error al connectar a MongoDB:', err.message);
    process.exit(1);
  }
};

// **IMPORTANTE**: exportar la función correctamente
module.exports = connectDB;
