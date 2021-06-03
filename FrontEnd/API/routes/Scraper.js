var express = require('express');
var router = express.Router();
var cheerio = require("cheerio");
var axios = require('axios');
const fs = require('fs');
const fetch = require('node-fetch');
require('isomorphic-fetch');
var url = 
[   
    'https://livetraffic.eu/webcams/dars-baza_konjicedevina_lj/',
    // 'https://livetraffic.eu/webcams/dars-baza_konjicedevina_mb/',
    // 'https://livetraffic.eu/webcams/dars-baza_konjicedramlje_sd/',
    // 'https://livetraffic.eu/webcams/dars-baza_konjicefram/',
    // 'https://livetraffic.eu/webcams/dars-baza_konjicegramoznica_lj/',
    // 'https://livetraffic.eu/webcams/dars-baza_konjicegramoznica_mb/',
    // 'https://livetraffic.eu/webcams/dars-baza_konjicesl_bistrica_sd/',
];

function scrapeAll(){
    return scraper()
 }

async function scraper(){
    for (link in url) {
        const response = await fetch(url[link])
        const html = await response.text()
        const $ = await cheerio.load(html)

        //Extracts the traffic camera image
        const img = $("#webcam-live > img").attr("src");
        //Extracts the location of the camera
        const location = $('li:contains("Lat/Long:")').text();

        //Extract the latitude and longditude from the location string
        var latitude = location.substr(10, 8).replace(',', '0');
        var longditude = location.substr(20, 8);
        var locData = [];
        console.log('lat and long: ' + latitude + ' ' + longditude);

        //Send location data as json
        axios.post('http://localhost:3001/gps', {
            'latitude': latitude,
            'longditude': longditude,
            'altitude': 0,
            'speed': 0,
            'accuracy': 0
        })
        .then(res => {
            console.log(res.data)
            locData = res.data;
        })
        .catch(error => {
            console.error(error)
        });

        //path where the image will be stored locally
        var savepath = 'images/' + Date.now() + '.jpg';

        //Fetch image file from url and save it to local directory
        const fetchResponse = await fetch(img);
        const buffer = await fetchResponse.buffer();
        fs.writeFile('public/'+savepath, buffer, () => {
            console.log('finished downloading! ' + 'public/'+savepath);
        })

        //Send the image path to mongoDB
        axios.post('http://localhost:3001/camera/cam', {
            'filepath': savepath,
            'location_id': locData._id
        })
        .catch(error => {
            console.error(error)
        });
    }
    return "Pages were scraped";
}

router.get('/', function(req, res, next) {
    return res.json(scrapeAll());
});

module.exports = router;
