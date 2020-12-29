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
const puppeteer = require("puppeteer");
const $ = require("cheerio");
const CronJob = require("cron").CronJob;
const pg = require("knex")({
  client: "pg",
  version: "9.6",
  searchPath: ["knex", "public"],
  connection: process.env.PG_CONNECTION_STRING
    ? process.env.PG_CONNECTION_STRING
    : "postgres://example:example@localhost:5432/sneakerdb",
});
let productArray = [];
let browser;
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

/*--------- SHOPS --------*/
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
/*======= Torfs =======*/
async function torfs(res) {
 
  let url = "https://www.torfs.be/nl/zoekresultaten?q=sneakers&start=0&sz=24";
  const base_url = "https://www.torfs.be";
  page = await configureBrowser(url);
  try {
    database.deleteSneakers();
    await page.reload();
    let html = await page.evaluate(() => document.body.innerHTML);
    let bar = new Promise((resolve, reject) => {
       $(".product-tile", html).each(async function (counter, value) {
        let product_url = $(this).find(".js-product-tile-link").attr("href");
          // GO TO DETAIL
          detailpage = await openPage(base_url + product_url);
          const detail = await detailpage.evaluate(() => document.body.innerHTML);
          const content = $(".product-detail", detail);
          let product_brand = content.find(".js-productAttributes .brand-name").text();
          let product_name = content.find(".js-productAttributes .product-name").text();
          let product_price = content.find(".product-variants .price__list .value").text().replace(/(\r\n|\n|\r)/gm, "").trim() ;
          let product_sale_price = content.find(".product-variants .discounted .value").text().replace(/(\r\n|\n|\r)/gm, "").trim();
          let product_sale = product_sale_price ? true : false;
          let product_description = content.find(".attribute-siteDescription").text().trim();
          let product_available = [];
          let product_colors = [];
          let  product_shipping_info =  'Voor 22u besteld, volgende werkdag geleverd.';
          content.find(".size-blocks .size-block").each(async function (index, value) {
            product_available.push($(this).find('a').text().replace(/(\r\n|\n|\r)/gm, "").trim()) ;
          });
          let imageElem = content.find("img.carousel-image.img-fluid.w-100");
          let product_image = imageElem.prop("data-src")
            ? imageElem.prop("data-src")
            : imageElem.prop("src");
          product_available = [...new Set(product_available)];

          const sneakerObj = {
            product_brand: product_brand,
            product_name: product_name,
            product_price: product_price,
            product_sale_price: product_sale_price,
            product_sale: product_sale,
            product_description: product_description,
            product_image:product_image,
            product_available: JSON.stringify(product_available),
            product_colors: JSON.stringify(product_colors),
            product_url: base_url + product_url,
            product_shipping_info: product_shipping_info,
            brand_uuid: uuid,
          };
          database.addSneakers(sneakerObj);
          productArray.push(sneakerObj);
          
          if(counter ===  productArray.length -1 ) detailpage.close();
          if ($(".product-tile", html).length   === productArray.length) resolve();
      
    });   
  });
  
  bar.then(() => {
    console.log("closed");
    page.close();
    res.json(productArray);
});

  } catch (error) {
    console.log("💩", error);
  }
}


app.get("/torfs", async (req, res) => {
  try {
    console.log('Torfs');
    await startTracking(res);
   } catch (err) {
    console.log("💩", err);
    res.status(404);
   }
});
app.get("/snipes", (req, res) => {
  res.send("snipes");
});
app.get("/adidas", (req, res) => {
  res.send("adidas");
});
app.get("/shops/:search", (req, res) => {
  res.send("test");
});
app.get("/seeds", async (req, res) => {
  try {
    let sneaker = await database.sneakerSeeders();
    let brand = await database.brandSeeders();
    res.json(sneaker);
    res.json(brand);
  } catch (error) {
    console.log("💩", error);
  }
});
app.get("/show", async (req, res) => {
  try {
    const result = await pg.select("*").from("sneakers");
    res.json({
      res: result,
    });
  } catch (error) {
    console.log("💩", error);
  }
});





async function startTracking(res) {
  try {
    productArray = [];
    await torfs(res);

  } catch (error) {
    console.log("💩", error);
  }
}
async function configureBrowser(url) {
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
   return openPage(url);
  } catch (error) {
    console.log("💩", error);
  }
}
async function openPage(url){
  const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 0 });
    return page;
}
database.initialiseTables();
module.exports = app;
