import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import {
  UploadImageOnly,
  DeleteUpload,
  kompresingImage,
} from "services/UploadService";
import { isEditable, isMyself } from "middlewares/userAttrs";
const fs = require("fs");
import { PATH_FOTO } from "assets/appConfig";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function middlewareEdit(req, res, next) {
  try {
    const { id } = req.query;
    const { id: user_id, level, verifikator } = req.session.user;
    const { foto, email } = req.body;
    const filename = req.file ? req.file.filename : foto;

    // cek exist data
    const cek = await req.knex.select("*").from("user").where("id", id).first();
    if (!cek) {
      if (req.file) DeleteUpload(req.file.destination, filename);
      return res
        .status(404)
        .json({ message: "Tidak Ditemukan", type: "error" });
    }

    //cek jika ada email yang sama
    if (email) {
      const cekEmailSama = await req
        .knex("user")
        .where("id", "!=", id)
        .andWhere("email", email)
        .first();
      if (cekEmailSama) {
        if (req.file) DeleteUpload(req.file.destination, filename);
        return res.status(401).json({
          type: "error",
          message:
            "Email yang anda masukan sudah di pakai user lain, silakan masukan email pengganti",
        });
      }
    }

    //validasi jika berhak hapus
    const izin = isEditable(level, verifikator, cek);
    if (!izin) {
      if (req.file) DeleteUpload(req.file.destination, filename);
      return res.status(400).json({ message: "Tidak Ada Izin", type: "error" });
    }

    // validasi tambahan, jika seandainya menghapus diri sendiri
    const myself = isMyself(user_id, cek.id);
    if (myself) {
      if (req.file) DeleteUpload(req.file.destination, filename);
      return res
        .status(400)
        .json({ message: "Akses Tidak Benar", type: "error" });
    }

    next();
  } catch (err) {
    getLogger.error(err);
    return res.status(403).json({ message: "Not Allowed" });
  }
}

export default handler()
  .use(UploadImageOnly().single("file"))
  .use(kompresingImage())
  .use(middlewareEdit)
  .put(async (req, res) => {
    try {
      const { id } = req.query;
      const { foto, nama, telp, email, username, verifikator, delete_foto } =
        req.body;
      const filename = req.file ? req.file.filename : foto;

      const check_hapus_foto = delete_foto == "true" ? true : false;

      const forUser = {
        foto: check_hapus_foto ? null : filename,
        nama,
        telp: telp || null,
        email: email || null,
        username,
        verifikator: verifikator == "true" ? true : false,
      };

      const proses = await req
        .knex("user")
        .where("id", id)
        .update({
          ...forUser,
          updated_at: req.knex.fn.now(),
        });

      if (!proses) {
        if (req.file) DeleteUpload(req.file.destination, filename);
        return res.status(400).json({ message: "Gagal Proses", type: "error" });
      }

      if (proses) {
        if (check_hapus_foto) DeleteUpload(PATH_FOTO, foto);
        if (req.file) DeleteUpload(req.file.destination, foto);
      }

      res.json({ message: "Berhasil Mengubah Data Profile" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
