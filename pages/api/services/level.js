import handler from "middlewares/handler";

export default handler().get(async (req, res) => {
  const { level, verifikator } = req.session.user;
  const data = await req
    .knex("level")
    .modify((builder) => {
      if (level === 1) return;
      if (verifikator) return builder.where("id", ">=", level);
      return builder.where("id", ">", level);
    })
    .whereNot("id", 5)
    .orderBy("id", "asc");
  res.json(data);
});
