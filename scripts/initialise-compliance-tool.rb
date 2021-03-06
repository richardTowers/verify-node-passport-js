#!/usr/bin/env ruby

require 'uri'
require 'net/http'
require 'json'

environment = ARGV[0]
environments = {
  'local' => URI('http://localhost:50270/rp-test-data'),
  'reference' => URI('https://compliance-tool-reference.ida.digital.cabinet-office.gov.uk/rp-test-data')
}
compliance_tool_url = environments.fetch(environment) {
  puts "Usage #{$0} (#{environments.keys.join('|')})"
  exit 1
}

settings = {
  serviceEntityId: "https://verify-passport/service",
  assertionConsumerServiceUrl: "http://localhost:3000/saml/consume",
  signingCertificate: "MIICujCCAaICCQCfIsTbKZvPjTANBgkqhkiG9w0BAQsFADAfMR0wGwYDVQQDFBR0ZXN0X3ByaW1hcnlfc2lnbmluZzAeFw0xNzA0MjgxMDE5MDNaFw0xNzA1MjgxMDE5MDNaMB8xHTAbBgNVBAMUFHRlc3RfcHJpbWFyeV9zaWduaW5nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwJzklS49+k6RstAB86mJRykDMX8388WRIEbdr1Yvqs8nbZkdgSCgvOskA2oeOnusOaryNijTQJToeW7P5VwJwb+93K8ie9HAAgvY9AXl4in9OYlKH1dU1HqRyIsl2SIpBUW1UVNYcNxL2WvwRfvgAvRJo79eWO4cqXohVjF08JNkfN/xtQB9rg555c40nOAwztbjtuk5Jyuy9s3bEJZE1UFpbfTBqO851XZZgLa7u2cj7yfNYPSxELLnwUDk1NVO+dSUsmVPdY9ziw2DYlUFGiHl+QCBOuKArF67PbiTGf7YvuS3fE6xRNgJzcR1gWHd9evr1CoQhFiSoqc60Xs/ywIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQBd/IHFTxN8pxI1Cl+uGpKsPqw7g6/D9IeM9usIQejxnr02FGkxw9l00zgSoQgAVUDjOUNtvEJ6EaWJT9YTYfx19lIi1wV1kb4hsEkscTWEl5coP3mbpTEZvaQddbbXQIavcy8+X8VoWhjjqL4Ww0auqV4ksLwO+bpDKtL6x3Q+G2EBs1cwva3ONfLxFxw/fSJ1etJITTL+PU+kzy/e0kuBrios5K/iVxYIbrw8lGhCRfPV9q4RvlQGYugWeWUlpfBvBGOlSP892R8oTpcyDRktqxQP7IKt1J0lt8Kpz5SsMiRwUvIqhgvD6NYFSaMuT0Yc5k5ej5BHDhTA1eRqAwD8",
  encryptionCertificate: "MIICujCCAaICCQCfIsTbKZvPjTANBgkqhkiG9w0BAQsFADAfMR0wGwYDVQQDFBR0ZXN0X3ByaW1hcnlfc2lnbmluZzAeFw0xNzA0MjgxMDE5MDNaFw0xNzA1MjgxMDE5MDNaMB8xHTAbBgNVBAMUFHRlc3RfcHJpbWFyeV9zaWduaW5nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwJzklS49+k6RstAB86mJRykDMX8388WRIEbdr1Yvqs8nbZkdgSCgvOskA2oeOnusOaryNijTQJToeW7P5VwJwb+93K8ie9HAAgvY9AXl4in9OYlKH1dU1HqRyIsl2SIpBUW1UVNYcNxL2WvwRfvgAvRJo79eWO4cqXohVjF08JNkfN/xtQB9rg555c40nOAwztbjtuk5Jyuy9s3bEJZE1UFpbfTBqO851XZZgLa7u2cj7yfNYPSxELLnwUDk1NVO+dSUsmVPdY9ziw2DYlUFGiHl+QCBOuKArF67PbiTGf7YvuS3fE6xRNgJzcR1gWHd9evr1CoQhFiSoqc60Xs/ywIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQBd/IHFTxN8pxI1Cl+uGpKsPqw7g6/D9IeM9usIQejxnr02FGkxw9l00zgSoQgAVUDjOUNtvEJ6EaWJT9YTYfx19lIi1wV1kb4hsEkscTWEl5coP3mbpTEZvaQddbbXQIavcy8+X8VoWhjjqL4Ww0auqV4ksLwO+bpDKtL6x3Q+G2EBs1cwva3ONfLxFxw/fSJ1etJITTL+PU+kzy/e0kuBrios5K/iVxYIbrw8lGhCRfPV9q4RvlQGYugWeWUlpfBvBGOlSP892R8oTpcyDRktqxQP7IKt1J0lt8Kpz5SsMiRwUvIqhgvD6NYFSaMuT0Yc5k5ej5BHDhTA1eRqAwD8",
  expectedPID: "bob",
  matchingServiceEntityId: "https://verify-passport/msa",
  matchingServiceSigningPrivateKey: "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDAnOSVLj36TpGy0AHzqYlHKQMxfzfzxZEgRt2vVi+qzydtmR2BIKC86yQDah46e6w5qvI2KNNAlOh5bs/lXAnBv73cryJ70cACC9j0BeXiKf05iUofV1TUepHIiyXZIikFRbVRU1hw3EvZa/BF++AC9Emjv15Y7hypeiFWMXTwk2R83/G1AH2uDnnlzjSc4DDO1uO26TknK7L2zdsQlkTVQWlt9MGo7znVdlmAtru7ZyPvJ81g9LEQsufBQOTU1U751JSyZU91j3OLDYNiVQUaIeX5AIE64oCsXrs9uJMZ/ti+5Ld8TrFE2AnNxHWBYd316+vUKhCEWJKipzrRez/LAgMBAAECggEANtXz9cy+dF6d+Exj4dzoakvwzsyrP0mF8ax7PInK9FQZo4gt8C87080V6aryhC/lbl2Oq4Cf9AjwznGP2nqDhJd0FDoAFUQ35907nO147xSJNTIy2g1g50Ul7/Q9iD3Dc+7OmiKiUS9GoNWsCCCXPAAUXvwCfkr7+fv9Na7K3hp4obiVymTqyXGZJO40sxdwPEsFPpd6xbva/ymEBkjdbfslzQ0qv5pueXc57OMVaNUMwq1F9j7hzF1ZZLgkfy+zzFmJrubB+tKRFnYa/3PysN87NQ6PF20gH7gLddR+cUXJJNhTNK/pxLwosiUe+nzf89HfABwaVNu6yZmfcODkQQKBgQD+9ePOueNwyXZnpEEyTFxz0p5+4L99kCtE4B/mzYXS9MwsQYgJeBWZSbmWHXrRM9SgEYDR2upNJK96/kGHnfQE1Iwx3K4m4mUkENAYlVHo4YhXY1yc72SPzAjhvu5x6sgG7Zv1VAg39bfc5L7TUZ/pZerCDXD0yAAuQgBk15mcUQKBgQDBZe3Koka3rsa9rLfSk4Y+nyZJ+hLiBLsabvqGzSL/w6L8ku6hISo4oIO4mgU/vGsBVM1PK9ta9X4JNCT4L0ar+SOILSo1NCDmOdih9sPNGLbO7jJPZgZUliG47JU4Et03zudzahBvh/Unv0JDb+PW3Ipw2XpRCn9PCZMlaWz/WwKBgEY8asNaRiOd/DZU83jtvFJT5UHCnD3051aT/3XPjFwu/8f5TYZ+RET0IGIQQPM8ughWigxFqGIUBxt0y4yWoNBr1SsvRfKET6R91TXQfL4Q00RvpOW+tQ8///pgZMOREAWIk3wj6BeyYzJA+aixRcJAR0mp9kIYjqQvnngpRLHhAoGAbTf2EZCRZVxjymxHJ7m+f5D7W53JmjDXxXbVLtmcoVpHqmIEN6T2JiKoINGCk1sCBy9v/v0ilPy838+97RctzyMU6OuwwXkd90bFy7oDG8mQO86TRPm2K4DZrIiXQKKOodzMIwbMH2Bll7vQXStMPWQxHsgC5s+J1AXxPpiKQK8CgYEAmhg72Y7spCXp9BtEVDmMoVHjcFwg2B/P7EVEMq/jSKL90cPfO6Y2zPcM9pmta2tywCh9iG69gsR2YYzxMaazGYlG2sdBMHPZapdYPuodGLLcz9nmNT/0OkHf/WOCfYSbgZK6rWpDJlXsjF1+JKb/2zAs7HADaY8t1+Hf2hDlgaE="
}

compliance_tool_request = Net::HTTP::Post.new(compliance_tool_url.path, 'Content-Type' => 'application/json')
compliance_tool_request.body = settings.to_json
compliance_tool_response = Net::HTTP.start(compliance_tool_url.hostname, compliance_tool_url.port, use_ssl: compliance_tool_url.scheme == 'https') { |http|
  http.request(compliance_tool_request)
}

if compliance_tool_response.response.code == '200'
  puts 'Initialised successfully'
  exit 0
else
  puts 'Error initialising compliance tool:'
  puts compliance_tool_response.body
end
