import handler from "middlewares/handler";
import bcrypt from "bcryptjs";
import getLogger from "middlewares/getLogger";
import moment from "moment";

export default handler()
  .get(async (req, res) => {
    try {
      const result = await req.knex
        .select("*")
        .from("user_umum")
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
        agama,
        jenis_kelamin,
        tempat_lahir,
        tanggal_lahir,
        gelar_depan,
        gelar_belakang,
        status_nikah,
        golongan_darah,
        hobi,
        keahlian,
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

      const forUmum = {
        agama: agama || null,
        jenis_kelamin: jenis_kelamin || null,
        tempat_lahir: tempat_lahir || null,
        tanggal_lahir: tanggal_lahir
          ? moment(new Date(tanggal_lahir)).format("MM/DD/YYYY")
          : null,
        golongan_darah: golongan_darah || null,
        status_nikah: status_nikah || null,
        gelar_depan: gelar_depan || null,
        gelar_belakang: gelar_belakang || null,
        hobi: hobi || null,
        keahlian: keahlian || null,
      };

      const cekExist = await req.knex(`user_umum`).where("user_id", id).first();
      if (!cekExist) {
        // insert
        const prosesUmum = await req.knex("user_umum").insert({
          ...forUmum,
          user_id: id,
        });
        if (!prosesUmum)
          return res.json({
            message: "Gagal Menyimpan Data Umum",
            type: "error",
          });
      } else {
        // update
        const prosesUmum = await req
          .knex("user_umum")
          .where("user_id", id)
          .update(forUmum);
        if (!prosesUmum)
          return res.json({
            message: "Gagal Menyimpan Data Umum",
            type: "error",
          });
      }

      res.json({ message: "Berhasil Mengubah Data" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
