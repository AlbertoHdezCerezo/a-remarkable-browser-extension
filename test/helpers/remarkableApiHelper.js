import {expect, jest} from '@jest/globals'
import {CONFIGURATION} from '../../src/lib/remarkableApi'

export function mockDeviceRequest(
	devicePayload,
	deviceToken = global.remarkableDeviceToken,
	fetchBasedHttpClientPostMock = jest.fn()
) {
	fetchBasedHttpClientPostMock
		.mockImplementationOnce((...args) => {
			expect(args[0]).toEqual(CONFIGURATION.endpoints.token.v2.endpoints.device)
			expect(args[1]).toEqual(devicePayload)

			return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(deviceToken)})
		})

	return fetchBasedHttpClientPostMock
}

export function mockSessionRequest(
	deviceToken = global.remarkableDeviceToken,
	sessionToken = global.global.remarkableSessionToken,
	fetchBasedHttpClientPostMock = jest.fn()
) {
	fetchBasedHttpClientPostMock
		.mockImplementationOnce((...args) => {
			expect(args[0]).toEqual(CONFIGURATION.endpoints.token.v2.endpoints.user)
			expect(args[1]).toEqual(null)
			expect(args[2]).toEqual({'Authorization': `Bearer ${deviceToken}`})

			return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(sessionToken)})
		})

	return fetchBasedHttpClientPostMock
}

export function mockUploadRequest(
	uploadBuffer,
	uploadContentType,
	uploadRmMetaHeader,
	uploadDocumentChecksum,
	fetchBasedHttpClientPostMock = jest.fn(),
	session = global.remarkableApiSession
) {
	fetchBasedHttpClientPostMock
		.mockImplementationOnce((...args) => {
			expect(args[0]).toEqual(CONFIGURATION.endpoints.doc.v2.endpoints.files)
			expect(args[1]).toEqual(uploadBuffer)
			expect(args[2]).toEqual({
				'Authorization': `Bearer ${session.token}`,
				'content-type': uploadContentType,
				'rm-meta': uploadRmMetaHeader,
				'rm-source': 'RoR-Browser'
			})

			return Promise.resolve({ok: true, status: 200, json: () => Promise.resolve({ hash: uploadDocumentChecksum })})
		})

	return fetchBasedHttpClientPostMock
}

export function mockDocumentRequest(
	documentChecksum,
	documentHashEntriesPayload,
	documentMetadataChecksum,
	documentMetadata,
	fetchBasedHttpClientGetMock = jest.fn(),
	session = global.remarkableApiSession,
	rootMetadata = global.rootMetadata,
	rootHashChecksum = global.rootHashChecksum,
	rootHashEntriesPayload = global.rootHashEntriesPayload
) {
	mockRootRequest(
		fetchBasedHttpClientGetMock,
		session,
		rootMetadata,
		rootHashChecksum,
		rootHashEntriesPayload
	)
		.mockImplementationOnce((...args) => {
			expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + documentChecksum)
			expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

			return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(documentHashEntriesPayload)})
		})
		.mockImplementationOnce((...args) => {
			expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + documentMetadataChecksum)
			expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

			return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(JSON.stringify(documentMetadata))})
		})

	return fetchBasedHttpClientGetMock
}

export function mockRootRequest(
	fetchBasedHttpClientGetMock = jest.fn(),
	session = global.remarkableApiSession,
	rootMetadata = global.rootMetadata,
	rootHashChecksum = global.rootHashChecksum,
	rootHashEntriesPayload = global.rootHashEntriesPayload
) {
	fetchBasedHttpClientGetMock
		.mockImplementationOnce((...args) => {
			expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.root)
			expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

			return Promise.resolve({ok: true, status: 200, json: () => Promise.resolve(rootMetadata)})
		})
		.mockImplementationOnce((...args) => {
			expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + rootHashChecksum)
			expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

			return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(rootHashEntriesPayload)})
		})

	return fetchBasedHttpClientGetMock
}

export function mockDocumentMetadataRequest(
	documentMetadataChecksum,
	documentMetadata,
	fetchBasedHttpClientGetMock = jest.fn(),
	session = global.remarkableApiSession,
) {
	fetchBasedHttpClientGetMock
		.mockImplementationOnce((...args) => {
			expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + documentMetadataChecksum)
			expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

			return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(JSON.stringify(documentMetadata))})
		})

	return fetchBasedHttpClientGetMock
}