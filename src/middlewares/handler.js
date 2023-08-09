import nextConnect from "next-connect";
import cookie from "cookie";
import getLogger from "middlewares/getLogger";
import { verifyAuth } from "libs/auth";
import knex from "knex";
import knexConfig from "libs/db";

export default function handler() {
  const apiHandler = nextConnect({
    onError: (err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: err.toString(), type: "error" });
    },
    onNoMatch: (req, res) => {
      res.status(404).json({ message: "Not found", type: "error" });
    },
  });

  apiHandler
    .use((req, res, next) => {
      req.knex = knex(knexConfig);
      next();
    })
    .use(async (req, res, next) => {
      try {
        const cookiess = cookie.parse(req.headers.cookie || "");
        const token = cookiess[process.env.JWT_NAME];
        const verifiedToken = await verifyAuth(token, res).catch((err) => {
          // console.log(err);
        });
        if (!verifiedToken) {
          return res.status(401).json({ message: "Akses Tidak Dikenal" });
        } else {
          req.session = {
            user: verifiedToken,
          };
        }
        next();
      } catch (err) {
        getLogger.error(err);
        return res.status(401).json({ message: "Akses Tidak Dikenal" });
      }
    })
    .use(async (req, res, next) => {
      res.on("finish", function () {
        req.knex.destroy();
      });
      next();
    });

  return apiHandler;
}
