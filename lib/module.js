import path from 'path'
import cookie from 'cookie'
import nock from 'nock'

export default function ServerHttpRequestMock(moduleOptions) {
  const options = Object.assign({
    mockDir: 'test/mocks',
    cookie: '_mock'
  }, moduleOptions)
  const mockDirectory = path.join(this.options.rootDir, options.mockDir)
  this.addServerMiddleware({
    path: '/',
    handler: async(req, res, next) => {
      const cookies = cookie.parse(req.headers.cookie || '')
      // If no cookie, there is nothing to mock
      if (cookies[options.cookie]) {
        const mockPath = path.join(mockDirectory, cookies[options.cookie])
        const mock = await import(mockPath)
        nock.cleanAll() // Ensure no pending mock are activated
        mock.default()
      }
      next()
    }
  })
}
