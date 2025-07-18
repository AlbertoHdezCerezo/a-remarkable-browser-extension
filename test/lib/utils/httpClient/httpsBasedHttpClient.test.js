import HttpsBasedHttpClient from '../../../../src/lib/utils/httpClient/httpsBasedHttpClient'
import { setupHttpRecording } from '../../../helpers/pollyHelper'

describe('HttpsBasedHttpClient', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe('.get', () => {
    it('performs HTTP get request', async () => {
      const response = await HttpsBasedHttpClient.get('jsonplaceholder.typicode.com/todos/1')

      expect(response.ok).toBeTruthy()
    })
  })

  describe('.post', () => {
    it('performs HTTP post request', async () => {
      const response = await HttpsBasedHttpClient.post('jsonplaceholder.typicode.com/todos', {
        title: 'foo',
        completed: false,
        userId: 1
      })

      expect(response.ok).toBeTruthy()
    })
  })

  describe('.put', () => {
    it('performs HTTP put request', async () => {
      const response = await HttpsBasedHttpClient.put('jsonplaceholder.typicode.com/todos/1', {
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
      const response = await HttpsBasedHttpClient.patch('jsonplaceholder.typicode.com/todos/1', {
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
      const response = await HttpsBasedHttpClient.delete('jsonplaceholder.typicode.com/todos/1')

      expect(response.ok).toBeTruthy()
    })
  })
})
