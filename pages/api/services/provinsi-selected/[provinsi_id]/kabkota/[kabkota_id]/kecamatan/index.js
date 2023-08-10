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
    const data = await req.knex
      .select(`kecamatan.*`)
      .from(`kecamatan`)
      .where(`kecamatan.kabkota_id`, kabkota_id)
      .whereIn(`kecamatan.id`, req.arrayKecamatan)
      .orderBy(`kecamatan`, `asc`);

    res.json(data);
  });
