import { setUserCookie } from "libs/auth";
import handlerPublic from "middlewares/handlerPublic";

export default handlerPublic().post(async (req, res) => {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ message: "Method Not Allowed" });

    const { email, image } = req.body;

    if (!email) return res.status(401).json({ message: "Not Detected" });

    const checkUser = await req.knex
      .select(`user.*`, `level.level`)
      .from(`user`)
      .innerJoin(`level`, `user.level_id`, `level.id`)
      .where(`user.email`, email)
      .first();

    if (!checkUser)
      return res.status(401).json({ message: "Data User Tidak Ditemukan" });

    const dataForJWT = {
      id: checkUser.id,
      level: checkUser.level_id,
      role: checkUser.level,
      tps_id: checkUser.tps_id,
      name: checkUser.nama,
      verifikator: checkUser.verifikator,
      image: image,
    };

    await setUserCookie(dataForJWT, res);
    return res.status(200).json({ message: "Success Login", type: "success" });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
});
