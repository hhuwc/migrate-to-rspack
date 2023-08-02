import { Configuration } from '@rspack/core';
import path from "path";

const loader = require.resolve("./rspack-loader")

module.exports = {
	cache: false,
	context: __dirname,
	// QA-XHS: 
	// 1. 是否支持 webpack 那样的dynamic entry plugin，而不是在entry里面通过配置声明？
	// 2. rspack中entry 必须指定资源文件，否则会报错，这里我只好用当前代替，这个是否可以对齐webpack?
	entry: {
		"xhs-lib-1": {
			import: `${loader}?entry=entry-1&entry=entry-2!${__filename}?entry=entry-1&entry=entry-2`,
		},
		"xhs-lib-2": {
			import: `${loader}?entry=entry-3!${__filename}?entry=entry-3`,
		}
	},
	output: {
		library: {
			type: 'umd',
			// QA-XHS: 
			// 1.这里只能定义一个library name, webpack 可以针对不同entry 使用不同的name，rspack需要如何支持?
			name: 'XHS_LIB'
		},
		clean: true,
		path: path.resolve(__dirname, "dist/rspack"),
		globalObject: 'globalThis',
		filename: "[name].js"
	},
	devtool: false,
	optimization: {
		runtimeChunk: {
			name: "runtime"
		},
		splitChunks: {
			chunks: "initial",
			minSize: 0,
			name: 'chunk',
		}
	},
} as Configuration
