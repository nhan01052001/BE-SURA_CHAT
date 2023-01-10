import cloudinary from "../../config/cloudynary/cloudinary.config.js";
import cloudinaryConfig from "../../config/cloudynary/cloudinary.config.js";
// import UploadedFile from "../models/File.js";

import { fileTypeFromStream } from "file-type";

const CloudinaryController = {
  images: async (req, res, next) => {
    const { resources } = await cloudinaryConfig.v2.search
      .expression("folder: Danh")
      .sort_by("public_id", "desc")
      .max_results(30)
      .execute();

    const publicIds = resources.map((file) => file);
    res.send(publicIds);
  },
  upload: async (req, res, next) => {
    try {
      console.log("Upload");
      console.log(req.body.chatId);
      const fileStr = req.body.data;
      const type = req.body.type;
      const fileName = req.body.fileName;

      console.log("fileStr: " + fileStr);
      //

      const uploadResponse = await cloudinary.v2.uploader.upload(fileStr, {
        folder: "Danh",
        upload_preset: "ml_default",
        resource_type: "raw",
        filename_override: fileName,
        format: type,
      });
      // console.log(uploadResponse);
      req.body.senderId = req.user.id;
      req.body.text = uploadResponse.url;
      if (type == "png" || type == "jpg" || type == "jpeg")
        req.body.isImg = true;
      req.body.chatId = req.body.chatId;
      req.body.type = req.body.type;
      req.body.fileName = req.body.fileName;

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ err: "Something went wrong" });
    }
  },
};

export default CloudinaryController;
