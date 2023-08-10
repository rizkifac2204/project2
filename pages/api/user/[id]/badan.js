import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import middlewareUser from "middlewares/middlewareUser";

export default handler()
  .get(async (req, res) => {
    try {
      const { id } = req.query;
      const result = await req.knex
        .select("*")
        .from("user_badan")
        .where("user_id", id)
        .first();

      if (!result) return res.json({});
      res.json(result);
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .put(middlewareUser, async (req, res) => {
    try {
      const { id } = req.query;
      const {
        tinggi,
        berat,
        ukuran_celana,
        ukuran_baju,
        ukuran_sepatu,
        bentuk_wajah,
        jenis_rambut,
        warna_kulit,
        ciri_khas,
        cacat,
      } = req.body;

      const forBadan = {
        tinggi: tinggi || null,
        berat: berat || null,
        ukuran_celana: ukuran_celana || null,
        ukuran_baju: ukuran_baju || null,
        ukuran_sepatu: ukuran_sepatu || null,
        bentuk_wajah: bentuk_wajah || null,
        jenis_rambut: jenis_rambut || null,
        warna_kulit: warna_kulit || null,
        ciri_khas: ciri_khas || null,
        cacat: cacat || null,
      };

      const cekExist = await req
        .knex(`user_badan`)
        .where("user_id", id)
        .first();
      if (!cekExist) {
        // insert
        const prosesBadan = await req.knex("user_badan").insert({
          ...forBadan,
          user_id: id,
        });
        if (!prosesBadan)
          return res.json({
            message: "Gagal Menyimpan Data Keterangan Badan",
            type: "error",
          });
      } else {
        // update
        const prosesBadan = await req
          .knex("user_badan")
          .where("user_id", id)
          .update(forBadan);
        if (!prosesBadan)
          return res.json({
            message: "Gagal Menyimpan Data Keterangan Badan",
            type: "error",
          });
      }

      res.json({ message: "Berhasil Mengubah Data Profile" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
