import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";

export default handler()
  .get(async (req, res) => {
    try {
      const result = await req.knex
        .select("*")
        .from("partai")
        .orderBy("nomor", "asc");

      res.json(result);
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .post(async (req, res) => {
    try {
      // get post
      const { nomor, partai, code_warna } = req.body;

      // cek jika ada nomor yang sama
      const cekNomorSama = await req
        .knex("partai")
        .where("nomor", nomor)
        .first();
      if (cekNomorSama)
        return res
          .status(401)
          .json({ message: "Nomor Partai Sudah Terdaftar", type: "error" });

      // proses insert
      const proses = await req.knex("partai").insert([
        {
          nomor,
          partai,
          code_warna: code_warna || null,
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
