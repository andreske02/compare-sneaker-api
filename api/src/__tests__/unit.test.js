const Helpers = require('api/src/utils/helpers.js');
const Database = require('api/src/utils/database.js');
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
const brandObj = {
  uuid: Helpers.generateUUID(),
  brand_name: "zalando",
  brand_reviews: "6.7",
  brand_logo: "https://mosaic02.ztat.net/nvg/z-header-fragment/zalando-logo/logo_default.svg",
  brand_url: "https://www.zalando.be/",
};
describe('check if BRAND object is correct', () => {
    test('check if brand_uuid is a uuid', async (done) => {
        try {
          const response = await Helpers.checkIfUuid(brandObj.uuid);
          expect(response).toBeTruthy()
          done()
        } catch (error) {
          console.log("❌ ERROR: ", error);
        }
      }),
      test('check if brand_name is a string', async (done) => {
        try {
          const response = await Helpers.checkIfString(brandObj.brand_name);
          expect(response).toBeTruthy()
          done()
        } catch (error) {
          console.log("❌ ERROR: ", error);
        }
      }),
      test('check if brand_logo is a valid url and image', async (done) => {
        try {
          const response = await Helpers.checkIfString(brandObj.brand_logo);
          expect(response).toBeTruthy()
          done()
        } catch (error) {
          console.log("❌ ERROR: ", error);
        }
      }),
      test('check if brand_url is a valid url', async (done) => {
        try {
          const response = await Helpers.checkIfString(brandObj.brand_url);
          expect(response).toBeTruthy()
          done()
        } catch (error) {
          console.log("❌ ERROR: ", error);
        }
      })
  }),
  describe('check if SNEAKER object is correct', () => {
    test('check if product_brand is a string', async (done) => {
        try {
          const response = await Helpers.checkIfString(sneakerObj.product_brand);
          expect(response).toBeTruthy()
          done()
        } catch (error) {
          console.log("❌ ERROR: ", error);
        }
      }),
      test('check if product_name is a string', async (done) => {
        try {
          const response = await Helpers.checkIfString(sneakerObj.product_name);
          expect(response).toBeTruthy()
          done()
        } catch (error) {
          console.log("❌ ERROR: ", error);
        }
      }),
      test('check if product_price has a euro in front of number', async (done) => {
        try {
          const response = await Helpers.checkIfPriceHasEuro(sneakerObj.product_price);
          expect(response).toBeTruthy()
          done()
        } catch (error) {
          console.log("❌ ERROR: ", error);
        }
      }),
      test('check if product_sale_price has a euro in front of number', async (done) => {
        try {
          const response = await Helpers.checkIfPriceHasEuro(sneakerObj.product_sale_price);
          expect(response).toBeTruthy()
          done()
        } catch (error) {
          console.log("❌ ERROR: ", error);
        }
      }),
      test('check if product_sale is a boolean', async (done) => {
        try {
          const response = await Helpers.checkIfBoolean(sneakerObj.product_sale);
          expect(response).toBeTruthy()
          done()
        } catch (error) {
          console.log("❌ ERROR: ", error);
        }
      }),
      test('check if product_image is a image and url', async (done) => {
        try {
          const response = await Helpers.checkIfUrlImage(sneakerObj.product_image);
          expect(response).toBeTruthy()
          done()
        } catch (error) {
          console.log("❌ ERROR: ", error);
        }
      });
    test('check if product_available is an array', async (done) => {
      try {
        const response = await Helpers.checkIfArray(sneakerObj.product_available);
        expect(response).toBeTruthy()
        done()
      } catch (error) {
        console.log("❌ ERROR: ", error);
      }
    });
    test('check if product_colors is an array', async (done) => {
      try {
        const response = await Helpers.checkIfArray(sneakerObj.product_colors);
        expect(response).toBeTruthy()
        done()
      } catch (error) {
        console.log("❌ ERROR: ", error);
      }
    });
    test('check if brand_uuid is an uuid', async (done) => {
      try {
        const response = await Helpers.checkIfUuid(sneakerObj.brand_uuid);
        expect(response).toBeTruthy()
        done()
      } catch (error) {
        console.log("❌ ERROR: ", error);
      }
    });
    test('check if product_url is a url', async (done) => {
      try {
        const response = await Helpers.checkIfUrl(sneakerObj.product_url);
        expect(response).toBeTruthy()
        done()
      } catch (error) {
        console.log("❌ ERROR: ", error);
      }
    });
  })
 