const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');


const bookRoutes = require('./routes/bookRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library_db';

app.use(express.json());

app.use(logger);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the College Library Book Management API',
    endpoints: {
      'POST /books': 'Add a new book (Status 201)',
      'GET /books': 'List all books (Status 200)',
      'GET /books/:id': 'Get a single book by ID (Status 200 / 404)',
      'PUT /books/:id': 'Update a book by ID (Status 200 / 404 / 400)',
      'DELETE /books/:id': 'Delete a book by ID (Status 200 / 404)',
    },
  });
});

app.use('/books', bookRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API URL: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });

module.exports = app;
