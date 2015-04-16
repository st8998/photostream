require("babel/register")

var express = require('express')
var imagesPipeline = require('./images_pipeline')


var app = express()

app.use('/-/images', imagesPipeline)

app.listen(4000)