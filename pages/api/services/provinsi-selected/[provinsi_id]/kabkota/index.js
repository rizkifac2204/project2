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
    const data = await req.knex
      .select(`kabkota.*`, `jenis.jenis`)
      .from(`kabkota`)
      .innerJoin(`jenis`, `jenis.id`, `kabkota.jenis_id`)
      .where(`kabkota.provinsi_id`, provinsi_id)
      .whereIn("kabkota.id", req.arrayKabkota)
      .orderBy(`kabkota`, `asc`);

    res.json(data);
  });
