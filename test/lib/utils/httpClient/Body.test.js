import {Body} from '../../../../src/lib/utils/httpClient'

describe('Body', () => {
  describe('#raw_payload', () => {
    it('returns the raw payload', () => {
      const rawPayload = { key: 'value' }
      const body = new Body(rawPayload)
      expect(body.rawPayload).toEqual(rawPayload)
    })
  })

  describe('#payload', () => {
    it('if raw payload is an object, returns object as JSON', () => {
      const rawPayload = { key: 'value' }
      const body = new Body(rawPayload)
      expect(body.payload).toEqual(JSON.stringify(rawPayload))
    })

    it('if raw payload is a string, returns the string', () => {
      const rawPayload = 'This is a string payload'
      const body = new Body(rawPayload)
      expect(body.payload).toEqual(rawPayload)
    })

    it('if raw payload is an Buffer, returns the Buffer', () => {
      const rawPayload = Buffer.from('{ foo: "bar" }')
      const body = new Body(rawPayload)
      expect(body.payload).toEqual(rawPayload)
    })

    it('if raw payload is an ArrayBuffer, returns the ArrayBuffer', () => {
      const rawPayload = (new TextEncoder().encode('{ foo: "bar" }')).buffer
      const body = new Body(rawPayload)
      expect(body.payload).toEqual(rawPayload)
    })
  })
})
