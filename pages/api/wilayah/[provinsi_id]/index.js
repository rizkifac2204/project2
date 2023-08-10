import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import { middlewareProvinsiSelected } from "middlewares/middlewareSelected";

export default handler()
  .use(middlewareProvinsiSelected)
  .get(async (req, res) => {
    try {
      const { provinsi_id } = req.query;
      const result = await req
        .knex("provinsi as p")
        .select(
          "p.id",
          "p.provinsi",
          req.knex.raw("SUM(kl.jumlah_tps) as jumlah_tps"),
          req.knex.raw("SUM(kl.jumlah_pemilih) as jumlah_pemilih")
        )
        .join("kabkota as kk", "p.id", "kk.provinsi_id")
        .join("kecamatan as kc", "kk.id", "kc.kabkota_id")
        .join("kelurahan as kl", "kc.id", "kl.kecamatan_id")
        .where("p.id", provinsi_id)
        .whereIn("p.id", req.arrayProvinsi)
        .groupBy("p.id", "p.provinsi")
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
