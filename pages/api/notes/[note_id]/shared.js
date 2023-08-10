import handlerPublic from "middlewares/handlerPublic";
import getLogger from "middlewares/getLogger";

export default handlerPublic().get(async (req, res) => {
  try {
    const { note_id } = req.query;

    const result = await req.knex
      .select("notes.*", "user.nama", "level.level")
      .from("notes")
      .innerJoin("user", "notes.user_id", "user.id")
      .innerJoin("level", "user.level_id", "level.id")
      .where("notes.id", note_id)
      .andWhere("notes.share", 1)
      .first();

    if (!result)
      return res
        .status(404)
        .json({ message: "Tidak Ditemukan", type: "error" });

    res.json(result);
  } catch (error) {
    getLogger.error(error);
    res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
  }
});
