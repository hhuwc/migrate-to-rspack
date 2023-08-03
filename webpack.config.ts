
import { EntryPlugin, EntryOptionPlugin, Compiler, library, Configuration, Chunk } from 'webpack'
import path  from "path";
import { Resolver } from 'enhanced-resolve'

const loader = require.resolve("./webpack-loader")

class DynamicEntryPlugin {
	private compiler: Compiler
	apply(compiler: Compiler) {
		this.compiler = compiler
		new library.EnableLibraryPlugin('umd').apply(compiler)

		// loader作为entry，webpack没有资源路径
		// entry-1 entry-2 打包成一个lib
		this.makeUMDEntry(`${loader}?entry=entry-1&entry=entry-2!`, "xhs-lib-1.js", "XHS_LIB_1")
		// entry-3 打包成一个lib
		this.makeUMDEntry(`${loader}?entry=entry-3!`, "xhs-lib-2.js", "XHS_LIB_2")
	}
    
	makeUMDEntry(url: string, filename: string, libraryName: string) {
		const entryOption = EntryOptionPlugin.entryDescriptionToOptions(this.compiler, filename, {
			import: [url],
			filename, // 输出的文件名
			library: { name: libraryName, type: 'umd', },
		})
		new EntryPlugin(this.compiler.context, url, entryOption).apply(this.compiler);
	}
}

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


module.exports =  {
	cache: false,
	context: __dirname,
	entry: {}, // 由plugin 动态创建
	resolve: {
		plugins: [
			new ResolvePlugin()
		] as unknown as any,
	},
	output: {
		clean: true,
		path: path.resolve(__dirname, "dist/webpack") ,
		globalObject: 'globalThis',
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
	plugins: [
		new DynamicEntryPlugin(),
	]
} as Configuration;
