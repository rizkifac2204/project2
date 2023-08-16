import getLogger from "middlewares/getLogger";

export default async function middlewareArrayUserAllowed(req, res, next) {
  try {
    const { id: user_id, level, verifikator } = req.session.user;
    const subquery = await req
      .knex("user")
      .select("id")
      .where("id", user_id)
      .orWhere(function () {
        if (verifikator) {
          this.andWhere("level_id", ">=", level);
        } else {
          this.andWhere("level_id", ">", level);
        }
      });
    req.arrayUserAllowed = subquery.map((item) => item.id);
    next();
  } catch (err) {
    getLogger.error(err);
    return res.status(403).json({ message: "Not Allowed" });
  }
}
