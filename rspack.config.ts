import { Configuration } from '@rspack/core';
import path from "path";
import { Resolver } from 'enhanced-resolve'

const loader = require.resolve("./rspack-loader")

class ResolvePlugin {
    apply(resolver: Resolver) {
        resolver.getHook('file')
            .tapAsync('ResolvePlugin', async (request, contextResolver, callback) => {
                // @ts-ignore
                let issuer = request.context?.issuer || ''
                let target = request.path || ''
                console.log(`issuer: ${issuer}, target: ${target}`)
                return callback()
            })
    }
}

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
	resolve: {
        // QA-XHS: reslove 不支持配置插件
		// 1. webpack这里配置插件可以做一些导入限制，例如禁止某些文件去引用别的某些模块中文件
		// Unrecognized key(s) in object: 'plugins' at "resolve"
		plugins: [new ResolvePlugin()]
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
