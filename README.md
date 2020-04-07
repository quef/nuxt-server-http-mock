# Mock server-side HTTP requests in Nuxt
This Nuxt module will help you mocking server-side HTTP requests.
It uses [Nock](https://github.com/nock/nock) for mocking HTTP requests.

**Warning:** This module is for testing purpose. Do not use it in a production environment!

## Setup
Install with npm:
```
npm install quef/nuxt-server-http-mock --save-dev
```
Install with yarn:
```
yarn add quef/nuxt-server-http-mock --dev
```

Edit `nuxt.config.js`:

```
modules: [
  ... !production ? ['nuxt-server-http-mock'] : [] // Only for non-production environments
],

```


## Quick Start

