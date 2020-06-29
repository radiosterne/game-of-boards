import CopyWebpackPlugin = require('copy-webpack-plugin');
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssWebpackPlugin from 'mini-css-extract-plugin';
import * as path from 'path';
import SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
import * as webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { AppNamesFile, getApps, ImportFile } from './ExportableApp';

const apps = getApps();

const importFile = new ImportFile('./Apps.ts');
const appNamesFile = new AppNamesFile('./AppNames.ts');

importFile.generate(apps);
appNamesFile.generate(apps);

type Environment = {
	analyze: boolean;
};

type WebpackOptions = {
	mode: 'development' | 'production',
	watch: boolean
};

module.exports = (env: Environment | undefined, options: WebpackOptions) => {
	const tsChecker = options.watch ?
		new ForkTsCheckerWebpackPlugin() :
		new ForkTsCheckerWebpackPlugin({
			eslint: {
				files: './**/*.{ts,tsx}',
				enabled: true
			}
		});

	let config: webpack.Configuration = {
		context: __dirname,
		stats: 'errors-only',
		entry: './index.ts',
		output: {
			path: path.join(__dirname, 'bundles'),
			filename: 'bundle.js'
		},
		devtool: options.mode === 'development' ? 'inline-source-map' : undefined,
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: 'babel-loader',
					exclude: /node_modules/
				},
				{
					test: /\.css$/,
					use: [MiniCssWebpackPlugin.loader, 'css-loader']
				},
				{
					test: /\.(woff|woff2|svg|eot|ttf|png|jpg|gif)$/,
					use: [{
						loader: 'url-loader',
						options: {
							limit: 10000
						}
					}]
				},
				{
					test: /\.json$/,
					use: 'json-loader'
				}
			]
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.json'],
			alias: {
				'lodash$': 'lodash-es'
			}
		},
		externals: {
			'react': 'React',
			'react-dom': 'ReactDOM'
		},
		plugins: [
			tsChecker,
			new MiniCssWebpackPlugin({ filename: 'bundle.css' }),
			new CopyWebpackPlugin([
				{
					from: path.join(__dirname, 'node_modules', 'react', 'umd', 'react.production.min.js'),
					to: path.join(__dirname, 'bundles', 'lib', 'react.min.js')
				},
				{
					from: path.join(__dirname, 'node_modules', 'react-dom', 'umd', 'react-dom.production.min.js'),
					to: path.join(__dirname, 'bundles', 'lib', 'react-dom.min.js')
				},{
					from: path.join(__dirname, 'node_modules', 'react', 'umd', 'react.development.js'),
					to: path.join(__dirname, 'bundles', 'lib', 'react.js')
				},
				{
					from: path.join(__dirname, 'node_modules', 'react-dom', 'umd', 'react-dom.development.js'),
					to: path.join(__dirname, 'bundles', 'lib', 'react-dom.js')
				},
				{
					from: path.join(__dirname, 'serverShims.js'),
					to: path.join(__dirname, 'bundles', 'serverShims.js')
				}
			])
		]
	};

	if (env && env.analyze) {
		if (config.plugins) {
			config.plugins.push(new BundleAnalyzerPlugin());
			config.plugins.push(new webpack.debug.ProfilingPlugin());
		}

		config = new SpeedMeasurePlugin().wrap(config);
	}

	return config;
};