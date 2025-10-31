import dotenv from 'dotenv';

dotenv.config();

const configs = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
};

const validateConfigs = () => {
  const requiredConfigs = ['MONGODB_URI', 'JWT_SECRET'];
  
  const missingConfigs = requiredConfigs.filter(key => !configs[key]);
  
  if (missingConfigs.length > 0 && configs.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missingConfigs.join(', ')}`);
  }
};

validateConfigs();

export default configs;