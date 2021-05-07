const express = require('express');
const app = express();
const PORT = 3333;
const {Scrap} = require('./scrap');


Scrap();


app.listen(PORT)