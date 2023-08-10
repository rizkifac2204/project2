import handler from "middlewares/handler";
import bcrypt from "bcryptjs";
import getLogger from "middlewares/getLogger";

import { isEditable, isMyself } from "middlewares/userAttrs";

export default handler()
  .get(async (req, res) => {
    try {
      const { id: user_id, level, verifikator } = req.session.user;
      const data = await req.knex
        .select(
          "user.*",
          "tps.no as tps_no",
          "tps.title as tps_title",
          "tps.alamat as tps_alamat",
          "provinsi.provinsi",
          "kabkota.kabkota",
          "kecamatan.kecamatan",
          "kelurahan.kelurahan"
        )
        .from("user")
        .innerJoin("tps", "user.tps_id", "tps.id")
        .innerJoin("provinsi", "tps.provinsi_id", "provinsi.id")
        .innerJoin("kabkota", "tps.kabkota_id", "kabkota.id")
        .innerJoin("kecamatan", "tps.kecamatan_id", "kecamatan.id")
        .innerJoin("kelurahan", "tps.kelurahan_id", "kelurahan.id")
        .where("user.level_id", 5) // khusus tps
        .orderBy("tps.provinsi_id", "asc")
        .orderBy("tps.kabkota_id", "asc")
        .orderBy("tps.kecamatan_id", "asc")
        .orderBy("tps.kelurahan_id", "asc")
        .orderBy("tps.no", "asc");

      // sorting editable
      const result = data.map((item) => {
        return {
          ...item,
          editable: isEditable(level, verifikator, item),
          myself: isMyself(user_id, item.id),
        };
      });

      res.json(result);
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .post(async (req, res) => {
    try {
      const { level: creater_level } = req.session.user;

      // get post
      const { tps_id, nama, telp, email, username, password } = req.body;

      // authorization
      if (creater_level >= 5)
        return res
          .status(401)
          .json({ message: "Tidak ada izin", type: "error" });

      // cek jika ada username yang sama
      const cekUsernameSama = await req
        .knex("user")
        .where("username", username)
        .first();
      if (cekUsernameSama)
        return res
          .status(401)
          .json({ message: "Mohon Ganti Username", type: "error" });

      // cek jika ada TPS yang sama
      const cekTpsSama = await req.knex("user").where("tps_id", tps_id).first();
      if (cekTpsSama)
        return res.status(401).json({
          message: "User Untuk TPS Tersebut Sudah Terdaftar",
          type: "error",
        });

      // enkrip password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      // proses insert
      const proses = await req.knex("user").insert([
        {
          level_id: 5,
          verifikator: 0,
          tps_id: tps_id,
          nama,
          telp: telp || null,
          email: email || null,
          username,
          password: hash,
          valid: 1,
          login: 0,
        },
      ]);

      // failed
      if (!proses)
        return res.status(400).json({
          message: "Gagal Memasukan Data",
          type: "error",
        });

      // success
      res.json({ message: "Berhasil Menginput Data", type: "success" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
