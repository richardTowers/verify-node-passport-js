const passport = require('passport')
const { Strategy } = require('passport-saml')

function samlMiddleware (path = '/some-path', entryPoint = '/some-entry-point', issuer = 'some-entity-id') {
  const config = { path, entryPoint, issuer, authnRequestBinding: 'HTTP-POST' }
  return passport
    .use(new Strategy(config, (profile, done) => console.log(profile) && done()))
    .authenticate('saml', { failureRedirect: '/', failureFlash: true })
}
module.exports = samlMiddleware
