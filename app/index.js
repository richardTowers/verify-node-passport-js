const express = require('express')
const samlMiddleware = require('./middleware/saml')

express()
  .get('/', (req, res) => { res.send('Hello World!') })
  .get('/secure', samlMiddleware(), (req, res) => res.send('Super secure!'))
  .listen(3000, () => console.log('Listening on port 3000'))
