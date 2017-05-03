const express = require('express')
const { samlMiddleware } = require('./middleware/saml')
const passport = require('passport')
const bodyParser = require('body-parser')

passport.serializeUser = (user, message, done) => {
  done(null, user)
}
passport.deserializeUser = (id, done) => {
  done(null, id)
}
express()
  .use(bodyParser.urlencoded({extended: true}))
  .use(passport.initialize())
  .get('/', (req, res) => { res.send('Hello World!') })
  .get('/secure', samlMiddleware(), (req, res) => res.send('Super secure!'))
  .post(
    '/saml/consume',
    passport.authenticate('saml', { failureRedirect: '/nooo', failureFlash: true }),
    (req, res) => {
      console.log('callback invoked')
      res.write('Hello')
      res.end()
    })
  .listen(3000, () => console.log('Listening on port 3000'))
