// app.test.js
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from './app.js';

// ==============================
// Mock MongoDB in-memory server
// ==============================
const startMockDB = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    dbName: 'test',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('✅ Connected to in-memory MongoDB');
  return mongoServer;
};

// ==============================
// Mock Authentication Middleware
// ==============================
app.use((req, res, next) => {
  // Add a mock user for testing routes that need authentication
  req.user = { id: 'mock-user-id', email: 'test@test.com', admin: false };
  next();
});

// ==============================
// Start Test Server
// ==============================
const startServer = async () => {
  const mongoServer = await startMockDB();

  const PORT = 4000; // test server port
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`⚡ Test server running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('\n⚠️  Shutting down test server...');
    server.close(async () => {
      await mongoose.disconnect();
      await mongoServer.stop();
      console.log('✅ Test server stopped');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();