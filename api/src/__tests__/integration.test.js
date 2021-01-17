//===================================================================================================================================================================================================================================================================================================================
//                                                                                                                                                                                                                                                                                                                   
//    ###    ##     ##  ####    #####    #####   ####                                                                                                                                                                                                                                                              
//   ## ##   ####   ##  ##  ##  ##  ##   ##     ##                                                                                                                                                                                                                                                                 
//  ##   ##  ##  ## ##  ##  ##  #####    #####   ###                                                                                                                                                                                                                                                               
//  #######  ##    ###  ##  ##  ##  ##   ##        ##                                                                                                                                                                                                                                                              
//  ##   ##  ##     ##  ####    ##   ##  #####  ####                                                                                                                                                                                                                                                               
//                                                                                                                                                                                                                                                                                                                   
//===================================================================================================================================================================================================================================================================================================================

const supertest = require('supertest')
const app = require('../server.js')
const Helpers = require('api/src/utils/helpers.js');
const Database = require('api/src/utils/database.js');
const request = supertest(app)
const BrandObj = {
    uuid: Helpers.generateUUID(),
    brand_name: "zalando",
    brand_reviews: "6.7",
    brand_logo: "https://mosaic02.ztat.net/nvg/z-header-fragment/zalando-logo/logo_default.svg",
    brand_url: "https://www.zalando.be/",
};
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

// CRUD BRANDS
describe('All tests for brands', () => {
    test('ENDPOINT CREATE POST ➡ /brand return 400 if brand object is not correct ', async (done) => {
            BrandObj.brand_name = 4;
            try {
                BrandObj.uuid = Helpers.generateUUID();
                const response = await request.post(`/brand`).send(BrandObj)
                expect(response.status).toBe(400)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        }),
        test('ENDPOINT SHOW GET ➡ /brandbyid/:uuid return 400 if brand uuid is not an uuid', async (done) => {
            try {
                const response = await request.get(`/brandbyid/${BrandObj.uuid}`)
                expect(response.status).toBe(400)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        }),
        test('ENDPOINT SHOW GET ➡ /brandbyname/:name return 400 if brand name does not exist', async (done) => {
            try {
                const response = await request.get(`/brand/WRONGNAME`)
                expect(response.status).toBe(400)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        }),
        test('ENDPOINT UPDATE PUT ➡ /updatebrand/ return 400 if brand object is not correct', async (done) => {
            try {
                const response = await request.put(`/updatebrand/`).send(BrandObj)
                expect(response.status).toBe(400)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        }),
        test('ENDPOINT REMOVE DELETE ➡ /deleteBrandById/ return 400 if uuid is not an uuid', async (done) => {
            try {
                const response = await request.delete(`/brand/NOTANUUID`)
                expect(response.status).toBe(400)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        })
});



describe('All tests for sneakers', () => {
    test('ENDPOINT CREATE POST ➡ /sneakers return 400 if sneaker object is not correct ', async (done) => {
            sneakerObj.product_name = 5222;
            try {
                sneakerObj.uuid = Helpers.generateUUID();
                const response = await request.post(`/sneaker`).send(sneakerObj)
                expect(response.status).toBe(400)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        }),
        test('ENDPOINT SHOW GET ➡ /sneakers/:brand/:sort*?/ return 400 if brand don\'t exist', async (done) => {
            try {
                const response = await request.get(`/sneakers/BRANDDONTEXIST`);
                expect(response.status).toBe(400)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        }),
        test('ENDPOINT REMOVE DELETE ➡ /sneakers/:uuid/ return 400 if wrong type or wrong uuid', async (done) => {
            try {
                sneakerObj.uuid = 3443434;
                const response = await request.delete(`/sneaker/${sneakerObj.uuid}`);
                expect(response.status).toBe(400)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        })
});