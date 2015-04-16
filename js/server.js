require("babel/register")

var express = require('express')
var picsPipeline = require('./pics_pipeline')


var app = express()

app.use('/-/pics', picsPipeline)

app.listen(4000)