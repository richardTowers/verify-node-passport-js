const passport = require('passport')
const { Strategy } = require('passport-saml')

function samlMiddleware () {
  const entryPoint = 'https://compliance-tool-reference.ida.digital.cabinet-office.gov.uk/SAML2/SSO'
  const issuer = 'https://verify-passport/service'
  const cert = `MIICujCCAaICCQCfIsTbKZvPjTANBgkqhkiG9w0BAQsFADAfMR0wGwYDVQQDFBR0
ZXN0X3ByaW1hcnlfc2lnbmluZzAeFw0xNzA0MjgxMDE5MDNaFw0xNzA1MjgxMDE5
MDNaMB8xHTAbBgNVBAMUFHRlc3RfcHJpbWFyeV9zaWduaW5nMIIBIjANBgkqhkiG
9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwJzklS49+k6RstAB86mJRykDMX8388WRIEbd
r1Yvqs8nbZkdgSCgvOskA2oeOnusOaryNijTQJToeW7P5VwJwb+93K8ie9HAAgvY
9AXl4in9OYlKH1dU1HqRyIsl2SIpBUW1UVNYcNxL2WvwRfvgAvRJo79eWO4cqXoh
VjF08JNkfN/xtQB9rg555c40nOAwztbjtuk5Jyuy9s3bEJZE1UFpbfTBqO851XZZ
gLa7u2cj7yfNYPSxELLnwUDk1NVO+dSUsmVPdY9ziw2DYlUFGiHl+QCBOuKArF67
PbiTGf7YvuS3fE6xRNgJzcR1gWHd9evr1CoQhFiSoqc60Xs/ywIDAQABMA0GCSqG
SIb3DQEBCwUAA4IBAQBd/IHFTxN8pxI1Cl+uGpKsPqw7g6/D9IeM9usIQejxnr02
FGkxw9l00zgSoQgAVUDjOUNtvEJ6EaWJT9YTYfx19lIi1wV1kb4hsEkscTWEl5co
P3mbpTEZvaQddbbXQIavcy8+X8VoWhjjqL4Ww0auqV4ksLwO+bpDKtL6x3Q+G2EB
s1cwva3ONfLxFxw/fSJ1etJITTL+PU+kzy/e0kuBrios5K/iVxYIbrw8lGhCRfPV
9q4RvlQGYugWeWUlpfBvBGOlSP892R8oTpcyDRktqxQP7IKt1J0lt8Kpz5SsMiRw
UvIqhgvD6NYFSaMuT0Yc5k5ej5BHDhTA1eRqAwD8`
  const privateCert = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAwJzklS49+k6RstAB86mJRykDMX8388WRIEbdr1Yvqs8nbZkd
gSCgvOskA2oeOnusOaryNijTQJToeW7P5VwJwb+93K8ie9HAAgvY9AXl4in9OYlK
H1dU1HqRyIsl2SIpBUW1UVNYcNxL2WvwRfvgAvRJo79eWO4cqXohVjF08JNkfN/x
tQB9rg555c40nOAwztbjtuk5Jyuy9s3bEJZE1UFpbfTBqO851XZZgLa7u2cj7yfN
YPSxELLnwUDk1NVO+dSUsmVPdY9ziw2DYlUFGiHl+QCBOuKArF67PbiTGf7YvuS3
fE6xRNgJzcR1gWHd9evr1CoQhFiSoqc60Xs/ywIDAQABAoIBADbV8/XMvnRenfhM
Y+Hc6GpL8M7Mqz9JhfGsezyJyvRUGaOILfAvO9PNFemq8oQv5W5djquAn/QI8M5x
j9p6g4SXdBQ6ABVEN+fdO5zteO8UiTUyMtoNYOdFJe/0PYg9w3PuzpoiolEvRqDV
rAgglzwAFF78An5K+/n7/TWuyt4aeKG4lcpk6slxmSTuNLMXcDxLBT6XesW72v8p
hAZI3W37Jc0NKr+abnl3OezjFWjVDMKtRfY+4cxdWWS4JH8vs8xZia7mwfrSkRZ2
Gv9z8rDfOzUOjxdtIB+4C3XUfnFFySTYUzSv6cS8KLIlHvp83/PR3wAcGlTbusmZ
n3Dg5EECgYEA/vXjzrnjcMl2Z6RBMkxcc9KefuC/fZArROAf5s2F0vTMLEGICXgV
mUm5lh160TPUoBGA0drqTSSvev5Bh530BNSMMdyuJuJlJBDQGJVR6OGIV2NcnO9k
j8wI4b7ucerIBu2b9VQIN/W33OS+01Gf6WXqwg1w9MgALkIAZNeZnFECgYEAwWXt
yqJGt67Gvay30pOGPp8mSfoS4gS7Gm76hs0i/8Oi/JLuoSEqOKCDuJoFP7xrAVTN
TyvbWvV+CTQk+C9Gq/kjiC0qNTQg5jnYofbDzRi2zu4yT2YGVJYhuOyVOBLdN87n
c2oQb4f1J79CQ2/j1tyKcNl6UQp/TwmTJWls/1sCgYBGPGrDWkYjnfw2VPN47bxS
U+VBwpw99OdWk/91z4xcLv/H+U2GfkRE9CBiEEDzPLoIVooMRahiFAcbdMuMlqDQ
a9UrL0XyhE+kfdU10Hy+ENNEb6TlvrUPP//6YGTDkRAFiJN8I+gXsmMyQPmosUXC
QEdJqfZCGI6kL554KUSx4QKBgG039hGQkWVcY8psRye5vn+Q+1udyZow18V21S7Z
nKFaR6piBDek9iYiqCDRgpNbAgcvb/79IpT8vN/Pve0XLc8jFOjrsMF5HfdGxcu6
AxvJkDvOk0T5tiuA2ayIl0CijqHczCMGzB9gZZe70F0rTD1kMR7IAubPidQF8T6Y
ikCvAoGBAJoYO9mO7KQl6fQbRFQ5jKFR43BcINgfz+xFRDKv40ii/dHD3zumNsz3
DPaZrWtrcsAofYhuvYLEdmGM8TGmsxmJRtrHQTBz2WqXWD7qHRiy3M/Z5jU/9DpB
3/1jgn2Em4GSuq1qQyZV7IxdfiSm/9swLOxwA2mPLdfh39oQ5YGh
-----END RSA PRIVATE KEY-----`
  const config = {
    entryPoint,
    issuer,
    cert,
    privateCert,
    skipRequestCompression: true,
    signPostMessages: true,
    authnRequestBinding: 'HTTP-POST'
  }
  return passport
    .use(new Strategy(config, (profile, done) => console.log(profile) && done()))
    .authenticate('saml', { failureRedirect: '/', failureFlash: true })
}
module.exports = samlMiddleware
