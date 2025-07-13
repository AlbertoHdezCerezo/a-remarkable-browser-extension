import Request from '../../../../src/lib/utils/http_client/request'

describe('Request', () => {
  describe('#construct', () => {
    it('returns a Request instance', () => {
      const request = new Request(
        "http://arbe.com/faq",
        "GET",
        { option: 'value' },
        { option: 'value' }
      )

      expect(request).toBeInstanceOf(Request)
    })

    it('coerces URL string to an URL compatible format', () => {
      expect(() => {
        new Request("arbe.com/faq")
      }).not.toThrow()
    })
  })

  describe('#url', () => {
    it('returns the URL of the request', () => {
      const request = new Request(
        "http://arbe.com/faq",
        "GET",
        { option: 'value' },
        { option: 'value' }
      )

      expect(request.url.href).toBe("http://arbe.com/faq")
    })
  })

  describe('#method', () => {
    it('returns the HTTP method of the request', () => {
      const request = new Request(
        "http://arbe.com/faq",
        "GET",
        { option: 'value' },
        { option: 'value' }
      )

      expect(request.method).toBe("GET")
    })
  })

  describe('#headers', () => {
    it('returns the headers of the request', () => {
      const request = new Request(
        "http://arbe.com/faq",
        "GET",
        { option: 'value' },
        { option: 'value' }
      )

      expect(request.headers).toEqual({ option: 'value' })
    })
  })

  describe('#rawBody', () => {
    it('returns the raw body of the request', () => {
      const request = new Request(
        "http://arbe.com/faq",
        "GET",
        { option: 'value' },
        { option: 'value' }
      )

      expect(request.rawBody).toEqual({ option: 'value' })
    })
  })

  describe('#body', () => {
    it('returns the body of the request in a serializer format', () => {
      const request = new Request(
        "http://arbe.com/faq",
        "GET",
        { option: 'value' },
        { option: 'value' }
      )

      expect(request.body).toEqual(JSON.stringify({ option: 'value' }))
    })
  })
})
