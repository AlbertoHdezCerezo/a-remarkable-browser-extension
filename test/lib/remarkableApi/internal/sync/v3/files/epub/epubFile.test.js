import {setupHttpRecording} from '../../../../../../../helpers/pollyHelper'
import DeviceConnection from '../../../../../../../../src/lib/remarkableApi/deviceConnection'
import Session from '../../../../../../../../src/lib/remarkableApi/session'
import Root from '../../../../../../../../src/lib/remarkableApi/internal/sync/root'
import EpubFile, {
	EpubIncompatibleHashEntriesError
} from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/files/epub/epubFile'
import {HashEntriesFactory} from '../../../../../../../../src/lib/remarkableApi/internal/schemas/index'

describe('EpubFile', () => {
	describe('#moveToTrash', () => {
		it('moves the PDF file to trash', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const epubHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.epubFileId)
			const epubFile = await EpubFile.fromHashEntry(root, epubHashEntry, session)

			const trashedEpubFile = await epubFile.moveToTrash(session)

			expect(trashedEpubFile).toBeInstanceOf(EpubFile)
			expect(trashedEpubFile.metadata.folderId).toBe('trash')
		})
	})
})