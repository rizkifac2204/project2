import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import middlewareUserTps from "middlewares/middlewareUserTps";

export default handler()
  .get(async (req, res) => {
    try {
      const { user_tps_id } = req.query;
      const result = await req.knex
        .select("*")
        .from("user_alamat")
        .where("user_id", user_tps_id)
        .first();

      if (!result) return res.json({});
      res.json(result);
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .put(middlewareUserTps, async (req, res) => {
    try {
      const { user_tps_id } = req.query;
      const {
        alamat,
        rt,
        rw,
        kode_pos,
        provinsi,
        kabkota,
        kecamatan,
        kelurahan,
      } = req.body;

      const forAlamat = {
        alamat: alamat || null,
        rt: rt || null,
        rw: rw || null,
        provinsi: provinsi || null,
        kabkota: kabkota || null,
        kecamatan: kecamatan || null,
        kelurahan: kelurahan || null,
        kode_pos: kode_pos || null,
      };

      const cekExist = await req
        .knex(`user_alamat`)
        .where("user_id", user_tps_id)
        .first();
      if (!cekExist) {
        // insert
        const prosesAlamat = await req.knex("user_alamat").insert({
          ...forAlamat,
          user_id: user_tps_id,
        });
        if (!prosesAlamat)
          return res.json({
            message: "Gagal Menyimpan Data Alamat",
            type: "error",
          });
      } else {
        // update
        const prosesAlamat = await req
          .knex("user_alamat")
          .where("user_id", user_tps_id)
          .update(forAlamat);
        if (!prosesAlamat)
          return res.json({
            message: "Gagal Menyimpan Data Alamat",
            type: "error",
          });
      }

      res.json({ message: "Berhasil Mengubah Data Profile" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
