import handler from "middlewares/handler";
import {
  middlewareProvinsiSelected,
  middlewareKabkotaSelected,
} from "middlewares/middlewareSelected";

export default handler()
  .use(middlewareProvinsiSelected)
  .use(middlewareKabkotaSelected)
  .get(async (req, res) => {
    const { provinsi_id } = req.query;
    const result = await req.knex
      .select(
        "kabkota.*",
        "jenis.jenis",
        req.knex.raw(
          "(SELECT SUM(kl.jumlah_tps) FROM kelurahan kl WHERE kl.kecamatan_id IN (SELECT kc.id FROM kecamatan kc WHERE kc.kabkota_id = kabkota.id)) as jumlah_tps"
        ),
        req.knex.raw(
          "(SELECT SUM(kl.jumlah_pemilih) FROM kelurahan kl WHERE kl.kecamatan_id IN (SELECT kc.id FROM kecamatan kc WHERE kc.kabkota_id = kabkota.id)) as jumlah_pemilih"
        )
      )
      .from("kabkota")
      .innerJoin("jenis", "jenis.id", "kabkota.jenis_id")
      .where("kabkota.provinsi_id", provinsi_id)
      .whereIn("kabkota.id", req.arrayKabkota)
      .orderBy("kabkota.kabkota", "asc");

    res.json(result);
  });
