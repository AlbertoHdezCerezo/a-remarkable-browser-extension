export const CONFIGURATION = {
	endpoints: {
		/**
		 * Endpoints used for reMarkable API
		 * authentication of devices and sessions
		 */
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
		 * Endpoints used by the reMarkable
		 * desktop applications to synchronize
		 * documents with the cloud and the
		 * reMarkable devices
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
				}
			}
		},
		/**
		 * Endpoints used by the reMarkable
		 * web services. Provide basic features
		 * to handle documents and folders
		 * through the web.
		 */
		doc: {
			v2: {
				endpoints: {
					/**
					 * Endpoint for fetching documents
					 */
					files: 'https://web.eu.tectonic.remarkable.com/doc/v2/files'
				}
			}
		}
	}
}