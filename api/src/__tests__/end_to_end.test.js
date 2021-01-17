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
const request = supertest(app)

describe('POST /test endpoint', ()=>{
   let uuid = '1fed38e0-4d1d-11eb-9764-7b26be27a535';
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
            expect(response.status).toBe(400)
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
            const response = await request.get(`/brandbyid/6fed38e0-4d1d-11eb-9764-7b26be27a53F`)
            expect(response.status).toBe(400)
            done()
        } catch (error) {
            console.log("❌ ERROR: ", error);
        }
    }),
    test('check if brand is deleted', async (done) =>{
        try {
            const response = await request.delete(`/brand/${uuid}`)
            expect(response.status).toBe(204)
            done()
        } catch (error) {
            console.log("❌ ERROR: ", error);
        }
    }),
    test('check if brand does not exist anymore', async (done) =>{
        try {
            const response = await request.get(`/brandbyid/${uuid}`)
            expect(response.status).toBe(400)
            done()
        } catch (error) {
            console.log("❌ ERROR: ", error);
        }
    })
})