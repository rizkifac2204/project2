import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import {
  middlewareProvinsiSelected,
  middlewareKabkotaSelected,
} from "middlewares/middlewareSelected";

export default handler()
  .use(middlewareProvinsiSelected)
  .use(middlewareKabkotaSelected)
  .get(async (req, res) => {
    try {
      const { kabkota_id } = req.query;

      const result = await req
        .knex("kabkota as kk")
        .select(
          "kk.id",
          "kk.kabkota",
          "j.jenis",
          req.knex.raw("SUM(kl.jumlah_tps) as jumlah_tps"),
          req.knex.raw("SUM(kl.jumlah_pemilih) as jumlah_pemilih")
        )
        .join(`jenis as j`, `kk.jenis_id`, `j.id`)
        .join("kecamatan as kc", "kk.id", "kc.kabkota_id")
        .join("kelurahan as kl", "kc.id", "kl.kecamatan_id")
        .where("kk.id", kabkota_id)
        .whereIn("kk.id", req.arrayKabkota)
        .groupBy("kk.id", "kk.kabkota")
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
  });
