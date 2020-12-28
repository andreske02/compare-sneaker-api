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
const uuid = Helpers.generateUUID();
const htmlFile = path.join(__dirname + "/components/index.html");
const database = require("./utils/database.js");
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

app.get("/seeds", async (req, res) => {
  try {
    await database.sneakerSeeders();
    await database.brandSeeders();
  } catch (error) {
    console.log("💩", error);
  }
});
database.initialiseTables();
module.exports = app;
