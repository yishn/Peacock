const path = require('path')

module.exports = () => ({
    entry: './src/renderer/index.js',

    output: {
        filename: 'bundle.js',
        path: __dirname
    },

    devtool: 'source-map',

    target: 'electron-renderer',

    node: {
        __dirname: false
    },

    resolve: {
        alias: {
            'preact': path.join(__dirname, 'node_modules/preact/dist/preact.min')
        }
    }
})
