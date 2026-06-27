exports.success = (res, data, statusCode = 200) => {
  res.status(statusCode).json({ success: true, data });
};

exports.error = (res, code, message, statusCode) => {
  const body = { success: false, error: { code, message } };
  res.status(statusCode).json(body);
};
