exports.success = (res, data, statusCode = 200) => {
  res.status(statusCode).json({ success: true, data });
};

exports.error = (res, code, message, statusCode, details = undefined) => {
  const body = { success: false, error: { code, message } };
  if (details && process.env.NODE_ENV === 'development') {
    body.error.details = details;
  }
  res.status(statusCode).json(body);
};
