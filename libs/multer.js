const multer = require("multer");
const path = require("path");

const filename = (req, file, callback) => {
  let fileName = Date.now() + path.extname(file.originalname);
  callback(null, fileName);
};

const generateStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, destination);
    },
    filename: filename,
  });
};

module.exports = {
  image: multer({
    fileFilter: (req, file, callback) => {
      let allowedMimetypes = ["image/png", "image/jpg", "image/jpeg"];
      if (!allowedMimetypes.includes(file.mimetype)) {
        let err = new Error(`Only ${allowedMimetypes} are allowed to upload!`);
        return callback(err, false);
      }
      // const fileSize = parseInt(req.headers["content-length"]);
      // if (fileSize > 500000) {
      //   let err = new Error(`Maximum image size is 500KB`);
      //   return callback(err, false);
      // }

      callback(null, true);
    },
    onError: (err, next) => {
      next(err);
    },
  }),
};
