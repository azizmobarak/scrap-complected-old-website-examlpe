'use strict';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

puppeteer.use(puppeteer_agent());


puppeteer.use(puppeteer_stealth());


const Scrap = () =>{
    (async()=>{
       var browser =await puppeteer.launch({
        headless: false,
        args: [
            '--enable-features=NetworkService',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--shm-size=3gb',
        ],
       });


       var page = await browser.newPage(); 

       await page.goto('http://preprod-casa-geored.geored.fr/desktop/index.php/documentation/index/')
//Login

await page.click('form input[name="data[Utilisateur][Login]"]');

await page.type('form input[name="data[Utilisateur][Login]"]', "user", { delay: 100 });

await page.type('form input[name="data[Utilisateur][Client_Nom]"]', "casabaia", { delay: 100 });

await page.type('form input[name="data[Utilisateur][PassMD5]"]', "CASA@arma2020", { delay: 100 });


await page.click('button');


await page.goto('http://preprod-casa-geored.geored.fr/desktop/index.php/documentation/index/',{ waitUntil: 'networkidle0' })




await page.evaluate(async()=>{

   var href = document.querySelectorAll('.nestedTopics div>a')

   console.log(document.body)

   })



    })();
}




module.exports =  {Scrap};