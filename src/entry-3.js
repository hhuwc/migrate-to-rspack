const { config } = require('./common')

function test() {
    console.log("entry-3")
}

export default () => {
    test()
    console.log(__dirname, config)
}