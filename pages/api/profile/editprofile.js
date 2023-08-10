import handler from "middlewares/handler";
import bcrypt from "bcryptjs";
import getLogger from "middlewares/getLogger";
import {
  UploadImageOnly,
  DeleteUpload,
  kompresingImage,
} from "services/uploadService";
const fs = require("fs");

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler()
  .use(UploadImageOnly().single("file"))
  .use(kompresingImage())
  .put(async (req, res) => {
    try {
      const { id } = req.session.user;
      const { foto, nama, telp, email, username, passwordConfirm } = req.body;
      const filename = req.file ? req.file.filename : foto;

      // cek exist
      const cek = await req.knex("user").where("id", id).first();
      if (!cek) {
        if (req.file) DeleteUpload(req.file.destination, filename);
        return res
          .status(401)
          .json({ message: "User Tidak Terdeteksi", type: "error" });
      }

      // jika password tidak sama
      const match = await bcrypt.compare(passwordConfirm, cek.password);
      if (!match) {
        if (req.file) DeleteUpload(req.file.destination, filename);
        return res
          .status(401)
          .json({ message: "Password Anda Salah", type: "error" });
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

      const forUser = {
        foto: filename,
        nama,
        telp: telp || null,
        email: email || null,
        username,
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
        if (req.file) DeleteUpload(req.file.destination, foto);
      }

      res.json({ message: "Berhasil Mengubah Data Profile" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
