const jwt = require('jsonwebtoken');
const fs = require("fs").promises;
const path = require("path");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
};

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token format

  if (!token) {
    console.log("Token missing");
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId; 
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.log("Invalid token");
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
//FILE DELETING
const deleteFile = async (filePath) => {// filePath = winnerExists.winnerPicture == images/winners/1717223132312.png
  console.log("giu hjuotrhur")
  const FilePath = path.join(__dirname, "..", filePath); //  FilePath = C:\Users\Lahari\Desktop\ANALOGUE\Projects\NodeJs Projects\buyKeys\buyKeysBackend\images\winners\1722353829278.jpg
  console.log(FilePath); // check the path if necessary
  try {
      await fs.access(FilePath);
      await fs.unlink(FilePath);
      
  } catch (err) {
      if (err.code === 'ENOENT') {
          console.log(`File not found: ${FilePath}`)
      } else {
          console.error(`Error deleting file: ${err}`);
      }
      return true;
  }
  return true;
};

const handleFileUpload = async (file, destination) => {
  if (!file) return null;  // If no file is provided, return null

  const extension = path.extname(file.name);  // Get the file extension
  const filename = `${Date.now()}${extension}`;  // Generate a unique filename using current timestamp
  const uploadPath = path.join(__dirname, "..", "images", destination, filename);  // Define the upload path

  try {
    // Move the file to the desired location
    await file.mv(uploadPath);
    console.log(`File uploaded to ${uploadPath}`);  // Log successful upload
    return `/images/${destination}/${filename}`;  // Return the relative file path
  } catch (err) {
    console.error(`Error uploading file: ${err}`);  // Log any errors
    return null;  // Return null in case of error
  }
};
module.exports = { generateToken, verifyToken ,handleFileUpload, deleteFile};
