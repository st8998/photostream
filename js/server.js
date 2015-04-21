require("babel/register")

var express = require('express')
var logger = require('morgan')

var ms = require('ms')

var picsPipeline = require('./pics_pipeline')
var picsEndpoint = require('./pics_endpoint')


var app = express()

app.use(logger('dev'))

app.use('/pics/pipeline', picsPipeline)
app.use('/pics', picsEndpoint)

app.use('/', express.static('dest', {maxAge: ms('1 year')}))

app.listen(4000)