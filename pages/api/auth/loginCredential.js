import bcrypt from "bcryptjs";
import { setUserCookie } from "libs/auth";
import handlerPublic from "middlewares/hanlderPublic";

export default handlerPublic().post(async (req, res) => {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ message: "Method Not Allowed" });

    const { username, password } = req.body;

    if (!username || !password)
      return res.status(401).json({ message: "Isi Semua Data" });

    const checkUser = await req.knex
      .select(`user.*`, `level.level`)
      .from(`user`)
      .innerJoin(`level`, `user.level_id`, `level.id`)
      .where(`user.username`, username)
      .first();

    if (!checkUser)
      return res.status(401).json({ message: "Data Tidak Ditemukan" });

    const match = await bcrypt.compare(password, checkUser.password);

    if (!match)
      return res.status(401).json({ message: "Data Tidak Ditemukan" });

    const dataForJWT = {
      id: checkUser.id,
      level: checkUser.level_id,
      role: checkUser.level,
      tps_id: checkUser.tps_id,
      name: checkUser.nama,
      verifikator: checkUser.verifikator,
      image: null,
    };

    await setUserCookie(dataForJWT, res);
    return res.status(200).json({ message: "Success Login" });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
});
