import handler from "middlewares/handler";

export default handler().get(async (req, res) => {
  const data = await req.knex("utils_status_pns").orderBy("id", "asc");
  res.json(data);
});
