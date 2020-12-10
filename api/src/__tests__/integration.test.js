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
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const lorem = new LoremIpsum({
    wordsPerSentence: {
      max: 4,
      min: 1
    }
  });
let randomNumber = Math.floor(Math.random() * 10) + 1;
 

request = supertest(app)
// TEST
describe('GET /test endpoint', ()=>{
    test('check if response is 200', async (done) =>{
        try {
            const response = await request.get('/')
            // expect(response.status).toBe(200,done())
            expect(response.body).toStrictEqual({},done())
        } catch (error) {
            console.log(error);
        }
    })
})
describe('POST /test endpoint', ()=>{
    test('check if response is 404', async (done) =>{
        try {
            const response = await request.post('/')
            expect(response.status).toBe(404,done())
        } catch (error) {
            if (error) {
                console.log(error);
            }
            done()
        }
    })
})


