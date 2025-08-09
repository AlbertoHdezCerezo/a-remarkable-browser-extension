export const CONFIGURATION = {
	endpoints: {
		token: {
			v2: {
				endpoints: {
					/**
					 * Endpoint for fetching connection token to a reMarkable cloud account.
					 */
					device: 'https://webapp-prod.cloud.remarkable.engineering/token/json/2/device/new',
					/**
					 * Endpoint for fetching session token.
					 */
					user: 'https://webapp-prod.cloud.remarkable.engineering/token/json/2/user/new'
				}
			}
		},
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
		/**
		 * Configuration for the reMarkable API
		 * sync endpoint, responsible for file
		 * upload
		 */
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