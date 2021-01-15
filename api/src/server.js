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
var path = require("path");
const htmlFile = path.join(__dirname + "/components/index.html");
const database = require("./utils/database.js");
const scraping = require("./utils/scraping.js");
const app = express();
const puppeteer = require("puppeteer");
const $ = require("cheerio");
const CronJob = require("cron").CronJob;
const request = require("request");
const randomUseragent = require('random-useragent');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const pg = require("knex")({
  client: "pg",
  version: "9.6",
  searchPath: ["knex", "public"],
  connection: process.env.PG_CONNECTION_STRING ?
    process.env.PG_CONNECTION_STRING : "postgres://example:example@localhost:5432/sneakerdb",
});

/*--------- Arrays and objects --------*/
let shops = [
  "Snipes",
  "Adidas",
  "Zalando",
  "Nike",
  "Sneakerdistrict ",
  "Torfs",
  "SneakerBaron",
  "Asos",
  "Ultimate Sneakerstore",
];
let productArray = [];
let browser;
http.Server(app);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const hosturl = "http://localhost:3001";

//-------- SHOW ALL RECORDS --------//
app.get("/", (req, res) => {
  res.status(200).sendFile(htmlFile);
});
//-------- TORFS ENDPOINTS --------//
/*======= Torfs start scraping =======*/
app.get("/torfs", async (req, res) => {
  try {
    console.log("Torfs");
    await database.deleteSneakers();
    let amountOfProducts = 5;
    let url = `https://www.torfs.be/nl/zoekresultaten?q=sneakers&start=0&sz=${amountOfProducts}`;
    await scraping.torfs(url, res, amountOfProducts);
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(404);
  }
});
/*======= Torfs start scraping second pages =======*/
app.post("/torfs", async (req, res) => {
  try {
    console.log(`Torfs page ${req.body.counter}`);
    let amountOfProducts = req.body.amount;
    let total = amountOfProducts * req.body.counter;
    let url = `https://www.torfs.be/nl/zoekresultaten?q=sneakers&start=${total}&sz=${amountOfProducts}`;
    console.log(url);
    await scraping.torfs(url, res, amountOfProducts);
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(404);
  }
});

//-------- BRANDS ENDPOINTS --------//
// Create brand
app.post("/brand", async (req, res) => {
  try {
    const brand = await pg
      .table("brands")
      .insert(req.body)
      .then(function () {
        console.log("✅", "Created new brand");
        res.status(201).send(`Succesfully created ${req.body.brand_name}`);
      })
      .catch((error) => {
        console.log("❌ ERROR: ", error.message);
        res.status(500).send(error.message);
      });
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(500).send(error.message);
  }
});
// Show brand by uuid
app.get("/brandbyid/:uuid", async (req, res) => {
  try {
    const brand = await database.getBrandById(req.params.uuid);
    if (brand.length < 1) {
      console.log("❌ ERROR: ", `${req.params.uuid} don't exist! `);
      res.status(500).send(`${req.params.uuid} don't exist! `);
    } else {
      console.log("✅", `Show brand ${brand[0].brand_name}`);
      res.json(brand);
    }
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(500).send(error.message);
  }
});
// Show brand by name
app.get("/brand/:brandname", async (req, res) => {
  try {
    const brand = await database.getBrandByName(req.params.brandname);
    if (brand.length < 1) {
      console.log("❌ ERROR: ", `${req.params.uuid} don't exist! `);
      res.status(500).send(`${req.params.uuid} don't exist! `);
    } else {
      console.log("✅", `Show brand ${data[0].brand_name}`);
      res.json(data);
    }
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(500).send(error.message);
  }
});
// Update brand by uuid
app.put("/updatebrand", async (req, res) => {
  try {
    console.log(req.body);
    const brand = await database.updateBrandById(req.body);
    console.log("✅", `Update brand ${req.body.brand_name}`);
    res.status(410).send(`Update brand ${req.body.brand_name}`);
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(500).send(error.message);
  }
});
// Delete brand by uuid
app.delete("/brand/:uuid", async (req, res) => {
  try {
    const brand = await database.deleteBrandById(req.params.uuid);
    console.log("✅", "Deleted brand");
    res.status(410).send(`Deleted ${req.body.brand_name}`);
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(500).send(error.message);
  }
});

//-------- SNEAKERS ENDPOINTS --------//
app.get("/sneakers/:brand/:sort*?/", async (req, res) => {
  try {
    let sorting = 'asc';
    if (req.params.hasOwnProperty('sort')) {
      sorting = req.params.sort;
    }
    const sneakers = await database.getSneakersByBrand(req.params.brand, sorting);
    if (sneakers.length == 0) {
      console.log("No content");
      // No content
      res.status(204).send();
    } else {
      console.log("✅", `Show sneakers by ${sorting}`);
      for (const sneaker of sneakers) {
        sneaker.brand_name = sneaker.brand_name.toUpperCase();
      }
      res.json(sneakers);
    }
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(500).send(error.message);
  }
});

//-------- OTHER ENDPOINTS --------//
app.get("/seeds", async (req, res) => {
  try {
    let sneaker = await database.sneakerSeeders();
    let brand = await database.brandSeeders();
    res.json(sneaker);
    res.json(brand);
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
  }
});
app.get("/show", async (req, res) => {
  try {
    const result = await pg.select("*").from("sneakers");
    res.json(result);
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
  }
});



database.initialiseTables();
module.exports = app;


