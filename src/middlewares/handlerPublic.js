import nextConnect from "next-connect";
import knex from "knex";
import knexConfig from "libs/db";

export default function handlerPublic() {
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
      res.on("finish", function () {
        req.knex.destroy();
      });
      next();
    });

  return apiHandler;
}
