import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";

export default handler().get(async (req, res) => {
  try {
    const result = await req.knex
      .select("user.*", "level.level")
      .from("user")
      .innerJoin("level", "user.level_id", "level.id")
      .where("user.id", req.session.user.id)
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
