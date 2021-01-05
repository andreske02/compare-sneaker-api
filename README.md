# COMPARING SNEAKER API


<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/1024px-Unofficial_JavaScript_logo_2.svg.png" alt="drawing" width="30" />
<img src="https://scand.com/wp-content/uploads/2019/10/logo-node.png" alt="drawing" width="50" style="margin"/>

A sneaker API to get the best prices, services from a sneaker webshop.

## Requirements

You can use this api to compare sneaker prices on different webshops.

Use the package manager [yarn](https://yarnpkg.com/) to install all the requirements.
-   Packages
    - [Puppeteer](https://www.npmjs.com/package/puppeteer)
    - [Express](https://www.npmjs.com/package/express)
    - [Cron](https://www.npmjs.com/package/cron)
    - [Cheerio](https://www.npmjs.com/package/cheerio)
    - [supertest](https://www.npmjs.com/package/supertest)
    - [request](https://www.npmjs.com/package/request)
    - [body-parser](https://www.npmjs.com/package/body-parser)
-   Testing
    - [Jest](https://www.npmjs.com/package/jest)

## Install packages
Open terminal on api and run
```bash
npm install
```
## Build containers
Open terminal on root of the document
```bash
docker compose up
```
## Open api
Open terminal on api and run
```bash
npm start
```
## Test api
Open terminal on api and run
```bash
npm test 
```

## GET Endpoints
http://localhost:3000/seeds to run the seeders <br>
http://localhost:3000/show to show all the sneakers <br>
http://localhost:3000/torfs to start scraping torfs website. <br>
http://localhost:3000/brand/:brandname to show the brand by name<br>
http://localhost:3000/brandbyid/:uuid to show the brand by uuid<br>
http://localhost:3000/sneakers/:brand/:sort*?/ to show the sneaker by brand and sort it by name <br>




## POST Endpoints
http://localhost:3000/brand to create a brand. <br>

## PUT Endpoints
http://localhost:3000/updatebrand to update a brand. <br>

## DELETE Endpoints
http://localhost:3000/brand/:uuid to delete a brand. <br>

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](/LICENSE)

