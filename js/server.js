require("babel/register")

var fs = require('fs')

var express = require('express')
var logger = require('morgan')

var ms = require('ms')

var picsPipeline = require('./pics_pipeline')
var picsEndpoint = require('./pics_endpoint')

var config = require('./config')

var app = express()

app.use(logger('dev'))

if (!config.picsPipeline.separate)
  app.use('/pics/pipeline', picsPipeline)

app.use('/pics', picsEndpoint)

app.use('/', express.static('dest/public', {maxAge: ms('1 year')}))

app.use('/', function(req, res) {
  res.type('html')
  fs.createReadStream('./dest/app.html').pipe(res)
})

app.listen(4000)