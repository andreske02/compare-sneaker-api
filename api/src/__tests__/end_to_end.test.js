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
const Helpers = require('api/src/utils/helpers.js');
const app = require('../server.js')
const request = supertest(app)
let uuid = Helpers.generateUUID();
/**
 * ====== FLOW ======
 * create brand
 * try to create same brand 
 * show the created brand
 * create sneaker with brand relation
 * create other sneaker with brand relation
 * show the sneaker with the created brand
 * update the brand
 * delete de brand
 * try to get the sneaker => has to be deleted
 * check if brand is deleted
 */

let brandObj = {
    "uuid": uuid,
    "brand_name": "adidas",
    "brand_reviews": "9.7",
    "brand_logo": "https://www.adidas.be/glass/react/755aab5/assets/img/icon-adidas-logo.svg",
    "brand_url": "https://www.adidas.com/"
};
let sneakerObj = {
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
    brand_uuid: uuid
};
let sneakerObj1 = {
    uuid: Helpers.generateUUID(),
    product_brand: "Nike 2",
    product_name: "Air Force 2 '07",
    product_price: "€ 122,00",
    product_sale_price: "€ 99,00",
    product_sale: true,
    product_description: "Nike Air Force 2 '07",
    product_image: "https://www.snipes.be/dw/image/v2/BDCB_PRD/on/demandware.static/-/Sites-snse-master-eu/default/dwd508e7bc/1761737_P.jpg?sw=300&sh=300&sm=fit&sfrm=png",
    product_available: JSON.stringify([
        "34.5",
        "37.5",
        "38.5",
        "42.5",
        "40.5",
        "41.5",
    ]),
    product_colors: JSON.stringify(["White", "Black", "Green"]),
    product_url: "https://www.snipes.be/nl/p/nike-air_force_1_shadow-white%2Fwhite%2Fwhite-00013801761737.html",
    product_shipping_info: "5.7",
    brand_uuid: uuid
};

describe('Flow of brands and sneakers', () => {
    test('create a brand', async (done) => {
            try {
                const response = await request.post('/brand').send(brandObj)
                expect(response.status).toBe(201)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        }),
        test('check if brand is not created beacause of duplicate uuid', async (done) => {
            try {
                const response = await request.post('/brand').send(brandObj)
                expect(response.status).toBe(400)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        }),
        test('get the created brand?', async (done) => {
            try {
                const response = await request.get(`/brandbyid/${uuid}`)
                expect(response.status).toBe(200)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        }),
        test('create a sneaker', async (done) => { 
            try {
                const response = await request.post('/sneaker').send(sneakerObj)
                expect(response.status).toBe(201)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        }),
        test('create another sneaker', async (done) => { 
            try {
                const response = await request.post('/sneaker').send(sneakerObj1)
                expect(response.status).toBe(201)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        }),

        test('show sneakers by brand', async (done) => { 
            try {
                const response = await request.get(`/sneakers/${brandObj.brand_name}`);
                expect(response.status).toBe(200)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        }),
        test('update the brand', async (done) => {
            try {
                brandObj.brand_name = "bol";
                const response = await request.put(`/updatebrand`).send(brandObj)
                expect(response.status).toBe(204)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        }),
        test('delete the brand', async (done) => {
            try {
                const response = await request.delete(`/brand/${uuid}`)
                expect(response.status).toBe(204)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        }),
        test('check if sneakers are deleted', async (done) => {
            try {
                const response = await request.get(`/sneakers/${brandObj.brand_name}`)
                expect(response.status).toBe(400)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        }),
        test('check if brand does not exist anymore', async (done) => {
            try {
                const response = await request.get(`/brandbyid/${uuid}`)
                expect(response.status).toBe(400)
                done()
            } catch (error) {
                console.log("❌ ERROR: ", error);
            }
        })
})