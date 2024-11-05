import multer from "multer";

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/profiles");
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.email}_${file.originalname}`);
  },
});

let upload = multer({ storage: storage });

export default upload;
