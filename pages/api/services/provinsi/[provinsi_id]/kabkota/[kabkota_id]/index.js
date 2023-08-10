import handlerPublic from "middlewares/handlerPublic";

export default handlerPublic().get(async (req, res) => {
  const { provinsi_id, kabkota_id } = req.query;
  const result = await req.knex
    .select(`kabkota.*`, `jenis.jenis`)
    .from(`kabkota`)
    .innerJoin(`jenis`, `jenis.id`, `kabkota.jenis_id`)
    .where(`kabkota.id`, kabkota_id)
    .first();

  if (!result)
    return res.status(404).json({ status: 404, message: "Tidak Ditemukan" });

  res.json(result);
});
