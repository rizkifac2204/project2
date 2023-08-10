import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import { DeleteUpload } from "services/UploadService";
import { isEditable, isMyself } from "middlewares/userAttrs";
import middlewareUser from "middlewares/middlewareUser";
import { PATH_FOTO } from "assets/appConfig";

export default handler()
  .get(async (req, res) => {
    try {
      const { id } = req.query;
      const { id: user_id, level, verifikator } = req.session.user;
      const data = await req.knex
        .select("user.*", "level.level")
        .from("user")
        .innerJoin("level", "user.level_id", "level.id")
        .where("user.id", id)
        .whereNotIn("user.level_id", [1, 5])
        .first();

      if (!data)
        return res
          .status(404)
          .json({ message: "Tidak Ditemukan", type: "error" });

      const result = {
        ...data,
        editable: isEditable(level, verifikator, data),
        myself: isMyself(user_id, data.id),
      };

      res.json(result);
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .delete(middlewareUser, async (req, res) => {
    try {
      const { id } = req.query;

      const proses = await req.knex("user").where("id", id).del();
      if (!proses)
        return res.status(400).json({ message: "Gagal Hapus", type: "error" });

      DeleteUpload(PATH_FOTO, req.currentData.foto);

      res.json({ message: "Berhasil Hapus", type: "success" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
