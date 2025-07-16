/**
 * Adds res.success and res.error helpers for a standard API response format.
 *
 * Usage:
 *   res.success(data, msg, statusCode)
 *   res.error(msg, statusCode, data)
 */

module.exports = (req, res, next) => {
  res.success = (data = null, msg = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      status: true,
      msg,
      data,
    });
  };

  res.error = (msg = 'Error', statusCode = 400, data = null) => {
    return res.status(statusCode).json({
      status: false,
      msg,
      data,
    });
  };

  next();
};
