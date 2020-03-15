
  import express from 'express'
  var ws = require('./ws')

  var app = express()
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, function () {
    console.log('Example app listening on port '+ PORT)
  })



