import handlerPublic from "middlewares/handlerPublic";

export default handlerPublic().get(async (req, res) => {
  const data = await req.knex("partai").orderBy("partai", "asc");
  res.json(data);
});
