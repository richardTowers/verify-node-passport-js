const express      = require('express')
const passport     = require('passport')
const { Strategy } = require('passport-saml')

const samlConfig = {
  path: '/some-path',
  entryPoint: '/some-entry-point',
  issuer: 'some-entity-id',
  authnRequestBinding: 'HTTP-POST'
}

passport.use(
  new Strategy(
    samlConfig,
    (profile, done) => { console.log(profile); done() }
  )
)
const samlMiddleware = passport.authenticate(
  'saml',
  { failureRedirect: '/', failureFlash: true}
)

express()
  .get('/', (req, res) => { res.send('Hello World!') })
  .get('/secure', samlMiddleware,  (req, res) => res.send('Super secure!'))
  .listen(3000, () => console.log('Listening on port 3000'))
