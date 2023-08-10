import getLogger from "middlewares/getLogger";

export default async function levelEmpatUp(req, res, next) {
  try {
    const { level } = req.session.user;
    if (level > 4)
      return res
        .status(400)
        .json({ message: "Tidak Ada Akses", type: "error" });

    next();
  } catch (err) {
    getLogger.error(err);
    return res.status(403).json({ message: "Not Allowed" });
  }
}
