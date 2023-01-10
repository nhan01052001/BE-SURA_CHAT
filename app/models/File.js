import mongoose from "mongoose";
const Schema = mongoose.Schema;
const FileSchema = new Schema(
  {
    idChat: { type: String },
    idUser: { type: String },
    title: { type: String },
    fileUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

const UploadedFile = mongoose.model("File", FileSchema);
export default UploadedFile;
