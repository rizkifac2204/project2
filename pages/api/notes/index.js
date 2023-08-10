import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";

export default handler()
  .get(async (req, res) => {
    try {
      const { id: user_id } = req.session.user;

      const result = await req.knex
        .select("notes.*", "user.nama", "level.level")
        .from("notes")
        .innerJoin("user", "notes.user_id", "user.id")
        .innerJoin("level", "user.level_id", "level.id")
        .where("notes.user_id", user_id)
        .orderBy("notes.created_at", "desc");

      res.json(result);
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .post(async (req, res) => {
    try {
      const { id: creater_id } = req.session.user;

      // get post
      const { judul, catatan, share } = req.body;

      // proses insert
      const proses = await req.knex("notes").insert([
        {
          user_id: creater_id,
          judul,
          catatan,
          share: share ? share : false,
          created_at: req.knex.fn.now(),
        },
      ]);

      // failed
      if (!proses)
        return res.status(400).json({
          message: "Gagal Memasukan Data",
          type: "error",
        });

      // success
      res.json({ message: "Catatan Disimpan", type: "success" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
