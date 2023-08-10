import handlerPublic from "middlewares/handlerPublic";

export default handlerPublic().get(async (req, res) => {
  const { provinsi_id } = req.query;
  const data = await req.knex
    .select(`kabkota.*`, `jenis.jenis`)
    .from(`kabkota`)
    .innerJoin(`jenis`, `jenis.id`, `kabkota.jenis_id`)
    .where(`kabkota.provinsi_id`, provinsi_id)
    .orderBy(`kabkota`, `asc`);

  res.json(data);
});
