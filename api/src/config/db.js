const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';
    await mongoose.connect(uri);
    console.log('✅ MongoDB connectat correctament');
  } catch (err) {
    console.error('❌ Error al connectar a MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
