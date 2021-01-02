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
const request = supertest(app)
let randomNumber = Math.floor(Math.random() * 10) + 1;
 

// Create 
describe('create a brand', ()=>{
    test('check if brand is created succesfully', async (done) =>{
        try {
            const response = await request.post('/')
            expect(response.status).toBe(200)
            done()
        } catch (error) {
            if (error) {
                console.log(error);
            }
        }
    })
}) 


