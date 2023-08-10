import handler from "middlewares/handler";
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
    const { kabkota_id } = req.query;

    const result = await req.knex
      .select(
        "kecamatan.*",
        req.knex.raw(
          "(SELECT SUM(kl.jumlah_tps) FROM kelurahan kl WHERE kl.kecamatan_id = kecamatan.id) as jumlah_tps"
        ),
        req.knex.raw(
          "(SELECT SUM(kl.jumlah_pemilih) FROM kelurahan kl WHERE kl.kecamatan_id = kecamatan.id) as jumlah_pemilih"
        )
      )
      .from("kecamatan")
      .where("kecamatan.kabkota_id", kabkota_id)
      .whereIn("kecamatan.id", req.arrayKecamatan)
      .orderBy("kecamatan.kecamatan", "asc");

    res.json(result);
  });
