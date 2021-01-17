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
const app = require('../../server.js')
const Helpers = require('api/src/utils/helpers.js');
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const lorem = new LoremIpsum({
    wordsPerSentence: {
      max: 4,
      min: 1
    }
  });
const request = supertest(app)
let randomNumber = Math.floor(Math.random() * 10) + 1;
 

// CRUD BRANDS
describe('All tests for brands', ()=>{
    let uuid = '1fed38e0-4d1d-11eb-9764-7b26be27a53d';
    let brandObj = {
        "uuid": uuid,
        "brand_name": "adidas",
        "brand_reviews": "9.7",
        "brand_logo": "https://www.adidas.be/glass/react/755aab5/assets/img/icon-adidas-logo.svg",
        "brand_url": "https://www.adidas.com/"
        }
    test('check if brand is created succesfully', async (done) =>{
        try {
            const response = await request.post('/brand').send(brandObj)
            expect(response.status).toBe(201)
            done()
        } catch (error) {
            console.log("❌ ERROR: ", error);
        }
    }),
    test('check if brand is not created beacause of duplicate uuid', async (done) =>{
        try {
            const response = await request.post('/brand').send(brandObj)
            expect(response.status).toBe(500)
            done()
        } catch (error) {
            console.log("❌ ERROR: ", error);
        }
    }),
    test('check if brand exist? Then show it', async (done) =>{
        try {
            const response = await request.get(`/brandbyid/${uuid}`)
            expect(response.status).toBe(200)
            done()
        } catch (error) {
            console.log("❌ ERROR: ", error);
        }
    }),
    test('check if brand don\'t exist', async (done) =>{
        try {
            const response = await request.get(`/brand/6fed38e0-4d1d-11eb-9764-7b26be27a53F`)
            expect(response.status).toBe(500)
            done()
        } catch (error) {
            console.log("❌ ERROR: ", error);
        }
    }),
    test('check if brand is deleted', async (done) =>{
        try {
            const response = await request.delete(`/brand/${uuid}`)
            expect(response.status).toBe(410)
            done()
        } catch (error) {
            console.log("❌ ERROR: ", error);
        }
    }),
    test('check if brand does not exist anymore', async (done) =>{
        try {
            const response = await request.get(`/brand/${uuid}`)
            expect(response.status).toBe(500)
            done()
        } catch (error) {
            console.log("❌ ERROR: ", error);
        }
    }),












    
    test('test add brand', async (done) => {
        try {
          brandObj.uuid =  Helpers.generateUUID();
            const response = await  Database.addBrand(brandObj);
            expect(response).toBe(true)
            done()
        } catch (error) {
            console.log("❌ ERROR: ", error);
        }
      })
}) 


