const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { verifySuperAdminToken } = require("../middleware/auth.middleware");
const path = require("path");

const router = express.Router(); // Use router instead of app

const methodURL =
  "https://arihantchemical.in/upload-service/upload_service.php";
const baseLocation = "https://arihantchemical.in/upload-service";

// Set file size limit to 1.2MB (in bytes)
const fileSizeLimit = 1.2 * 1024 * 1024;

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: fileSizeLimit }, // Set file size limit
});

/**
 * ==========================================
 * PROTECTED ROUTE - @SUPER_ADMIN
 * ==========================================
 */

router.post(
  "/v1.0/files/upload-single-file",
  verifySuperAdminToken,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.failure(
          { error: "No file uploaded" },
          "Error: No file uploaded",
          400
        );
      }

      const originalFileName = req.file.originalname;
      const fileExtension = path.extname(originalFileName); // Extract file extension
      const baseName = path.basename(originalFileName, fileExtension); // Extract base name (without extension)

      // Append timestamp to the filename to ensure it's unique
      const str = `${baseName}-${Date.now()}${fileExtension}`;
   
      const uniqueFileName = str.replace(/[\s.:]/g, "-");
      const filePath = req.file.path; // The temp file path
      const newFilePath = `uploads/${uniqueFileName}`; // The new unique file path

      // Rename the file to include the timestamp (for uniqueness)
      fs.renameSync(filePath, newFilePath);

      // Prepare the form data with the unique file name
      const formData = new FormData();
      formData.append("file", fs.createReadStream(newFilePath), uniqueFileName);

      // Make the request to the PHP upload service
      const response = await axios.post(methodURL, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      // Delete the file from the temporary uploads folder after forwarding
      fs.unlinkSync(newFilePath);

      // Handle the response from the PHP server
      if (response.data.error) {
        return res.failure(
          { error: response.data.error },
          "Error from PHP server",
          400
        );
      }

      // Return success response with file name and path
      return res.success(
        {
          message: "File uploaded successfully",
          fileName: uniqueFileName,
          filePath: baseLocation + "/" + newFilePath,
        },
        "File uploaded successfully"
      );
    } catch (error) {
      // Handle multer errors related to file size limit
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.failure(
          { error: "File size too large. Maximum size allowed is 1.2MB" },
          "Error: File size exceeds the limit",
          413
        );
      }

      console.error("Error uploading file:", error);
      return res.failure(
        { error: "File upload failed", details: error.message },
        "Error: File upload failed",
        500
      );
    }
  }
);

module.exports = router;
