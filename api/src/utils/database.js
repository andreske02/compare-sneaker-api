const Helpers = require("./helpers.js");
const uuid = Helpers.generateUUID();
 const pg = require("knex")({
    client: "pg",
    version: "9.6",
    searchPath: ["knex", "public"],
    connection: process.env.PG_CONNECTION_STRING
      ? process.env.PG_CONNECTION_STRING
      : "postgres://example:example@localhost:5432/sneakerdb",
  });

const database = {
 
  /*--------- INITIALIZE TABLES --------*/
  initialiseTables: async () => {
    await pg.schema.hasTable("sneakers").then(async (exists) => {
      if (!exists) {
        await pg.schema
          .createTable("sneakers", (table) => {
            table.increments();
            table.string("product_brand");
            table.string("product_name");
            table.string("product_price");
            table.string("product_sale_price");
            table.boolean("product_sale");
            table.text("product_description");
            table.text("product_image");
            table.text("product_available");
            table.text("product_colors");
            table.text("product_url");
            table.string("product_shipping_info");
            table.string("brand_uuid");
            table.timestamps(true, true);
          })
          .then(async () => {
            console.log("🎉", "created sneakers table");
            database.sneakerSeeders();
          });
      }
    });
    await pg.schema.hasTable("brands").then(async (exists) => {
      if (!exists) {
        await pg.schema
          .createTable("brands", (table) => {
            table.increments();
            table.uuid("uuid");
            table.string("brand_name");
            table.string("brand_reviews");
            table.text("brand_logo");
            table.text("brand_url");
            table.timestamps(true, true);
          })
          .then(async () => {
            console.log("🎉", "created brands table");
            database.brandSeeders();
          });
      }
    });
  },
  /*--------- SEEDERS --------*/
  sneakerSeeders: async () => {
    const sneakerObj = {
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
      product_shipping_info: "8.7",
      brand_uuid: uuid,
    };
    const sneakers = await pg
      .table("sneakers")
      .insert(sneakerObj)
      .then(async function () {
        console.log("✅", "Created new sneaker");
        return;
      })
      .catch((e) => {
        console.log("💩", e);
      });
  },





  brandSeeders: async () => {
    const brandObj = {
      uuid: uuid,
      brand_name: "Snipes",
      brand_reviews: "8.7",
      brand_logo:
        "https://www.snipes.nl/on/demandware.static/Sites-snse-NL-BE-Site/-/default/dwcc537b29/images/snipes_logo.svg",
      brand_url: "https://www.snipes.com/",
    };
    const brands = await pg
      .table("brands")
      .insert(brandObj)
      .then(async function () {
        console.log("✅", "Created new brand");
        return;
      })
      .catch((e) => {
        console.log("💩", e);
      });
  },







  
  addSneakers: async (sneakerObj) => {
    const sneakers = await pg
      .table("sneakers")
      .insert(sneakerObj)
      .then(function () {
        console.log("✅", "Created new sneaker");
        return;
      })
      .catch((e) => {
        console.log("💩", e);
      });
  },
  deleteSneakers: async () => {
    const sneakers = await pg
      .table("sneakers")
      .truncate()
      .then(async function () {
        console.log("✅", "Sneakers has been truncated");
        return;
      })
      .catch((e) => {
        console.log("💩", e);
      });
  },
};
module.exports = database;
