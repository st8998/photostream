require("babel/register")

var express = require('express')
var logger = require('morgan')

var picsPipeline = require('./pics_pipeline')

var app = express()

app.use(logger('dev'))
app.use('/pics/pipeline', picsPipeline)

app.listen(4001)