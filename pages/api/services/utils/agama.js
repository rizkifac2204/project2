import handler from "middlewares/handler";

export default handler().get(async (req, res) => {
  const data = await req.knex("utils_agama").orderBy("id", "asc");
  res.json(data);
});
