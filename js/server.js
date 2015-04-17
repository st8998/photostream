require("babel/register")

var express = require('express')
var picsPipeline = require('./pics_pipeline')
var picsEndpoint = require('./pics_endpoint')


var app = express()

app.use('/pics/pipeline', picsPipeline)
app.use('/pics', picsEndpoint)

app.use('/', express.static('dest'))

app.listen(4000)