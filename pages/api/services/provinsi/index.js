import handlerPublic from "middlewares/handlerPublic";

export default handlerPublic().get(async (req, res) => {
  const data = await req.knex("provinsi").orderBy("provinsi", "asc");
  res.json(data);
});
