import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import {
  middlewareProvinsiSelected,
  middlewareKabkotaSelected,
  middlewareKecamatanSelected,
} from "middlewares/middlewareSelected";

export default handler()
  .use(middlewareProvinsiSelected)
  .use(middlewareKabkotaSelected)
  .use(middlewareKecamatanSelected)
  .get(async (req, res) => {
    try {
      const { kecamatan_id } = req.query;

      const result = await req
        .knex("kecamatan as kc")
        .select(
          "kc.id",
          "kc.kecamatan",
          req.knex.raw("SUM(kl.jumlah_tps) as jumlah_tps"),
          req.knex.raw("SUM(kl.jumlah_pemilih) as jumlah_pemilih")
        )
        .join("kelurahan as kl", "kc.id", "kl.kecamatan_id")
        .where("kc.id", kecamatan_id)
        .whereIn(`kc.id`, req.arrayKecamatan)
        .groupBy("kc.id", "kc.kecamatan")
        .first();

      if (!result)
        return res
          .status(404)
          .json({ status: 404, message: "Tidak Ditemukan" });

      res.json(result);
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .put(async (req, res) => {
    try {
      const { kecamatan_id } = req.query;
      const { dapil } = req.body;

      // cek exist data
      const cek = await req.knex
        .select("*")
        .from("kecamatan")
        .where("id", kecamatan_id)
        .whereIn("id", req.arrayKecamatan)
        .first();

      if (!cek)
        return res
          .status(404)
          .json({ status: 404, message: "Tidak Ditemukan" });

      // proses update
      const proses = await req
        .knex("kecamatan")
        .where("id", kecamatan_id)
        .update({
          dapil: dapil || null,
        });

      if (!proses)
        return res.status(400).json({ message: "Gagal Proses", type: "error" });

      res.json({ message: "Berhasil Mengubah Data" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
