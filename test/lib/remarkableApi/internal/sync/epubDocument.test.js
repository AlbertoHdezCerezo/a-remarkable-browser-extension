import DeviceConnection from '../../../../../src/lib/remarkableApi/deviceConnection'
import Session from '../../../../../src/lib/remarkableApi/session'
import HashEntries from '../../../../../src/lib/remarkableApi/internal/sync/hashEntries'
import HashEntry from '../../../../../src/lib/remarkableApi/internal/sync/hashEntry'
import EpubDocument, {EpubIncompatibleHashEntriesError} from '../../../../../src/lib/remarkableApi/internal/sync/epubDocument'
import {setupHttpRecording} from '../../../../helpers/pollyHelper'

describe('EpubDocument', () => {
	setupHttpRecording()

	describe('.fromHashEntry', () => {
		it('if given ePub file hash entry, returns a EpubDocument', async () => {
			const hashEntry = new HashEntry(global.epubRootHashEntryPayload)

			const session = await Session.from(new DeviceConnection(global.remarkableDeviceConnectionToken))

			const epubDocument = await EpubDocument.fromHashEntry(hashEntry, session)

			expect(epubDocument).toBeInstanceOf(EpubDocument)
		})

		it('if given non-ePub file hash entry, throws PdfIncompatibleHashEntriesError', async () => {
			const hashEntry = new HashEntry(global.pdfRootHashEntryPayload)

			const session = await Session.from(new DeviceConnection(global.remarkableDeviceConnectionToken))

			await expect(EpubDocument.fromHashEntry(hashEntry, session)).rejects.toThrow(EpubIncompatibleHashEntriesError)
		})
	})

	describe('.fromHashEntriesResemblingAnEpub', () => {
		it('if given hash entries resembles a ePub, returns a EpubDocument', async () => {
			const hashEntries = new HashEntries(global.epubHashEntriesPayload)

			const session = await Session.from(new DeviceConnection(global.remarkableDeviceConnectionToken))

			const ePubDocument = await EpubDocument.fromHashEntriesResemblingAnEpub(hashEntries, session)

			expect(ePubDocument).toBeInstanceOf(EpubDocument)
			expect(ePubDocument.fileId).toBe('008302bc-c5ba-41be-925b-8567166246e4')
			expect(ePubDocument.hashEntries).toBe(hashEntries)
			expect(ePubDocument.metadata).toBeDefined()
		})

		it('if given hash entries does not resemble a ePub, throws PdfIncompatibleHashEntriesError', async () => {
			const hashEntries = new HashEntries(
				'4\n' +
				'0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759\n' +
				'cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531\n' +
				'69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327\n' +
				'63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346\n' +
				'322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046'
			)

			const session = await Session.from(new DeviceConnection(global.remarkableDeviceConnectionToken))

			await expect(EpubDocument.fromHashEntriesResemblingAnEpub(hashEntries, session)).rejects.toThrow(EpubIncompatibleHashEntriesError)
		})
	})
})