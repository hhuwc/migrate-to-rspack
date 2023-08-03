
import { LoaderContext } from 'webpack'
import path from 'path'

const parseQuery = (qs: string) => {
    return qs.replace("?", '').split("&")
        .map(i => i.includes("=") ? i.split("=") :[i, true])
        .reduce((ac: any, [key,val]: any) => {
            if (ac[key] == undefined ) {
                ac[key] = val
            } else { 
                ac[key] = [ac[key], val].flat()
            }
            return ac
        }, {})
}

function loader(this: LoaderContext<{ entry: string | string[] }>) {
    // const { entry } = this.getOptions()
    // QA-XHS
    // 1. loader 作为entry时, rspack getOptions 获取不到参数，这里只能用resourceQuery HACK
    // console.log(this.getOptions(), this.resourceQuery)
    const { entry } = parseQuery(this.resourceQuery)
    // console.log(entry)

    const entries = (Array.isArray(entry) ? entry : [entry])
        .map(js => `"${js}": () => require("${path.resolve(__dirname, "src", js)}")`)

    const code = `
    ;globalThis["entries"] = {
        a: 10,
        b: 20,
        c: 30,
    };
    export default {
        "lib-runtime": () => require("${path.resolve(__dirname, "src/lib-runtime.js",)}"),
        ${entries.join(",\n")}
    }
    `

    return code
}

module.exports = loader