require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.USER_SECRET, function (err, decoded) {
      if (!err) {
        req.user_detail = decoded;
        next();
      } else {
        return res.status(401).json({
          message: err.message,
          code: 401,
        });
      }
    });
  } catch (error) {
    console.error("Error in verifyToken:", error.message);
    return res.failure(
      { code: "Forbidden", details: "Access denied" },
      "Error: Access denied:: Forbidden",
      401
    );
  }
};

exports.verifyAdminToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.ADMIN_SECRET, function (err, decoded) {
      if (!err) {
        req.user_detail = decoded;
        next();
      } else {
        return res.failure(
          { code: "Forbidden", details: "Access denied" },
          "Error: Access denied:: Forbidden",
          401
        );
      }
    });
  } catch (error) {
    console.error("Error in verifyAdminToken:", error.message);
    return res.failure(
      { code: "Forbidden", details: "Access denied" },
      "Error: Access denied:: Forbidden",
      401
    );
  }
};

exports.verifySuperAdminToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SUPER_ADMIN_SECRET, function (err, decoded) {
      if (!err) {
        req.user_detail = decoded;
        next();
      } else {
        return res.failure(
          { code: "Forbidden", details: "Access denied" },
          "Error: Access denied:: Forbidden",
          401
        );
      }
    });
  } catch (error) {
    console.error("Error in verifySuperAdminToken:", error.message);
    return res.failure(
      { code: "Forbidden", details: "Access denied" },
      "Error: Access denied:: Forbidden",
      401
    );
  }
};

// Middleware to verify any of the three tokens
exports.verifyAnyToken = async (req, res, next) => {
  try {
    // Check if the Authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Access denied: No token provided",
        code: 401,
      });
    }

    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Define an array of secret keys for user roles
    const secrets = [
      { secret: process.env.USER_SECRET, role: "user" },
      { secret: process.env.ADMIN_SECRET, role: "admin" },
      { secret: process.env.SUPER_ADMIN_SECRET, role: "super_admin" },
    ];

    // Flag to track if a valid token was found
    let tokenValid = false;

    // Iterate through the secrets to verify the token
    for (const { secret, role } of secrets) {
      try {
        const decoded = jwt.verify(token, secret);
        req.user_detail = { ...decoded, role }; // Attach user details to the request
        tokenValid = true; // Set flag to true if a valid token is found
        break; // Exit the loop since a valid token has been found
      } catch (err) {
        // Ignore errors, continue to check other secrets
      }
    }

    // If no valid token was found, return an access denied response
    if (!tokenValid) {
      return res.status(401).json({
        message: "Access denied: Invalid token",
        code: 401,
      });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error in verifyAnyToken:", error.message);
    return res.status(401).json({
      message: "Access denied: Forbidden",
      code: 401,
    });
  }
};

// Middleware to verify admin/super admin
exports.verifyAdminSuperAdmin = async (req, res, next) => {
  try {
    // Check if the Authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Access denied: No token provided",
        code: 401,
      });
    }

    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Define an array of secret keys for user roles
    const secrets = [
      { secret: process.env.ADMIN_SECRET, role: "admin" },
      { secret: process.env.SUPER_ADMIN_SECRET, role: "super_admin" },
    ];

    // Flag to track if a valid token was found
    let tokenValid = false;

    // Iterate through the secrets to verify the token
    for (const { secret, role } of secrets) {
      try {
        const decoded = jwt.verify(token, secret);
        req.user_detail = { ...decoded, role }; // Attach user details to the request
        tokenValid = true; // Set flag to true if a valid token is found
        break; // Exit the loop since a valid token has been found
      } catch (err) {
        // Ignore errors, continue to check other secrets
      }
    }

    // If no valid token was found, return an access denied response
    if (!tokenValid) {
      return res.status(401).json({
        message: "Access denied: Invalid token",
        code: 401,
      });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error in verifyAnyToken:", error.message);
    return res.status(401).json({
      message: "Access denied: Forbidden",
      code: 401,
    });
  }
};

exports.decodeToken = async (token, secret) => {
  try {
    let decodedValue = null;
    jwt.verify(token, secret, function (err, decoded) {
      if (!err) {
        decodedValue = decoded;
      } else {
        return false;
      }
    });
    return decodedValue;
  } catch (error) {
    console.error("Error in decodeToken:", error.message);
    return false;
  }
};
