function responseFormatter(req, res, next) {
  res.success = function (data, message = "Success") {
    res.status(200).json({
      status: "success",
      data,
      error: null,
      message,
    });
  };

  res.failure = function (error, message = "Failure", statusCode = 400) {
    res.status(statusCode).json({
      status: "failure",
      data: null,
      error,
      message,
    });
  };

  next();
}

module.exports = responseFormatter;
