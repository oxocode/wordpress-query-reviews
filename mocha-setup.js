// Set up environment for Mocha tests.
require('babel-register');

// Shim the global SiteSettings.
global.SiteSettings = {
	endpoint: 'http://localhost/wp-json/',
	nonce: 'fake-nonce',
};
