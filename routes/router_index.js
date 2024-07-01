const {
  baseFunction,
  secondFunction,
} = require("../controllers/controller_index");
const routes = require("express").Router();

routes.get("/", baseFunction);
routes.get("/secondR", secondFunction);

module.exports = routes;
