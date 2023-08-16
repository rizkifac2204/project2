import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import {
  UploadImageOnly,
  DeleteUpload,
  kompresingImage,
} from "services/uploadService";
import { PATH_FOTO } from "assets/appConfig";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler()
  .use(UploadImageOnly().single("file"))
  .use(kompresingImage())
  .post(async (req, res) => {
    try {
      // jika sukses upload, maka file akan terdeteksi
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "File Tidak Sesuai Ketentuan", type: "error" });
      }

      // dapatkan body untuk tabel
      const { id } = req.body;
      const { filename } = req.file;

      const proses = await req.knex("user").where("id", id).update({
        foto: filename,
        updated_at: req.knex.fn.now(),
      });

      if (!proses) {
        DeleteUpload(req.file.destination, req.file);
        return res.status(400).json({ message: "Gagal Proses", type: "error" });
      }

      res.json({ file: filename, message: "Berhasil Upload" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .put(async (req, res) => {
    try {
      // jika sukses upload, maka file akan terdeteksi
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "File Tidak Sesuai Ketentuan", type: "error" });
      }
      const { foto, id } = req.body;
      const { filename } = req.file;

      const proses = await req.knex("user").where("id", id).update({
        foto: filename,
        updated_at: req.knex.fn.now(),
      });

      if (!proses) {
        DeleteUpload(req.file.destination, req.file);
        return res.status(400).json({ message: "Gagal Proses", type: "error" });
      }

      if (proses) {
        if (req.file) DeleteUpload(req.file.destination, foto);
      }

      res.json({ file: filename, message: "Berhasil Upload" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .delete(async (req, res) => {
    try {
      const update = await req.knex("user").where("id", req.query.id).update({
        foto: null,
        updated_at: req.knex.fn.now(),
      });
      if (!update) {
        return res.status(400).json({ message: "Gagal Memproses Data" });
      }
      DeleteUpload(PATH_FOTO, req.query.file);
      res.json({ message: "Berhasil Hapus" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan..." });
    }
  });
