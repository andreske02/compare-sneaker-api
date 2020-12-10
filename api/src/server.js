//===================================================================================================================================================================================================================================================================================================================
//
//    ###    ##     ##  ####    #####    #####   ####
//   ## ##   ####   ##  ##  ##  ##  ##   ##     ##
//  ##   ##  ##  ## ##  ##  ##  #####    #####   ###
//  #######  ##    ###  ##  ##  ##  ##   ##        ##
//  ##   ##  ##     ##  ####    ##   ##  #####  ####
//
//===================================================================================================================================================================================================================================================================================================================
/*--------- Variables --------*/
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const Helpers = require("./utils/helpers.js");
const { log } = require("console");
var path = require("path");
const port = 3000;
const htmlFile = path.join(__dirname + "/components/index.html");
const pg = require("knex")({
  client: "pg",
  version: "9.6",
  searchPath: ["knex", "public"],
  connection: process.env.PG_CONNECTION_STRING
    ? process.env.PG_CONNECTION_STRING
    : "postgres://example:example@localhost:5432/sneakerdb",
});
const app = express();
http.Server(app);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/*--------- SHOW ALL RECORDS --------*/
app.get("/", (req, res) => {
  res.status(200).sendFile(htmlFile);
});

/*--------- ADD SEEDS --------*/
app.get("/seeds", async (req, res) => {
  const uuid = Helpers.generateUUID();
  const sneakerObj = {
    uuid: uuid,
    product_brand: "Nike",
    product_name: "Air Force 1 '07",
    product_price: "€ 99,00",
    product_sale_price: "€ 89,00",
    product_sale: true,
    product_description: "Nike Air Force 1 '07",
    product_image:
      "https://www.snipes.be/dw/image/v2/BDCB_PRD/on/demandware.static/-/Sites-snse-master-eu/default/dwd508e7bc/1761737_P.jpg?sw=300&sh=300&sm=fit&sfrm=png",
    product_available: JSON.stringify([
      "36.5",
      "37.5",
      "38.5",
      "39.5",
      "40.5",
      "41.5",
    ]),
    product_colors: JSON.stringify(["White", "Black", "Red"]),
    product_url:
      "https://www.snipes.be/nl/p/nike-air_force_1_shadow-white%2Fwhite%2Fwhite-00013801761737.html",
    product_reviews: "8.7",
    brand_name: "Snipes",
  };

  const result = await pg
    .table("sneakers")
    .insert(sneakerObj)
    .then(async function () {
      console.log("✅", "Created new sneaker");
      res.status(200).json(sneakerObj);
    })
    .catch((e) => {
      console.log("💩", e);
    });
});

/*--------- INITIALIZE TABLES --------*/
async function initialiseTables() {
  await pg.schema.hasTable("sneakers").then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable("sneakers", (table) => {
          table.increments();
          table.uuid("uuid");
          table.string("product_brand");
          table.string("product_name");
          table.string("product_price");
          table.string("product_sale_price");
          table.boolean("product_sale");
          table.string("product_description");
          table.text("product_image");
          table.text("product_available");
          table.text("product_colors");
          table.text("product_url");
          table.string("product_reviews");
          table.string("brand_name");
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log("🎉", "created sneakers table");
        });
    }
  });
}
initialiseTables();

module.exports = app;
