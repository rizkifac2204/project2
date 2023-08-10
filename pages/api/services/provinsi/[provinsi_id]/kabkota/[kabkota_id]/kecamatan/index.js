import handlerPublic from "middlewares/handlerPublic";

export default handlerPublic().get(async (req, res) => {
  const { provinsi_id, kabkota_id } = req.query;
  const data = await req.knex
    .select(`kecamatan.*`)
    .from(`kecamatan`)
    .where(`kecamatan.kabkota_id`, kabkota_id)
    .orderBy(`kecamatan`, `asc`);

  res.json(data);
});
