export const CONFIGURATION = {
	endpoints: {
		/**
		 * Configuration for the reMarkable API
		 * sync endpoint, responsible for file
		 * management and synchronization
		 */
		sync: {
			v3: {
				endpoints: {
					/**
					 * Endpoint for fetching sync root hash.
					 */
					root: 'https://eu.tectonic.remarkable.com/sync/v3/root',
					/**
					 * Endpoint for fetching file information.
					 */
					files: 'https://eu.tectonic.remarkable.com/sync/v3/files/'
				},
				types: {
					2: "collection"
				}
			}
		},
		doc: {
			v2: {
				endpoints: {
					/**
					 * Endpoint for uploading documents.
					 * (!) Used by the official reMarkable browser extension
					 */
					files: 'https://internal.cloud.remarkable.com/doc/v2/files'
				}
			}
		}
	}
}