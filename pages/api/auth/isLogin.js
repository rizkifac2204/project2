import cookie from "cookie";
import getLogger from "middlewares/getLogger";
import { verifyAuth } from "libs/auth";

export default async function isLogin(req, res) {
  try {
    const cookiess = cookie.parse(req.headers.cookie || "");
    const token = cookiess[process.env.JWT_NAME];
    const verifiedToken = await verifyAuth(token, res).catch((err) => {
      // console.log(err);
    });

    if (!verifiedToken)
      return res.status(401).json({ message: "Akses Tidak Dikenal" });

    res.json(verifiedToken);
  } catch (err) {
    getLogger.error(err);
    res.status(401).json({ message: "Akses Tidak Dikenal" });
  }
}
