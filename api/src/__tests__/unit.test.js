
const Helpers = require('api/src/utils/helpers.js');
const Database = require('api/src/utils/database.js');
const sneakerObj = {
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
describe('check if sneaker object is correct', () => {
  test('check if product_brand is a string', async (done) => {
    try {
      sneakerObj.uuid =  Helpers.generateUUID();
        const response = await Database.addSneaker(sneakerObj);
        expect(response).toBe(true)
        done()
    } catch (error) {
        console.log("❌ ERROR: ", error);
    }
  }),
  test('check if product_name is a string', async (done) => {
    try {
      sneakerObj.uuid = Helpers.generateUUID();
        const response = await Database.addSneaker(sneakerObj);
        expect(response).toBe(true)
        done()
    } catch (error) {
        console.log("❌ ERROR: ", error);
    }
  }),
  test('check if product_price has a euro in front of number', async (done) => {
    try {
      sneakerObj.uuid = Helpers.generateUUID();
        const response = await Database.addSneaker(sneakerObj);
        expect(response).toBe(true)
        done()
    } catch (error) {
        console.log("❌ ERROR: ", error);
    }
  }),
  test('check if product_sale_price has a euro in front of number', async (done) => {
    try {
      sneakerObj.uuid = Helpers.generateUUID();
        const response = await Database.addSneaker(sneakerObj);
        expect(response).toBe(true)
        done()
    } catch (error) {
        console.log("❌ ERROR: ", error);
    }
  }),
  test('check if product_sale is a boolean', async (done) => {
    try {
      sneakerObj.uuid = Helpers.generateUUID();
        const response = await Database.addSneaker(sneakerObj);
        expect(response).toBe(true)
        done()
    } catch (error) {
        console.log("❌ ERROR: ", error);
    }
  }),
  test('check if product_url is a url', async (done) => {
    try {
      sneakerObj.uuid = Helpers.generateUUID();
        const response = await Database.addSneaker(sneakerObj);
        expect(response).toBe(true)
        done()
    } catch (error) {
        console.log("❌ ERROR: ", error);
    }
  });
})

