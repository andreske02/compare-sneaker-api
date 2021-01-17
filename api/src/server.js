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
/**
    * @param none
    * @returns html page
*/
app.get("/", (req, res) => {
  res.status(200).sendFile(htmlFile);
});
//-------- TORFS ENDPOINTS --------//
/**
    * @param none
    * @returns array of sneakers objects
*/
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
/**
    * @param none
    * @returns array of sneakers objects
*/
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
/**
    * @param none
    * @returns array of brand objects
*/
app.post("/brand", async (req, res) => {
  try {
    const brand = await database.addBrand(req.body).then((value) => {

      if(value){
        res.status(201).send(`Succesfully created ${req.body.brand_name}`);
      }else{
        res.status(400).send(`Error with creating a brand`);
      }
    }).catch((error) => {
      console.log("❌ ERROR: ", error.message);
      res.status(500).send(error.message);
    });
  } catch (error) {
    console.log("❌ ERROR: ", error);
    res.status(500).send(error);
  }
});
// Show brand by uuid
/**
    * @param uuid
    * @returns brand object
*/
app.get("/brandbyid/:uuid", async (req, res) => {
  try {
    let checkBrandUuid = Helpers.checkIfUuid(req.params.uuid);
    if(!checkBrandUuid){
      res.status(400).send(`${req.params.uuid} wrong type of uuid`);
    } 
    const brand = await database.getBrandById(req.params.uuid);
    if (brand.length < 1) {
      res.status(400).send(`${req.params.uuid} don't exist! `);
    } else {
      res.status(200).json(brand);
    }
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(500).send(error.message);
  }
});
// Show brand by name
/**
    * @param brandname
    * @returns brand object
*/
app.get("/brand/:brandname", async (req, res) => {
  try {
    const brand = await database.getBrandByName(req.params.brandname);
    if (brand.length < 1) {
      res.status(400).send(`${req.params.brandname} don't exist! `);
    } else {
      console.log("✅", `Show brand ${brand[0].brand_name}`);
      res.json(brand);
    }
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(500).send(error.message);
  }
});
// Update brand by uuid
/**
    * @param none
    * @returns status 204 + message
*/
app.put("/updatebrand", async (req, res) => {
  try {
    const brand = await database.updateBrandById(req.body).then((value) => {
      if(value){
        console.log("✅", `Update brand ${req.body.brand_name}`);
        res.status(204).send(`Update brand ${req.body.brand_name}`);
      }else{
        res.status(400).send(`Error with updating ${req.body.brand_name} brand `);
      }
    }).catch((error) => {
      console.log("❌ ERROR: ", error.message);
      res.status(500).send(error.message);
    });

  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(500).send(error.message);
  }
});
// Delete brand by uuid
/**
    * @param uuid
    * @returns status 204 + message
*/
app.delete("/brand/:uuid", async (req, res) => {
  try {
    const brand = await database.deleteBrandById(req.params.uuid).then((value) => {
      if(value){
        res.status(204).send(`Deleted ${req.body.brand_name}`);
      }else{
        res.status(400).send(`Wrong Uuid`);
      }
    }).catch((error) => {
      console.log("❌ ERROR: ", error.message);
      res.status(500).send(error.message);
    });
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(500).send(error.message);
  }
});

//-------- SNEAKERS ENDPOINTS --------//
// Create sneaker
/**
    * @param none
    * @returns status 201 + message
*/
app.post("/sneaker", async (req, res) => {
  try {
    const brand = await database.addSneaker(req.body).then((value) => {
      if(value){
        res.status(201).send(`Succesfully created ${req.body.product_name}`);
      }else{
        res.status(400).send(`Error with creating a brand `);
      }
    }).catch((error) => {
      console.log("❌ ERROR: ", error.message);
      res.status(500).send(error.message);
    });
  } catch (error) {
    console.log("❌ ERROR: ", error);
    res.status(500).send(error);
  }
});

/**
    * @param brand & sort
    * @returns sneakers object
*/
app.get("/sneakers/:brand/:sort*?/", async (req, res) => {
  try {
    let sorting = 'asc';
    if (req.params.hasOwnProperty('sort')) {
      sorting = req.params.sort;
    }
    const sneakers = await database.getSneakersByBrand(req.params.brand, sorting);
    if (sneakers.length == 0) {
      res.status(400).send("Wrong brand..");
    } else {
      for (const sneaker of sneakers) {
        sneaker.brand_name = sneaker.brand_name.toUpperCase();
      }
      res.status(200).json(sneakers);
    }
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(500).send(error.message);
  }
});
/**
    * @param uuid
    * @returns status 204 + message
*/
app.delete("/sneaker/:uuid", async (req, res) => {
  try {
    const sneakers = await database.deleteSneaker(req.params.uuid).then((value)=>{
      if(value){
        res.status(204).json("✅", `Deleted brand with uuid ${req.params.uuid}`);
      }else{
        res.status(400).send(`Error with deleting a sneaker ➡ wrong uuid`);
      }
    }).catch((error) => {
      console.log("❌ ERROR: ", error.message);
      res.status(500).send(error.message);
    });
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(500).send(error.message);
  }
});


//-------- OTHER ENDPOINTS --------//
/**
    * @param none
    * @returns seeds
*/
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
/**
    * @param none
    * @returns objects of sneakers
*/
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


