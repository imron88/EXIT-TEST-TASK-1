const errorHandler = (err, req, res, next) => {
  console.error('Error encountered:', err.message);

  if (err.name === 'ValidationError') {
    const errorMessages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: errorMessages.join(', '),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid ${err.path}: ${err.value}`,
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value entered',
    });
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
