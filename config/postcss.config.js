/**
 * Learn more about plugin needs:
 * https://tailwindcss.com/docs/using-with-preprocessors
 */
module.exports = {
	syntax: 'postcss-scss',
	plugins: [
		// Easy importing of local, node or web CSS files
		// (!) SET THIS PLUGIN ALWAYS FIRST
		// https://github.com/postcss/postcss-import
		require('postcss-import'),
		// Imports TailwindCSS
		require('tailwindcss')('./config/tailwind.config.js'),
		// Fixes bugs associated to flexboxes in different web browsers
		// https://www.npmjs.com/package/postcss-flexbugs-fixes
		require('postcss-flexbugs-fixes'),
		// Babel-like library for CSS: convert modern CSS into something most browsers can understand, determining the polyfills you need based on your targeted browsers or runtime environments.
		// https://github.com/csstools/postcss-preset-env
		require('postcss-preset-env')({
			autoprefixer: {
				flexbox: 'no-2009'
			},
			stage: 3
		}),
		// Plugin to parse CSS and add vendor prefixes to CSS rules using values from Can I Use.
		// https://github.com/postcss/autoprefixer
		require('autoprefixer')
	]
}
