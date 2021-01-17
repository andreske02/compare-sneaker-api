const Helpers = require("./helpers.js");
const pg = require("knex")({
  client: "pg",
  version: "9.6",
  searchPath: ["knex", "public"],
  connection: process.env.PG_CONNECTION_STRING ?
    process.env.PG_CONNECTION_STRING : "postgres://example:example@localhost:5432/sneakerdb",
});

const database = {
  /*--------- INITIALIZE TABLES --------*/
  initialiseTables: async () => {
    await pg.schema.hasTable("brands").then(async (exists) => {
      if (!exists) {
        await pg.schema
          .createTable("brands", (table) => {
            table.increments();
            table.uuid("uuid").notNullable().unique();
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
    await pg.schema.hasTable("sneakers").then(async (exists) => {
      if (!exists) {
        await pg.schema
          .createTable("sneakers", (table) => {
            table.increments();
            table.uuid("uuid").notNullable().unique();
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
            table
              .uuid("brand_uuid")
              .unsigned()
              .references("uuid")
              .inTable("brands")
              .onDelete("CASCADE")
              .onUpdate("CASCADE")
              .notNullable();
            table.timestamps(true, true);
          })
          .then(async () => {
            console.log("🎉", "created sneakers table");
            database.sneakerSeeders();
            // process.exit();
          });
      }
    });
  },

  /*--------- SEEDERS --------*/
  sneakerSeeders: async () => {
    const sneakerObj = {
      uuid: Helpers.generateUUID(),
      product_brand: "Nike",
      product_name: "Air Force 1 '07",
      product_price: "€ 99,00",
      product_sale_price: "€ 89,00",
      product_sale: true,
      product_description: "Nike Air Force 1 '07",
      product_image: "https://www.snipes.be/dw/image/v2/BDCB_PRD/on/demandware.static/-/Sites-snse-master-eu/default/dwd508e7bc/1761737_P.jpg?sw=300&sh=300&sm=fit&sfrm=png",
      product_available: JSON.stringify([
        "36.5",
        "37.5",
        "38.5",
        "39.5",
        "40.5",
        "41.5",
      ]),
      product_colors: JSON.stringify(["White", "Black", "Red"]),
      product_url: "https://www.snipes.be/nl/p/nike-air_force_1_shadow-white%2Fwhite%2Fwhite-00013801761737.html",
      product_shipping_info: "8.7",
      brand_uuid: "6fed38e0-4d1d-11eb-9764-7b26be27a53d",
    };
    const sneakers = await pg
      .table("sneakers")
      .insert(sneakerObj)
      .then(async function () {
        console.log("✅", "Created new sneaker");
        return;
      })
      .catch((error) => {
        console.log("❌ ERROR: ", error.message);
      });
  },
  brandSeeders: async () => {
    const brandArrayObj = [{
        uuid: Helpers.generateUUID(),
        brand_name: "snipes",
        brand_reviews: "8.7",
        brand_logo: "https://www.snipes.nl/on/demandware.static/Sites-snse-NL-BE-Site/-/default/dwcc537b29/images/snipes_logo.svg",
        brand_url: "https://www.snipes.com/",
      },
      {
        uuid: Helpers.generateUUID(),
        brand_name: "sneakerdistrict",
        brand_reviews: "8.7",
        brand_logo: "https://www.sneakerdistrict.fr/assets/img/sneaker-district-weblogo@2x.png",
        brand_url: "https://www.sneakerdistrict.nl/",
      },
      {
        uuid: "6fed38e0-4d1d-11eb-9764-7b26be27a53d",
        brand_name: "torfs",
        brand_reviews: "8.7",
        brand_logo: "https://www.torfs.be/on/demandware.static/Sites-Torfs-Webshop-BE-Site/-/default/dw1f8272ff/images/logo_standard.svg",
        brand_url: "https://www.torfs.be/",
      },
    ];
    for (const brandObj of brandArrayObj) {
      const brands = await pg
        .table("brands")
        .insert(brandObj)
        .then(async function () {
          console.log("✅", "Created new brand");
        })
        .catch((error) => {
          console.log("❌ ERROR: ", error.message);
        });
    }
  },

  /*--------- CRUD  --------*/
  // Brand
  addBrand: async (brandObj) => {
    let result;
    let checkBrandObj = Helpers.checkBrandObj(brandObj)
    if (!checkBrandObj) {
      return false;
    }
    const brand = await pg
      .table("brands")
      .insert(brandObj)
      .then(function () {
        result = true;
      })
      .catch((error) => {
        result = false;
      });
    return result;
  },
  getBrandByName: async (brandName) => {
    let brand = await pg
      .from("brands")
      .where({
        brand_name: brandName
      });
    return brand;
  },
  getBrandById: async (brandId) => {
    try {
      const brand = await pg.select().from("brands").where({
        uuid: brandId
      });
      return brand;
    } catch (error) {
      console.log("❌ ERROR: ", error);
    }
  },
  updateBrandById: async (brandObj) => {
    try {
      let checkBrandObj = Helpers.checkBrandObj(brandObj)
      if (!checkBrandObj) {
        return false
      }
      const brand = await pg
        .table("brands")
        .where({
          uuid: brandObj.uuid
        })
        .update(brandObj);
      return true;
    } catch (error) {
      console.log("❌ ERROR: ", error.message);
    }
  },
  deleteBrandById: async (brandId) => {
    try {
      let checkBrandUuid = Helpers.checkIfUuid(brandId)
      if (!checkBrandUuid) {
        return false
      }
      const brand = await pg.table("brands").where({
        uuid: brandId
      }).del();
      return true;
    } catch (error) {
      console.log("❌ ERROR: ", error.message);
    }
  },
 
  // Sneakers
  addSneakers: async (sneakersArray) => {
    const sneakers = await pg
      .table("sneakers")
      .insert(sneakersArray)
      .then(function () {
        console.log(
          "✅",
          `Succesfully Created ${sneakersArray.length} sneakers`
        );
        return;
      })
      .catch((error) => {
        console.log("❌ ERROR: ", error.message);
      });
  },
  addSneaker: async (sneakerObj) => {
    let checkSneakerObj = Helpers.checkSneakerObj(sneakerObj)
    if (!checkSneakerObj) {
      return false
    }

    const sneakers = await pg
      .table("sneakers")
      .insert(sneakerObj)
      .then(function () {
        return true;
      })
      .catch((error) => {
        console.log("❌ ERROR: ", error);
      });
    return true;
  },
  getSneakersByBrand: async (brandName, sort) => {
    try {
      const sneakers = await pg
        .select([
          "brands.brand_name",
          "brands.brand_logo",
          "brands.brand_url",
          "brands.brand_reviews",
          "sneakers.product_brand",
          "product_name",
          "product_price",
          "product_sale_price",
          "product_sale",
          "product_description",
          "product_image",
          "product_available",
          "product_url",
          "product_shipping_info",
        ])
        .from("brands")
        .rightJoin("sneakers", "sneakers.brand_uuid", "brands.uuid")
        .where({
          brand_name: brandName.toLocaleLowerCase()
        })
        .orderBy("product_name", `${sort}`);
      return sneakers;
    } catch (error) {
      console.log("❌ ERROR: ", error.message);
    }
  },
  deleteSneaker: async (sneakerUuid) => {
    let checkSneakerUuid = Helpers.checkIfUuid(sneakerUuid)
    if (!checkSneakerUuid) {
      return false
    }
    const sneakers = await pg
      .table("sneakers")
      .where({
        uuid: sneakerUuid
      })
      .del()
      .then(async function () {
        console.log("✅", "Sneaker has been deleted");
        return true;
      })
      .catch((error) => {
        console.log("❌ ERROR: ", error.message);
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
      .catch((error) => {
        console.log("❌ ERROR: ", error.message);
      });
  },
};
module.exports = database;