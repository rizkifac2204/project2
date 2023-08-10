import handler from "middlewares/handler";
import bcrypt from "bcryptjs";
import getLogger from "middlewares/getLogger";
import middlewareUser from "middlewares/middlewareUser";

export default handler().put(middlewareUser, async (req, res) => {
  try {
    const { id } = req.query;
    const { baru } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashBaru = bcrypt.hashSync(baru, salt);

    // proses
    const proses = await req
      .knex("user")
      .where("id", id)
      .update({ password: hashBaru });
    // failed
    if (!proses)
      return res.status(400).json({ message: "Gagal Merubah Password" });
    // success
    res.json({ message: "Berhasil Merubah Password", type: "success" });
  } catch (error) {
    getLogger.error(error);
    res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
  }
});
