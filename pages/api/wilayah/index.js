import handler from "middlewares/handler";
import { middlewareProvinsiSelected } from "middlewares/middlewareSelected";

export default handler()
  .use(middlewareProvinsiSelected)
  .get(async (req, res) => {
    const result = await req
      .knex("provinsi as p")
      .select(
        "p.id",
        "p.provinsi",
        req.knex.raw(
          "(SELECT SUM(kl.jumlah_tps) FROM kelurahan kl WHERE kl.kecamatan_id IN (SELECT kc.id FROM kecamatan kc WHERE kc.kabkota_id IN (SELECT kk.id FROM kabkota kk WHERE kk.provinsi_id = p.id))) as jumlah_tps"
        ),
        req.knex.raw(
          "(SELECT SUM(kl.jumlah_pemilih) FROM kelurahan kl WHERE kl.kecamatan_id IN (SELECT kc.id FROM kecamatan kc WHERE kc.kabkota_id IN (SELECT kk.id FROM kabkota kk WHERE kk.provinsi_id = p.id))) as jumlah_pemilih"
        )
      )
      .whereIn("p.id", req.arrayProvinsi)
      .groupBy("p.id", "p.provinsi");
    res.json(result);
  });
