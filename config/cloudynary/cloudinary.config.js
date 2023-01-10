import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  // folder: "Danh",
  // allowedFormats: ["jpg", "png"],
  // filename: function (req, file, cb) {
  //   console.log(req.file);
  //   cb(null, file.originalname);
  // },
  params: {
    folder: (req, file) => "Danh",
    format: async (req, file) => "png", // supports promises as well
    public_id: (req, file) => "computed-filename-using-request",
  },
});

export const uploadCloud = multer({ storage });

export default cloudinary;
