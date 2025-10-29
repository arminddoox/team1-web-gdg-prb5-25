const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
require('dotenv').config();
app.use(express.json());


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("connection err", err))

app.listen(5000, () => console.log('Server started on port 5000')); 

app.get('/', (req, res) => {
  res.send('hello from backend!');
});

> placeholder.md