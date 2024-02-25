const dns = require("dns");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV",
    formats: ["jpeg", "png", "jpg"],
  },
});
const allowedFormats = ["jpeg", "png", "jpg"];
const checkFileExtension = (req, file, cb) => {
  // Check for internet connectivity
  dns.lookup("google.com", (err) => {
    if (err && err.code === "ENOTFOUND") {
      // No internet connectivity
      return cb(new Error("No internet connection"));
    }
  });
  // Internet connection is available, proceed with file extension check

  const fileExtension = file.originalname.split(".").pop().toLowerCase();
  if (!allowedFormats.includes(fileExtension)) {
    return cb(new Error(`You can't upload ${fileExtension} file`));
  }
  cb(null, true);
};

module.exports = { cloudinary, storage, checkFileExtension };
