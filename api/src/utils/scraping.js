const puppeteer = require("puppeteer");
const $ = require("cheerio");
const CronJob = require("cron").CronJob;
const request = require("request");
const randomUseragent = require('random-useragent');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const Helpers = require("./helpers.js");
const database = require("./database.js");
let productArray = [];
let browser;
const hosturl = "http://localhost:3001";
let shops = [
    "Snipes",
    "Adidas",
    "Zalando",
    "Nike",
    "Sneakerdistrict ",
    "Torfs",
    "SneakerBaron",
    "Asos",
    "Ultimate Sneakerstore",
];

const scraping = {
    /*======= Torfs =======*/
    torfs: async (url, res, amountOfProducts) => {
        productArray = [];
        const base_url = "https://www.torfs.be";
        let countProductNotFound = 0;
        let brand_uuid;
        // Get brand uuid to connect tables
        try {
            let brand = await database.getBrandByName('torfs');
            console.log("✅", `${brand[0].brand_name.toUpperCase()} uuid is ${brand[0].uuid}`);
            brand_uuid = brand[0].uuid;
        } catch (error) {
            console.log("❌ ERROR: ", error.message);
        }

        // Start scraping 
        try {
            page = await scraping.configureBrowser(url);
            let html = await page.evaluate(() => document.body.innerHTML);
            console.log("Start scraping");
            let waitForProducts = new Promise((resolve, reject) => {
                $(".product-tile", html).each(async function (counter, value) {
                    let product_url = $(this).find(".js-product-tile-link").attr("href");
                    if (product_url == undefined) {
                        countProductNotFound = countProductNotFound + 1;
                    } else {
                        // GO TO DETAIL
                        detailpage = await scraping.openPage(base_url + product_url);
                        const detail = await detailpage.evaluate(
                            () => document.body.innerHTML
                        );
                        const content = $(".product-detail", detail);
                        let product_brand = content
                            .find(".js-productAttributes .brand-name")
                            .text();
                        let product_name = content
                            .find(".js-productAttributes .product-name")
                            .text();
                        let product_price =
                            content.find(".price span.value").first().text() !== "" ?
                            content.find(".price span.value").first().text() :
                            content.find(".product-variants .price__list .value").text();
                        product_price = product_price.replace(/(\r\n|\n|\r)/gm, "").trim();

                        let product_sale_price = content
                            .find(".product-variants .discounted .value")
                            .text()
                            .replace(/(\r\n|\n|\r)/gm, "")
                            .trim();
                        let product_sale = product_sale_price ? true : false;
                        let product_description = content
                            .find(".attribute-siteDescription")
                            .text()
                            .trim();
                        let product_available = [];
                        let product_colors = [];
                        let product_shipping_info =
                            "Voor 22u besteld, volgende werkdag geleverd.";
                        content
                            .find(".size-blocks .size-block")
                            .each(async function (index, value) {
                                product_available.push(
                                    $(this)
                                    .find("a")
                                    .text()
                                    .replace(/(\r\n|\n|\r)/gm, "")
                                    .trim()
                                );
                            });
                        let imageElem = content.find("img.carousel-image.img-fluid.w-100");
                        let product_image = imageElem.prop("data-src") ?
                            imageElem.prop("data-src") :
                            imageElem.prop("src");
                        product_available = [...new Set(product_available)];

                        // Waitforobject
                        let waitForObject = new Promise((resolve, reject) => {
                            const sneakerObj = {
                                uuid: Helpers.generateUUID(),
                                product_brand: product_brand,
                                product_name: product_name,
                                product_price: product_price,
                                product_sale_price: product_sale_price,
                                product_sale: product_sale,
                                product_description: product_description,
                                product_image: product_image,
                                product_available: JSON.stringify(product_available),
                                product_colors: JSON.stringify(product_colors),
                                product_url: base_url + product_url,
                                product_shipping_info: product_shipping_info,
                                brand_uuid: brand_uuid,
                            };
                            resolve(sneakerObj);
                            console.log("✅", "Created new sneaker");
                        });
                        // Completed object
                        waitForObject
                            .then((value) => {
                                productArray.push(value);
                                if (
                                    $(".product-tile", html).length - countProductNotFound ===
                                    productArray.length
                                )
                                    resolve();
                            })
                            .catch((error) => {
                                console.log("❌ ERROR: ", error.message);
                            });
                    }
                });
            });

            waitForProducts
                .then(async () => {
                    database.addSneakers(productArray).then(async () => {
                        let endpage;
                        let currentpage;
                        $(".bs-link", html).each(async function (counter, value) {
                            endpage = $(this).prop("data-page");
                        });
                        currentpage = $(".bs-current", html).prop("data-page");
                        if (currentpage !== endpage) {
                            let nextpage = await $(".bs-current", html).next().prop("data-page");
                            page
                                .close()
                                .then(() => {
                                    console.log("closed page");
                                    browser.close().then(() => {
                                        console.log("gotonextpage");
                                        request.post(`${hosturl}/torfs`, {
                                            form: {
                                                counter: nextpage,
                                                amount: amountOfProducts
                                            },
                                        });
                                        res.json(productArray);
                                    });
                                })
                                .catch((error) => {
                                    console.log("❌ ERROR: ", error.message);
                                });
                        } else {
                            page.close();
                            browser.close().then(() => {
                                console.log("closed browser");
                                res.json(productArray);
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.log("❌ ERROR: ", error.message);
                });
        } catch (error) {
            console.log("❌ ERROR: ", error.message);
        }
    },
    /*======= SETUP =======*/
    configureBrowser: async (url) => {
        try {
            puppeteerExtra.use(pluginStealth());
            browser = await puppeteerExtra.launch({
                headless: true,
                slowMo: 50,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });
            return scraping.openPage(url);
        } catch (error) {
            console.log("❌ ERROR: ", error.message);
        }
    },
    openPage: async (url) => {
        const page = await browser.newPage();
        await page.setUserAgent(randomUseragent.getRandom());
        await page.setViewport({
            width: 1366,
            height: 768
        });
        await page.goto(url, {
            waitUntil: "networkidle0",
            timeout: 0
        });
        return page;
    }
}
module.exports = scraping;