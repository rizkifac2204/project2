import handlerPublic from "middlewares/handlerPublic";
import { join } from "path";
import { createReadStream, existsSync } from "fs";
import mime from "mime";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default handlerPublic().get(async (req, res) => {
  try {
    const filePath = join(...req.query.slug);
    if (!filePath || !existsSync(filePath)) {
      return res.status(404).json({
        message: "File tidak ditemukan",
        type: "error",
      });
    }

    // Memeriksa apakah file yang diminta adalah file gambar berdasarkan tipe kontennya
    const mimeType = mime.getType(filePath);
    if (!mimeType || !mimeType.startsWith("image/")) {
      return res.status(404).json({
        message: "File tidak Valid",
        type: "error",
      });
    }

    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "File error",
      type: "error",
    });
  }
});
