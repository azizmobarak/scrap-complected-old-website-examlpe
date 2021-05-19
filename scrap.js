'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch')
var request = require('request');

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



await clickpage(page,'.nestedThemeLnk ',0);

await setTimeout(async() => {
    try{
        await clickpage(page,'.nestedTopicLnk ',14);
       setTimeout(async() => {
          try{
            await clickpage(page,'.nestedTopicLnk ',2);
            setTimeout(async() => {
              try{
                await clickpage(page,'.nestedTopicLnk ',0);
                setTimeout(async() => {
                  try{
                    await clickpage(page,'.nestedTopicLnk ',0);
                    setTimeout(async() => {
                     await download(page);
                   },7000);
                  }catch{
                    setTimeout(async() => {
                     await download(page);
                   },7000);
                  }
               },7000);
              }catch{
                setTimeout(async() => {
                 await download(page);
               },7000);
              }
           },7000);
          }catch{
            setTimeout(async() => {
             await download(page);
           },7000);
          }
       },10000);
    }catch{
        setTimeout(async() => {
            await download(page);
           },10000);
    }
},5000);

    })();
}



const clickpage=async(page,htmlclass,number)=>{
  await page.evaluate((htmlclass,number)=>{
      var href = document.querySelector('iframe').contentDocument.querySelectorAll(htmlclass)[number]

      href.click();
     

  },htmlclass,number);
}




const download=async(page)=>{
    var date = new Date();
    
          var result = await page.evaluate(()=>{
            return  document.querySelector('iframe').contentDocument.querySelector("body").innerText;
          })

          
          var name = await page.evaluate(()=>{
            return  document.querySelector('iframe').contentDocument.querySelector("h1").textContent.trim().replaceAll(' ','-').replaceAll('é','e').replaceAll('?','').replaceAll('/','');
          })

          var cookie  = await page.evaluate(()=>{
            return document.cookie;
          })

          var folder = name;

        console.log(folder);
          var rand = date.getTime().toString();

       await fs.mkdirSync("./files/"+folder, {
            recursive: true
        });

        await page.screenshot({path: "./files/"+folder+'/'+folder+"1.png"});



        var images  = await page.evaluate(()=>{
            var data = [];
            var img =  document.querySelector('iframe').contentDocument.querySelectorAll("img");
            for(let i=0;i<img.length;i++){
                data.push(img[i].src)
            }

            return data;
        })

        console.log(images);

        for (let img=0;img<images.length;img++){

          await setTimeout(async() => {
            //    var base = "http://preprod-casa-geored.geored.fr";
            // var url = new URL(images[img],base)
            const encodedURI = encodeURI(images[img]);
            const response =await fetch(encodedURI,{headers: {"Cookie" : cookie}})
            const buffer = await response.buffer();

            var extenstion = ".png";
            if(images[img].indexOf('.jpg')!=-1) extenstion = ".jpg"
            if(images[img].indexOf('.jpeg')!=-1) extenstion = ".jpeg"

             await fs.writeFileSync("./files/"+folder+"/"+date.getTime()+parseInt(Math.random()*22)+"-num-"+img+extenstion,buffer,(err,data)=>{
              if(err) console.log(err)
              else{
                console.log('success',data)
              }
             })
           },5000*img);
        }

    
          fs.writeFile("./files/"+folder+"/"+date.getTime()+'.docx', result, err => {
            if (err) {
              console.error(err)
              return;
            }});
}


var downloadImg = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
  
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };


module.exports =  {Scrap};