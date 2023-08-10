import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";

export default handler()
  .get(async (req, res) => {
    try {
      const { partai_id } = req.query;
      if (partai_id === 0)
        return res
          .status(404)
          .json({ message: "Tidak Ditemukan", type: "error" });

      const result = await req.knex
        .select("*")
        .from("partai")
        .where("id", partai_id)
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
  })
  .put(async (req, res) => {
    try {
      const { partai_id } = req.query;
      // get post
      const { nomor, partai, code_warna } = req.body;

      const cekNomorSama = await req
        .knex("partai")
        .where("id", "!=", partai_id)
        .andWhere("nomor", nomor)
        .first();
      if (cekNomorSama) {
        return res.status(401).json({
          type: "error",
          message: "Nomor Sudah Terdaftar",
        });
      }

      // proses edit
      const proses = await req
        .knex("partai")
        .where("id", partai_id)
        .update({
          nomor,
          partai,
          code_warna: code_warna || null,
          updated_at: req.knex.fn.now(),
        });

      // failed
      if (!proses)
        return res.status(400).json({
          message: "Gagal Merubah Data",
          type: "error",
        });

      // success
      res.json({ message: "Berhasil Merubah Data", type: "success" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .delete(async (req, res) => {
    try {
      const { partai_id } = req.query;

      if (partai_id === 0)
        return res
          .status(404)
          .json({ message: "Tidak Ditemukan", type: "error" });

      const proses = await req.knex("partai").where("id", partai_id).del();
      if (!proses)
        return res.status(400).json({ message: "Gagal Hapus", type: "error" });

      res.json({ message: "Berhasil Hapus", type: "success" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
