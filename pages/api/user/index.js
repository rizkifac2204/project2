import handler from "middlewares/handler";
import bcrypt from "bcryptjs";
import getLogger from "middlewares/getLogger";
import { isEditable, isMyself } from "middlewares/userAttrs";

export default handler()
  .get(async (req, res) => {
    try {
      const { id: user_id, level, verifikator } = req.session.user;
      const data = await req.knex
        .select("user.*", "level.level")
        .from("user")
        .innerJoin("level", "user.level_id", "level.id")
        .orderBy("user.level_id", "asc")
        .orderBy("user.nama", "asc")
        .whereNotIn("user.level_id", [1, 5]); // bukan dev dan tps

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
      const {
        id: creater_id,
        level: creater_level,
        verifikator: creater_verifikator,
      } = req.session.user;

      // get post
      const { level_id, verifikator, nama, telp, email, username, password } =
        req.body;

      // authorization
      if (creater_level > level_id)
        return res
          .status(401)
          .json({ message: "Tidak ada izin", type: "error" });
      if (creater_level == level_id && creater_verifikator === 0)
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

      // enkrip password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      // proses insert
      const proses = await req.knex("user").insert([
        {
          level_id,
          verifikator: level_id === 5 ? 0 : verifikator,
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
