
import { LoaderContext } from 'webpack'
import path from 'path'

function loader(this: LoaderContext<{ entry: string | string[] }>) {
    const { entry } = this.getOptions()

    const entries = (Array.isArray(entry) ? entry : [entry])
        .map(js => `"${js}": () => require("${path.resolve(__dirname, "src", js)}")`)

    const code = `
    export default {
        "lib-runtime": () => require("${path.resolve(__dirname, "src/lib-runtime.js",)}"),
        ${entries.join(",\n")}
    }
    `
    // 结构如图所示
    // export default {
    //     "entry-1": () => require("项目地址/src/entry-1"),
    //     "entry-2": () => require("项目地址/src/entry-2")
    // }

    return code
}

module.exports = loader