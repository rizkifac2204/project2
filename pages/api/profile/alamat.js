import handler from "middlewares/handler";
import bcrypt from "bcryptjs";
import getLogger from "middlewares/getLogger";

export default handler()
  .get(async (req, res) => {
    try {
      const result = await req.knex
        .select("*")
        .from("user_alamat")
        .where("user_id", req.session.user.id)
        .first();

      if (!result) return res.json({});
      res.json(result);
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .put(async (req, res) => {
    try {
      const { id } = req.session.user;
      const {
        alamat,
        rt,
        rw,
        kode_pos,
        provinsi,
        kabkota,
        kecamatan,
        kelurahan,
        passwordConfirm,
      } = req.body;

      const cek = await req.knex("user").where("id", id).first();
      if (!cek)
        return res
          .status(401)
          .json({ message: "User Tidak Terdeteksi", type: "error" });

      // jika password tidak sama
      const match = await bcrypt.compare(passwordConfirm, cek.password);

      if (!match)
        return res
          .status(401)
          .json({ message: "Password Anda Salah", type: "error" });

      const forAlamat = {
        alamat: alamat || null,
        rt: rt || null,
        rw: rw || null,
        provinsi: provinsi || null,
        kabkota: kabkota || null,
        kecamatan: kecamatan || null,
        kelurahan: kelurahan || null,
        kode_pos: kode_pos || null,
      };

      const cekExist = await req
        .knex(`user_alamat`)
        .where("user_id", id)
        .first();
      if (!cekExist) {
        // insert
        const prosesAlamat = await req.knex("user_alamat").insert({
          ...forAlamat,
          user_id: id,
        });
        if (!prosesAlamat)
          return res.json({
            message: "Gagal Menyimpan Data Alamat",
            type: "error",
          });
      } else {
        // update
        const prosesAlamat = await req
          .knex("user_alamat")
          .where("user_id", id)
          .update(forAlamat);
        if (!prosesAlamat)
          return res.json({
            message: "Gagal Menyimpan Data Alamat",
            type: "error",
          });
      }

      res.json({ message: "Berhasil Mengubah Data Profile" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
