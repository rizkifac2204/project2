import multer from "multer";
import * as fs from "fs";
import getLogger from "middlewares/getLogger";
import sharp from "sharp";
import { PATH_UPLOAD } from "assets/appConfig";

const storage = () => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `${PATH_UPLOAD}/${req.headers.destinationfile}`;
      try {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      } catch (err) {
        getLogger.error(err);
        cb(new Error("Gagal membuat direktori."));
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
};

// saat ini belum dipakai karena mendukung semua file
const filterFile = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Hanya JPG, JPEG dan PNG!"));
  }
};

export const Upload = () =>
  multer({
    storage: storage(),
    // fileFilter: filterFile,
    // limits: { fileSize: 1048576 }, // hanya dibatasi 1mb
  });

export const UploadImageOnly = () =>
  multer({
    storage: storage(),
    fileFilter: filterFile,
    limits: { fileSize: 5_000_000 }, // hanya dibatasi 5mb
  });

function prosesDelete(path, file) {
  const fullPath = `${path}/${file}`;
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath); // Hapus file jika ada
    } else {
      console.log("File not found:", fullPath);
      getLogger.error("File not found:", fullPath);
    }
  } catch (err) {
    getLogger.error(err);
  }
}

export const DeleteUpload = (path, files) => {
  if (!files) return;
  try {
    if (typeof files === "object") {
      if (Array.isArray(files)) {
        files.forEach((v) => {
          if (typeof v === "object" && !Array.isArray(v) && v !== null) {
            prosesDelete(path, v.filename);
          } else {
            prosesDelete(path, v);
          }
        });
      } else {
        if (
          typeof files === "object" &&
          !Array.isArray(files) &&
          files !== null
        ) {
          prosesDelete(path, files.filename);
        } else {
          prosesDelete(path, files);
        }
      }
    } else {
      prosesDelete(path, files);
    }
  } catch (err) {
    getLogger.error(err);
    throw err;
  }
};

export const kompresingImage = (arg = false) => {
  return async (req, res, next) => {
    try {
      // required
      if (arg) {
        if (!req.file) {
          return res
            .status(400)
            .json({ message: "HARUS UPLOAD", type: "error" });
        }
      }

      // not required
      if (!req.file) return next();

      const { path } = req.file;

      // Menggunakan Sharp untuk mengecilkan ukuran gambar
      await sharp(path)
        .resize({ width: 800, fit: sharp.fit.inside }) // Tentukan ukuran yang diinginkan
        .toBuffer()
        .then((data) => {
          fs.writeFileSync(path, data); // Menyimpan gambar yang sudah diubah
        });

      next(); // Lanjutkan dengan handler berikutnya (async (req, res) => { ... })
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  };
};
