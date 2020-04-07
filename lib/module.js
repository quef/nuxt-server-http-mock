import nock from 'nock'
import bodyParser from 'body-parser'

const jsonParser = bodyParser.json()

export default function ServerHttpRequestMock(moduleOptions) {
  const options = Object.assign({
    prefix: '_mock',
    debug: false
  }, moduleOptions)

  this.addServerMiddleware({
    path: `${options.prefix}/start`,
    handler: (req, res, next) => {
      // Ensure no pending mock is active
      nock.cleanAll()
      if (options.debug) {
        console.log('Start mocking server-side http requests...')
      }
      res.end('Ok')
    }
  })

  this.addServerMiddleware({
    path: `${options.prefix}/stop`,
    handler: (req, res, next) => {
      const activeMocks = nock.activeMocks()
      if (options.debug) {
        if (activeMocks.length > 0) {
          console.error('Stop mocking... There are stille active mocks: %j', activeMocks)
        } else {
          console.info('Stop mocking... All mocks have been called. Good job!')
        }
      }
      nock.cleanAll()
      res.end('Ok')
    }
  })

  this.addServerMiddleware({
    path: `${options.prefix}/mocks`,
    handler: (req, res, next) => {
      if (req.method !== 'POST') {
        return next()
      }
      jsonParser(req, res, () => {
        const {
          method,
          url,
          status,
          response
        } = req.body
        if (options.debug) {
          console.log(`Mocking: ${method} ${url}`)
        }
        const urlParams = new URL(url)
        nock(`${urlParams.protocol}//${urlParams.hostname}`)
            .intercept(urlParams.pathname, method)
            .reply(status, response)
        res.end('Ok')
      })
    }
  })
}
