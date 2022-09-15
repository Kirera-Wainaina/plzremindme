const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        app: path.join(__dirname, 'frontend/src/index.js'),
        // adminApp: path.join(__dirname, 'frontend/src/admin.js')
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'frontend/js'),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    }
}