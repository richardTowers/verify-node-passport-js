const express = require('express')
const { samlMiddleware, strategy } = require('./middleware/saml')
const passport = require('passport')
const bodyParser = require('body-parser')

express()
  .use(bodyParser.urlencoded({extended: true}))
  .get('/', (req, res) => { res.send('Hello World!') })
  .get('/secure', samlMiddleware(), (req, res) => res.send('Super secure!'))
  .post(
    '/saml/consume',
    passport.authenticate('saml', { failureRedirect: '/nooo', failureFlash: true }),
    (req, res) => {
      console.log('callback invoked')
      res.redirect('/banana')
    })
  .listen(3000, () => console.log('Listening on port 3000'))
