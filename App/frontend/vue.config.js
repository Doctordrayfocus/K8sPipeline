const path = require("path");
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
	runtimeCompiler: true,
	css: {
		loaderOptions: {
			sass: {
				additionalData: `
         @import '@/application/assets/styles/global.scss';
        `
			}
		}
	},

	configureWebpack: {
		plugins: [
			new CircularDependencyPlugin({
				// exclude detection of files based on a RegExp
				exclude: /a\.js|node_modules/,
				// include specific files based on a RegExp
				include: /dir/,
				// add errors to webpack instead of warnings
				failOnError: true,
				// allow import cycles that include an asyncronous import,
				// e.g. via import(/* webpackMode: "weak" */ './file.js')
				allowAsyncCycles: false,
				// set the current working directory for displaying module paths
				cwd: process.cwd(),
			})
		],
    mode: "production",
    devtool: 'cheap-module-source-map',
		resolve: {
			alias: {
				"@/*": path.resolve(__dirname, "./src"),
				vue: path.resolve('./node_modules/vue')
			},
			extensions: ['.js', '.vue', '.json', '.ts']
		}
	}
}
