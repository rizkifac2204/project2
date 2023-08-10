import handlerPublic from "middlewares/handlerPublic";

export default handlerPublic().get(async (req, res) => {
  const { provinsi_id } = req.query;
  const result = await req.knex(`provinsi`).where(`id`, provinsi_id).first();

  if (!result)
    return res.status(404).json({ status: 404, message: "Tidak Ditemukan" });

  res.json(result);
});
