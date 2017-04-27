Verify Node Passport JS
=======================

This is an expermient using [passport.js](https://github.com/jaredhanson/passport) and [passport-saml](https://github.com/bergie/passport-saml)
to integrate with [GOV.UK Verify](https://govuk-verify.cloudapps.digital/).


Status
------

This code is in the very early experimental stages. It is NOT in any way production ready or secure. This document will be updated as and
when the code reaches a more mature state.

Problems Identified
-------------------

* It doesn't look like there's good (any?) support for reading SAML metadata from an IdP - verify mandates that metadata is polled every 10 minutes
* The README of passport-saml implies that only SHA-1 can be used to sign AuthnRequests. Verify requires at least SHA-256.
