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
var path = require('path');
const port = 3000;
const htmlFile = path.join(__dirname + '/components/index.html');
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
          console.log("created sneakers table");
        });
    } 
  });
}
initialiseTables();

module.exports = app;
