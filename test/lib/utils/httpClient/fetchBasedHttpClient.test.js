import FetchBasedHttpClient from '../../../../src/lib/utils/httpClient/httpsBasedHttpClient'
import { setupHttpRecording } from '../../../helpers/pollyHelper'

describe('FetchBasedHttpClient', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe('.get', () => {
    it('performs HTTP get request', async () => {
      const response = await FetchBasedHttpClient.get('jsonplaceholder.typicode.com/todos/1')

      expect(response.ok).toBeTruthy()
    })
  })

  describe('.post', () => {
    it('performs HTTP post request', async () => {
      const response = await FetchBasedHttpClient.post('jsonplaceholder.typicode.com/todos', {
        title: 'foo',
        completed: false,
        userId: 1
      })

      expect(response.ok).toBeTruthy()
    })
  })

  describe('.put', () => {
    it('performs HTTP put request', async () => {
      const response = await FetchBasedHttpClient.put('jsonplaceholder.typicode.com/todos/1', {
        id: 1,
        title: 'foo',
        completed: false,
        userId: 1
      })

      expect(response.ok).toBeTruthy()
    })
  })

  describe('.patch', () => {
    it('performs HTTP patch request', async () => {
      const response = await FetchBasedHttpClient.patch('jsonplaceholder.typicode.com/todos/1', {
        id: 1,
        title: 'foo',
        completed: false,
        userId: 1
      })

      expect(response.ok).toBeTruthy()
    })
  })

  describe('.delete', () => {
    it('performs HTTP delete request', async () => {
      const response = await FetchBasedHttpClient.delete('jsonplaceholder.typicode.com/todos/1')

      expect(response.ok).toBeTruthy()
    })
  })
})
