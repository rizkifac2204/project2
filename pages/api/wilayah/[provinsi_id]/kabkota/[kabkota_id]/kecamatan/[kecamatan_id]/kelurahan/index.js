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
    const { kecamatan_id } = req.query;
    const data = await req.knex
      .select(`kelurahan.*`, `jenis.jenis`)
      .from(`kelurahan`)
      .innerJoin(`jenis`, `jenis.id`, `kelurahan.jenis_id`)
      .where(`kelurahan.kecamatan_id`, kecamatan_id)
      .whereIn(`kelurahan.kecamatan_id`, req.arrayKecamatan)
      .orderBy(`kelurahan`, `asc`);
    res.json(data);
  });
