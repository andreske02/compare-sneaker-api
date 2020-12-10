//===================================================================================================================================================================================================================================================================================================================
//
//    ###    ##     ##  ####    #####    #####   ####
//   ## ##   ####   ##  ##  ##  ##  ##   ##     ##
//  ##   ##  ##  ## ##  ##  ##  #####    #####   ###
//  #######  ##    ###  ##  ##  ##  ##   ##        ##
//  ##   ##  ##     ##  ####    ##   ##  #####  ####
//
//===================================================================================================================================================================================================================================================================================================================

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const Helpers = require("./utils/helpers.js");
const { log } = require("console");

const port = 3000;

const pg = require("knex")({
  client: "pg",
  version: "9.6",
  searchPath: ["knex", "public"],
  connection: process.env.PG_CONNECTION_STRING
    ? process.env.PG_CONNECTION_STRING
    : "postgres://andres:example@localhost:5432/andres",
});

const app = express();
http.Server(app);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

/*--------- SHOW ALL RECORDS --------*/
app.get("/", (req, res) => {
  res.status(200).send(`
  <style>
  *{
    font-family: sans-serif;
  }
  .container{
    width: 90%;
    max-width: 1200px;
    margin:auto; 
 }
  </style>
 
<section class='container'>
  <h1>A sneaker API to get the best prices, services from a sneaker webshop.</h1>
  <h3>Endpoints</h3>
  <ul>
    <li>/api</li>
    <li>/api/{search}</li>
    <li>/api/{search}/{price}</li>
  </ul>
</section>


  `);
});

/*--------- INITIALIZE TABLES --------*/
async function initialiseTables() {
  await pg.schema.hasTable("sneakers").then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable("sneakers", (table) => {
          table.increments();
          table.uuid("uuid");
          table.string("content");
          table.string("story_id");
          table.integer("order");
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log("created table sneakers");
        });
    }
  });
  // await pg.schema.hasTable("test").then(async (exists) => {
  //   if (!exists) {
  //     await pg.schema
  //       .createTable("test", (table) => {
  //         table.increments();
  //         table.uuid("uuid");
  //         table.string("title");
  //         table.string("summary");
  //         table.timestamps(true, true);
  //       })
  //       .then(async () => {
  //         console.log("created table story");
  //         for (let i = 0; i < 10; i++) {
  //           const uuid = Helpers.generateUUID();
  //           await pg
  //             .table("story")
  //             .insert({ uuid, title: `random element number ${i}` });
  //         }
  //       });
  //   }
  // });
}
initialiseTables();

module.exports = app;
