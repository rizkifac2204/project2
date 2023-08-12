import handlerPublic from "middlewares/handlerPublic";
import getLogger from "middlewares/getLogger";

export default handlerPublic().get(async (req, res) => {
  const data = {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    PROVINSI: process.env.PROVINSI,
    KABKOTA: process.env.KABKOTA,
    NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  };

  getLogger.error("COba Error");
  res.json(data);
});
