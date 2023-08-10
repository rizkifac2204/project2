import handlerPublic from "middlewares/handlerPublic";

export default handlerPublic().get(async (req, res) => {
  const { provinsi_id, kabkota_id, kecamatan_id } = req.query;
  const result = await req.knex
    .select(`kecamatan.*`)
    .from(`kecamatan`)
    .where(`kecamatan.id`, kecamatan_id)
    .first();

  if (!result)
    return res.status(404).json({ status: 404, message: "Tidak Ditemukan" });

  res.json(result);
});
