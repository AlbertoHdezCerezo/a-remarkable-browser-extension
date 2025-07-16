import FetchBasedHttpClient from '../../../../src/lib/utils/httpClient/httpsBasedHttpClient'
import { setupHttpRecording } from '../../../helpers/pollyHelper'
import HttpClientError from "../../../../src/lib/utils/httpClient/httpClientError.js";

describe('FetchBasedHttpClient', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe('.get', () => {
    it('performs HTTP get request', async () => {
      const response = await FetchBasedHttpClient.get('jsonplaceholder.typicode.com/todos/1')

      expect(response.ok).toBeTruthy()
    })

    it('if HTTP get request fails, it throws an error', async () => {
      try {
        await FetchBasedHttpClient.get('jsonplaceholder.typicode.com/todos/9999')
      } catch (error) {
        expect(error).toBeInstanceOf(HttpClientError)
        expect(error.statusCode).toBe(404)
        expect(error.request.method).toBe('GET')
        expect(error.request.url).toBe('https://jsonplaceholder.typicode.com/todos/9999')
        expect(error.response.headers).toBe(null)
      }
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

    it('if HTTP post request fails, it throws an error', async () => {
      try {
        await FetchBasedHttpClient.post('jsonplaceholder.typicode.com/todos/9999', {
          title: 'foo',
          completed: false,
          userId: 1
        })
      } catch (error) {
        expect(error).toBeInstanceOf(HttpClientError)
        expect(error.statusCode).toBe(404)
        expect(error.request.method).toBe('POST')
        expect(error.request.url).toBe('https://jsonplaceholder.typicode.com/todos/9999')
        expect(error.response.headers).toBe(null)
        expect(error.response.body).toBe({ title: 'foo', completed: false, userId: 1 })
      }
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

    it('if HTTP put request fails, it throws an error', async () => {
      try {
        await FetchBasedHttpClient.put('jsonplaceholder.typicode.com/todos/9999', {
          id: 1,
          title: 'foo',
          completed: false,
          userId: 1
        })
      } catch (error) {
        expect(error).toBeInstanceOf(HttpClientError)
        expect(error.statusCode).toBe(404)
        expect(error.request.method).toBe('PUT')
        expect(error.request.url).toBe('https://jsonplaceholder.typicode.com/todos/9999')
        expect(error.response.headers).toBe(null)
        expect(error.response.body).toEqual({
          id: 1,
          title: 'foo',
          completed: false,
          userId: 1
        })
      }
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

    it('if HTTP patch request fails, it throws an error', async () => {
      try {
        await FetchBasedHttpClient.patch('jsonplaceholder.typicode.com/todos/9999', {
          id: 1,
          title: 'foo',
          completed: false,
          userId: 1
        })
      } catch (error) {
        expect(error).toBeInstanceOf(HttpClientError)
        expect(error.statusCode).toBe(404)
        expect(error.request.method).toBe('PATCH')
        expect(error.request.url).toBe('https://jsonplaceholder.typicode.com/todos/9999')
        expect(error.response.headers).toBe(null)
        expect(error.response.body).toEqual({
          id: 1,
          title: 'foo',
          completed: false,
          userId: 1
        })
      }
    })
  })

  describe('.delete', () => {
    it('performs HTTP delete request', async () => {
      const response = await FetchBasedHttpClient.delete('jsonplaceholder.typicode.com/todos/1')

      expect(response.ok).toBeTruthy()
    })

    it('if HTTP delete request fails, it throws an error', async () => {
      try {
        await FetchBasedHttpClient.delete('jsonplaceholder.typicode.com/todos/9999')
      } catch (error) {
        expect(error).toBeInstanceOf(HttpClientError)
        expect(error.statusCode).toBe(404)
        expect(error.request.method).toBe('DELETE')
        expect(error.request.url).toBe('https://jsonplaceholder.typicode.com/todos/9999')
        expect(error.response.headers).toBe(null)
      }
    })
  })
})
