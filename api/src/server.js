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
const request = require("request");
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
const hosturl = "http://localhost:3000";

/*--------- SHOW ALL RECORDS --------*/
app.get("/", (req, res) => {
  res.status(200).sendFile(htmlFile);
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

//TODO TORFS
/*======= Torfs function =======*/
async function torfs(url, res, amountOfProducts) {
  productArray = [];
  const base_url = "https://www.torfs.be";
  let countProductNotFound = 0;
  let brand_uuid;
  // Get brand uuid to connect tables
  try {
    let brand = await database.getBrandByName('torfs');
    console.log("✅", `Brand uuid is ${brand[0].uuid}`);
    brand_uuid = brand[0].uuid;
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
  }

  // Start scraping 
  try {
    page = await configureBrowser(url);
    let html = await page.evaluate(() => document.body.innerHTML);
    console.log("Start scraping");
    let waitForProducts = new Promise((resolve, reject) => {
      $(".product-tile", html).each(async function (counter, value) {
        let product_url = $(this).find(".js-product-tile-link").attr("href");
        if (product_url == undefined) {
          countProductNotFound = countProductNotFound + 1;
        } else {
          // GO TO DETAIL
          detailpage = await openPage(base_url + product_url);
          const detail = await detailpage.evaluate(
            () => document.body.innerHTML
          );
          const content = $(".product-detail", detail);
          let product_brand = content
            .find(".js-productAttributes .brand-name")
            .text();
          let product_name = content
            .find(".js-productAttributes .product-name")
            .text();

          let product_price =
            content.find(".price span.value").first().text() !== ""
              ? content.find(".price span.value").first().text()
              : content.find(".product-variants .price__list .value").text();
          product_price = product_price.replace(/(\r\n|\n|\r)/gm, "").trim();

          let product_sale_price = content
            .find(".product-variants .discounted .value")
            .text()
            .replace(/(\r\n|\n|\r)/gm, "")
            .trim();
          let product_sale = product_sale_price ? true : false;
          let product_description = content
            .find(".attribute-siteDescription")
            .text()
            .trim();
          let product_available = [];
          let product_colors = [];
          let product_shipping_info =
            "Voor 22u besteld, volgende werkdag geleverd.";
          content
            .find(".size-blocks .size-block")
            .each(async function (index, value) {
              product_available.push(
                $(this)
                  .find("a")
                  .text()
                  .replace(/(\r\n|\n|\r)/gm, "")
                  .trim()
              );
            });
          let imageElem = content.find("img.carousel-image.img-fluid.w-100");
          let product_image = imageElem.prop("data-src")
            ? imageElem.prop("data-src")
            : imageElem.prop("src");
          product_available = [...new Set(product_available)];

          // Waitforobject
          let waitForObject = new Promise((resolve, reject) => {
            const sneakerObj = {
              uuid: Helpers.generateUUID(),
              product_brand: product_brand,
              product_name: product_name,
              product_price: product_price,
              product_sale_price: product_sale_price,
              product_sale: product_sale,
              product_description: product_description,
              product_image: product_image,
              product_available: JSON.stringify(product_available),
              product_colors: JSON.stringify(product_colors),
              product_url: base_url + product_url,
              product_shipping_info: product_shipping_info,
              brand_uuid: brand_uuid,
            };
            resolve(sneakerObj);
            console.log("✅", "Created new sneaker");
          });
          // Completed object
          waitForObject
            .then((value) => {
              productArray.push(value);
              if (
                $(".product-tile", html).length - countProductNotFound ===
                productArray.length
              )
                resolve();
            })
            .catch((error) => {
              console.log("❌ ERROR: ", error.message);
            });
        }
      });
    });

    waitForProducts
      .then(async () => {
        database.addSneakers(productArray).then(async () => {
          let endpage;
          let currentpage;
          $(".bs-link", html).each(async function (counter, value) {
            endpage = $(this).prop("data-page");
          });
          currentpage = $(".bs-current", html).prop("data-page");
          if (currentpage !== endpage) {
            let nextpage = await $(".bs-current", html).next().prop("data-page");
            page
              .close()
              .then(() => {
                console.log("closed page");
                browser.close().then(() => {
                  console.log("gotonextpage");
                  request.post(`${hosturl}/torfs`, {
                    form: { counter: nextpage, amount: amountOfProducts },
                  });
                  res.json(productArray);
                });
              })
              .catch((error) => {
                console.log("❌ ERROR: ", error.message);
              });
          } else {
            page.close();
            browser.close().then(() => {
              console.log("closed browser");
              res.json(productArray);
            });
          }
        });
      })
      .catch((error) => {
        console.log("❌ ERROR: ", error.message);
      });
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
  }
}
/*======= Torfs start scraping =======*/
app.get("/torfs", async (req, res) => {
  try {
    console.log("Torfs");
    await database.deleteSneakers();
    let amountOfProducts = 15;
    let url = `https://www.torfs.be/nl/zoekresultaten?q=sneakers&start=0&sz=${amountOfProducts}` ;
    await torfs(url, res, amountOfProducts);
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
    await torfs(url, res, amountOfProducts);
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(404);
  }
});



//TODO BRANDS ENDPOINTS
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
    if(brand.length < 1){
      console.log("❌ ERROR: ", `${req.params.uuid} don't exist! `);
      res.status(500).send(`${req.params.uuid} don't exist! `);
    }else{
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
    if(brand.length < 1){
      console.log("❌ ERROR: ", `${req.params.uuid} don't exist! `);
      res.status(500).send(`${req.params.uuid} don't exist! `);
    }else{
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
    const brand = await  database.updateBrandById(req.body);
    console.log("✅",`Update brand ${req.body.brand_name}`);
    res.status(410).send(`Update brand ${req.body.brand_name}`);
   } catch (error) {
     console.log("❌ ERROR: ", error.message);
     res.status(500).send(error.message);
   }
});
// Delete brand by uuid
app.delete("/brand/:uuid", async (req, res) => {
  try {
   const brand = await  database.deleteBrandById(req.params.uuid);
   console.log("✅", "Deleted brand");
   res.status(410).send(`Deleted ${req.body.brand_name}`);
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
    res.status(500).send(error.message);
  }
});

//TODO SNEAKERS ENDPOINTS
app.get("/sneakers/:brand/:sort*?/", async (req, res) => {
  try {
    let sorting = 'asc';
    if(req.params.hasOwnProperty('sort')){
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



//TODO OTHER ENDPOINTS
app.get("/snipes", (req, res) => {
  res.send("snipes");
});
app.get("/adidas", (req, res) => {
  res.send("adidas");
});
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


async function configureBrowser(url) {
  try {
    browser = await puppeteer.launch({
      // headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    return openPage(url);
  } catch (error) {
    console.log("❌ ERROR: ", error.message);
  }
}
async function openPage(url) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0", timeout: 0 });
  return page;
}
database.initialiseTables();
module.exports = app;
